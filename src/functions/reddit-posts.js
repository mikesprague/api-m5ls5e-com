const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
  const { limit = 10, sub = 'popular' } = event.queryStringParameters;
  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  const apiUrl = `https://www.reddit.com/r/${sub}.json?limit=${limit}`;
  console.log(apiUrl);
  const redditPosts = await axios
    .get(`https://www.reddit.com/r/${sub}.json?limit=${limit}`)
    .then((response) => {
      const { children } = response.data.data;
      const returnData = children.map((child) => child.data);
      return returnData;
    })
    .catch((error) => {
      console.error(error);
      return {
        headers: callbackHeaders,
        statusCode: 500,
        body: JSON.stringify(error),
      };
    });
  return {
    headers: callbackHeaders,
    statusCode: 200,
    body: JSON.stringify(redditPosts),
  };
};
