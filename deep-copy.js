/*
 * built by slashhuang
 * 17/2/17
 * deep copy object
 */

 var simpleObj = {
    a:1,
    b:{
        b1:1
    },
    c:[
        {
            c1:1
        }
    ]
 };

 var deepCopy = function(targetObj) {
    var copiedObj = {};
    var ArrayDealer=function(arrayVal,copiedObj) {
        arrayVal.forEach(function(arrVal,index) {
                copiedObj[index]={};
                if(typeof arrVal=='object'){
                    copy(arrayVal[index],copiedObj[index])
                }else{
                    copiedObj[index] = arrVal;
                }
        })
    };
    var ObjectDealer=function(targetObj,copiedObj) {
        for(var key in targetObj){
            var val = targetObj[key];
            copiedObj[key]={};
            //非引用类型节点
            if(typeof val=='object'){
                copy(val,copiedObj[key]);
            }else{
               copiedObj[key] = val;
            }
        }
    }
    var copy = function (targetObj,copiedObj) {
        if(Array.isArray(targetObj)){
            ArrayDealer(targetObj,copiedObj);
        }else{
            ObjectDealer(targetObj,copiedObj)
        };
    }
    copy(targetObj,copiedObj);
    return copiedObj;
};

 console.log(deepCopy(simpleObj));