<template>
  <v-container>
    <div>
      <v-btn block color="#00acee" large rounded v-on:click="signIn()"><h3 style="color:white">ツイッターでサインイン</h3></v-btn>
    </div>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import { db } from '../plugins/firebase';

export default {
  name: "Signin",

  components: {},

  methods: {
    async signIn() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithPopup(provider).then(result => {
        if(result.user) {
          alert(`ようこそ、${result.user.displayName}さん！`);
          db.collection("users").add({uid: result.user.uid});
        } else {
          alert("有効なアカウントではありません");
        }
      },
      err => {
        alert(err.message);
      });
    }
  },
}

</script>