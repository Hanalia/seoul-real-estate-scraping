const axios = require('axios');
const fs = require('fs')
const cheerio = require('cheerio');
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

(async () => {

  let finalArray = []
  let pageNo = 1

  while (pageNo < 1000) {
    await sleep(400)
    const response = await axios.get(`https://www.cha.go.kr/sym/ccm/zip/SearchAddr.do?pageIndex=${pageNo}&searchWrd=%ec%86%a1%ed%8c%8c%eb%8f%99`, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'keep-alive',
        // 'Cookie': 'SCOUTER=x4n4q18lpv1rvq; JSESSIONID=zbN1IaB0fW90G83Cakw6BL5nBPhOXNLAJaeUFQZMSL5sCd9ibrFA1Z1a51RDJdZk.cha-was02_servlet_engine1; _harry_ref=https%3A//www.google.com/; _harry_url=https%3A//www.cha.go.kr/sym/ccm/zip/SearchAddr.do; _harry_fid=hh-2109801401; _harry_hsid=A221101191608583819; _harry_dsid=A221101191608583303; XTVID=A221101191608583185; XTSID=A221101191608584734; _harry_lang=ko-KR; xloc=1707X1067',
        'Referer': 'https://www.cha.go.kr/sym/ccm/zip/SearchAddr.do?pageIndex=1&searchWrd=%ec%86%a1%ed%8c%8c%eb%8f%99',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
      }
    });
    const $ = cheerio.load(response.data)

    if ($('tr').length == 2) {
      console.log('empty')
      break;
    }

    $('tr').each((index, element) => {
      if (index != 0) {
        const data = $(element).find('td:nth-child(2)').text()
        console.log(data)
        finalArray.push(data)

      }
    })
    pageNo++
    console.log({ pageNo })
  }
  const resolvedresult = await Promise.all(finalArray)
  let text = resolvedresult.join('\n');

  fs.writeFileSync('modified.txt', text, "utf8");


})();;
// finalArray = finalArray.concat(response.data.commonList)
// pageNo++;



