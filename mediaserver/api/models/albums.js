import { Schema, model } from 'mongoose';

const albumsSchema = Schema({
   _id: String,
   tracks: [{ type: Schema.Types.ObjectId, ref: 'Tracks' }],
   albumArtist: [], // array so that if there are multiple album artists, they can be accommodated
   year: [], // array so that if there are multiple album release years, they can be accommodated
   genre: [], // array so that if there are multiple genres of tracks, they can be accommodated
});

export default model('Albums', albumsSchema);
