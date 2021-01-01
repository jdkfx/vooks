<template>
  <v-container fluid>
    <v-btn color="blue" v-on:click="addWishList()">読みたいリストに追加</v-btn>
    <v-dialog v-model="wishDialog" max-width="300">
      <v-card>
        <v-card-text>「{{ wishTitle }}」読みたい本のリストに追加されました</v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="js">

export default {
  name: "WishButton",

  components: {},

  props: ['toPropsTitle'],

  data() {
    return {
      wishDialog: false,
      wishTitle: "",
    }
  },

  methods: {
    async addWishList() {
      this.$emit('wish-button');
      this.wishTitle = this.toPropsTitle;
      return this.wishDialog = true;
    },
  },
}
</script>