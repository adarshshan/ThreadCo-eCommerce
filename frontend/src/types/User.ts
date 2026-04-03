export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role?: "user" | "admin";
  status?: "active" | "blocked";
  token?: string;
  refreshToken?: string;
}
