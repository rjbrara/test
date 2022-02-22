<template>
  <div class="wrap-card">
    <v-card
      elevation="2"
      class="xs-auto my-1"
      max-width="350px"
      min-height="150px"
      rounded="lg"
    >
      <v-card-text>
        <v-row align="center" justify="space-between" class="mx-0">
          <v-col cols="6">
            <v-card
              class="mt-n16 d-flex align-center justify-center"
              rounded="lg"
              min-height="100px"
              min-width="120px"
              color="red accent-3"
            >
              <v-icon color="white" x-large>{{ svgChart }}</v-icon>
            </v-card>
          </v-col>
          <v-col cols="4">
            <p class="font-weight-regular body-2">Total User</p>
            <p>123</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card
      elevation="2"
      class="xs-auto my-1"
      max-width="350px"
      min-height="150px"
      rounded="lg"
    >
      <v-card-text>
        <v-row align="center" justify="space-between" class="mx-0">
          <v-col cols="6">
            <v-card
              class="mt-n16 d-flex align-center justify-center"
              rounded="lg"
              min-height="100px"
              min-width="120px"
              color="red accent-3"
            >
              <v-icon color="white" x-large>{{ svgChart }}</v-icon>
            </v-card>
          </v-col>
          <v-col cols="4">
            <p class="font-weight-regular body-2">Total User</p>
            <p>123</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mdiChartBar } from "@mdi/js";
import { ref } from "@vue/composition-api";

export default {
  name: "CardComponent",
  setup() {
    const svgChart = ref(mdiChartBar);
    return { svgChart };
  },
};
</script>

<style scoped>
.wrap-card {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 2rem
}
</style>
