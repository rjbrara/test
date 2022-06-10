<template>
  <v-data-table
    :headers="headers"
    :items="data"
    class="elevation-1 mt-10"
    :items-per-page="5"
    :search="search"
  >
    <template v-slot:[`item.isVerified`]="{ item }">
      <v-chip class="ma-2" text-color="#FFFFFF" :color="getColor(item.isVerified)">
        {{ getName(item.isVerified) }}
      </v-chip>
    </template>
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
import { doc, deleteDoc } from "@firebase/firestore";
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
          value: "name",
        },
        {
          text: "Email",
          align: "start",
          value: "email",
        },
        {
          text: "Email Verified",
          align: "start",
          value: "isVerified",
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
      // const ref = await collection(db, "users");
      // const querySnapshot = await getDocs(ref);
      // querySnapshot.forEach((doc) => {
      //   state.data.push(doc.data());
      // });
      const superAdminUid = "hWKIxge4iyPRLQDgFlisypRBzrx2";
      fetch("https://server-crowdfunding.vercel.app/api/users", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((result) => {
          result.data
            .filter((doc) => doc.uid !== superAdminUid)
            .map((user) => {
              state.data.push(user);
            });
        })
        .catch((err) => console.log(err));
    };

    const handleDelete = async () => {
      const { isOpenDialogDelete } = state;
      // delete user firestore
      const ref = doc(db, "users", isOpenDialogDelete.id);
      deleteDoc(ref);
      // delete user auth
      fetch(
        `https://server-crowdfunding.vercel.app/api/delete-user/${state.isOpenDialogDelete.id}`,
        {
          method: "DELETE",
        }
      )
        .then((res) => res.json())
        .then(() => {
          isOpenDialogDelete.open = false;
          if (!window.alert("Success Delete User")) {
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
          window.alert("Error Delete User");
        });
    };

    const getColor = (data) => {
      return `${data ? "primary" : "red"}`
    }

    const getName = (data) => {
      return `${data ? "Sudah Verified" : "Belum Verified"}`
    }

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
      getColor,
      getName,
      vuetify,
    };
  },
};
</script>

<style></style>
