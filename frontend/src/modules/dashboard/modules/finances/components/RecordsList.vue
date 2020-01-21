<template>
  <div>
    <TotalBalance class="mb-2" />
    <ToolbarByMonth
      format="MM-YYYY"
      :color="toolbarColor"
      @month="changeMonth"
      :month="$route.query.month"
      showSlot
    >
      <records-filter @filter="filter" />
    </ToolbarByMonth>
    <v-card class="pt-2">
      <v-card-text class="text-sm-center" v-if="mappedRecordsLength === 0">
        <v-icon size="100" color="grey">mdi-clipboard-text</v-icon>
        <p class="font-weight-light subheading grey--text">
          Você ainda não cadastrou contas.
        </p>
      </v-card-text>
      <v-list v-else two-line subheader>
        <template v-for="(_records, date, index) in mappedRecords">
          <v-subheader :key="date">{{ date }}</v-subheader>
          <RecordsListItem
            v-for="record in _records"
            :key="record.id"
            :record="record"
          />
          <v-divider
            v-if="showDivider(index, mappedRecords)"
            :key="`${date}-${index}`"
          ></v-divider>
        </template>
      </v-list>

      <v-footer class="pa-2">
        <v-flex text-sm-right>
          <h3 class="font-weight-light">
            <span>Saldo do mês: </span>
            <strong class="ml-5" :class="amountColor(totalAmount)">
              {{ formatCurrency(totalAmount) }}
            </strong>
          </h3>
        </v-flex>
      </v-footer>
    </v-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import moment from 'moment'
import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { groupBy } from '@/utils'
import RecordsService from '@/modules/dashboard/modules/finances/services/records-service'

import RecordsFilter from '@/modules/dashboard/modules/finances/components/RecordsFilter.vue'
import RecordsListItem from '@/modules/dashboard/modules/finances/components/RecordsListItem.vue'
import ToolbarByMonth from '@/modules/dashboard/modules/finances/components/ToolbarByMonth.vue'
import TotalBalance from '@/modules/dashboard/modules/finances/components/TotalBalance.vue'

import formatCurrencyMixin from '@/mixins/formatCurrency'
import amountColorMixin from '@/modules/dashboard/modules/finances/mixins/amountColor'

const { mapState, mapActions } = createNamespacedHelpers('finances')

export default {
  name: 'RecordsList',
  components: {
    RecordsFilter,
    RecordsListItem,
    ToolbarByMonth,
    TotalBalance
  },
  mixins: [amountColorMixin, formatCurrencyMixin],
  data: () => ({
    records: [],
    filtersSubject$: new Subject(),
    subscriptions: []
  }),
  computed: {
    ...mapState(['filters', 'month']),
    mappedRecords() {
      return groupBy(this.records, 'date', (record, dateKey) =>
        moment(record[dateKey].split('T')[0]).format('DD/MM/YYYY')
      )
    },
    mappedRecordsLength() {
      return Object.keys(this.mappedRecords).length
    },
    toolbarColor() {
      return this.totalAmount < 0 ? 'error' : 'primary'
    },
    totalAmount() {
      return this.records.reduce((sum, record) => sum + record.amount, 0)
    }
  },
  created() {
    this.setRecords()
  },
  destroyed() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe()
    })
  },
  methods: {
    ...mapActions(['setMonth']),
    changeMonth(month) {
      const path = this.$route.path
      this.$router
        .push({
          path,
          query: { month }
        })
        .catch(() => {})

      this.setMonth({ month })
      this.filter()
    },
    filter() {
      this.filtersSubject$.next({ month: this.month, ...this.filters })
    },
    setRecords() {
      this.subscriptions.push(
        this.filtersSubject$
          .pipe(mergeMap(variables => RecordsService.records(variables)))
          .subscribe(records => (this.records = records))
      )
    },
    showDivider(index, obj) {
      return index < Object.keys(obj).length - 1
    }
  }
}
</script>
