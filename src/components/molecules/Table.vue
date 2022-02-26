<template>
  <v-data-table
    :headers="headers"
    :items="data"
    class="elevation-1 mt-15"
    :items-per-page="5"
    :search="search"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-row align-items="center">
          <v-col cols="2">
            <v-card
              class="mt-n10 d-flex align-center justify-center"
              rounded="lg"
              min-height="90px"
              min-width="100px"
              color="red accent-3"
            >
              <v-icon color="white" size="35px">{{ svgChart }}</v-icon>
            </v-card>
          </v-col>
          <v-col cols="8" class="mt-5">
            <v-text-field
              v-model="search"
              label="Search..."
              class="mx-4"
            ></v-text-field>
          </v-col>
        </v-row>
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
import { mdiChartBar } from "@mdi/js";
import { computed, onMounted, reactive, toRefs } from "@vue/composition-api";
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
import { required, minLength, maxLength, numeric } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  name: "TableComponent",
  setup() {
    const state = reactive({
      svgChart: mdiChartBar,
      imagePreviews: null,
      search: "",
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

    const formDataRules = {
      formData: {
        title: {
          required,
          minLength: minLength(5),
          maxLength: maxLength(30),
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
      console.table([state.formData, state.imagePreviews]);
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
      // create file metadata including the content type
      // const metadata = {
      //   contentType: setFile.type,
      // };
      // upload the file and metadata
      const uploadTask = uploadBytesResumable(
        storageRef,
        setFile.name
        // metadata
      );
      // store to local state file url
      // reference: https://firebase.google.com/docs/storage/web/upload-files?hl=id#upload_from_a_blob_or_file
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // bbserve state change events such as progress, pause, and resumed
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          // handle successful uploads on complete
          // for instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask?.snapshot?.ref)
            .then((downloadUrl) => {
              state.formData.image = downloadUrl;
              console.log(uploadTask?.snapshot?.ref);
            })
            .catch((err) => console.log(err));
        }
      );
    };

    const handleSubmit = async () => {
      if (!v$?.value?.$invalid) {
        // destructuring array
        const {
          title,
          image,
          currently_collected,
          description,
          target_funding,
        } = state.formData;
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
      }
    };

    const handleUpdate = async () => {
      if (!v$?.value?.$invalid) {
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
      titleErrors,
      targetFundingErrors,
      descErrors,
      v$,
    };
  },
};
</script>

<style></style>
