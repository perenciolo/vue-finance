<template>
  <AppLayout>
    <router-view></router-view>
  </AppLayout>
</template>

<script>
import AppLayout from '@/modules/dashboard/components/AppLayout.vue'
export default {
  name: 'Dashboard',
  components: {
    AppLayout
  }
}
</script>
