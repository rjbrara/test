<template>
  <DashboardLayout title="Payment">
    <template v-slot:child>
      <TablePayment/>
    </template>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/templates/DashboardLayout.vue";
import { TablePayment } from "@/components"
export default {
  name: "PaymentPage",
  components: {
    DashboardLayout,
    TablePayment
  },
};
</script>

<style>
</style>
