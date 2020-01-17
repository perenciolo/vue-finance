import apollo, { onLogin } from '@/plugins/apollo'

import SigninMutation from '@/modules/auth/graphql/Signin.gql'
import SignupMutation from '@/modules/auth/graphql/Signup.gql'
import UserQuery from '@/modules/auth/graphql/User.gql'

const signin = async variables => {
  const response = await apollo.mutate({
    mutation: SigninMutation,
    variables
  })
  const { signin } = response.data
  await onLogin(apollo, signin.token)
  return signin
}

const signup = async variables => {
  const response = await apollo.mutate({
    mutation: SignupMutation,
    variables
  })
  const { signup } = response.data
  await onLogin(apollo, signup.token)
  return signup
}

const user = async (options = {}) => {
  const response = await apollo.query({
    query: UserQuery,
    ...options
  })
  return response.data.user
}

export default {
  signin,
  signup,
  user
}
