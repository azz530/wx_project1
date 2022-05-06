
App({
  onLaunch: function () {

    //初始化云端环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'n11-306-7gpp87wucc40404a',
        traceUser: true,
      })
    }

    wx.cloud.callFunction({
      name:"login"
    }).then(res=>{
      wx.setStorageSync('userOpenId', res.result["openid"])
    })
  }

})
