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
      roomName : '',
      roomList : ['Test'],
      currentRoom : '',
       desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
          }]
    }
  },
  methods: {
    createRoom : function(roomName) {
      // console.log(`Покинута комната с именем ${this.currentRoom}`)
      console.log(`Создана комната с именем ${roomName}`)
      console.log(`${roomName.length}`)
      this.socket.emit(`createRoom`, this.currentRoom, roomName)
      this.currentRoom = roomName
      this.roomName = ''
    },
    joinRoom : function(roomName) {
      // console.log(`Покинута комната с именем ${this.currentRoom}`)
      console.log(`Подключение комната с именем ${roomName}`)
      // console.log(`${roomName.length}`)
      // this.socket.emit(`createRoom`, this.currentRoom, roomName)
      // this.currentRoom = roomName
      // this.roomName = ''
    },
    clear : function() {
      this.roomName = ''
    }
  },
  created() {
    this.socket.on('getClientCount', (data) => {
      console.log('Test socketa', data)
      console.log(this.socket)
    })
  }
}
</script>

<template>
  <v-container >
    <v-row>
      <v-col align="center" justify="end">
        <h1>Лобби</h1>
          <v-form>
            <v-text-field
              v-model="roomName"
              :counter="10"
              label="Название комнаты"
              required
            ></v-text-field>
            <v-btn :disabled="!roomName" 
              class="mr-4"
              @click="roomList.includes(roomName) ? joinRoom(roomName) : createRoom(roomName)"
            > 
            {{roomList.includes(roomName) ? "Подключиться к комнате" : "Создать комнату"}}
            </v-btn>
            <v-btn @click="clear">
              Очистить
            </v-btn>
          </v-form>
          <v-simple-table
    fixed-header
    height="300px"
  >
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            Name
          </th>
          <th class="text-left">
            Calories
          </th>
          <th class="text-left">
             Кнопка
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in desserts"
          :key="item.name"
        >
          <td>{{ item.name }}</td>
          <td>{{ item.calories }}</td>
          <td><v-btn @click="clear" size='small'>
               Очистить 
            </v-btn></td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>