const axios = require('axios');
const fs = require('fs')


async function convertToCSV(arr, filename) {
  const array = [Object.keys(arr[0])].concat(arr)
  const convertedArray = array.map(row => {
    return Object.values(row).map(value => {
      return typeof value === 'string' ? JSON.stringify(value.replaceAll('"', "'")) : value
    }).toString()
  }).join('\n')

  fs.writeFile(`${filename}.csv`, convertedArray, "utf8", () => {
  });

}

const sleep = ms => new Promise(r => setTimeout(r, ms));


(async () => {

  // GURANTEE, REG_YMD
  async function addDate(item) {
    const response = await axios.post(
      'http://land.songpa.go.kr/land/wsklis/getSvc0000049.do',
      `svcCode=SVC0000049&landCd=${item.landCd}&raRegno=${item.raRegno}&cmpNm=&companyRepresentation=&telNo=&startNum=1&endNum=10`,
      {
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          'Connection': 'keep-alive',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Origin': 'http://land.songpa.go.kr',
          'Referer': 'http://land.songpa.go.kr/land/broker/brokerInfo.do',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );
    res = (response.data.result[0])
    return { ...item, GURANTEE: res?.GURANTEE, REG_YMD: res?.REG_YMD }
  }


  let finalArray = []
  let pageNo = 1
  let pageLimit = 10
  while (pageNo <= pageLimit) {
    await sleep(100)
    const response = await axios.post(
      'http://land.songpa.go.kr/land/broker/searchBrokerList.do',
      new URLSearchParams({
        'sggCd': '11710',
        'bjdongCd': '1171010500',
        'gubun': '2',
        'keyword': '',
        'rows': '10',
        'page': pageNo
      }),
      {
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          'Connection': 'keep-alive',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Origin': 'http://land.songpa.go.kr',
          'Referer': 'http://land.songpa.go.kr/land/broker/brokerInfo.do',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );
    const items = await (response.data.result)

    for (const item of items) {
      pageLimit = Math.ceil(item.totalCount / 10)
      const modifiedItem = await addDate(item)
      finalArray.push(modifiedItem)
    }



    pageNo++
  }

  convertToCSV(finalArray, "석촌동")
})();;
