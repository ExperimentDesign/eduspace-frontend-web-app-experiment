<script>
import { ResourceService } from "../../services/resource.service.js";
import { ClassroomService } from "../../services/classroom.service.js";
import ResourceCard from "../../components/resources/resource-card.component.vue";

export default {
  name: "resource-list",
  components: { ResourceCard },
  data() {
    return {
      resources: [],
      classrooms: [],
      selectedClassroomId: null,
      resourceService: new ResourceService(),
      classroomService: new ClassroomService(),
    };
  },
  async created() {
    try {
      const response = await this.classroomService.getAll();
      this.classrooms = response.data;
    } catch (error) {
      console.error("Error loading classrooms:", error);
    }
  },
  methods: {
    async loadResources() {
      if (!this.selectedClassroomId) {
        this.resources = [];
        return;
      }
      try {
        const response = await this.resourceService.getAllByClassroomId(this.selectedClassroomId);
        this.resources = response.data;
      } catch (error) {
        console.error("Error loading resources:", error);
      }
    },
    async deleteResource(resource) {
      try {
        await this.resourceService.delete(resource.classroom.id, resource.id);
        this.resources = this.resources.filter(res => res.id !== resource.id);
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    },
    editResource(resource) {
      this.$router.push({ name: "edit-resource", params: { classroomId: resource.classroom.id, resourceId: resource.id } });
    },
    goToAdd() {
      this.$router.push({ name: "add-resource" });
    },
  },
};
</script>

<template>
  <div class="breadcrumb">
    <h4>Resources Management</h4>
  </div>

  <div class="selection-and-add-container">
    <div class="selection-field">
      <label for="classroom-select">Select a Classroom to see its Resources:</label>
      <pv-select
          id="classroom-select"
          v-model="selectedClassroomId"
          :options="classrooms"
          optionLabel="name"
          optionValue="id"
          placeholder="Select a Classroom"
          class="w-full md:w-20rem"
          @change="loadResources"
      />
    </div>
    <pv-button label="Add New Resource" icon="pi pi-plus" severity="success" raised @click="goToAdd"/>
  </div>

  <div class="resources-display-area">
    <div class="cards-container">
      <p v-if="!selectedClassroomId" class="message">Please select a classroom to view resources.</p>
      <p v-else-if="resources.length === 0" class="message">No resources found for this classroom.</p>

      <resource-card
          v-else
          v-for="resource in resources"
          :key="resource.id"
          :resource="resource"
          @delete="deleteResource(resource)"
          @edit="editResource(resource)"
      />
    </div>
  </div>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.selection-and-add-container {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.selection-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 250px;
  flex-grow: 1;
}

.resources-display-area {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 20px;
}

.cards-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%;
}

.message {
  width: 100%;
  text-align: center;
  font-style: italic;
  color: #666;
  padding: 1rem;
}

</style>