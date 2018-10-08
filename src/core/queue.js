/**
 * 维护一个用于
 */
const chalk = require('chalk')
class AsyncQueue{
  constructor(generator){
    if(typeof generator != 'function'){
      console.log(chalk.red('请绑定返回一个promise的异步函数'))
      return 
    }
    // 返回Promise对象的异步函数
    this.asyncGenerator = null;
    // 每一个Promise fullfill 之后执行的回调函数
    this.stepCallback = null;
    // 待生成promise 的队列
    this.queue = [];
    // 当前正在pending 的promise的数量
    this.proCount = 0;
    // 当前已经进入asyncGenerator，生成promise对象的queue中的项的索引下标
    this.currentIndex = -1;
    // 同一时间pending的最大promise数
    this.maxPendingLength = 10;
    this.asyncGenerator = generator
  }
  on(event, callback){
    // queue中某一个promise fullfilled
    if('step'  == event){
      this.stepCallback = callback
    }
  }
  push(payload){
    if(!this.asyncGenerator) return 
    this.queue.push({
      uid: this.queue.length, 
      data: payload
    })
    // 如果promiseQueue 未满，则压入
    if(this.proCount < this.maxPendingLength){
      this._generateFromQueue()
    }
  }
  _generateFromQueue(){
    let queue = this.queue
    if(this.currentIndex < queue.length -1 && (this.proCount < this.maxPendingLength)){
      let argu = queue[++this.currentIndex].data,
        promise = typeof argu != 'undefind' ? this.asyncGenerator(argu) : Promise.reject() // 返回一个promise
      if(!(promise instanceof Promise)) promise = Promise.reject()
      this.proCount ++ 
      let that = this
      promise.then(res => {
        //queue中去除
        this.proCount--

        if(!this.stepCallback) return res
        this.stepCallback({
          payload: argu,
          result: res
        })

        //queue中还有，继续添加
        this._generateFromQueue()
      })
    }

  }
  
}

module.exports = {
  AsyncQueue
}