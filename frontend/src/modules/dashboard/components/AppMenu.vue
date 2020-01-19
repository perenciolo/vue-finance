<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    :mini-variant="mini"
    absolute
    temporary
  >
    <v-list>
      <v-list-item v-if="mini" @click.stop="mini = !mini">
        <v-list-item-action>
          <v-icon>mdi-chevron-right</v-icon>
        </v-list-item-action>
      </v-list-item>

      <v-list-item tag="div">
        <v-list-item-avatar>
          <v-icon>mdi-account</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-list class="pt-0" dense>
      <v-divider light></v-divider>

      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :to="item.url"
        :exact="item.exact"
        @click="$emit('input', false)"
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import AuthService from '@/modules/auth/services/auth-service'

export default {
  name: 'AppMenu',
  props: {
    value: Boolean
  },
  data: () => ({
    items: [
      {
        title: 'Home',
        icon: 'mdi-view-dashboard',
        url: '/dashboard',
        exact: true
      },
      {
        title: 'Income',
        icon: 'mdi-plus-circle',
        url: '/dashboard/records/add?type=credit',
        exact: true
      },
      {
        title: 'Expense',
        icon: 'mdi-minus-circle',
        url: '/dashboard/records/add?type=debit',
        exact: true
      }
    ],
    mini: false,
    user: {}
  }),
  async created() {
    this.user = await AuthService.user()
  }
}
</script>
