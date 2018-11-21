/**
 * 维护一个用于
 */

const DEFAULT = 'default'
class AsyncQueue{
  constructor(maxPendignLength = 10){
    
    // 待生成promise 的队列
    this.queue = []
    // 当前正在pending 的promise的数量
    this.proCount = 0
    // 当前已经进入asyncGenerator，生成promise对象的queue中的项的索引下标
    this.currentIndex = -1
    // 同一时间pending的最大promise数
    this.maxPendingLength = maxPendignLength
    
    this.namspaceGather = {} // b
  }
  static getNamespace(event) {
    let index = event.indexOf(':')
    return index == -1 ? {
      type: event,
      namespace: DEFAULT
    } : {
      type: event.substr(0, index - 1 ),
      namespace: event.substr(index + 1)
    }
  }
  /**
   * 
   * @param {Function} generator | 异步函数，要求返回一个promise
   */
  push(generator, namespace = DEFAULT){
    if(typeof generator != 'function') return 

    this.queue.push({
      namespace,
      generator
    })

    // 不同命名空间压入数量
    let n = this.namspaceGather[namespace]
    if (n){
      n.count ++
    }else {
      this.namspaceGather[namespace] = { 
        count: 1,
        index: -1
      }
    }

    // 如果promiseQueue 未满，则压入
    if(this.proCount < this.maxPendingLength){
      Promise.resolve().then(() => { this._generateFromQueue() })
    }
  }
  _generateFromQueue(){
    let queue = this.queue

    if(this.currentIndex < queue.length -1 && (this.proCount <= this.maxPendingLength)){
      let { generator } = queue[++this.currentIndex],
        promise = generator()// 返回一个promise
      if(!(promise instanceof Promise)) promise = Promise.reject()
      this.proCount ++ 

      promise.then(this._handleEach).catch(this._handleEach)
    } 

    // queue 已空
    if(this.currentIndex >= queue.length - 1){
      this._reset()
      
    }
  }
  _handleEach(namespace){
    // 如果所有已经完成
    let n = this.namspaceGather[namespace]

    // queue中去除
    this.proCount--
    // 该命名空间内的index+1 
    n.index++

    if (n.index >= n.count - 1){
      (typeof (n.callback) == 'function') && n.callback()
    }
    
    // 继续添加
    this._generateFromQueue()
  }
  _reset(){
    this.queue = []
    this.namspaceGather = {}
    this.currentIndex = -1
    this.proCount = 0
  }
  on(event, callback){
    let namespace = AsyncQueue.getNamespace(event)
    if (namespace.type == 'zero'){
      this.namspaceGather[namespace.namespace].callback = callback
    }
  }
}

module.exports = {
  AsyncQueue
}