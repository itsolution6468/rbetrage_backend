const Product = require("../../models/Product");
const axios = require("axios");

exports.getScrappingProducts = async () => {
  try {
    // Fetch data from the FastAPI endpoint
    const response = await axios.get("http://127.0.0.1:5000/scrape"); // Update with your actual FastAPI URL

    if (!response.data || response.data.message) {
      console.log(
        "No data to update:",
        response.data.message || "Empty response"
      );
      return;
    }

    // Loop through the products and save them to MongoDB
    const products = response.data;

    for (const product of products) {
      const { name, current_price, link } = product;

      // Insert or update the product in the MongoDB collection
      await Product.updateOne(
        { imageUrl: link }, // Use the 'link' field as a unique identifier
        {
          $set: {
            marketPlace: "Alibaba",
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
