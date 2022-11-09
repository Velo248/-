import { Schema } from 'mongoose';
import address from './types/address-type';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordUpdatedAt: {
      type: Date,
    },
    loggedOutAt: {
      type: Date,
      default: new Date(),
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      required: false,
      default: '',
    },
    address,
    role: {
      type: String,
      required: false,
      default: 'basic-user',
    },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

export { UserSchema };
