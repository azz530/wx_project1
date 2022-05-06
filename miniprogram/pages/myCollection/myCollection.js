var util = require('../../utils/util.js')
const db = wx.cloud.database()
Page({

  data: {
    myNoticeList: [],
    isActive: 1,
    hasUserInfo: false,
    canEdit: false,
    currentId:"",
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
      isActive: options.active,
      hasUserInfo: wx.getStorageSync('isHasUserInfo')
    })
    console.log(that.data.hasUserInfo)

    if (that.data.hasUserInfo) {
      var targetId = options.targetId;
      console.log(targetId);
      var userId = wx.getStorageSync('userOpenId');
      wx.cloud.callFunction({
        name: "getMyNotice",
        data: {
          id: userId,
          target: targetId
        }
      }).then(res => {
        that.setData({
          myNoticeList: res.result.data
        })
        console.log(res.result.data)
      })
    }
  },

  showContents(e) {
    var that = this;
    var targetId = e.currentTarget.id;
    console.log(targetId)
    if (targetId == "whole") {
      that.setData({
        isActive: 1,
      })
    } else if (targetId == "notFound") {
      that.setData({
        isActive: 2,
      })
    } else if (targetId == "found") {
      that.setData({
        isActive: 3,
      })
    }
    if (that.data.hasUserInfo) {
      var userId = wx.getStorageSync('userOpenId');
      wx.cloud.callFunction({
        name: "getMyNotice",
        data: {
          id: userId,
          target: targetId
        }
      }).then(res => {
        if (!res.result.data) {
          that.setData({
            myNoticeList: null
          })
        } else {
          that.setData({
            myNoticeList: res.result.data
          })
        }
      })
    }
    that.TurnToCantEdit()
  },

  turnToEdit(e) {
    console.log(e);
    var that = this;
    var id = e.currentTarget.dataset.id;
      that.setData({
        canEdit: true,
        currentId:id
      })
  },
  TurnToCantEdit(e) {
    var that = this;
    that.setData({
      canEdit: false
    })
  },
  TurnTohasFound(e) {
    var that = this;
    db.collection("lostNotice").doc(e.currentTarget.dataset.id).update({
      data: {
        Done: true
      },
      success() {
        console.log("已经找到");
        var myNoticeList = that.data.myNoticeList;
        myNoticeList.splice(e.currentTarget.dataset.index, 1);
        that.setData({
          myNoticeList: myNoticeList
        });
        that.TurnToCantEdit()
      }
    })
  },
  deleteTheNotice(e) {
    var that=this;
    console.log(e.currentTarget.dataset.index);
    var deletePicPath=that.data.myNoticeList[e.currentTarget.dataset.index].PicPath;
    for(var i=0;i<deletePicPath.length;i++){
      deletePicPath[i]='cloud://n11-306-7gpp87wucc40404a.6e31-n11-306-7gpp87wucc40404a-1305510331/'+deletePicPath[i]
    }
    console.log(deletePicPath)
    
    wx.cloud.deleteFile({
      fileList:deletePicPath,
      success(res){
        console.log(res,'删除文件')
      },
      fail(err){
        console.log(err)
      }
    })


    db.collection("lostNotice").doc(e.currentTarget.dataset.id).remove({
      success() {
        console.log("移除成功");
        var myNoticeList = that.data.myNoticeList;
        myNoticeList.splice(e.currentTarget.dataset.index, 1);
        that.setData({
          myNoticeList: myNoticeList
        });
        that.TurnToCantEdit()
      }
    });
  },

  viewimage: function (e) {
    var picId = e.currentTarget.id;
    var listId = e.currentTarget.dataset.listid
    var imagesrc = "cloud://n11-306-7gpp87wucc40404a.6e31-n11-306-7gpp87wucc40404a-1305510331/" + this.data. myNoticeList[listId].PicPath[picId];
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