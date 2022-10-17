// const Promise = require('./MyPromise') //注释这一行为原生promise，保留这一行为MyPromise
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
//原生promise输出顺序是===x hhh --x 而mypromise里输出顺序是===x ---x hhh
//原生promise把resolve放到了resolver里的末尾执行，而mypromise是按照代码顺序执行，暂时没搞懂它是怎么做的
const rejPromise = function(x){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('+++x')
            reject(x)
        }, 1000)
    })
}
const resresPromise = function(x){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(resPromise(x))
        }, 1000);
    })
}
// resresPromise('hhh').then(value => {console.log(value)}) //按理说应该先---x再hhh，两者连续输出





// resPromise('jjj')
// .then(val => {console.log(val); return resPromise('kkk')})
// .then(val => {console.log(val); return rejPromise('lll')})
// .catch(reason => {console.log(reason);return rejPromise('ooo')})
// .finally(()=> {console.log('finally')})
// resPromise('aaa').then(val => {console.log(val)}).then(val => {console.log(val)})
// resPromise('aaa').then().then().then(val => {console.log(val)})
// rejPromise('bbb').then().then().catch(reason => {console.log(reason)})
// rejPromise('bbb').then(val => val, reason => {console.log(reason)})
// new Promise((resolve, reject) => {
//     resolve(rejPromise('ccc'))
// }).then().then().catch(reason => {console.log(reason)})

// const promise1 = resPromise('ddd')
// promise1.then(val => {console.log(val)})
// promise1.then(val => {console.log(val)})
// promise1.then(val => {console.log(val)})
// const promise2 = rejPromise('eee')
// promise2.then(val => val, reason => {console.log(reason)})
// promise2.then(val => val, reason => {console.log(reason)})
// promise2.catch(reason => {console.log(reason)})
// promise2.catch(reason => {console.log(reason)})

// Promise.reject('fff').catch(reason => {console.log(reason);return reason}).then(val => {console.log(val)})
// Promise.reject('fff').then(val => val, reason => {console.log(reason)}).then(val => {console.log(val)})

// new Promise((resolve, reject) => {reject(resPromise())}).catch((reason) => {}).finally(()=> {console.log('ggg')})