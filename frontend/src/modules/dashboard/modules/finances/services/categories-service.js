import apollo from '@/plugins/apollo'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

import CategoriesQuery from '@/modules/dashboard/modules/finances/graphql/Categories.gql'
import CategoryCreateMutation from '@/modules/dashboard/modules/finances/graphql/CategoryCreate.gql'

const categories = ({ operation } = {}) => {
  const queryRef = apollo.watchQuery({
    query: CategoriesQuery,
    variables: { operation: operation ? operation.toUpperCase() : operation }
  })

  return from(queryRef).pipe(map(({ data: { categories } }) => categories))
}

const createCategory = async variables => {
  const response = await apollo.mutate({
    mutation: CategoryCreateMutation,
    variables,
    update: (proxy, { data: { createCategory } }) => {
      try {
        const variables = { operation: createCategory.operation }
        const data = proxy.readQuery({
          query: CategoriesQuery,
          variables
        })
        data.categories = [...data.categories, createCategory]

        proxy.writeQuery({
          query: CategoriesQuery,
          variables,
          data
        })
      } catch (e) {
        console.log('The "Query Categories" has not been read yet.', e)
      }
    }
  })

  return response.data.createCategory
}

export default {
  categories,
  createCategory
}
