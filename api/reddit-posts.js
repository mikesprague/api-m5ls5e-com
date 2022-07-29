import got from 'got';

export default async (req, res) => {
  const { limit = 10, sub = 'popular' } = req.query;
  const redditPosts = await got
    .get(`https://www.reddit.com/r/${sub}.json?limit=${limit}`)
    .then((response) => {
      const { children } = response.body.data;
      const returnData = children.map((child) => child.data);
      return returnData;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
  res.status(200).json(redditPosts);
};
