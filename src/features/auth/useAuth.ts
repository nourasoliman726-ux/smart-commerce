import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../store/hooks";
import { loginSuccess } from "./authSlice";
import { authService } from "../../services/authService";
import type { LoginFormData, RegisterFormData } from "./authSchemas";


export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const result = await authService.login(data.email, data.password);
      dispatch(loginSuccess(result));
      toast.success(`Welcome back, ${result.user.name}! 👋`);
      navigate(result.user.role === "admin" ? "/dashboard" : "/");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const result = await authService.register(
        data.name,
        data.email,
        data.password
      );
      dispatch(loginSuccess(result));
      toast.success(`Welcome, ${result.user.name}! 🎉`);
      navigate("/onboarding");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading };
};