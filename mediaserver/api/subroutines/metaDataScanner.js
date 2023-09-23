import { basename, extname } from 'path';
import { GetObjectCommand } from '@aws-sdk/client-s3';
// eslint-disable-next-line import/no-unresolved
import { parseStream } from 'music-metadata';

import bucketClient from '../../connectors/aws.js';
import { AWS_BUCKET_NAME } from '../../constants/env.js';

export default async (files) => {
   const finalList = [];
   files.forEach(async (file) => {
      const processedFile = file;
      const { path } = processedFile;
      const fileStream = (
         await bucketClient.send(
            new GetObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: path })
         )
      ).Body;
      processedFile.path = path;

      parseStream(fileStream)
         .then((metaData) => {
            processedFile.title = metaData.common.title;
            processedFile.album = metaData.common.album;
            processedFile.albumArtist = metaData.common.albumartist;
            processedFile.contributingArtists = metaData.common.artists;
            processedFile.year = metaData.common.year;
            processedFile.genre = metaData.common.genre;
            processedFile.label = metaData.common.label;
            processedFile.trackXofY = metaData.common.track;
            processedFile.diskXofY = metaData.common.disk;

            processedFile.length = metaData.format.duration;
            processedFile.sampleRate = metaData.format.sampleRate;
            processedFile.channelCount = metaData.format.numberOfChannels;
            processedFile.codec = metaData.format.codec;
            processedFile.lossless = metaData.format.lossless;

            processedFile.musicbrainz_trackid =
               metaData.common.musicbrainz_trackid;

            if (metaData.common.title && metaData.format.duration) {
               // got both
               if (!metaData.common.album)
                  processedFile.album = processedFile.title;
               finalList.push(processedFile);
            } else if (metaData.format.duration) {
               // got length
               processedFile.title = basename(path, extname(path));
               if (!metaData.common.album)
                  processedFile.album = processedFile.title;
               finalList.push(processedFile);
            } else if (metaData.common.title) {
               // got title
               processedFile.length = -1;
               if (!metaData.common.album)
                  processedFile.album = processedFile.title;
               finalList.push(processedFile);
            } else
               console.log('Filed without required metadata: ', processedFile);
         })
         .catch(() => {
            // console.log(e);
            console.log('debug: metaDataScanner:  NOT_MUSIC_FILE: ', path);
         });
   });

   return finalList;
};
