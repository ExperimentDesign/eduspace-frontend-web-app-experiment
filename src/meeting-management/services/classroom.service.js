import http from "../../shared/services/http-common.js";

export class ClassroomsService  {
    resourceEndpoint = '/classrooms';

    getAllClassrooms() {
        return http.get(this.resourceEndpoint);
    }
}