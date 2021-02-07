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

          <div v-if="items !== null">
            <ul v-for="item in items" v-bind:key="item.id">
              <img v-bind:src=item.imageUrl />
              <p>タイトル：{{ item.title }}</p>
              <p>著者：{{ item.author }}</p>
              <p>{{ item.itemCaption }}</p>
              <p>ISBN：{{ item.isbn }}</p>
              <p>{{ item.addedAt }}に追加</p>

              <done-button
                v-on:done-button="clickDoneButton(item)"
                v-bind:toPropsTitle="item.title"
                v-bind:toPropsDoneFlag="propsDoneFlag"
              ></done-button>
            </ul>
          </div>

        </v-col>
      </v-row>
    </div>
  </v-container>
</template>


<script>
import firebase from 'firebase';
import DoneButton from "../components/DoneButton";
import { db } from '../plugins/firebase';
import moment from 'moment';

export default {
  name: "Home",

  components: {
    "done-button": DoneButton,
  },

  data() {
    return {
      items: [],
      propsDoneFlag: '',
    }
  },

  methods: {
    // CloudFirestoreに格納された情報を表示する
    async showLists() {
      let self = this;
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
              self.items = querySnapshot.docs.map(doc => doc.data());
            }
          }).catch(function(error) {
            console.log("Error getting document:", error);
          });          
        } else {
          alert("サインインしてください");
        }
      });
    },

    // 読了した本のリストに追加
    async clickDoneButton(item) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          let self = this;
          let colRef = db.collection("users").doc(user.uid).collection("doneLists");
          if(user) {
            console.log(user.uid);
            this.propsTitle = item.title;

            colRef.where("isbn", "==", item.isbn)
            .get().then(function(querySnapshot) {
              if(querySnapshot.empty) {
                self.propsDoneFlag = true;
                colRef.add({
                  imageUrl: item.imageUrl,
                  title: item.title,
                  author: item.author,
                  isbn: item.isbn,
                  addedAt: moment(new Date).format('YYYY/MM/DD'),
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(function(docRef) {
                  console.log("Document ID:", docRef.id, "successfully written!");
                  colRef.doc(docRef.id).update({
                    docId: docRef.id,
                  })
                })
                .catch(function(error) {
                  console.log("Error writing document: ", error);
                });
              } else {
                self.propsDoneFlag = false;
                console.log("Document can't written!");
              }
            })
            .catch(function(error) {
              console.log("Error getting documents: ", error);
            });
          }
        }
      });
    },
  },

  created: function() {
    this.showLists();
  },
};

</script>