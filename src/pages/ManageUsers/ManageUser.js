import React, { useEffect, useState } from 'react';
import { createUser, deleteUser, getAllUsers, updateUser, uploadAvatar } from '../../services/userService';
import { FaSpinner, FaSearch, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function ManageUser() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [deletingUserId, setDeletingUserId] = useState(null);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [subscriptionType, setSubscriptionType] = useState('');
    const [role, setRole] = useState('');
    const [editUserId, setEditUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [pageNumber]);

    useEffect(() => {
        const results = users.filter(user =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers(pageNumber, pageSize);
            setUsers(res.data);
            setTotalPages(res.totalPages);
            setError('');
        } catch (err) {
            setError('Failed to load users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!editUserId && !email) errors.email = 'Email is required';
        if (!editUserId && !password) errors.password = 'Password is required';
        if (!fullname.trim()) errors.fullname = 'Full name is required';
        if (!subscriptionType) errors.subscriptionType = 'Subscription type is required';
        if (!role) errors.role = 'Role is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const userData = {
                fullName: fullname,
                avatar: avatarUrl || 'default-avatar.png',
                subscriptionType,
                role,
            };

            if (!editUserId) {
                userData.email = email;
                userData.password = password;
                const res = await createUser(userData);
                setUsers(prev => [...prev, res.data]);
            } else {
                const res = await updateUser(editUserId, userData);
                setUsers(prev => prev.map(u => u.userID === editUserId ? res.data : u));
            }

            closeModal();
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
        try {
            const res = await uploadAvatar(file);
            setAvatarUrl(res.data.url);
        } catch (err) {
            console.error("Avatar upload failed", err);
        }
    };

    const handleEdit = (user) => {
        setEditUserId(user.userID);
        setEmail(user.email);
        setFullname(user.fullName);
        setAvatarUrl(user.avatar);
        setSubscriptionType(user.subscriptionType);
        setRole(user.role);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteUser(deletingUserId);
            setUsers(prev => prev.filter(u => u.userID !== deletingUserId));
            setDeletingUserId(null);
            setError('');
        } catch (err) {
            setError('Failed to delete user. Please try again.');
            setDeletingUserId(null);
        }
    };

    const closeModal = () => {
        setEmail('');
        setPassword('');
        setFullname('');
        setAvatarFile(null);
        setAvatarUrl('');
        setSubscriptionType('');
        setRole('');
        setEditUserId(null);
        setIsModalOpen(false);
        setFormErrors({});
    };

    return (
        <div className="p-4 md:p-6">
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center justify-between">
                    <div className="flex items-center">
                        <FaExclamationCircle className="mr-2" />
                        {error}
                    </div>
                    <button onClick={() => setError('')}>
                        <FaTimes className="text-lg" />
                    </button>
                </div>
            )}

            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add User
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-8">
                    <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto" />
                    <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
            ) : (
                /* User Table */
                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Full Name</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Avatar</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Subscription</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.userID} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-700">{user.userID}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700 break-words max-w-[200px]">{user.email}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{user.fullName}</td>
                                    <td className="py-3 px-4">
                                        <img
                                            src={user.avatar}
                                            className="w-10 h-10 rounded-full mx-auto md:mx-0 border"
                                            alt="avatar"
                                        />
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.subscriptionType === 'Premium'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {user.subscriptionType}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'Admin'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 space-y-2 md:space-x-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="block md:inline-block w-full md:w-auto px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeletingUserId(user.userID)}
                                            className="block md:inline-block w-full md:w-auto px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-3">
                    <button
                        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                        disabled={pageNumber === 1}
                        className={`p-2.5 rounded-lg border transition-all ${pageNumber === 1
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white border-gray-300 hover:border-blue-500 hover:text-blue-600'
                            }`}
                    >
                        <FiChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPageNumber(i + 1)}
                                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all font-medium ${i + 1 === pageNumber
                                        ? 'bg-blue-600 border-blue-700 text-white shadow-lg'
                                        : 'bg-white border-gray-300 hover:border-blue-500 hover:text-blue-600'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))}
                        disabled={pageNumber === totalPages}
                        className={`p-2.5 rounded-lg border transition-all ${pageNumber === totalPages
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white border-gray-300 hover:border-blue-500 hover:text-blue-600'
                            }`}
                    >
                        <FiChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingUserId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-4 text-gray-600">Are you sure you want to delete this user? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setDeletingUserId(null)}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{editUserId ? 'Edit User' : 'Add User'}</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>

                        {/* Email Field */}
                        {!editUserId && (
                            <div className="mb-4">
                                <label className="block mb-2 font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className={`w-full p-2 border rounded-lg ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                {formErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                )}
                            </div>
                        )}

                        {/* Password Field */}
                        {!editUserId && (
                            <div className="mb-4">
                                <label className="block mb-2 font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={`w-full p-2 border rounded-lg ${formErrors.password ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                {formErrors.password && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                                )}
                            </div>
                        )}

                        {/* Full Name Field */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className={`w-full p-2 border rounded-lg ${formErrors.fullname ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={fullname}
                                onChange={e => setFullname(e.target.value)}
                            />
                            {formErrors.fullname && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.fullname}</p>
                            )}
                        </div>

                        {/* Avatar Upload */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Avatar</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="w-full p-2 border rounded-lg border-gray-300"
                            />
                            {avatarUrl && (
                                <img
                                    src={avatarUrl}
                                    className="w-16 h-16 rounded-full mt-2 border"
                                    alt="avatar preview"
                                />
                            )}
                        </div>

                        {/* Subscription Type */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Subscription Type</label>
                            <select
                                value={subscriptionType}
                                onChange={e => setSubscriptionType(e.target.value)}
                                className={`w-full p-2 border rounded-lg ${formErrors.subscriptionType ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="">Select Type</option>
                                <option value="Free">Free</option>
                                <option value="Premium">Premium</option>
                            </select>
                            {formErrors.subscriptionType && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.subscriptionType}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Role</label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className={`w-full p-2 border rounded-lg ${formErrors.role ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="">Select Role</option>
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                            {formErrors.role && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {editUserId ? 'Update User' : 'Create User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageUser;