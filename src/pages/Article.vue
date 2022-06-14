<template>
  <DashboardLayout title="Articles">
    <template v-slot:child>
      <TableArticle/>
    </template>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/templates/DashboardLayout.vue";
import { TableArticle } from "@/components"
export default {
  name: "FundingPage",
  components: {
    DashboardLayout,
    TableArticle
  },
};
</script>

<style>
</style>
