const Apify = require("apify");

Apify.main(async () => {
  const input = await Apify.getInput();
  const { searchKeywords, maxResults } = input;

  const requestList = await Apify.openRequestList(
    "start-urls",
    searchKeywords.map((keyword) => ({
      url: `https://www.etsy.com/search?q=${keyword}`,
    }))
  );

  const crawler = new Apify.PuppeteerCrawler({
    requestList,
    handlePageFunction: async ({ page }) => {
      const products = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll(".v2-listing-card").forEach((item) => {
          const title =
            item.querySelector(".v2-listing-card__info h3")?.innerText.trim() ||
            "";
          const price =
            item.querySelector(".currency-value")?.innerText.trim() || "";
          const url =
            item.querySelector(".v2-listing-card__info a")?.href || "";
          const image =
            item.querySelector(".v2-listing-card__img img")?.src || "";

          items.push({ title, price, url, image });
        });
        return items;
      });

      await Apify.pushData(products);
    },
    handleFailedRequestFunction: async ({ request }) => {
      console.log(`Request ${request.url} failed too many times`);
    },
  });

  await crawler.run();
});
