const qiancheng = require('./source/qiancheng')
const fs = require('fs')
const path = require('path')
const stream = require('stream')
const chalk = require('chalk')
//const db = require('./db/index')
const Search = require('./source/qiancheng/search')

/*
let start = Date.now()
qiancheng.getJobs().then(jobs => {
  // 写入文件
  let str = ''
  jobs.forEach(item => {
    str += `${item.title}  ${item.company}  ${item.region}  ${item.pay}  ${item.time}\n`
  })
  let file = path.resolve(process.cwd(),'./dist/jobs.txt')
  let strStream = new stream.PassThrough()
  strStream.end(str)   
  strStream.pipe(fs.createWriteStream(file)).on('error', err => {
    console.log('error', err)
  }).on('finish', () => {
    console.log(chalk.green(`抓取完成${jobs.length}`))
    let end = Date.now()
    console.log(chalk.green(`用时${(end - start)/1000}S`))
  })

  // 存入数据库
  //db.insertJobs(jobs).then(db.close)
})*/


let start = Date.now()
let search = new Search('前端', (err, count) => {
  return false
})


search.on('finish',jobs => {
  let end = Date.now()
  console.log(chalk.green(`共抓取${jobs.length}条职位数据，用时${(end - start)/1000}S`))
  // 存入数据库
  db.insertJobs(jobs).then(db.close)
})

