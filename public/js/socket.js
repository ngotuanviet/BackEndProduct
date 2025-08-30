// Initialize socket with auth token (current user id)
const socket = io({
  auth: {
    token: typeof window !== "undefined" && window.CURRENT_USER_ID ? window.CURRENT_USER_ID : "",
  },
});
