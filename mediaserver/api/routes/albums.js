import { Router } from 'express';

import Albums from '../models/albums.js';

const router = Router();

// handle GET to /albums
router.get('/', (_, res) => {
   Albums.find()
      .exec()
      .then((albums) => {
         res.status(200).json({
            AlbumsList: albums,
         });
      })
      .catch((e) => {
         console.log(e);
         res.status(500).json({
            error: e,
         });
      });
});

router.get('/:albumName', (req, res) => {
   const id = req.params.albumName;
   Albums.findOne({ _id: id })
      .populate('tracks')
      .exec()
      .then((album) => {
         res.status(200).json({
            Album: album,
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
