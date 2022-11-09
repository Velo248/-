import { Schema } from 'mongoose';

const BasketSchema = new Schema(
  {
    userId: {
      type: String,
      default: '',
      required: true,
    },
    productId: {
      type: String,
      default: '',
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    collection: 'baskets',
    timestamps: true,
  },
);

export { BasketSchema };
// mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
