# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## Warnings
### Write-only properties
Write-only properties are resource property values that can be written to but can't be read by AWS CloudFormation or CDK Migrate. For more information, see [IaC generator and write-only properties](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/generate-IaC-write-only-properties.html).


Write-only properties discovered during migration are organized here by resource ID and categorized by write-only property type. Resolve write-only properties by providing property values in your CDK app. For guidance, see [Resolve write-only properties](https://docs.aws.amazon.com/cdk/v2/guide/migrate.html#migrate-resources-writeonly).
### ApiGatewayDeployment00zsbjnt00fG0Ib
- **UNSUPPORTED_PROPERTIES**: 
  - StageDescription/ThrottlingRateLimit: The target request steady-state rate limit. For more information, see [Manage API Request Throttling](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html) in the *API Gateway Developer Guide*.
  - StageDescription/CacheClusterSize: The size of the stage's cache cluster. For more information, see [cacheClusterSize](https://docs.aws.amazon.com/apigateway/latest/api/API_CreateStage.html#apigw-CreateStage-request-cacheClusterSize) in the *API Gateway API Reference*.
  - StageDescription/CanarySetting/PercentTraffic: The percent (0-100) of traffic diverted to a canary deployment.
  - StageDescription/CachingEnabled: Indicates whether responses are cached and returned for requests. You must enable a cache cluster on the stage to cache responses. For more information, see [Enable API Gateway Caching in a Stage to Enhance API Performance](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html) in the *API Gateway Developer Guide*.
  - StageDescription/AccessLogSetting/DestinationArn: The Amazon Resource Name (ARN) of the CloudWatch Logs log group or Kinesis Data Firehose delivery stream to receive access logs. If you specify a Kinesis Data Firehose delivery stream, the stream name must begin with ``amazon-apigateway-``.
  - StageDescription/ClientCertificateId: The identifier of the client certificate that API Gateway uses to call your integration endpoints in the stage.
  - StageDescription/TracingEnabled: Specifies whether active tracing with X-ray is enabled for this stage.
 For more information, see [Trace API Gateway API Execution with X-Ray](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-xray.html) in the *API Gateway Developer Guide*.
  - StageDescription/DocumentationVersion: The version identifier of the API documentation snapshot.
  - StageDescription/CacheTtlInSeconds: The time-to-live (TTL) period, in seconds, that specifies how long API Gateway caches responses.
  - StageDescription/AccessLogSetting/Format: A single line format of the access logs of data, as specified by selected $context variables. The format must include at least ``$context.requestId``.
  - StageDescription/DataTraceEnabled: Indicates whether data trace logging is enabled for methods in the stage. API Gateway pushes these logs to Amazon CloudWatch Logs.
  - StageDescription/MethodSettings: Configures settings for all of the stage's methods.
  - StageDescription/CacheClusterEnabled: Specifies whether a cache cluster is enabled for the stage.
  - StageDescription/ThrottlingBurstLimit: The target request burst rate limit. This allows more requests through for a period of time than the target rate limit. For more information, see [Manage API Request Throttling](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html) in the *API Gateway Developer Guide*.
  - StageDescription/MetricsEnabled: Indicates whether Amazon CloudWatch metrics are enabled for methods in the stage.
  - StageDescription/Tags: An array of arbitrary tags (key-value pairs) to associate with the stage.
  - StageName: The name of the Stage resource for the Deployment resource to create.
This property can be replaced with other types
  - StageDescription/Description: A description of the purpose of the stage.
  - StageDescription/LoggingLevel: The logging level for this method. For valid values, see the ``loggingLevel`` property of the [MethodSetting](https://docs.aws.amazon.com/apigateway/latest/api/API_MethodSetting.html) resource in the *Amazon API Gateway API Reference*.
  - StageDescription/CacheDataEncrypted: Indicates whether the cached responses are encrypted.
  - StageDescription/CanarySetting/UseStageCache: A Boolean flag to indicate whether the canary deployment uses the stage cache or not.
### ApiGatewayRestApi00agg6czs4o20076HUF
- **UNSUPPORTED_PROPERTIES**: 
  - FailOnWarnings: A query parameter to indicate whether to rollback the API update (``true``) or not (``false``) when a warning is encountered. The default value is ``false``.
  - Body: An OpenAPI specification that defines a set of RESTful APIs in JSON format. For YAML templates, you can also provide the specification in YAML format.
This property can be replaced with other types
  - CloneFrom: The ID of the RestApi that you want to clone from.
  - BodyS3Location/Bucket: The name of the S3 bucket where the OpenAPI file is stored.
  - BodyS3Location/Key: The file name of the OpenAPI file (Amazon S3 object name).
  - Mode: This property applies only when you use OpenAPI to define your REST API. The ``Mode`` determines how API Gateway handles resource updates.
 Valid values are ``overwrite`` or ``merge``. 
 For ``overwrite``, the new API definition replaces the existing one. The existing API identifier remains unchanged.
  For ``merge``, the new API definition is merged with the existing API.
 If you don't specify this property, a default value is chosen. For REST APIs created before March 29, 2021, the default is ``overwrite``. For REST APIs created after March 29, 2021, the new API definition takes precedence, but any container types such as endpoint configurations and binary media types are merged with the existing API. 
 Use the default mode to define top-level ``RestApi`` properties in addition to using OpenAPI. Generally, it's preferred to use API Gateway's OpenAPI extensions to model these properties.
  - BodyS3Location/ETag: The Amazon S3 ETag (a file checksum) of the OpenAPI file. If you don't specify a value, API Gateway skips ETag validation of your OpenAPI file.
  - BodyS3Location/Version: For versioning-enabled buckets, a specific version of the OpenAPI file.
  - Parameters: Custom header parameters as part of the request. For example, to exclude DocumentationParts from an imported API, set ``ignore=documentation`` as a ``parameters`` value, as in the AWS CLI command of ``aws apigateway import-rest-api --parameters ignore=documentation --body 'file:///path/to/imported-api-body.json'``.
This property can be replaced with other types
