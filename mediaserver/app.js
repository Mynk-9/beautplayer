import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import tracksRoutes from './api/routes/tracks.js';
import albumsRoutes from './api/routes/albums.js';
import playlists from './api/routes/playlists.js';
import libraryRefreshRoute from './api/routes/libraryRefresh.js';
import coverArtRoute from './api/routes/coverArt.js';
import searchRoute from './api/routes/search.js';

const app = express();

mongoose.connect('mongodb://localhost:27017/beautplayer', {}).then(
   () => {
      console.log('Successfully connected to MongoDB Database.');
   },
   (e) => {
      console.log('Failure in connection to MongoDB Database.', e);
   }
);

// logging
app.use(morgan('dev'));

// body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// allow CORS
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Request-With, Content-Type, Accept, Authorization'
   );
   if (req.method === 'OPTIONS') {
      res.header(
         'Access-Control-Allow-Methods',
         'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(200).json({});
   }
   return next();
});

// routes which should handle requests
app.use('/tracks', tracksRoutes);
app.use('/refreshlibrary', libraryRefreshRoute);
app.use('/albums', albumsRoutes);
app.use('/legacy/coverart', coverArtRoute);
app.use('/coverArt', express.static('./public/coverArt'));
app.use('/playlists', playlists);
app.use('/search', searchRoute);

// error handling
app.use((req, res, next) => {
   const error = new Error('Not found');
   error.status = 404;
   next(error);
});
app.use((error, _, res) => {
   res.status(error.status || 500);
   res.json({
      error: {
         message: error.message,
      },
   });
});

export default app;
