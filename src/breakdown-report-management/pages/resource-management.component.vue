<template>
  <div class="resource-management">
    <h1 class="centered-title">Resources for Classroom {{ classroomName }}</h1>
    <div class="resource-cards">
      <div
          v-for="resource in resources"
          :key="resource.id"
          class="resource-card"
      >
        <h2 class="resource-title">{{ resource.name || 'No name available' }}</h2>
        <p class="resource-kind">Kind: {{ resource.kind_of_resource || 'No kind available' }}</p>
        <div class="button-container">
          <pv-button
              label="Report Resource"
              @click="goToReport(resource.id)"
              class="report-resource-button"
          />
        </div>
      </div>
    </div>
    <p v-if="resources.length === 0">No resources available for this classroom.</p>
  </div>
</template>

<script>
import { ResourceService } from "../services/resource.service.js";
import { ClassroomService } from "../services/classroom.service.js";

export default {
  name: 'ResourceManagement',
  data() {
    return {
      resources: [],
      classroomId: this.$route.params.classroomId,
      classroomName: '',
    };
  },
  created() {
    this.loadResources();
    this.loadClassroomName();
  },
  methods: {
    async loadResources() {
      const resourceService = new ResourceService();
      try {
        const response = await resourceService.findByClassroom(this.classroomId);
        this.resources = response.data;
      } catch (error) {
        console.error("Error loading resources", error);
      }
    },
    async loadClassroomName() {
      const classroomService = new ClassroomService();
      try {
        const response = await classroomService.getById(this.classroomId);
        this.classroomName = response.data.name;
      } catch (error) {
        console.error("Error loading classroom name", error);
      }
    },
    goToReport(resourceId) {
      this.$router.push({ name: 'report-resource', params: { resourceId } });
    }
  }
};
</script>

<style scoped>
.resource-management {
  padding: 20px;
}

.centered-title {
  text-align: center;
  margin-bottom: 20px;
}

.resource-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.resource-card {
  width: 250px; /* Ajusta el ancho según sea necesario */
  border: 1px solid #0CC0DF; /* Color del borde */
  border-radius: 50px; /* Esquinas muy redondeadas */
  padding: 1.5rem;
  box-shadow: 0 4px 28px rgba(12, 192, 223, 0.28);
  transition: transform 0.2s;
}

.resource-card:hover {
  transform: translateY(-10px); /* Efecto al pasar el mouse */
}

.resource-title {
  text-align: center;
  font-size: 1.5rem; /* Tamaño del texto */
  margin-bottom: 0.5rem; /* Espacio inferior */
}

.resource-kind {
  text-align: center;
  color: #333; /* Color del texto */
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.report-resource-button {
  background-color: #ffcc00; /* Color de fondo del botón */
  color: #000; /* Color del texto del botón */
  border-radius: 50px; /* Esquinas redondeadas del botón */
  padding: 0.5rem 1rem; /* Espaciado interno del botón */
  text-transform: uppercase; /* Transformar texto a mayúsculas */
}

.report-resource-button:hover {
  background-color: #ffdb4d; /* Color al pasar el mouse sobre el botón */
}
</style>