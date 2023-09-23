import { Router } from 'express';
import Playlists from '../models/playlists.js';
import playlistArtGenerator from '../subroutines/playlistArtGenerator.js';

const router = Router();

// handle GET to /playlists
router.get('/', (_, res) => {
   Playlists.find()
      .exec()
      .then((playlists) => {
         res.status(200).json({
            Playlists: playlists,
         });
      })
      .catch((e) => {
         console.log(e);
         res.status(500).json({
            error: e,
         });
      });
});

// handle GET to /playlists:playlistName
router.get('/:playlistName', (req, res) => {
   const plName = req.params.playlistName;
   Playlists.findById(plName)
      .populate('tracks')
      .then((playlist) => {
         res.status(200).json({
            Playlist: playlist,
         });
      })
      .catch((e) => {
         console.log(e);
         res.status(500).json({
            error: e,
         });
      });
});

// handle GET to /playlists/:playlistName/:trackId
router.get('/:playlistName/:trackId', (req, res) => {
   const plName = req.params.playlistName;
   const { trackId } = req.params;
   Playlists.count({ _id: plName, tracks: { $in: [trackId] } })
      .then((count) => {
         res.status(200).json({
            found: count > 0,
         });
      })
      .catch((e) => {
         console.log(e);
         res.status(500).json({
            error: e,
         });
      });
});

// handle POST requests on /playlists
router.post('/', async (req, res) => {
   const playList = req.body.playlistName;
   const { trackId } = req.body;

   Playlists.findOneAndUpdate(
      { _id: playList },
      { $addToSet: { tracks: trackId } },
      {
         upsert: true,
         new: true,
         useFindAndModify: false,
      }
   )
      .then((track) => {
         res.status(201).json({
            message: 'Added to playlist successfully.',
            track,
         });
      })
      .then(() => playlistArtGenerator(playList))
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: 'Encountered an error',
            error: err,
         });
      });
});

// handle DELETE requests on /playlists/:playlistName/
// delete the playlist
router.delete('/:playlistName', (req, res) => {
   const { playlistName } = req.params;

   Playlists.deleteOne({ _id: playlistName })
      .then((result) => {
         res.status(200).json({
            message: 'Removed successfully.',
            systemMessage: result,
         });
      })
      .catch((err) => {
         console.log(err);
         res.status(404).json({
            message: 'Encountered an error',
            error: err,
         });
      });
});

// handle DELETE requests on /playlists/:playlistName/:trackId
// delete the track from playlist
router.delete('/:playlistName/:trackId', (req, res) => {
   const { trackId } = req.params;
   const { playlistName } = req.params;

   Playlists.findOneAndUpdate(
      { _id: playlistName },
      { $pullAll: { tracks: [trackId] } },
      {
         new: true,
         useFindAndModify: false,
      }
   )
      .then((result) => {
         res.status(200).json({
            message: 'Removed successfully.',
            systemMessage: result,
         });
      })
      .then(() => playlistArtGenerator(playlistName))
      .catch((err) => {
         console.log(err);
         res.status(404).json({
            message: 'Encountered an error',
            error: err,
         });
      });
});

export default router;
