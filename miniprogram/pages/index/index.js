Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },



  onLoad() {


    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }

    if (wx.getStorageSync('isHasUserInfo') == true) {
      this.setData({
        hasUserInfo: true
      })
    }

    if (wx.getStorageSync('userInfo') != {}) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
  },

  getUserProfile(e) {
    if(!wx.getStorageSync('userOpenId')){
      wx.cloud.callFunction({
        name:"login"
      }).then(res=>{
        wx.setStorageSync('userOpenId', res.result["openid"])
      })
    }
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('isHasUserInfo', true)
        wx.setStorageSync('userInfo', res.userInfo)
      }
    })
  },

  onShareAppMessage: function (res) {
		return {
		  title: '接离家出走的宝贝回家~',
		  path: 'pages/browseNotice/browseNotice', // 显示的页面
		  imageUrl: "../../image/xiaochengxuma.jpg"
    }
  },

  Exit(e){
    wx.clearStorage();
    var that=this;
    that.setData({
    userInfo: {},
    hasUserInfo: false
    })
  }

})