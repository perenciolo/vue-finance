<template>
  <v-speed-dial
    v-model="fab"
    fixed
    bottom
    right
    direction="top"
    transition="slide-y-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn v-model="fab" color="primary" fab>
        <v-icon v-if="fab">mdi-close</v-icon>
        <v-icon v-else>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-btn
      fab
      small
      color="error"
      title="New expense"
      @click="addRecord('debit')"
    >
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <v-btn
      fab
      small
      color="primary"
      title="New income"
      @click="addRecord('credit')"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-speed-dial>
</template>
<script>
export default {
  name: 'AppFloatingBtn',
  data: () => ({
    fab: false
  }),
  methods: {
    addRecord(type) {
      this.$router.push({
        name: 'recordsAdd',
        query: { type }
      })
    }
  }
}
</script>
