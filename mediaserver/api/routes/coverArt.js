import { Router } from 'express';

import Tracks from '../models/tracks.js';

// eslint-disable-next-line import/no-unresolved
const mm = import('music-metadata');
const imagemin = import('imagemin');
const imageminMozjpeg = import('imagemin-mozjpeg');

export const router = Router();

// FOLLOWING ARE OBSOLETE, REDUNDANT METHODS
// kept as backup option if a requirement arises

// handle GET to /coverArt/:trackId
router.get('/:trackId', (req, res) => {
   const id = req.params.trackId;
   Tracks.findById(id)
      .then((track) => {
         const filePath = track.path;
         mm.parseFile(filePath)
            .then((metadata) => {
               const imageData = metadata.common.picture[0].data;
               res.set({
                  'Cache-Control': 'max-age=86400', // seconds in a day
               });
               res.status(200).json({
                  coverArt: imageData,
                  format: metadata.common.picture[0].format,
               });
            })
            .catch((e) => {
               res.status(500).json({
                  error: e,
               });
            });
      })
      .catch((e) => {
         console.log(e);
         res.status(500).json({
            error: e,
         });
      });
});

// handle GET to /coverArt/compressed/:trackID
router.get('/compressed/:trackId', (req, res) => {
   const id = req.params.trackId;
   Tracks.findById(id)
      .then((track) => {
         const filePath = track.path;
         mm.parseFile(filePath)
            .then(async (metadata) => {
               const imageData = metadata.common.picture[0].data;
               console.log(metadata.common.picture[0].format);
               const compressedImage = await imagemin.buffer(imageData, {
                  plugins: [imageminMozjpeg({ quality: 10 })],
               });
               res.set({
                  'Cache-Control': 'max-age=86400', // seconds in a day
               });
               res.status(200).json({
                  coverArt: compressedImage,
                  format: metadata.common.picture[0].format,
               });
            })
            .catch((err) => {
               res.status(500).json({
                  error: err,
               });
            });
      })
      .catch((e) => {
         console.log(e);
         res.status(500).json({
            error: e,
         });
      });
});

export default router;
