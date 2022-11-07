const orderSheet = {
  productId: {
    type: String,
    default: '',
    require: true,
  },
  quantity: {
    type: Number,
    default: 0,
    require: true,
  },
  index: false,
  _id: false,
};

export default orderSheet;
