<template>
  <pv-card class="teacher-card">
    <template #title>
      <div class="card-title">
        <i class="pi pi-user"></i>
        <span>{{ fullName }}</span>
      </div>
    </template>
    <template #content>
      <div class="teacher-info">
        <div class="info-row">
          <i class="pi pi-envelope"></i>
          <div class="info-content">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ maskedEmail }}</span>
          </div>
        </div>
        <div class="info-row">
          <i class="pi pi-id-card"></i>
          <div class="info-content">
            <span class="info-label">DNI:</span>
            <span class="info-value">{{ teacher.dni }}</span>
          </div>
        </div>
        <div class="info-row">
          <i class="pi pi-phone"></i>
          <div class="info-content">
            <span class="info-label">Phone:</span>
            <span class="info-value">{{ formattedPhone }}</span>
          </div>
        </div>
        <div class="info-row" v-if="teacher.address">
          <i class="pi pi-map-marker"></i>
          <div class="info-content">
            <span class="info-label">Address:</span>
            <span class="info-value">{{ teacher.address }}</span>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="card-actions">
        <pv-button
            icon="pi pi-eye"
            label="View Details"
            severity="info"
            size="small"
            @click="$emit('view', teacher.id)"
        />
      </div>
    </template>
  </pv-card>
</template>

<script>
export default {
  name: 'teacher-card',
  props: {
    teacher: {
      type: Object,
      required: true,
      validator(value) {
        return value.firstName && value.lastName && value.email && value.dni && value.phone;
      }
    }
  },
  computed: {
    fullName() {
      return `${this.teacher.firstName} ${this.teacher.lastName}`;
    },
    maskedEmail() {
      const email = this.teacher.email;
      const [localPart, domain] = email.split('@');
      if (localPart.length <= 3) {
        return `${localPart}***@${domain}`;
      }
      return `${localPart.substring(0, 3)}****@${domain}`;
    },
    formattedPhone() {
      const phone = this.teacher.phone;
      return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
  }
}
</script>

<style scoped>
.teacher-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.teacher-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-title i {
  color: #3b82f6;
  font-size: 1.5rem;
}

.teacher-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: #f8f9fa;
  transition: background 0.2s;
}

.info-row:hover {
  background: #e9ecef;
}

.info-row > i {
  color: #6c757d;
  font-size: 1.1rem;
  margin-top: 0.2rem;
  min-width: 20px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.info-label {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.95rem;
  color: #2c3e50;
  font-weight: 500;
  word-break: break-word;
}

.card-actions {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .card-actions button {
    width: 100%;
  }
}
</style>