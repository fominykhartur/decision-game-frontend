<template>
  <LobbyGame v-if = "!inGame" :socket="socket"/>
  <ABGame v-if="inGame" :socket="socket"/>
</template>

<script>
import { io } from "socket.io-client";
// const socket = io('http://localhost:3000')

import LobbyGame from './components/LobbyGame.vue'
import ABGame from './components/ABGame.vue'
console.log("Окружение: ",process.env.VUE_APP_SERVER_URL)

export default {
  name: 'App',
  components: {
    LobbyGame,
    ABGame
  },

  data(){
    return {
      socket: io(process.env.VUE_APP_SERVER_URL),
      inGame : false,
    }
  },
  created(){
    this.socket.on('connect', function() {
      console.log('Сервер подключен');
    });

    this.socket.on('disconnect', function() {
      console.log('Сервер отключен');
    });

    this.socket.on('joinedGame', (inGame) => {
      this.inGame = inGame;
    })
  }
}
</script>

<!-- <style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
 -->