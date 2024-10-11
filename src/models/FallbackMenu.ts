import mongoose, { Document, Schema } from "mongoose";
import { MenuStructure } from "@/types/menu";

export interface IFallbackMenu extends Document {
  menu: MenuStructure;
}

const FallbackMenuSchema: Schema = new Schema(
  {
    menu: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.FallbackMenu ||
  mongoose.model<IFallbackMenu>("FallbackMenu", FallbackMenuSchema);
