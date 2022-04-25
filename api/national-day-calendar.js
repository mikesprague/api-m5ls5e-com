const axios = require('axios').default;
const cheerio = require('cheerio');

// data source: https://nationaldaycalendar.com

module.exports = async (req, res) => {
  const allData = [];
  const pageData = await axios
    .get('https://nationaldaycalendar.com/read/')
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
    });
  const page$ = cheerio.load(pageData);
  const firstLinkSelector =
    '#ff-main-container > main > article > section > div > div:nth-child(1) > div > div > div:nth-child(1)';
  const firstItem = page$(firstLinkSelector);
  const firstLink = page$(firstItem).find('a');
  const pageUrl = firstLink.attr('href');
  await axios
    .get(pageUrl)
    .then((response) => {
      const $ = cheerio.load(response.data);
      // console.log(response.data);
      const titleSelectors = ['.ndc-text- h2', '.ndc-text- h3'];
      titleSelectors.forEach((titleSelector) => {
        $(titleSelector).each((idx, elem) => {
          const title = $(elem).text().trim().toUpperCase();
          const link = $(elem).next('p').find('a').attr('href');
          const description = $(elem)
            .next('p')
            .text()
            .replace('Read more…', '');
          if (title && description && link) {
            allData.push({
              title,
              description,
              link,
            });
          }
        });
      });
      res.setHeader('Cache-Control', 'max-age=3600, s-maxage=3600');
      res.status(200).json(allData);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
};
