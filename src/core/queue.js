/**
 * 维护一个用于
 */
class AsyncQueue{
  constructor(maxPendignLength = 10){
    
    // 每一个Promise fullfill 之后执行的回调函数
    this.stepCallback = null
    // 待生成promise 的队列
    this.queue = []
    // 当前正在pending 的promise的数量
    this.proCount = 0
    // 当前已经进入asyncGenerator，生成promise对象的queue中的项的索引下标
    this.currentIndex = -1
    // 同一时间pending的最大promise数
    this.maxPendingLength = maxPendignLength
  }
  /**
   * 
   * @param {Function} generator | 异步函数，要求返回一个promise
   */
  push(generator){
    if(typeof generator != 'function') return 
    this.queue.push(generator)
    // 如果promiseQueue 未满，则压入
    if(this.proCount < this.maxPendingLength){
      this._generateFromQueue()
    }
  }
  _generateFromQueue(){
    let queue = this.queue
    if(this.currentIndex < queue.length -1 && (this.proCount <= this.maxPendingLength)){
      let generator = queue[++this.currentIndex],
        promise = generator()// 返回一个promise
      if(!(promise instanceof Promise)) promise = Promise.reject()
      this.proCount ++ 
      promise.then(() => {
        //queue中去除
        this.proCount--
        //继续添加
        this._generateFromQueue()
      }).catch(() => {
        this.proCount --
        this._generateFromQueue()
      })
    }

  }
}

module.exports = {
  AsyncQueue
}