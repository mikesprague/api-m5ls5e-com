const axios = require('axios').default;
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const feedData = await axios
    .get('http://nationaldaycalendar.com/feed/')
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
    });
  // console.log(feedData);
  const feed$ = cheerio.load(feedData, {
    xml: {
      xmlMode: true,
      recognizeCDATA: true,
      normalizeWhitespace: true,
      decodeEntities: true,
    },
  });
  const firstItem = feed$('item').first();
  const pageUrl = firstItem.find('guid').text();
  // console.log(pageUrl);

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
