<template>
  <v-container fluid>
    <v-btn color="orange" v-on:click="addDoneList()">読了リストに追加</v-btn>
  </v-container>
</template>

<script lang="js">

export default {
  name: "DoneButton",

  components: {},

  data() {
    return {}
  },

  methods: {
    async addDoneList(){
      this.$emit('done-button');
    }
  },
}
</script>