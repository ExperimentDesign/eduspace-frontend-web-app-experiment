<script>
import { ReservationService } from "../services/reservation.service.js";
import { SharedAreaService } from "../../classroom-space-resource-management/services/shared-area.service.js";
import { SharedSpace } from "../../classroom-space-resource-management/model/SharedSpace.entity.js";
import { mapGetters } from "vuex";

export default {
  name: "reservation-management",
  data() {
    return {
      form: {
        title: '',
        area: null,
        date: null,
        start: null,
        end: null
      },
      areas: [],
      loading: false,
      isSubmitting: false,
      reservationService: new ReservationService(),
      sharedAreaService: new SharedAreaService()
    }
  },
  computed: {
    ...mapGetters('user', ['userId']),

    reservationDuration() {
      if (!this.form.start || !this.form.end) return 0;
      const start = new Date(this.form.start);
      const end = new Date(this.form.end);
      const diffMs = end - start;
      return diffMs / (1000 * 60 * 60);
    },

    isValid() {
      const validDuration = this.reservationDuration > 0 && this.reservationDuration <= 2;
      return this.form.title &&
             this.form.area &&
             this.form.date &&
             this.form.start &&
             this.form.end &&
             validDuration;
    }
  },
  methods: {
    async loadAreas() {
      this.loading = true;
      try {
        const response = await this.sharedAreaService.getAll();
        this.areas = response.data.map(a => new SharedSpace(a));
      } catch (error) {
        console.error("Error loading areas", error);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Could not load shared spaces' });
      } finally {
        this.loading = false;
      }
    },

    async onSubmit() {
      if (!this.isValid) return;

      this.isSubmitting = true;

      try {
        const reservationData = {
          title: this.form.title,
          start: this.combineDateAndTime(this.form.date, this.form.start),
          end: this.combineDateAndTime(this.form.date, this.form.end)
        };

        await this.reservationService.create(this.userId, this.form.area.id, reservationData);

        this.$toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Reservation created successfully', life: 3000 });

        this.resetForm();

      } catch (error) {
        console.error(error);
        const msg = error.response?.data?.message || 'Failed to create reservation. Time might be occupied.';
        this.$toast.add({ severity: 'error', summary: 'Error', detail: msg, life: 5000 });
      } finally {
        this.isSubmitting = false;
      }
    },

    combineDateAndTime(dateObj, timeObj) {
      const d = new Date(dateObj);
      const t = new Date(timeObj);

      const combined = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes(), 0);
      return combined.toISOString();
    },

    resetForm() {
      this.form = {
        title: '',
        area: null,
        date: null,
        start: null,
        end: null
      };
    }
  },
  created() {
    this.loadAreas();
  }
}
</script>

<template>
  <div class="page-container">
    <div class="form-card">

      <div class="card-header">
        <div class="icon-box">
          <i class="pi pi-calendar-plus"></i>
        </div>
        <div class="header-text">
          <h2>Book a Space</h2>
          <p>Fill in the details to reserve a shared area.</p>
        </div>
      </div>

      <div class="form-content">
        <div class="field">
          <label>Activity Title</label>
          <pv-input-text
            v-model="form.title"
            placeholder="Ex: Soccer Team Practice"
            class="w-full"
          />
        </div>

        <div class="field">
          <label>Select Area</label>
          <pv-select
            v-model="form.area"
            :options="areas"
            optionLabel="name"
            placeholder="Choose a space..."
            class="w-full"
            :loading="loading"
          />
        </div>

        <div class="field">
          <label>Date</label>
          <pv-date-picker
            v-model="form.date"
            dateFormat="yy-mm-dd"
            :minDate="new Date()"
            showIcon
            class="w-full"
            placeholder="Select date"
          />
        </div>

        <div class="form-row">
          <div class="field half">
            <label>Start Time</label>
            <pv-date-picker
              v-model="form.start"
              timeOnly
              placeholder="00:00"
              class="w-full"
              hourFormat="24"
              :stepMinute="15"
            />
          </div>
          <div class="field half">
            <label>End Time</label>
            <pv-date-picker
              v-model="form.end"
              timeOnly
              placeholder="00:00"
              class="w-full"
              hourFormat="24"
              :stepMinute="15"
            />
          </div>
        </div>

        <small v-if="reservationDuration > 2" style="color: #e74c3c; margin-top: -0.5rem;">
          Reservation cannot exceed 2 hours
        </small>

        <div class="action-area">
          <pv-button
            label="Confirm Reservation"
            icon="pi pi-check"
            class="submit-btn"
            @click="onSubmit"
            :loading="isSubmitting"
            :disabled="!isValid"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 3rem;
  background-color: transparent;
}

.form-card {
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.02);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.icon-box {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00838f;
  font-size: 1.5rem;
}

.header-text h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
  font-weight: 700;
}

.header-text p {
  margin: 0.25rem 0 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #34495e;
  margin-left: 0.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.half {
  flex: 1;
}

:deep(.p-inputtext),
:deep(.p-select),
:deep(.p-datepicker) {
  border-radius: 12px;
  border-color: #e2e8f0;
  padding: 0.8rem 1rem;
}

:deep(.p-inputtext:hover),
:deep(.p-select:hover) {
  border-color: #0CC0DF;
}

:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 2px rgba(12, 192, 223, 0.2);
  border-color: #0CC0DF;
}

.action-area {
  margin-top: 1rem;
}

.submit-btn {
  width: 100%;
  background-color: #0CC0DF;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #09a0bb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 192, 223, 0.3);
}

.submit-btn:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .form-card {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .form-row {
    flex-direction: column;
  }
}
</style>