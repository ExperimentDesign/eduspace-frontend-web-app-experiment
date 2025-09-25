export class RegisterTeacher {
  constructor({
    firstName,
    lastName,
    email,
    dni,
    address,
    phone,
    administratorId,
    username,
    password,
    role,
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.dni = dni;
    this.address = address;
    this.phone = phone;
    this.administratorId = administratorId;
    this.username = username;
    this.password = password;
    this.role = role || "teacher";
  }

  /**
   * Validates email format
   * @param {string} email
   * @returns {boolean}
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates Peruvian DNI format (8 digits)
   * @param {string} dni
   * @returns {boolean}
   */
  static validateDNI(dni) {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
  }

  /**
   * Validates Peruvian phone format (9 digits starting with 9)
   * @param {string} phone
   * @returns {boolean}
   */
  static validatePhone(phone) {
    const phoneRegex = /^9\d{8}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validates the teacher registration data
   * @returns {boolean} - True if all required fields are present and valid
   */
  isValid() {
    // Check required fields
    const hasRequiredFields = !!(
      this.firstName &&
      this.lastName &&
      this.email &&
      this.username &&
      this.password &&
      this.dni &&
      this.phone
    );

    if (!hasRequiredFields) {
      return false;
    }

    // Validate formats
    const isEmailValid = RegisterTeacher.validateEmail(this.email);
    const isDNIValid = RegisterTeacher.validateDNI(this.dni);
    const isPhoneValid = RegisterTeacher.validatePhone(this.phone);

    return isEmailValid && isDNIValid && isPhoneValid;
  }

  /**
   * Gets validation errors for the teacher registration
   * @returns {Object} - Object containing validation error messages
   */
  getValidationErrors() {
    const errors = {};

    if (!this.firstName) errors.firstName = "El nombre es requerido";
    if (!this.lastName) errors.lastName = "El apellido es requerido";
    if (!this.username) errors.username = "El nombre de usuario es requerido";
    if (!this.password) errors.password = "La contraseña es requerida";
    if (!this.address) errors.address = "La dirección es requerida";

    if (!this.email) {
      errors.email = "El email es requerido";
    } else if (!RegisterTeacher.validateEmail(this.email)) {
      errors.email = "Ingrese un email válido";
    }

    if (!this.dni) {
      errors.dni = "El DNI es requerido";
    } else if (!RegisterTeacher.validateDNI(this.dni)) {
      errors.dni = "El DNI debe tener exactamente 8 dígitos";
    }

    if (!this.phone) {
      errors.phone = "El teléfono es requerido";
    } else if (!RegisterTeacher.validatePhone(this.phone)) {
      errors.phone = "El teléfono debe tener 9 dígitos y comenzar con 9";
    }

    return errors;
  }
}
