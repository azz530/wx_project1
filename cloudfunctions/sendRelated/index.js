//定时消息推送
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {

  const AboutKeyWord = await cloud.callFunction({
    name: "getCollection",
    data: {
      type: "AboutMyKeyWord"
    }
  })

  const AboutKeyWordCollection = AboutKeyWord.result.data;
  const HasIdKeyWord = [];
  const testArr=[];

  if (AboutKeyWordCollection != null) {
    for (var i = 0; i < AboutKeyWordCollection.length; i++) {
      if (AboutKeyWordCollection[i].recordId.length > 0) {
        HasIdKeyWord.push(AboutKeyWordCollection[i])
      }
    }

    for(var i=0;i<HasIdKeyWord.length;i++){
      try {
        const result = await cloud.openapi.subscribeMessage.send({
          touser: HasIdKeyWord[i]._openid,
          page: 'pages/Detail/Detail',
          lang: 'zh_CN',
          data: {
            name1: {
              value: '嘿在这'
            },
            thing2: {
              value: '发现可能是你在找的离家出走的宝贝，快看看是不是它！'
            },
            time6: {
              value: '今晚 23：59'
            },
            thing7: {
              value: ''
            }
          },
          templateId: 'DfR2cn0nVuqhkfPPOW8M63oR_fa0A2n0P_aDQxsKg1A',
          //miniprogramState: 'developer'
        })
        testArr.push(result)
      } catch (err) {
        testArr.push(err)
      }
    }
  }
  return testArr
}
