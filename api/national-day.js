import axios from 'axios';

const dedupeArrayOfObjects = (objArray, key) => [
  ...new Map(objArray.map((item) => [item[key], item])).values(),
];

export default async (req, res) => {
  const allData = [];

  try {
    const nationalDayCalendarData = await axios
      .get('https://api.m5ls5e.com/api/national-day-calendar')
      .then((response) => response.data);
    allData.push(...nationalDayCalendarData);

    const nationalTodayData = await axios
      .get('https://api.m5ls5e.com/api/national-today')
      .then((response) => response.data);
    // allData.push(...nationalTodayData);

    const regex = /(-|\s|world|international|national|day|eve)/gi;
    const titlesToCompare = nationalDayCalendarData.map((day) =>
      day.title.toLowerCase().replace(regex, ''),
    );
    // console.log('titlesToCompare: ', titlesToCompare);

    // eslint-disable-next-line no-restricted-syntax
    for await (const day of nationalTodayData) {
      const cleanTitle = day.title.toLowerCase().replace(regex, '');
      if (!titlesToCompare.includes(cleanTitle)) {
        allData.push(day);
      }
    }

    const finalData = dedupeArrayOfObjects(allData, 'title');
    console.log(finalData);

    res.setHeader('Cache-Control', 'max-age=3600, s-maxage=3600');
    res.status(200).json(finalData);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
