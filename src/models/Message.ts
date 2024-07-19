import { read } from "fs";
import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  sentAt: Date;
  howDidYouHear: string;
  budget: string;
  message: string;
  read: boolean;
}

const MessageSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  preferredDate: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  howDidYouHear: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  contacted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);
