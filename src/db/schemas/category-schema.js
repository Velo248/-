import { Schema } from 'mongoose';
import { ProductSchema } from './product-schema';

const CategorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    products: [ProductSchema],
  },

  {
    collection: 'categories',
    timestamps: true,
  },
);

export { CategorySchema };
