const db = wx.cloud.database()
var util = require('../../utils/util.js')
Page({

  data: {
    isLost: true,
    hasPic: false,
    checked: true,
    tempPicPath: [],
    empty: '',
    rangeNameList: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    hasUserInfo: false
  },


  onLoad: function (options) {
    var that = this;
    that.setData({
      hasUserInfo: wx.getStorageSync('isHasUserInfo')
    })
  },

  onShow:function(){
    var that = this;
    that.setData({
      hasUserInfo: wx.getStorageSync('isHasUserInfo')
    })
  },

  //当选择启事类型时，更改参数 isLost 的值
  lostTurnToFound(e) {
    this.setData({
      isLost: false
    })
  },
  foundTurnToLost(e) {
    this.setData({
      isLost: true
    })
  },

  //添加图片，并保存图片的路径
  addPic(e) {
    var that = this;
    var count = 3 - that.data.tempPicPath.length;
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = that.data.tempPicPath.concat(res.tempFilePaths);
        console.log(tempFilePaths)
        that.setData({
          hasPic: true,
          tempPicPath: tempFilePaths
        })
      }
    })
  },


  //上传记录到云端，并存储图片
  submitNotice(e) {
    var that = this;
    if (that.data.hasUserInfo) {

      var rangeNameList = this.data.rangeNameList;
      var tempPicPath = this.data.tempPicPath;
      var nowTime = new Date();
      var cloudPicPath = [];
      var tempnNoticeId = util.myFormatTime(nowTime) + rangeNameList[Math.round(Math.random() * 61)] + rangeNameList[Math.round(Math.random() * 61)] + rangeNameList[Math.round(Math.random() * 61)];
      if (tempPicPath.length != 0) {
        for (var i = 0; i < tempPicPath.length; i++) {
          var splitPathArr = tempPicPath[i].split(".");
          cloudPicPath[i] = tempnNoticeId + i + "." + splitPathArr[1];
        }
      }
      var userName = wx.getStorageSync('userInfo').nickName;
      var userAvatar = wx.getStorageSync('userInfo').avatarUrl;
      var noticeId = tempnNoticeId.substr(2);
      var article = e.detail.value.article;
      var place = e.detail.value.place;
      var section = e.detail.value.section;
      var contact = e.detail.value.contact;
      var picPath = cloudPicPath;
      var date = util.formatTime(nowTime);
      var type = e.detail.value.noticeType;
      var done = false;
      var picNum = picPath.length;
      var isLost;
      if (type == "丢失") {
        isLost = true
      } else {
        isLost = false
      }
      if(contact){
        section = "我在" + place + type + article + "。" + section + "联系方式：" + contact;
      }else{
        section = "我在" + place + type + article + "。" + section;
      }
      
      //以下是敏感词汇列表，用于屏蔽敏感词
      var banWord=["接单","代写","兼职","招聘","刷单","代刷","死"];

      for(var i=0;i<banWord.length;i++){
        if(section.indexOf(banWord[i])>=0){
          wx.showToast({
            title: '含有不当词汇！',
            image: '../../image/error.png'
          });
          return
        }
      }

      if (place && article) {
        db.collection('lostNotice').add({
          data: {
            _id: noticeId,
            uName: userName,
            uAvatar: userAvatar,
            Article: article,
            Contact: contact,
            Date: date,
            Done: done,
            PicPath: picPath,
            Place: place,
            Section: section,
            Type: type,
            PicNum: picNum,
            isLost: isLost
          },
          success(res) {
            console.log("发布成功", res);
          },
          fail(res) {
            console.log("发布失败", res)
          }
        });
        that.uploadPics(tempPicPath, picPath, 0);
      }else{
        wx.showToast({
          title: '请填写大致地点及物品！',
          icon: 'none'
        })
        console.log("请填写大致地点及物品！")
      }
    }
    else {
      wx.showToast({
        title: '请先进行登录!',
        icon: 'error'
      })
      console.log("请先登录！")
    }
  },


  uploadPics: function (temppath, cloudpath, i) {
    var that = this;
    wx.cloud.uploadFile({
      cloudPath: cloudpath[i],
      filePath: temppath[i],
      success(){
        console.log("上传成功")
        i++;
        if (i < temppath.length) {
          that.uploadPics(temppath, cloudpath, i)
        }
        if(i==temppath.length){
          wx.showToast({
            title: '发布成功',
            icon: 'success'
          });
          that.resetNotice();
          that.setData({
            empty: ''
          })
        }
        
      },
      fail(){
        wx.showToast({
          title: '发布失败',
          image: '../../image/error.png'
        })
      }
    })
    
  },


  //重置表单
  resetNotice(e) {
    this.setData({
      checked: true,
      tempPicPath: [],
      hasPic: false,
      isLost: true
    })
  },


  deleteThepic(e) {
    var that = this;
    var picId = e.currentTarget.id;
    var picPathList = that.data.tempPicPath;
    picPathList.splice(picId, 1);
    console.log(picPathList);
    that.setData({
      tempPicPath: picPathList
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