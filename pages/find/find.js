// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTopListSongs()
  },
  // 获取榜单数据
  getTopList(){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: 'http://localhost:3000/toplist',
        success: (result) => {
          resolve(result)
        },
        fail: (err) => {},
        complete: (res) => {},
      })
    })
  },
  // 获取榜单内的歌曲数据 
  async getTopListSongs(){
    const res = await this.getTopList()
    const promiseList = []
    res.data.list.forEach(item =>{
      promiseList.push(new Promise((resolve, reject)=>{
        wx.request({
          url: 'http://localhost:3000/playlist/track/all?id=' + item.id + '&limit=3',
          success: (result) => {
            const songsList = result.data.songs
            item.songsList = songsList
            resolve(item)
          }
        })
      }))
    })
    Promise.all(promiseList).then(res => {
      // console.log(res);
      this.setData({
        topList: res
      })
    })
  },
  // 跳转详情
  gotoDetail(event){
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/listDetail/listDetail?id='+id,
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