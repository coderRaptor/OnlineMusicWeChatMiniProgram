// 导入状态管理文件
import {observable, action} from 'mobx-miniprogram';
export const store = observable({
  // 存储数据
  music:null,
  // 操作数据的方法 更新歌曲的方法
  updateMusic: action(function(music){
    // 通过重新获取歌曲详情拿到统一格式的数据
    this.getDetail(music).then(res => {
      // 进行数据存储
      this.music = res;
    })
  }),
  // 获取歌曲详情
  getDetail(music){
    return new Promise((resolve, reject)=>{
      wx.request({
        url: 'http://localhost:3000/song/detail?ids=' + music.id,
        success: (result) => {
          // console.log("状态当中的详情:",result.data.songs[0])
          resolve(result.data.songs[0])
        },

      })
    })
  }
})