import type { Order, CartItem, ShippingAddress } from "../types";

const getOrders = (): Order[] => {
  return JSON.parse(localStorage.getItem("db_orders") || "[]");
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem("db_orders", JSON.stringify(orders));
};

export const orderService = {
  async create(
    userId: string,
    items: CartItem[],
    shippingAddress: ShippingAddress,
    total: number
  ): Promise<Order> {
    await new Promise((res) => setTimeout(res, 500));
    const order: Order = {
      id: Date.now().toString(),
      userId,
      items,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      shippingAddress,
    };
    saveOrders([...getOrders(), order]);
    return order;
  },

  async getByUser(userId: string): Promise<Order[]> {
    return getOrders().filter((o) => o.userId === userId);
  },

  async getAll(): Promise<Order[]> {
    await new Promise((res) => setTimeout(res, 300));
    return getOrders();
  },

  async updateStatus(id: string, status: Order["status"]): Promise<Order> {
    const orders = getOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Order not found");
    orders[index] = { ...orders[index], status };
    saveOrders(orders);
    return orders[index];
  },

  async deleteOrder(id: string): Promise<void> {
    saveOrders(getOrders().filter((o) => o.id !== id));
  },
};