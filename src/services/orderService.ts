import api from "./axios";
import type { Order, CartItem, ShippingAddress } from "../types";

export const orderService = {
  async create(
    userId: string,
    items: CartItem[],
    shippingAddress: ShippingAddress,
    total: number
  ): Promise<Order> {
    const order: Omit<Order, "id"> = {
      userId,
      items,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      shippingAddress,
    };

    const { data } = await api.post<Order>("/orders", {
      ...order,
      id: Date.now().toString(),
    });
    return data;
  },

  async getByUser(userId: string): Promise<Order[]> {
    const { data } = await api.get<Order[]>(`/orders?userId=${userId}`);
    return data;
  },

  async getAll(): Promise<Order[]> {
    const { data } = await api.get<Order[]>("/orders");
    return data;
  },

  async updateStatus(id: string, status: Order["status"]): Promise<Order> {
    const { data } = await api.patch<Order>(`/orders/${id}`, { status });
    return data;
  },
  async deleteOrder(id: string): Promise<void> {
  await api.delete(`/orders/${id}`);
},
};

