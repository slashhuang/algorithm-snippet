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
   //缓存所有的初始数据
   let enqueueUid = [];
   let enqueueTask = [];
   //任务等待区域
   let waitingTask = [];
   
   let timer = null;
   return (uid)=>{
      //推送进队列
      enqueueUid.push(uid);
      //任务时间管理
      if(!timer){
        timer = setTimeout(()=>{
            clearTimeout(timer);
            timer = null;
            //进入任务等待区
            let dispatchUid  = enqueueUid;
            let dispatchTask = enqueueTask;
            //生成一组任务
            let currentTask = {
              'dispatchTask':dispatchTask,
              'dispatchUid':dispatchUid
            };
            waitingTask.push(currentTask);
            //清空缓存区
            enqueueTask =[];
            enqueueUid = [];
            dispatchUidTask(currentTask);
          },100)
      }else{
        console.log(`task pushed to queue ,stay in pending state`)
      }
      //删除执行完的队列
      let deleteTask=(taskArr,task)=>{
          let index = taskArr.indexOf(task);
          taskArr.splice(index,1);
      }
      //通知任务队列执行
      let notify =dispatchTask=>list=>{
          // task要和uid对应起来
          dispatchTask.forEach(task=>task(list));
          deleteTask(waitingTask,dispatchTask)
      }; 
      //合并uid请求
      let dispatchUidTask=(currentTask)=>{
          let dispatchUid = currentTask['dispatchUid'];
          let dispatchTask = currentTask['dispatchTask'];
          Promise.resolve({then:(resolve,reject)=>{
                    resolve(dispatchUid);
                }})
                .then(requestUserProfile)
                .then(notify(dispatchTask))
        }
      //过滤返回结果
      let filterResult = uid=>list=>{
            return list.filter(profile=>profile.uid == uid)[0];
        }  
      //组装Promise逻辑
      return new Promise((resolve,reject)=>{
            //夺取Promise控制权
            enqueueTask.push(resolve);
        }).then(filterResult(uid))
          .catch(error=>{ //只处理真实的错误
              if(error.name){
                  return Promise.reject(`${error.name}--${error.stack} `)
              }else{
                  return Promise.reject(error)
              }
          })
    }
};
//-------------------------- 测试区 ------------------------------------
let userProfilePayLoad = getUserProfile();
//模拟异步请求
let async = (fn,gap)=>{
  setTimeout(fn,gap)
};
async(()=>{
  //打印10
  userProfilePayLoad(10).then(profile=>console.log(profile.uid)).catch(console.log)
},10)
async(()=>{
   //打印20
  userProfilePayLoad(20).then(profile=>console.log(profile.uid)).catch(console.log);
},20)
async(()=>{
   //打印30
  userProfilePayLoad(30).then(profile=>console.log(profile.uid)).catch(console.log);
},30)
async(()=>{
   //打印100
  userProfilePayLoad(100).then(profile=>console.log(profile.uid)).catch(console.log);
},100)
async(()=>{
   //打印150
  userProfilePayLoad(150).then(profile=>console.log(profile.uid)).catch(console.log);
},150)
async(()=>{
   //打印200
  userProfilePayLoad(200).then(profile=>console.log(profile.uid)).catch(console.log);
},200)
async(()=>{
   //打印400
  userProfilePayLoad(400).then(profile=>console.log(profile.uid)).catch(console.log);
},400)
async(()=>{
   //打印1000
  userProfilePayLoad(1000).then(profile=>console.log(profile.uid)).catch(console.log);
},1000)

























