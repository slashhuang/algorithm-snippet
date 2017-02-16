/*
 * built by slashhuang
 * 冒泡插入排序
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var sortList = function(head) {
    //calculated num
    var i =0;
    while(i<head.length){
        for(var pointer=0;pointer<head.length-i;pointer++){
            if(head[pointer]>head[pointer+1]){
                var tmp = head[pointer+1];
                head[pointer+1] = head[pointer];
                head[pointer] = tmp;
            }
        };
        i++;
    }
    return head
};
var sortList_insert = function(head) {
    var cached = [head[0]];
    // array ,target ==> newArray
    var sort = function (num) {
       cached.unshift(num);
       for(var index=0;index<cached.length-1;index++){
            if(cached[index]<=cached[index+1]){
                break
            }
            var tmp = cached[index+1];
            cached[index+1] = cached[index];
            cached[index] = tmp;
       }
    };
    for(var index=1;index<head.length;index++){
        sort(head[index]);
    }
    return cached;    
};
// console.log(sortList([3,2,2]))
// console.log(sortList_insert([3,2,2,4,5,6]))
