<template>
  <audio :src="audioFileUrl()" id="msgNewPlay" @ended="audioPlayEnd"></audio>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'message-play',
  data() {
    return {

    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.$on('musicPlay', this.playAudio)
    })
  },
  computed: {
    ...mapState({
      isPlayAudio: state => state.message.isPlayAudio
    })
  },
  watch: {
    isPlayAudio: function (val, oldval) {
      if (val) {
        this.playAudio()
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_IS_PLAY_AUDIO'
    ]),
    playAudio() {
      console.log('播放声音')
      let audio = document.getElementById("msgNewPlay")
      if(audio){
        // 获取音效
        audio.src = this.audioFileUrl()
        // 获取音量
        let volume = localStorage.getItem('global_tip_volume')
        if(volume === '0'){
          audio.volume = 0.0
        }else if (volume > 0) {
          audio.volume = parseFloat(volume / 100)
        }
        console.log(audio.volume)
        audio.play()
      }
      // TODO volume 音量
    },
    audioPlayEnd(){
      console.log('播放声音结束')
      this.SET_IS_PLAY_AUDIO(false)
    },
    audioFileUrl(){
      const path = require('path')
      let audioPath = ''
      let voice = localStorage.getItem('global_tip_voice')
      if(!voice){
        voice = 1
      }
      if (process.env.NODE_ENV !== 'development') {
        audioPath = path.join(__static, '/audio/msg'+ voice +'.mp3')
      }else{
        audioPath = '../../../../static/audio/msg'+ voice +'.mp3'
      }
      return audioPath
    }
  }
}
</script>
