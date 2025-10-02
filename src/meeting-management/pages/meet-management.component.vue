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
            id: meetData.meetingId,
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
        console.error("Error :", error);
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
  <div class="meet-management-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="pi pi-calendar"></i>
        </div>
        <div class="header-text">
          <h1>Meeting Management</h1>
          <p>Schedule and organize meetings with teachers</p>
        </div>
      </div>
    </div>

    <div class="data-table-wrapper">
      <data-manager
          :title="title"
          :items="meetings"
          @new-item-requested="onNewItem"
          @edit-item-requested="onEditItem($event)"
          @delete-item-requested="onDeleteItem($event)">

        <template #custom-columns>
          <pv-column field="id" header="ID" :sortable="true" style="min-width: 80px"></pv-column>
          <pv-column field="title" header="Title" :sortable="true" style="min-width: 200px"></pv-column>
          <pv-column field="description" header="Description" style="min-width: 250px"></pv-column>
          <pv-column field="day" header="Date" :sortable="true" style="min-width: 120px">
            <template #body="slotProps">
              <div class="date-cell">
                <i class="pi pi-calendar-plus"></i>
                <span>{{ slotProps.data.day }}</span>
              </div>
            </template>
          </pv-column>
          <pv-column field="start" header="Start" style="min-width: 100px">
            <template #body="slotProps">
              <div class="time-cell">
                <i class="pi pi-clock"></i>
                <span>{{ slotProps.data.start }}</span>
              </div>
            </template>
          </pv-column>
          <pv-column field="end" header="End" style="min-width: 100px">
            <template #body="slotProps">
              <div class="time-cell">
                <i class="pi pi-clock"></i>
                <span>{{ slotProps.data.end }}</span>
              </div>
            </template>
          </pv-column>
          <pv-column field="classroom.name" header="Classroom" :sortable="true" style="min-width: 150px">
            <template #body="slotProps">
              <div class="classroom-cell">
                <i class="pi pi-building"></i>
                <span>{{ slotProps.data.classroom?.name || 'N/A' }}</span>
              </div>
            </template>
          </pv-column>
          <pv-column field="administrator.firstName" header="Organizer" :sortable="true" style="min-width: 150px">
            <template #body="slotProps">
              <div class="organizer-cell">
                <i class="pi pi-user"></i>
                <span>{{ slotProps.data.administrator?.firstName || 'N/A' }}</span>
              </div>
            </template>
          </pv-column>
          <pv-column header="Participants" style="min-width: 200px">
            <template #body="slotProps">
              <div class="participants-cell">
                <i class="pi pi-users"></i>
                <span v-if="slotProps.data.teachers && slotProps.data.teachers.length" class="participants-list">
                  {{ slotProps.data.teachers.map(t => t.firstName).join(', ') }}
                </span>
                <span v-else class="no-participants">No teachers</span>
              </div>
            </template>
          </pv-column>
        </template>
      </data-manager>
    </div>

    <meet-create-and-edit-dialog
        :item="meet"
        :visible="createAndEditDialogIsVisible"
        :edit="isEdit"
        @update:visible="value => createAndEditDialogIsVisible = value"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />

    <pv-toast />
  </div>
</template>

<style scoped>
.meet-management-page {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon i {
  font-size: 3rem;
  color: white;
}

.header-text h1 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 2rem;
  font-weight: 600;
}

.header-text p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

.data-table-wrapper {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.date-cell,
.time-cell,
.classroom-cell,
.organizer-cell,
.participants-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-cell i {
  color: #667eea;
}

.time-cell i {
  color: #f093fb;
}

.classroom-cell i {
  color: #4facfe;
}

.organizer-cell i {
  color: #43e97b;
}

.participants-cell i {
  color: #fa709a;
}

.participants-list {
  color: #495057;
  font-weight: 500;
}

.no-participants {
  color: #adb5bd;
  font-style: italic;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  padding: 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: #f8f9fa;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-bottom: 1px solid #f1f3f5;
}

@media (max-width: 768px) {
  .meet-management-page {
    padding: 1rem;
  }

  .page-header {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .header-text h1 {
    font-size: 1.5rem;
  }

  .header-text p {
    font-size: 1rem;
  }

  .data-table-wrapper {
    padding: 1rem;
    overflow-x: auto;
  }
}
</style>