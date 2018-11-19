
const queue = require('../../core/queue')
const get = require('../../core/get')

let asyncQueue = new queue.asyncQueue()

class Serach{
  constructor(key, limit){
    this.searchKey = key
    this.limit = limit
    this.search()
  }
  /**
  * 
  * @param {String} searchKey 
  * @return {String} 
  * @description 根据搜索关键词生成查询url 
  * 默认搜索范围是广州， 其他搜索条件保持默认值
  * 
  */
 static generateUrl(searchKey, pageNumber = 1){
   let base = 'https://search.51job.com/list/000000,000000,0000,00,9,99,'+
               searchKey + 
               ',2,'+ pageNumber + '.html?lang=c&stype=1&postchannel=0000&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&lonlat=0%2C0&radius=-1&ord_field=0&confirmdate=9&fromType=&dibiaoid=0&address=&line=&specialarea=00&from=&welfare='
   // url需要经过双encode
   base = encodeURI(base)
   return encodeURI(base)
  }
  /**
   * 
   * @param {string} url 
   * 前程无忧的招聘信息的url都在底部的分页上面
   */
  static getHtml(url){
    return get.getPageHtml(url, 'gbk')
  }
  /**
   * 
   * @param {String} pageUrl 
   * @param {Array} jobs 
   * @param {Array} pages 
   */
  static handleListpage(html){
    let jobs = []
    // 当前页面的列表数据
    let $ = cheerio.load(html),
      cells = $('.el', '#resultList'),
      pagenations = $('.dw_page', '#resultList')

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
  }
  async search(){
    let url = this.generateUrl(this.searchKey,1),
      html = await get.getPageHtml(url)，
      jobs = await this.handleListpage(html)
    return jobs
  }
}

