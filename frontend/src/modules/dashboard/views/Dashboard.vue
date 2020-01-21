<template>
  <AppLayout>
    <router-view></router-view>
  </AppLayout>
</template>

<script>
import { registerVuexModule } from '@/utils'
import financesStore from '@/modules/dashboard/modules/finances/store/'

import AppLayout from '@/modules/dashboard/components/AppLayout.vue'

export default {
  name: 'Dashboard',
  components: {
    AppLayout
  },
  created() {
    registerVuexModule(this.$store, 'finances', financesStore)
  }
}
</script>
