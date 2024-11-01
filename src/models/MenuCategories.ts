import mongoose, { Document, Schema } from "mongoose";

export interface ICategories extends Document {
  parentCategories: string[];
  childCategories: string[];
}

const CategoriesSchema: Schema = new Schema({
  parentCategories: {
    type: Array,
    required: true,
  },
  childCategories: {
    type: Array,
    required: true,
  },
});

export default mongoose.models.Categories ||
  mongoose.model<ICategories>("Categories", CategoriesSchema);
