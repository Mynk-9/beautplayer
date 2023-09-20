import { ListObjectsCommand } from '@aws-sdk/client-s3';
import { bucketClient } from '../../connectors/aws.js';
import { AWS_BUCKET_NAME as AWS_BUCKET } from '../../constants/env.js';

export default async () => {
   const objects = await bucketClient.send(
      new ListObjectsCommand({ Bucket: AWS_BUCKET })
   );
   return objects.Contents.map((content) => ({
      path: content.Key,
   }));
};
