<script>
export default {
  name: "create-reservation-dialog",
  props: {
    visible: { type: Boolean, required: true },
    dateInfo: { type: Object, default: null }
  },
  data() {
    return {
      title: ''
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.resetForm();
      }
    }
  },
  methods: {
    resetForm() {
      this.title = '';
    },

    onSubmit() {
      if (!this.title.trim()) {
        alert('Por favor ingresa un título para la reserva');
        return;
      }

      const reservation = {
        title: this.title.trim(),
        start: this.dateInfo.start,
        end: this.dateInfo.end
      };

      this.$emit('reservation-created', reservation);
      this.resetForm();
    },

    onCancel() {
      this.$emit('dialog-closed');
      this.resetForm();
    }
  }
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      :modal="true"
      :style="{ width: '30rem' }"
      @update:visible="onCancel"
  >
    <template #header>
      <div class="flex align-items-center">
        <i class="pi pi-calendar mr-2"></i>
        <span class="font-semibold text-xl">Reservar Espacio Compartido</span>
      </div>
    </template>

    <div class="flex flex-column gap-3 pt-3">
      <div class="flex flex-column gap-2">
        <label for="title" class="font-semibold">Título de la Reserva</label>
        <pv-input-text
            id="title"
            v-model="title"
            placeholder="Ej: Reunión de equipo"
            class="w-full"
            autofocus
        />
      </div>

      <div v-if="dateInfo" class="flex flex-column gap-2">
        <div class="p-3 surface-100 border-round">
          <div class="flex align-items-center gap-2 mb-2">
            <i class="pi pi-clock text-primary"></i>
            <span class="font-semibold">Horario seleccionado:</span>
          </div>
          <div class="ml-4">
            <p class="m-0 text-sm">
              <strong>Inicio:</strong> {{ formatDateTime(dateInfo.start) }}
            </p>
            <p class="m-0 text-sm mt-1">
              <strong>Fin:</strong> {{ formatDateTime(dateInfo.end) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-content-end gap-2">
        <pv-button
            label="Cancelar"
            icon="pi pi-times"
            @click="onCancel"
            severity="secondary"
            text
        />
        <pv-button
            label="Crear Reserva"
            icon="pi pi-check"
            @click="onSubmit"
            :disabled="!title.trim()"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
.surface-100 {
  background-color: var(--surface-100);
}

.text-primary {
  color: var(--primary-color);
}
</style>

<script setup>
// Helper function to format datetime
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>