import http from "../../shared/services/http-common.js";

export class ReservationService {

    /**
     * Get all reservations
     * GET /reservations
     */
    getAll() {
        return http.get('/reservations');
    }

    /**
     * Create a reservation for a specific teacher and area
     * POST /teachers/{teacherId}/areas/{areaId}/reservations
     */
    create(teacherId, areaId, reservation) {
        return http.post(
            `/teachers/${teacherId}/areas/${areaId}/reservations`,
            reservation
        );
    }

    /**
     * Get all reservations for a specific area
     * GET /areas/{areaId}/reservations
     */
    findAllByAreaId(areaId) {
        return http.get(`/areas/${areaId}/reservations`);
    }
}