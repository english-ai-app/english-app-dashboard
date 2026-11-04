import React, { useEffect, useState, useRef } from "react";
import { addSong, updateSong } from "../../services/songService";
import { RefreshCcw } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function ManageSongs({ onClose, song, fetchSongs, page, setIsLoading }) {
  const [songName, setSongName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const audioRef = useRef(null);

  useEffect(() => {
    if (song) {
      setSongName(song.songName || "");
      setImagePreview(song.image || null);
      setAudioPreview(song.audio || null);
    } else {
      setSongName("");
      setImagePreview(null);
      setAudioPreview(null);
      setImageFile(null);
      setAudioFile(null);
    }
  }, [song]);

  useEffect(() => {
    if (audioRef.current && audioPreview) {
      audioRef.current.load();

      // Nếu bạn vẫn muốn làm gì đó sau khi audio load xong (vd: hiển thị thời lượng)
      const handleLoaded = () => {
        console.log("Audio đã load xong, sẵn sàng để phát");
        // Không gọi play ở đây
      };
  
      audioRef.current.addEventListener("loadeddata", handleLoaded);
  
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("loadeddata", handleLoaded);
        }
      };
    }
  }, [audioPreview]);
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
    if (file && file.type.startsWith("audio/")) {
      const audioUrl = URL.createObjectURL(file);
      setAudioPreview(audioUrl);
    } else {
      alert("Please upload a valid audio file.");
    }
  };

  const handleAddSong = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsLoading(true);

    if (!songName) {
      alert("Please enter a song name.");
      return;
    }
    if (!imagePreview) {
      alert("Please upload an image.");
      return;
    }
    if (!audioPreview) {
      alert("Please upload an audio file.");
      return;
    }

    if (!song) {
      try {
        await addSong({
          songName,
          image: imageFile,
          audio: audioFile,
        });
        fetchSongs(page);
        onClose();
      } catch (err) {
        setIsSubmitting(false);
        console.error("Error adding song:", err);
        alert("Failed to add song.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        await updateSong({
          id: song.songID,
          songName,
          image: imageFile,
          audio: audioFile,
        });
        fetchSongs(page);
        onClose();
      } catch (err) {
        console.error("Error updating song:", err);
        alert("Failed to update song.");
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <div className="px-5 py-4 sm:px-6 sm:py-5">
        <h3 className="text-base font-medium text-gray-800">Create New Song</h3>
      </div>
      <div className="space-y-6 border-t border-gray-100 p-5 ">
        {/* Input for Song Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Song Name
          </label>
          <input
            type="text"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            placeholder="Enter song name"
            className="focus:border-blue-500 focus:outline-none focus:ring-3 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Dropzone Section */}
      <div className="space-y-6 border-gray-100 px-5 ">
        <div className="flex flex-wrap gap-6">
          {/* Dropzone for Image */}
          <div className="flex-1 rounded-2xl border border-gray-200 bg-white">
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <h3 className="text-base font-medium text-gray-800">
                Song Image
              </h3>
            </div>
            <div className="space-y-6 border-t border-gray-100 p-5 sm:p-6">
              <input
                type="file"
                id="image_song"
                hidden
                onChange={handleImageUpload}
              />
              <label
                htmlFor="image_song"
                className={`block cursor-pointer dropzone hover:border-brand-500! rounded-xl border border-dashed! border-gray-300! bg-gray-50 ${
                  !imagePreview ? "p-7 lg:p-10" : ""
                } dz-clickable`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className={`w-full h-[267px] rounded-lg`}
                  />
                ) : (
                  <div className="dz-message m-0!">
                    <div className="mb-[22px] flex justify-center">
                      <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <svg
                          className="fill-current"
                          width="29"
                          height="28"
                          viewBox="0 0 29 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                            fill=""
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-theme-xl text-center mb-3 font-semibold text-gray-800">
                      Drag &amp; Drop File Here
                    </h4>
                    <span className="mx-auto text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                      Drag and drop your PNG, JPG, WebP, SVG images here or
                      browse
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Dropzone for Audio */}
          <div className="flex-1 rounded-2xl border border-gray-200 bg-white">
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <h3 className="text-base font-medium text-gray-800">
                Song Audio
              </h3>
            </div>
            <div className="space-y-6 border-t border-gray-100 p-5 sm:p-6">
              <input
                type="file"
                id="song_audio"
                hidden
                onChange={handleAudioUpload}
              />
              <label
                htmlFor="song_audio"
                className={`block cursor-pointer dropzone hover:border-brand-500! rounded-xl border border-dashed! border-gray-300! bg-gray-50 ${
                  !audioPreview
                    ? "p-7 lg:p-10"
                    : "h-[267px] flex flex-col items-center justify-center"
                } dz-clickable`}
              >
                {audioPreview ? (
                  <audio ref={audioRef} controls className="w-full ">
                    <source src={audioPreview} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <div className="dz-message m-0!">
                    <div className="mb-[22px] flex justify-center">
                      <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <svg
                          className="fill-current"
                          width="29"
                          height="28"
                          viewBox="0 0 29 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                            fill=""
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-theme-xl text-center mb-3 font-semibold text-gray-800">
                      Drag &amp; Drop File Here
                    </h4>
                    <span className="mx-auto text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                      Drag and drop your MP3, WAV files here or browse
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Song Button */}
      <div className="px-5 py-4 sm:px-6 sm:py-5">
        <button
          onClick={handleAddSong}
          className="flex justify-center items-center w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          {song ? "Save Song" : "Add New Song"}
          <span>
            {isSubmitting && (
              <RefreshCcw className={`w-4 mt-[3px] h-4 ml-1 animate-spin`} />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ManageSongs;
