/**
 * 爬取前程无忧某个地区的职位信息
 */

const get = require('./get')
const cheerio = require('cheerio')
const job = require('./job')

/**
 * 
 * @param {string} url 
 * 前程无忧的招聘信息的url都在底部的分页上面
 */
function getHtml(url){
  return get.getPageHtml(url, 'gbk')
}

/**
 * @param {*} city 
 * 获取某个市所有的招聘信息
 */
async function getJobs(city){
  // 暂时固定入口列表页为广州， city参数不适用先
  //const indexPage = 'https://search.51job.com/list/030200,000000,0000,00,9,99,%2520,2,1.html?lang=c&stype=&postchannel=0000&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&providesalary=99&lonlat=0%2C0&radius=-1&ord_field=0&confirmdate=9&fromType=&dibiaoid=0&address=&line=&specialarea=00&from=&welfare='
  const indexPage = 'https://search.51job.com'
  let pages = [],
    jobs = [],
    currentPage = 0, // 当前正在加载和处理的页码
    pageUrl = ''

  while(1){
    if(currentPage == 0){
      pageUrl = indexPage
    }else {
      for(let i = +currentPage + 1 , length = pages.length; i < length; i++){
        pageUrl = pages[i]
        // 如果有些页码上没有link ，那么就跳到下一页
        if(pageUrl){
          break
        }else {
          currentPage ++ 
        }
      }
    }
    try {
      if(pageUrl)
      currentPage = await getAndHandlePage(pageUrl, jobs, pages)

    } catch (error) {
      // 获取html 失败
      // 获取下一页面
      console.log(`获取第${currentPage + 1}页数据失败 error:${error}`)
    }
    console.log('抓取第',currentPage, '页')
    if(currentPage >= pages.length - 1 || (currentPage >= 100)){
      // 获取完成
      return jobs
    }
  }
  
}

/**
 * 得到页面的列表数据和分页数据
 */
function getAndHandlePage(pageUrl, jobs = [], pages = []){
  return getHtml(pageUrl).then(html => {
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
    
    // 当前页面的分页数据, 将页码和链接存起来
    // 有.on class的页码的链接就是当前页面
    pagenations = $('li', pagenations)
    let onPage = 0
    for(let i = 1, length = pagenations.length; i < length - 1; i++){
      let item = pagenations.eq(i)
      pages[item.text().trim() || 0] = item.hasClass('on') ? pageUrl : $('a', item).attr('href')
      if(item.hasClass('on')){
        onPage = item.text().trim()
      }
    }
    return onPage
  })
}



module.exports = {
  getHtml,
  getJobs
}

