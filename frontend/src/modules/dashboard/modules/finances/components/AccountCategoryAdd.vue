<template>
  <v-card>
    <v-card-title class="headline">{{ title }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="$v.item.description.$model"
        label="Descripton"
      ></v-text-field>
      <v-select
        v-if="entity === 'category'"
        label="Operation"
        v-model="$v.item.operation.$model"
        :items="operations"
        item-text="description"
        item-value="value"
      ></v-select>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="$emit('close')">Cancel</v-btn>
      <v-btn text color="primary" @click="save" :disabled="$v.$invalid"
        >Save</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators'

import AccountsService from '@/modules/dashboard/modules/finances/services/accounts-service'
import CategoriesService from '@/modules/dashboard/modules/finances/services/categories-service'

const TYPE_ACCOUNT = 'account'
const TYPE_CATEGORY = 'category'

export default {
  name: 'AccountCategoryAdd',
  props: {
    entity: String
  },
  data() {
    return {
      item: {
        description: '',
        operation: this.$route.query.type.toUpperCase()
      },
      operations: [
        { description: 'Income', value: 'CREDIT' },
        { description: 'Expense', value: 'DEBIT' }
      ]
    }
  },
  validations() {
    const validations = {
      item: {
        description: { required, minLength: minLength(3) }
      }
    }

    if (this.entity === TYPE_ACCOUNT) return validations

    return {
      item: {
        ...validations.item,
        operation: { required }
      }
    }
  },
  computed: {
    title() {
      return this.entity === TYPE_ACCOUNT ? 'New Account' : 'New Category'
    }
  },
  methods: {
    async save(e) {
      try {
        let promise

        switch (this.entity) {
          case TYPE_ACCOUNT:
            promise = AccountsService.createAccount(this.item)
            break

          case TYPE_CATEGORY:
            promise = CategoriesService.createCategory(this.item)
            break

          default:
            break
        }

        const item = await promise
        this.$emit('saved', item)
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
