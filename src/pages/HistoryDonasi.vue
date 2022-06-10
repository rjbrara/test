<template>
  <DashboardLayout title="History Donation">
    <template v-slot:child>
      <TableDonasi />
    </template>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/templates/DashboardLayout.vue";
import { TableDonasi } from "@/components";
export default {
  name: "HistoryDonasi",
  components: {
    DashboardLayout,
    TableDonasi,
  },
};
</script>

<style></style>
