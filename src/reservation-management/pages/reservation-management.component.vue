<script>
import WeeklyCalendar from "../components/weekly-calendar.component.vue";
import ReservationToolbar from "../components/reservation-toolbar.component.vue";
import CreateReservationDialog from "../components/create-reservation-dialog.vue";
import { ReservationService } from "../services/reservation.service.js";
import { SharedAreaService } from "../../classroom-space-resource-management/services/shared-area.service.js";
import { SharedSpace } from "../../classroom-space-resource-management/model/SharedSpace.entity.js";
import { Reservation } from "../model/reservation.entity.js";
import { mapGetters } from "vuex";

export default {
  name: "reservation-management",
  components: {
    ReservationToolbar,
    WeeklyCalendar,
    CreateReservationDialog
  },
  data() {
    return {
      areas: [],
      events: [],
      areaId: null,
      reservationService: null,
      sharedAreaService: null,
      loading: true,
      showDialog: false,
      selectedDateInfo: null
    }
  },
  computed: {
    ...mapGetters('user', ['userId', 'userRole'])
  },
  methods: {
    //#region Event Handlers

    onSharedSpaceSelected(item) {
      this.areaId = item.id;
      this.getReservationsByAreaId(this.areaId);
      console.log('Area seleccionada:', this.areaId);
    },

    onDateSelected(dateInfo) {
      if (!this.areaId) {
        alert('Por favor selecciona un espacio compartido primero');
        return;
      }

      this.selectedDateInfo = dateInfo;
      this.showDialog = true;
    },

    onReservationCreated(reservationData) {
      this.createReservation(reservationData);
      this.showDialog = false;
    },

    onDialogClosed() {
      this.showDialog = false;
      this.selectedDateInfo = null;
    },

    //#endregion

    //#region Action Methods

    getSharedAreas() {
      this.sharedAreaService.getAll()
          .then(response => {
            this.areas = response.data.map(area => new SharedSpace(area));
            console.log('Areas cargadas:', this.areas);
            this.loading = false;
          })
          .catch(error => {
            console.error('Error al cargar áreas:', error);
            this.loading = false;
            alert('Error al cargar los espacios compartidos');
          });
    },

    getReservationsByAreaId(areaId) {
      this.loading = true;
      this.reservationService.findAllByAreaId(areaId)
          .then(response => {
            this.events = response.data.map(reservation => {
              const res = new Reservation(reservation);
              return {
                id: res.id,
                title: res.title,
                start: res.start,
                end: res.end,
                extendedProps: {
                  areaId: res.areaId,
                  teacherId: res.teacherId
                }
              };
            });
            console.log('Reservas cargadas:', this.events);
            this.loading = false;
          })
          .catch(error => {
            console.error('Error al cargar reservas:', error);
            this.loading = false;
            alert('Error al cargar las reservas del área');
          });
    },

    createReservation(reservationData) {
      const payload = {
        title: reservationData.title,
        start: reservationData.start,
        end: reservationData.end
      };

      this.reservationService.create(this.userId, this.areaId, payload)
          .then(response => {
            console.log('Reserva creada exitosamente:', response.data);

            const newReservation = new Reservation(response.data);

            // Add to events array for immediate UI update
            this.events.push({
              id: newReservation.id,
              title: newReservation.title,
              start: newReservation.start,
              end: newReservation.end,
              extendedProps: {
                areaId: newReservation.areaId,
                teacherId: newReservation.teacherId
              }
            });

            alert('Reserva creada exitosamente');
          })
          .catch(error => {
            console.error('Error al crear reserva:', error);

            if (error.response) {
              alert(`Error: ${error.response.data.message || 'No se pudo crear la reserva'}`);
            } else {
              alert('Error al crear la reserva. Por favor intenta de nuevo.');
            }
          });
    }

    //#endregion
  },
  created() {
    this.reservationService = new ReservationService();
    this.sharedAreaService = new SharedAreaService();
    this.getSharedAreas();
  }
}
</script>

<template>
  <div v-if="loading" class="flex justify-content-center align-items-center p-5">
    <pv-progress-spinner />
    <span class="ml-3">Cargando espacios compartidos...</span>
  </div>

  <div v-else>
    <reservation-toolbar
        :sharedAreas="areas"
        :areaId="areaId"
        @shared-space-selected="onSharedSpaceSelected($event)"
    />

    <weekly-calendar
        :events="events"
        :areaId="areaId"
        :userId="userId"
        @date-selected="onDateSelected"
    />

    <create-reservation-dialog
        :visible="showDialog"
        :dateInfo="selectedDateInfo"
        @reservation-created="onReservationCreated"
        @dialog-closed="onDialogClosed"
    />
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>