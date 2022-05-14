import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer';

export default async (req, res) => {
  const browser = await puppeteer.launch(
    process.env.AWS_LAMBDA_FUNCTION_VERSION
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
        }
      : {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
  );

  const page = await browser.newPage();
  await page.emulateTimezone('America/New_York');
  await page.goto('https://www.nytimes.com/games/wordle/index.html');

  const gameState = await page.evaluate(() =>
    // eslint-disable-next-line no-undef
    window.localStorage.getItem('nyt-wordle-state'),
  );
  const { solution } = JSON.parse(gameState);
  console.log(solution);

  await browser.close();

  res.setHeader('Cache-Control', `max-age=7200, s-maxage=7200`);
  res.status(200).json(solution);
};
