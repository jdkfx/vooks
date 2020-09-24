<template>
  <v-container>
    <v-row justify="center" class="text-center">
      <v-col>

        <div>
          <h1>検索ページ</h1>
        </div>

        <div>
          <v-text-field v-model="search_form['keyword']" placeholder="書籍を検索" />
        </div>

        <div>
          <v-btn v-on:click="OnSearch(search_form['keyword'])">検索</v-btn>
        </div>

        <div>
          <p>{{ items }}</p>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "Search",

  components: {},

  data: () => ({
    search_form: {
      keyword: "",
    },
    items: "",
  }),

  methods: {
    OnSearch: async function(keyword) {
      const getUrl = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&applicationId=${process.env.VUE_APP_RAKUTEN_API_APP_ID}&title=${keyword}`
      this.$axios.get(getUrl).then(response => {
        console.log(response.data);
        this.items = response.data;
      })
    }
  }
};

</script>