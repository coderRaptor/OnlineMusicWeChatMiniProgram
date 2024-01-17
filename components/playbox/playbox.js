// components/playbox/playbox.js
import {storeBindingsBehavior} from "mobx-miniprogram-bindings/index"
import {store} from "../../store/store"
Component({
  // 引入状态管理数据
  // 导入对应存储store数据的工具代码 获取数据
  behaviors:[storeBindingsBehavior],
  storeBindings:{
    // 数据源
    store,
    fields:{
      music:"music"
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 备用数据
    music:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取歌曲详情
    getDetail(music){
      return new Promise((resolve, reject)=>{
        wx.request({
          url: 'http://localhost:3000/song/detail?ids=' +music.id,
          success: (result) => {
            // console.log("状态当中的详情:",result.data.songs[0])
            resolve(result.data.songs[0])
          },

        })
      })
    },
    // 去播放
    gotoPlay(){
      // 拿到本地数据
      const nowData = wx.getStorageSync('nowData')
      // 判断是否有
      if(!nowData){
        wx.showModal({
          content: '请先点歌哦~',
          title: '提示',
          confirmText:"去点歌",
          success(res){
            if(res.confirm){
              wx.navigateTo({
                url: '/pages/search/search',
              })
            }
          }
        })
        return;
      }
      // 如果存在数据即点过歌
      wx.navigateTo({
        url: '/pages/play/play',
      })
    },
    
  },
  // 生命周期
  lifetimes:{
    ready(){
      // 获取本地数据
      const nowData = wx.getStorageSync('nowData');
      // 判断是否有本地存储
      if(!nowData) return;
      // 获取本地存储music数据
      const {music} = nowData;
      if(!this.data.music){
        this.getDetail(music).then(res=>{
          this.setData({
            music:res
          })
        })
      }
    }
  }
})