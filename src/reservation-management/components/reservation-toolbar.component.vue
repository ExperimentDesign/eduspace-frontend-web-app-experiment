<script>


export default {
  name: "reservation-toolbar",

  props: {
    sharedAreas: {type: Array, required: true}
  },
  data() {
    return {
      selectedItem: null
    }
  },
  watch: {
    selectedItem(newValue) {
      console.log('selected item:', newValue);
    }
  },
  methods: {
    onSharedSpaceSelected(item) {
      if(item) {
        console.log('enviando evento', item)
        this.$emit('shared-space-selected', item);
      } else {
        console.warn("No space selected");
      }

    }
  }
}
</script>

<template>
  <pv-toolbar class="mb-4">
    <template #start>
      <pv-select
          v-model="selectedItem"
          :options="sharedAreas"
          optionLabel="name"
          placeholder="Select a Space"
          checkmark
          :highlightOnSelect="false"
          class="w-full md:w-56"
      />
      <pv-button label="Search"
                 icon="pi pi-search"
                 @click="onSharedSpaceSelected(this.selectedItem)"
                 iconPos="left"
                 class="ml-2"
      />
    </template>
  </pv-toolbar>
</template>

<style scoped>

</style>