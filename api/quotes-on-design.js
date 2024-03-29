import got from 'got';

export default async (req, res) => {
  const normalizeQuoteData = (apiData) => {
    const returnData = apiData.map((quoteData) => {
      const { content, excerpt, link: quoteLink, title } = quoteData || null;
      const { rendered: quoteExcerpt } = excerpt;
      const { rendered: quoteHtml } = content;
      const { rendered: quoteAuthor } = title;

      return {
        quoteExcerpt,
        quoteHtml,
        quoteAuthor,
        quoteLink,
      };
    });
    return returnData;
  };

  const returnData = await got
    .get('https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand')
    .then((response) => normalizeQuoteData(response.body))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
  res.status(200).json(returnData);
};
