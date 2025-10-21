import { unwrapValue } from '../../shared/utils/value-object-unwrapper.js';

export class Meet {
    constructor({
                    meetingId = 0,
                    title = '',
                    description = '',
                    date = '',
                    start = '',
                    end = '',
                    administratorId = null,
                    classroomId = null,
                    classroom = null,
                    administrator = null,
                    teachers = []
                }) {
        this.meetingId = meetingId;
        this.title = title;
        this.description = description;
        this.date = date;
        this.start = start;
        this.end = end;
        this.administratorId = unwrapValue(administratorId);
        this.classroomId = unwrapValue(classroomId);
        this.classroom = classroom;
        this.administrator = administrator;
        this.teachers = teachers || [];
    }
}