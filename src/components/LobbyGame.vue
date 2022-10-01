<script>
// import { required, maxLength } from '@vuelidate/validators'

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
      currentRoom : '',
      showRoomStatus : false,
    }
  },
  methods: {
    createRoom : function(roomName) {
      // console.log(`Покинута комната с именем ${this.currentRoom}`)
      console.log(`Создана комната с именем ${roomName}`)
      console.log(`${roomName.length}`)
      this.socket.emit(`createRoom`, {currentRoom : this.currentRoom,
                                      room : roomName,
                                      playerName : this.playerName,
                                      }) //this.currentRoom, roomName)
      this.currentRoom = roomName
      this.roomName = ''
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
    sendMessage : function(message) {
      console.log('test chat', message)
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
      console.log('rooms', rooms)
      this.roomList = rooms
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
          :counter="10"
          label="Имя игрока"
          required
        ></v-text-field>
        <v-form>
          <v-text-field
            v-model="roomName"
            :counter="10"
            label="Название комнаты"
            required
          ></v-text-field>
          <v-btn :disabled="!(roomName && playerName)" 
            class="mr-4"
            @click="roomList.includes(roomList.find(room => room.roomName === roomName)) ? joinRoom(roomName) : createRoom(roomName)"
          > 
          {{ roomList.includes(roomList.find(room => room.roomName === roomName)) ? "Подключиться" : "Создать комнату"}}
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
              <td align="center" justify="end">{{ room.roomName }}</td>
              <td align="center" justify="end">{{ room.playersCount }}</td>
              <td align="center" justify="end">
                <v-btn class="ma-4" size="small" @click="joinRoom(room.roomName)" :disabled='!this.playerName'>
                  {{playerName ? 'Подключиться' : 'Введите имя'}}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>