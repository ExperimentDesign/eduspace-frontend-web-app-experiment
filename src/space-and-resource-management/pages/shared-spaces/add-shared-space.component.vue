<script>
import { SharedAreaService } from "../../services/shared-area.service.js";
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
      sharedAreaService: new SharedAreaService(),
    };
  },
  methods: {
    async saveSharedSpace(shared_space_data) {
      try {
        await this.sharedAreaService.create(shared_space_data);
        alert("Shared area created successfully.");
        this.$router.push("/dashboard-admin/classrooms-shared-spaces/shared-spaces");
      } catch (error) {
        console.error("Error creating the shared area:", error);
        alert("Could not create the shared area.");
      }
    },
    cancel() {
      this.$router.push("/dashboard-admin/classrooms-shared-spaces/shared-spaces");
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