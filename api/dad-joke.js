const axios = require('axios').default;

module.exports = async (req, res) => {
  const apiUrl = 'https://icanhazdadjoke.com';
  const returnData = await axios
    .get(apiUrl, {
      headers: {
        Accept: 'application/json',
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
  res.status(200).json(returnData);
};
