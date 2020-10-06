<template>
  <v-container fluid>
    <v-btn v-on:click.stop="dialog = true" v-on:click="addWishList()">読みたいリストに追加</v-btn>

    <v-dialog v-model="dialog" max-width="300">
      <v-card>
        <v-card-text>{{ item }}が読みたい本のリストに追加されました</v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ja">

export default {
  name: "WishButton",

  components: {},

  data: () => ({
    dialog: false,
    title: ""
  }),

  props: {
    item: String,
  },

  methods: {},
}
</script>