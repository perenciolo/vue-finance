import apollo from '@/plugins/apollo'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

import AccountsQuery from '@/modules/dashboard/modules/finances/graphql/Accounts.gql'
import AccountCreateMutation from '@/modules/dashboard/modules/finances/graphql/AccountCreate.gql'

const accounts = () => {
  const queryRef = apollo.watchQuery({
    query: AccountsQuery
  })

  return from(queryRef).pipe(map(({ data: { accounts } }) => accounts))
}

const createAccount = async variables => {
  const response = await apollo.mutate({
    mutation: AccountCreateMutation,
    variables,
    update: (proxy, { data: { createAccount } }) => {
      try {
        const data = proxy.readQuery({
          query: AccountsQuery
        })

        data.accounts = [...data.accounts, createAccount]
        proxy.writeQuery({
          query: AccountsQuery,
          data
        })
      } catch (e) {
        console.log('The "Query Accounts" has not been read yet.', e)
      }
    }
  })

  return response.data.createAccount
}

export default {
  accounts,
  createAccount
}
