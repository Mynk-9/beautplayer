const mm = import('music-metadata');
import { basename, extname } from 'path';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { bucketClient } from '../../connectors/aws.js';
import { AWS_BUCKET_NAME } from '../../constants/env.js';

export default async (files) => {
   const finalList = [];
   for (const file of files) {
      const { path } = file;
      const fileStream = (
         await bucketClient.send(
            new GetObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: path })
         )
      ).Body;
      file.path = path;
      await (
         await mm
      )
         .parseStream(fileStream)
         .then((metaData) => {
            file.title = metaData.common.title;
            file.album = metaData.common.album;
            file.albumArtist = metaData.common.albumartist;
            file.contributingArtists = metaData.common.artists;
            file.year = metaData.common.year;
            file.genre = metaData.common.genre;
            file.label = metaData.common.label;
            file.trackXofY = metaData.common.track;
            file.diskXofY = metaData.common.disk;

            file.length = metaData.format.duration;
            file.sampleRate = metaData.format.sampleRate;
            file.channelCount = metaData.format.numberOfChannels;
            file.codec = metaData.format.codec;
            file.lossless = metaData.format.lossless;

            file.musicbrainz_trackid = metaData.common.musicbrainz_trackid;

            if (metaData.common.title && metaData.format.duration) {
               // got both
               if (!metaData.common.album) file.album = file.title;
               finalList.push(file);
            } else if (metaData.format.duration) {
               // got length
               file.title = basename(path, extname(path));
               if (!metaData.common.album) file.album = file.title;
               finalList.push(file);
            } else if (metaData.common.title) {
               // got title
               file.length = -1;
               if (!metaData.common.album) file.album = file.title;
               finalList.push(file);
            } else console.log('Filed without required metadata: ', file);
         })
         .catch((e) => {
            // console.log(e);
            console.log('debug: metaDataScanner:  NOT_MUSIC_FILE: ', path);
         });
   }

   return finalList;
};
