<template>
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
          <p class="font-weight-regular body-2">{{ name }}</p>
          <p>{{ total }}</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiChartBar } from "@mdi/js";
import { ref } from "@vue/composition-api";

export default {
  name: "CardComponent",
  props: {
    name: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const svgChart = ref(mdiChartBar);
    return { svgChart };
  },
};
</script>

<style></style>
