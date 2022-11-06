import { Schema } from 'mongoose';
import { ProductSchema } from './product-schema';

const CategorySchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    //themeClass는 테마색상?? CSS속성인듯? ex)"is-link","is-light","is-warning"
    themeClass: String,
    //imageKey는 이미지 파일 경로
    imageKey: String,
  },

  {
    collection: 'categories',
    timestamps: true,
  },
);

export { CategorySchema };
