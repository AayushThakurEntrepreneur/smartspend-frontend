import API from './api';

export const loginUser = async (formData) => {
  const response = await API.post('/api/users/login', formData);
  return response.data;
};

export const registerUser = async (formData) => {
  const response = await API.post('/api/users/register', formData);
  return response.data;
};
