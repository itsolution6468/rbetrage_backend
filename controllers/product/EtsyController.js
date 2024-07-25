const { ApifyClient } = require("apify-client");
const Product = require("../../models/Product");

exports.getEtsyProducts = async (req, res) => {
  try {
    // Initialize the ApifyClient with API token
    const client = new ApifyClient({
      token: "apify_api_kFqcgPfieaadnJUo8JMLKzZoqC4Vlz3IEUAU",
    });

    // Prepare Actor input
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

    const inputTemplate = {
      includeDescription: false,
      includeVariationPrices: false,
      maxItems: 500,
      endPage: 10,
      extendOutputFunction: ($) => {
        const result = {};
        // Uncomment to add a title to the output
        // result.title = $('title').text().trim();

        return result;
      },
      customMapFunction: (object) => {
        return { ...object };
      },
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ["RESIDENTIAL"],
      },
    };

    for (const keyword of searchKeywords) {
      const input = {
        ...inputTemplate,
        startUrls: [`https://www.etsy.com/search?q=${keyword}`],
      };

      // Run the Actor and wait for it to finish
      const run = await client.actor("MiEVd9O3R4Td5AbV9").call(input);

      // Fetch Actor results from the run's dataset
      const { items } = await client.dataset(run.defaultDatasetId).listItems();

      // Process and save the items to the database
      for (const item of items) {
        const newProduct = new Product({
          marketPlace: "Etsy",
          id: item.id,
          title: item.name,
          url: item.url,
          imageUrl: item.images[0],
          price: item.Price,
          category: keyword,
          other: (() => {
            const others = { ...item };
            delete others.id;
            delete others.name;
            delete others.url;
            delete others.images;
            delete others.Price;
            return others;
          })(),
        });
        await newProduct.save();
      }
    }

    res.json("Scraping Success!");
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Scraping failed" });
  }
};
