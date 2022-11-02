import { Schema } from 'mongoose';
const ReviewSchema = new Schema(
  {
    // content, String, required,
    content: { type: String, required: true },
    // author, User, required
    star: { type: Number },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export { ReviewSchema };
