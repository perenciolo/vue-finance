<template>
  <v-app-bar app fixed color="primary">
    <v-app-bar-nav-icon @click.stop="$emit('hide', !show)"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ title || 'Dashboard' }}</v-toolbar-title>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AppToolbar',
  props: {
    show: Boolean
  },
  model: {
    prop: 'show',
    event: 'hide'
  },
  computed: {
    ...mapState(['title'])
  }
}
</script>
