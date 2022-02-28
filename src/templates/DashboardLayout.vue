<template>
  <div>
    <v-app-bar
      absolute
      color="grey lighten-3"
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
    >
      <!-- if width < 960 -->
      <v-app-bar-nav-icon
        color="black"
        v-if="isDrawer"
        @click.stop="isDrawer = !isDrawer"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn icon @click="handleLogout">
        <v-icon color="black">{{ svgExit }}</v-icon>
      </v-btn>
    </v-app-bar>
    <!-- if width < 960 -->
    <v-navigation-drawer v-if="isDrawer" absolute dark temporary>
      <ListItem />
    </v-navigation-drawer>
    <!-- if width > 960 -->
    <v-navigation-drawer v-else absolute dark permanent>
      <ListItem />
    </v-navigation-drawer>
    <v-sheet
      id="scrolling-techniques-6"
      class="pa-12 px-1 grey lighten-3"
      height="100vh"
    >
      <v-container class="mr-6">
        <div class="mb-10">
          <span class="display-1">{{ title }}</span>
        </div>
        <slot name="child"></slot>
      </v-container>
    </v-sheet>
  </div>
</template>

<script>
import {
  getCurrentInstance,
  watch,
  reactive,
  onMounted,
  toRefs,
} from "@vue/composition-api";
import { mdiExitToApp } from "@mdi/js";
import { ListItem } from "@/components";
import { removeToken } from "@/constans";
import { signOut } from "@firebase/auth";
import { auth } from "@/firebase";
import router from "@/router";

export default {
  name: "DashboardLayout",
  props: {
    title: String,
  },
  components: {
    ListItem,
  },
  setup() {
    const state = reactive({
      svgExit: mdiExitToApp,
      isDrawer: null,
    });

    const vuetify = getCurrentInstance().proxy.$vuetify;

    const handleLogout = () => {
      signOut(auth).then(() => {
        removeToken("token");
        router.push("/signin");
      });
    };

    watch(vuetify, () => {
      if (vuetify.breakpoint.mdAndDown) {
        state.isDrawer = true;
      } else {
        state.isDrawer = false;
      }
    });

    // if user reload page
    onMounted(() => {
      if (vuetify.breakpoint.mdAndDown) {
        state.isDrawer = true;
      } else {
        state.isDrawer = false;
      }
    });

    return { ...toRefs(state), vuetify, handleLogout };
  },
};
</script>

<style scope></style>
