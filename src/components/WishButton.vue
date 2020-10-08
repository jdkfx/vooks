<template>
  <v-container fluid>
    <v-btn v-on:click="addWishList()">読みたいリストに追加</v-btn>
  </v-container>
</template>

<script lang="js">

export default {
  name: "WishButton",

  components: {},

  data() {},

  methods: {
    async addWishList(){
      this.$emit('wish-button');
    }
  },
}
</script>