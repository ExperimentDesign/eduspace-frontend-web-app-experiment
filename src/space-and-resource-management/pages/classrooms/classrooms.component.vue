<script>
import { ClassroomService } from "../../services/classroom.service.js";
import ClassroomCard from "../../components/classrooms/classroom-card.component.vue";

export default {
  name: "ClassroomsPage",
  components: { ClassroomCard },
  data() {
    return {
      classrooms: [],
      classroomService: new ClassroomService(),
    };
  },
  async created() {
    await this.loadClassrooms();
  },
  methods: {
    async loadClassrooms() {
      try {
        this.classrooms = await this.classroomService.getAllClassroomsWithTeacherNames();
      } catch (error) {
        console.error("Error loading classrooms:", error);
      }
    },
    async deleteClassroom(id) {
      try {
        await this.classroomService.delete(id);
        this.classrooms = this.classrooms.filter(classroom => classroom.id !== id);
      } catch (error) {
        console.error("Error deleting classroom:", error);
      }
    },
    editClassroom(id) {
      this.$router.push({ name: "edit-classroom", params: { id } });
    },
    goToAdd() {
      this.$router.push({ name: 'add-classrooms' });
    },
  },
};
</script>

<template>
  <div style="display: flex; align-items: center">
    <h4 style="margin-right: 20px">Classrooms and Shared Spaces</h4>
    <i class="pi pi-chevron-right"></i>
    <h4 style="margin-left: 20px">Classrooms</h4>
  </div>

  <div class="container">
    <div class="card border-round-xl shadow-2 p-3 h-full">
      <div class="text-xl font-semibold mb-2">Add Classroom</div>
      <div class="mb-2">
        <span class="font-medium text-600">Create a new learning space.</span>
      </div>
      <div class="flex align-items-center gap-2 mb-3">
        <i class="pi pi-box text-yellow-500"></i>
        <span>Classroom</span>
      </div>
      <pv-button label="Add" severity="warning" text raised class="w-full" @click="goToAdd"/>
    </div>

    <div class="cards-container">
      <classroom-card
          v-for="classroom in classrooms"
          :key="classroom.id"
          :classroom="classroom"
          @delete="deleteClassroom"
          @edit="editClassroom"/>
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