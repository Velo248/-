const orderSheet = {
  productId: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  index: false,
  _id: false,
};

export default orderSheet;
