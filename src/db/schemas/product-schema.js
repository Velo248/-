import { Schema } from 'mongoose';
//import { CategorySchema } from './category-schema';
const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    sellerId: {
      type: String,
      default: '',
    },
    categoryId: { type: String, required: true },
    manufacturer: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      default: '',
    },
    detailDescription: {
      type: String,
      default: '',
    },
    imageKey: {
      type: String,
      default: '',
    },
    inventory: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
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
