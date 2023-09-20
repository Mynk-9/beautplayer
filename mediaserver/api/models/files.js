import { Schema, model } from 'mongoose';

const trackSchema = Schema({
   _id: Schema.Types.ObjectId,
   path: { type: String, required: true },
});

export default model('Files', trackSchema);
