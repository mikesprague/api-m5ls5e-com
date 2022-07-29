import got from 'got';
import cheerio from 'cheerio';

// data source: https://nationaldaycalendar.com

process.env.TZ = 'America/New_York';

export default async (req, res) => {
  const allData = [];
  const pageData = await got
    .get('https://nationaldaycalendar.com/')
    .then((response) => response.body)
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
  const $ = cheerio.load(pageData);
  const groupSelector = 'div.sep_month_events';
  const groupData = $(groupSelector);
  const days = $(groupData).find(
    '.eventon_list_event.evo_eventtop.scheduled.event',
  );
  for await (const day of $(days)) {
    const title = $(day).find('span.evcal_event_title').text().trim();
    const link = $(day).find('a').first().attr('href').trim();
    // console.log(title, link);
    const descriptionData = await got(link)
      .then((response) => response.body)
      .catch((error) => {
        console.error(error);
        res.status(500).json(error);
      });
    const selector = '#ff-main-container > main > article > section';
    const $desc = cheerio.load(descriptionData);
    const description = $desc(selector).find('h2 ~ p').first().text().trim();
    console.log(description);
    if (title && link && description) {
      allData.push({
        title,
        link,
        description,
      });
    }
  }
  res.setHeader('Cache-Control', 'max-age=3600, s-maxage=3600');
  res.status(200).json(allData);
};
