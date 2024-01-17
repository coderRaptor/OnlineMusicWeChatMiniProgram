// pages/music/music.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gridList:[
      {
        path:"/images/tab-search.png",
        name:"搜索",
        url:"/pages/search/search"
      },
      {
        path:"/images/tab-playbtn.png",
        name:"精选视频",
        url:"/pages/mvlist/mvlist"
      },
      {
        path:"/images/tab-hot.png",
        name:"热门歌曲",
        url:"/pages/topMusic/topMusic"
      },
      {
        path:"/images/tab-classbtn.png",
        name:"分类",
        url:"/pages/category/category"
      },
      {
        path:"/images/tab-person.png",
        name:"个人中心",
        url:"/pages/user/user"
      },
    ],
    // 轮播图数据
    swiperList:[],
    // 热门歌手
    topSingerList:[],
    // 最新音乐
    newSongList:[],
    // 热门歌曲
    topSongList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 调用获取轮播图数据的方法
    this.getSwiperList();
    // 调用获取热门歌手
    this.getTopSingerList();
    // 调用获取热门歌曲
    this.getTopSongList();
    // 调用获取最新音乐
    this.getNewSongList();
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

  },
  // 获取轮播图数据
  getSwiperList(){
    wx.request({
      url: 'http://localhost:3000/banner',
      success: (result) => {
        this.setData({
          swiperList:result.data.banners,
        })
      },
      fail: (err) => {},
      complete: (res) => {},
    })
  },
  // 获取热门歌手数据
  getTopSingerList(){
    wx.request({
      url: 'http://localhost:3000/top/artists',
      success: (result) => {
        this.setData({
          topSingerList:result.data.artists,
        })
      },
      fail: (err) => {},
      complete: (res) => {},
    })
  },
  // 获取热门歌曲数据
  getTopSongList(){
    wx.request({
      url: 'http://localhost:3000/playlist/track/all?id=3778678&limit=10&offset=1',
      success: (result) => {
        this.setData({
          topSongList:result.data.songs,
        })
      },
      fail: (err) => {},
      complete: (res) => {},
    })
  },
  // 获取最新音乐数据
  getNewSongList(){
    wx.request({
      url: 'http://localhost:3000/personalized/newsong',
      success: (result) => {
        this.setData({
          newSongList:result.data.result,
        })
      },
      fail: (err) => {},
      complete: (res) => {},
    })
  },
  // 跳转歌手详情
  gotoSingerDetail(event){
    // console.log(event);
    // 获取歌手 id
    const singerid = event.currentTarget.dataset.singerid;
    // 页面路由跳转 并 进行 id 的传递
    wx.navigateTo({
      url: '/pages/singerDetail/singerDetail?id=' + singerid,
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
})