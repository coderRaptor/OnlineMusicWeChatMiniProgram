// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotlist:[],
    // 搜索结果
    resultList:[],
    value:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHotList()
  },
  // 获取热搜列表
  getHotList(){
    wx.request({
      url: 'http://localhost:3000/search/hot/detail',
      success: (result) => {
        // console.log(result);
        this.setData({
          hotlist:result.data.data
        })
      },
    })
  },
  // 点击热搜榜关键字
  goSearch(event){
    const word = event.currentTarget.dataset.word;
    this.search(word)
  },
  // 搜索
  search(word){
    wx.request({
      url: 'http://localhost:3000/search?keywords=' + word,
      success: (result) => {
        // console.log(result);
        this.setData({
          resultList: result.data.result.songs,
        })
      },
    })
  },
  // vant的 输入框改变
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  // vant的 点击搜索
  onSearch() {
    this.search(this.data.value);
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