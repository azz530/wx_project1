//获取超百条记录
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

const MAX_LIMIT = 100

exports.main = async (event, context) => {
  const countResult = await db.collection(event.type).count()
  const total = countResult.total
  if(total>0){  
    const batchTimes = Math.ceil(total / 100)
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection(event.type).orderBy("Date",'desc').orderBy("_openid",'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
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