import { Router } from 'express';

const router = Router();
import Tracks from '../models/tracks.js';

// handle GET to /tracks
router.get('/:query', (req, res, next) => {
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

export { router };
