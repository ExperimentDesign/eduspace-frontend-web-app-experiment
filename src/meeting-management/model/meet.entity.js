// Archivo: meet.entity.js
export class Meet {
    constructor({
                    id = 0,
                    title = '',
                    description = '',
                    day = '',
                    start = '',
                    end = '',
                    classroom = null,
                    administrator = null,
                    teachers = []
                }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.day = day;
        this.start = start;
        this.end = end;
        this.classroom = classroom;
        this.administrator = administrator;
        this.teachers = teachers;
    }
}