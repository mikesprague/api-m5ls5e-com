const axios = require('axios').default;
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const pageData = await axios
    .get('http://nationaldaycalendar.com/read/')
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
    });
  // console.log(feedData);
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
      const allData = [];
      const titleSelectors = ['.ndc-text- h2', '.ndc-text- h3'];
      titleSelectors.forEach((titleSelector) => {
        $(titleSelector).each((idx, elem) => {
          const link = $(elem).next('p').find('a').attr('href');
          const title = $(elem).text();
          const description = $(elem)
            .next('p')
            .text()
            .replace('Read more…', '');
          if (title.length && description.length && link.length) {
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
