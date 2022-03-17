<template>
  <v-container class="text-center">
    <div class="mb-10">
      <h2>読了した本のリスト</h2>
    </div>

    <div>
      <v-row v-if="doneItems !== null" justify="center">
        <ul v-for="doneItem of doneItems" v-bind:key="doneItem.id" style="padding: 0;">
          <v-col>
            <li style="list-style: none;">
              <img style="width: 100%;" v-bind:src=doneItem.imageUrl />
              <p>{{ doneItem.addedAt }}に追加</p>

              <delete-button
                v-on:delete-button="clickDeleteButton(doneItem)"
                v-bind:toPropsTitle="doneItem.title"
                v-bind:toPropsDoneFlag="propsDoneFlag"
              ></delete-button>
            
            </li>
          </v-col>
        </ul>
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
    // CloudFirestoreに格納されたdoneListsの情報を表示する
    async showDoneLists() {
      let self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let doneColRef = db.collection("users").doc(user.uid).collection("doneLists").orderBy("timestamp", "desc");
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