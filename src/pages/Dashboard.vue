<template>
  <DashboardLayout title="Dashboard">
    <template v-slot:child>
      <Card/>
    </template>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/templates/DashboardLayout.vue";
import { Card } from "@/components"
export default {
  name: "DashboardPage",
  components: {
    DashboardLayout,
    Card,
  },
};
</script>

<style></style>
