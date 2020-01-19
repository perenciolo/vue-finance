<template>
  <v-container text-center>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg4>
        <p>lipsum</p>
      </v-flex>
      <v-flex xs12 sm6 md8 lg8>
        <v-card>
          <v-card-text>
            <v-form>
              <v-select
                name="account"
                label="Account"
                prepend-icon="mdi-wallet"
              ></v-select>
              <v-select
                name="category"
                label="Category"
                prepend-icon="mdi-book-variant"
              ></v-select>
              <v-text-field
                name="description"
                label="Description"
                type="text"
                prepend-icon="mdi-tooltip-text"
              >
              </v-text-field>
              <v-text-field
                name="tags"
                label="Tags (comma separated e.g. a,b,c)"
                type="text"
                prepend-icon="mdi-label"
              >
              </v-text-field>
              <v-text-field
                name="note"
                label="Note"
                type="text"
                prepend-icon="mdi-note"
              >
              </v-text-field>
            </v-form>
          </v-card-text>
        </v-card>
        <v-btn @click="log">log</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { decimal, minLength, required } from 'vuelidate/lib/validators'
import moment from 'moment'

export default {
  name: 'RecordsAdd',
  data() {
    return {
      record: {
        type: this.$route.query.type.toUpperCase(),
        amount: 0,
        date: moment().format('YYYY-MM-DD'),
        accountId: '',
        categoryId: '',
        description: '',
        tags: '',
        note: ''
      }
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
  created() {
    this.changeTitle(this.$route.query.type)
  },
  beforeRouteUpdate(to, from, next) {
    const { type } = to.query
    this.changeTitle(type)
    this.record.type = type.toUpperCase()
    next()
  },
  methods: {
    ...mapActions(['setTitle']),
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
    log() {
      console.log('form', this.record)
    }
  }
}
</script>
