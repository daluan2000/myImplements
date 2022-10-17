## 使用回调函数来实现Promise
目前实现：
- myPromiseObj.then()
- myPromiseObj.catch()
- myPromiseObj.finally()
- MyPromise.resolve()
- MyPromise.reject()
- MyPromise.race()
- MyPromise.all()
- MyPromise.allSettled()

我的目的在于实现promise控制异步任务的功能，而有些不重要（我觉得）的细节可能与原版promise有所不同，比如对与下面这段代码，原生promise输出顺序是===x ---x hhh 而mypromise里输出顺序是 ===x hhh --x 。
```javascript
const resPromise = function(x){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('===x')
            resolve(x)
            console.log('---x')
        }, 1000)
    })
}
resPromise('hhh').then(val => {console.log(val)})
```
我想原版的promise可能对状态的改变和then、catch、finally中回调函数的执行做了异步化处理，无论resolve是否同步执行，后面的then、catch、finally中的回调函数全部异步执行。而对于我写到promise，如果resolve是同步执行的，那么后面的then、catch、finally中的回调函数也会同步执行。