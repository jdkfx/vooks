<template>
  <v-container>
    <v-row justify="center" class="text-center">
      <v-col>

        <div>
          <h1>検索ページ</h1>
        </div>

        <div>
          <v-text-field v-on:change="OnSearchByKeyword(search_form['keyword'])" v-model="search_form['keyword']" placeholder="書籍を検索" />
        </div>

        <div>
          <v-text-field v-on:change="OnSearchByAuthor(search_form['author'])" v-model="search_form['author']" placeholder="著者を検索" />
        </div>

        <div v-if="items !== null">
          <ul v-for="item in items" v-bind:key="item.id">
            <img v-bind:src=item.Item.largeImageUrl />
            <p>タイトル：{{ item.Item.title }}</p>
            <p>著者：{{ item.Item.author }}</p>
            <p>{{ item.Item.itemCaption }}</p>
            <p>ISBN：{{ item.Item.isbn }}</p>
            <p>出版社：{{ item.Item.publisherName }}</p>
          </ul>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "Search",

  components: {},

  data() {
    return {
      search_form: {
        keyword: "",
        author: "",
      },
      items: "",
    }
  },

  methods: {
    OnSearchByKeyword: async function(keyword) {
      const getUrl = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&applicationId=${process.env.VUE_APP_RAKUTEN_API_APP_ID}&title=${keyword}`
      await this.$axios.get(getUrl).then(response => {
        console.log(response.data);
        this.items = response.data.Items;
      })
    },

    OnSearchByAuthor: async function(author) {
      const getUrl = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&applicationId=${process.env.VUE_APP_RAKUTEN_API_APP_ID}&author=${author}`
      await this.$axios.get(getUrl).then(response => {
        console.log(response.data);
        this.items = response.data.Items;
      })
    }
  },

  watch: {
    search_form: {
      handler: function() {
        this.OnSearchByKeyword(true);
        this.OnSearchByAuthor(true);
      },
      deep: true,
    },
  },

  mounted: function() {
    this.OnSearchByKeyword(true);
    this.OnSearchByAuthor(true);
  },
};

</script>