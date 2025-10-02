<script>
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
      classroomService: new ClassroomService(),
    };
  },
  methods: {
    async saveClassroom(classroomData) {
      try {
        await this.classroomService.create(classroomData);
        alert("Classroom created successfully");
        this.$router.push("/dashboard-admin/classrooms-shared-spaces");
      } catch (error) {
        console.error("Error creating classroom:", error);
        alert("Error creating classroom: " + error.message);
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