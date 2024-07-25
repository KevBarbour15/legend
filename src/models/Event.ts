import mongoose, { Document, Schema } from "mongoose";

// interface for the event
export interface IEvent extends Document {
  title: string;
  date: string;
  time: string;
  description: string;
}

// schema for the event
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
    required: true,
    default: "",
  },
});

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
