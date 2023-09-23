import { Router } from 'express';
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

import Tracks from '../models/tracks.js';
import bucketClient from '../../connectors/aws.js';
import { AWS_BUCKET_NAME } from '../../constants/env.js';

const router = Router();

// handle GET to /tracks
router.get('/', (_, res) => {
   Tracks.find()
      .exec()
      .then((tracks) => {
         res.status(200).json({
            TrackList: tracks,
         });
      })
      .catch((e) => {
         console.log(e);
         res.status(500).json({
            error: e,
         });
      });
});

router.get('/:trackId', (req, res) => {
   const id = req.params.trackId;
   Tracks.findById(id)
      .then((track) => {
         res.status(200).json({
            Track: track,
         });
      })
      .catch((e) => {
         console.log(e);
         res.status(500).json({
            error: e,
         });
      });
});

router.head('/:trackId/stream', async (req, res) => {
   const id = req.params.trackId;
   let contentLength = 0;
   await Tracks.findById(id).then((track) => {
      bucketClient
         .send(
            new HeadObjectCommand({
               Bucket: AWS_BUCKET_NAME,
               Key: track.path,
            })
         )
         .then((resp) => {
            contentLength = resp.ContentLength;
         });
   });
   res.status(200).json({
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
   });
});

// for streaming
router.get('/:trackId/stream', (req, res) => {
   const id = req.params.trackId;
   Tracks.findById(id)
      .then(async (track) => {
         let music = '';
         music = track.path;

         const byteRange = req.headers.range;

         let maxContentLength = 0;

         await bucketClient
            .send(
               new HeadObjectCommand({
                  Bucket: AWS_BUCKET_NAME,
                  Key: track.path,
               })
            )
            .then((resp) => {
               maxContentLength = resp.ContentLength;
            });

         if (byteRange) {
            let [rangeStart, rangeEnd] = byteRange
               .replace(/bytes=/, '')
               .split('-')
               .map((val) => parseInt(val));
            if (!rangeStart) rangeStart = 0;
            if (!rangeEnd) rangeEnd = maxContentLength - 1;
            if (rangeStart > rangeEnd) {
               res.status(500).json({
                  error: 'ERR_INCOMPLETE_CHUNKED_ENCODING',
               });
            }

            const contentLength = parseInt(rangeEnd) - parseInt(rangeStart);
            const contentRange = `bytes ${rangeStart}-${rangeEnd}/${maxContentLength}`;

            const headers = {
               'Accept-Ranges': 'bytes',
               'Content-Type': 'audio/mpeg',
               'Content-Length': contentLength,
               'Content-Range': contentRange,
            };
            Object.keys(headers).forEach((header) => {
               res.setHeader(header, headers[header]);
            });
            res.statusCode = 206;
            bucketClient
               .send(
                  new GetObjectCommand({
                     Bucket: AWS_BUCKET_NAME,
                     Key: music,
                     Range: contentRange,
                  })
               )
               .then(async (obj) => {
                  const readStream = obj.Body;
                  readStream.pipe(res);
                  readStream.on('close', () => {
                     res.end();
                  });
               })
               .catch((err) => {
                  console.log(err);
                  res.status(500).json(err);
               });
         } else {
            bucketClient
               .send(
                  new GetObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: music })
               )
               .then((obj) => {
                  const readStream = obj.Body;
                  readStream.pipe(res);
                  readStream.on('close', () => {
                     res.end();
                  });
               })
               .catch((err) => {
                  console.log(err);
                  res.status(500).json(err);
               });
         }
      })
      .catch((e) => {
         console.log(e);
         res.status(500).json({
            error: e,
         });
      });
});

export default router;
