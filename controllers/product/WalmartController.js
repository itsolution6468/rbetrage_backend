const { ApifyClient } = require("apify-client");
const Product = require("../../models/Product");

exports.getWalmartProducts = async (req, res) => {
  try {
    // Initialize the ApifyClient with API token
    const client = new ApifyClient({
      token: "apify_api_1WQapHy8SAdYWdfJC5a7mJyBbsRKQe06TRjK",
    });

    const searchKeywords = [
      "laptop",
      "headphones",
      "smartphone",
      "jewely",
      "shirt",
      "cotton",
      "coat",
      "dress",
      "jeans",
      "jumper",
      "glasses",
      "hats",
    ];

    for (const keyword of searchKeywords) {
      // Prepare Actor input
      const input = {
        startUrls: [
          {
            url: `https://walmart.com/search?q=${keyword}`,
          },
        ],
        maxProductsPerStartUrl: 50,
      };
      // Run the Actor and wait for it to finish
      const run = await client.actor("t4Juw9jWflJjgpynE").call(input);

      // Fetch and print Actor results from the run's dataset (if any)
      const { items } = await client.dataset(run.defaultDatasetId).listItems();

      items.forEach((item) => {
        const newProduct = new Product({
          marketPlace: "Walmart",
          id: item.productId,
          title: item.name,
          url: item.url,
          imageUrl: item.thumbnailUrl,
          price: item.priceInfo.price,
          category: keyword,
          other: (() => {
            // Create a shallow copy of item to avoid mutating the original object
            const others = { ...item };
            // Delete the properties that are already explicitly set outside of 'other'
            delete others.productId;
            delete others.name;
            delete others.url;
            delete others.thumbnailUrl;
            delete others.priceInfo;
            return others;
          })(),
        });
        newProduct.save();
      });
    }
    res.json("Scraping Success!");
  } catch (err) {
    res.status(500).json({ error: "Scraping failed" });
  }
};
