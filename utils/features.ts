const BASE_URL = "https://memoize-server.vercel.app/api";

// @url /user/check-username-availability
// @method POST
// @param {string} username
// @returns {Promise}
// @protected false
// @description Check if username is available
export const checkUsernameAvailability = async (
  username: String,
): Promise<Object> => {
  const response = await fetch(`${BASE_URL}/user/check-username-availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  return await response.json();
};

// @url /user/check-email-availability
// @method POST
// @param {string} email
// @returns {Promise}
// @protected false
// @description Check if email is available
export const checkEmailAvailability = async (
  email: String,
): Promise<Object> => {
  const response = await fetch(`${BASE_URL}/user/check-email-availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return await response.json();
};

// @url /user/login
// @method POST
// @param {string} identifier, {string} password
// @returns {Promise}
// @protected false
// @description Login a user
export const loginUser = async ({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, password }),
  });
  return await response.json();
};

// @url /user/register
// @method POST
// @param {string} username, {string} email, {string} password
// @returns {Promise}
// @protected false
// @description Register a new user
export const registerUser = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  return await response.json();
};

// @url /user/update-avatar
// @method PUT
// @param {string} avatar, {string} token
// @returns {Promise}
// @protected true
// @description Update user's avatar
export const updateAvatar = async (avatar: string, token: string) => {
  const response = await fetch(`${BASE_URL}/user/update-avatar`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ avatar }),
  });
  return await response.json();
};

// @url /note/push
// @method PUT
// @param {Array} notes, {string} token
// @returns {Promise}
// @protected true
// @description Push notes to server
export const syncNotes = async (notes: Array<Object>, token: string) => {
  const response = await fetch(`${BASE_URL}/note/sync`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  });
  return await response.json();
};

// @url /user/sync
// @method PUT
// @param {object} user, {string} token
// @returns {Promise}
// @protected true
// @description Push user data to server
export const syncUserData = async (user: Object, token: string) => {
  const response = await fetch(`${BASE_URL}/user/sync`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user }),
  });
  return await response.json();
};

// @url /user/send-reset-password
// @method POST
// @param {string} email
// @returns {Promise}
// @protected false
// @description Send reset password email
export const sendResetPasswordEmail = async (email: string) => {
  const response = await fetch(`${BASE_URL}/user/send-reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return await response.json();
};

// @url /user/update-username
// @method PUT
// @param {string} username, {string} token
// @returns {Promise}
// @protected true
// @description Update user's username
export const updateUsername = async (username: string, token: string) => {
  const response = await fetch(`${BASE_URL}/user/update-username`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  return await response.json();
};

// @url /user/update-email
// @method PUT
// @param {string} email, {string} token
// @returns {Promise}
// @protected true
// @description Update user's email
export const updateEmail = async (email: string, token: string) => {
  const response = await fetch(`${BASE_URL}/user/update-email`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return await response.json();
};

// @url /user/update-password
// @method PUT
// @param {string} password, {string} token
// @returns {Promise}
// @protected true
// @description Update user's password
export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
  token: string,
) => {
  const response = await fetch(`${BASE_URL}/user/update-password`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return await response.json();
};

// @url /user/delete-user
// @method DELETE
// @param {string} token
// @returns {Promise}
// @protected true
// @description Delete user account
export const deleteUser = async (token: string) => {
  const response = await fetch(`${BASE_URL}/user/delete-user`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
