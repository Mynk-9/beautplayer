import { Router } from 'express';
import Tracks from '../models/tracks.js';

const router = Router();

// handle GET to /tracks
router.get('/:query', (req, res) => {
   const { query } = req.params;
   console.log('query:', query);
   Tracks.find({
      $text: {
         $search: query,
      },
   })
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

export default router;
