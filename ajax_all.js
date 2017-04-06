//现在有一个 Ajax 接口，根据用户 uid 获取用户 profile 信息，是一个批量接口。
//我把这个 ajax 请求封装成以下的异步函数

// uidList 是一个数组，最大接受 100 个 uid
// 这个方法的实现不能修改
var requestUserProfile = function(uidList){  
  /** 先去重 */
  var uidList = uidList || [];
  var _tmp = {};
  var _uidList = [];
  uidList.forEach(function(uid){
    if(!_tmp[uid]){
      _tmp[uid] = 1;
      _uidList.push(uid);
    }
  })
  _tmp = null;
  uidList = null;
  return Promise.resolve().then(function(){
    return new Promise(function(resolve, reject){
      setTimeout(function(){ // 模拟 ajax 异步，1s 返回
        resolve();
      }, 1000);
    }).then(function(){
      var profileList = _uidList.map(function(uid){
        if(uid < 0){  // 模拟 uid 传错，服务端异常，获取不到部分 uid 对应的 profile 等异常场景
          return null;
        }else{
          return {
            uid: uid,
            nick: uid + 'Nick',
            age: 18
          }
        }
      });
      return profileList.filter(function(profile){
        return profile !== null;
      });
    });
  });
}

// 现在我们有很多业务都需要根据 uid 获取 userProfile , 
// 大多数业务的需求都是给一个 uid，获取 profile 。
// 为了性能，我们需要把这个单个的请求合并成批量请求。

// 例如，现在页面上 A 模块需要获取 uid 为 1 的 profile，
// B 模块需要 uid 为 2 的 profile， 
// C 模块需要获取 uid 为 1 的profile
// 这三个模块会单独调用下面这个方法获取 profile，
// 假设这三次调用的时间非常接近(100ms 以内)，最终要求只发送一个 ajax 请求（
// 只调用一次 requestUserProfile )，拿到这三个模块需要的 profile

// 完成以下方法，接收一个参数 uid，返回一个 Promise，
// 当成功请求到 profile 的时候， resolve 对应的profile , 请求失败 reject
// 例如  getUserProfile(1).then(function(profile){ console.log(profile.uid === 1) // true });  // 假设请求成功了。
var getUserProfile = function(uid){
  /* 
   * @Author slashhuang
   * 17/4/6
   */
   let enqueueUid = [];
   return (uid)=>{
      //推送进队列
      enqueueUid.push(uid);
      //过滤返回结果
      let filterResult = list=>{
          return list.filter(profile=>profile.uid== uid)[0];
      };
      //分发resolve的逻辑
      let resolveLogic = (resolve,reject)=>{
            if(enqueueUid.length>0){
              //只有时间gap达到100ms才执行后续逻辑
              setTimeout(resolve,100,enqueueUid)
            }else{
              reject();
            }   
      }
      //组装Promise逻辑
      return Promise.resolve({then:resolveLogic})
                    .then((profileList)=>{
                      //清空队列
                      enqueueUid = [];
                      return profileList
                    })
                    .then(requestUserProfile)
                    .then(filterResult)
                    .catch(error=>{ //只处理真实的错误
                      if(error){
                         console.log(`${error.name}--${error.stack} `)
                      }else{
                        console.log(`没有uid数据需要请求`)
                      }
                  })
      }
};
//------------- 测试区 ------------
let userProfilePayLoad = getUserProfile();
//模拟异步请求
let async = (fn)=>{
  setTimeout(fn,30)
};
async(()=>{
  //打印111
  userProfilePayLoad(111).then(profile=>console.log(profile.uid));
})
async(()=>{
   //打印112
  userProfilePayLoad(112).then(profile=>console.log(profile.uid));
})
async(()=>{
   //打印113
  userProfilePayLoad(113).then(profile=>console.log(profile.uid));
})


























