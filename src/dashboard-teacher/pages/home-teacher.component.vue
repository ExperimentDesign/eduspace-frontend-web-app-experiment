<template>
  <div class="dashboard-container">
    <!-- Teacher Information -->
    <div class="teacher-info-card">
      <div class="teacher-avatar">
        <pv-avatar
            :label="initials || 'N/A'"
            size="large"
            style="background-color: #42a5f5; color: #ffffff; font-size: 30px;"
        ></pv-avatar>
      </div>
      <div class="teacher-details">
        <h2>{{ fullName || "Teacher Information Not Available" }}</h2>
        <p><strong>Status:</strong> Teacher</p>
        <p><strong>Email:</strong> {{ teacher?.email || "Not available" }}</p>
        <p><strong>Phone:</strong> {{ teacher?.phone || "Not available" }}</p>
        <p><strong>DNI:</strong> {{ teacher?.dni || "Not available" }}</p>
      </div>
    </div>

    <!-- Cards Section -->
    <div class="cards-section">
      <!-- Classroom Reservations -->
      <pv-card class="dashboard-card">
        <template #header>
          <h3>Classroom Reservations</h3>
        </template>
        <template #content>
          <ul>
            <li v-for="(reservation, index) in classroomReservations" :key="index">
              <p><strong>Classroom:</strong> {{ reservation.name || "Unknown" }}</p>
              <p>{{ reservation.description || "No description available" }}</p>
            </li>
            <li v-if="classroomReservations.length === 0" class="empty">
              No classroom reservations available.
            </li>
          </ul>
        </template>
      </pv-card>

      <!-- Shared Area Reservations -->
      <pv-card class="dashboard-card">
        <template #header>
          <h3>Shared Area Reservations</h3>
        </template>
        <template #content>
          <div v-if="sharedAreaReservations.length > 0" class="shared-reservations-container">
            <div
              v-for="(reservation, index) in sharedAreaReservations"
              :key="`shared-${reservation.id || index}`"
              class="shared-reservation-card"
            >
              <div class="reservation-header">
                <h4 class="reservation-title">{{ reservation.title || 'No title' }}</h4>
                <span class="reservation-area">{{ reservation.areaName || 'Unknown area' }}</span>
              </div>
              <p class="reservation-datetime"><strong>Start:</strong> {{ formatDateTime(reservation.start) }}</p>
              <p class="reservation-datetime"><strong>End:</strong> {{ formatDateTime(reservation.end) }}</p>
              <p v-if="reservation.areaDescription" class="reservation-description"><strong>Description:</strong> {{ reservation.areaDescription }}</p>
            </div>
          </div>
          <p v-else>No shared area reservations available.</p>
        </template>
      </pv-card>

      <!-- Meetings -->
      <pv-card class="dashboard-card">
        <template #header>
          <h3>Meetings</h3>
        </template>
        <template #content>
          <ul>
            <li v-for="(meeting, index) in meetings" :key="index">
              <p><strong>Classroom:</strong> {{ meeting.classroom || "Unknown" }}</p>
              <p><strong>Date:</strong> {{ meeting.day || "N/A" }}</p>
              <p><strong>Start:</strong> {{ meeting.start || "N/A" }}</p>
              <p><strong>End:</strong> {{ meeting.end || "N/A" }}</p>
              <p><strong>Title:</strong> {{ meeting.title || "No title" }}</p>
              <p><strong>Description:</strong> {{ meeting.description || "No description" }}</p>
            </li>
            <li v-if="meetings.length === 0" class="empty">No meetings scheduled.</li>
          </ul>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import http from "../../shared/services/http-common.js";
import { ReservationService } from "../../reservation-management/services/reservation.service.js";
import { MeetService } from "../../meeting-management/services/meet.service.js";
import {ClassroomService} from "../../shared/services/classroom.service.js";

export default {
  name: "TeacherDashboard",
  data() {
    return {
      teacher: null,
      classroomReservations: [],
      sharedAreaReservations: [],
      meetings: [],
      reservationService: new ReservationService(),
      meetService: new MeetService(),
      classroomService: new ClassroomService(),
    };
  },
  computed: {
    ...mapGetters("user", ["userId"]),
    fullName() {
      return `${this.teacher?.firstName || ""} ${this.teacher?.lastName || ""}`.trim();
    },
    initials() {
      const [firstName, lastName] = [
        this.teacher?.firstName || "",
        this.teacher?.lastName || "",
      ];
      return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
    },
  },
  methods: {
    formatDateTime(dateString) {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
      }
    }
  },
  async mounted() {
    if (!this.userId) {
      console.error("Teacher ID not found.");
      return;
    }
    try {
      const teacherResponse = await http.get(`/teachers-profiles/${this.userId}`);
      this.teacher = teacherResponse.data;

      const classroomResponse = await http.get(`/classrooms/teachers/${this.userId}`);
      this.classroomReservations = classroomResponse.data;

      const [areasResponse, reservationsResponse] = await Promise.all([
        http.get("/shared-area"),
        this.reservationService.getAll()
      ]);
      const allAreas = areasResponse.data;
      const allReservations = reservationsResponse.data;

      const myReservations = allReservations.filter(
          (reservation) => reservation.teacherId === this.userId
      );

      this.sharedAreaReservations = myReservations.map(reservation => {
        const area = allAreas.find(a => a.id === reservation.areaId);
        return {
          ...reservation,
          areaName: area ? area.name : 'Unknown area'
        };
      });

      const meetResponse = await http.get(`/teachers/${this.userId}/meetings`);
      this.meetings = meetResponse.data;

    } catch (error) {
      console.error("Error loading teacher dashboard data:", error);
    }
  },
};
</script>

<style scoped>
/* Main Container */
.dashboard-container {
  padding: 20px;
}

/* Teacher Main Card */
.teacher-info-card {
  display: flex;
  background-color: #e3f2fd;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.teacher-avatar {
  margin-right: 20px;
}

.teacher-details h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.teacher-details p {
  margin: 5px 0;
}

/* Content Cards */
.cards-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.dashboard-card {
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-card h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

p {
  margin: 5px 0;
}

/* Shared Area Reservations Card Styles */
.shared-reservations-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.shared-reservation-card {
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid rgba(66,165,245,0.15);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.shared-reservation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(66,165,245,0.12);
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reservation-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #0d47a1;
}

.reservation-area {
  background: rgba(66,165,245,0.12);
  color: #1565c0;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.reservation-datetime {
  font-size: 13px;
  color: #333;
  margin: 4px 0;
}

.reservation-description {
  font-size: 13px;
  color: #555;
  margin-top: 8px;
}
</style>