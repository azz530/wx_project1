
Page({

  turnToHelp(e){
    console.log(e);
    wx.navigateTo({
      url: '../Help/Help',
    })
  },
  onShareAppMessage: function (res) {
		return {
		  title: '接离家出走的宝贝回家~',
		  path: 'pages/browseNotice/browseNotice', 
		  imageUrl: "../../image/xiaochengxuma.jpg"
    }
  }

})