<script>
import './ABGame.module.css'
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
      escaping: false,
      escapingTimer: false,
      youEscaped: false,
      choiceDone : false,
      roundNumber : 0,
      roundCounter : 5,
      playerCount : 3,
      window : 0,
      resultShowed: false,
      // timerText: "До конца раунда:"
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
      if(this.escapingTimer === true){
        this.roundCounter = 4
        this.escapingTimer = false
      }
      if (this.roundCounter > 0) {
        setTimeout(() => {
          this.roundCounter --
          this.roundCounterDown()
        }, 1000)
      }
      else {
        if(this.escaping === true){
          if(this.host === true){
            this.socket.emit('triggerEndGame', {roomName: this.roomData.roomName})
          }
          return
        }
        this.roundCounter = 5
        if (this.host === true){
          console.log('Конец раунда')
          this.socket.emit('endRound', { roomName : this.roomData.roomName,
                                         roundNumber: this.roundNumber,
                                         escaping: false,
                                       })
        }
      }
    },
    makeChoice : function(buttonID) {
      console.log(`Нажата кнопка ${buttonID}`)
      this.choiceDone = true
      this.socket.emit('getChoice', { roomName: this.roomData.roomName, 
                                      enemySocketID: this.enemyName,
                                      roundNumber: this.roundNumber,
                                      buttonID: buttonID 
                                    })
    },
    escape : function() {
      if(this.escaping === false){
        console.log("Ты начал побег")
            this.socket.emit('endRound', { roomName : this.roomData.roomName,
                                       roundNumber: this.roundNumber,
                                       escaping: true
                                     })
      }
      else{
        console.log("Ты присоединился к побегу")
      }
      this.youEscaped = true
      this.socket.emit('escapingTeamFormation', {roomName : this.roomData.roomName})

    },
    getPlayerCount : function(playerSocketID) {
      console.log('Получение очков игрока')
      if (this.roundNumber > 0){
        return this.roomData.rounds[this.roundNumber].playersData.find((player) => player.playerSocketID === playerSocketID).playerCount
      }
      return 3
    },
    getPlayerChoiceResult : function(playerChoice, enemyChoice) {
      switch (playerChoice + enemyChoice){
        case 'AA': return "+2"
        case 'AB': return "-3"
        case 'BA': return "+3"
        case 'BB': return "0" 
      }
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
    this.socket.on('startNewRound', () => {
      console.log('Начало нового раунда')
      this.roundNumber++
      this.choiceDone = false
      this.roundCounterDown()
    }),
    this.socket.on('escapingTime', () => {
      console.log('Начался побег')
      this.escaping = true
      this.escapingTimer = true
    }),
    this.socket.on('showResult', () => {
      console.log('Игра завершена\nРезультаты отображены')
      this.resultShowed = true
    }),
    this.socket.on('getGameData', (data) => {
      console.log('terst',data)
    })
  },
  created() {
    this.socket.on('roomData', (data) => {
      console.log('Данные комнаты получены\n',data)
      this.roomData = data;
      if (this.gameStarted === true){
        var playerData = this.roomData.rounds[this.roundNumber].playersData.find((player) => player.playerSocketID === this.socket.id)
        this.enemyName = playerData.enemySocketID
        this.playerCount = playerData.playerCount
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
        <v-btn min-width=170 class="mt-4" @Click="this.showPlayersList=!this.showPlayersList">
        Список игроков
        </v-btn>
        <br>
          <v-table >
            <thead>
              <tr>
                <th class="text">
                  Имя
                </th>
                <th class="text">
                  Очки
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
              v-for="player in roomData.playersInfo"
              :key="player.socketID"
              >
                <td class="text" v-if="player.socketID === socket.id" align="center" justify="end"><b>{{ player.playerName }}</b></td>
                <td class="text" v-else align="center" justify="end">{{ player.playerName }}</td>
                <td class="text" align="center" justify="end">{{ getPlayerCount(player.socketID) }}</td>
              </tr>
            </tbody>
          </v-table>

<!--           <v-card class="mt-4" min-width=170 max-width="200">
            <v-list density="compact">
              <v-list-subheader>
                <v-btn @Click="this.showPlayersList=!this.showPlayersList" size='x-small' elevation="0">
                Список игроков
                </v-btn>
              </v-list-subheader>
              v-if='showPlayersList'
              <v-list-item
                v-for="player in roomData.playersInfo"
                :key="player.socketID"
                active-color="primary"
              >
                <v-list-item-title v-if="player.playerName" v-text="player.playerName"></v-list-item-title>
              </v-list-item>
            </v-list>
        </v-card> -->
      </v-col>
      <v-col cols="10" align="center">
        <v-btn v-if='!this.gameStarted' align="right" min-width=170 :disabled="this.roomData.playersCount === 1" @click='startGame'>
          {{startButtonText}}
        </v-btn>
        <v-container fluid='true' v-if='this.gameStarted'>
          <h2 class="mt-2">Раунд: {{roundNumber+1}}</h2>
          <h2 class="mt-2">До конца {{escaping ? "побега" : "раунда"}} {{roundCounter}}</h2>
          <h2>Противник: {{enemyName}}</h2>
          <h3>Сделай свой выбор</h3>
          <v-btn class="mt-2" min-width=170 @Click="makeChoice('A')" :disabled="this.choiceDone || this.escaping">Союз</v-btn>
          <br>
          <v-btn class="mt-2" min-width=170 @Click="makeChoice('B')" :disabled="this.choiceDone || this.escaping">Предательство</v-btn>
          <br>
          <v-btn class="mt-2" min-width=170 @Click="escape()" :disabled="!(this.playerCount >= 9) || this.youEscaped === true">{{this.escaping === false ?"Начать побег":"Присоединиться к побегу"}}</v-btn>
        </v-container>
      </v-col>
        <!-- <v-col align="center"></v-col> -->
    </v-row>

<!--     
    <v-table v-if="roundNumber > 0">
      <thead>
        <tr>
          <th colspan=2 class="text" v-for="teamNumber in ['I', 'II', 'III', 'IV', 'V']" :key='teamNumber'>
            {{teamNumber}}
          </th>
        </tr>
        <tr>
          <th class="text"  v-for="player in roomData.rounds[this.roundNumber].playersData" :key='player'>
            <template v-if="player.playerSocketID === socket.id">
              <b>{{player.playerSocketID}}</b>
            </template>
            <template v-else>
              {{player.playerSocketID}}
            </template>
          </th>
        </tr>
      </thead>
      <tbody>      
        <tr>
          <td v-for="player in roomData.rounds[this.roundNumber].playersData" :key='player'>
            {{player.playerChoice}}
          </td>
        </tr>
        <tr>
          <td v-for="player in roomData.rounds[this.roundNumber].playersData" :key='player'>
            {{player.enemyChoice}}
          </td>
        </tr>
        <tr>
          <td v-for="player in roomData.rounds[this.roundNumber].playersData" :key='player'>
            {{getPlayerChoiceResult(player.playerChoice, player.enemyChoice)}}
          </td>
        </tr>
        <tr>
          <td v-for="player in roomData.rounds[this.roundNumber].playersData" :key='player'>
            {{player.playerCount}}
          </td>
        </tr>
      </tbody>
    </v-table> -->


  <v-window
    v-model="window"
    show-arrows="hover"
    v-if="roundNumber > 0"
  >
    <v-window-item
      v-for="n in roomData.rounds.length-1"
      :key="n"
    >
    <!-- class="d-flex justify-center align-center" -->
      <v-card align="center" justify="end">
        Раунд {{n}}
    <v-table>
      <thead>
        <tr>
          <th colspan=2 class="text" v-for="teamNumber in ['I', 'II', 'III', 'IV', 'V'].slice(0, roomData.playersInfo.length / 2 >> 0)" :key='teamNumber'>
            {{teamNumber}}
          </th>
        </tr>
        <tr>
          <th class="text"  v-for="player in roomData.rounds[n].playersData" :key='player'>
            <template v-if="player.playerSocketID === socket.id">
              <b>{{player.playerSocketID}}</b>
            </template>
            <template v-else>
              {{player.playerSocketID}}
            </template>
          </th>
        </tr>
      </thead>
      <tbody>      
        <tr>
          <td align="center" justify="end" v-for="player in roomData.rounds[n-1].playersData" :key='player'>
            {{player.playerChoice}}
          </td>
        </tr>
        <tr>
          <td align="center" justify="end" v-for="player in roomData.rounds[n-1].playersData" :key='player'>
            {{player.enemyChoice}}
          </td>
        </tr>
        <tr>
          <td align="center" justify="end" v-for="player in roomData.rounds[n-1].playersData" :key='player'>
            {{getPlayerChoiceResult(player.playerChoice, player.enemyChoice)}}
          </td>
        </tr>
        <tr>
          <td align="center" justify="end" v-for="player in roomData.rounds[n-1].playersData" :key='player'>
            {{player.playerCount}}
          </td>
        </tr>
      </tbody>
          </v-table>
      </v-card>
    </v-window-item>
  </v-window>

<template>
  <v-row>
    <v-dialog
      v-model="resultShowed"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5">
          Результат игры
        </v-card-title>
        <v-card-text>
          Список сбежавших игроков:
          <template v-for="player in roomData.playersInfo" :key='player.socketID'>
            <p v-if="player.escaped === true">{{`${player.playerName}` }}</p>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn min-width=170 @click="leaveRoom">Выйти из комнаты</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

  </v-container>
</template>