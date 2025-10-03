import http from "../../shared/services/http-common.js";

export class ReportService {
    resourceEndpoint = '/reports';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(reportResource) {
        // Deja que json-server maneje el id automáticamente
        return http.post(this.resourceEndpoint, reportResource).then(response => response.data);
    }

    update(id, reportResource) {
        return http.put(`${this.resourceEndpoint}/${id}`, reportResource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    findByResource(resourceId) {
        return http.get(`${this.resourceEndpoint}?resourceId=${resourceId}`);
    }
}
