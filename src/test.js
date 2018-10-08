const axios = require('axios')
const request  = require('request')
const iconv = require('iconv-lite')
const url = 'https://search.51job.com/list/030200,000000,0000,00,9,99,%2520,2,1.html?lang=c&stype=&postchannel=0000&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&providesalary=99&lonlat=0%2C0&radius=-1&ord_field=0&confirmdate=9&fromType=&dibiaoid=0&address=&line=&specialarea=00&from=&welfare='
const url = 'https://search.51job.com/list/030200,000000,0000,00,9,99,%2B,2,2.html?lang=c&stype=1&postchannel=0000&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&lonlat=0%2C0&radius=-1&ord_field=0&confirmdate=9&fromType=&dibiaoid=0&address=&line=&specialarea=00&from=&welfare='

let buffer = Buffer.alloc(0)
request.get(url).on('data', chunlk => {
  console.log('chunlk',chunlk)
  buffer = Buffer.concat([chunlk,buffer])
}).on('end', chunlk => {
  let gbkData =iconv.decode(Buffer.from(buffer), 'gbk')
  console.log(gbkData)
})