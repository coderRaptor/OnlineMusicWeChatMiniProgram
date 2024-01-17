// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList:[],
    navIndex:0,
    word:"综艺",
    musicData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getNavList()
    this.getMusicData()
  },
  // 获取导航关键词
  getNavList(){
    wx.request({
      url: 'http://localhost:3000/playlist/catlist',
      success: (result) => {
        // console.log(result.data.sub);
        this.setData({
          navList:result.data.sub
        })
      },
    })
  },
  // 获取歌单列表
  getMusicData(){
    wx.request({
      url: 'http://localhost:3000/top/playlist?limit=20&cat='+this.data.word,
      success: (result) => {
        // console.log(result.data.playlists);
        this.setData({
          musicData:result.data.playlists
        })
      },
    })
  },
  // 导航点击
  navClick(e){
    this.setData({
      navIndex:e.currentTarget.dataset.index,
      word:e.currentTarget.dataset.word
    })
    this.getMusicData()
  },
  // 跳转到榜单详情页
  gotoDetail(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/listDetail/listDetail?id=' + id,
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