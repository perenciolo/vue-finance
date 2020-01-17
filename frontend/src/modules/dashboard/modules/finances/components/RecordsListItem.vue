<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon
        :class="[recordIcon(record.type)['color'], 'lighten-1', 'white--text']"
      >
        {{ recordIcon(record.type)['icon'] }}
      </v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ record.description }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ record.category.description }} | {{ record.account.description }}
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <span :class="amountColor(record.amount)">{{
        formatCurrency(record.amount)
      }}</span>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import formatCurrencyMixin from '@/mixins/formatCurrency'
import amountColorMixin from '@/modules/dashboard/modules/finances/mixins/amountColor'

export default {
  name: 'RecordsListItem',
  mixins: [amountColorMixin, formatCurrencyMixin],
  props: {
    record: Object
  },
  methods: {
    recordIcon(type) {
      return type === 'CREDIT'
        ? { icon: 'mdi-arrow-up-thick', color: 'primary' }
        : { icon: 'mdi-arrow-down-thick', color: 'error' }
    }
  }
}
</script>
