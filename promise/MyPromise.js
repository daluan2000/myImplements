
 function MyPromise(resolver){

    const resolved = 'resolved'
    const pending = 'pending'
    const rejected = 'rejected'
    

    let state = pending
    let resultValue
    let resolveTasks = [] //resolve时执行的任务
    let rejectTasks = []  //reject时执行的任务
    let finallyTasks = []

   

    
    /* 
        调用resolve可能并不会立即改变状态，
        如果value是promise类型，为了使结果值不为promise类型，它会递归得到value的最终值，然后再根据结果改变状态
        如果最终状态是resolved，那么就调用resolveTasks和finallyTasks
        如果最终状态是rejected，则调用reject 
    */
    function resolve(value){
        if(state !== pending){
            return ;
        }
        if(value instanceof MyPromise){
            value.then(
                val => {resolve(val)},
                reason => reject(reason)
            )
        }
        else {
            state = resolved
            resultValue = value
            for(let resolveTask of resolveTasks){
                resolveTask(value)
            }
            for(let finallyTask of finallyTasks){
                finallyTask()
            }
        }
    }

    //无论value是不是promise类型，立即把结果值改为value，状态值改为rejected，并运行rejectTasks里的函数
    function reject(reason){
        if(state !== pending){
            return ;
        }
        state = rejected
        resultValue = reason
        for(let rejectTask of rejectTasks){
            rejectTask(reason)
        }  
        for(let finallyTask of finallyTasks){
            finallyTask()
        }
    }

    //默认的then里面的第一个回调函数，为了实现值穿透的效果
    function defaultHandler(value){
        return value
    }

    // then返回一个promise，当两个回调函数中的某个被调用时，设返回值为retValue，则在该promise内部会执行resolve(retValue)
    this.then = function(resolveFunction, rejectFunction){
        
        //为了实现值穿透，then中的第一个回调函数为空时，将其赋为此默认值
        resolveFunction = resolveFunction || defaultHandler


        //立即调用then的第一个回调函数，如果没有，则使用默认函数代替，以实现值穿透的效果
        if(state === resolved){
            return new MyPromise((resolve, reject) => {
                resolve(resolveFunction(resultValue))
            })
        }
        //立即调用then的第二个回调函数
        else if(state === rejected){
            return new MyPromise((resolve, reject) => {
                if(rejectFunction instanceof Function){
                    resolve(rejectFunction(resultValue))
                }
                else{
                    //如果缺少错误处理函数，那么直接调用reject
                    //使then()的返回值为 状态=rejected resultValue=本对象结果值 的promise对象，以实现错误穿透效果。
                    reject(resultValue)
                }
            })
        }
        else{
            return new MyPromise((resolve, reject) => {
                function resolveTask(value){
                    resolve(resolveFunction(value))
                }
                function rejectTask(reason){
                    if(rejectFunction instanceof Function){
                        resolve(rejectFunction(resultValue))
                    }
                    else{
                        //原理同上
                        reject(resultValue)
                    }
                }
                resolveTasks.push(resolveTask)
                rejectTasks.push(rejectTask)
            })
        }
    }
    this.catch = function(rejectFunction){
        if(state === rejected){
            return new MyPromise((resolve, reject) => {
                if(rejectFunction instanceof Function){
                    resolve(rejectFunction(resultValue))
                }
                else{
                    //原理同上
                    reject(resultValue)
                }
            })
        }
        else{
            return new MyPromise((resolve, reject) => {
                function rejectTask(reason){
                    if(rejectFunction instanceof Function){
                        resolve(rejectFunction(resultValue))
                    }
                    else{
                        //原理同上
                        reject(resultValue)
                    }
                }
                rejectTasks.push(rejectTask)
            })
            
        }
    }
    this.finally = function(finallyFunction){
        if(!(finallyFunction instanceof Function)){
            return
        }
        if(state !== pending){
            finallyFunction()
        }
        else {
            finallyTasks.push(finallyFunction)
        }
    }
    resolver(resolve, reject)
}

MyPromise.resolve = function(value){
    if(value instanceof MyPromise){
        return value
    }
    return new MyPromise((resolve, reject) => {
        resolve(value)
    })
}
MyPromise.reject = function(value){
    return new MyPromise((resolve, reject) => {
        reject(value)
    })
}

module.exports =  MyPromise