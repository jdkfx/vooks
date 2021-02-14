<template>
  <v-container>
    <div>
      <v-row justify="center" class="text-center">
        <v-col>
          
          <div>
            <h1>ホーム</h1>
          </div>

          <div>
            <h2>読了した本のリスト</h2>
          </div>

          <div v-if="doneItems !== null">
            <ul v-for="doneItem of doneItems" v-bind:key="doneItem.id">
              <li style="list-style: none;">
                <img v-bind:src=doneItem.imageUrl />
                <p>タイトル：{{ doneItem.title }}</p>
                <p>著者：{{ doneItem.author }}</p>
                <p>{{ doneItem.itemCaption }}</p>
                <p>ISBN：{{ doneItem.isbn }}</p>
                <p>{{ doneItem.addedAt }}に追加</p>

                <delete-button
                  v-on:delete-button="clickDeleteButton(doneItem)"
                  v-bind:toPropsTitle="doneItem.title"
                  v-bind:toPropsDoneFlag="propsDoneFlag"
                ></delete-button>
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
import { db } from '../plugins/firebase';
import DeleteButton from "../components/DeleteButton";

export default {
  name: "Home",

  components: {
    "delete-button": DeleteButton
  },

  data() {
    return {
      wishItems: [],
      doneItems: [],
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

    // CloudFirestoreに格納されたdoneListsの情報を表示する
    async showDoneLists() {
      let self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let doneColRef = db.collection("users").doc(user.uid).collection("doneLists");
          doneColRef.get().then(function(querySnapshot) {
            if(querySnapshot.empty){
              console.log("Document data not exist!");
            } else {
              console.log("Document data:", querySnapshot.docs.map(doc => doc.data()));
              querySnapshot.forEach(function(doc) {
                self.doneItems.push(doc.data());
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

    // リストから削除
    async clickDeleteButton(item) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          let doneColRef = db.collection("users").doc(user.uid).collection("doneLists");
          if(user) {
            console.log(user.uid);
            this.propsTitle = item.title;

            doneColRef.where("isbn", "==", item.isbn)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                
                doneColRef.doc(doc.id)
                .delete()
                .then(function () {
                  console.log("Document successfully deleted!");
                })
                .then(function () {
                  window.location.reload();
                });
              });
            })
            .catch(function(error) {
              console.log("Error removing document: ", error);
            });
          }
        }
      });
    },
  },

  created: function() {
    this.showDoneLists();
  },
};

</script>