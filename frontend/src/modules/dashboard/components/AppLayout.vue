<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer" />

    <v-container grid-list-md>
      <v-layout>
        <v-flex xs12>
          <slot />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import AppMenu from '@/modules/dashboard/components/AppMenu.vue'
import AppToolbar from '@/modules/dashboard/components/AppToolbar.vue'

export default {
  name: 'AppLayout',
  components: {
    AppMenu,
    AppToolbar
  },
  data: () => ({
    drawer: false
  })
}
</script>
