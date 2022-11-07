const orderSheet = {
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
  index: false,
  _id: false,
};

export default orderSheet;
