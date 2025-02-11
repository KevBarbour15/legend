import mongoose, { Document, Schema } from "mongoose";
import { MenuStructure } from "@/data/menu";

export interface IMenu extends Document {
  menu: MenuStructure;
  version: number;
  isLatest: boolean;
}

const MenuSchema: Schema = new Schema(
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

MenuSchema.index({ isLatest: 1 });

const Menu = mongoose.models.Menu || mongoose.model<IMenu>("Menu", MenuSchema);

export default Menu;
