<template>
  <v-main>
    <v-app-bar
      absolute
      color="grey lighten-3"
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-icon>{{ svgAccount }}</v-icon>
    </v-app-bar>
    <v-navigation-drawer absolute bottom dark>
      <ListItem />
    </v-navigation-drawer>
    <v-sheet
      id="scrolling-techniques-6"
      class="overflow-y-auto pa-12 px-1 grey lighten-3"
      height="100vh"
    >
      <v-container class="mr-6">
        <div class="mb-10">
          <span class="display-1">{{ title }}</span>
        </div>
        <slot name="child"></slot>
      </v-container>
    </v-sheet>
  </v-main>
</template>

<script>
import { ref } from "@vue/composition-api";
import { mdiAccount } from "@mdi/js";
import { ListItem } from "@/components";
export default {
  name: "DashboardLayout",
  props: {
    title: String,
  },
  components: {
    ListItem,
  },
  setup() {
    const svgAccount = ref(mdiAccount);
    return { svgAccount };
  },
};
</script>

<style scope></style>
