const Product = require("../../models/Product");
const axios = require("axios");

exports.getScrappingProducts = async (req, res) => {
  try {
    // Fetch data from the FastAPI endpoint
    const response = await axios.get("http://127.0.0.1:5000/scrape"); // Update with your actual FastAPI URL

    console.log(response.data);

    if (!response.data || response.data.message) {
      console.log(
        "No data to update:",
        response.data.message || "Empty response"
      );
      return;
    }

    // Loop through the products and save them to MongoDB
    const products = response.data;

    // await Product.deleteMany({ marketPlace: "Alibaba" });

    for (const product of products) {
      const { name, current_price, link, image } = product;

      // Insert or update the product in the MongoDB collection
      await Product.updateOne(
        { imageUrl: image }, // Use the 'link' field as a unique identifier
        {
          $set: {
            marketPlace: "Alibaba",
            url: link,
            title: name,
            price: current_price,
            updatedAt: new Date(),
          },
        },
        { upsert: true } // Insert if not found
      );
    }
    console.log("Data successfully saved to MongoDB!");
  } catch (error) {
    console.error("Error fetching or saving data:", error.message);
  }
};

exports.getStreetProducts = async () => {
  try {
    // Fetch data from the FastAPI endpoint
    const response = await axios.get("http://127.0.0.1:5001/scrape"); // Update with your actual FastAPI URL

    if (!response.data || response.data.message) {
      console.log(
        "No data to update:",
        response.data.message || "Empty response"
      );
      return;
    }

    // Loop through the products and save them to MongoDB
    const products = response.data;

    await Product.deleteMany({ marketPlace: "6thStreet" });

    for (const product of products) {
      const { name, current_price, link } = product;

      // Insert or update the product in the MongoDB collection
      await Product.updateOne(
        { url: link }, // Use the 'link' field as a unique identifier
        {
          $set: {
            marketPlace: "6thStreet",
            title: name,
            price: current_price,
            updatedAt: new Date(),
          },
        },
        { upsert: true } // Insert if not found
      );
    }

    console.log("Data successfully saved to MongoDB!");
  } catch (error) {
    console.error("Error fetching or saving data:", error.message);
  }
};

exports.getJumboProducts = async () => {
  try {
    // Fetch data from the FastAPI endpoint
    const response = await axios.get("http://127.0.0.1:5002/scrape"); // Update with your actual FastAPI URL

    if (!response.data || response.data.message) {
      console.log(
        "No data to update:",
        response.data.message || "Empty response"
      );
      return;
    }

    // Loop through the products and save them to MongoDB
    const products = response.data;

    await Product.deleteMany({ marketPlace: "Jumbo" });

    for (const product of products) {
      const { name, current_price, link } = product;

      // Insert or update the product in the MongoDB collection
      await Product.updateOne(
        { url: link }, // Use the 'link' field as a unique identifier
        {
          $set: {
            marketPlace: "Jumbo",
            title: name,
            price: current_price,
            updatedAt: new Date(),
          },
        },
        { upsert: true } // Insert if not found
      );
    }

    console.log("Data successfully saved to MongoDB!");
  } catch (error) {
    console.error("Error fetching or saving data:", error.message);
  }
};

exports.getSupermarketProducts = async () => {
  try {
    // Fetch data from the FastAPI endpoint
    const response = await axios.get("http://127.0.0.1:5003/scrape"); // Update with your actual FastAPI URL

    if (!response.data || response.data.message) {
      console.log(
        "No data to update:",
        response.data.message || "Empty response"
      );
      return;
    }

    // Loop through the products and save them to MongoDB
    const products = response.data;

    await Product.deleteMany({ marketPlace: "Supermarket" });

    for (const product of products) {
      const { name, current_price, link } = product;

      // Insert or update the product in the MongoDB collection
      await Product.updateOne(
        { url: link }, // Use the 'link' field as a unique identifier
        {
          $set: {
            marketPlace: "Supermarket",
            title: name,
            price: current_price,
            updatedAt: new Date(),
          },
        },
        { upsert: true } // Insert if not found
      );
    }

    console.log("Data successfully saved to MongoDB!");
  } catch (error) {
    console.error("Error fetching or saving data:", error.message);
  }
};
