// pages/play/play.js
// 导入用作状态管理的包
import { get } from "mobx-miniprogram"
import {createStoreBindings} from "../../miniprogram_npm/mobx-miniprogram-bindings/index"
// 导入状态管理的工具代码
import {store} from "../../store/store"
// 创建播放引擎 实现后台播放
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 歌词滚动定时器阀门
    timer:null,
    // 碟片旋转样式阀门
    rotate:true,
    // 播放列表显示阀门
    show: false,
    // 歌曲列表
    musicList:[], 
    // 当前播放歌曲在列表中的下标
    index:-1, 
    // 当前播放歌曲对象
    music:null, 
    // 当前播放歌曲的id
    mid:0,
    // 播放/暂停状态阀门
    playState: true,
    // 歌词数据([[秒,歌词],[秒,歌词]....])
    lrcdata:[],
    // 当前播放歌词在lrcdata中的下标
    nowlrcIndex:0,
    // 滚动top值
    lrctop:0,
    // 格式化后的总时长 分:秒
    timeSum_str:"",
    // 格式化后的当前播放时间 分:秒
    timeNow_str:"",
    // 总时长
    timeSum:0,
    // 当前播放时间
    timeNow:0,
    // 播放模式列表
    mode:["sequence", "single", "random"],
    // 当前播放模式列表下标
    modeIndex:0,
    // 当前循环模式
    currentMode:"sequence"
  },

  // 封装创建 存储对象 store方法
  storeInit:function () {
    this.storeBindings = createStoreBindings(this,{
      store,
      fields:["music"],
      actions:["updateMusic"]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 初始化
    this.audioInit();
    // 播放音频
    this.audioPlay();
    // 初始化状态管理方法
    this.storeInit(),
    // 一定时间监听滚动距离后滚动到正在唱的歌词
    this.lrcscrollFix()
  },
  // 初始化方法
  audioInit(){
    // 获取本地存储的数据
    const {musicList, index, music, mid} = wx.getStorageSync('nowData')
    // console.log(music);
    // 把数据存储到本地
    this.setData({
      musicList, 
      index, 
      music, 
      mid
    })
    // 获取循环方式
    const modeObj = wx.getStorageSync('modeObj')
    // 判断是否有播放状态
    if(modeObj){
      const {currentMode, modeIndex} = modeObj;
      this.setData({
        modeIndex,
        currentMode
      })
    }
    // 定义各种 监听（播放，暂停，是否进入播放状态，播放时长更新，播放结束，播放出错）
    // 绑定了监听事件后卸载该页面时一般要移除,否则重复进入该页面多次调用audioInit从而对同一监听事件例如onPlay绑定多个事件处理函数,这里暂时没有移除,开发中...
    // 播放监听
    innerAudioContext.onPlay(()=>{
      // console.log("开始播放");
    })
    // 暂停监听
    innerAudioContext.onPause(()=>{
      // console.log("暂停");
    })
    // 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
    innerAudioContext.onCanplay(()=>{
      // console.log("监听进入播放状态");
      innerAudioContext.duration;
    })
    // 监听播放进度更新
    innerAudioContext.onTimeUpdate(()=>{
      // console.log("监听音频播放进度更新事件");
      // 歌曲总时长
      // const timeSum = innerAudioContext.duration;
      // 歌曲当前播放时间(秒)
      // const timeNow = innerAudioContext.currentTime;
      // 歌词滚动
      this.lrcscroll();
      // console.log(timeNow);
      // 进度条改变(自动变化)
      this.sliderTimeChange();
    })
    // 播放结束监听
    innerAudioContext.onEnded(()=>{
      
      // console.log(innerAudioContext);
      // 根据循环模式进行不同操作
      const currentMode = this.data.currentMode;
      switch (currentMode) {
        case 'sequence':
              this.nextSong();
              break;
        case 'single':
              innerAudioContext.stop();
              setTimeout(()=>{
                innerAudioContext.play();
              }, 100)
          break;
        case 'random':
              // 获取当前存储数据
              const nowData = wx.getStorageSync('nowData');
              const musicList = nowData.musicList;
              let index = Math.floor(Math.random()*musicList.length);
              nowData.index = index;
              nowData.music = musicList[index];
              nowData.mid = musicList[index].id;
              // 存储更新
              wx.setStorageSync('nowData', nowData)
              // 状态管理更新
              store.updateMusic(musicList[index])
              // 重新初始化
              this.audioInit();
              // 播放
              this.audioPlay();
      }
    })
    // 播放错误监听
    innerAudioContext.onError((res)=>{
      // console.log(res);
      
      wx.showToast({
        title: '无版权',
        duration: 1500,
        icon: 'error',
      })
    })

  },
  // 歌词匹配方法
  lrcscroll(){
    const timeNow = innerAudioContext.currentTime;
    const lrcdata = this.data.lrcdata;
    // 遍历歌词
    for(let i = 0; i < lrcdata.length-1; i++){
      // 判断当前播放歌词区间
      if(lrcdata[i][0] < timeNow && timeNow < lrcdata[i+1][0]){
        // 标注当前播放歌词在列表lrcdata中的下标
        this.setData({
          nowlrcIndex: i
        })
      }
    }
    // 根据歌词下标变化更改top值
    // this.setData({
    //   lrctop:(this.data.nowlrcIndex-5)*40
    // })
    // console.log(this.data.lrctop);
  },
  // 歌词滚动
  lrcscrollFix(){
    // console.log("123");
    let timer = setInterval(()=>{
      if((this.data.nowlrcIndex-5)*40 == this.data.lrctop) return;
      this.setData({
      lrctop:(this.data.nowlrcIndex-5)*40
    })
    }, 1000)
    this.setData({
      timer
    })
  },
  // 进度条发生改变
  sliderTimeChange(){
    // 进行 分:秒 的格式化处理
    const timeSum_str = this.setTimeFormat(innerAudioContext.duration);
    const timeNow_str = this.setTimeFormat(innerAudioContext.currentTime);
    // 存储
    this.setData({
      timeSum_str,
      timeNow_str,
      timeNow:innerAudioContext.currentTime,
      timeSum:innerAudioContext.duration
    })
  },
  // 拖拽进度条事件处理函数
  sliderDrag(e){
    // console.log(e);
    const value = e.detail.value
    this.setData({
      timeNow:value
    })
    innerAudioContext.seek(value);
  },
  // 时间格式化
  setTimeFormat(time){
    // 进行 分:秒 格式化
    let m = Math.floor(time/60);
    let s = Math.floor(time%60);
    m = m < 10? '0' + m : m;
    s = s < 10? '0' + s : s;
    return `${m}:${s}`;
  },
  // 详情展示
  getDetail(){
    wx.request({
      url: 'http://localhost:3000/song/detail?ids=' + this.data.mid,
      success: (result) => {
        this.setData({
          music:result.data.songs[0]
        })
      },
    })
  },

  // 获取歌词方法
  getlrc(){
    wx.request({
      url: 'http://localhost:3000/lyric?id=' + this.data.mid,
      success: (result) => {
        this.setlrc(result.data.lrc.lyric);
      },
    })
  },
  // 整理歌词的方法
  setlrc(lrc){
    const lrcdata = [];
    const lrclist = lrc.split("\n");
    const regExp = /\[\d{2}:\d{2}\.\d{2,3}\]/;
    lrclist.forEach(item => {
      let itemTime = item.match(regExp);
      if(itemTime){
        // [01:12.23] ==> 01:12.23
        itemTime = itemTime[0].slice(1, -1);
        // console.log(itemTime);
        // 把时间全部转为 秒单位
        const itemList = itemTime.split(":");
        const timeSecond = parseFloat(itemList[0])*60 + parseFloat(itemList[1]);
        // 获取歌词
        const lyricStr = item.replace(regExp, '');
        lrcdata.push([timeSecond, lyricStr])
      }
    })
    this.setData({
      lrcdata
    })
    // console.log(lrcdata);
  },
  
  // 定义播放方法
  audioPlay(){
    setTimeout(()=>{
      // 获取歌曲详情
      this.getDetail();
      // 获取歌词
      this.getlrc()
    }, 10)
    // 定义定时器触发下面执行 可以解决二次进入页面进度条无效的问题
    setTimeout(() => {
      innerAudioContext.paused
    }, 10);
    // 设置音频地址
    innerAudioContext.src = `http://music.163.com/song/media/outer/url?id=${this.data.mid}.mp3`;
    innerAudioContext.play()
    getApp().globalData.innerAudioContext = innerAudioContext;
  },
  // 切换播放状态 播放/暂停
  togglePlayState(){
    const state = this.data.playState;
    // 切换播放/暂停状态
    this.setData({
      playState: !state
    })
    state ? innerAudioContext.pause() : innerAudioContext.play();
    // 切换碟片旋转阀门状态
    this.setData({
      rotate: !this.data.rotate
    })
  },
  // 切换播放模式
  changeMode(){
    // 获取播放模式列表
    const mode = this.data.mode;
    // 获取当前所处下标
    let modeIndex = this.data.modeIndex;
    ++modeIndex === mode.length ? modeIndex = 0 : '';
    this.setData({
      modeIndex,
      currentMode: mode[modeIndex]
    })
    // 存储到本地
    wx.setStorageSync('modeObj', {
      currentMode: mode[modeIndex],
      modeIndex
    })
  },
  // 下一首
  nextSong(){
    // 获取storage的数据
    const nowData = wx.getStorageSync('nowData');
    let index = nowData.index;
    const musicList = nowData.musicList;
    ++index === musicList.length ? index = 0 : '';
    // console.log(index);
    nowData.index = index;
    nowData.music = musicList[index];
    nowData.mid = musicList[index].id;
    // 存储本地
    wx.setStorageSync('nowData', nowData);
    // 状态管理存储更新
    store.updateMusic(musicList[index])
    // 初始化数据
    this.audioInit();
    // 播放
    this.audioPlay();
  },
  // 上一首
  prevSong(){
    // 获取storage的数据
    const nowData = wx.getStorageSync('nowData');
    let index = nowData.index;
    const musicList = nowData.musicList;
    --index < 0 ? index = musicList.length - 1 : '';
    // console.log(index);
    nowData.index = index;
    nowData.music = musicList[index];
    nowData.mid = musicList[index].id;
    // 存储本地
    wx.setStorageSync('nowData', nowData);
    // 状态管理存储更新
    store.updateMusic(musicList[index])
    // 初始化数据
    this.audioInit();
    // 播放
    this.audioPlay();
  },
  // 播放列表中切换歌曲
  listToggleSong(e){
    // console.log(e);
    const index = e.currentTarget.dataset.in;
    // 获取存储的数据
    const nowData = wx.getStorageSync('nowData');
    const musicList = nowData.musicList;
    nowData.index = index;
    nowData.music = musicList[index];
    nowData.mid = musicList[index].id;
    // 存储数据
    wx.setStorageSync('nowData', nowData);
    // 状态管理的存储更新
    store.updateMusic(musicList[index])
    // 重新初始化
    this.audioInit();
    // 播放
    this.audioPlay();
  },
  // 跳转到MV播放页
  gotoMvPlay(){
    const {music} = wx.getStorageSync('nowData');
    // console.log("mvid:", music.mv);
    if(music.mv){
      this.setData({
        playState: false
      })
      this.setData({
        rotate: false
      })
      innerAudioContext.pause();
      wx.navigateTo({
        url: '/pages/mvplay/mvplay?mvid=' + music.mv,
      })
    }else{
      wx.showToast({
        title: '当前歌曲没有MV',
        icon: 'error',
      })
    }
  },
  onOpen(){
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
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
    clearInterval(this.data.timer)
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