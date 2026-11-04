import React, { useEffect, useState, useRef } from "react";
import { getAllSongs, deleteSong } from "../../services/songService";
import ManageSongs from "./ManageSongs";
import { FaSearch } from "react-icons/fa";

function TableSongs() {
  const [songs, setSongs] = useState([]);
  const [songEdit, setSongEdit] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const audioRefs = useRef([]);
  const LIMIT = 5;

  const handlePlay = (index) => {
    audioRefs.current.forEach((audio, i) => {
      if (i !== index && audio && !audio.paused) {
        audio.pause();
        //audio.currentTime = 0;
      }
    });
  };

  useEffect(() => {
    fetchSongs(currentPage);
  }, [currentPage]);

  const fetchSongs = async (page) => {
    try {
      const res = await getAllSongs(page, LIMIT);
      setSongs(res.items);
      setCurrentPage(res.currentPage);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const handleDelete = async (songID) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      try {
        await deleteSong(songID);
        setSongs((prevSongs) =>
          prevSongs.filter((song) => song.songID !== songID)
        );
        alert("Song deleted successfully!");
      } catch (error) {
        console.error("Error deleting song:", error);
        alert("Failed to delete song.");
      }
    }
  };

  const handleEdit = (song) => {
    setSongEdit(song);
    setShowCreateForm(true);
  };

  const handleCreate = () => {
    setShowCreateForm(true);
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setSongEdit(null);
      setShowCreateForm(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full">
      {showCreateForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => handleCloseModal()}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-[70vw] max-h-[95vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <ManageSongs
              song={songEdit}
              fetchSongs={fetchSongs}
              page={currentPage}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onClose={() => {
                audioRefs.current = [];
                setSongEdit(null);
                setShowCreateForm(false);
              }}
            />
          </div>
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
          onClick={() => handleCreate(true)}
        >
          Add Song
        </button>
      </div>
      <table className="min-w-full border-collapse border border-gray-300 relative">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Song ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Play Count
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left w-32">
              Image
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left w-48">
              Audio
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <tr key={song.songID} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {song.songID}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {song.songName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {song.playCount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={song.image}
                    alt={song.songName}
                    className="w-24 h-24 object-cover rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 w-48">
                  <audio
                    key={song.songID + song.audio}
                    ref={(el) => (audioRefs.current[index] = el)}
                    controls
                    className="w-full w-[300px] h-10 relative z-0"
                    onPlay={() => handlePlay(index)}
                  >
                    <source src={song.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(song)}
                    className="mr-2 rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(song.songID)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="border border-gray-300 px-4 py-2 text-center text-gray-500"
              >
                No songs available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {(() => {
          const pages = [];
          const maxPagesToShow = LIMIT;

          if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
              pages.push(i);
            }
          } else {
            pages.push(1);
            if (currentPage > 3) {
              pages.push("...");
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
              pages.push(i);
            }

            if (currentPage < totalPages - 2) {
              pages.push("...");
            }
            pages.push(totalPages);
          }

          return pages.map((page, idx) =>
            page === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {page}
              </button>
            )
          );
        })()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TableSongs;
