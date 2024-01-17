// pages/mvlist/mvlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getmvlist()
  },
  // 获取mv数据
  getmvlist(){
    wx.request({
      url: 'http://localhost:3000/mv/exclusive/rcmd',
      success: (result) => {
        // console.log(result);
        result.data.data.forEach(item => {
          const count = this.setCount(item.playCount);
          item.countStr = count;
        })
        // 存储
        this.setData({
          mvlist:result.data.data
        })
      },
    })
  },
  // 处理播放量
  setCount(count){
    let countStr = "";
    if(count >= 10000){
      let c1 = Math.floor(count/10000);
      let c2 = count%10000;
      c2 = String(c2).slice(0,2);
      countStr = `${c1}.${c2}万`;
      return countStr;
    }
    return count;
  },
  // 跳转mv播放页
  gotoMvPlay(e){
    const mvid = e.currentTarget.dataset.mvid;
    wx.navigateTo({
      url: '/pages/mvplay/mvplay?mvid='+mvid,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})