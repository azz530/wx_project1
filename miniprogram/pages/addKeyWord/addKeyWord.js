const db = wx.cloud.database()
Page({

  data: {
    myKeyWord: [],
    canSet: false,
    defaultValue: '',
    switchChecked: false,
    switchDisabled: false,
    hasUserInfo: false
  },


  onLoad: function (options) {
    var that = this;
    that.setData({
      hasUserInfo: wx.getStorageSync('isHasUserInfo')
    })

    if (that.data.hasUserInfo) {
      db.collection("keyWord").where({
        _openid: wx.getStorageSync('userOpenId')
      }).get({
        success: (res) => {
          if (res.data.length) {
            that.setData({
              myKeyWord: res.data[0].keyWord,
            });
            var arrKeyWord = res.data[0].keyWord;
            if (arrKeyWord.length > 0) {
              var tempValue = "";
              for (var i = 0; i < arrKeyWord.length; i++) {
                tempValue += arrKeyWord[i];
                if (i < arrKeyWord.length - 1) {
                  tempValue += "、"
                }
              }
              that.setData({
                defaultValue: tempValue
              })
            }
          } else {
            console.log("无记录")
          }
        }
      });
    }
  },


  TurnToCanSet(e) {
    var that = this;
    if (that.data.hasUserInfo) {
      if (that.data.canSet) {
        var inputText = e.detail.value.inputText;
        var arrWord = inputText.split("、");
        console.log(arrWord)

        for (var i = 0; i < arrWord.length; i++) {
          arrWord[i] = arrWord[i].replace(/(^\s*)|(\s*$)/g, "");
        }
        var tempArr = [];
        for (var i = 0; i < arrWord.length; i++) {
          if (arrWord[i] != "") {
            tempArr.push(arrWord[i])
          }
        }
        arrWord = tempArr;
        if (arrWord == 0) {
          arrWord = [""];
          inputText = ""
        }
        that.setData({
          defaultValue: inputText,
          myKeyWord: arrWord,
          canSet: false
        });

        console.log(arrWord)

        db.collection("keyWord").where({
          _openid: wx.getStorageSync('userOpenId')
        }).get({
          success: (res) => {
            if (res.data.length) {
              if(arrWord.toString() != res.data[0].keyWord.toString()){
                wx.showToast({
                  title: '添加关键词成功',
                  icon: "success",
                })
              }
              if (wx.getStorageSync('userOpenId')) {
                db.collection("keyWord").where({
                  _openid: wx.getStorageSync('userOpenId')
                }).update({
                  data: {
                    keyWord: arrWord
                  }
                })
              }
            } else {
              if(arrWord.toString() != res.data[0].keyWord.toString()){
                wx.showToast({
                  title: '添加关键词成功',
                  icon: "success",
                })
              }
              db.collection("keyWord").add({
                data: {
                  _openid: wx.getStorageSync('userOpenId'),
                  keyWord: arrWord
                }
              })
            }
          }
        });

        if ((arrWord.length == 1 && arrWord[0]) || arrWord.length > 1) {
          that.subscribeNew();
        }
      } else {
        that.setData({
          canSet: true,
        })
      }
    }else{
      wx.showToast({
        title: '请先进行登录!',
        icon: 'error'
      })
    }
  },

  //tap事件：用户确认订阅消息
  subscribeNew: function () {
    var that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['DfR2cn0nVuqhkfPPOW8M63oR_fa0A2n0P_aDQxsKg1A'],
      success(res) {

        var requestResult = res['DfR2cn0nVuqhkfPPOW8M63oR_fa0A2n0P_aDQxsKg1A'];
        console.log(requestResult);
      }
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