<template>
  <div>
    <v-layout row>
      <v-flex xs6>
        <v-btn icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs6>
        <v-btn icon @click="showFilterDialog = true">
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-dialog v-model="showFilterDialog" max-width="350px">
      <v-card>
        <v-card-title>
          <h2 class="headline">Filtros</h2>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'RecordsFilter',
  data: () => ({
    showFilterDialog: false
  })
}
</script>
