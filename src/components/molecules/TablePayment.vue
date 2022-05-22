<template>
  <v-data-table
    :headers="headers"
    :items="data"
    class="elevation-1 mt-10"
    :items-per-page="5"
    :search="search"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-row
          align-items="center"
          justify-sm="space-around"
          justify-lg="start"
        >
          <v-col cols="2" v-if="!isDrawer">
            <v-card
              class="mt-n10 d-flex align-center justify-center"
              rounded="lg"
              min-height="90px"
              min-width="90px"
              color="red accent-3"
            >
              <v-icon color="white" size="35px">{{ svgChart }}</v-icon>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="8" class="mt-5">
            <v-text-field
              v-model="search"
              label="Search..."
              class="mx-4"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <v-dialog
          persistent
          v-model="isOpenDialogCreateUpdate.open"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="vuetify.breakpoint.xs"
              color="primary"
              x-small
              max-width="100"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Create Payment
            </v-btn>
            <v-btn
              v-else
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Create Payment
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5" v-if="isOpenDialogCreateUpdate.id"
                >Update New Data</span
              >
              <span class="text-h5" v-else>Create New Data</span>
            </v-card-title>
            <v-container>
              <v-row no-gutters>
                <v-col class="mb-5 img" cols="12" sm="12" md="12">
                  <v-img
                    :src="qrcodePreviews"
                    max-height="200"
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
                    label="Input Qrcode"
                    @change="setQrcode"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="formData.name"
                    outlined
                    label="Payment Name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="formData.noRek"
                    outlined
                    label="No Rekening"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="closeDialogCreateEdit">
                Cancel
              </v-btn>
              <v-btn
                v-if="isOpenDialogCreateUpdate.id"
                color="blue darken-1"
                text
                @click.prevent="handleUpdate"
              >
                Update
              </v-btn>
              <v-btn
                v-else
                color="blue darken-1"
                text
                @click.prevent="handleCreate"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="isOpenDialogDelete.open" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialogDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="handleDelete"
                >Delete</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="openDialogCreateEdit(item.id)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="openDialogDelete(item.id)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </template>
  </v-data-table>
</template>

<script>
import { mdiListStatus } from "@mdi/js";
import {
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs,
  //   watch,
} from "@vue/composition-api";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { db } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "@/firebase";
import generateUID from "@/utils/uid";

export default {
  name: "TablePayment",
  setup() {
    const state = reactive({
      svgChart: mdiListStatus,
      search: "",
      isDrawer: null,
      qrcodePreviews: null,
      defaultUID: "3ngAnqg3AwKi7DTM3yeD",
      isOpenDialogCreateUpdate: {
        id: null,
        open: false,
      },
      isOpenDialogDelete: {
        id: null,
        open: false,
      },
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "No Rekening",
          align: "start",
          sortable: false,
          value: "noRek",
        },
        {
          text: "Actions",
          sortable: false,
          value: "actions",
        },
      ],
      data: [],
      formData: {
        id: generateUID(),
        name: null,
        noRek: null,
        qrcode: null,
      },
    });

    const vuetify = getCurrentInstance().proxy.$vuetify;

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
    const openDialogCreateEdit = async (id) => {
      const { isOpenDialogCreateUpdate, formData, data } = state;
      isOpenDialogCreateUpdate.open = true;
      isOpenDialogCreateUpdate.id = id;
      const newData = data.filter((item) => item.id === id);
      Object.keys(newData[0]).forEach((key) => {
        Object.keys(formData).forEach((key2) => {
          if (key === key2) {
            formData[key2] = newData[0][key];
          } else if (key === "qrcode") {
            state.qrcodePreviews = newData[0][key];
          }
        });
      });
    };
    const openDialogDelete = (id) => {
      state.isOpenDialogDelete.open = true;
      state.isOpenDialogDelete.id = id;
    };

    // close dialog
    const closeDialogCreateEdit = () => {
      // reset state
      state.isOpenDialogCreateUpdate = {
        id: null,
        open: false,
      };
      state.formData = {
        id: generateUID(),
        name: null,
        noRek: null,
        qrcode: null,
      };
      state.qrcodePreviews = null;
    };

    const closeDialogDelete = () => {
      state.isOpenDialogDelete.open = false;
    };
    const getDataFromFirestore = async () => {
      const ref = await doc(db, "lembaga", state.defaultUID);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const data = docSnap.data();
        Object.keys(data).forEach((key) => {
          if (key === "payment") {
            state.data = data[key];
          }
        });
      }
    };

    const handleCreate = async () => {
      try {
        const { data, formData, defaultUID } = state;
        data.push(formData);
        const ref = doc(db, "lembaga", defaultUID);
        await updateDoc(ref, {
          payment: data,
        });
        state.isOpenDialogCreateUpdate.open = false;
      } catch (error) {
        console.log(error);
      }
    };

    const handleUpdate = async () => {
      try {
        const { data, isOpenDialogCreateUpdate, defaultUID } = state;
        const newData = data.findIndex(
          (payment) => payment.id === isOpenDialogCreateUpdate.id
        );
        data[newData] = state.formData;
        const ref = doc(db, "lembaga", defaultUID);
        await updateDoc(ref, {
          payment: data,
        });
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };

    const handleDelete = async () => {
      try {
        const { data, isOpenDialogDelete, defaultUID } = state;
        const newData = data
          .filter((item) => item.id !== isOpenDialogDelete.id)
          .map((item) => item);
        state.data = newData;
        const ref = doc(db, "lembaga", defaultUID);
        await updateDoc(ref, {
          payment: newData,
        });
        isOpenDialogDelete.open = false;
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(() => {
      getDataFromFirestore();
      if (vuetify.breakpoint.mdAndDown) {
        state.isDrawer = true;
      } else {
        state.isDrawer = false;
      }
    });

    return {
      ...toRefs(state),
      openDialogCreateEdit,
      openDialogDelete,
      closeDialogCreateEdit,
      closeDialogDelete,
      handleCreate,
      handleUpdate,
      handleDelete,
      setQrcode,
      vuetify,
    };
  },
};
</script>

<style>
.img {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
