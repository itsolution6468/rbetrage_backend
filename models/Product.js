const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  marketPlace: {
    type: String,
    require: true,
  },
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  url: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  price: {
    type: String,
  },
  category: {
    type: String,
  },
  other: {
    type: Object,
  },
});

module.exports = mongoose.model("Product", productSchema);
