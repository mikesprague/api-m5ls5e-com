import got from 'got';

export default async (req, res) => {
  const apiUrl = 'https://icanhazdadjoke.com';
  const returnData = await got
    .get(apiUrl, {
      headers: {
        Accept: 'application/json',
      },
    })
    .then((response) => response.body)
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
  res.status(200).json(returnData);
};
