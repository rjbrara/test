<template>
  <v-data-table :headers="headers" :items="data" class="elevation-1 mt-15">
    <template v-slot:top>
      <v-toolbar flat>
        <v-card
          class="mt-n16 d-flex align-center justify-center"
          rounded="lg"
          min-height="90px"
          min-width="100px"
          color="red accent-3"
        >
          <v-icon color="white" size="35px">{{ svgChart }}</v-icon>
        </v-card>
        <v-spacer></v-spacer>
        <v-dialog v-model="isOpenDialogCreateUpdate.open" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Create New Funding
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5" v-if="isOpenDialogCreateUpdate.id"
                >Update New Data</span
              >
              <span class="text-h5" v-else>Create New Data</span>
              {{ isOpenDialogCreateUpdate.id }}
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row no-gutters>
                  <v-col cols="12" sm="12" md="12" class="mb-5">
                    <v-img
                      :src="imagePreviews"
                      contain
                      alt="image preview"
                      v-if="imagePreviews"
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
                      @change="setImagePreviews"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="formData.title"
                      outlined
                      label="Title Funding"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="formData.target_funding"
                      outlined
                      label="Donation Target Amount"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      outlined
                      v-model="formData.description"
                      name="input-7-4"
                      label="Description"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialogCreateEdit">
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
                @click.prevent="handleUpdate"
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
import { mdiChartBar } from "@mdi/js";
import { onMounted, reactive, toRefs } from "@vue/composition-api";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";

export default {
  name: "TableComponent",
  setup() {
    const state = reactive({
      svgChart: mdiChartBar,
      imagePreviews: null,
      isOpenDialogCreateUpdate: {
        id: null,
        open: false,
      },
      isOpenDialogDelete: {
        id: null,
        open: false,
      },
      formData: {
        title: "",
        description: "",
        image: "",
        target_funding: 0,
        currently_collected: 0,
      },
      headers: [
        {
          text: "Title Funding",
          align: "start",
          sortable: false,
          value: "title",
        },
        {
          text: "Collected Donations",
          align: "start",
          sortable: false,
          value: "currently_collected",
        },
        {
          text: "Donation Target Amount",
          align: "start",
          sortable: false,
          value: "target_funding",
        },
        {
          text: "Actions",
          sortable: false,
          value: "actions",
        },
      ],
      data: [],
    });

    // open dialog
    const openDialogCreateEdit = async (id) => {
      state.isOpenDialogCreateUpdate.open = true;
      state.isOpenDialogCreateUpdate.id = id;
      const ref = await doc(db, "funding", id);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const data = docSnap.data();
        Object.keys(data).forEach((key) => {
          const formData = state.formData;
          Object.keys(formData).forEach((key2) => {
            if (key === key2) formData[key2] = data[key];
          });
        });
      }
    };

    const openDialogDelete = (id) => {
      state.isOpenDialogDelete.open = true;
      state.isOpenDialogDelete.id = id;
    };

    // close dialog
    const closeDialogCreateEdit = () => {
      state.isOpenDialogCreateUpdate.open = false;
    };

    const closeDialogDelete = () => {
      state.isOpenDialogDelete = false;
    };

    const setImagePreviews = (file) => {
      if (!file) return;
      const setFile = file[0];
      const fimage = file ? URL.createObjectURL(setFile) : undefined;
      // store to local state imagePrerviews
      state.imagePreviews = fimage;
      // store to firebase storage
      const storageRef = ref(storage, setFile.name);
      const uploadTask = uploadBytesResumable(storageRef, setFile.name);
      console.log(uploadTask);
      // uploadTask.resume();
      // store to local state file url
      getDownloadURL(uploadTask?.snapshot?.ref)
        .then((downloadUrl) => (state.formData.image = downloadUrl))
        .catch((err) => console.log(err));
    };

    const handleSubmit = async () => {
      console.log("click add");
      // destructuring array
      const { title, image, currently_collected, description, target_funding } =
        state.formData;
      try {
        // store data
        await addDoc(collection(db, "funding"), {
          image: image,
          title: title,
          target_funding: target_funding,
          currently_collected: currently_collected,
          description: description,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const handleUpdate = async () => {
      console.log("click update");
      try {
        // update data
        const {
          title,
          image,
          currently_collected,
          description,
          target_funding,
        } = state.formData;

        const ref = doc(db, "funding", state.isOpenDialogCreateUpdate.id);
        await updateDoc(ref, {
          image: image,
          title: title,
          target_funding: target_funding,
          currently_collected: currently_collected,
          description: description,
        });
        state.isOpenDialogCreateUpdate.open = false;
      } catch (error) {
        console.log(error);
      }
    };

    const handleDelete = async () => {
      try {
        const ref = doc(db, "funding", state.isOpenDialogDelete.id);
        await deleteDoc(ref);
        state.isOpenDialogDelete.open = false;
      } catch (error) {
        console.log(error);
      }
    };

    const getDataFromFirestore = async () => {
      const querySnapshot = await getDocs(collection(db, "funding"));
      querySnapshot.forEach((doc) =>
        state.data.push({ ...doc.data(), id: doc.id })
      );
    };
    onMounted(() => {
      getDataFromFirestore();
    });

    return {
      ...toRefs(state),
      openDialogCreateEdit,
      openDialogDelete,
      closeDialogCreateEdit,
      closeDialogDelete,
      setImagePreviews,
      handleSubmit,
      handleUpdate,
      handleDelete,
    };
  },
};
</script>

<style></style>
