const Product = require("../../models/Product");
const axios = require("axios");

const normalizeProduct = (product) => {
  switch (product.marketPlace) {
    case "Facebook":
      return {
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        features: product.other.features,
        marketplace: "Facebook",
      };
    case "Amazon":
      return {
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        features: product.other.features,
        marketplace: "Amazon",
      };
    case "Etsy":
      return {
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        features: "",
        marketplace: "Etsy",
      };
    case "Walmart":
      return {
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        features: "",
        marketplace: "Walmart",
      };
    case "Alibaba":
      return {
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        features: "",
        marketplace: "Alibaba",
      };
    default:
      return null;
  }
};

const extractFeatures = (product) => {
  const { title, features } = product;
  return features ? `${title} ${features.join(" ")}` : title;
};

const getEmbedding = async (text) => {
  const response = await axios.post("http://localhost:5001/embed", {
    sentences: [text],
  });
  return response.data[0];
};

const computeSimilarity = async (embedding1, embedding2) => {
  const response = await axios.post("http://localhost:5001/similarity", {
    embedding1,
    embedding2,
  });
  return response.data.similarity;
};

exports.findSimilarProducts = async (req, res) => {
  const { product } = req.body;
  const normalizedProduct = normalizeProduct(product);
  if (!normalizedProduct) return [];

  const productEmbedding = await getEmbedding(
    extractFeatures(normalizedProduct)
  );
  const products = await Product.find({ category: product.category });

  const similarProducts = [];
  for (const p of products) {
    const dbProductEmbedding = await getEmbedding(
      extractFeatures(normalizeProduct(p))
    );
    const similarity = await computeSimilarity(
      productEmbedding,
      dbProductEmbedding
    );
    if (similarity > 0.7 && product._id !== p._id) {
      similarProducts.push(p);
    }
  }
  res.json(similarProducts);
};

exports.getTotalNumberOfProducts = (req, res) => {
  const market = req.query.market;

  Product.find({ marketPlace: market }).then((result) => {
    res.status(200).json(result.length);
  });
};

exports.getProducts = (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const perPage = req.query.perPage ? req.query.perPage : 12;
  const market = req.query.market;

  Product.find({ marketPlace: market })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .then((result) => {
      let arr = [];
      result.map((item) => {
        if (item.price) arr.push(item);
      });

      res.status(200).send(arr);
    });
};

exports.getSortedProducts = async (req, res) => {
  const product = req.query.product;
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  try {
    const products = await Product.find({
      title: { $regex: new RegExp(product, "i") },
    });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getWinningProducts = async (req, res) => {
  try {
    const products = await Product.find({ "other.bestsellerRanks.rank": 1 });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
