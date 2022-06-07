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
      <v-btn icon @click="openDialog">
        <v-icon color="black">{{ svgSetting }}</v-icon>
      </v-btn>
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
      class="pa-12 grey lighten-3 px-1"
      min-height="100vh"
    >
      <v-container class="mr-4 pa-8">
        <!-- if width < 960 -->
        <v-row no-gutters v-if="isDrawer">
          <v-col class="mb-10" cols="12" sm="12" md="12">
            <span class="display-1">{{ title }}</span>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <slot name="child"></slot>
          </v-col>
        </v-row>
        <!-- if width > 960 -->
        <v-row no-gutters v-else class="content">
          <v-col class="mb-10" cols="12" sm="12" md="12">
            <span class="display-1">{{ title }}</span>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <slot name="child"></slot>
          </v-col>
        </v-row>
        <v-dialog v-model="isOpenDialog" width="700">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Pengaturan
            </v-card-title>

            <v-container>
              <v-row no-gutters>
                <v-col class="mb-5 img" cols="12" sm="12" md="12">
                  <v-img
                    :src="imagePreviews"
                    max-height="161"
                    max-width="280"
                    alt="image preview"
                    class="img"
                    v-if="imagePreviews"
                  ></v-img>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-file-input
                    small-chips
                    outlined
                    prepend-icon=""
                    accept="image/png, image/jpeg, image/bmp"
                    label="Input image"
                    @change="setImagePreviews"
                  ></v-file-input>
                </v-col>
                <v-col class="mb-5 img" cols="12" sm="12" md="12">
                  <v-img
                    :src="bannerPreviews"
                    max-height="161"
                    max-width="280"
                    class="img"
                    alt="banner preview"
                    v-if="bannerPreviews"
                  ></v-img>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-file-input
                    small-chips
                    outlined
                    prepend-icon=""
                    accept="image/png, image/jpeg, image/bmp"
                    label="Input Banner"
                    @change="setBannerImage"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="formData.phone"
                    outlined
                    label="No Whatsapp"
                    :error-messages="phoneErrors"
                    @input="v$.formData.phone.$touch()"
                    @blur="v$.formData.phone.$touch()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="handleUpdate"> Edit </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
  computed
} from "@vue/composition-api";
import { mdiExitToApp, mdiWrench, mdiClose } from "@mdi/js";
import { ListItem } from "@/components";
import { removeToken } from "@/constans";
import { signOut } from "@firebase/auth";
import { auth, db } from "@/firebase";
import router from "@/router";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "@/firebase";
import { doc, getDoc, Timestamp, updateDoc } from "@firebase/firestore";
import useVuelidate from "@vuelidate/core";
import { numeric } from "@vuelidate/validators";

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
      svgSetting: mdiWrench,
      svgClose: mdiClose,
      isDrawer: null,
      isOpenDialog: false,
      isSelectClose: false,
      imagePreviews: null,
      bannerPreviews: null,
      defaultUID: "3ngAnqg3AwKi7DTM3yeD",
      formData: {
        logo: null,
        phone: null,
        banner: null,
      },
      // items: [
      //   "QRIS (OVO, GOPAY, LINK AJA)",
      //   "Transfer Bank Syariah Indonesia",
      //   "Transfer Bank DKI Syariah",
      //   "Transfer Bank BCA",
      //   "Transfer Bank Mandiri",
      //   "Transfer Bank Danamon",
      //   "Transfer Bank Permata Bank",
      // ],
    });

    const settingRules = {
      formData: {
        phone: {
          numeric,
        },
      },
    };

    const vuetify = getCurrentInstance().proxy.$vuetify;
    const v$ = useVuelidate(settingRules, state);

    // set errors fields
    const phoneErrors = computed(() => {
      const errors = [];
      v$?.value?.$errors.filter((err) => {
        if (err?.$validator === "numeric" && err?.$property === "phone") {
          errors.push(err?.$message);
        }
      });
      return errors;
    });

    const handleLogout = () => {
      signOut(auth).then(() => {
        removeToken("token");
        router.push("/signin");
      });
    };

    const setImagePreviews = async (file) => {
      if (!file) return;
      const fimage = file ? URL.createObjectURL(file) : undefined;
      // store to local state imagePrerviews
      state.imagePreviews = fimage;
      // store to firebase storage
      const storageRef = ref(storage, file.name);
      // upload the file and metadata
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      state.formData.logo = url;
    };

    const setBannerImage = async (file) => {
      if (!file) return;
      const fimage = file ? URL.createObjectURL(file) : undefined;
      // store to local state imagePrerviews
      state.bannerPreviews = fimage;
      // store to firebase storage
      const storageRef = ref(storage, file.name);
      // upload the file and metadata
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      state.formData.banner = url;
    };

    // open dialog
    const openDialog = async () => {
      state.isOpenDialog = true;
      const ref = await doc(db, "lembaga", state.defaultUID);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const data = docSnap.data();
        Object.keys(data).forEach((key) => {
          if (key === "logo") {
            state.imagePreviews = data[key];
            state.formData.logo = data[key];
          } else if (key === "banner") {
            state.bannerPreviews = data[key];
            state.formData.banner = data[key];
          } else if (key === "phone") {
            state.formData.phone = data[key];
          }
        });
      }
    };

    const handleUpdate = async () => {
      v$.value.$touch();
      if (!v$?.value?.$invalid) {
        try {
          const { logo, phone, banner } = state.formData;
          const ref = doc(db, "lembaga", state.defaultUID);
          await updateDoc(ref, {
            logo: logo,
            phone: phone,
            modifiedAt: Timestamp.now(),
            banner: banner,
          });
          state.isOpenDialog = false;
          if (!window.alert("Success Update Lembaga")) {
            window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    const onClose = () => {
      state.isSelectClose = true;
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

    return {
      ...toRefs(state),
      vuetify,
      handleLogout,
      openDialog,
      setImagePreviews,
      setBannerImage,
      handleUpdate,
      onClose,
      phoneErrors,
      v$,
    };
  },
};
</script>

<style scoped>
.iconClose {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 0 1em 0 1em;
}
.content {
  /* flex-grow: 1;
  height: 100vh; */
  padding: 0 8em !important;
}
.img {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
