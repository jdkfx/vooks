<template>
  <v-container>
    <div>
      <v-row justify="center" class="text-center">
        <v-col>
          
          <div>
            <h1>ホーム</h1>
          </div>

          <div>
            <h2>読みたい本のリスト</h2>
          </div>

          <!-- <div v-if="items !== null">
            <ul v-for="item in items" v-bind:key="item.id">
              <img v-bind:src=item.Item.largeImageUrl />
              <p>タイトル：{{ item.Item.title }}</p>
              <p>著者：{{ item.Item.author }}</p>
              <p>{{ item.Item.itemCaption }}</p>
              <p>ISBN：{{ item.Item.isbn }}</p>
              <p>出版社：{{ item.Item.publisherName }}</p>
            </ul>
          </div> -->

        </v-col>
      </v-row>
    </div>
  </v-container>
</template>


<script>
import firebase from 'firebase';
// import DoneButton from "../components/DoneButton";
import { db } from '../plugins/firebase';

export default {
  name: "Home",

  components: {
    // "done-button": DoneButton,
  },

  data() {
    return {
      // なんらかのデータを返す
    }
  },

  methods: {
    // CloudFirestoreに格納された情報を表示する
    async showLists() {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let colRef = db.collection("users").doc(user.uid).collection("wishLists");
          colRef.get().then(function(querySnapshot) {
            if(querySnapshot.empty){
              console.log("Document data not exist!");
            } else {
              querySnapshot.forEach(function(doc) {
                console.log("Document data:", doc.id, " => ", doc.data());
              });
            }
          }).catch(function(error) {
            console.log("Error getting document:", error);
          });          
        } else {
          alert("サインインしてください");
        }
      });
    },
  },

  created: function() {
    this.showLists();
  },
};

</script>