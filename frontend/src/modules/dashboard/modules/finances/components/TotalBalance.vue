<template>
  <v-card :color="color">
    <v-card-title primary-title>
      <div class="text-sm-center ma-auto">
        <div class="subheading">Saldo atual</div>
        <h1 class="display-2">{{ totalInCurrency }}</h1>
      </div>
    </v-card-title>
  </v-card>
</template>
<script>
import formatCurrencyMixin from '@/mixins/formatCurrency'
import RecordsService from '@/modules/dashboard/modules/finances/services/records-service'

export default {
  name: 'TotalBalance',
  mixins: [formatCurrencyMixin],
  data: () => ({
    total: 0
  }),
  computed: {
    color() {
      return this.total < 0 ? 'error' : 'primary'
    },
    totalInCurrency() {
      return this.formatCurrency(this.total)
    }
  },
  async created() {
    this.total = await RecordsService.totalBalance()
  }
}
</script>
