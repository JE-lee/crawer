
const queue = require('../../core/queue')
const get = require('../../core/get')
const parse = require('./parse')
const chalk = require('chalk')
const uuidv1 = require('uuid/v1')

let asyncQueue =new  queue.AsyncQueue(20)

module.exports = class Search{
  /**
   * 
   * @param {String} key 
   * @param {Function} limit  // 接收三个参数 (err, listPagecount, html)
   */
  constructor(key, limit){
    this.searchKey = key
    this.limit = limit
    this.pageCount = 0 // 已经爬取的页面数量
    this.finish = false
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
    let promise 
    try {
      promise = get.getPageHtml(url, 'gbk')
    } catch (error) {
      console.log(chalk.red(error))
      promise = Promise.resolve('')
    }
    return promise
  }
  // 返回一个promise
  start(){
    return this._search()
  }
  async getListpage(){
    let jobs = []
    const defaultCount = 100
    while(1){
      let url = Search.generateUrl(this.searchKey, 1),
        html = await Search.getHtml(url),
        pageJob = parse.parseListpage(html)
      jobs = jobs.concat(pageJob)
      this.pageCount ++
      if (this.limit){
        if (!this.limit(null, this.pageCount, pageJob)) break
      } else {
        if(this.pageCount >= defaultCount) break
      }
    }
    return jobs
  }
  getDetailpage(jobs){
    let gps = []
    jobs.forEach(job => {
      gps.push(async () => {
        let html = await Search.getHtml(job.detailLink)
        let detail = parse.parseDetailpage(html)
        job.detail = detail
        //console.log(chalk.green(`抓取${job.title}完成`))
      })
    })

    return jobs.length ? new Promise((resolve) => {
      let namespace = uuidv1()
      asyncQueue.push(gps, namespace)
        .on(`zero:${namespace}`, () => {
          resolve(jobs)
        })
    }) : []
  }
  async _search(){
    let jobs = await this.getListpage()
    jobs = await this.getDetailpage(jobs)
    return jobs
  }
}

