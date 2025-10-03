import http from "../../shared/services/http-common.js";

export class ResourceService {
    resourceEndpoint = '/resources';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(resource) {
        return http.post(this.resourceEndpoint, resource);
    }

    update(id, resource) {
        return http.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    findByClassroom(classroomId) {
        return http.get(`${this.resourceEndpoint}?idClassroom=${classroomId}`);
    }
}
