<template>
  <DashboardLayout title="Users">
    <template v-slot:child>
      <TableUsers />
    </template>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/templates/DashboardLayout.vue";
import { TableUsers } from "@/components";
export default {
  name: "UsersPage",
  components: {
    DashboardLayout,
    TableUsers,
  },
};
</script>

<style></style>
