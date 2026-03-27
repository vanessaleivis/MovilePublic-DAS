import { request } from './api';

export type DetalleVenta = {
  DetalleVentaId: string;
  VentaId: string;
  TipoItem: 'producto' | 'servicio';
  ProductoId: string | null;
  ServicioId: string | null;
  NombreSnapshot: string;
  Cantidad: number;
  PrecioUnitario: number;
  Descuento: number;
  Subtotal: number;
  ColorId: string | null;
  DescripcionPersonalizada: string | null;
};

export type Venta = {
  VentaId: string;
  Origen: 'pedido' | 'manual';
  PedidoClienteId: string | null;
  ClienteId: string;
  ClienteNombre: string;
  ClienteTelefono: string;
  ClienteCorreo: string;
  UsuarioVendedorId: string;
  FechaVenta: string;
  Subtotal: number;
  IVA: number;
  Total: number;
  Estado: 'pagado' | 'anulado' | 'pendiente';
  MotivoAnulacion: string | null;
  Voucher: string | null;
};

export const ventasService = {
  getVentas: () => request<Venta[]>('/ventas'),
  getVentaById: (id: string) => request<Venta>(`/ventas/${id}`),
  getDetallesByVentaId: (id: string) => request<DetalleVenta[]>(`/ventas/${id}/detalles`),
  getWeeklyReport: () => request<any>('/ventas/reporte/semanal'),
  getMonthlyReport: () => request<any>('/ventas/reporte/mensual'),
};


