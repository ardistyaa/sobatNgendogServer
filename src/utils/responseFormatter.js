export const formatSuccess = (data) => ({
  success: true,
  data
});

export const formatError = (message) => ({
  success: false,
  error: message
});
