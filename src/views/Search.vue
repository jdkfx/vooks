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

            <wish-button v-on:wish-button="clickWishButton(item.Item)" v-bind:toPropsTitle="item.Item.title"></wish-button>

            <done-button v-on:done-button="clickDoneButton(item.Item)"></done-button>
            <v-dialog v-model="doneDialog" max-width="300">
              <v-card>
                <v-card-text>「{{ doneTitle }}」が読了リストに追加されました</v-card-text>
              </v-card>
            </v-dialog>

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
      doneDialog: false,
      doneTitle: "",
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
      let self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
          console.log(user.uid);
          self.propsTitle = item.title;
        } else {
          alert("サインインしてください");
        }
      })
    },

    // 読了した本のリストに追加
    async clickDoneButton(item) {
      this.doneTitle = item.title;
      return this.doneDialog = true;
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