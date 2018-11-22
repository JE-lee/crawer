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

    // 当前已经完成的promise数量
    this.fullfillCount = 0
    
    this.namspaceGather = {} // b
  }
  static getNamespace(event) {
    let index = event.indexOf(':')
    return index == -1 ? {
      type: event,
      namespace: DEFAULT
    } : {
      type: event.substr(0, index),
      namespace: event.substr(index + 1)
    }
  }
  /**
   * 
   * @param {Function} generator | 异步函数，要求返回一个promise
   * note: 压入空数组将不会触发 zero事件
   */
  push(generators, namespace){
    if(!(generators instanceof Array)) return 

    let ges = generators.filter(item => typeof item == 'function').map(item => {
      return {
        namespace,
        generator: item
      }
    }) 
    this.queue = this.queue.concat(ges)

    // 不同命名空间压入数量
    let n = this.namspaceGather[namespace]
    if (n){
      n.count += ges.length
    }else {
      this.namspaceGather[namespace] = { 
        count: ges.length,
        index: -1
      }
    }

    // 如果promiseQueue 未满，则压入
    if(this.proCount < this.maxPendingLength){
      Promise.resolve().then(() => { this._generateFromQueue() })
    }

    return this
  }
  _generateFromQueue(){
    let queue = this.queue,
      proCount = this.proCount
    for(let i = 0; i < this.maxPendingLength - proCount; i++){
      if(this.currentIndex < queue.length -1){
        let { generator, namespace } = queue[++this.currentIndex],
          promise = generator()// 返回一个promise
        if(!(promise instanceof Promise)) promise = Promise.reject()
        this.proCount ++ 
  
        promise.then(() => { this._handleEach(namespace) }).catch(() => { this._handleEach(namespace) })
      } 
    }

    
  }
  _handleEach(namespace){
    // 如果所有已经完成
    let n = this.namspaceGather[namespace]

    // queue中去除
    this.proCount--

    this.fullfillCount ++ 
    // 该命名空间内的index+1 
    n.index++

    if (n.index >= n.count - 1){
      (typeof (n.callback) == 'function') && n.callback()
    }

    if(this.fullfillCount >= this.queue.length){
      this._reset()
    }

    // 继续添加
    this._generateFromQueue()
  }
  _reset(){
    this.queue = []
    this.namspaceGather = {}
    this.currentIndex = -1
    this.proCount = 0
    this.fullfillCount = 0
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