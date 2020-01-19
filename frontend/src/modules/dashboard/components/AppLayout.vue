<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer" />

    <v-container grid-list-md>
      <v-layout>
        <v-flex sm12>
          <slot />
        </v-flex>
      </v-layout>
    </v-container>
    <AppFloatingBtn />
  </div>
</template>

<script>
import AppFloatingBtn from '@/modules/dashboard/components/AppFloatingBtn.vue'
import AppMenu from '@/modules/dashboard/components/AppMenu.vue'
import AppToolbar from '@/modules/dashboard/components/AppToolbar.vue'

export default {
  name: 'AppLayout',
  components: {
    AppFloatingBtn,
    AppMenu,
    AppToolbar
  },
  data: () => ({
    drawer: false
  })
}
</script>
