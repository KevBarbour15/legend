import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  date: string;
  time: string;
  description: string;
  notes: string;
  image_url: string;
  is_photo: boolean;
  upcoming: boolean;
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  image_url: {
    type: String,
    required: true,
  },
  is_photo: {
    type: Boolean,
    required: true,
    default: true,
  },
  upcoming: {
    type: Boolean,
    required: true,
    default: true,
  },
});

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
