const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

//查找与关键词匹配的记录，更新关键词数据库集合

exports.main = async (event, context) => {
  const allCollection = await cloud.callFunction({
    name: "getCollection",
    data: {
      type: "lostNotice"
    }
  })
  const KeyWordCollection = await cloud.callFunction({
    name: "getCollection",
    data: {
      type: "keyWord"
    }
  })

  const arrKeyWordCollection = KeyWordCollection.result.data;
  const arrAllCollection = allCollection.result.data;

  if (arrAllCollection && arrKeyWordCollection) {
    for (var i = 0; i < arrKeyWordCollection.length; i++) {
      var arrRelatedId = [];
      var openid = arrKeyWordCollection[i]._openid;
      var id = openid;

      for (var j = 0; j < arrKeyWordCollection[i].keyWord.length; j++) {
        var nowTime = new Date();
        for (var k = 0; k < arrAllCollection.length; k++) {
          var currentKTime = new Date(arrAllCollection[k].Date.replace(/-/g, '/'))
          if ((nowTime - currentKTime) / 1000 / 60 / 60 <= 24) {
            if (arrKeyWordCollection[i].keyWord[j] && arrAllCollection[k].Section.indexOf(arrKeyWordCollection[i].keyWord[j]) >= 0) {
              if (arrAllCollection[k]._openid != arrKeyWordCollection[i]._openid) {
                if(arrRelatedId.indexOf(arrAllCollection[k]._id)==-1){
                  arrRelatedId.push(arrAllCollection[k]._id)
                } 
              }
            } 
          }
        }

        var tempRecord = await db.collection('AboutMyKeyWord').where({
          _id: id
        }).get()

        if (tempRecord != null && tempRecord.data.length > 0) {
          await db.collection('AboutMyKeyWord').doc(id).update({
            data: {
              recordId: arrRelatedId
            }
          })
        } else {
          if (arrRelatedId.length > 0) {
           await db.collection('AboutMyKeyWord').add({
              data: {
                _id: id,
                _openid: openid,
                recordId: arrRelatedId,
              }
            });
          }
        }

      }
    }
  }

  return

}