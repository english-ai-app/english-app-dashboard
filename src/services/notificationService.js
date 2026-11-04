import axios from "../utils/AxiosCustomize";

// API để lấy danh sách thông báo
export const getAllNotifications = async (page = 1, limit = 10) => {
  return await axios.get("/api/notification", {
    params: { page, limit },
  });
};

// API để thêm bài hát mới
export const addSong = async (songData) => {
  const formData = new FormData();
  formData.append("songName", songData.songName);
  formData.append("Audio", songData.audio);
  formData.append("Image", songData.image);
  return await axios.post("/api/song/create", formData);
};

// API để lấy thông tin bài hát theo ID
export const updateSong = async (songData) => {
  const formData = new FormData();
  formData.append("songName", songData.songName);
  formData.append("Audio", songData.audio);
  formData.append("Image", songData.image);
  return await axios.patch(`/api/song/${songData.id}`, formData);
};

// API để xóa bài hát
export const deleteSong = async (songId) => {
  try {
    const response = await axios.delete(`/api/song/${songId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
