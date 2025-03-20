import axios from "axios";

const API_URL = "http://localhost:4000/api";

const getToken = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).token : null;
};

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const login = async (email: string, password: string) => {
  const response = await api.post(`/auth/login`, { email, password });
  return response.data;
};

const register = async (
  username: string,
  email: string,
  password: string,
  role: string = "user"
) => {
  const response = await api.post(`/auth/register`, {
    username,
    email,
    password,
    role,
  });
  return response.data;
};
const getTasks = async () => {
  const response = await api.get(`/tasks`);
  return response.data.tasks; 
};
const createTask = async (task: { title: string; description: string; assignedTo: string[] }) => {
  const response = await api.post(`/tasks`, task);
  return response.data.task; // ✅ إرجاع المهمة الجديدة فقط
};

const updateTask = (
  taskId: string,
  task: {
    title?: string;
    description?: string;
    status?: string;
    assignedTo?: string[];
  }
) => api.patch(`/tasks/${taskId}`, task);
const deleteTask = (taskId: string) => api.delete(`/tasks/${taskId}`);
const getUsers = async () => {
  const response = await api.get(`/auth/users`);
  return response.data.users; 
};


const createUser = async (user: { username: string; email: string; password: string; role: string }) => {
  const response = await api.post(`/auth/users`, user);
  return response.data.user; 
};


const updateUser = async (userId: string, updatedUser: { username?: string; email?: string; role?: string; password?: string }) => {
  const response = await api.patch(`/auth/users/${userId}`, updatedUser); 
  return response.data.data; 
};
  

const deleteUser = async (userId: string) => {
  const response = await api.delete(`/auth/users/${userId}`);
  return response.data.message; 
};
const changePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
  const response = await api.post(`/auth/change-password`, passwordData);
  return response.data;
};

export {
  login,
  register,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};

