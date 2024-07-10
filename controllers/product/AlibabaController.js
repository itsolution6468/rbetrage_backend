const { ApifyClient } = require("apify-client");
const Product = require("../../models/Product");

exports.getAlibabaProducts = async (req, res) => {
  try {
    // Initialize the ApifyClient with API token
    const client = new ApifyClient({
      token: "apify_api_lMlF1QBpsjh9mvhZvz6Jq3DHxV2W6N4nEzdO",
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
      const input = {
        keyword: keyword,
        maxResults: 1,
      };
      const run = await client.actor("YfUlqCOQqIofhMmcO").call(input);

      // Fetch Actor results from the run's dataset
      const { items } = await client.dataset(run.defaultDatasetId).listItems();

      // Process and save the items to the database
      for (const item of items) {
        const newProduct = new Product({
          marketPlace: "Alibaba",
          title: item.title,
          url: item.url,
          imageUrl: item.image,
          price: item.price,
          category: keyword,
          other: (() => {
            // Create a shallow copy of item to avoid mutating the original object
            const others = { ...item };

            // Delete the properties that are already explicitly set outside of 'other'
            delete others.title;
            delete others.url;
            delete others.image;
            delete others.price;

            return others;
          })(),
        });

        await newProduct.save(); // Ensure the save operation is awaited
      }
    }

    // Send the response after all products are processed
    res.json("Scraping Success");
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Scraping failed" });
  }
};
