<script>
import { ClassroomService } from "../../services/classroom.service.js";
import ClassroomCreateAndEdit from "../../components/classrooms/classroom-create-and-edit.component.vue";

export default {
  name: "edit-classroom",
  components: { ClassroomCreateAndEdit },
  data() {
    return {
      classroom: null, // Empezamos con null hasta que carguen los datos
      classroomId: null,
      classroomService: new ClassroomService(),
    };
  },
  async created() {
    // Obtenemos el ID de la ruta
    this.classroomId = this.$route.params.id;
    if (this.classroomId) {
      try {
        // Usamos el servicio para obtener los datos del aula a editar
        const response = await this.classroomService.getById(this.classroomId);
        this.classroom = response.data;
      } catch (error) {
        console.error("Error al cargar el aula:", error);
      }
    }
  },
  methods: {
    async updateClassroom(classroomData) {
      try {
        // Llamamos al método 'update' del servicio
        await this.classroomService.update(this.classroomId, classroomData);
        alert("Aula actualizada exitosamente");
        this.$router.push("/dashboard-admin/classrooms-shared-spaces");
      } catch (error) {
        console.error("Error al actualizar el aula:", error);
        alert("Error al actualizar el aula: " + error.message);
      }
    },
    cancel() {
      this.$router.push("/dashboard-admin/classrooms-shared-spaces");
    },
  },
};
</script>

<template>
  <div v-if="classroom">
    <classroom-create-and-edit
        :classroom="classroom"
        :isCreateMode="false"
        @save="updateClassroom"
        @cancel="cancel"
    />
  </div>
  <div v-else>
    <p>Cargando datos del aula...</p>
  </div>
</template>

<style scoped></style>