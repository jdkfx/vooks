<template>
  <v-container class="text-center">
    <div class="mb-5">
      <h1>ホーム</h1>
    </div>

    <div class="mb-10">
      <h2>読みたい本のリスト</h2>
    </div>
    
    <div class="mb-10">
      <v-row justify="center">
        <ul v-for="wishItem of wishItems" v-bind:key="wishItem.id" style="padding: 0;">
          <v-col>
            <li style="list-style: none;">
              <img style="width: 100%;" v-bind:src=wishItem.imageUrl />
              <p>{{ wishItem.addedAt }}に追加</p>
            </li>
          </v-col>    
        </ul>
      </v-row>
    </div>

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
import moment from 'moment';

export default {
  name: "Home",

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
          let wishColRef = db.collection("users").doc(user.uid).collection("wishLists").orderBy("timestamp", "desc");
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
    this.showDoneLists();
  },

  computed: {
    // limitWishItemsCount() {
    //   return this.wishItems.slice(0,3);
    // },
    // limitDoneItemsCount() {
    //   return this.doneItems.slice(0,3);
    // }
  }
};

</script>