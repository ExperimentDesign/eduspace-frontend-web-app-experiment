<script>
import { Meet } from "../model/meet.entity.js";
import DataManager from "../../shared/components/data-meet.component.vue";
import MeetCreateAndEditDialog from "../components/meet-create-and-edit.component.vue";
import { MeetService } from "../services/meet.service.js";
import { ClassroomsService } from "../services/classroom.service.js";
import { AdministratorsService } from "../services/administrators.service.js";


export default {
  name: "meet-management",
  components: { MeetCreateAndEditDialog, DataManager },
  data() {
    return {
      title: { singular: 'Meet', plural: 'Meetings' },
      meetings: [],
      meet: new Meet({}),
      selectedMeetings: [],
      meetService: null,
      classroomsService: null,
      administratorsService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    },
    notifyErrorAction(message) {
      this.$toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    },

    async loadMeetings() {
      try {
        const [meetingsResponse, classroomsResponse, administratorsResponse] = await Promise.all([
          this.meetService.getAll(),
          this.classroomsService.getAllClassrooms(),
          this.administratorsService.getAllAdministrators()
        ]);

        const meetingsData = meetingsResponse.data;
        const allClassrooms = classroomsResponse.data;
        const allAdministrators = administratorsResponse.data;

        this.meetings = meetingsData.map(meetData => {
          const classroom = allClassrooms.find(c => c.id === meetData.classroomId?.classroomIdentifier);
          const administrator = allAdministrators.find(a => a.id === meetData.administratorId?.administratorIdentifier);

          return new Meet({
            id: meetData.meetingId, // Usa el nombre de la propiedad de la API
            title: meetData.title,
            description: meetData.description,
            day: meetData.date,
            start: meetData.start,
            end: meetData.end,
            classroom: classroom,
            administrator: administrator,
            teachers: meetData.teachers || []
          });
        });
      } catch (error) {
        console.error("Error loading and enriching meetings:", error);
        this.notifyErrorAction('Could not load meetings data.');
      }
    },

    onNewItem() {
      this.meet = new Meet({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onEditItem(item) {
      this.meet = JSON.parse(JSON.stringify(item));
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onDeleteItem(item) {
      this.meetService.delete(item.id).then(() => {
        this.meetings = this.meetings.filter(m => m.id !== item.id);
        this.notifySuccessfulAction('Meet Deleted');
      }).catch(error => {
        console.error("Error deleting meet:", error);
        this.notifyErrorAction('Could not delete meet.');
      });
    },
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
    },
    onSaveRequested(payload) {
      this.submitted = true;
      if (this.isEdit) {
        this.updateMeet(payload);
      } else {
        this.createMeet(payload);
      }
    },
    async createMeet(payload) {
      try {
        const createResponse = await this.meetService.create(
            payload.administratorId,
            payload.classroomId,
            payload.meetData
        );
        const newMeeting = createResponse.data;

        if (payload.teacherIds && payload.teacherIds.length > 0) {
          const addTeachersPromises = payload.teacherIds.map(teacherId =>
              this.meetService.addTeacherToMeeting(newMeeting.meetingId, teacherId)
          );
          await Promise.all(addTeachersPromises);
        }
        await this.loadMeetings();
        this.notifySuccessfulAction('Meet Created Successfully');
      } catch (error) {
        console.error("Error during meet creation process:", error);
        this.notifyErrorAction('An error occurred while creating the meet.');
      } finally {
        this.createAndEditDialogIsVisible = false;
      }
    },
    async updateMeet(payload) {
      try {
        payload.meetData.administratorId = this.meet.administrator?.id;
        payload.meetData.classroomId = this.meet.classroom?.id;

        await this.meetService.update(this.meet.id, payload.meetData);
        await this.loadMeetings();
        this.notifySuccessfulAction('Meet Updated Successfully');
      } catch (error) {
        console.error("Error updating meet:", error);
        this.notifyErrorAction('An error occurred while updating the meet.');
      } finally {
        this.createAndEditDialogIsVisible = false;
      }
    },
  },
  created() {
    this.meetService = new MeetService();
    this.classroomsService = new ClassroomsService();
    this.administratorsService = new AdministratorsService();
    this.loadMeetings();
  }
}
</script>

<template>
  <div class="w-full">
    <data-manager
        :title="title"
        :items="meetings"
        @new-item-requested="onNewItem"
        @edit-item-requested="onEditItem($event)"
        @delete-item-requested="onDeleteItem($event)">

      <template #custom-columns>
        <pv-column field="id" header="Id" :sortable="true"></pv-column>
        <pv-column field="title" header="Title" :sortable="true"></pv-column>
        <pv-column field="description" header="Description"></pv-column>
        <pv-column field="day" header="Day" :sortable="true"></pv-column>
        <pv-column field="start" header="Start Time"></pv-column>
        <pv-column field="end" header="End Time"></pv-column>
        <pv-column field="classroom.name" header="Classroom" :sortable="true"></pv-column>
        <pv-column field="administrator.firstName" header="Person in charge" :sortable="true"></pv-column>
        <pv-column header="Invitees">
          <template #body="slotProps">
            <span v-if="slotProps.data.teachers && slotProps.data.teachers.length">
              {{ slotProps.data.teachers.map(t => t.firstName).join(', ') }}
            </span>
            <span v-else>No teachers</span>
          </template>
        </pv-column>
      </template>
    </data-manager>

    <meet-create-and-edit-dialog
        :item="meet"
        :visible="createAndEditDialogIsVisible"
        :edit="isEdit"
        @update:visible="value => createAndEditDialogIsVisible = value"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />
  </div>
</template>

<style scoped>

</style>