import { Router } from 'express';
import mongoose from 'mongoose';

import Files from '../models/files.js';
import Tracks from '../models/tracks.js';

import mediaScanner from '../subroutines/mediaScanner.js';
import metaDataScanner from '../subroutines/metaDataScanner.js';
// import albumArtGenerator from '../subroutines/albumArtGenerator.js';
import { getPlaylists, save } from '../subroutines/handlePlaylists.js';
// import playlistArtGenerator from '../subroutines/playlistArtGenerator.js';

const { connection } = mongoose;

const router = Router();

router.post('/', async (_, res) => {
   let files = [];
   let playlistsData = {};

   /// /////////////////////////////////////
   /// ///////////// STEP 0.1 //////////////
   /// /////////////////////////////////////

   // store playlists data to restore later
   playlistsData = await getPlaylists().catch((err) => {
      console.log(err);
      res.status(500).json({
         error: err,
      });
   });

   /// /////////////////////////////////////
   /// ///////////// STEP 1 ////////////////
   /// /////////////////////////////////////

   // scan the library
   await mediaScanner()
      .then((result) => {
         files = result;
      })
      .catch((e) => {
         console.log(e);
         res.status(500).json({
            error: e,
         });
      });

   // refresh the files collection
   await connection.db
      .collection('files')
      .drop()
      .catch((e) => console.log(e));
   await connection.db
      .createCollection('files')
      .then(() => {
         Files.insertMany(files).catch((e) => {
            console.log(e);
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

   // return if headers already sent
   if (res.headersSent) return;

   /// /////////////////////////////////////
   /// ///////////// STEP 2 ////////////////
   /// /////////////////////////////////////

   // add meta data to the files
   await metaDataScanner(files)
      .then((result) => {
         files = result;
      })
      .catch((e) => {
         console.log(e);
         res.status(500).json({
            error: e,
         });
      });

   // refresh the tracks collection
   await connection.db
      .collection('tracks')
      .drop()
      .catch((e) => console.log(e));
   await Tracks.insertMany(files).catch((e) => {
      console.log(e);
      res.status(500).json({
         error: e,
      });
   });
   Tracks.createIndexes([
      {
         title: 'text',
         album: 'text',
         albumArtist: 'text',
         contributingArtists: 'text',
      },
   ]);

   // return if headers already sent
   if (res.headersSent) return;

   /// /////////////////////////////////////
   /// ///////////// STEP 0.2 //////////////
   /// /////////////////////////////////////

   // restore playlists
   await save(playlistsData).catch((err) => {
      console.log(err);
      res.status(500).json({
         error: err,
      });
   });

   // return if headers already sent
   if (res.headersSent) return;

   /// /////////////////////////////////////
   /// ///////////// STEP 3 ////////////////
   /// /////////////////////////////////////

   // aggregate tracks into albums collection and add info
   try {
      await connection.db
         .collection('albums')
         .drop()
         .catch((e) => console.log(e));
      await connection.db
         .createCollection('albums')
         .catch((e) => console.log(e));

      // aggregate
      await Tracks.aggregate([
         {
            $group: {
               _id: '$album',
               tracks: {
                  $push: '$_id',
               },
               albumArtist: {
                  $addToSet: '$albumArtist',
               },
               year: {
                  $addToSet: '$year',
               },
               genre: {
                  $first: '$genre',
               },
            },
         },
         { $out: 'albums' },
      ]);
   } catch (e) {
      console.log(e);
      res.status(500).json({
         error: e,
      });
   }

   // return if headers already sent
   if (res.headersSent) return;

   /// /////////////////////////////////////
   /// ///////////// STEP 4 ////////////////
   /// /////////////////////////////////////

   // get the album arts
   // try {
   //     albumArtGenerator();
   // } catch (e) {
   //     console.log(e);
   //     res.status(500).json({
   //         error: e
   //     });
   // }

   // return if headers already sent
   if (res.headersSent) return;

   /// /////////////////////////////////////
   /// ///////////// STEP 5 ////////////////
   /// /////////////////////////////////////

   // get playlist arts
   // try {
   //     for (const pl in playlistsData)
   //         playlistArtGenerator(pl);
   // } catch (err) {
   //     console.log(err);
   //     res.status(500).json({
   //         error: err
   //     });
   // }

   // return if headers already sent
   if (res.headersSent) return;

   res.status(201).json({
      files,
   });
});

export default router;
