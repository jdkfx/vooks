<template>
  <v-container fluid>
    <v-btn color="orange" v-on:click="addDoneList()">読了リストに追加</v-btn>
    <v-dialog v-model="doneDialog" max-width="300">
      <v-card>
        <v-card-text v-if="toPropsDoneFlag">「{{ toPropsTitle }}」が読了リストに追加されました</v-card-text>
        <v-card-text v-else>「{{ toPropsTitle }}」は既に読了リストに追加されています</v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "DoneButton",

  components: {},

  props: ['toPropsTitle', 'toPropsDoneFlag'],

  data() {
    return {
      doneDialog: false,
    }
  },

  methods: {
    async addDoneList(){
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$emit('done-button');
          return this.doneDialog = true;
        } else {
          alert("サインインしてください");
        }
      });
    }
  },
}
</script>