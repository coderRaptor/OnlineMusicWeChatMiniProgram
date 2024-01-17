// app.js
// 导入状态管理的包
import {createStoreBindings} from 'mobx-miniprogram-bindings/index';
// 导入状态管理的工具代码
import {store} from '/store/store';
App({
  onload(){
    // 调用存储对象 store 方法
    this.storeInit()
  },
  // 封装创建 存储对象 store 的方法
  storeInit(){
    this.storeBindings = createStoreBindings(this, {
      store,
      fields:["music"],
      actions:["updateMusic"]
    })
  },
  globalData: {
    userInfo: null,
    innerAudioContext:null,
  },
  // 改变音频播放状态
  changePlayState(flag){
    flag ? this.globalData.innerAudioContext.play() : this.globalData.innerAudioContext.pause();
  },
  // 获取数据进行存储,判断歌曲是否有播放权限
  gotoPlay(nowData){
    /* 
    1.判断歌曲是否能播放
    2.可以播放就存储数据到storage中
    3.跳转
    */
    const {musicList, index, music, mid} = nowData;
    wx.request({
      url: 'http://localhost:3000/check/music?id=' + mid,
      success: (result) => {
        // console.log(result.data);
        const {success, message} = result.data;
        if(success){
          // 可以播放就存储到storage当中
          wx.setStorageSync('nowData', nowData)
          // 也要存储到状态库中
          store.updateMusic(music)
          // 跳转到播放页面
          wx.navigateTo({
            url: '/pages/play/play',
          })
        }else{
          wx.showModal({
            content: message,
            title: '提示',
            success: (result) => {},
            fail: (res) => {},
            complete: (res) => {},
          })
        }
      },
    })

  },
  onUnload(){
    // 卸载应用销毁
    this.storeBindings.destroyStoreBindings();
  }
})
