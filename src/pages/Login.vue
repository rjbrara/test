<template>
  <AuthLayout>
    <template v-slot:child>
      <v-layout fill-height column class="py-4">
        <!-- this alert will appear when login error -->
        <v-alert v-if="isError" dense text type="error">
          {{ message }}
        </v-alert>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="email"
            label="Email"
            outlined
            :error-messages="emailErrors"
            @input="v$.email.$touch()"
            @blur="v$.email.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            outlined
            type="password"
            :error-messages="passwordErrors"
            @input="v$.password.$touch()"
            @blur="v$.password.$touch()"
          ></v-text-field>
          <v-card-actions>
            <v-btn type="submit" color="primary">Login</v-btn>
          </v-card-actions>
        </v-form>
      </v-layout>
    </template>
  </AuthLayout>
</template>

<script>
import AuthLayout from "@/templates/AuthLayout.vue";
import {
  computed,
  reactive,
  toRefs,
} from "@vue/composition-api";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { setToken } from "@/constans";
import { required, minLength, maxLength, email } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import router from "@/router"

export default {
  name: "LoginPage",
  components: {
    AuthLayout,
  },
  setup() {
    const state = reactive({
      email: "",
      password: "",
      isError: false,
      message: "",
    });

    const localRules = {
      email: {
        required,
        email,
        maxLength: maxLength(30),
      },
      password: { required, minLength: minLength(8) },
    };

    const emailErrors = computed(() => {
      const errors = [];
      v$?.value?.$errors.filter((err) => {
        if (
          (err?.$validator === "maxLength" ||
            err?.$validator === "email" ||
            err?.$validator === "required") &&
          err?.$property === "email"
        ) {
          errors.push(err?.$message);
        }
      });
      return errors;
    });

    const passwordErrors = computed(() => {
      const errors = [];
      v$?.value?.$errors.filter((err) => {
        if (
          (err?.$validator === "minLength" ||
            err?.$validator === "maxLength" ||
            err?.$validator === "required") &&
          err?.$property === "password"
        ) {
          errors.push(err?.$message);
        }
      });
      return errors;
    });

    const v$ = useVuelidate(localRules, state);

    const handleSubmit = async () => {
      v$.value.$touch();
      if (!v$.value.$invalid) {
        try {
          await signInWithEmailAndPassword(auth, state.email, state.password)
            .then((userCredential) => {
              if (userCredential.user) {
                setToken(userCredential.user.accessToken);
                router.push('/')
              }
            })
            .catch((err) => {
              state.isError = true;
              state.message = err.message;
            });
        } catch (error) {
          console.log(error);
        }
      }
    };

    return {
      ...toRefs(state),
      handleSubmit,
      v$,
      emailErrors,
      passwordErrors,
    };
  },
};
</script>

<style></style>
