<template>
  <form @submit.prevent="submitForm">
    <div class="form-field">
      <pv-input-text
        v-model="formData.firstName"
        placeholder="Nombre"
        required
      />
      <pv-input-text
        v-model="formData.lastName"
        placeholder="Apellido"
        required
      />
    </div>

    <div class="form-field">
      <div class="input-container">
        <pv-input-text
          v-model="formData.email"
          placeholder="Email"
          required
          :class="{ 'p-invalid': errors.email }"
          @blur="validateField('email', formData.email)"
        />
        <small v-if="errors.email" class="error-message">{{
          errors.email
        }}</small>
      </div>
    </div>

    <div class="form-field">
      <div class="input-container">
        <pv-input-text
          v-model="formData.dni"
          placeholder="DNI (8 dígitos)"
          required
          :class="{ 'p-invalid': errors.dni }"
          @input="formData.dni = formData.dni.replace(/\D/g, '')"
          @blur="validateField('dni', formData.dni)"
          maxlength="8"
        />
        <small v-if="errors.dni" class="error-message">{{ errors.dni }}</small>
      </div>
      <pv-input-text
        v-model="formData.address"
        placeholder="Dirección"
        required
      />
    </div>

    <div class="form-field">
      <div class="input-container">
        <pv-input-text
          v-model="formData.phone"
          placeholder="Teléfono (ej: 987654321)"
          required
          :class="{ 'p-invalid': errors.phone }"
          @input="formData.phone = formData.phone.replace(/\D/g, '')"
          @blur="validateField('phone', formData.phone)"
          maxlength="9"
        />
        <small v-if="errors.phone" class="error-message">{{
          errors.phone
        }}</small>
      </div>
    </div>

    <div class="form-field">
      <pv-input-text
        v-model="formData.username"
        placeholder="Nombre de usuario"
        required
      />
      <pv-password
        v-model="formData.password"
        placeholder="Contraseña"
        required
      />
    </div>

    <div class="form-buttons">
      <pv-button label="Guardar" type="submit" />
      <pv-button label="Cancelar" @click="cancel" />
    </div>
  </form>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "add-teacher-form",
  data() {
    return {
      formData: {
        firstName: "",
        lastName: "",
        email: "",
        dni: "",
        phone: "",
        workingDays: "",
        field: "",
        administratorId: null, // Se llenará automáticamente con el ID del administrador logueado
        password: "", // Campo para la contraseña
      },
      days: ["Monday - Friday", "Saturday - Sunday"],
      fields: ["Math", "Science", "Literature"], // Agrega los campos necesarios
      errors: {
        email: "",
        dni: "",
        phone: "",
      },
    };
  },
  computed: {
    ...mapGetters("user", ["userId"]), // Obtiene el userId desde Vuex
  },
  watch: {
    userId: {
      immediate: true,
      handler(newValue) {
        this.formData.administratorId = newValue; // Asigna el ID automáticamente
      },
    },
  },
  methods: {
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    validateDNI(dni) {
      // DNI peruano: exactamente 8 dígitos
      const dniRegex = /^\d{8}$/;
      return dniRegex.test(dni);
    },
    validatePhone(phone) {
      // Teléfono peruano: exactamente 9 dígitos, empezando con 9
      const phoneRegex = /^9\d{8}$/;
      return phoneRegex.test(phone);
    },
    validateField(field, value) {
      this.errors[field] = "";

      switch (field) {
        case "email":
          if (value && !this.validateEmail(value)) {
            this.errors.email =
              "Ingrese un email válido (ejemplo: usuario@dominio.com)";
          }
          break;
        case "dni":
          if (value && !this.validateDNI(value)) {
            this.errors.dni = "El DNI debe tener exactamente 8 dígitos";
          }
          break;
        case "phone":
          if (value && !this.validatePhone(value)) {
            this.errors.phone =
              "El teléfono debe tener 9 dígitos y comenzar con 9 (ej: 987654321)";
          }
          break;
      }
    },
    isFormValid() {
      // Validar todos los campos requeridos
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "username",
        "password",
        "dni",
        "phone",
      ];
      const hasAllRequiredFields = requiredFields.every(
        (field) => this.formData[field]
      );

      // Validar formatos específicos
      const isEmailValid = this.validateEmail(this.formData.email);
      const isDNIValid = this.validateDNI(this.formData.dni);
      const isPhoneValid = this.validatePhone(this.formData.phone);

      return hasAllRequiredFields && isEmailValid && isDNIValid && isPhoneValid;
    },
    submitForm() {
      // Validar todos los campos antes de enviar
      this.validateField("email", this.formData.email);
      this.validateField("dni", this.formData.dni);
      this.validateField("phone", this.formData.phone);

      if (this.isFormValid()) {
        this.$emit("save", this.formData); // Emite el formulario completo
      }
    },
    cancel() {
      this.$emit("cancel"); // Emite el evento de cancelar
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 20px;
}

.form-field {
  display: flex;
  gap: 10px;
  margin-bottom: 1em;
}

.input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.error-message {
  color: #dc3545;
  font-size: 0.8em;
  margin-top: 0.25em;
  min-height: 1.2em;
}

.form-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
