import { Stack, StackProps } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { HitCounter } from './hitcounter';

export class SampleAgwLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // define an AWS Lambda resource
    const hello = new Function(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_20_X, // execution environment
      code: Code.fromAsset('lambda'), // code loaded from "lambda" directory
      handler: 'hello.handler', // file is "hello", function is "handler"
    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello,
    });

    // define an API Gateway REST API resource backed by our "hello" function
    const gateway = new LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler,
    });
  }
}
