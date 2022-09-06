<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <LobbyGame :socket="socket"/>
  <ABGame/>
</template>

<script>
import { io } from "socket.io-client";
// const socket = io('http://localhost:3000')

import LobbyGame from './components/LobbyGame.vue'
import ABGame from './components/ABGame.vue'

export default {
  name: 'App',
  components: {
    LobbyGame,
    ABGame
  },

  data(){
    return {
      socket: null,
    }
  },
  created(){
    this.socket = io('http://localhost:3000')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
