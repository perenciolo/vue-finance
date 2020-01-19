<template>
  <RecordsList />
</template>

<script>
import { mapActions } from 'vuex'

import RecordsList from '@/modules/dashboard/modules/finances/components/RecordsList.vue'

export default {
  name: 'RecordsHome',
  components: {
    RecordsList
  },
  created() {
    this.setTitle({ title: 'Invoices' })
  },
  methods: {
    ...mapActions(['setTitle'])
  }
}
</script>
