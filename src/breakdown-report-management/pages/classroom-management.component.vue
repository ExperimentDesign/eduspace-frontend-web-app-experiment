<template>
  <div class="classroom-management">
    <h1 class="centered-title">Make a breakdown report</h1>

    <div class="classroom-cards">
      <div
          v-for="classroom in filteredClassrooms"
          :key="classroom.id"
          class="classroom-card"
      >
        <div class="image-container">
          <img
              src="https://i0.wp.com/mirincondeaprendizaje.com/wp-content/uploads/2019/08/school-2648668_960_720.jpg?resize=768%2C508&ssl=1"
              alt="Imagen del Aula"
              class="classroom-image"
          />
        </div>

        <div class="card-content">
          <h2 class="classroom-name">{{ classroom.name || 'Sin nombre disponible' }}</h2>
          <p class="classroom-description">{{ classroom.description || 'Sin descripción disponible' }}</p>
          <div class="button-container">
            <pv-button
                label="Ver Recursos"
                @click="goToClassroomResources(classroom.id)"
                class="view-resources-button"
            />
          </div>
        </div>
      </div>
    </div>

    <p v-if="filteredClassrooms.length === 0" class="no-classrooms">
      No hay aulas disponibles para este profesor.
    </p>
  </div>
</template>

<script>
import { ClassroomService } from "../services/classroom.service.js";
import { mapGetters } from "vuex";

export default {
  name: 'ClassroomManagement',
  data() {
    return {
      classrooms: []
    };
  },
  computed: {
    ...mapGetters('user', ['userId']),
    filteredClassrooms() {
      return this.classrooms.filter(classroom => classroom.teacherId === this.userId);
    }
  },
  created() {
    this.loadClassrooms();
  },
  methods: {
    async loadClassrooms() {
      const classroomService = new ClassroomService();
      try {
        const response = await classroomService.getAll();
        this.classrooms = response.data;
        console.log("Aulas cargadas:", this.classrooms);
      } catch (error) {
        console.error("Error al cargar las aulas", error);
      }
    },
    goToClassroomResources(classroomId) {
      this.$router.push({ name: 'resource-management', params: { classroomId } });
    }
  }
};
</script>

<style scoped>
.classroom-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.centered-title {
  text-align: center;
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.classroom-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
}

.classroom-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 28px rgba(12, 192, 223, 0.28);
  transition: transform 0.2s ease;
  border: 1px solid #0CC0DF;
}

.classroom-card:hover {
  transform: translateY(-10px);
}

.image-container {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.classroom-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.classroom-card:hover .classroom-image {
  transform: scale(1.1);
}

.card-content {
  padding: 1rem;
}

.classroom-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.classroom-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  text-align: center;
  line-height: 1.4;
}

.button-container {
  display: flex;
  justify-content: center;
}

:deep(.view-resources-button) {
  background-color: #ffcc00;
  border: none;
  color: #000;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  transition: all 0.3s ease;
}

:deep(.view-resources-button:hover) {
  background-color: #ffdb4d;
  transform: translateY(-2px);
}

.no-classrooms {
  text-align: center;
  color: #666;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .classroom-cards {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .centered-title {
    font-size: 1.8rem;
    }
}
</style>