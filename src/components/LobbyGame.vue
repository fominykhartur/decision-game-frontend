<script>
export default {
  props: {
    socket : Object,
  },
  data() {
    return {
      body : 'LobbyGamef'
    }
  },
  created() {
    this.socket.on('getClientCount', (data) => {
      console.log('Test socketa', data)
    })
  }
}
</script>

<template>
  <h1>{{body}}</h1>
</template>