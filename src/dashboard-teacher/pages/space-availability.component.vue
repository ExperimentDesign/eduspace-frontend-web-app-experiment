<script>
import { mapGetters } from "vuex";
import { ReservationService } from "../../reservation-management/services/reservation.service.js";
import { SharedAreaService } from "../../classroom-space-resource-management/services/shared-area.service.js";

export default {
  name: "TeacherSpaceAvailability",
  data() {
    return {
      myReservations: [],
      sharedAreas: [],
      loading: true,
      selectedReservation: null,
      reservationService: null,
      sharedAreaService: null,
    };
  },
  computed: {
    ...mapGetters(["userId"]),
  },
  methods: {
    async loadMyReservations() {
      try {
        this.loading = true;

        // Cargar todas las reservas usando el servicio
        const reservationsResponse = await this.reservationService.getAll();

        // Filtrar solo las reservas del usuario actual
        this.myReservations = reservationsResponse.data.filter(
            (reservation) => reservation.teacherId === this.userId
        );

        // Cargar áreas compartidas para mostrar nombres
        const areasResponse = await this.sharedAreaService.getAll();
        this.sharedAreas = areasResponse.data;

        console.log("Mis reservas:", this.myReservations);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
        alert("Error al cargar tus reservas");
      } finally {
        this.loading = false;
      }
    },

    getAreaName(areaId) {
      const area = this.sharedAreas.find((a) => a.id === areaId);
      return area ? area.name : "Unknown Area";
    },

    formatDateTime(dateString) {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleString("es-ES", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        console.error("Error al formatear la fecha:", error);
        return dateString;
      }
    },

    viewDetails(reservation) {
      this.selectedReservation = reservation;
    },

    closeDetails() {
      this.selectedReservation = null;
    },

    goBack() {
      this.$router.back();
    },
  },
  created() {
    this.reservationService = new ReservationService();
    this.sharedAreaService = new SharedAreaService();
  },
  mounted() {
    this.loadMyReservations();
  },
};
</script>

<template>
  <div class="space-availability-container">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <pv-button
          icon="pi pi-arrow-left"
          text
          @click="goBack"
          class="back-button"
      />
      <h4>Reservations</h4>
      <i class="pi pi-chevron-right"></i>
      <h4>My Reservations</h4>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <pv-progress-spinner />
      <span class="ml-3">Loading your reservations...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="myReservations.length === 0" class="empty-state">
      <i class="pi pi-calendar empty-icon"></i>
      <h3>No reservations found</h3>
      <p>You don't have any shared space reservations yet.</p>
      <pv-button
          label="Make a Reservation"
          icon="pi pi-plus"
          @click="$router.push({ name: 'reservation-management' })"
          class="mt-3"
      />
    </div>

    <!-- Reservations List -->
    <div v-else class="reservations-grid">
      <pv-card
          v-for="reservation in myReservations"
          :key="reservation.id"
          class="reservation-card"
      >
        <template #header>
          <div class="card-header">
            <i class="pi pi-calendar-plus"></i>
            <h3>{{ reservation.title }}</h3>
          </div>
        </template>

        <template #content>
          <div class="reservation-details">
            <div class="detail-row">
              <i class="pi pi-map-marker"></i>
              <span><strong>Area:</strong> {{ getAreaName(reservation.areaId) }}</span>
            </div>

            <div class="detail-row">
              <i class="pi pi-clock"></i>
              <span><strong>Start:</strong> {{ formatDateTime(reservation.start) }}</span>
            </div>

            <div class="detail-row">
              <i class="pi pi-clock"></i>
              <span><strong>End:</strong> {{ formatDateTime(reservation.end) }}</span>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="card-footer">
            <pv-button
                label="View Details"
                icon="pi pi-eye"
                text
                @click="viewDetails(reservation)"
            />
          </div>
        </template>
      </pv-card>
    </div>

    <!-- Details Dialog -->
    <pv-dialog
        v-model:visible="selectedReservation"
        :modal="true"
        :style="{ width: '450px' }"
        @hide="closeDetails"
    >
      <template #header>
        <div class="dialog-header">
          <i class="pi pi-info-circle"></i>
          <span>Reservation Details</span>
        </div>
      </template>

      <div v-if="selectedReservation" class="dialog-content">
        <div class="detail-section">
          <label>Title:</label>
          <p>{{ selectedReservation.title }}</p>
        </div>

        <div class="detail-section">
          <label>Shared Area:</label>
          <p>{{ getAreaName(selectedReservation.areaId) }}</p>
        </div>

        <div class="detail-section">
          <label>Start Time:</label>
          <p>{{ formatDateTime(selectedReservation.start) }}</p>
        </div>

        <div class="detail-section">
          <label>End Time:</label>
          <p>{{ formatDateTime(selectedReservation.end) }}</p>
        </div>

        <div class="detail-section">
          <label>Reservation ID:</label>
          <p>#{{ selectedReservation.id }}</p>
        </div>
      </div>

      <template #footer>
        <pv-button
            label="Close"
            icon="pi pi-times"
            @click="closeDetails"
            text
        />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.space-availability-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.breadcrumb h4 {
  margin: 0;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 500;
}

.breadcrumb i {
  color: #adb5bd;
  font-size: 0.9rem;
}

.back-button {
  padding: 0.5rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: #adb5bd;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #495057;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 1rem;
}

.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.reservation-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.reservation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.card-header i {
  font-size: 1.5rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.reservation-details {
  padding: 1rem 0;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: #495057;
}

.detail-row i {
  color: #667eea;
  font-size: 1rem;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid #e9ecef;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.dialog-content {
  padding: 1rem 0;
}

.detail-section {
  margin-bottom: 1rem;
}

.detail-section label {
  display: block;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.detail-section p {
  margin: 0;
  color: #6c757d;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .space-availability-container {
    padding: 1rem;
  }

  .reservations-grid {
    grid-template-columns: 1fr;
  }

  .breadcrumb {
    flex-wrap: wrap;
  }
}
</style>