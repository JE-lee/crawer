
const cheerio = require('cheerio')
const job = require('../job')

module.exports = {
  /**
   * 
   * @param {String} pageUrl 
   * @param {Array} jobs 
   * @param {Array} pages 
   */
  parseListpage: function(html){
    let jobs = []
    // 当前页面的列表数据
    let $ = cheerio.load(html),
      cells = $('.el', '#resultList')

    for(let i = 1, length = cells.length;i< length; i++){
      let cell = cells.eq(i),
        $title = $('.t1 a', cell),
        title = $title.attr('title').trim(),
        detailLink = $title.attr('href').trim(),
        $company = $('.t2 a', cell),
        company = $company.attr('title').trim(),
        companyLink = $company.attr('href').trim(),
        region = $('.t3', cell).text().trim(),
        pay = $('.t4', cell).text().trim(),
        time = $('.t5', cell).text().trim()
      jobs.push(job.createJob({ title, company, region, pay, time, detailLink, companyLink}))
    }
    return jobs
  },
  parseDetailpage: function(html){
    let detail = {},
      $ = cheerio.load(html),
      jobinfo = $('.job_msg').text().trim(),
      index = jobinfo.lastIndexOf('职能类别')
    jobinfo = jobinfo.substr(0, index == -1 ? 0 : index ).trim()
    detail.jobinfo = jobinfo
    return detail
  }
}