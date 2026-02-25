import api from '../../api/axios';
import type { AuthResponse, User } from '../../types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },

  register: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', { email, password });
    return res.data;
  },

me: async (token?: string): Promise<User> => {
  const res = await api.get<User>('/users/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
},
};