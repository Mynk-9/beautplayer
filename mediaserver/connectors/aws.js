const aws = require("@aws-sdk/client-s3");
const { AWS_REGION } = require("../constants/env");

const bucketClient = new aws.S3Client({ region: AWS_REGION });

module.exports = { bucketClient };
