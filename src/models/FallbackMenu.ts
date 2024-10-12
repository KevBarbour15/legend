import mongoose, { Document, Schema } from "mongoose";
import { MenuStructure } from "@/types/menu";

export interface IFallbackMenu extends Document {
  menu: MenuStructure;
  version: number;
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
  },
  { timestamps: true },
);

export default mongoose.models.FallbackMenu ||
  mongoose.model<IFallbackMenu>("FallbackMenu", FallbackMenuSchema);
