<script>
// 1. Importa el SERVICIO.
import { ClassroomService } from "../../services/classroom.service.js";
import ClassroomCreateAndEdit from "../../components/classrooms/classroom-create-and-edit.component.vue";

export default {
  name: "add-classroom",
  components: { ClassroomCreateAndEdit },
  data() {
    return {
      classroom: {
        name: '',
        description: '',
        teacherId: null,
      },
      // 2. Instancia el servicio.
      classroomService: new ClassroomService(),
    };
  },
  methods: {
    async saveClassroom(classroomData) {
      try {
        // 3. Llama al método 'create' del servicio. ¡Así de simple!
        await this.classroomService.create(classroomData);
        alert("Aula creada exitosamente");
        this.$router.push("/dashboard-admin/classrooms-shared-spaces");
      } catch (error) {
        console.error("Error al crear el aula:", error);
        alert("Error al crear el aula: " + error.message);
      }
    },
    cancel() {
      this.$router.push("/dashboard-admin/classrooms-shared-spaces");
    },
  },
};
</script>

<template>
  <classroom-create-and-edit
      :classroom="classroom"
      :isCreateMode="true"
      @save="saveClassroom"
      @cancel="cancel"/>
</template>

<style scoped>
</style>