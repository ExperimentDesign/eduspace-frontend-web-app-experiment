import http from "../../shared/services/http-common.js";

export class ReportService {
    resourceEndpoint = '/reports';

    /**
     * Get all reports
     * GET /api/v1/reports
     */
    getAll() {
        return http.get(this.resourceEndpoint);
    }

    /**
     * Get reports by resource ID
     * GET /api/v1/reports/resources/{resourceId}
     */
    getByResourceId(resourceId) {
        return http.get(`${this.resourceEndpoint}/resources/${resourceId}`);
    }

    /**
     * Create a report
     * POST /api/v1/reports
     */
    create(reportData) {
        return http.post(this.resourceEndpoint, reportData);
    }
}