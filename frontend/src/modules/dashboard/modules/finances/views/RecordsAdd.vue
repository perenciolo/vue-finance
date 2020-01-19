<template>
  <v-container text-center>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg4 d-flex>
        <NumericDisplay
          :color="color"
          class="d-flex flex-column justify-center"
          :value="355.57"
          v-model="$v.record.amount.$model"
        />
      </v-flex>
      <v-flex xs12 sm6 md8 lg8>
        <v-card>
          <v-card-text>
            <v-form>
              <v-dialog
                ref="dateDialog"
                :return-value.sync="record.date"
                v-model="showDateDialog"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    name="date"
                    label="Date"
                    type="text"
                    prepend-icon="mdi-calendar"
                    readonly
                    :value="formattedDate"
                    v-on="on"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  :color="color"
                  locale="pt-br"
                  scrollable
                  v-model="dateDialogValue"
                >
                  <v-spacer></v-spacer>
                  <v-btn text :color="color" @click="cancelDateDialog">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    :color="color"
                    @click="$refs.dateDialog.save(dateDialogValue)"
                  >
                    Ok
                  </v-btn>
                </v-date-picker>
              </v-dialog>
              <v-select
                name="account"
                label="Account"
                prepend-icon="mdi-wallet"
                :items="accounts"
                item-text="description"
                item-value="id"
                v-model="$v.record.accountId.$model"
              ></v-select>
              <v-select
                name="category"
                label="Category"
                prepend-icon="mdi-book-variant"
                :items="categories"
                item-text="description"
                item-value="id"
                v-model="$v.record.categoryId.$model"
              ></v-select>
              <v-text-field
                name="description"
                label="Description"
                type="text"
                prepend-icon="mdi-tooltip-text"
                v-model.trim="$v.record.description.$model"
              >
              </v-text-field>
              <v-text-field
                v-show="showTagsInput"
                name="tags"
                label="Tags (comma separated e.g. a,b,c)"
                type="text"
                prepend-icon="mdi-label"
                v-model.trim="record.tags"
              >
              </v-text-field>
              <v-text-field
                v-show="showNotesInput"
                name="note"
                label="Note"
                type="text"
                prepend-icon="mdi-note"
                v-model.trim="record.note"
              >
              </v-text-field>
            </v-form>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  class="mr-3"
                  v-on="on"
                  @click="showTagsInput = !showTagsInput"
                >
                  <v-icon :color="color">mdi-label</v-icon>
                </v-btn>
              </template>
              <span>Add tags</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  v-on="on"
                  @click="showNotesInput = !showNotesInput"
                >
                  <v-icon :color="color">mdi-note</v-icon>
                </v-btn>
              </template>
              <span>Add notes</span>
            </v-tooltip>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 sm6 md4 lg4></v-flex>
      <v-flex xs12 sm6 md8 lg8>
        <v-btn color="secondary" large fab class="mt-4" @click="$router.back()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
          :color="color"
          large
          fab
          class="ml-4 mt-4"
          @click="submit"
          :disabled="$v.$invalid"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { decimal, minLength, required } from 'vuelidate/lib/validators'
import moment from 'moment'

import AccountsService from '@/modules/dashboard/modules/finances/services/accounts-service'
import CategoriesService from '@/modules/dashboard/modules/finances/services/categories-service'

import NumericDisplay from '@/modules/dashboard/modules/finances/components/NumericDisplay.vue'

export default {
  name: 'RecordsAdd',
  components: {
    NumericDisplay
  },
  data() {
    return {
      accounts: [],
      categories: [],
      dateDialogValue: moment().format('YYYY-MM-DD'),
      record: {
        type: this.$route.query.type.toUpperCase(),
        amount: 0,
        date: moment().format('YYYY-MM-DD'),
        accountId: '',
        categoryId: '',
        description: '',
        tags: '',
        note: ''
      },
      showDateDialog: false,
      showTagsInput: false,
      showNotesInput: false
    }
  },
  validations: {
    record: {
      type: { required },
      amount: { required, decimal, different: value => value !== 0 },
      date: { required },
      accountId: { required },
      categoryId: { required },
      description: { required, minLength: minLength(6) }
    }
  },
  computed: {
    color() {
      switch (this.record.type) {
        case 'CREDIT':
          return 'primary'

        case 'DEBIT':
          return 'error'

        default:
          return 'primary'
      }
    },
    formattedDate() {
      return moment(this.record.date).format('DD/MM/YYYY')
    }
  },
  async created() {
    this.changeTitle(this.$route.query.type)
    this.accounts = await AccountsService.accounts()
    this.categories = await CategoriesService.categories({
      operation: this.$route.query.type
    })
  },
  async beforeRouteUpdate(to, from, next) {
    const { type } = to.query
    this.changeTitle(type)
    this.record.type = type.toUpperCase()
    this.record.categoryId = ''
    this.categories = await CategoriesService.categories({
      operation: type
    })
    next()
  },
  methods: {
    ...mapActions(['setTitle']),
    cancelDateDialog() {
      this.showDateDialog = false
      this.dateDialogValue = this.record.date
    },
    changeTitle(recordType) {
      let title
      switch (recordType) {
        case 'credit':
          title = 'New Income'
          break

        case 'debit':
          title = 'New Expense'
          break

        default:
          title = 'New Invoice'
          break
      }

      this.setTitle({ title })
    },
    submit() {
      console.log('form', this.record)
    }
  }
}
</script>
