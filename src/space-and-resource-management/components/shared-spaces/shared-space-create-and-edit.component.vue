<script>
export default {
  name: "shared-space-create-and-edit",
  props: {
    shared_space: {
      type: Object,
      required: true,
      default: () => ({
        name: "",
        capacity: 0,
        description: "",
      }),
    },
    isCreateMode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      form: { ...this.shared_space },
    };
  },
  methods: {
    save() {
      if (
        !this.form.name ||
        !this.form.capacity ||
        !this.form.description
      ) {
        alert("Please fill in all fields.");
        return;
      }
      this.$emit("save", this.form);
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<template>
  <div class="breadcrumb" style="display: flex; align-items: center">
    <h4 style="margin-right: 20px">Classrooms and Shared Spaces</h4>
    <i class="pi pi-chevron-right"></i>
    <h4 style="margin-left: 20px">Shared Spaces</h4>
    <i class="pi pi-chevron-right"></i>
    <h4 style="margin-left: 20px">
      {{ isCreateMode ? "Add Shared Space" : "Edit Shared Space" }}
    </h4>
  </div>

  <div class="shared-space-create-form">
    <div class="form-header">
      <h2>{{ isCreateMode ? "Create Shared Space" : "Edit Shared Space" }}</h2>
    </div>
    <form @submit.prevent="save" class="form-grid">
      <div class="form-field">
        <pv-float-label>Name:</pv-float-label>
        <pv-input-text v-model="form.name" placeholder="Enter name" />
      </div>

      <div class="form-field">
        <pv-float-label>Capacity:</pv-float-label>
        <pv-input-number
          v-model.number="form.capacity"
          :min="0"
          placeholder="Enter capacity"
        />
      </div>

      <div class="form-field">
        <pv-float-label>Description:</pv-float-label>
        <pv-input-text
          v-model="form.description"
          placeholder="Enter description"
        />
      </div>

      <div class="form-actions">
        <pv-button type="submit" label="Save" class="p-button-success" />
        <pv-button
          type="button"
          label="Cancel"
          class="p-button-secondary"
          @click="cancel"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.shared-space-create-form {
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  margin-top: 50px;
  color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.form-header {
  color: black;
  font-weight: bold;
}

.form-grid {
  display: flex;
  flex-direction: column;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
