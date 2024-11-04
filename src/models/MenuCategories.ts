import mongoose, { Document, Schema } from "mongoose";

export interface ICategories extends Document {
  title: string;
  categories: string[];
  parent: string;
}

const CategoriesSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  parent: {
    type: String,
    required: false,
  },
});

export default mongoose.models.Categories ||
  mongoose.model<ICategories>("Categories", CategoriesSchema);
