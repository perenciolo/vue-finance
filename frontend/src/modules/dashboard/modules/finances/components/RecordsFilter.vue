<template>
  <div>
    <v-layout row>
      <v-flex xs6 v-if="isFiltering">
        <v-btn icon @click="filter('clear')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs6 :class="buttonFilterClass">
        <v-btn icon @click="showFilterDialog = true">
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-dialog v-model="showFilterDialog" max-width="350px">
      <v-card>
        <v-card-title>
          <h3 class="headline">Filter</h3>
          <v-spacer></v-spacer>
          <v-btn icon @click="showFilterDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn icon @click="filter">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list three-line>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Invoice Type</v-list-item-title>
                <v-list-item-subtitle>
                  <v-select
                    placeholder="All Invoices"
                    chips
                    deletable-chips
                    :items="operations"
                    item-text="description"
                    item-value="value"
                    @change="localfilters.type = $event"
                    :value="filter && filter.type"
                  >
                  </v-select>
                  <v-select
                    placeholder="All Accounts"
                    chips
                    deletable-chips
                    multiple
                    :items="accounts"
                    item-text="description"
                    item-value="id"
                    @change="localfilters.accountsIds = $event"
                    :value="filter && filter.accountsIds"
                  >
                  </v-select>
                  <v-select
                    placeholder="All Categories"
                    chips
                    deletable-chips
                    multiple
                    :items="categories"
                    item-text="description"
                    item-value="id"
                    @change="localfilters.categoriesIds = $event"
                    :value="filter && filter.categoriesIds"
                  >
                  </v-select>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import AccountsService from '@/modules/dashboard/modules/finances/services/accounts-service'
import CategoriesService from '@/modules/dashboard/modules/finances/services/categories-service'

const { mapState, mapActions } = createNamespacedHelpers('finances')

export default {
  name: 'RecordsFilter',
  data: () => ({
    accounts: [],
    categories: [],
    localfilters: {
      accountsIds: [],
      categoriesIds: [],
      type: null
    },
    operations: [
      {
        description: 'Income',
        value: 'CREDIT'
      },
      {
        description: 'Expense',
        value: 'DEBIT'
      }
    ],
    showFilterDialog: false,
    subscriptions: []
  }),
  computed: {
    ...mapState(['filters', 'isFiltering']),
    buttonFilterClass() {
      return !this.isFiltering ? 'offset-xs6' : ''
    }
  },
  created() {
    this.setItems()
  },
  destroyed() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  },
  methods: {
    ...mapActions(['setFilters']),
    filter(type) {
      this.showFilterDialog = false
      this.setFilters({ filters: type !== 'clear' ? this.localfilters : null })
      this.$emit('filter')
    },
    setItems() {
      this.subscriptions.push(
        AccountsService.accounts().subscribe(
          accounts => (this.accounts = accounts)
        )
      )
      this.subscriptions.push(
        CategoriesService.categories().subscribe(
          categories => (this.categories = categories)
        )
      )
    }
  }
}
</script>
