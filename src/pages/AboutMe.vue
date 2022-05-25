<template>
  <DashboardLayout title="About Me">
    <template v-slot:child>
      <div class="wrap">
        <div>
          <span>Tentang Lembaga</span>
          <div class="editor">
            <VueEditor
              id="editor1"
              v-model="about"
              :editorToolbar="customToolbar"
            />
          </div>
        </div>
        <div>
          <span>Syarat dan Ketentuan</span>
          <div class="editor">
            <VueEditor
              id="editor2"
              v-model="syaratKetentuan"
              :editorToolbar="customToolbar"
            />
          </div>
        </div>
        <v-btn color="primary" @click.prevent="onSubmit">Save</v-btn>
      </div>
    </template>
  </DashboardLayout>
</template>

<script>
import {
  onMounted,
  reactive,
  toRefs,
  //   watch,
} from "@vue/composition-api";
import DashboardLayout from "@/templates/DashboardLayout.vue";
import { VueEditor } from "vue2-editor";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "AboutMePage",
  components: {
    DashboardLayout,
    VueEditor,
  },
  setup() {
    const state = reactive({
      about: null,
      syaratKetentuan: null,
      defaultUID: "3ngAnqg3AwKi7DTM3yeD",
      customToolbar: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block", "link", "image"],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction

        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
      ],
    });

    const onSubmit = async () => {
      // console.log(state.syaratKetentuan);
      try {
        const { syaratKetentuan, about, defaultUID } = state;
        const ref = doc(db, "lembaga", defaultUID);
        await updateDoc(ref, {
          about: about,
          syaratKetentuan: syaratKetentuan,
        });
        if (!window.alert("Success Update About")) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
        window.alert("Error Update About");
      }
    };

    const getDataFromFirestore = async () => {
      const ref = await doc(db, "lembaga", state.defaultUID);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const data = docSnap.data();
        Object.keys(data).forEach((key) => {
          if (key === "about") {
            state.about = data[key];
          } else if (key === "syaratKetentuan") {
            state.syaratKetentuan = data[key];
          }
        });
      }
    };

    // const handleImageAdded = (file, Editor, cursorLocation, resetUploader) => {
    //   console.table([file, Editor, cursorLocation, resetUploader]);
    //   // Editor.insertEmbed(cursorLocation, "image", url);
    //   // resetUploader();
    // };

    onMounted(() => {
      getDataFromFirestore();
    });

    return {
      ...toRefs(state),
      onSubmit,
      // handleImageAdded,
    };
  },
};
</script>

<style scoped>
.editor {
  margin-top: 1rem;
}
.label {
  margin-top: 1rem !important;
}
.wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  gap: 15px;
}
</style>
