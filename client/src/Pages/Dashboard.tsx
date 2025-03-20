import React, { useState} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getUsers,
} from "../services/api";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import { Task, User } from "../types/types";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useAuth } from "../context/AuthWrapper";

export default function Dashboard() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAssignedToOpen, setIsAssignedToOpen] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUsersError, setSelectedUsersError] = useState<string | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [editingTask, setEditingTask] = useState<Task>();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: [],
    status: "pending",
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success("Task created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsOpen(false);
      setNewTask({
        title: "",
        description: "",
        assignedTo: [],
        status: "pending",
      });
      setSelectedUsers([]);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, task }: { taskId: string; task: Partial<Task> }) =>
      updateTask(taskId, task),
    onSuccess: () => {
      toast.success("Task updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsOpen(false);
      setEditingTask(undefined);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success("Task deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    },
  });

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
    setSelectedUsersError(null);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      setSelectedUsersError("Please select at least one user.");
      return;
    }
    createMutation.mutate({ ...newTask, assignedTo: selectedUsers });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo.map((u: User) => u._id),
      status: task.status,
    });
    setSelectedUsers(task.assignedTo.map((u : User) => u._id));
    setModalMode("edit");
    setIsOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      setSelectedUsersError("Please select at least one user.");
      return;
    }
    if (editingTask) {
      updateMutation.mutate({
        taskId: editingTask._id,
        task: { ...newTask, assignedTo: selectedUsers },
      });
    }
  };

  const handleViewTask = (task: Task) => {
    setEditingTask(task);
    setModalMode("view");
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Management</h2>
      {user?.role === "admin" && (
        <button
          onClick={() => {
            setIsOpen(true);
            setModalMode("create");
            setEditingTask(undefined);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-fit mb-4 ml-auto"
        >
          Add Task
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setNewTask({
            title: "",
            description: "",
            assignedTo: [],
            status: "pending",
          });
          setSelectedUsers([]);
          setEditingTask(undefined);
          setModalMode("create");
        }}
      >
        {modalMode === "view" ? (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Task Details
            </h1>
            <div className="space-y-4">
              <div>
                <label className="font-semibold">Title:</label>
                <p className="mt-1">{editingTask?.title}</p>
              </div>
              <div>
                <label className="font-semibold">Description:</label>
                <p className="mt-1">{editingTask?.description}</p>
              </div>
              <div>
                <label className="font-semibold">Status:</label>
                <p
                  className={`w-fit mt-1 ${
                    editingTask?.status === "completed"
                      ? "bg-green-200 text-green-600"
                      : editingTask?.status === "in_progress"
                      ? "bg-yellow-200 text-yellow-600"
                      : "bg-red-200 text-red-600"
                  } px-2 py-1 rounded-full text-sm`}
                >
                  {editingTask?.status}
                </p>
              </div>
              <div>
                <label className="font-semibold">Assigned Users:</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {editingTask?.assignedTo?.map((user: User) => (
                    <span
                      key={user._id}
                      className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                    >
                      {user.username}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              {user?.role === "admin" && (
                <>
                  <button
                    onClick={() => handleEditTask(editingTask!)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(editingTask!._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={modalMode === "edit" ? handleEditSubmit : handleAddTask}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {modalMode === "edit" ? "Edit Task" : "Create Task"}
            </h1>
            <div className="flex flex-col mb-3">
              <label htmlFor="title" className="text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col mb-3">
              <label htmlFor="description" className="text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col mb-3">
              <label className="text-gray-700 mb-3">Assigned To</label>
              <div
                className="relative flex items-center border border-gray-300 p-2 rounded-md cursor-pointer mb-3"
                onClick={() => setIsAssignedToOpen(!isAssignedToOpen)}
              >
                {selectedUsers.length === 0 ? (
                  <p className="text-gray-500">Select users</p>
                ) : (
                  <p className="flex flex-wrap gap-2">
                    {selectedUsers.map((userId) => {
                      const user = users?.find(
                        (u: User) => u._id === userId
                      );
                      return user ? (
                        <span
                          key={userId}
                          className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                        >
                          {user.username}
                        </span>
                      ) : null;
                    })}
                  </p>
                )}
                <span className="ml-auto">
                  <MdKeyboardArrowDown />
                </span>
                {isAssignedToOpen && (
                  <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 p-2 shadow-lg z-50 top-10 right-0">
                    {users?.filter((u: User) => u.role === "user").map((user: User) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectUser(user._id)}
                      >
                        <p className="text-gray-900">{user.username}</p>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedUsers.length === 0 && selectedUsersError && (
                <p className="text-red-500">{selectedUsersError}</p>
              )}
            </div>
            {modalMode === "edit" && (
              <div className="flex flex-col mb-3">
                <label htmlFor="status" className="text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="border border-gray-300 p-2 rounded-md"
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                  required
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-400 text-white rounded-xs hover:bg-blue-500 cursor-pointer"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {modalMode === "edit"
                ? updateMutation.isPending
                  ? "Updating..."
                  : "Update"
                : createMutation.isPending
                ? "Processing..."
                : "Create"}
            </button>
          </form>
        )}
      </Modal>

      {isLoading && <p className="text-gray-500">Loading tasks...</p>}
      {error && <p className="text-red-500">Failed to load tasks!</p>}

      <div className="w-full overflow-auto">
        <table className="table-auto min-w-max divide-y divide-gray-200 bg-white text-sm w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center text-gray-900">Title</th>
              <th className="px-4 py-2 text-center text-gray-900">
                Description
              </th>
              <th className="px-4 py-2 text-center text-gray-900">Status</th>
              <th className="px-4 py-2 text-center text-gray-900">
                Assigned Users
              </th>
              <th className="px-4 py-2 text-center text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No tasks found!
                </td>
              </tr>
            ) : (
              tasks?.map((task: Task) => (
                <tr key={task._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 text-gray-500">{task.title}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {task.description.slice(0, 40)}...
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    <span
                      className={`${
                        task.status === "completed"
                          ? "bg-green-200 text-green-600"
                          : task?.status === "in_progress"
                          ? "bg-yellow-200 text-yellow-600"
                          : "bg-red-200 text-red-600"
                      } px-2 py-1 rounded-full text-sm`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {task.assignedTo.map((user: User) => (
                      <span
                        key={user._id}
                        className="bg-gray-200 px-2 py-1 rounded-full text-sm mr-1"
                      >
                        {user.username}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-2 flex gap-2 items-center justify-center">
                    <button
                      onClick={() => handleViewTask(task)}
                      className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      View
                    </button>
                    {user?.role === "admin" && (
                      <>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="bg-yellow-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(task._id)}
                          disabled={deleteMutation.isPending}
                          className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
