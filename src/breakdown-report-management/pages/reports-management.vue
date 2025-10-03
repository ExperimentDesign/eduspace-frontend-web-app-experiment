<template>
  <div class="report-table">
    <h2 class="table-title">Reports</h2>
    <table>
      <thead>
      <tr>
        <th>Resource Name</th>
        <th>Kind of Report</th>
        <th>Description</th>
        <th>Created At</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="report in filteredReports" :key="report.id">
        <td>{{ report.resourceName || 'Unknown Resource' }}</td>
        <td>{{ report.kind_of_report }}</td>
        <td>{{ report.description }}</td>
        <td>{{ report.created_at }}</td>
        <td>
            <span :class="['status-label', report.status === 'en proceso' ? 'in-progress' : 'completed']">
              {{ report.status }}
            </span>
        </td>
        <td>
          <i
              class="pi pi-refresh status-icon"
              @click="toggleStatus(report)"
              :class="{'in-progress': report.status === 'en proceso', 'completed': report.status === 'completado'}"
          ></i>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ReportService } from "../services/report.service.js";
import { ResourceService } from "../services/resource.service.js";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      reports: [], // Todos los reportes obtenidos del servicio
      reportService: new ReportService(),
      resourceService: new ResourceService(),
    };
  },
  created() {
    this.fetchReports();
  },
  computed: {
    ...mapGetters(['userId', 'userRole']),
    idTeacher() {
      console.log("ID del usuario desde Vuex:", this.userId); // Verificar que userId esté presente
      return this.userId; // ID del teacher conectado
    },
    filteredReports() {
      return this.reports.filter((report) => String(report.idTeacher) === String(this.idTeacher));
    },
  },
  methods: {
    async fetchReports() {
      try {
        const response = await this.reportService.getAll();
        const reports = response.data || [];
        for (let report of reports) {
          const resource = await this.resourceService.getById(report.resourceId);
          report.resourceName = resource.data.name; // Agregar el nombre del recurso
        }
        this.reports = reports;
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    },
    async toggleStatus(report) {
      // Removed unused variable resourceName
      const reportToUpdate = { ...report, status: report.status === "en proceso" ? "completado" : "en proceso" };
      delete reportToUpdate.resourceName;
      try {
        await this.reportService.update(report.id, reportToUpdate);
        report.status = reportToUpdate.status;
      } catch (error) {
        console.error("Error updating report status:", error);
      }
    },
  },
};
</script>


<style scoped>
.report-table {
  max-width: 1000px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 16px; /* Esquinas más redondeadas */
  background-color: #f9f9f9; /* Color de fondo suave */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}

.table-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333; /* Color del título */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #0CC0DF; /* Color de fondo para el encabezado */
  color: white; /* Color del texto del encabezado */
  font-weight: bold;
}

.status-label {
  padding: 5px 10px;
  border-radius: 12px; /* Esquinas redondeadas */
  font-weight: bold;
}

.in-progress {
  background-color: #28a745; /* Color de fondo para 'en proceso' */
  color: white; /* Color del texto */
}

.completed {
  background-color: #007bff; /* Color de fondo para 'completado' */
  color: white; /* Color del texto */
}

.status-icon {
  font-size: 1.5rem;
  cursor: pointer;
  color: red; /* Color del ícono */
  transition: color 0.3s;
  background: none; /* Elimina cualquier fondo */
  padding: 0; /* Elimina el padding */
}

.status-icon:hover {
  color: #ffcc00; /* Color al pasar el mouse sobre el ícono */
}
</style>