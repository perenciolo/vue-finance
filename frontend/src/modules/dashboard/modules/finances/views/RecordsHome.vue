<template>
  <div>
    <h1>Invoices</h1>
    <RecordsList />
  </div>
</template>

<script>
import RecordsList from '@/modules/dashboard/modules/finances/components/RecordsList.vue'

export default {
  name: 'RecordsHome',
  components: {
    RecordsList
  }
}
</script>
