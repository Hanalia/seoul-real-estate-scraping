
const axios = require('axios');
let fs = require("fs")


// helper functions
const parseDate = (datestring) => { return (datestring.substring(0, 4) + "-" + datestring.substring(4, 6) + "-" + datestring.substring(6, 8)) }


// first function to output basic structure of the object
async function getBld(bjdongCd, bonbeon, bubeon) {
  try {
    const response = await axios.post(
      'http://land.songpa.go.kr/land/eais/getBldrgstList.do',
      new URLSearchParams({
        'sggCd': '11710',
        'bjdongCd': bjdongCd, //'10400',
        'landGbn': '1',
        'bonbeon': bonbeon, //'0007',
        'bubeon': bubeon //'0008'
      }),
      {
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          'Connection': 'keep-alive',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Origin': 'http://land.songpa.go.kr',
          'Referer': 'http://land.songpa.go.kr/land/wskras/generalInfo.do',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );
    const resultObject = response.data['result'][0]
    console.log({ resultObject })
    const picked = (({ bldrgstPk, bldNm, sggNm, bjdongNm, beonji, regstrKindNm, mainPurpsNm, strctNm, totarea, flrCnt }) => ({ bldrgstPk, bldNm, sggNm, bjdongNm, beonji, regstrKindNm, mainPurpsNm, strctNm, totarea, flrCnt }))(resultObject);
    return picked
  } catch (error) {
    console.log(error);
  }
}


// second function, input is initial building object, output is building object with additional properties
async function getFinalBld(bldObject) {

  const response = await axios.post(
    'http://land.songpa.go.kr/land/eais/getTitleInfo.do',
    new URLSearchParams({
      'bldrgstPk': bldObject.bldrgstPk
    }),
    {
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'http://land.songpa.go.kr',
        'Referer': 'http://land.songpa.go.kr/land/wskras/generalInfo.do',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }

  );
  const resultObject = response.data['result']

  const newObject = (({ platArea, archArea, bcRat, vlRat, etcStrct, etcRoof, pmsDay, stcnsDay, useaprDay }) => ({ platArea, archArea, bcRat, vlRat, etcStrct, etcRoof, pmsDay, stcnsDay, useaprDay }))(resultObject);
  const objects = [bldObject, newObject]
  const finalResultObject = Object.assign(...objects)
  return finalResultObject
}


// Importing the fs module

// Intitializing the readFileLines with the file
const readFileLines = filename =>
  fs.readFileSync(filename)
    .toString('UTF8')
    .split('\n');

// Calling the readFiles function with file name

const sleep = ms => new Promise(r => setTimeout(r, ms));

const pad = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
const convertToCSV = async (arr, filename) => {
  const array = [Object.keys(arr[0])].concat(arr)
  const convertedArray = array.map(row => {
    return Object.values(row).map(value => {
      return typeof value === 'string' ? JSON.stringify(value.replaceAll('"', "'")) : value
    }).toString()
  }).join('\n')

  fs.writeFile(`${filename}.csv`, convertedArray, "utf8", () => {
  });

}

(async () => {

  //get the txt
  let arr = readFileLines('./modified.txt')
    .map(item => item.split(" "))
    .map(item => ({ bonbeon: pad(item.slice(-3)[0], 4), bubeon: pad(item.slice(-1)[0], 4) }));

  const testinput = arr

  let finalResult = []

  for (const item of testinput) {
    await sleep(500)
    try {
      const bjdongCd = '10400'
      const { bonbeon, bubeon } = item
      const bld = await getBld(bjdongCd, bonbeon, bubeon)
      const finalbld = await getFinalBld(bld)
      finalResult.push(finalbld)
    } catch (error) {
      console.log(error);
    }


  }

  convertToCSV(finalResult, "송파동건물")
})()

