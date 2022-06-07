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
        <download-excel
          :data="data"
          :fields="json_fields"
          worksheet="My Worksheet"
          :name="namingExcel('history-donasi')"
        >
          <v-btn max-width="150" dark class="mb-2 mr-2" color="success">
            Export Excel
          </v-btn>
        </download-excel>
        <v-dialog
          persistent
          v-model="isOpenDialogCreateUpdate.open"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5" v-if="isOpenDialogCreateUpdate.id"
                >Update New Status Pembayaran</span
              >
              <span class="text-h5" v-else>Create New Data</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row no-gutters>
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      :items="items"
                      v-model="formData.status"
                      item-text="name"
                      item-value="value"
                      label="Status Pembayaran"
                      dense
                      outlined
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

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
      <v-icon small class="mr-2" @click="openDialogCreateEdit(item.historyDonasiUserUid)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="openDialogDelete(item)"> mdi-delete </v-icon>
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
  watch,
} from "@vue/composition-api";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  where,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
import formatRupiah from "@/utils/currency";
import convertStatusText from "@/utils/status";
import convertSecondToDate from "@/utils/date";
import namingExcel from "@/utils/excel";

export default {
  name: "TableComponent",
  setup() {
    const state = reactive({
      svgChart: mdiListStatus,
      imagePreviews: null,
      search: "",
      isDrawer: null,
      isOpenDialogCreateUpdate: {
        id: null,
        open: false,
      },
      isOpenDialogDelete: {
        id: null,
        uid: null,
        open: false,
      },
      formData: {
        status: null,
      },
      fundingData: {
        fundingId: null,
        collected: null,
        donasi: null,
        historyDonasiUserUid: null,
        uid: null,
      },
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "Email",
          align: "start",
          sortable: false,
          value: "email",
        },
        {
          text: "Title Donasi",
          align: "start",
          sortable: false,
          value: "title",
        },
        {
          text: "Donasi",
          align: "start",
          sortable: false,
          value: "donasi",
        },
        {
          text: "Status",
          align: "start",
          sortable: false,
          value: "status",
        },
        {
          text: "Date",
          align: "start",
          sortable: false,
          value: "date",
          width: 120,
        },
        {
          text: "Actions",
          sortable: false,
          value: "actions",
        },
      ],
      data: [],
      items: [
        { name: "Pending", value: 0 },
        { name: "Success", value: 1 },
      ],
      json_fields: {
        Name: "name",
        Email: "email",
        "Title Donasi": "title",
        Donasi: "donasi",
        Status: "status",
        Date: "date",
      },
    });

    const vuetify = getCurrentInstance().proxy.$vuetify;

    // open dialog
    const openDialogCreateEdit = async (id) => {
      state.isOpenDialogCreateUpdate.open = true;
      state.isOpenDialogCreateUpdate.id = id;
      const ref = await doc(db, "allDonasi", id);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const data = docSnap.data();
        Object.keys(data).forEach((key) => {
          const formData = state.formData;
          Object.keys(formData).forEach((key2) => {
            if (key === key2) {
              formData[key2] = {
                name: data[key] !== 0 ? "Success" : "Pending",
                value: data[key],
              };
            } else if (key === "fundingId") {
              state.fundingData.fundingId = data[key];
            } else if (key === "donasi") {
              state.fundingData.donasi = parseInt(data[key]);
            } else if (key === "historyDonasiUserUid") {
              state.fundingData.historyDonasiUserUid = data[key];
            } else if (key === "uid") {
              state.fundingData.uid = data[key];
            } else {
              null;
            }
          });
        });
      }
      getDataFunding();
    };

    const openDialogDelete = (data) => {
      const { uid, historyDonasiUserUid } = data;
      state.isOpenDialogDelete.open = true;
      state.isOpenDialogDelete.id = historyDonasiUserUid;
      state.isOpenDialogDelete.uid = uid;
    };

    // close dialog
    const closeDialogCreateEdit = () => {
      state.isOpenDialogCreateUpdate.open = false;
    };

    const closeDialogDelete = () => {
      state.isOpenDialogDelete.open = false;
    };

    const handleUpdate = async () => {
      try {
        const { fundingId, collected, donasi } = state.fundingData;
        const { status } = state.formData;
        const { historyDonasiUserUid, uid } = state.fundingData;
        // update data funding
        if (status === 1) {
          const refFunding = doc(db, "funding", fundingId);
          await updateDoc(refFunding, {
            currently_collected: collected + donasi,
          });
        }
        // update data all donasi
        const ref = doc(db, "allDonasi", state.isOpenDialogCreateUpdate.id);
        await updateDoc(ref, {
          status: status,
          modifiedAt: Timestamp.now(),
        });
        // update data historyDonasiUser
        const historyRef = doc(
          db,
          "historyDonasi",
          uid,
          "historyDonasiUser",
          historyDonasiUserUid
        );
        await updateDoc(historyRef, {
          status: status,
          modifiedAt: Timestamp.now(),
        });
        state.isOpenDialogCreateUpdate.open = false;
        if (!window.alert("Success Update History")) {
          window.location.reload();
        }
        window.location.reload();
      } catch (error) {
        window.alert("Error Update History");
        console.log(error);
      }
    };

    const handleDelete = async () => {
      try {
        const { isOpenDialogDelete } = state;
        const ref = doc(db, "allDonasi", isOpenDialogDelete.id);
        const historyRef = doc(
          db,
          "historyDonasi",
          isOpenDialogDelete.uid,
          "historyDonasiUser",
          isOpenDialogDelete.id
        );
        await deleteDoc(ref);
        await deleteDoc(historyRef);
        isOpenDialogDelete.open = false;
        if (!window.alert("Success Delete History")) {
          window.location.reload();
        }
      } catch (error) {
        window.alert("Error Delete History");
        console.log(error);
      }
    };

    const getDataFromFirestore = async () => {
      const q = query(
        collection(db, "allDonasi"),
        where("createdAt", "<=", new Date())
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        state.data.push({
          ...doc.data(),
          // id: doc.id,
          donasi: `Rp. ${formatRupiah(doc.data().donasi)}`,
          status: convertStatusText(doc.data().status),
          date: convertSecondToDate(doc.data().createdAt.seconds),
        });
      });
    };

    const getDataFunding = async () => {
      const { fundingId } = state.fundingData;
      const ref = doc(db, "funding", fundingId);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const { currently_collected } = docSnap.data();
        state.fundingData.collected = currently_collected; //store data currently_collected
      }
    };

    watch(vuetify, () => {
      if (vuetify.breakpoint.mdAndDown) {
        state.isDrawer = true;
      } else {
        state.isDrawer = false;
      }
    });

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
      handleUpdate,
      handleDelete,
      namingExcel,
    };
  },
};
</script>

<style></style>
