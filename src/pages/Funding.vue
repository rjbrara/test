<template>
  <DashboardLayout title="Funding">
    <template v-slot:child>
      <Table/>
    </template>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/templates/DashboardLayout.vue";
import { Table } from "@/components"
export default {
  name: "FundingPage",
  components: {
    DashboardLayout,
    Table
  },
};
</script>

<style>
</style>
