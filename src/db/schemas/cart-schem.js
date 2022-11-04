import { Schema } from 'mongoose';
const CartSchema = new Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  count: { type: Number, required: true },
});

export { CartSchema };
