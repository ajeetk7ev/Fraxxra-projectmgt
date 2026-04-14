export const handleApiError = (error) => {
  const response = error.response?.data;
  if (response?.errors) {
    if (typeof response.errors === "object" && !Array.isArray(response.errors)) {
      const firstField = Object.keys(response.errors)[0];
      if (firstField && response.errors[firstField].length > 0) {
        return { success: false, message: response.errors[firstField][0] };
      }
    }
    if (Array.isArray(response.errors) && response.errors.length > 0) {
      return { success: false, message: response.errors[0] };
    }
  }
  return { success: false, message: response?.message || error.message || "An error occurred" };
};
