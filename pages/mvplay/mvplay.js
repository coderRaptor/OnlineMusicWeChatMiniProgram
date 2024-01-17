// pages/mvplay/mvplay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvurl:"",
    mvdetail:{},
    // 相似的mv列表
    mvs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init(options.mvid)
  },
  // 初始化
  init(mvid){
    // 停止先前歌曲的播放
    getApp().changePlayState(false);
    // 获取当前播放url
    this.geturl(mvid)
    // 获取详情
    this.getdetail(mvid)
    // 获取推荐mv
    this.getRecommend(mvid)
  },
  // 获取url
  geturl(mvid){
    wx.request({
      url: 'http://localhost:3000/mv/url?id=' + mvid,
      success: (result) => {
        this.setData({
          mvurl:result.data.data.url
        })
      },
    })
  },
  // 获取详情
  getdetail(mvid){
    wx.request({
      url: 'http://localhost:3000/mv/detail?mvid=' + mvid,
      success: (result) => {
        const mvdetail = result.data.data
        mvdetail.countStr = this.setCount(mvdetail.playCount)
        this.setData({
          mvdetail:mvdetail
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
  getRecommend(mvid){
    wx.request({
      url: 'http://localhost:3000/simi/mv?mvid=' + mvid,
      success: (result) => {
        console.log(result.data.mvs)
        this.setData({
          mvs:result.data.mvs
        })
      },
    })
  },
  // 点击选择推荐MV播放
  changeMV(e){
    const mvid = e.currentTarget.dataset.mvid;
    this.init(mvid)
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