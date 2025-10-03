import http from "../../shared/services/http-common.js";

export class ClassroomService {
    resourceEndpoint = '/classrooms';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(classroomResource) {
        return http.post(this.resourceEndpoint, classroomResource);
    }

    update(id, classroomResource) {
        return http.put(`${this.resourceEndpoint}/${id}`, classroomResource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    findByName(name) {
        return http.get(`${this.resourceEndpoint}?name=${name}`);
    }
}
