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
          var userUid = db.collection("users").doc(`${result.user.uid}`);
          userUid.get().then(function(doc) {
            if(doc.exists) {
              console.log("Document data:", doc.data());
            } else {
              db.collection("users").doc(`${result.user.uid}`).set({
                uid: result.user.uid,
                name: result.user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
              })
              .then(function() {
                console.log("Document successfully written!");
              })
              .catch(function(error) {
                console.log("Error writing document: ", error);
              });
            }
          }).catch(function(error) {
            console.log("Error getting document: ", error);
          });
          alert(`ようこそ、${result.user.displayName}さん！`);
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