import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export interface TextToSpeechApgw2StackProps extends cdk.StackProps {
}

export class TextToSpeechApgw2Stack extends cdk.Stack {
  public constructor(scope: cdk.App, id: string, props: TextToSpeechApgw2StackProps = {}) {
    super(scope, id, props);

    // Resources
    const apiGatewayRestApi00agg6czs4o200S9kok = new apigateway.CfnRestApi(this, 'ApiGatewayRestApi00agg6czs4o200S9kok', {
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
    apiGatewayRestApi00agg6czs4o200S9kok.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.DELETE;

    const apiGatewayDeployment00zsbjnt001zj1s = new apigateway.CfnDeployment(this, 'ApiGatewayDeployment00zsbjnt001zj1s', {
      restApiId: apiGatewayRestApi00agg6czs4o200S9kok.ref,
    });
    apiGatewayDeployment00zsbjnt001zj1s.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.DELETE;

    const apiGatewayStage00dev00BRlwN = new apigateway.CfnStage(this, 'ApiGatewayStage00dev00BRlwN', {
      restApiId: apiGatewayRestApi00agg6czs4o200S9kok.ref,
      deploymentId: apiGatewayDeployment00zsbjnt001zj1s.attrDeploymentId,
      stageName: 'dev',
      cacheClusterSize: '0.5',
      tracingEnabled: false,
      cacheClusterEnabled: false,
    });
    apiGatewayStage00dev00BRlwN.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.DELETE;
  }
}
