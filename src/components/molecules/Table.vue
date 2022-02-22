<template>
  <v-data-table :headers="headers" :items="data" class="elevation-1 mt-15">
    <template v-slot:top>
      <v-toolbar flat>
        <div class="">
          <v-row align="center" class="mx-0">
            <v-col cols="8">
              <v-card
                class="mt-n16 d-flex align-center justify-center"
                rounded="lg"
                min-height="90px"
                max-width="100px"
                color="red accent-3"
              >
                <v-icon color="white" size="30px">{{ svgChart }}</v-icon>
              </v-card>
            </v-col>
            <v-col cols="4 mt-4">
              <p class="font-weight-regular subtitle-1">Funding Table</p>
            </v-col>
          </v-row>
        </div>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Create New Funding
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">data</span>
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
                      v-model="formData.total_funding"
                      outlined
                      label="Donation Target Amount"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      outlined
                      v-model="formData.desc"
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
              <v-btn color="blue darken-1" text @click="closeDialogCreateEdit">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialogDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="closeDialogDelete"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="openDialogCreateEdit(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="openDialogDelete(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { mdiChartBar } from "@mdi/js";
import { reactive, toRefs } from "@vue/composition-api";
export default {
  name: "TableComponent",
  setup() {
    const state = reactive({
      svgChart: mdiChartBar,
      dialog: false,
      dialogDelete: false,
      imagePreviews: "",
      formData: {
        title: "",
        desc: "",
        image: "",
        total_funding: 0,
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
          value: "collected",
        },
        {
          text: "Donation Target Amount",
          align: "start",
          sortable: false,
          value: "target",
        },
        {
          text: "Actions",
          sortable: false,
          value: "actions",
        },
      ],
      data: [
        {
          title: "lorem ipsum",
          collected: 150000,
          target: 350000,
        },
        {
          title: "lorem ipsum",
          collected: 150000,
          target: 350000,
        },
        {
          title: "lorem ipsum",
          collected: 150000,
          target: 350000,
        },
        {
          title: "lorem ipsum",
          collected: 150000,
          target: 350000,
        },
      ],
    });

    const openDialogCreateEdit = (item) => {
      state.dialog = true;
      console.log(item);
    };

    const openDialogDelete = (item) => {
      state.dialogDelete = true;
      console.log(item);
    };

    const closeDialogCreateEdit = () => {
      state.dialog = false;
    };

    const closeDialogDelete = () => {
      state.dialogDelete = false;
    };

    const setImagePreviews = (file) => {
      const setFile = file[0];
      const fimage = file ? URL.createObjectURL(setFile) : undefined;
      state.imagePreviews = fimage;
      state.formData.image = setFile;
    };

    return {
      ...toRefs(state),
      openDialogCreateEdit,
      openDialogDelete,
      closeDialogCreateEdit,
      closeDialogDelete,
      setImagePreviews,
    };
  },
};
</script>

<style></style>
