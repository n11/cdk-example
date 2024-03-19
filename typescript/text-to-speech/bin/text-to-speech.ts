#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TextToSpeechStack } from '../lib/text-to-speech-stack';

const app = new cdk.App();
new TextToSpeechStack(app, 'TextToSpeechStack');
