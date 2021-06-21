const axios = require('axios').default;

module.exports = async (req, res) => {
  const { limit = 10, sub = 'popular' } = req.query;
  const redditPosts = await axios
    .get(`https://www.reddit.com/r/${sub}.json?limit=${limit}`)
    .then((response) => {
      const { children } = response.data.data;
      const returnData = children.map((child) => child.data);
      return returnData;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
  res.status(200).json(redditPosts);
};
