const Promise = require('./MyPromise') //注释这一行为原生promise，保留这一行为MyPromise
const resPromise = function(x){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(x)
        }, 1000)
    })
}
const rejPromise = function(x){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
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
// resresPromise('hhh').then(value => {console.log(value)})
resPromise('jjj')
.then(val => {console.log(val); return resPromise('kkk')})
.then(val => {console.log(val); return rejPromise('lll')})
.catch(reason => {console.log(reason);return rejPromise('ooo')})
.finally(()=> {console.log('finally')})
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