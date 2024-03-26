const puppeteer = require('puppeteer');
const sanitize = require("sanitize-filename");

// List of URLs to take screenshots of
const urls = [
    'https://wjwealth.com/',
    'https://wjwealth.com/who-we-are/',
    'https://wjwealth.com/who-we-are/team/'
    // Add more URLs here
];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set the viewport to 1920x1080
    await page.setViewport({width: 1920, height: 1080});

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        await page.goto(url, {waitUntil: 'networkidle2'});
        const title = await page.title();
        
        // Sanitize the title to ensure it's a valid filename
        const sanitizedTitle = sanitize(title).replace(/ /g, "_");

        console.log(`Taking screenshot of: ${url} - Title: ${title}`);
        await page.screenshot({path: `${sanitizedTitle}-${i + 1}.png`, fullPage: true});
    }

    await browser.close();
    console.log('Finished taking screenshots');
})();

// You need to install the 'sanitize-filename' package to use it for sanitizing titles
// Run `npm install sanitize-filename` to add it to your project
