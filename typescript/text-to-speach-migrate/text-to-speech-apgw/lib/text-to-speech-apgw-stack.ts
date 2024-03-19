import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export interface TextToSpeechApgwStackProps extends cdk.StackProps {
}

export class TextToSpeechApgwStack extends cdk.Stack {
  public constructor(scope: cdk.App, id: string, props: TextToSpeechApgwStackProps = {}) {
    super(scope, id, props);

    // Resources
    const apiGatewayRestApi00agg6czs4o20076Huf = new apigateway.CfnRestApi(this, 'ApiGatewayRestApi00agg6czs4o20076HUF', {
      apiKeySourceType: 'HEADER',
      description: 'API for PostReader Application(Manual)',
      endpointConfiguration: {
        types: [
          'REGIONAL',
        ],
      },
      disableExecuteApiEndpoint: false,
      name: 'PostReaderApiManual',
    });
    apiGatewayRestApi00agg6czs4o20076Huf.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const apiGatewayDeployment00zsbjnt00fG0Ib = new apigateway.CfnDeployment(this, 'ApiGatewayDeployment00zsbjnt00fG0Ib', {
      restApiId: apiGatewayRestApi00agg6czs4o20076Huf.ref,
    });
    apiGatewayDeployment00zsbjnt00fG0Ib.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const apiGatewayStage00dev00iWnfk = new apigateway.CfnStage(this, 'ApiGatewayStage00dev00iWnfk', {
      restApiId: apiGatewayRestApi00agg6czs4o20076Huf.ref,
      deploymentId: apiGatewayDeployment00zsbjnt00fG0Ib.attrDeploymentId,
      stageName: 'dev',
      cacheClusterSize: '0.5',
      tracingEnabled: false,
      cacheClusterEnabled: false,
    });
    apiGatewayStage00dev00iWnfk.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;
  }
}
