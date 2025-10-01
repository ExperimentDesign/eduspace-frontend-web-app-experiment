<script>
import { ResourceService } from "../../services/resource.service.js";
import ResourceCreateAndEdit from "../../components/resources/resource-create-and-edit.component.vue";

export default {
  name: "add-resource",
  components: { ResourceCreateAndEdit },
  data() {
    return {
      resource: {
        name: '',
        kindOfResource: '',
        classroomId: null,
      },
      resourceService: new ResourceService(),
    };
  },
  methods: {
    async saveResource(resourceData) {
      try {
        const payload = {
          name: resourceData.name,
          kindOfResource: resourceData.kindOfResource
        };
        await this.resourceService.create(resourceData.classroomId, payload);
        alert("Resource created successfully.");
        this.$router.push("/dashboard-admin/classrooms-shared-spaces/resources");
      } catch (error) {
        console.error("Error creating resource:", error);
      }
    },
    cancel() {
      this.$router.push("/dashboard-admin/classrooms-shared-spaces/resources");
    },
  },
};
</script>

<template>
  <resource-create-and-edit
      :resource="resource"
      :isCreateMode="true"
      @save="saveResource"
      @cancel="cancel"
  />
</template>