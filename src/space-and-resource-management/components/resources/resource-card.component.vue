<script>
export default {
  name: "resource-card",
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },
  methods: {
    editResource() {
      this.$emit("edit", this.resource.id);
    },
    deleteResource() {
      this.$emit("delete", this.resource.id);
    },
  },
};
</script>

<template>
  <div class="card border-round-xl shadow-2 p-3 h-full">
    <div class="text-xl font-semibold mb-2">{{ resource.name }}</div>
    <div class="mb-2">
      <span class="font-medium text-600">Type: {{ resource.kindOfResource }}</span>
    </div>
    <div class="text-md text-gray-700">
      Assigned to Classroom: {{ resource.classroom.name }}
    </div>
    <div class="flex align-items-center gap-2 mb-3 mt-3">
      <i class="pi pi-box text-yellow-500"></i>
      <span>Resource</span>
    </div>
    <div class="card-buttons">
      <pv-button label="Edit" severity="info" text raised class="w-full" @click="editResource"/>
      <pv-button label="Delete" severity="danger" text raised class="w-full" @click="deleteResource"/>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-buttons {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}
</style>