<template>
  <v-container fluid>
    <v-btn color="red" v-on:click="deleteFromList()">リストから削除</v-btn>
    <v-dialog v-model="doneDialog" max-width="300">
      <v-card>
        <v-card-text>「{{ toPropsTitle }}」がリストから削除されました</v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "DeleteButton",

  components: {},

  props: ['toPropsTitle'],

  data() {
    return {
      doneDialog: false,
    }
  },

  methods: {
    async deleteFromList(){
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$emit('delete-button');
          return this.doneDialog = true;
        } else {
          alert("サインインしてください");
        }
      });
    }
  },
}
</script>