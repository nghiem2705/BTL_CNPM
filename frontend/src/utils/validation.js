// File này chứa các hàm kiểm tra hợp lệ

/**
 * Validate date is not in the past
 * @param {string} dateString - Date string in format YYYY-MM-DD
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateDate = (dateString) => {
  if (!dateString) {
    return { valid: false, error: "Ngày không được để trống" };
  }

  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selectedDate.getTime())) {
    return { valid: false, error: "Ngày không hợp lệ" };
  }

  if (selectedDate < today) {
    return { valid: false, error: "Ngày không được ở quá khứ" };
  }

  return { valid: true, error: null };
};

/**
 * Validate time format
 * @param {string} timeString - Time string in format HH:MM
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateTime = (timeString) => {
  if (!timeString) {
    return { valid: false, error: "Thời gian không được để trống" };
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(timeString)) {
    return { valid: false, error: "Thời gian không hợp lệ (định dạng HH:MM)" };
  }

  return { valid: true, error: null };
};

/**
 * Validate duration is reasonable (between 15 minutes and 480 minutes - 8 hours)
 * @param {number|string} duration - Duration in minutes
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateDuration = (duration) => {
  if (!duration) {
    return { valid: false, error: "Thời lượng không được để trống" };
  }

  const durationNum = parseInt(duration);

  if (isNaN(durationNum)) {
    return { valid: false, error: "Thời lượng phải là số" };
  }

  if (durationNum < 15) {
    return { valid: false, error: "Thời lượng phải ít nhất 15 phút" };
  }

  if (durationNum > 480) {
    return {
      valid: false,
      error: "Thời lượng không được vượt quá 8 giờ (480 phút)",
    };
  }

  if (durationNum % 5 !== 0) {
    return { valid: false, error: "Thời lượng phải là bội số của 5" };
  }

  return { valid: true, error: null };
};

/**
 * Validate URL format
 * @param {string} url - URL string
 * @param {boolean} required - Whether the field is required
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateURL = (url, required = false) => {
  if (!url) {
    if (required) {
      return { valid: false, error: "Link không được để trống" };
    }
    return { valid: true, error: null };
  }

  try {
    new URL(url);
    return { valid: true, error: null };
  } catch {
    return { valid: false, error: "Link không hợp lệ" };
  }
};

/**
 * Validate title/name length
 * @param {string} title - Title string
 * @param {number} minLength - Minimum length (default: 3)
 * @param {number} maxLength - Maximum length (default: 200)
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateTitle = (title, minLength = 3, maxLength = 200) => {
  if (!title || title.trim() === "") {
    return { valid: false, error: "Tiêu đề không được để trống" };
  }

  if (title.trim().length < minLength) {
    return {
      valid: false,
      error: `Tiêu đề phải có ít nhất ${minLength} ký tự`,
    };
  }

  if (title.length > maxLength) {
    return {
      valid: false,
      error: `Tiêu đề không được vượt quá ${maxLength} ký tự`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate session form data for creation/update
 * @param {Object} formData - Form data object
 * @returns {Object} - {valid: boolean, errors: Object}
 */
export const validateSessionForm = (formData) => {
  const errors = {};

  // Check required fields first (simple empty check)
  if (
    !formData.title ||
    !formData.date ||
    !formData.startTime ||
    !formData.duration
  ) {
    errors.general = "Vui lòng điền đầy đủ các trường bắt buộc (*)";
  }

  // Validate title
  const titleValidation = validateTitle(formData.title);
  if (!titleValidation.valid) {
    errors.title = titleValidation.error;
  }

  // Validate date
  const dateValidation = validateDate(formData.date);
  if (!dateValidation.valid) {
    errors.date = dateValidation.error;
  }

  // Validate start time
  const timeValidation = validateTime(formData.startTime);
  if (!timeValidation.valid) {
    errors.startTime = timeValidation.error;
  }

  // Validate duration
  const durationValidation = validateDuration(formData.duration);
  if (!durationValidation.valid) {
    errors.duration = durationValidation.error;
  }

  // Validate online/offline specific fields
  if (formData.isOnline) {
    const urlValidation = validateURL(formData.meetLink, false);
    if (!urlValidation.valid && formData.meetLink) {
      errors.meetLink = urlValidation.error;
    }
  } else {
    if (!formData.location || formData.location.trim() === "") {
      errors.location = "Địa điểm không được để trống khi học offline";
    }
  }

  // Validate combined date and time
  if (formData.date && formData.startTime) {
    const sessionDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const now = new Date();

    if (sessionDateTime < now) {
      errors.dateTime = "Thời gian buổi học phải ở tương lai";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Format API error messages for display
 * @param {Error|Object} error - Error object or response
 * @returns {string} - Formatted error message
 */
export const formatApiError = (error) => {
  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.error) {
    return error.error;
  }

  return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
};

/**
 * Display validation errors
 * @param {Object} errors - Errors object from validation
 * @returns {string} - Formatted error string for display
 */
export const displayValidationErrors = (errors) => {
  const errorMessages = Object.values(errors);
  if (errorMessages.length === 0) return "";

  if (errorMessages.length === 1) {
    return errorMessages[0];
  }

  return (
    "Vui lòng kiểm tra:\n" +
    errorMessages.map((msg, idx) => `${idx + 1}. ${msg}`).join("\n")
  );
};
