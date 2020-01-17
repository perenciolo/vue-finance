import apollo from '@/plugins/apollo'

import RecordsQuery from '@/modules/dashboard/modules/finances/graphql/Records.gql'

const records = async variables => {
  const response = await apollo.query({
    ...variables,
    query: RecordsQuery
  })

  return response.data.records
}

export default { records }
