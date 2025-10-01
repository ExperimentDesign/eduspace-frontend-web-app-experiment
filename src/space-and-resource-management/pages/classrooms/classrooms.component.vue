<script>
// 1. Importa el SERVICIO, no 'http' ni 'TeacherService'.
import { ClassroomService } from "../../services/classroom.service.js";
import ClassroomCard from "../../components/classrooms/classroom-card.component.vue";

export default {
  name: "ClassroomsPage",
  components: { ClassroomCard },
  data() {
    return {
      classrooms: [],
      // 2. Crea una instancia del servicio.
      classroomService: new ClassroomService(),
    };
  },
  async created() {
    await this.loadClassrooms();
  },
  methods: {
    async loadClassrooms() {
      try {
        // 3. UNA SOLA LÍNEA: El servicio hace todo el trabajo pesado.
        this.classrooms = await this.classroomService.getAllClassroomsWithTeacherNames();
      } catch (error) {
        console.error("Error al cargar las aulas:", error);
      }
    },
    async deleteClassroom(id) {
      try {
        // 4. Usa el método del servicio.
        await this.classroomService.delete(id);
        this.classrooms = this.classrooms.filter(classroom => classroom.id !== id);
      } catch (error) {
        console.error("Error al eliminar el aula:", error);
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
      <div class="text-xl font-semibold mb-2">Añadir Aula</div>
      <div class="mb-2">
        <span class="font-medium text-600">Crea un nuevo espacio de aprendizaje.</span>
      </div>
      <div class="flex align-items-center gap-2 mb-3">
        <i class="pi pi-box text-yellow-500"></i>
        <span>Aula</span>
      </div>
      <pv-button label="Añadir" severity="warning" text raised class="w-full" @click="goToAdd"/>
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