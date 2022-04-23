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
      height="100vh"
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
              Lembaga
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
                    multiple
                    prepend-icon=""
                    accept="image/png, image/jpeg, image/bmp"
                    label="Input image"
                    @change="setImagePreviews"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="formData.noRek"
                    outlined
                    label="No Rekening"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="formData.payment"
                    :items="items"
                    label="Select Item"
                    multiple
                    chips
                    outlined
                    :menu-props="{
                      closeOnContentClick: isSelectClose,
                    }"
                  >
                    <template v-slot:prepend-item>
                      <v-list-item-action class="iconClose">
                        <v-icon @click="onClose">{{ svgClose }}</v-icon>
                      </v-list-item-action>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-col class="mb-5 img" cols="12" sm="12" md="12">
                  <v-img
                    :src="qrcodePreviews"
                    max-height="161"
                    max-width="280"
                    alt="qrcode preview"
                    v-if="qrcodePreviews"
                  ></v-img>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-file-input
                    small-chips
                    multiple
                    outlined
                    prepend-icon=""
                    accept="image/png, image/jpeg, image/bmp"
                    label="Input image"
                    @change="setQrcode"
                  ></v-file-input>
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
} from "@vue/composition-api";
import { mdiExitToApp, mdiWrench, mdiClose } from "@mdi/js";
import { ListItem } from "@/components";
import { removeToken } from "@/constans";
import { signOut } from "@firebase/auth";
import { auth, db } from "@/firebase";
import router from "@/router";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "@/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "@firebase/firestore";

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
      qrcodePreviews: null,
      defaultUID: "3ngAnqg3AwKi7DTM3yeD",
      formData: {
        logo: null,
        noRek: null,
        payment: [],
        qrcode: null,
      },
      items: [
        "QRIS (OVO, GOPAY, LINK AJA)",
        "Transfer Bank Syariah Indonesia",
        "Transfer Bank DKI Syariah",
        "Transfer Bank BCA",
        "Transfer Bank Mandiri",
        "Transfer Bank Danamon",
        "Transfer Bank Permata Bank",
      ],
    });

    const vuetify = getCurrentInstance().proxy.$vuetify;

    const handleLogout = () => {
      signOut(auth).then(() => {
        removeToken("token");
        router.push("/signin");
      });
    };

    const setImagePreviews = async (file) => {
      if (!file) return;
      const setFile = file[0];
      const fimage = file ? URL.createObjectURL(setFile) : undefined;
      // store to local state imagePrerviews
      state.imagePreviews = fimage;
      // store to firebase storage
      const storageRef = ref(storage, setFile.name);
      // upload the file and metadata
      await uploadBytes(storageRef, setFile);
      const url = await getDownloadURL(storageRef);
      state.formData.logo = url;
    };

    const setQrcode = async (file) => {
      if (!file) return;
      const setFile = file[0];
      const fimage = file ? URL.createObjectURL(setFile) : undefined;
      // store to local state imagePrerviews
      state.qrcodePreviews = fimage;
      // store to firebase storage
      const storageRef = ref(storage, setFile.name);
      // upload the file and metadata
      await uploadBytes(storageRef, setFile);
      const url = await getDownloadURL(storageRef);
      state.formData.qrcode = url;
    };

    // open dialog
    const openDialog = async () => {
      state.isOpenDialog = true;
      const ref = await doc(db, "lembaga", state.defaultUID);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const data = docSnap.data();
        Object.keys(data).forEach((key) => {
          const formData = state.formData;
          Object.keys(formData).forEach((key2) => {
            if (key === key2) {
              formData[key2] = data[key];
            } else if (key === "logo") {
              state.imagePreviews = data[key];
            } else if (key === "qrcode") {
              state.qrcodePreviews = data[key];
            }
          });
        });
      }
    };

    const handleUpdate = async () => {
      try {
        const { noRek, logo, payment, qrcode } = state.formData;
        const ref = doc(db, "lembaga", state.defaultUID);
        await updateDoc(ref, {
          logo: logo,
          noRek: noRek,
          modifiedAt: Timestamp.now(),
          payment: payment,
          qrcode: qrcode,
        });
        state.isOpenDialog = false;
      } catch (error) {
        console.log(error);
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
      setQrcode,
      handleUpdate,
      onClose,
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
