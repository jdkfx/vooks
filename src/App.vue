<template>
  <v-app>
    <header>
      <v-app-bar app color="#FF9800" dark>
        <v-app-bar-nav-icon v-on:click="drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title class="d-flex align-center">
          <h2>書籍リスト</h2>
        </v-toolbar-title>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" fixed temporary>
        <v-list nav dense>
          <v-list-item-group>
            <v-list-item v-for="(linkItem, index) in linkItems" :key="index" :href="linkItem.url">
              <v-list-item-title>{{ linkItem.name }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </header>

    <body>
      <v-main>
        <v-content>
          <router-view />
        </v-content>
      </v-main>
    </body>
  </v-app>
</template>

<script>
import links from './common/links';

export default {
  name: 'App',

  components: {},

  data: () => ({
    drawer: false,
    linkItems: links.linkItems,
  }),
};
</script>
