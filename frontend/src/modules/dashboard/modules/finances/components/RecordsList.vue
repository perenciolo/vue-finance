<template>
  <div>
    <ToolbarByMonth
      format="MM-YYYY"
      :color="toolbarColor"
      @month="changeMonth"
    />
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
import moment from 'moment'

import { groupBy } from '@/utils'
import RecordsListItem from '@/modules/dashboard/modules/finances/components/RecordsListItem.vue'
import ToolbarByMonth from '@/modules/dashboard/modules/finances/components/ToolbarByMonth.vue'
import RecordsService from '@/modules/dashboard/modules/finances/services/records-service'

import formatCurrencyMixin from '@/mixins/formatCurrency'
import amountColorMixin from '@/modules/dashboard/modules/finances/mixins/amountColor'

export default {
  name: 'RecordsList',
  components: {
    RecordsListItem,
    ToolbarByMonth
  },
  mixins: [amountColorMixin, formatCurrencyMixin],
  data: () => ({
    records: []
  }),
  computed: {
    mappedRecords() {
      return groupBy(this.records, 'date', (record, dateKey) =>
        moment(record[dateKey]).format('DD/MM/YYYY')
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
  methods: {
    changeMonth(month) {
      this.setRecords(month)
    },
    async setRecords(month) {
      this.records = await RecordsService.records({ month })
    },
    showDivider(index, obj) {
      return index < Object.keys(obj).length - 1
    }
  }
}
</script>