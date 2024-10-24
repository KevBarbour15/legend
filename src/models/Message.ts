import mongoose, { Document, Schema } from "mongoose";
export interface IMessage extends Document {
  formType: string;
  name: string;
  email: string;
  phone: string;
  eventDate?: string;
  eventTime?: string;
  eventType?: string;
  guests?: number;
  musicType?: string;
  sentAt: Date;
  message: string;
  read: boolean;
  contacted: boolean;
}

const MessageSchema: Schema = new Schema({
  formType: {
    type: String,
    required: true,
  },
  name: {
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
  eventDate: {
    type: String,
    required: false,
  },
  eventType: {
    type: String,
    required: false,
  },
  eventTime: {
    type: String,
    required: false,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  guests: {
    type: Number,
    required: false,
  },
  musicType: {
    type: String,
    required: false,
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
