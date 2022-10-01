<script>
export default {
  props: {
    socket : Object,
  },
  data() {
    return {
      startButtonText : "Начать игру",
      countBeforeStart : 1,
      host : false,
      roomData : {},
      enemyName : "???",
      showPlayersList : false,
      gameStarted : false,
      roundNumber : 0,
      roundCounter : 5,
    }
  },
  methods : {
    leaveRoom : function() {
      console.log(`${this.roomData.roomName} комната покинута`)
      this.socket.emit('leaveRoom', this.roomData)
    },
    startGame : function() {
      console.log('Триггер старта')
      this.socket.emit('triggerStart', {roomName: this.roomData.roomName})
      // this.triggerStartGame()
    },
    triggerStartGame : function() {
      this.startButtonText = `Начало через ${this.countBeforeStart}...`
      if (this.countBeforeStart > 0){
        setTimeout(() => {
          this.countBeforeStart --
          this.triggerStartGame()
          console.log('Статус клиента',this.host)
        }, 1000)
      }
      else if (this.host === true) {
        this.socket.emit('startGame', { roomName: this.roomData.roomName})
      }
    },
    roundCounterDown : function() {
      if (this.roundCounter > 0) {
        setTimeout(() => {
          this.roundCounter --
          this.roundCounterDown()
        }, 1000)
      }
      else {
        this.roundCounter = 30
        if (this.host === true){
          console.log('Конец раунда')
          this.socket.emit('endRound', { roomName : this.roomData.roomName,
                                         roundNumber: this.roundNumber
                                       })
        }
      }
    },
    makeChoice : function(buttonID) {
      console.log(`Нажата кнопка ${buttonID}`)
      this.socket.emit('getChoice', { roomName: this.roomData.roomName, 
                                      enemySocketID: this.enemyName,
                                      roundNumber: this.roundNumber,
                                      buttonID: buttonID 
                                    })
    },
    sendMessage : function(inputMessage) {
      console.log(`Отправлено сообщение ${inputMessage}`)
      this.socket.emit(`gameChat`, this.currentRoom, inputMessage)
      this.$refs['inputChatMessage'].value = ''
    },
  },
  // watch: {
  //   roundTimer : function(){
  //     if (this.gameStarted === true){
  //       console.log('Start start')
  //       this.roundCounter--
  //     }
  //   },
  // },
  mounted() {
    this.socket.on('getChatMessage', (chatMessage) => {
      this.chatMessages.push(chatMessage)
    }),
    this.socket.on('gameStatus', (status) => {
      this.gameStarted = status
      this.roundCounterDown()
      console.log('Игра началась!')
    }),
    this.socket.on('triggerStartGame', () => {
      this.triggerStartGame()
    }),
    this.socket.on('hostStatus', (hostStatus) => {
      this.host = hostStatus
    }),
    this.socket.on('getGameData', (data) => {
      console.log('terst',data)
    })
  },
  created() {
    this.socket.on('roomData', (data) => {
      console.log('Room data got',data)
      this.roomData = data;
      if (this.gameStarted === true){
        var playerData = this.roomData.rounds[this.roundNumber].playersData.find((player) => player.playerSocketID === this.socket.id)
        this.enemyName = playerData.enemySocketID
      }
      // var itemobj = obje.rounds[0].playersData.find((item) => item.playerSocketID === socket.id)
    })
  },
}
</script>

<template>
  <v-container>
    <h1 align="center">Комната: {{roomData.roomName}}</h1>
    <v-row >
      <v-col align="left" cols="2">
        <v-btn min-width=170 @click="leaveRoom" :disabled="this.gameStarted">Выйти из комнаты</v-btn>
          <v-card class="mt-4" min-width=170 max-width="200">
            <v-list density="compact">
              <v-list-subheader>
                <v-btn @Click="this.showPlayersList=!this.showPlayersList" size='x-small' elevation="0">
                Список игроков
                </v-btn>
              </v-list-subheader>
              <!-- v-if='showPlayersList' -->
              <v-list-item
                v-for="player in roomData.playersInfo"
                :key="player.socketID"
                active-color="primary"
              >
                <v-list-item-title v-if="player.playerName" v-text="player.playerName"></v-list-item-title>
              </v-list-item>
            </v-list>
        </v-card>
      </v-col>
      <v-col cols="10" align="center">
        <v-btn v-if='!this.gameStarted' align="right" min-width=170 :disabled="this.roomData.playersCount === 1" @click='startGame'>
          {{startButtonText}}
        </v-btn>
        <v-container fluid='true' v-if='this.gameStarted'>
          <h2 class="mt-2">Раунд: {{roundNumber+1}}</h2>
          <h2 class="mt-2">До конца раунда: {{roundCounter}}</h2>
          <h2>Противник: {{enemyName}}</h2>
          <h3>Сделай свой выбор</h3>
          <v-btn class="mt-2" min-width=170 @Click="makeChoice('A')">Союз</v-btn>
          <br>
          <v-btn class="mt-2" min-width=170 @Click="makeChoice('B')">Предательство</v-btn>
        </v-container>
      </v-col>
        <!-- <v-col align="center"></v-col> -->
    </v-row>
  </v-container>
</template>