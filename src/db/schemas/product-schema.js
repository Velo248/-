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
    spcification: {
      type: new Schema(
        {
          spec1: String,
          spec2: String,
          spec3: String,
        },
        {
          _id: false,
        },
      ),
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
