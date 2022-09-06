<script>
// import { io } from "socket.io-client";
// const socket = io('http://localhost:3000')
export default {
  props: {
    socket : Object,
  },
  data() {
    return {
      body : 0,
      chatMessages : [],
      rooms : [],
      clientsList : [],
      currentRoom: "",
      LobbyStatus: true,
    }
  },
  methods : {
    makeChoose : function(buttonID) {
      console.log(`Нажата кнопка ${buttonID}`)
      this.socket.emit('getChoose', buttonID)
    },
    createRoom : function(roomName) {
      console.log(`Покинута комната с именем ${this.currentRoom}`)
      console.log(`Создана комната с именем ${roomName}`)
      this.socket.emit(`createRoom`, this.currentRoom, roomName)
      this.currentRoom = roomName
      // this.chatMessages = []
    },
    joinRoom: function(room) {
      console.log('Переход в комнату ',room)
      this.socket.emit('changeRoom', this.currentRoom, room)
      this.currentRoom = room
    },
    sendMessage : function(inputMessage) {
      console.log(`Отправлено сообщение ${inputMessage}`)
      this.socket.emit(`gameChat`, this.currentRoom, inputMessage)
      this.$refs['inputChatMessage'].value = ''
    }
  },
  mounted() {
    this.socket.on('getClientCount', (data) => {
      console.log('Num of clients:', data);
      this.body = data;
      console.log('Socket name:', this.socket.id)
      this.name = this.socket.id
    });

    this.socket.on('getClientList', (data) => {
      console.log('Connected clients: ', data)
      this.clientsList = data
    });

    this.socket.on('getRooms', (rooms) => {
      console.log('rooms', rooms)
      this.rooms = rooms
    })

    this.socket.on('getChatMessage', (chatMessage) => {
      this.chatMessages.push(chatMessage)
    })
  },
  created() {
    // this.socket.on('connect', function() {
    //   console.log('Connected');
    //   console.log(this.socket);
    // });

    // this.socket.on('disconnect', function() {
    //   console.log(this.socket)
    //   console.log('Disconnected');
    // });
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
  <div v-for="room in rooms" :key="room">
    <button v-on:click="joinRoom(room)">{{room}}</button>
  </div>
</template>