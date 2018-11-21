const assert = require('assert')
const queue = require('../../src/core/queue')
const chalk = require('chalk')
describe('core', function(){
  this.timeout(0)
  it('queue:9', function(done){
    let asyncQueue = new queue.AsyncQueue()
    let count = 0
    let gp = () => {
      return  (new Promise((resolve, reject) => {
        setTimeout(resolve, 1000)
      })).then(() => { count ++ })
    }
    let gps = []
    for(let i = 0; i < 9; i++ ){
      gps.push(gp)
    }
    asyncQueue.push(gps)

    setTimeout(() => {
      assert(count == 9, `应该resolve 9个promise, current count:${count}`)
      console.log(chalk.green(`count:${count}`))
      done()
    },1100)
  })

  it('queue:100', function(done){
    let asyncQueue = new queue.AsyncQueue()
    let count = 0
    let gp = () => {
      return  (new Promise((resolve, reject) => {
        setTimeout(resolve, 1000)
      })).then(() => { count ++ })
    }
    let gps = []
    for(let i = 0; i < 100; i++ ){
      gps.push(gp)
    }

    asyncQueue.push(gps)
    setTimeout(() => {
      assert(count == 100, `应该resolve 100个promise, current count:${count}`)
      console.log(chalk.green(`count:${count}`))
      done()
    },11000)
  })

  it('queue:namespace', function(done){
    let asyncQueue = new queue.AsyncQueue()
    let count1 = 0, count2 = 0
    let gp1 = () => {
      return () => {
        return  (new Promise((resolve, reject) => {
          setTimeout(resolve, Math.floor(Math.random() * 1000) * 2)
        })).then(() => { count1 ++ })
      }
    }
    let gp2 = () => {
      return () => {
        return  (new Promise((resolve, reject) => {
          setTimeout(resolve, Math.floor(Math.random() * 1000) * 2)
        })).then(() => { count2 ++ })
      }
    }


    let gps1 = [], gps2 = []
    for(let i = 0; i < 20; i++ ){
      gps1.push(gp1())
      gps2.push(gp2())
    }

    let gps1finish = false, gps2finish = false
    asyncQueue.push(gps1, 'gps1').on('zero:gps1', () => {
      assert(count1 == 20, 'gps1 应该resolve20个')
      console.log('gps1 finish')
      gps1finish = true
      if(gps2finish) done()
    })
    asyncQueue.push(gps2, 'gps2').on('zero:gps2', () => {
      assert(count1 == 20, 'gps2 应该resolve20个')
      console.log('gps2 finish')
      gps2finish = true
      if(gps1finish) done()
    })
  })


})