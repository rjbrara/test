<template>
  <v-data-table
    :headers="headers"
    :items="data"
    class="elevation-1 mt-10"
    :items-per-page="5"
    :search="search"
  >
    <template v-slot:[`item.isActive`]="{ item }">
      <v-chip
        class="ma-2"
        text-color="#FFFFFF"
        :color="getColor(item.isActive)"
      >
        {{ getName(item.isActive) }}
      </v-chip>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-row
          align-items="center"
          justify-sm="space-around"
          justify-lg="start"
        >
          <v-col v-if="!isDrawer" cols="2">
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
          <v-col cols="12" xs="12" sm="12" md="12" lg="8" class="mt-5 ml-2">
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
              Create Funding
            </v-btn>
            <v-btn
              v-else
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Create Funding
            </v-btn>
            <download-excel
              :data="data"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="namingExcel('funding')"
            >
              <v-btn max-width="150" dark class="mb-2 mr-2" color="success">
                Export Excel
              </v-btn>
            </download-excel>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5" v-if="isOpenDialogCreateUpdate.id"
                >Update Data Funding</span
              >
              <span class="text-h5" v-else>Create New Data Funding</span>
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
                      :error-messages="titleErrors"
                      @input="v$.formData.title.$touch()"
                      @blur="v$.formData.title.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="formData.target_funding"
                      outlined
                      label="Donation Target Amount"
                      type="number"
                      :error-messages="targetFundingErrors"
                      @input="v$.formData.target_funding.$touch()"
                      @blur="v$.formData.target_funding.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      outlined
                      v-model="formData.description"
                      name="input-7-4"
                      label="Description"
                      :error-messages="descErrors"
                      @input="v$.formData.description.$touch()"
                      @blur="v$.formData.description.$touch()"
                    ></v-textarea>
                  </v-col>
                  <v-col col="12" sm="12" md="12">
                    <v-switch
                      v-model="formData.isActive"
                      label="isActive"
                    ></v-switch>
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
              <v-btn
                v-else
                color="blue darken-1"
                text
                @click.prevent="handleSubmit"
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
  computed,
  onMounted,
  reactive,
  toRefs,
  watch,
} from "@vue/composition-api";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  where,
  query,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { required, minLength, maxLength, numeric } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import formatRupiah from "@/utils/currency";
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
        open: false,
      },
      formData: {
        title: "",
        description: "",
        image: "",
        target_funding: 0,
        currently_collected: 0,
        isActive: false,
      },
      headers: [
        {
          text: "Title Funding",
          align: "start",
          value: "title",
        },
        {
          text: "Collected Donations",
          align: "start",
          width: 200,
          value: "currently_collected",
        },
        {
          text: "Donation Target Amount",
          align: "start",
          width: 200,
          value: "target_funding",
        },
        {
          text: "Active",
          align: "start",
          value: "isActive",
        },
        {
          text: "Actions",
          sortable: false,
          value: "actions",
        },
      ],
      data: [],
      json_fields: {
        "Title Funding": "title",
        "Collected Donations": "currently_collected",
        "Donation Target Amount": "target_funding",
      },
    });

    const formDataRules = {
      formData: {
        title: {
          required,
          minLength: minLength(5),
          maxLength: maxLength(50),
        },
        target_funding: {
          required,
          numeric,
        },
        description: {
          required,
          minLength: minLength(10),
        },
      },
    };

    const v$ = useVuelidate(formDataRules, state);
    const vuetify = getCurrentInstance().proxy.$vuetify;

    const titleErrors = computed(() => {
      const errors = [];
      v$?.value?.$errors.filter((err) => {
        if (
          (err?.$validator === "required" ||
            err?.$validator === "minLength" ||
            err?.$validator === "maxLength") &&
          err?.$property === "title"
        ) {
          errors.push(err?.$message);
        }
      });
      return errors;
    });

    const targetFundingErrors = computed(() => {
      const errors = [];
      v$?.value?.$errors.filter((err) => {
        if (
          (err?.$validator === "required" || err?.$validator === "numeric") &&
          err?.$property === "target_funding"
        ) {
          errors.push(err?.$message);
        }
      });
      return errors;
    });

    const descErrors = computed(() => {
      const errors = [];
      v$?.value?.$errors.filter((err) => {
        if (
          (err?.$validator === "required" || err?.$validator === "minLength") &&
          err?.$property === "description"
        ) {
          errors.push(err?.$message);
        }
      });
      return errors;
    });

    watch(vuetify, () => {
      if (vuetify.breakpoint.mdAndDown) {
        state.isDrawer = true;
      } else {
        state.isDrawer = false;
      }
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
            if (key === key2) {
              formData[key2] = data[key];
            } else if (key === "image") {
              state.imagePreviews = data[key];
            }
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
      state.isOpenDialogCreateUpdate = {
        id: null,
        open: false,
      };
      state.imagePreviews = null;
      state.formData = {
        title: "",
        description: "",
        image: "",
        target_funding: 0,
        currently_collected: 0,
        isActive: false,
      };
    };

    const closeDialogDelete = () => {
      state.isOpenDialogDelete.open = false;
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
      state.formData.image = url;
    };

    const handleSubmit = async () => {
      v$.value.$touch();
      if (!v$?.value?.$invalid) {
        // destructuring array
        const {
          title,
          image,
          currently_collected,
          description,
          target_funding,
          isActive,
        } = state.formData;
        try {
          // store data
          await addDoc(collection(db, "funding"), {
            image: image,
            title: title,
            target_funding: target_funding,
            currently_collected: currently_collected,
            description: description,
            isActive: isActive,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
          });
          state.isOpenDialogCreateUpdate.open = false;
          if (!window.alert("Success Create Funding")) {
            window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    const handleUpdate = async () => {
      v$.value.$touch();
      if (!v$?.value?.$invalid) {
        try {
          // update data
          const {
            title,
            image,
            currently_collected,
            description,
            target_funding,
            isActive,
          } = state.formData;

          const ref = doc(db, "funding", state.isOpenDialogCreateUpdate.id);
          await updateDoc(ref, {
            image: image,
            title: title,
            target_funding: target_funding,
            currently_collected: currently_collected,
            description: description,
            isActive: isActive,
            modifiedAt: Timestamp.now(),
          });
          state.isOpenDialogCreateUpdate.open = false;
          if (!window.alert("Success Update Funding")) {
            window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    const handleDelete = async () => {
      try {
        const ref = doc(db, "funding", state.isOpenDialogDelete.id);
        await deleteDoc(ref);
        state.isOpenDialogDelete.open = false;
        if (!window.alert("Success Delete Funding")) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getDataFromFirestore = async () => {
      const q = query(
        collection(db, "funding"),
        where("createdAt", "<=", new Date())
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) =>
        state.data.push({
          ...doc.data(),
          id: doc.id,
          currently_collected: `Rp. ${formatRupiah(
            doc.data().currently_collected
          )}`,
          target_funding: `Rp. ${formatRupiah(doc.data().target_funding)}`,
        })
      );
    };

    const getColor = (data) => {
      return `${data ? "primary" : "red"}`;
    };

    const getName = (data) => {
      return `${data ? "Active" : "Inactive"}`;
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
      setImagePreviews,
      handleSubmit,
      handleUpdate,
      handleDelete,
      titleErrors,
      targetFundingErrors,
      descErrors,
      namingExcel,
      getName,
      getColor,
      v$,
      vuetify,
    };
  },
};
</script>

<style></style>
