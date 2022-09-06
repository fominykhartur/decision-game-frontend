<script>
import { io } from "socket.io-client";
const socket = io('http://localhost:3000')
export default {
  data() {
    return {
      body : 0,
      chatMessages : [],
      clientsList : [],
      currentRoom: ""
    }
  },
  methods : {
    makeChoose : function(buttonID) {
      console.log(`Нажата кнопка ${buttonID}`)
      socket.emit('getChoose', buttonID)
    },
    createRoom : function(roomName) {
      console.log(`Покинута комната с именем ${this.currentRoom}`)
      console.log(`Создана комната с именем ${roomName}`)
      socket.emit(`createRoom`, this.currentRoom, roomName)
      this.currentRoom = roomName
      // this.chatMessages = []
    },
    sendMessage : function(inputMessage) {
      console.log(`Отправлено сообщение ${inputMessage}`)
      socket.emit(`gameChat`, this.currentRoom, inputMessage)
      this.$refs['inputChatMessage'].value = ''
    }
  },
  mounted() {
    socket.on('getClientCount', (data) => {
      console.log('Num of clients:', data);
      this.body = data;
      console.log('Socket name:', socket.id)
      this.name = socket.id
    });

    socket.on('getClientList', (data) => {
      console.log('Connected clients: ', data)
      this.clientsList = data
    });

    socket.on('getChatMessage', (chatMessage) => {
      this.chatMessages.push(chatMessage)
    })
  },
  created() {
    socket.on('connect', function() {
      console.log('Connected');
      console.log(socket);
    });

    socket.on('disconnect', function() {
      console.log(socket)
      console.log('Disconnected');
    });
  },
}
</script>

<template>
  <h1>{{ currentRoom }}</h1>
  <h2>Мое имя:{{name}}</h2>
  <div>{{body}}</div>
  <div>{{clientsList}}</div>
  <div>
  <ul id="example-1">
    <li v-for="item in clientsList" :key="item">
      {{item}}
    </li>
  </ul>
  </div>
  <div v-if="body >= 2">
    <p><button v-on:click="makeChoose('A')">Ally</button></p>
    <p><button v-on:click="makeChoose('B')">Betray</button></p>
  </div>
  <div>
    <input v-model.trim="roomName" placeholder="отредактируй меня">
    <button v-on:click="createRoom(roomName)">Создать комнату</button>
  </div>
  <div>
  <ul id="example-2">
    <li v-for="message in chatMessages" :key="message">
      <span>{{message}}</span>
    </li>
  </ul>
  </div>
  <div>
    <input ref="inputChatMessage" v-model.trim="inputMessage" @keyup.enter="sendMessage(inputMessage)">
  </div>
</template>