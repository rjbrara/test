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
            class="mt-n16 d-flex align-center justify-center mb-5"
            rounded="lg"
            min-height="100px"
            min-width="100px"
            color="red accent-3"
          >
            <v-icon color="white" x-large>{{ icon }}</v-icon>
          </v-card>
        </v-col>
        <v-col cols="4">
          <p class="font-weight-regular text-subtitle-1">{{ name }}</p>
          <p class="text-subtitle-1 font-weight-bold">{{ formatRupiah(total) }}</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import formatRupiah from "@/utils/currency"
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
    icon: {
      type: String,
      required: true
    }
  },
  setup() {
    return { formatRupiah }
  }
};
</script>

<style></style>
