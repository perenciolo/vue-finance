import apollo, { onLogin } from '@/plugins/apollo'

import SigninMutation from '@/modules/auth/graphql/Signin.gql'
import SignupMutation from '@/modules/auth/graphql/Signup.gql'

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

export default {
  signin,
  signup
}
