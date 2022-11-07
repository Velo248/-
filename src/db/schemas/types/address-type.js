const address = {
  postalCode: {
    type: String,
    default: '',
  },
  address1: {
    type: String,
    default: '',
  },
  address2: {
    type: String,
    default: '',
  },
  receiverName: {
    type: String,
    default: '',
  },
  receiverPhoneNumber: {
    type: String,
    default: '',
  },

  required: false,
  index: false,
};

export default address;
