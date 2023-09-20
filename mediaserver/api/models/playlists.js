import { Schema, model } from 'mongoose';

const playlistsSchema = Schema({
   _id: String, // also name of the playlist
   tracks: [{ type: Schema.Types.ObjectId, ref: 'Tracks' }],
});

export default model('Playlists', playlistsSchema);
