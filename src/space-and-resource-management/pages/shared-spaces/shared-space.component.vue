<script>
import http from "../../../shared/services/http-common.js";
import SharedSpaceCard from "../../components/shared-spaces/shared-space-card.component.vue";

export default {
  name: "sports-facilities",
  components: { SharedSpaceCard },
  data() {
    return {
      shared_spaces: [],
    };
  },
  mounted() {
    this.loadArea();
  },
  methods: {
    async loadArea() {
      try {
        const response = await http.get("/shared-area");
        this.shared_spaces = response.data;
      } catch (error) {
        console.error("Error loading spaces:", error);
      }
    },
    async deleteSharedSpaces(id) {
      try {
        await http.delete(`/shared-area/${id}`);
        this.shared_spaces = this.areas.filter(
          (shared_area) => shared_area.id !== id
        );
      } catch (error) {
        console.error("Error deleting space:", error);
      }
    },
    editSharedSpace(id) {
      this.$router.push({ name: "edit-space", params: { id } });
    },
    goToAdd() {
      this.$router.push(
        "/dashboard-admin/classrooms-shared-spaces/shared-spaces/add"
      );
    },
  },
};
</script>

<template>
  <div style="display: flex; align-items: center">
    <h4 style="margin-right: 20px">Classrooms and Shared Spaces</h4>
    <i class="pi pi-chevron-right"></i>
    <h4 style="margin-left: 20px">Shared Spaces</h4>
  </div>

  <div class="container">
    <!-- Card para Agregar nuevo space -->
    <div class="card border-round-xl shadow-2 p-3 h-full">
      <div class="text-xl font-semibold mb-2">Title</div>
      <div class="mb-2">
        <span class="font-medium text-600">Capacity:</span>
      </div>
      <div class="mb-2">
        <span class="font-medium text-600">Description:</span>
      </div>
      <div class="flex align-items-center gap-2 mb-3">
        <i class="pi pi-box text-yellow-500"></i>
        <span>Equipment</span>
      </div>
      <pv-button
        label="Add"
        severity="warning"
        text
        raised
        class="w-full"
        @click="goToAdd"
      />
    </div>

    <div class="cards-container">
      <shared-space-card
        v-for="shared_space in shared_spaces"
        :key="shared_space.id"
        :shared_space="shared_space"
        @delete="deleteSharedSpaces"
        @edit="editSharedSpace"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 100%;
  align-content: space-between;
  gap: 20px;
}

.cards-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.card {
  width: 300px;
}
</style>
