import React, { useState } from 'react'
import {  useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthWrapper'
import { updateUser, changePassword } from '../services/api'
import { toast } from 'react-toastify'
import Modal from '../components/Modal'
import { User } from '../types/types'

export default function Profile() {
  const { user, setUser } = useAuth()
  const queryClient = useQueryClient()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [formData, setFormData] = useState<User>({
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || '',
    _id: user?._id || ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const updateMutation = useMutation({
    mutationFn: (updatedUser: User) => updateUser(user._id, updatedUser),
    onSuccess: ( data ) => {
      if (!data) {
        toast.error("Failed to update profile. Please try again.");
        return;
      }
  
      console.log("Updated User:", data); // ✅ فحص البيانات المسترجعة
  
  
      setUser(data);
      // localStorage.setItem("user", JSON.stringify(data));
  
      queryClient.invalidateQueries(["user", user._id]);
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    },
  });
  
  
  

  const passwordMutation = useMutation({
    mutationFn: () => changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }),
    onSuccess: () => {
      toast.success('Password changed successfully!')
      setIsPasswordModalOpen(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Password change failed')
    }
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.username || !formData.email) {
      toast.error("Please fill all fields");
      return;
    }
  
    // console.log("Updating user:", formData); 
  
    updateMutation.mutate(formData);
  };
  

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    passwordMutation.mutate()
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Username:</label>
            <p className="mt-1">{user?.username}</p>
          </div>
          
          <div>
            <label className="font-semibold">Email:</label>
            <p className="mt-1">{user?.email}</p>
          </div>
          
          <div>
            <label className="font-semibold">Role:</label>
            <p className="mt-1 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
          
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
          
          <div>
            <label className="block mb-2">Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          
          <div>
            <label className="block mb-2">Current Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              required
              minLength={6}
            />
            {passwordData.newPassword.length < 6 && <p className="text-sm text-red-500">Password must be at least 6 characters</p>}
          </div>
          
          <div>
            <label className="block mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              required
            />
            {passwordData.newPassword !== passwordData.confirmPassword && <p className="text-sm text-red-500">Passwords do not match</p>}
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
