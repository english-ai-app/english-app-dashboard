import axiosInstance from "../utils/AxiosCustomize";

export const getAllUsers = async (pageNumber = 1, pageSize = 10) => {
    const response = await axiosInstance.get('/api/user', {
        params: { pageNumber, pageSize }
    });
    return response;
};


export const getUser = async ( id ) => {
    return await axiosInstance.get(`/api/user/${id}`)
}

export const createUser = async (newUser) => {
    return await axiosInstance.post('/api/user', {userCreateDto: newUser});
}

export const updateUser = async (id, updateUser) => {
    return await axiosInstance.put(`/api/user/${id}`, {userUpdateDto: updateUser});
}

export const deleteUser = async (id) => {
    return await axiosInstance.delete(`/api/user/${id}`);
}

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await axiosInstance.post('/api/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};