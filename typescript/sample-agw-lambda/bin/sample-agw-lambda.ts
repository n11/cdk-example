#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SampleAgwLambdaStack } from '../lib/sample-agw-lambda-stack';

const app = new cdk.App();
new SampleAgwLambdaStack(app, 'SampleAgwLambdaStack');
