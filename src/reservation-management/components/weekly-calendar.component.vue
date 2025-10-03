<script>
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: "weekly-calendar",
  props: {
    events: { type: Array, required: true },
    areaId: { type: Number, required: true },
    userId: { type: Number, required: true }
  },
  computed: {
    calendarOptions() {
      return {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek'
        },
        events: this.events,
        initialView: 'timeGridWeek',
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        height: 'auto',
        slotMinTime: '06:00:00',
        slotMaxTime: '22:00:00',
        selectConstraint: {
          start: new Date()
        },
        validRange: {
          start: new Date()
        },
        businessHours: {
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          startTime: '07:00',
          endTime: '20:00'
        }
      }
    }
  },
  data() {
    return {
      currentEvents: []
    }
  },
  methods: {
    handleDateSelect(selectInfo) {
      // Emit event to parent component to open dialog
      this.$emit('date-selected', {
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });

      // Unselect the date range
      selectInfo.view.calendar.unselect();
    },

    handleEventClick(clickInfo) {
      const event = clickInfo.event;

      // Just show event info since we don't have delete endpoint
      alert(`Reserva: ${event.title}\nInicio: ${event.start.toLocaleString('es-ES')}\nFin: ${event.end.toLocaleString('es-ES')}`);
    },

    handleEvents(events) {
      this.currentEvents = events;
    }
  }
}
</script>

<template>
  <div class='demo-app'>
    <div class='demo-app-main'>
      <fc-calendar
          class='demo-app-calendar'
          :options='calendarOptions'
      >
        <template v-slot:eventContent='arg'>
          <div class="fc-event-main-frame">
            <div class="fc-event-time">{{ arg.timeText }}</div>
            <div class="fc-event-title-container">
              <div class="fc-event-title">{{ arg.event.title }}</div>
            </div>
          </div>
        </template>
      </fc-calendar>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc-event-main-frame {
  padding: 2px;
}

.fc-event-time {
  font-weight: bold;
}

.fc-event-title {
  font-style: italic;
}
</style>