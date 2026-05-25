import api from "./api";

/*
|--------------------------------------------------------------------------
| GET USERS
|--------------------------------------------------------------------------
*/
export const getUsers = async (params = {}) => {
  const response = await api.get(
    "/super-admin/users",
    {
      params,
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| CREATE USER
|--------------------------------------------------------------------------
*/
export const createUser = async (data) => {
  const response = await api.post(
    "/super-admin/users",
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
*/
export const updateUser = async (id, data) => {
  const response = await api.put(
    `/super-admin/users/${id}`,
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
*/
export const deleteUser = async (id) => {
  const response = await api.delete(
    `/super-admin/users/${id}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| TOGGLE STATUS
|--------------------------------------------------------------------------
*/
export const toggleUserStatus = async (id) => {
  const response = await api.patch(
    `/super-admin/users/${id}/toggle-status`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| RESET PASSWORD
|--------------------------------------------------------------------------
*/
export const resetUserPassword = async (id) => {
  const response = await api.post(
    `/super-admin/users/${id}/reset-password`
  );

  return response.data;
};