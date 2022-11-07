import { Schema } from 'mongoose';

const CategorySchema = new Schema(
  {
    title: { type: String, required: true },
    description: {
      type: String,
      default: '',
    },
    //themeClass는 테마색상?? CSS속성인듯? ex)"is-link","is-light","is-warning"
    themeClass: {
      type: String,
      default: '',
    },
    //imageKey는 이미지 파일 경로
    imageKey: {
      type: String,
      default: '',
    },
  },

  {
    collection: 'categories',
    timestamps: true,
  },
);

export { CategorySchema };
