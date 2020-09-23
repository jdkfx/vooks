<template>
  <v-app>
    <v-app-bar app color="#FF9800" dark>
      <div class="d-flex align-center">
        <h2>書籍リスト</h2>
      </div>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn flat color="#FF9800" depressed to="/">ホーム</v-btn>
        <v-btn flat color="#FF9800" depressed to="/search">検索</v-btn>
        <v-btn flat color="#FF9800" depressed to="/about">このサイトについて</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <v-content>
        <router-view />
      </v-content>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    // HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>
