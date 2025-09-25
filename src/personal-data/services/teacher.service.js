import http from "../../shared/services/http-common.js";
import { RegisterTeacher } from "../model/register-teacher.entity.js";

export class TeacherService {
  static async fetchTeachers() {
    try {
      const response = await http.get("/teachers-profiles");
      return response.data;
    } catch (error) {
      throw new Error(
        "Error al obtener la lista de profesores: " +
          (error.message || "Error desconocido")
      );
    }
  }

  static async addTeacher(teacherData) {
    // Crear instancia del modelo RegisterTeacher
    const registerTeacher = new RegisterTeacher(teacherData);

    // Validar los datos antes de enviar
    if (!registerTeacher.isValid()) {
      const errors = registerTeacher.getValidationErrors();
      const errorMessages = Object.values(errors).join(", ");
      throw new Error(`Datos inválidos: ${errorMessages}`);
    }

    try {
      const response = await http.post("/teachers-profiles", registerTeacher);
      return response.data;
    } catch (error) {
      // Handle specific validation errors from server
      if (error.response && error.response.status === 400) {
        throw new Error(
          "Error de validación: " +
            (error.response.data.message || "Datos inválidos")
        );
      } else if (error.response && error.response.status === 409) {
        throw new Error(
          "El profesor ya existe o hay un conflicto con los datos proporcionados"
        );
      }
      throw new Error(
        "Error al registrar profesor: " + (error.message || "Error desconocido")
      );
    }
  }
}
