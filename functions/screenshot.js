const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {
    let result = null;
    let browser = null;
    
    try {
        const urls = JSON.parse(event.body).urls;
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        const screenshots = [];

        for (const url of urls) {
            await page.goto(url, { waitUntil: 'networkidle2' });
            const screenshot = await page.screenshot({ encoding: 'base64' });
            screenshots.push(screenshot);
        }

        result = { statusCode: 200, body: JSON.stringify({ message: "Screenshots taken successfully", screenshots }) };
    } catch (error) {
        console.error('Error taking screenshots:', error);
        result = {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to take screenshots' }),
        };
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    return result;
};
