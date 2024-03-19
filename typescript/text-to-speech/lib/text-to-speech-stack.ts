// これをCDKにしたもの
// https://explore.skillbuilder.aws/learn/course/11723/play/43328/build-a-serverless-text-to-speech-application-with-amazon-polly-amazon-japanese

import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';  
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class TextToSpeechStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const accountId = this.account;

    // Lambda Role
    const lambdaRole = new iam.Role(this, 'LabLambdaRole', {
      roleName: 'Lab-Lambda-Role',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.ServicePrincipal('dynamodb.amazonaws.com'),
        new iam.ServicePrincipal('apigateway.amazonaws.com')
      )
    });
    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));

    /**
     * Custom Policies
     */
    const lambdaExecutionPolicy = new iam.Policy(this, 'LambdaExecutionPolicy', {
      policyName: 'LambdaExecutionPolicy',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'polly:SynthesizeSpeech',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
            'sns:Publish',
            's3:PutObject',
            's3:PutObjectAcl',
            's3:GetBucketLocation',
          ],
          resources: ['*'],
        }),
      ],
    });
    lambdaRole.attachInlinePolicy(lambdaExecutionPolicy);

    /**
     * dynamodb
     */
    const table = new dynamodb.Table(this, 'posts', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /**
     * S3
     */
    const bucket = new s3.Bucket(this, 'audioposts-20240315', {
      versioned: false,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /**
     * SNS
     */
    const topic = new cdk.aws_sns.Topic(this, 'new_posts', {
      displayName: 'New posts',
      fifo: false,
    });
    
    /**
     * Lambda
     */
    const lambda_postreader_newpost = new Function(this, 'PostReader_NewPost', {
      runtime: Runtime.PYTHON_3_12,
      code: Code.fromAsset('lambda'),
      handler: 'post_reader_newpost.lambda_handler',
      environment: {
        'DB_TABLE_NAME': table.tableName,
        'SNS_TOPIC': topic.topicArn,
      },
      timeout: Duration.seconds(10),
      role: lambdaRole,
    });

    const lambda_convert_to_audio = new Function(this, 'ConvertToAudio', {
      runtime: Runtime.PYTHON_3_12,
      code: Code.fromAsset('lambda'),
      handler: 'convert_to_audio.lambda_handler',
      environment: {
        'DB_TABLE_NAME': table.tableName,
        'SNS_TOPIC': topic.topicArn,
        'BUCKET_NAME': bucket.bucketName
      },
      timeout: Duration.minutes(5),
      role: lambdaRole,
    });
    lambda_convert_to_audio.addEventSource(new cdk.aws_lambda_event_sources.SnsEventSource(topic));

    const lambda_postreader_getpost = new Function(this, 'PostReader_GetPost', {
      runtime: Runtime.PYTHON_3_12,
      code: Code.fromAsset('lambda'),
      handler: 'post_reader_getpost.lambda_handler',
      environment: {
        'DB_TABLE_NAME': table.tableName,
      },
      timeout: Duration.seconds(10),
      role: lambdaRole,
    });

    /**
     * API Gateway
     */
    const api = new apigateway.RestApi(this, 'PostReaderApi', {
      restApiName: 'PostReaderApi',
      description: 'API for PostReader Application',
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      deployOptions: {
        stageName: 'dev',
      },
    });

    // API Gateway - CROS
    const corsOptions = {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: ['GET','OPTIONS', 'POST'],
      allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      exposeHeaders: ['content-type', 'x-amz-date', 'authorization', 'x-api-key', 'x-amz-security-token', 'x-amz-user-agent'],
    };
    
    // デフォルトの4XXレスポンスにCORS設定を追加
    api.addGatewayResponse('Default4XX', {
      type: apigateway.ResponseType.DEFAULT_4XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'",
        'Access-Control-Allow-Headers': "'content-type'",
        'Access-Control-Allow-Methods': "'GET,POST,PUT,DELETE,OPTIONS,HEAD'"
      }
    });

    // デフォルトの5XXレスポンスにCORS設定を追加 
    api.addGatewayResponse('Default5XX', {
      type: apigateway.ResponseType.DEFAULT_5XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'",
        'Access-Control-Allow-Headers': "'content-type'",
        'Access-Control-Allow-Methods': "'GET,POST,PUT,DELETE,OPTIONS,HEAD'"
      }
    });
    //api.addGatewayResponse('Default4XX', {
    //  type: apigateway.ResponseType.DEFAULT_4XX,
    //  responseHeaders: corsOptions,
    //});

    // API Gateway - Methods
    api.root.addCorsPreflight(corsOptions);
    //api.root.addResource('item').addCorsPreflight(corsOptions);
    api.root.addMethod('POST', new apigateway.LambdaIntegration(lambda_postreader_newpost, {
      proxy: false,
      integrationResponses: [
        {
          statusCode: '200',
          responseTemplates: {
            'application/json': '',
          },
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
          },
        },
      ],
    }), {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
          },
          responseModels: {
            'application/json': apigateway.Model.EMPTY_MODEL,
          },
        },
      ],
    });

    api.root.addMethod('GET', new apigateway.LambdaIntegration(lambda_postreader_getpost, {
      proxy: false,
      requestTemplates: {
        'application/json': '{ "postId": "$input.params(\'postId\')" }',
      },
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      integrationResponses: [
        {
          statusCode: '200',
          responseTemplates: {
            'application/json': '',
          },
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
          },
        },
      ],
    }), {
      requestParameters: {
        'method.request.querystring.postId': false,
      },
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            //'method.response.header.Content-Type': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
          responseModels: {
            'application/json': apigateway.Model.EMPTY_MODEL,
          },
        },
      ],
    });

    /**
     * Static Web Site on S3
     */
    const website_bucket = new s3.Bucket(this, 'www-audioposts-20240315', {
      //publicReadAccess: true,
      //websiteIndexDocument: 'index.html',
      //websiteErrorDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: false,
    });

    // Upload files to S3
    new s3deploy.BucketDeployment(this, 'DeployFiles', {
      sources: [s3deploy.Source.asset('./files')],
      destinationBucket: website_bucket,
      include: ['index.html', 'scripts.js', 'style.css']
    });

    // OAC
    // https://github.com/aws/aws-cdk/issues/21771
    const cfnOriginAccessControl = new cloudfront.CfnOriginAccessControl(this, 'OriginAccessControl', {
      originAccessControlConfig: {
        name: 'OriginAccessControlForContentsBucket',
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
        description: 'Access Control',
      },
    });

    /**
     * CloudFront
     */
    // CloudFrontでS3バケットをホスト
    const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(website_bucket),
        //origin: new origins.S3Origin(website_bucket, {
        //  originAccessIdentity: new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity', {
        //    comment: 'Access identity for my S3 bucket',
        //  }),
        //}),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        compress: true,
        //smoothStreaming: false,
        //originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
      },
      defaultRootObject: 'index.html',
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3
    });

    const cfnDistribution = distribution.node.defaultChild as cloudfront.CfnDistribution;
    // OAI削除（勝手に設定されるため）
    cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity', '');
    // OAC設定
    cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', cfnOriginAccessControl.attrId);

    // S3 - BucketPolicy
    const contentsBucketPolicyStatement = new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: iam.Effect.ALLOW,
      principals: [
        new iam.ServicePrincipal('cloudfront.amazonaws.com'),
      ],
      resources: [`${website_bucket.bucketArn}/*`],
    });
    contentsBucketPolicyStatement.addCondition('StringEquals', {
      'AWS:SourceArn': `arn:aws:cloudfront::${accountId}:distribution/${distribution.distributionId}`
    })
    website_bucket.addToResourcePolicy(contentsBucketPolicyStatement);

    // S3バケットのポリシーを更新してCloudFrontからのアクセスを許可
    //website_bucket.addToResourcePolicy(new iam.PolicyStatement({
    //  actions: ['s3:GetObject'],
    //  resources: [website_bucket.arnForObjects('*')],
    //  effect: iam.Effect.ALLOW,
    //  principals: [new iam.CanonicalUserPrincipal(distribution.distribution.cloudFrontOriginAccessIdentity!.s3CanonicalUserId))],
    //}));

    // S3バケットのポリシーを更新してCloudFrontからのアクセスを許可
    //website_bucket.addToResourcePolicy(
    //  new iam.PolicyStatement({
    //    actions: ['s3:GetObject'],
    //    resources: [`${website_bucket.bucketArn}/*`],
    //    principals: [
    //      new iam.CanonicalUserPrincipal(distribution..distribution.cloudFrontOriginAccessIdentity!.s3CanonicalUserId),
    //    ],
    //  })
    //);

    // CloudFrontのドメイン名を出力
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'The Domain Name of the CloudFront Distribution',
    });
  }
}
