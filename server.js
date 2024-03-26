const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const sanitize = require("sanitize-filename");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory

app.post('/take-screenshots', async (req, res) => {
    const urls = req.body.urls.split('\n').filter(url => url); // Split URLs by newline and filter out any empty strings
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setViewport({width: 1920, height: 1080});

    for (const url of urls) {
        try {
            await page.goto(url, {waitUntil: 'networkidle2'});
            const title = await page.title();
            const sanitizedTitle = sanitize(title).replace(/ /g, "_");
            await page.screenshot({path: `public/screenshots/${sanitizedTitle}.png`, fullPage: true});
        } catch (error) {
            console.error(`Failed to take screenshot of ${url}: ${error}`);
        }
    }

    await browser.close();
    res.send('Screenshots taken successfully');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
