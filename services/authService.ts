import { request } from './api';

export type User = {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
};

export const authService = {
  login: (correo: string, contrasena: string) => 
    request<{ user: User, token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, contrasena }),
    }),
};
