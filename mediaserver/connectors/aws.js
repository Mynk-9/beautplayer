import { S3Client } from '@aws-sdk/client-s3';

import { AWS_REGION } from '../constants/env.js';

const bucketClient = new S3Client({ region: AWS_REGION });

export default bucketClient;
