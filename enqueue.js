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
var getUserProfile = function(TaskInterval){
  if(!TaskInterval){
    TaskInterval=100
  }
  /*
   * @Author slashhuang
   * 17/4/6
   */
   //缓存所有的初始数据
   let enqueueUid = [];
   let enqueueTask = [];
   //任务等待区域
   let timer = null;
   let runTask = ()=>{
        //清空定时器
        timer && clearTimeout(timer);
        timer = null;
        //执行当前任务
        dispatchUidTask({
              'TaskArr':[].slice.call(enqueueTask),
              'dispatchUid':[].slice.call(enqueueUid)
        });
        //清空缓存区
        enqueueTask =[];
        enqueueUid = [];
   };
    //合并uid请求
    let dispatchUidTask=(currentTask)=>{
        let dispatchUid = currentTask['dispatchUid'];
        let TaskArr = currentTask['TaskArr'];
        Promise.resolve(dispatchUid)
               .then(requestUserProfile)
               //通知任务队列执行
               .then(list=>TaskArr.forEach(task=>task(list)))
        }
    let loadTask = (uid)=>{
        //满100就执行任务
        if(enqueueUid.length>99){
              console.log('------- length > 100')
              runTask()
        }else if(!timer){
            timer = setTimeout(()=>{
                console.log('------- starting setTimeout task')
                runTask()
            },TaskInterval)
        }
    }
   return (uid)=>{
      //返回Promise任务，将resolve推送进enqueueTask队列
      return new Promise((resolve,reject)=>{
            //推送任务列表和uid列表
            enqueueTask.push(resolve);
            enqueueUid.push(uid);
            //加载任务
            loadTask(uid);
        }).then((list)=>{
            return list.filter(profile=>profile.uid == uid)[0];
          })
          .catch(error=>{
              if(error && error.stack){
                  return Promise.reject(`${error.name}--${error.stack} `)
              }else{
                  return Promise.reject(error)
              }
          })
    }
};
//-------------------------- 测试区 ------------------------------------
//110毫秒的任务间隔
let TaskNum = 105;
let TaskInterval = 110;
let userProfilePayLoad = getUserProfile(TaskInterval);
//模拟异步请求
let _async = (fn,gap)=>{
  setTimeout(fn,gap)
}
while(TaskNum>0){
  (taskNum=> _async(()=>{
    /*
     * 打印1到105
     * 任务执行次数2次
     */
    userProfilePayLoad(taskNum).then(profile=>console.log(profile.uid)).catch(console.log)
  },TaskNum))(TaskNum)
  TaskNum--
};

















