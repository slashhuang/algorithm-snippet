/*
 * build by slashhuang
 * 17/2/16
 */
var data=[
 [ 1, 2, 3 ],
 [ 4, 5, 6 ],
 [ 7, 8, 9 ]
];
var data2= [[1],[2],[3],[4],[5],[6],[7],[8],[9],[10]]
var data3= [[2,3]]
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
    var result = [];
    var iterator = function(matrix){
        var row = matrix.length;
        var column = Array.isArray(matrix[0])?matrix[0].length:matrix.length;
        // iterator 1st ele
        var i,j,k,m;
        //横向遍历
        i=k=0;
        //竖向遍历
        j=m=1;
        while(i<column){
            result.push(matrix[0][i]);
            i++;
        }
        while(j<row-1){
            if(matrix[j].length==0){
                break;
            };
            result.push(matrix[j].pop());
            j++
        }
        if(row!=1){
            while(k<column){
                result.push(matrix[row-1][column-1-k]);
                k++
            }
        }
        if(column!=1){
              while(m<row-1){
                if(matrix[row-1-m].length==0){
                    break;
                };
                result.push(matrix[row-1-m].shift());
                m++
            } 
        }  
        if(row>1){
            matrix.shift();
        }
        matrix.pop();
        Array.isArray(matrix)&&matrix.length>0 && iterator(matrix);
    }
    iterator(matrix);
    return result
};
var s = spiralOrder(data);
console.log(s)
var s1 = spiralOrder(data2);
console.log(s1)
var s2 = spiralOrder(data3);
console.log(s2)

