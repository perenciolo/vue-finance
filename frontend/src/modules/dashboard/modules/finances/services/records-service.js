import apollo from '@/plugins/apollo'
import moment from 'moment'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

import RecordCreateMutation from '@/modules/dashboard/modules/finances/graphql/RecordCreate.gql'
import RecordsQuery from '@/modules/dashboard/modules/finances/graphql/Records.gql'
import TotalBalanceQuery from '@/modules/dashboard/modules/finances/graphql/TotalBalance.gql'

const createRecord = async variables => {
  const response = await apollo.mutate({
    mutation: RecordCreateMutation,
    variables,
    update: (proxy, { data: { createRecord } }) => {
      const month = moment(createRecord.date.split('T')[0]).format('MM-YYYY')
      const variables = { month }

      // Create
      try {
        const recordsData = proxy.readQuery({
          query: RecordsQuery,
          variables
        })

        recordsData.records = [...recordsData.records, createRecord]

        proxy.writeQuery({
          query: RecordsQuery,
          variables,
          data: recordsData
        })
      } catch (e) {
        console.log('The "Query Records" has not been read yet.', e)
      }

      // Total balance
      try {
        const currentDay = moment().endOf('day')
        const recordDate = moment(createRecord.date.split('T')[0])
        const variables = { date: currentDay.format('YYYY-MM-DD') }

        if (recordDate.isBefore(currentDay)) {
          const totalBalanceData = proxy.readQuery({
            query: TotalBalanceQuery,
            variables
          })

          totalBalanceData.totalBalance = Number(
            (totalBalanceData.totalBalance + createRecord.amount).toFixed(2)
          )

          proxy.writeQuery({
            query: TotalBalanceQuery,
            variables,
            data: totalBalanceData
          })
        }
      } catch (e) {
        console.log('The "Query TotalBalance" has not been read yet.', e)
      }
    }
  })

  return response.data.createRecord
}

const records = variables => {
  const queryRef = apollo.watchQuery({
    query: RecordsQuery,
    variables
  })

  return from(queryRef).pipe(map(({ data: { records } }) => records))
}

const totalBalance = async () => {
  const response = await apollo.query({
    query: TotalBalanceQuery,
    variables: {
      date: moment().format('YYYY-MM-DD')
    }
  })

  return response.data.totalBalance
}

export default { createRecord, records, totalBalance }
