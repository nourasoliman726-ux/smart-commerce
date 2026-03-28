import api from "./axios";
import type { User } from "../types";

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // json-server بيرجع array - بنفلتر manually
    const { data } = await api.get<User[]>(`/users?email=${email}`);
    const user = data[0] as any;

    if (!user || user.password !== password) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...safeUser } = user;
    const token = `fake-token-${user.id}-${Date.now()}`;

    return { user: safeUser as User, token };
  },

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    // تحقق إن الإيميل مش موجود
    const { data: existing } = await api.get(`/users?email=${email}`);
    if (existing.length > 0) {
      throw new Error("Email already exists");
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: "user" as const,
      interests: [],
    };

    const { data } = await api.post("/users", newUser);
    const { password: _, ...safeUser } = data;
    const token = `fake-token-${data.id}-${Date.now()}`;

    return { user: safeUser as User, token };
  },
};