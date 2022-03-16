<template>
  <v-list nav dense>
    <v-list-item-group active-class="deep-purple--text text--accent-4">
      <!-- <v-list-item :v-for="nav in navigations" :key="nav.id">
        <router-link :to="nav.url">
          <v-list-item-icon>
            <v-icon>{{ nav.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ nav.name }}</v-list-item-title>
          </v-list-item-content>
        </router-link>
      </v-list-item> -->
      <v-list-item class="px-10">
        <router-link to="/" class="link">
          <v-layout row align-center justify-center>
            <v-list-item-icon>
              <v-icon>{{ svgDashboard }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <h4>Dashboard</h4>
            </v-list-item-content>
          </v-layout>
        </router-link>
      </v-list-item>
      <v-list-item class="px-10">
        <router-link to="/funding" class="link">
          <v-layout row align-center justify-center>
            <v-list-item-icon>
              <v-icon>{{ svgFolder }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <h4>Funding</h4>
            </v-list-item-content>
          </v-layout>
        </router-link>
      </v-list-item>
       <v-list-item class="px-10">
        <router-link to="/history-donasi" class="link">
          <v-layout row align-center justify-center>
            <v-list-item-icon>
              <v-icon>{{ svgHistory }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <h4>History Donasi</h4>
            </v-list-item-content>
          </v-layout>
        </router-link>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { reactive, toRefs } from "@vue/composition-api";
import { mdiViewDashboard, mdiFolder, mdiArchive } from "@mdi/js";
export default {
  name: "ListItem",
  setup() {
    const state = reactive({
      svgDashboard: mdiViewDashboard,
      svgFolder: mdiFolder,
      svgHistory: mdiArchive
    });
    return { ...toRefs(state) };
  },
};
</script>

<style scoped>
.link {
    text-decoration: none;
}
</style>
