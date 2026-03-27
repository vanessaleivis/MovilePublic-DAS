import { request } from './api';

export type Pedido = {
  PedidoClienteId: string;
  ClienteId: string;
  FechaPedido: string;
  Total: number;
  Estado: 'pendiente' | 'proceso' | 'completado' | 'cancelado' | 'aprobado' | 'entregado';
  MetodoPago: string;
  NombreRecibe: string;
  TelefonoEntrega: string;
  DireccionEntrega: string;
  Voucher: string | null;
  ClienteNombre: string;
  ClienteTelefono: string;
  ClienteCorreo: string;
  TipoCliente: 'registrado' | 'walkin';
};

export const pedidosService = {
  getStats: () => request<{ pendingCount: number; todayCount: number }>('/pedidos/stats'),
  getPedidos: () => request<Pedido[]>('/pedidos'),
  getPedidoById: (id: string) => request<Pedido>(`/pedidos/${id}`),
};
