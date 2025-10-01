<script>
import { SharedAreaService } from "../../services/shared-area.service.js";
import SharedSpaceCard from "../../components/shared-spaces/shared-space-card.component.vue";

export default {
  name: "shared-spaces",
  components: { SharedSpaceCard },
  data() {
    return {
      shared_spaces: [],
      sharedAreaService: new SharedAreaService(),
    };
  },
  async created() {
    await this.loadAreas();
  },
  methods: {
    async loadAreas() {
      try {
        const response = await this.sharedAreaService.getAll();
        this.shared_spaces = response.data;
      } catch (error) {
        console.error("Error loading shared areas:", error);
      }
    },
    async deleteSharedSpace(id) {
      try {
        await this.sharedAreaService.delete(id);
        this.shared_spaces = this.shared_spaces.filter(
            (space) => space.id !== id
        );
      } catch (error)
      {
        console.error("Error deleting shared area:", error);
      }
    },
    editSharedSpace(id) {
      this.$router.push({ name: "edit-shared-space", params: { id } });
    },
    goToAdd() {
      this.$router.push({ name: "add-shared-space" });
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
    <div class="card border-round-xl shadow-2 p-3 h-full">
      <div class="text-xl font-semibold mb-2">Add Shared Area</div>
      <div class="mb-2">
        <span class="font-medium text-600">Create a new common space.</span>
      </div>
      <div class="flex align-items-center gap-2 mb-3">
        <i class="pi pi-box text-yellow-500"></i>
        <span>Shared Area</span>
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
          @delete="deleteSharedSpace"
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
  flex-wrap: wrap;
}

.card {
  width: 300px;
}
</style>