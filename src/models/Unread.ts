import mongoose, { Document, Schema } from "mongoose";

export interface IUnread extends Document {
  unread: number;
}

const UnreadSchema: Schema = new Schema({
  unread: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Unread ||
  mongoose.model<IUnread>("Unread", UnreadSchema);
