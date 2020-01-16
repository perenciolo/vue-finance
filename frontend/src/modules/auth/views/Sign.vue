<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs12 sm6 md4 xl3>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>{{ texts.toolbar }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-progress-circular
              v-show="isLoading"
              indeterminate
              color="white"
              width="2"
            ></v-progress-circular>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-if="!isSignin"
                prepend-icon="mdi-account"
                name="name"
                label="Name"
                type="name"
                :error-messages="nameErrors"
                :success="!$v.user.name.$invalid"
                v-model.trim="$v.user.name.$model"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-email"
                name="email"
                label="Email"
                type="email"
                :error-messages="emailErrors"
                :success="!$v.user.email.$invalid"
                v-model.trim="$v.user.email.$model"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-lock"
                name="password"
                label="Password"
                type="password"
                :error-messages="passwordErrors"
                :success="!$v.user.password.$invalid"
                v-model.trim="$v.user.password.$model"
              >
              </v-text-field>
            </v-form>
            <v-btn
              @click="isSignin = !isSignin"
              block
              depressed
              color="secondary"
            >
              {{ texts.button }}
            </v-btn>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="submit"
              :disabled="$v.$invalid"
              color="primary"
              large
            >
              {{ texts.toolbar }}
            </v-btn>
          </v-card-actions>
          <v-snackbar v-model="showSnackbar" top>
            {{ error }}
            <v-btn color="pink" flat icon @click="showSnackbar = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-snackbar>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'

import AuthService from '@/modules/auth/services/auth-service'
import { formatError } from '@/utils'

export default {
  name: 'Sign',
  data: () => ({
    error: null,
    isSignin: true,
    isLoading: false,
    showSnackbar: false,
    user: {
      email: '',
      password: ''
    }
  }),
  validations() {
    const validations = {
      user: {
        email: { required, email },
        password: { required, minLength: minLength(6) }
      }
    }

    if (this.isSignin) {
      return validations
    }

    return {
      user: {
        ...validations.user,
        name: {
          required,
          minLength: minLength(3)
        }
      }
    }
  },
  computed: {
    texts() {
      const signin = { toolbar: 'Sign In', button: 'Create Account' }
      const signup = {
        toolbar: 'Sign Up',
        button: 'Already have an account? Sign In'
      }

      return this.isSignin ? signin : signup
    },
    emailErrors() {
      const errors = []
      const email = this.$v.user.email

      if (!email.$dirty) {
        return errors
      }

      !email.required && errors.push('o campo Email é obrigatório')
      !email.email && errors.push('Insira um email válido')

      return errors
    },
    nameErrors() {
      const errors = []
      const name = this.$v.user.name

      if (!name.$dirty) {
        return errors
      }

      !name.required && errors.push('o campo nome é obrigatório')
      !name.minLength &&
        errors.push(
          `Insira pelo menos ${name.$params.minLength.min} caracteres`
        )

      return errors
    },
    passwordErrors() {
      const errors = []
      const password = this.$v.user.password

      if (!password.$dirty) {
        return errors
      }

      !password.required && errors.push('o campo senha é obrigatório')
      !password.minLength &&
        errors.push(
          `Insira pelo menos ${password.$params.minLength.min} caracteres`
        )

      return errors
    }
  },
  methods: {
    async submit() {
      this.isLoading = true
      try {
        this.isSignin
          ? await AuthService.signin(this.user)
          : await AuthService.signup(this.user)
        this.$router.push(this.$route.query.redirect || '/dashboard')
      } catch (e) {
        console.log(e)
        this.error = formatError(e.message)
        this.showSnackbar = true
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
