const axios = require('axios');

(async () => {
  const response = await axios.post(
    'http://land.songpa.go.kr/land/eais/getTitleInfo.do',
    new URLSearchParams({
      'bldrgstPk': '11710-21931'
    }),
    {
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'WL_PCID=16672171959837017514105; rentcookie=done',
        'Origin': 'http://land.songpa.go.kr',
        'Referer': 'http://land.songpa.go.kr/land/wskras/generalInfo.do',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }

  );
  console.log(response.data)
})()