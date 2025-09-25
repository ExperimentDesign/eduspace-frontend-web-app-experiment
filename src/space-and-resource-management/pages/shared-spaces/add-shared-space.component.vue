<script>
import http from "../../../shared/services/http-common.js";
import SharedSpaceCreateAndEdit from "../../components/shared-spaces/shared-space-create-and-edit.component.vue";

export default {
  name: "add-shared-space",
  components: { SharedSpaceCreateAndEdit },
  data() {
    return {
      shared_space: {
        name: "",
        capacity: 0,
        description: "",
      },
    };
  },
  methods: {
    async saveSharedSpace(shared_space) {
      try {
        const response = await http.post("/shared-area", shared_space); // Hacer la llamada POST
        console.log("Shared Space saved:", response.data);
        this.$router.push(
          "/dashboard-admin/classrooms-shared-spaces/shared-spaces"
        );
      } catch (error) {
        console.error("Error saving shared space:", error);
      }
    },
    cancel() {
      this.$router.push(
        "/dashboard-admin/classrooms-shared-spaces/shared-spaces"
      );
    },
  },
};
</script>

<template>
  <shared-space-create-and-edit
    :shared_space="shared_space"
    :isCreateMode="true"
    @save="saveSharedSpace"
    @cancel="cancel"
  />
</template>

<style scoped></style>
