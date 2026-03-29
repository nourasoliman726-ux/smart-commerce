import type { User } from "../types";

// Default users
const DEFAULT_USERS = [
  {
    id: "1",
    name: "Ahmed Mohamed",
    email: "ahmed@test.com",
    password: "123456",
    role: "admin" as const,
    interests: ["electronics", "fashion"],
  },
  {
    id: "2",
    name: "Sara Ali",
    email: "sara@test.com",
    password: "123456",
    role: "user" as const,
    interests: ["beauty", "home"],
  },
];

// Initialize users in localStorage if not exists
const initUsers = () => {
  const existing = localStorage.getItem("db_users");
  if (!existing) {
    localStorage.setItem("db_users", JSON.stringify(DEFAULT_USERS));
  }
};

const getUsers = (): any[] => {
  initUsers();
  return JSON.parse(localStorage.getItem("db_users") || "[]");
};

const saveUsers = (users: any[]) => {
  localStorage.setItem("db_users", JSON.stringify(users));
};

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await new Promise((res) => setTimeout(res, 500)); // simulate network
    const users = getUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) throw new Error("Invalid email or password");
    const { password: _, ...safeUser } = found;
    const token = `fake-token-${found.id}-${Date.now()}`;
    return { user: safeUser as User, token };
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    await new Promise((res) => setTimeout(res, 500));
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
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
    saveUsers([...users, newUser]);
    const { password: _, ...safeUser } = newUser;
    const token = `fake-token-${newUser.id}-${Date.now()}`;
    return { user: safeUser as User, token };
  },
};