<template>
  <v-container>
    <v-row justify="center" class="text-center">
      <v-col>

        <div>
          <h1>検索ページ</h1>
        </div>

        <div>
          <v-text-field v-on:change="searchByKeyword(keyword)" v-model="keyword" placeholder="書籍を検索" />
        </div>

        <div>
          <v-text-field v-on:change="searchByAuthor(author)" v-model="author" placeholder="著者を検索" />
        </div>

        <div class="mb-5">
          <v-btn color="green" v-on:click="search(keyword, author)">検索</v-btn>
        </div>

        <div v-if="items !== null">
          <ul v-for="item in items" v-bind:key="item.id">
            <img v-bind:src=item.Item.largeImageUrl />
            <p>タイトル：{{ item.Item.title }}</p>
            <p>著者：{{ item.Item.author }}</p>
            <p>{{ item.Item.itemCaption }}</p>
            <p>ISBN：{{ item.Item.isbn }}</p>
            <p>出版社：{{ item.Item.publisherName }}</p>

            <wish-button
              v-on:wish-button="clickWishButton(item.Item)"
              v-bind:toPropsTitle="item.Item.title"
              v-bind:toPropsWishFlag="propsWishFlag"
            ></wish-button>

            <done-button
              v-on:done-button="clickDoneButton(item.Item)"
              v-bind:toPropsTitle="item.Item.title"
              v-bind:toPropsDoneFlag="propsDoneFlag"
            ></done-button>

          </ul>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase';
import WishButton from "../components/WishButton";
import DoneButton from "../components/DoneButton";
import { db } from '../plugins/firebase';
import moment from 'moment';

const baseURL = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&applicationId=${process.env.VUE_APP_RAKUTEN_API_APP_ID}`;

// 検索クエリの作成
const queryBuilder = (query) =>
  Object.entries(query || {}).map(([key, value]) => `${key}=${value}`).join("&");

export default {
  name: "Search",

  components: {
    "wish-button": WishButton,
    "done-button": DoneButton,
  },

  data() {
    return {
      keyword: "",
      author: "",
      items: "",
      propsTitle: "",
      propsWishFlag: '',
      propsDoneFlag: '',
    }
  },

  methods: {
    // 検索APIへのアクセス
    callSearchAPI(query) {
      const getURL = `${baseURL}&${queryBuilder(query)}`;
      return this.$axios.get(getURL);
    },

    // キーワードを検索
    async searchByKeyword() {
      const { data } = await this.callSearchAPI({ title: this.keyword });
      this.items = data.Items;
    },

    // 著者で検索
    async searchByAuthor() {
      const { data } = await this.callSearchAPI({ author: this.author });
      this.items = data.Items;
    },

    // キーワード、著者で検索
    async search() {
      const { data } = await this.callSearchAPI({
        title: this.keyword,
        author: this.author
      });
      this.items = data.Items;
    },

    // 読みたい本のリストに追加
    async clickWishButton(item) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          let self = this;
          let colRef = db.collection("users").doc(user.uid).collection("wishLists");
          if(user) {
            console.log(user.uid);
            this.propsTitle = item.title;

            colRef.where("isbn", "==", item.isbn)
            .get().then(function(querySnapshot) {
              if(querySnapshot.empty) {
                self.propsWishFlag = true;
                colRef.add({
                  imageUrl: item.largeImageUrl,
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
                self.propsWishFlag = false;
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
                  imageUrl: item.largeImageUrl,
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

  watch: {
    handler: function () {
      this.searchByKeyword(true);
      this.searchByAuthor(true);
    },
    deep: true,
  },

  // mounted: function() {
  //   const { data } = this.callSearchAPI();
  //   this.items = data.Items;
  // },
};

</script>