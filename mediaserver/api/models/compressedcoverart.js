import { Schema, model } from 'mongoose';

// here _id is the name of album

const compressedCoverArtSchema = Schema({
   _id: String,
   base64: String,
});

export default model('CompressedCoverArt', compressedCoverArtSchema);
