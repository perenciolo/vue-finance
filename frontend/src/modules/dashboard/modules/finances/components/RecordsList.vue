<template>
  <v-card class="pt-2">
    <v-list v-if="records.length" two-line subheader>
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
    <div v-if="records.length === 0">
      Você ainda não cadastrou contas.
    </div>
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
</template>

<script>
import moment from 'moment'

import { groupBy } from '@/utils'
import RecordsListItem from '@/modules/dashboard/modules/finances/components/RecordsListItem.vue'
import RecordsService from '@/modules/dashboard/modules/finances/services/records-service'

import formatCurrencyMixin from '@/mixins/formatCurrency'
import amountColorMixin from '@/modules/dashboard/modules/finances/mixins/amountColor'

export default {
  name: 'RecordsList',
  components: {
    RecordsListItem
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
    totalAmount() {
      return this.records.reduce((sum, record) => sum + record.amount, 0)
    }
  },
  async created() {
    this.records = await RecordsService.records()
  },
  methods: {
    showDivider(index, obj) {
      return index < Object.keys(obj).length - 1
    }
  }
}
</script>
