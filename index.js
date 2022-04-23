
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.sii.cl/servicios_online/1047-nomina_inst_financieras-1714.html');
    let data = await page.evaluate(() => {
        const json = [];
        let titlePage = document.querySelector('.title').innerHTML
        titlePage = titlePage.replace('<script type=\"text/javascript\">menuSOL.escribeLink(1715, \"\", \"\", \"\")</script>', '').trimStart().trimEnd();
        const headText = document.querySelector('.contenido').querySelectorAll('p');
        const titles = document.querySelector('thead').querySelectorAll('th');
        const items = document.querySelector('tbody').querySelectorAll('tr');

        const arr = []
        headText.forEach((h, i) => {
            arr.push(h.innerText)
        })

        const headers = {
            titlePage,
            text: arr[1]
        }

        json.push(headers)

        items.forEach(i => {
            const obj = {}
            const arr = []
            const data = i.querySelectorAll('td')
            data.forEach(d => arr.push(d.innerText))
            titles.forEach((h, i) => {
                obj[h.innerText] = arr[i]
            })
            json.push(obj);
        })
        return json
    })
    fs.writeFileSync(__dirname + '/result.json', JSON.stringify(data));
    await browser.close();
})();





