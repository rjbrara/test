<template>
  <DashboardLayout title="Dashboard">
    <template v-slot:child>
      <div class="wrap-card" style="{background: 'red'}">
        <Card name="Total Funding" :total="totalFunding" :icon="iconFunding" />
        <Card name="Total Users" :total="totalUsers" :icon="iconUsers" />
      </div>
    </template>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/templates/DashboardLayout.vue";
import { Card } from "@/components";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { onMounted, reactive, toRefs } from "vue-demi";
import { mdiChartBar, mdiAccountMultiple } from "@mdi/js";

export default {
  name: "DashboardPage",
  components: {
    DashboardLayout,
    Card,
  },
  setup() {
    const state = reactive({
      totalFunding: 0,
      totalUsers: 0,
      iconFunding: mdiChartBar,
      iconUsers: mdiAccountMultiple
    });
    const getTotalFunding = async () => {
      const querySnapshot = await getDocs(collection(db, "funding"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        Object.keys(data).forEach((key) => {
          if (key === "currently_collected") {
            state.totalFunding += data[key];
          }
        });
      });
    };
    const getTotalUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      state.totalUsers = querySnapshot.docs.length;
    };
    onMounted(() => {
      getTotalFunding();
      getTotalUsers();
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style scoped>
.wrap-card {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 2rem;
}
</style>
