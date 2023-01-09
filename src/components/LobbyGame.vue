<script>
// import { required, maxLength } from '@vuelidate/validators'
import './LobbyGame.module.css'
export default {
  props: {
    socket : Object,
  },
  // validations: {
  //   roomName: { required, maxLength: maxLength(10)}
  // },
  data() {
    return {
      playerName : '',
      roomName : '',
      roomList : [],
      currentRoom : 'Lobby',
      showRoomStatus : false,
      rules: [v => v.length <= 10 || 'Максимум 10 символов'],
      msgInputData: null,
      lobbyChat: ''
    }
  },
  methods: {
    createRoom : function(roomName) {
      // console.log(`Покинута комната с именем ${this.currentRoom}`)
      console.log(`Создана комната с именем ${roomName}`)
      // console.log(`${roomName.length}`)
      this.socket.emit(`createRoom`, {currentRoom : this.currentRoom,
                                      room : roomName,
                                      playerName : this.playerName,
                                      }) //this.currentRoom, roomName)
      this.currentRoom = roomName
      this.roomName = ''
    },
    checkRoomGameStatus: function(){
      if(this.roomList.includes(this.roomList.find(room => room.roomName === this.roomName))){
        return this.roomList.filter(room => room.roomName === this.roomName)[0].gameStarted === false
      }else{
        return true
      }
    },
    joinRoom : function(roomName) {
      // console.log(`Покинута комната с именем ${this.currentRoom}`)
      console.log(`Подключение комната с именем ${roomName}`)
      this.socket.emit('joinRoom', {currentRoom : this.currentRoom,
                                    room: roomName,
                                    playerName : this.playerName})
      this.currentRoom = roomName
      // console.log(`${roomName.length}`)
      // this.socket.emit(`createRoom`, this.currentRoom, roomName)
      // this.currentRoom = roomName
      // this.roomName = ''
    },
    clear : function() {
      this.roomName = ''
    },
    sendMessage : function() {
      console.log('Отправлено сообщение в чат:', this.msgInputData)
      this.socket.emit('gameChat', {currentRoom : this.currentRoom,
                                    playerName : this.playerName,
                                    message: this.msgInputData
                                   })
      this.msgInputData = null
    }
  },
  created() {
    this.socket.on('getClientCount', (data) => {
      console.log('Test socketa', data)
      console.log(this.socket)
    })
  },
  mounted() {
    this.socket.on('getRooms', (rooms) => {
      console.log('Получение списка всех комнат\n', rooms)
      this.roomList = rooms
    }),

    this.socket.on('getChatData', (data) => {
      console.log('Обновление данных чата', data['message'])
      this.lobbyChat += `${(data['playerName'])}: "${(data['message'])}"\n`
    })
  }
}
</script>

<template>
  <v-container>
    <v-row v-if='!this.showRoomStatus'>
      <v-col align="center" justify="end">
        <h1>Лобби</h1>
        <v-text-field
          v-model="playerName"
          :rules="rules"
          :counter="10"
          label="Имя игрока"
          required
        ></v-text-field>
        <v-form>
          <v-text-field
            v-model="roomName"
            :rules="rules"
            :counter="10"
            label="Название комнаты"
            required
          ></v-text-field>
          <v-btn :disabled="!((roomName && (roomName.length <= 10) && playerName && (playerName.length <= 10)) && checkRoomGameStatus())" 
            class="mr-4"
            @click="roomList.includes(roomList.find(room => room.roomName === roomName)) ? joinRoom(roomName) : createRoom(roomName)"
          > 
          {{ roomList.includes(roomList.find(room => room.roomName === roomName)) ? 
            (roomList.filter(room => room.roomName === roomName)[0].gameStarted === false ? "Подключиться" : "Игра началась") : 
            "Создать комнату"
          }}
          </v-btn>
          <v-btn @click="clear">
            Очистить
          </v-btn>
          </v-form>
          <v-btn class="ma-4" @click="this.showRoomStatus = !this.showRoomStatus">
            Список комнат
          </v-btn>
      </v-col>
    </v-row>
    <v-row v-if='this.showRoomStatus'>
      <v-col align="center" justify="end">
        <h1>Список комнат</h1>
        <v-btn @click="this.showRoomStatus = !this.showRoomStatus">
          Назад в лобби
        </v-btn>
        <v-text-field class="ma-4"
          v-model="playerName"
          :rules="rules"
          :counter="10"
          label="Имя игрока"
          required
        ></v-text-field>
        <v-table >
          <thead>
            <tr>
              <th class="text">
                Название
              </th>
              <th class="text">
                Количество игроков
              </th>
              <th class="text"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="room in roomList"
              :key="room"
            >
              <template v-if="room.gameStarted === false">
                <td align="center" justify="end">{{ room.roomName }}</td>
                <td align="center" justify="end">{{ room.playersCount }}</td>
                <td align="center" justify="end">
                  <v-btn class="ma-4" size="small" @click="joinRoom(room.roomName)" :disabled='!(playerName && (playerName.length <= 10))'>
                    {{playerName ? 'Подключиться' : 'Введите имя'}}
                  </v-btn>
                </td>
              </template>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-textarea
    v-model.trim = "lobbyChat"
    label="Чат лобби"
    variant="outlined"
    class="mx-2"
    rows="8"
    readonly
    ></v-textarea>
    <v-textarea
    v-model.trim = "msgInputData"
    append-inner-icon="mdi-comment"
    class="mx-2"
    rows="1"
    :label= '!(playerName && (playerName.length <= 10))? "Введите имя" : "Написать сообщение"'
    :disabled='!(playerName && (playerName.length <= 10))'
    @keydown.enter = "sendMessage()"
    ></v-textarea>
  </v-container>
</template>