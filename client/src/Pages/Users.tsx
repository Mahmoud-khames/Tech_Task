import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import { User } from "../types/types";
import { useAuth } from "../context/AuthWrapper";

export default function Users() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  console.log(users);

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully!");
      queryClient.invalidateQueries(["users"]);
      setIsOpen(false);
      setNewUser({ username: "", email: "", role: "", password: "" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedUser: User) => updateUser(updatedUser._id, updatedUser),
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries(["users"]);
      setIsOpen(false);
      setEditingUser(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newUser.username ||
      !newUser.email ||
      (!editingUser && !newUser.password)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingUser) {
      updateMutation.mutate({ ...editingUser, ...newUser });
    } else {
      createMutation.mutate(newUser);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "",
    });
    setIsOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        {user?.role === "admin" && (
          <button
            onClick={() => {
              setIsOpen(true);
              setNewUser({
                username: "",
                email: "",
                role: "",
                password: "",
              })
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingUser(null);
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold">
            {editingUser ? "Edit User" : "Create New User"}
          </h3>

          <div>
            <label className="block mb-2">Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2">Role</label>
            <select
              className="w-full p-2 border rounded"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              disabled={user?.role !== "admin"}
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">
              {editingUser ? "New Password (optional)" : "Password"}
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              required={!editingUser}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingUser ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {isLoading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error loading users</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-3 px-6 border-b">Username</th>
              <th className="py-3 px-6 border-b">Email</th>
              <th className="py-3 px-6 border-b">Role</th>
              {user?.role === "admin" && (
                <th className="py-3 px-6 border-b">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users?.map((user: User) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-3 px-6 border-b">{user.username}</td>
                <td className="py-3 px-6 border-b">{user.email}</td>
                <td className="py-3 px-6 border-b capitalize">{user.role}</td>
                { (
                  <td className="py-3 px-6 border-b ">
                    <div className="flex gap-2 items-center justify-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
