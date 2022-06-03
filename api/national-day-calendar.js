import axios from 'axios';
import cheerio from 'cheerio';

// data source: https://nationaldaycalendar.com

process.env.TZ = 'America/New_York';

export default async (req, res) => {
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
      const titleSelectors = [
        'main section h1',
        'main section h2',
        'main section h3',
      ];
      titleSelectors.forEach((titleSelector) => {
        $(titleSelector).each((idx, elem) => {
          const title = $(elem).text().toUpperCase().split('|')[0].trim();
          const link = $(elem).next('p').find('a').attr('href');
          const description = $(elem)
            .next('p')
            .text()
            .replace('Read more…', '');
          console.log(title, description, link);
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
