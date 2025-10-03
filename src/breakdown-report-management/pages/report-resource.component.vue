<template>
  <div class="report-resource">
    <h2>Report Resource</h2>
    <form @submit.prevent="submitForm" class="report-form">
      <div class="form-group">
        <pv-float-label>
          <pv-input-text
              id="kind_of_report"
              v-model="form.kind_of_report"
              required
              placeholder=" "
          />
          <label for="kind_of_report" class="float-label">Kind of Report</label>
        </pv-float-label>
      </div>
      <div class="form-group">
        <pv-float-label>
          <pv-textarea
              id="description"
              v-model="form.description"
              autoResize
              rows="5"
              required
              placeholder=" "
          />
          <label for="description" class="float-label">Description</label>
        </pv-float-label>
      </div>
      <div class="form-group">
        <pv-date-picker
            id="created_at"
            v-model="formattedCreatedAt"
            dateFormat="yy-mm-dd"
            showIcon
        />
        <label for="created_at" class="fixed-label">Created At</label>
      </div>
      <!-- Campo oculto para el idTeacher, que obtiene el userId desde Vuex -->
      <input type="hidden" v-model="idTeacher" />
      <pv-button
          type="submit"
          label="Create report"
          icon="pi pi-check"
          class="submit-button"
      />
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ReportService } from "../services/report.service.js";

export default {
  data() {
    return {
      form: {
        kind_of_report: '',
        description: '',
        resourceId: null,
        status: 'en proceso',
      },
      formattedCreatedAt: new Date().toISOString().slice(0, 10),
      reportService: new ReportService(),
    };
  },
  created() {
    this.form.resourceId = this.$route.params.resourceId;
    this.setUserId();  // Inicializa el idTeacher desde Vuex
  },
  computed: {
    ...mapGetters(['userId', 'userRole']),
    idTeacher() {
      console.log("ID del usuario desde Vuex:", this.userId); // Verificar que userId esté presente
      return this.userId;
    },
  },
  methods: {
    async submitForm() {
      const reportData = {
        kind_of_report: this.form.kind_of_report,
        description: this.form.description,
        resourceId: this.form.resourceId,
        created_at: this.getDateWithoutTime(this.formattedCreatedAt),
        status: this.form.status,
        idTeacher: String(this.idTeacher),  // Usamos el idTeacher desde el computed
      };

      try {
        await this.reportService.create(reportData);
        this.$router.push('/dashboard-teacher/breakdown-reports/classrooms');
      } catch (error) {
        console.error("Error al crear el reporte:", error);
        alert("Error al crear el reporte. Por favor, revisa la consola para más detalles.");
      }
    },
    getDateWithoutTime(dateString) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },
    setUserId() {
      // Aquí puedes agregar lógica si deseas hacer algo más con el userId cuando se inicializa
      console.log('User ID from Vuex:', this.idTeacher);
    }
  },
};
</script>

<style scoped>
.report-resource {
  max-width: 700px;
  margin: 50px auto;
  padding: 40px;
  border-radius: 20px;
  background: linear-gradient(135deg, #f0f8ff, #ffffff);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 2.8rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 30px;
  position: relative;
}

h2::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  margin: 15px auto;
  border-radius: 4px;
}

.report-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  position: relative;
}

.float-label {
  position: absolute;
  left: 14px;
  top: 14px;
  font-size: 1.1rem;
  color: #7f8c8d;
  transition: 0.2s ease all;
  pointer-events: none;
}

.fixed-label {
  position: absolute;
  top: -25px;
  left: 14px;
  font-size: 1.1rem;
  color: #3498db;
}

:deep(.submit-button) {
  padding: 14px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 12px;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  border: none;
  color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
}

:deep(.submit-button:hover) {
  background: linear-gradient(90deg, #2980b9, #27ae60);
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .report-resource {
    padding: 30px;
    margin: 30px auto;
  }

  h2 {
    font-size: 2.2rem;
  }
}
</style>
