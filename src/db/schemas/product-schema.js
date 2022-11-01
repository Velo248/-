import { Schema } from 'mongoose';
//import { CategorySchema } from './category-schema';
import {ReviewSchema} from './review-schema'
const ProductSchema = new Schema(
  {
    product_no: {
      type: Number,
      index: true,
    },
    product_name: {
      type: String,
    },
    price: {
      type: Number,
      index: true,
    },
    brand: {
      type: String,
      required: false,
    },
    specification: {
      type: String,
      required: false,
    },
   reviews: [ReviewSchema],
   categories:[String]
    
  },
  {
    collection: 'products',
    timestamps: true,
  },
);

export { ProductSchema };
