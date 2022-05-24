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
      </v-toolbar>
      <v-dialog v-model="isOpenDialogDelete.open" max-width="500px">
        <v-card>
          <v-card-title class="text-h5"
            >Are you sure you want to delete this user?</v-card-title
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
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small @click="openDialogDelete(item.uid)"> mdi-delete </v-icon>
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
} from "@vue/composition-api";
import { collection, getDocs, doc, deleteDoc } from "@firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "TablePayment",
  setup() {
    const state = reactive({
      svgChart: mdiListStatus,
      search: "",
      isDrawer: null,
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
          text: "Email",
          align: "start",
          sortable: false,
          value: "email",
        },
        {
          text: "Actions",
          sortable: false,
          value: "actions",
          align: "center",
        },
      ],
      data: [],
    });

    const vuetify = getCurrentInstance().proxy.$vuetify;

    const openDialogDelete = (id) => {
      state.isOpenDialogDelete.open = true;
      state.isOpenDialogDelete.id = id;
    };

    const closeDialogDelete = () => {
      state.isOpenDialogDelete.open = false;
    };

    const getDataFromFirestore = async () => {
      const ref = await collection(db, "users");
      const querySnapshot = await getDocs(ref);
      querySnapshot.forEach((doc) => {
        state.data.push(doc.data());
      });
    };

    const handleDelete = async () => {
      try {
        const { data, isOpenDialogDelete } = state;
        // delete user auth
        fetch(
          `https://server-crowdfunding.vercel.app/api/delete-user/${state.isOpenDialogDelete.id}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.status === 200) {
              const newData = data
                .filter((item) => item.id !== isOpenDialogDelete.id)
                .map((item) => item);
              state.data = newData;
              // delete user firestore
              const ref = doc(db, "users", isOpenDialogDelete.id);
              deleteDoc(ref);
              window.alert(res.message);
              isOpenDialogDelete.open = false;
            } else {
              window.alert(res.message);
              isOpenDialogDelete.open = false;
            }
          })
          .catch((err) => {
            console.log(err);
            window.alert("Error Delete User");
          });
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
      openDialogDelete,
      closeDialogDelete,
      handleDelete,
      vuetify,
    };
  },
};
</script>

<style></style>
