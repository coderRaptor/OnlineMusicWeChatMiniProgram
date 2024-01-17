// pages/singerDetail/singerDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 拉伸简介阀门
    txtShow:false,
    // 歌手详情
    detail:{},
    topMusic:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options.id);
    this.getDetail(options.id);
    this.getTopMusic(options.id)
  },
  clickBtn(){
    this.setData({
      txtShow:!this.data.txtShow
    })
  },
  // 获取歌手详情数据
  getDetail(id){
    wx.request({
      url: 'http://localhost:3000/artist/detail?id='+id,
      success: (result) => {
        // console.log(result);
        this.setData({
          detail:result.data.data,
        })
      },
    })
  },
  // 获取歌手热门歌曲
  getTopMusic(id){
    wx.request({
      url: 'http://localhost:3000/artist/top/song?id='+id,
      success: (result) => {
        // console.log(result);
        this.setData({
          topMusic:result.data.songs,
        })
      },
    })
  },
  // 跳转 播放方法
  GoPlay(event){
    /* 
    1.需要获取当前播放列表
    2.获取当前点击的歌曲下标
    3.拿到当前歌曲id
    4.判断歌曲是否能播放
    5.可以播放则存储数据到storage当中
    6.判断和存储和页面路由 这几个步骤抽离成公共方法放入app.js当中
    */
    const musicList = event.currentTarget.dataset.list;
    const index = event.currentTarget.dataset.index;
    const music = musicList[index];
    const mid = musicList[index].id;
    // 封装成对象
    const data = {musicList, index, music, mid};
    
    getApp().gotoPlay(data)
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