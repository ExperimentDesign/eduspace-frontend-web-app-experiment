<template>
  <div class="report-table">
    <h2 class="table-title">Reports</h2>
    <table>
      <thead>
      <tr>
        <th>Resource ID</th>
        <th>Kind of Report</th>
        <th>Description</th>
        <th>Created At</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="report in reports" :key="report.id">
        <td>{{ report.resourceId }}</td>
        <td>{{ report.kindOfReport }}</td>
        <td>{{ report.description }}</td>
        <td>{{ formatDate(report.createdAt) }}</td>
        <td>
          <span :class="['status-label', getStatusClass(report.status)]">
            {{ report.status }}
          </span>
        </td>
        <td>
          <i
              class="pi pi-refresh status-icon"
              @click="toggleStatus(report)"
              :class="getStatusIconClass(report.status)"
          ></i>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ReportService } from "../services/report.service.js";

export default {
  data() {
    return {
      reports: [],
      reportService: new ReportService(),
    };
  },
  created() {
    this.fetchReports();
  },
  methods: {
    async fetchReports() {
      try {
        const response = await this.reportService.getAll();
        console.log("Reports response", response.data);
        this.reports = response.data || [];
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    },
    async toggleStatus(report) {
      const newStatus = report.status === "in progress" ? "completed" : "in progress";

      const reportToUpdate = {
        kindOfReport: report.kindOfReport,
        description: report.description,
        resourceId: report.resourceId,
        createdAt: report.createdAt,
        status: newStatus
      };

      try {
        await this.reportService.update(report.id, reportToUpdate);
        report.status = newStatus;
      } catch (error) {
        console.error("Error updating report status:", error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },
    getStatusClass(status) {
      return status === 'in progress' ? 'in-progress' : 'completed';
    },
    getStatusIconClass(status) {
      return status === 'in progress' ? 'in-progress' : 'completed';
    }
  },
};
</script>

<style scoped>
.report-table {
  max-width: 1000px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 16px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.table-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
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
  background-color: #0CC0DF;
  color: white;
  font-weight: bold;
}

.status-label {
  padding: 5px 10px;
  border-radius: 12px;
  font-weight: bold;
}

.in-progress {
  background-color: #28a745;
  color: white;
}

.completed {
  background-color: #007bff;
  color: white;
}

.status-icon {
  font-size: 1.5rem;
  cursor: pointer;
  color: #0CC0DF;
  transition: color 0.3s;
  background: none;
  padding: 0;
}

.status-icon:hover {
  color: #ffcc00;
}
</style>