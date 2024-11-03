import mongoose, { Document, Schema } from "mongoose";
import { MenuStructure } from "@/data/menu";

export interface IFallbackMenu extends Document {
  menu: MenuStructure;
  version: number;
  isLatest: boolean;
}

const FallbackMenuSchema: Schema = new Schema(
  {
    menu: {
      type: Object,
      required: true,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
    },
    isLatest: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

FallbackMenuSchema.index({ isLatest: 1 });

export default mongoose.models.FallbackMenu ||
  mongoose.model<IFallbackMenu>("FallbackMenu", FallbackMenuSchema);
