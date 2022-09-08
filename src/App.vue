<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <LobbyGame :socket="socket"/>
  <ABGame :socket="socket"/>
</template>

<script>
import { io } from "socket.io-client";
// const socket = io('http://localhost:3000')

import LobbyGame from './components/LobbyGame.vue'
import ABGame from './components/ABGame.vue'
console.log("env ",process.env.VUE_APP_SERVER_URL)

export default {
  name: 'App',
  components: {
    LobbyGame,
    ABGame
  },

  data(){
    return {
      socket: io(process.env.VUE_APP_SERVER_URL),
    }
  },
  created(){
    this.socket.on('connect', function() {
      console.log('Connected');
    });

    this.socket.on('disconnect', function() {
      console.log('Disconnected');
    });
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