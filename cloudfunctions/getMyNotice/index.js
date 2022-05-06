//获取我的启事记录
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  const countResult = await db.collection("lostNotice").count()
  const total = countResult.total
  if(total>0){
    const batchTimes = Math.ceil(total / 100)
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      var promise;
      if(event.target=="whole"){
        promise = db.collection("lostNotice").where({
          _openid:event.id
        }).orderBy("Date",'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      }else if(event.target=="toBePublished"){
        promise = db.collection("notPublishLostNotice").where({
          _openid:event.id,
        }).orderBy("Date",'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      }else if(event.target=="notFound"){
        promise = db.collection("lostNotice").where({
          _openid:event.id,
          Done:false
        }).orderBy("Date",'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      }else if(event.target=="found"){
        promise = db.collection("lostNotice").where({
          _openid:event.id,
          Done:true
        }).orderBy("Date",'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      }
      tasks.push(promise)
    }
  
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        event,
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })
  }else{
    return {
      data:null
    }
  }

}