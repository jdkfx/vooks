<template>
  <v-container>
    <div>
      <v-btn block color="#00acee" large rounded v-on:click="signOut()"><h3 style="color:white">サインアウト</h3></v-btn>
    </div>
  </v-container>
</template>

<script>
import firebase from 'firebase'

export default {
  name: "Signout",

  components: {},

  methods: {
    async signOut() {
      firebase.auth().signOut()
      .then(function() {
        alert("サインアウトしました");
      })
      .catch(function(error) {
        console.log("Error can not SignOut: ", error);
      });
    }
  }
}
</script>