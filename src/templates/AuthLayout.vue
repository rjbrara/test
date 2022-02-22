<template>
  <v-main>
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col>
          <v-card elevation="2" class="mx-auto my-12" max-width="374">
              <v-card-title tag="h1">Sign In</v-card-title>
            <v-card-text>
              <v-row align="center" class="mx-0">
                <slot name="child"></slot>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "AuthLayout",
};
</script>

<style></style>
