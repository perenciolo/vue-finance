<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ToolbarByMonth
        format="MM-YYYY"
        color="primary"
        :month="month || $route.query.month"
        @month="changeMonth"
      />
    </v-flex>
    <v-flex v-for="(chart, index) in charts" :key="index" xs12 sm12 md6 lg6 xl6>
      <v-card>
        <v-card-text>
          <h2 class="font-weight-light mb-4">{{ chart.title }}</h2>
          <canvas :ref="chart.refId"></canvas>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions as mapRootActions, createNamespacedHelpers } from 'vuex'
import Chart from 'chart.js'
import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { generateChartConfig } from '@/utils'
import RecordsService from '@/modules/dashboard/modules/finances/services/records-service'

import ToolbarByMonth from '@/modules/dashboard/modules/finances/components/ToolbarByMonth.vue'

const { mapState, mapActions } = createNamespacedHelpers('finances')

export default {
  name: 'ReportsHome',
  components: {
    ToolbarByMonth
  },
  data: () => ({
    chartIncomesExpenses: null,
    chartCategoryExpenses: null,
    charts: [
      { title: 'Incomes X Expenses', refId: 'chartIncomesExpenses' },
      { title: 'Expenses by Category', refId: 'chartCategoryExpenses' }
    ],
    monthSubject$: new Subject(),
    records: [],
    subscriptions: []
  }),
  computed: {
    ...mapState(['month'])
  },
  created() {
    this.setTitle({ title: 'Relatórios' })
    this.setRecords()
  },
  destroyed() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  },
  methods: {
    ...mapRootActions(['setTitle']),
    ...mapActions(['setMonth']),
    changeMonth(month) {
      this.$router
        .push({
          path: this.$route.path,
          query: { month }
        })
        .catch(e => {})
      this.setMonth({ month })
      this.monthSubject$.next(month)
    },
    updateOrCreateChart(chartId, options) {
      if (this[chartId]) {
        this[chartId].data.datasets = options.data.datasets

        if (options && options.data && options.data.labels) {
          this[chartId].data.labels = options.data.labels
        }

        this[chartId].update()

        return this[chartId]
      }

      const ref = Array.isArray(this.$refs[chartId])
        ? this.$refs[chartId][0]
        : this.$refs[chartId]

      const ctx = ref.getContext('2d')
      this[chartId] = new Chart(ctx, options)

      return this[chartId]
    },
    setCharts() {
      this.updateOrCreateChart(
        'chartIncomesExpenses',
        generateChartConfig({
          type: 'bar',
          items: this.records,
          keyToGroup: 'type',
          keyOfValue: 'amount',
          aliases: { CREDIT: 'Incomes', DEBIT: 'Expenses' },
          backgroundColors: [
            this.$vuetify.theme.themes.dark.primary,
            this.$vuetify.theme.themes.dark.error
          ]
        })
      )

      // chartCategoryExpenses
      this.updateOrCreateChart(
        'chartCategoryExpenses',
        generateChartConfig({
          type: 'doughnut',
          items: this.records.filter(record => record.type === 'DEBIT'),
          keyToGroup: 'category.description',
          keyOfValue: 'amount'
        })
      )
    },
    setRecords() {
      this.subscriptions.push(
        this.monthSubject$
          .pipe(mergeMap(month => RecordsService.records({ month })))
          .subscribe(records => {
            this.records = records
            this.setCharts()
          })
      )
    }
  }
}
</script>
