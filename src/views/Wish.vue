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

          <div v-if="wishItems !== null">
            <ul v-for="wishItem in wishItems" v-bind:key="wishItem.id">
              <li style="list-style: none;">
                <img v-bind:src=wishItem.imageUrl />
                <p>タイトル：{{ wishItem.title }}</p>
                <p>著者：{{ wishItem.author }}</p>
                <p>{{ wishItem.itemCaption }}</p>
                <p>ISBN：{{ wishItem.isbn }}</p>
                <p>{{ wishItem.addedAt }}に追加</p>

                <done-button
                  v-on:done-button="clickDoneButton(wishItem)"
                  v-bind:toPropsTitle="wishItem.title"
                  v-bind:toPropsDoneFlag="propsDoneFlag"
                ></done-button>
              </li>
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
      wishItems: [],
      propsDoneFlag: '',
    }
  },

  methods: {
    // CloudFirestoreに格納されたwishListsの情報を表示する
    async showWishLists() {
      let self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let wishColRef = db.collection("users").doc(user.uid).collection("wishLists");
          wishColRef.get().then(function(querySnapshot) {
            if(querySnapshot.empty){
              console.log("Document data not exist!");
            } else {
              console.log("Document data:", querySnapshot.docs.map(doc => doc.data()));
              querySnapshot.forEach(function(doc) {
                if(doc.data().doneFlag != true){
                  self.wishItems.push(doc.data());
                }
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

    // 読了した本のリストに追加
    async clickDoneButton(item) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          let self = this;
          let doneColRef = db.collection("users").doc(user.uid).collection("doneLists");
          let wishColRef = db.collection("users").doc(user.uid).collection("wishLists");
          if(user) {
            console.log(user.uid);
            this.propsTitle = item.title;

            doneColRef.where("isbn", "==", item.isbn)
            .get().then(function(querySnapshot) {
              if(querySnapshot.empty) {
                self.propsDoneFlag = true;
                doneColRef.add({
                  imageUrl: item.imageUrl,
                  title: item.title,
                  author: item.author,
                  isbn: item.isbn,
                  addedAt: moment(new Date).format('YYYY/MM/DD'),
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(function(docRef) {
                  console.log("Document ID:", docRef.id, "successfully written!");
                  doneColRef.doc(docRef.id).update({
                    docId: docRef.id,
                  });
                  
                  // ホーム画面に表示された本が読了リストに追加されると読みたいリストの同じ本にdoneFlagが追加される
                  wishColRef.where("isbn", "==", item.isbn)
                  .get()
                  .then(snapshot => {
                    snapshot.forEach(doc => {
                      
                      wishColRef.doc(doc.id)
                      .update({
                        doneFlag: true,
                      });
                      console.log("The wishlist(ID:", doc.id, ") update is completed");
                      window.location.reload();

                    });
                  });

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
    this.showWishLists();
  }
};

</script>