const axios = require('axios');
(async () => {

  const landCd = '1171010400101210000'
  const sysRegno = '117102018000535'
  const raRegno = '11710-2018-00521'

  const response = await axios.post(
    'http://land.songpa.go.kr/land/wsklis/getSvc0000049.do',
    `svcCode=SVC0000049&landCd=${landCd}&raRegno=${raRegno}&cmpNm=&companyRepresentation=&telNo=&startNum=1&endNum=10`,
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

  console.log(response.data)
})()