const { ApifyClient } = require("apify-client");
const Product = require("../../models/Product");

exports.getAliExpressProducts = async (req, res) => {
  // Initialize the ApifyClient with API token
  const client = new ApifyClient({
    token: "apify_api_WbTgFlpRwzCiZdGBiohnLT9QACebme1GLASY",
  });

  // Prepare Actor input
  const input = {
    startUrls: [
      "https://aliexpress.com/category/100003109/women-clothing.html",
      "https://www.aliexpress.com/item/32940810951.html",
    ],
    maxItems: 10,
    searchInSubcategories: true,
    language: "en_US",
    shipTo: "US",
    currency: "USD",
    includeDescription: false,
    maxFeedbacks: 0,
    maxQuestions: 0,
    proxy: {
      useApifyProxy: true,
    },
    extendOutputFunction: ($) => {
      return {};
    },
  };

  // Run the Actor and wait for it to finish
  const run = await client.actor("xYHAh66JcxDGnzs4G").call(input);

  // Fetch and print Actor results from the run's dataset (if any)
  console.log("Results from dataset");
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  items.forEach((item) => {
    console.dir(item);
    const newProduct = new Product({
      marketPlace: "AliExpress",
      title: item.title,
      url: item.link,
      prices: item.prices.map((item) => {
        return item.price;
      }),
      categories: item.categories,
      stock: item.quantity,
      other: (() => {
        // Create a shallow copy of item to avoid mutating the original object
        const others = { ...item };

        // Delete the properties that are already explicitly set outside of 'other'
        delete others.title;
        delete others.link;
        delete others.prices;
        delete others.categories;
        delete others.quantity;

        return others;
      })(),
    });

    newProduct.save().catch((err) => {
      console.log("Something went wrong! Please try again.", err);
    });
  });
};
