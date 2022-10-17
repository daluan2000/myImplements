
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
        根据结果值value来调用then中的回调函数e
        虽然函数名是runResolvedFunction，但实际上也有可能会调用rejectFunction，比如在本对象中resolve一个结果值为reject的promise对象时
        参数中的resolve.then()返回值promise中resolver的回调函数

        如果结果值value是一个promise对象，那么我们不能把这个value直接作为参数，而是要把它的结果值作为参数
        如果它的结果值还是promise对象，那么就把他的结果值的结果值作为参数
        所以，如果value是promise，则对value进行递归脱壳，直到得到最终的结果值再调用resolve或reject
    */
    function runResolvedFunction(value, resolveFunction, resolve, rejectFunction, reject){
        if(value instanceof MyPromise){
            value.then(
                //如果结果是resolved，那么递归调用runResolvedFunction
                tvalue => {runResolvedFunction(tvalue, resolveFunction, resolve, rejectFunction, reject)},
                //如果出现rejected，那么调用rejectedFunction
                treason => {runRejectFunction(treason, rejectFunction, resolve, reject)}
            )
        }
        else{
            resolve(resolveFunction(value))
        }
    }

    //不需要对结果值进行递归脱壳
    function runRejectFunction(reason, rejectFunction, resolve, reject){
        //如果then里面没定义处理错误的回调函数，那么调用then返回值promise里的reject，以实现错误穿透
        if(!(rejectFunction instanceof Function)){
            reject(reason)
        }
        //如果then里面定义了处理错误的回调函数，那么调用then返回值promise里的resolve
        else{
            resolve(rejectFunction(reason))
        }
    }

    //也有一个递归脱壳的过程，如果结果值是promise那么就再等到这个promise有最终的结果值之后再调用finally里的回调
    function runFinallyFunction(finallyFunction, value){
        if(value instanceof MyPromise){
            value.then(
                val => {runFinallyFunction(finallyFunction, val)},
                reason => {finallyFunction();}
            )
        }
        else{
            
            finallyFunction()
        }
    }

    //把结果值改为value，状态值改为resolved，并运行resolveTasks里的函数
    function resolve(value){
        if(value instanceof MyPromise){
            value.then(
                val => {resolve(val)},
                reason => reject(reason)
            )
        }
        state = resolved
        resultValue = value
        for(let resolveTask of resolveTasks){
            resolveTask(value)
        }
        for(let finallyTask of finallyTasks){
            finallyTask(value)
        }
    }

    //把结果值改为value，状态值改为rejected，并运行rejectTasks里的函数
    function reject(reason){
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

    /* then返回一个promise，promise的结果值是两个回调函数的return值 */
    this.then = function(resolveFunction, rejectFunction){
        
        resolveFunction = resolveFunction || defaultHandler


        //立即调用then的第一个回调函数，如果没有，则使用默认函数代替，以实现值穿透的效果
        if(state === resolved){
            return new MyPromise((resolve, reject) => {
                runResolvedFunction(resultValue, resolveFunction, resolve, rejectFunction, reject)
            })
        }
        //立即调用then的第二个回调函数
        else if(state === rejected){
            return new MyPromise((resolve, reject) => {
                runRejectFunction(resultValue, rejectFunction, resolve, reject)
            })
        }
        else{
            return new MyPromise((resolve, reject) => {
                function resolveTask(value){
                    runResolvedFunction(value, resolveFunction, resolve, rejectFunction, reject)
                }
                function rejectTask(reason){
                    runRejectFunction(reason, rejectFunction, resolve, reject)//对于处理错误的回调函数，它的返回值是否用resolve
                }
                resolveTasks.push(resolveTask)
                rejectTasks.push(rejectTask)
            })
        }
    }
    this.catch = function(rejectFunction){
        if(state === rejected){
            return new MyPromise((resolve, reject) => {
                runRejectFunction(resultValue, rejectFunction, resolve, reject)
            })
        }
        else{
            return new MyPromise((resolve, reject) => {
                function rejectTask(reason){
                    runRejectFunction(reason, rejectFunction, resolve, reject)//对于处理错误的回调函数，它的返回值是否用resolve???
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
            runFinallyFunction(finallyFunction, resultValue)
        }
        else {
            function finallyTask(value){
                runFinallyFunction(finallyFunction, value)
            }
            finallyTasks.push(finallyTask)
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