<template>
  <v-container fluid>
    <v-btn color="blue" v-on:click="addWishList()">読みたいリストに追加</v-btn>
    <v-dialog v-model="wishDialog" max-width="300">
      <v-card>
        <v-card-text v-if="toPropsWishFlag">「{{ toPropsTitle }}」が読みたい本のリストに追加されました</v-card-text>
        <v-card-text v-else>「{{ toPropsTitle }}」は既に読みたい本のリストに追加されています</v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "WishButton",

  components: {},

  props: ['toPropsTitle', 'toPropsWishFlag'],

  data() {
    return {
      wishDialog: false,
    }
  },

  methods: {
    async addWishList() {
      firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
          this.$emit('wish-button');
          return this.wishDialog = true;
        } else {
          alert("サインインしてください");
        }
      });
    },
  },
}
</script>