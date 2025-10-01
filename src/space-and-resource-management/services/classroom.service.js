import http from "../../shared/services/http-common.js";
import {TeacherService} from "../../personal-data/services/teacher.service.js";

export class ClassroomService {
    endpoint = '/classrooms';

    getAll() {
        return http.get(this.endpoint);
    }

    getById(id) {
        return http.get(`${this.endpoint}/${id}`);
    }

    create(classroomData) {
        const { name, description, teacherId } = classroomData;

        if (!teacherId) {
            return Promise.reject(new Error("Teacher ID is required."));
        }

        const url = `${this.endpoint}/teachers/${teacherId}`;
        const payload = { name, description };

        return http.post(url, payload);
    }

    update(id, classroomData) {
        return http.put(`${this.endpoint}/${id}`, classroomData);
    }

    delete(id) {
        return http.delete(`${this.endpoint}/${id}`);
    }

    async getAllClassroomsWithTeacherNames() {
        const [classroomsResponse, teachers] = await Promise.all([
            this.getAll(),
            TeacherService.fetchTeachers()
        ]);

        return classroomsResponse.data.map(classroom => {
            const teacher = teachers.find(t => t.id === classroom.teacherId);
            return {
                ...classroom,
                teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned',
            };
        });
    }
}