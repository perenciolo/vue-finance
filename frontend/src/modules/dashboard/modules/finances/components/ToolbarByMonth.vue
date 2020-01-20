<template>
  <v-app-bar :color="color">
    <v-layout align-center>
      <v-flex sm1>
        <div class="text-sm-left">
          <v-btn icon text @click="decrement">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </div>
      </v-flex>
      <v-flex sm8 offset-sm1>
        <v-toolbar-title class="text-sm-center">
          <span>{{ currentMonth }}</span>
        </v-toolbar-title>
      </v-flex>
      <v-flex sm1 text-sm-right v-if="showSlot">
        <slot />
      </v-flex>
      <v-flex sm1 :class="arrowRightClass">
        <div class="text-sm-right">
          <v-btn icon text @click="increment">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-app-bar>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ToolbarByMonth',
  props: {
    color: String,
    format: String,
    month: String,
    showSlot: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    date: null
  }),
  computed: {
    arrowRightClass() {
      return !this.showSlot ? 'offset-sm1' : ''
    },
    currentMonth() {
      return this.date.format('MMMM YYYY')
    }
  },
  created() {
    this.setCurrentMonth()
    this.emit()
  },
  methods: {
    emit() {
      this.$emit('month', this.date.format(this.format))
    },
    decrement() {
      this.date = this.date.clone().subtract(1, 'month')
      this.emit()
    },
    increment() {
      this.date = this.date.clone().add(1, 'month')
      this.emit()
    },
    setCurrentMonth() {
      this.date = this.month ? moment(this.month, this.format) : moment()
    }
  }
}
</script>
