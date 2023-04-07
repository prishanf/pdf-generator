const app = require("express")();

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/api", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);
    let page = await browser.newPage();
    await page.goto(`https://muv-nuxt-app.vercel.app/detailview/${recordId}`,{waitUntil: 'networkidle0'}); 
    const pdf = await page.pdf({
        format:"LETTER",
        printBackground:true,
        margin: {
        left:10,
        right:15,
        top:10,
        bottom:10
        }
    });
    await browser.close();
    res.send(await pdf);
  } catch (err) {
    console.error(err);
    return null;
  }
});

async function handleRequest(recordId:any){
  let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        options = {
        args: [...chromeService.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromeService.defaultViewport,
        executablePath: await chromeService.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
        };
    }else{
        options = {headless: true}
    }
    console.log(options,)
    const browser = await puppeteerService.launch(options);
    const page = await browser.newPage();
    const config = useRuntimeConfig()
    const host = config.public.hostUrl;
    await page.goto(`${host}/detailview/${recordId}`,{waitUntil: 'networkidle0'}); 
    const pdf = await page.pdf({
        format:"LETTER",
        printBackground:true,
        margin: {
        left:10,
        right:15,
        top:10,
        bottom:10
        }
    });
    await browser.close();
    return pdf;
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
