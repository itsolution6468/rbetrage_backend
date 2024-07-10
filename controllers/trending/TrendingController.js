const { ApifyClient } = require("apify-client");
const puppeteer = require("puppeteer");
const Product = require("../../models/Product");

exports.getTwitterTrendingProducts = async (req, res) => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to Twitter's trending page
  await page.goto("https://twitter.com/explore/tabs/trending", {
    waitUntil: "networkidle2",
  });

  // Wait for the trending topics to load
  await page.waitForSelector('[aria-label="Timeline: Trending now"]');

  // Extract trending topics
  const trendingTopics = await page.evaluate(() => {
    const trends = [];
    const trendElements = document.querySelectorAll(
      '[aria-label="Timeline: Trending now"] div span'
    );

    trendElements.forEach((element) => {
      if (element.textContent) {
        trends.push(element.textContent);
      }
    });

    return trends;
  });

  // Close the browser
  await browser.close();

  // Log the trending topics
  console.log("Trending Topics:");
  res.send(trendingTopics);
  // trendingTopics.forEach((topic, index) => {
  //   console.log(`${index + 1}. ${topic}`);
  // });
};

exports.getFacebookTrendingProducts = async (req, res) => {
  try {
    const client = new ApifyClient({
      token: "apify_api_a8zOeXZN0VNLaYv5qxEEjMshBjJmrG0sFtAw",
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
        url: `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(
          keyword
        )}`,
        deepScrape: false,
        getProfileUrls: false,
        cursor: "",
      };

      const run = await client.actor("Y0QGH7cuqgKtNbEgt").call(input);

      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      items.forEach((item) => {
        const newProduct = new Product({
          marketPlace: "Facebook",
          id: item.id,
          title: item.marketplace_listing_title,
          url: item.primary_listing_photo.image
            ? item.primary_listing_photo.image.uri
            : "",
          imageUrl: item.primary_listing_photo.image
            ? item.primary_listing_photo.image.uri
            : "",
          price: item.listing_price.formatted_amount,
          category: keyword,
          other: (() => {
            const others = { ...item };

            delete others.id;
            delete others.marketplace_listing_title;
            delete others.primary_listing_photo.image.uri;
            delete others.listing_price.formatted_amount;

            return others;
          })(),
        });
        newProduct.save();
      });
    }
    res.json("Scraping Success!");
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Scraping failed" });
  }
};
