import { Schema, model } from 'mongoose';

const trackSchema = Schema({
   _id: Schema.Types.ObjectId,

   title: { type: String, required: true },
   album: { type: String }, // default: 'Single' },
   // default removes as this would create problem in album art generation/storage
   albumArtist: String,
   contributingArtists: [],
   year: Number,
   genre: [],
   label: [],
   trackXofY: {},
   diskXofY: {},

   length: { type: Number, required: true },
   sampleRate: Number,
   channelCount: Number,
   codec: String,
   lossless: Boolean,

   musicbrainz_trackid: String,

   path: { type: String, required: true },
});

trackSchema.index({
   title: 'text',
   album: 'text',
   albumArtist: 'text',
   contributingArtists: 'text',
});

export default model('Tracks', trackSchema);
