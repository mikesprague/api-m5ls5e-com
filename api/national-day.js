const axios = require('axios').default;

const dedupeArrayOfObjects = (objArray, key) => [
  ...new Map(objArray.map((item) => [item[key], item])).values(),
];

module.exports = async (req, res) => {
  const allData = [];

  try {
    const nationalTodayData = await axios
      .get('https://api.m5ls5e.com/api/national-today')
      .then((response) => response.data);

    allData.push(...nationalTodayData);

    const nationalDayCalendarData = await axios
      .get('https://api.m5ls5e.com/api/national-day-calendar')
      .then((response) => response.data);

    allData.push(...nationalDayCalendarData);

    const finalData = dedupeArrayOfObjects(allData, 'title');
    console.log(finalData);

    res.setHeader('Cache-Control', 'max-age=3600, s-maxage=3600');
    res.status(200).json(finalData);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
