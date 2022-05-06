const db = wx.cloud.database()
var util = require('../../utils/util.js')
Page({
  data: {
    recordArr: [],
    hasUserInfo: false,
    today: '',
    yesterday: '',
    dayBeforeYesterday: ''
  },

  onLoad: function (options) {
    var that = this;

    var recentDay = util.myFormatTime0(new Date());
    console.log(recentDay)
    that.setData({
      today: recentDay[0],
      yesterday: recentDay[1],
      dayBeforeYesterday: recentDay[2]
    });


    that.setData({
      hasUserInfo: wx.getStorageSync('isHasUserInfo')
    })
    if(that.data.hasUserInfo){
      var openid = wx.getStorageSync('userOpenId');
      db.collection("AboutMyKeyWord").doc(openid).get({
        success(res) {
          if (res.data) {
            var recordIdArr = res.data.recordId;
            var tempNoticeCollection = [];
            for (var i = 0; i < recordIdArr.length; i++) {
              db.collection("lostNotice").doc(recordIdArr[i]).get({
                success(res) {
                  tempNoticeCollection.push(res.data);
                  that.setData({
                    recordArr: tempNoticeCollection
                  });
                }
              });
            }
          }
        }
      })
    }
  },
  viewimage: function (e) {
    var picId = e.currentTarget.id;
    var listId = e.currentTarget.dataset.listid
    var imagesrc = "cloud://n11-306-7gpp87wucc40404a.6e31-n11-306-7gpp87wucc40404a-1305510331/" + this.data.recordArr[listId].PicPath[picId];
    wx.previewImage({
      urls: [imagesrc]
    })
  },

  onShareAppMessage: function (res) {
		return {
		  title: '接离家出走的宝贝回家~',
		  path: 'pages/browseNotice/browseNotice', // 显示的页面
		  imageUrl: "../../image/xiaochengxuma.jpg"
    }
  }

})