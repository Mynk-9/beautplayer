const { bucketClient } = require("../../connectors/aws");
const { AWS_BUCKET_NAME: AWS_BUCKET } = require("../../constants/env");
const aws = require('@aws-sdk/client-s3');

module.exports = async () => {
  const objects = await bucketClient.send(
    new aws.ListObjectsCommand({ Bucket: AWS_BUCKET })
  );
  return objects.Contents.map((content) => ({
    path: content.Key,
  }));
};
