<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer" />
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
