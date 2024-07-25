const { ApifyClient } = require("apify-client");
const Product = require("../../models/Product");

exports.getEbayProducts = async (req, res) => {
  // Initialize the ApifyClient with API token
  const client = new ApifyClient({
    token: "apify_api_kFqcgPfieaadnJUo8JMLKzZoqC4Vlz3IEUAU",
  });

  // Prepare Actor input
  const input = {
    startUrls: [
      {
        url: "https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2499334.m570.l1313&_nkw=massage%2Brecliner%2Bchair&_sacat=6024",
      },
    ],
    maxItems: 10,
    proxyConfig: {
      useApifyProxy: true,
    },
  };

  // Run the Actor and wait for it to finish
  const run = await client.actor("PBSxkfoBWghbE2set").call(input);

  // Fetch and print Actor results from the run's dataset (if any)
  console.log("Results from dataset");
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  items.forEach((item) => {
    console.dir(item);
    const newProduct = new Product({
      marketPlace: "eBay",
      title: item.title,
      url: item.url,
      prices: [item.price],
      brand: item.brand,
      categories: item.categories,
      other: (() => {
        // Create a shallow copy of item to avoid mutating the original object
        const others = { ...item };

        // Delete the properties that are already explicitly set outside of 'other'
        delete others.title;
        delete others.url;
        delete others.price;
        delete others.categories;
        delete others.brand;

        return others;
      })(),
    });

    newProduct
      .save()
      .then(() => {
        res.send("Successfully Scraped!!!");
      })
      .catch((err) => {
        res.send("Something went wrong! Please try again.");
      });
  });
};
