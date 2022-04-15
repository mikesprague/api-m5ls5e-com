const axios = require('axios').default;
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  await axios
    .get('https://nationaltoday.com/what-is-today/')
    .then((response) => {
      const $ = cheerio.load(response.data);
      // console.log(response.data);
      const allData = [];
      const contentSelector = '.day-card .card-content .title-box';

      $(contentSelector).each((idx, elem) => {
        const title = $(elem).find('a').text().trim();
        const description = $(elem).find('p.excerpt').text().trim();
        const link = $(elem).find('a').attr('href').trim();
        const isBirthday = link.toLowerCase().includes('birthday');
        if (title.length && description.length && link.length) {
          allData.push({
            title,
            description,
            link,
            isBirthday,
          });
        }
      });
      console.log(allData);
      res.setHeader('Cache-Control', 'max-age=3600, s-maxage=3600');
      res.status(200).json(allData);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
};
