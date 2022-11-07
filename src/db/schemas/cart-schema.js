import { Schema } from 'mongoose';
import orderSheet from './types/orderSheet-type';

const CartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderSheets: [orderSheet],
  },
  {
    collection: 'carts',
    timestamps: true,
  },
);

export { CartSchema };
