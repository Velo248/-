import { Schema } from 'mongoose';
//import { CategorySchema } from './category-schema';
import { ReviewSchema } from './review-schema';
const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    sellerId: String,
    categoryId: { type: String, required: true },
    manufacturer: String,
    shortDescription: String,
    detailDescription: String,
    imageKey: String,
    inventory: Number,
    price: Number,
    searchKeywords: [String],
    isRecommended: Boolean,
    discountPercent: Number,
  },
  {
    collection: 'products',
    timestamps: true,
  },
);

export { ProductSchema };
