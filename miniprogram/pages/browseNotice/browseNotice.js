const db = wx.cloud.database()
var util = require('../../utils/util.js')
Page({

  data: {
    cancelHidden: true,
    loseHidden: true,
    pickUpHidden: true,
    loadingDataHidden: true,
    remainList: [],
    showList: [],
    today: '',
    yesterday: '',
    dayBeforeYesterday: ''
  },

  staticData: {
    inputValue: ""
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

    wx.cloud.callFunction({
      name: "getCollection",
      data: {
        type: "lostNotice"
      }
    }).then(res => {
      if (!res.result.data) {
        that.setData({
          showList: null,
          remainList: null
        })
      } else {
        var count = res.result.data.length;

        if (count >= 6) {
          var arr = [];
          for (var i = 0; i < 6; i++) {
            arr.push(res.result.data.shift());
          }
        } else {
          var arr = [];
          for (var i = 0; i < count; i++) {
            arr.push(res.result.data.shift())
          }
        }
        that.setData({
          showList: arr,
          remainList: res.result.data
        })
      }
    })
  },

  handleInputChange(e) {
    var that = this;
    that.staticData.inputValue = e.detail.value.search;
    that.startSearch(that.staticData.inputValue);
  },

  startSearch(value) {
    if(value){

    var that = this;
    wx.cloud.callFunction({
      name: "getCollection",
      data: {
        type: "lostNotice"
      }
    }).then(res => {
      if (!res.result.data) {
        that.setData({
          showList: null,
          remainList: null
        })
      } else {
        var arrStart = [];
        var resultData = [];
        resultData = res.result.data;
        for (var i = 0; i < resultData.length; i++) {
          if ((resultData[i].Section.indexOf(value)) >= 0) {
            arrStart.push(resultData[i])
          }
        }
        var count = arrStart.length;
        if (count >= 6) {
          var arr = [];
          for (var i = 0; i < 6; i++) {
            arr.push(arrStart.shift());
          }
        } else {
          var arr = [];
          for (var i = 0; i < count; i++) {
            arr.push(arrStart.shift())
          }
        }
        that.setData({
          showList: arr,
          remainList: arrStart,
          cancelHidden: false
        })
      }
    })       
  }
  },

  handleCancelSearch(e) {
    var that = this;
    wx.cloud.callFunction({
      name: "getCollection",
      data: {
        type: "lostNotice"
      }
    }).then(res => {
      if (!res.result.data) {
        that.setData({
          showList: null,
          cancelHidden: true
        })
      } else {
        that.setData({
          noticeList: res.result.data
        })
        var count = res.result.data.length;

        if (count >= 6) {
          var arr = [];
          for (var i = 0; i < 6; i++) {
            arr.push(res.result.data.shift());
          }
        } else {
          var arr = [];
          for (var i = 0; i < count; i++) {
            arr.push(res.result.data.shift())
          }
        }
        that.setData({
          showList: arr,
          cancelHidden: true,
          remainList: res.result.data
        })
      }
    })
  },

  handleInputEnter(e){
    console.log(e)
    var that = this;
    that.staticData.inputValue = e.detail.value;
    that.startSearch(that.staticData.inputValue);
  },

  onPullDownRefresh: function () {
    var that = this;
    setTimeout(() => {
      wx.cloud.callFunction({
        name: "getCollection",
        data: {
          type: "lostNotice"
        }
      }).then(res => {
        if (!res.result.data) {
          that.setData({
            showList: null,
            remainList: null
          })
        } else {
          var count = res.result.data.length;

          if (count >= 6) {
            var arr = [];
            for (var i = 0; i < 6; i++) {
              arr.push(res.result.data.shift());
            }
          } else {
            var arr = [];
            for (var i = 0; i < count; i++) {
              arr.push(res.result.data.shift())
            }
          }
          that.setData({
            showList: arr,
            remainList: res.result.data
          })
        }
      })
    }, 1000);
    wx.stopPullDownRefresh();
  },


  onReachBottom: function () {
    var that = this;
    that.setData({
      loadingDataHidden: false
    })
    setTimeout(() => {
      var count = that.data.remainList.length;
      if (count > 0) {
        var arr = [];
        var loopNum;
        if (count > 4) loopNum = 4;
        else loopNum = count;
        for (var i = 0; i < loopNum; i++) {
          arr.push(that.data.remainList.shift());
        }
        for (var j = 0, len = that.data.showList.length; j < len; j++) {
          arr.unshift(that.data.showList.pop());
        }
        that.setData({
          showList: arr,
          loadingDataHidden: true
        })
      } else {
        wx.showToast({
          title: '我是有底线滴~',
          image: '../../image/error.png'
        })
        that.setData({
          loadingDataHidden: true
        })
      }
    }, 1000);
  },

  viewimage: function (e) {
    var picId = e.currentTarget.id;
    var listId = e.currentTarget.dataset.listid
    var imagesrc = "cloud://n11-306-7gpp87wucc40404a.6e31-n11-306-7gpp87wucc40404a-1305510331/" + this.data.showList[listId].PicPath[picId];
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
  },


  

})