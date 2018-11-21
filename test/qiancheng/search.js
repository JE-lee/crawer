const Search = require('../../src/source/qiancheng/search')
const assert = require('assert')
const chalk = require('chalk')

describe('qiancheng', function(){
  it('listpage:hasdata', (done) => {
    let search = new Search('前端', (err) => {
      assert(!err, '抓取有误')
      return false
    })
    search.on('finish', (allJobs) => {
      assert(allJobs.length, '应该要抓取到数据的')
      console.log(chalk.green(`抓取到${allJobs.length}条职位数据`))
      done()
    })
  })

  it('listpage:500data', function(done){
    this.timeout(0)
    let search = new Search('后端', (err, count) => {
      assert(!err, '抓取有误')
      return count < 10
    })
    search.on('finish', (allJobs) => {
      assert(allJobs.length == 50*10, '应该要抓取到500条数据的')
      console.log(chalk.green(`抓取到${allJobs.length}条职位数据`))
      done()
    })
  })

  it('listpage:nodata', (done) => {
    let search = new Search('布拉暴女布拉暴女', (err) => {
      assert(!err, '抓取有误')
      return false
    })
    search.on('finish', (allJobs) => {
      assert(!allJobs.length, '不应该要抓取到数据的')
      console.log(chalk.green(`抓取到${allJobs.length}条职位数据`))
      done()
    })
  })
  
})