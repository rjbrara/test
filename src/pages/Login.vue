<template>
  <AuthLayout>
    <template v-slot:child>
      <v-layout fill-height column class="py-4">
        <v-text-field label="Email" outlined></v-text-field>
        <v-text-field label="Password" outlined type="password"></v-text-field>
        <v-card-actions>
          <router-link to="/dashboard">
            <v-btn color="primary">Login</v-btn>
          </router-link>
        </v-card-actions>
      </v-layout>
    </template>
  </AuthLayout>
</template>

<script>
import AuthLayout from "@/templates/AuthLayout.vue";
export default {
  name: "LoginPage",
  components: {
    AuthLayout,
  },
};
</script>

<style></style>
