const { ApifyClient } = require("apify-client");
const Product = require("../../models/Product");

exports.getAmazonProducts = async (req, res) => {
  try {
    const client = new ApifyClient({
      token: "apify_api_TAOWd1TFgmF639wPIn4EubmXY4IR0U32jZOv",
    });

    const input = {
      searchKeywords: [
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
      ],
      maxResults: 50,
    };

    for (const keyword of input.searchKeywords) {
      const run = await client.actor("BG3WDrGdteHgZgbPK").call({
        categoryOrProductUrls: [
          {
            url: `https://www.amazon.com/s?k=${keyword}`,
          },
        ],
        maxItemsPerStartUrl: input.maxResults,
        proxyCountry: "AUTO_SELECT_PROXY_COUNTRY",
        useCaptchaSolver: false,
        scrapeProductVariantPrices: false,
      });

      const { items } = await client.dataset(run.defaultDatasetId).listItems();

      items.forEach((item) => {
        const newProduct = new Product({
          marketPlace: "Amazon",
          id: item.asin,
          title: item.title,
          url: item.url,
          imageUrl: item.thumbnailImage,
          price: item.price ? item.price.currency + item.price.value : "",
          category: keyword,
          other: (() => {
            const others = { ...item };

            delete others.asin;
            delete others.title;
            delete others.url;
            delete others.thumbnailImage;
            delete others.price;

            return others;
          })(),
        });
        newProduct.save();
      });
    }

    res.json("Scraping Success!");
  } catch (error) {
    res.status(500).json({ error: "Scraping failed" });
  }
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
      res.status(200).send(result);
    });
};
