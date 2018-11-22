const Search = require('../../src/source/qiancheng/search')
const assert = require('assert')
const chalk = require('chalk')

describe('qiancheng', function(){
  it('Search:hasdata',function(done){
    this.timeout(0)
    let search = new Search('前端', (err) => {
      assert(!err, '抓取有误')
      return false
    })
    search.start().then((allJobs) => {
      assert(allJobs.length, '应该要抓取到数据的')
      console.log(chalk.green(`抓取到${allJobs.length}条职位数据`))
      done()
    })
  })

  it('Search:500data', function(done){
    this.timeout(0)
    let search = new Search('后端', (err, count) => {
      assert(!err, '抓取有误')
      return count < 10
    })

    search.start().then(allJobs => {
      assert(allJobs.length == 50 * 10, '应该要抓取到500条数据的')
      console.log(chalk.green(`抓取到${allJobs.length}条职位数据`))
      done()
    })
  })

  it('Search:nodata', function(done) {
    this.timeout(0)
    let search = new Search('布拉暴女布拉暴女', (err) => {
      assert(!err, '抓取有误')
      return false
    })

    search.start().then(allJobs => {
      assert(!allJobs.length, '不应该要抓取到数据的')
      console.log(chalk.green(`抓取到${allJobs.length}条职位数据`))
      done()
    })
  })

  /* 多个search */
  it('Search:multiple-search', function(done){
    this.timeout(0)
    let search1 = new Search('前端', (err, count) => {
      assert(!err, '抓取有误')
      return count < 5
    })

    let search2 = new Search('后端', (err, count) => {
      assert(!err, '抓取有误')
      return count < 3
    })

    Promise.all([search1.start(), search2.start()])
      .then(([jobs1, jobs2]) => {
        assert(jobs1.length == 50 * 5, `search1 应该有250条数据,find ${jobs1.length}`)
        assert(jobs2.length == 50 * 3, `search2 应该有150条数据,find ${jobs2.length}`)
        done()
      })
  })
  
})