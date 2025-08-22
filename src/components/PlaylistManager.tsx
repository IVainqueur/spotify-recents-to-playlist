'use client'

import { useState, useEffect } from "react"

export default function PlaylistManager({
  accessToken,
  trackUris,
}: {
  accessToken: string
  trackUris: string[]
}) {
  const [playlists, setPlaylists] = useState<any[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState("")
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json()
      setPlaylists(data.items)
    }
    fetchPlaylists()
  }, [accessToken])

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist) return
    setStatus("Adding to playlist...")
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: trackUris }),
      }
    )
    setStatus(
      response.ok
        ? "Tracks added successfully!"
        : "Failed to add tracks."
    )
  }

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName) return
    setStatus("Creating playlist...")
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const userData = await userResponse.json()
    const userId = userData.id

    const createResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPlaylistName,
          description: "Created with Spotify Recents Grouper",
          public: false,
        }),
      }
    )
    const newPlaylist = await createResponse.json()
    await fetch(`https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: trackUris }),
      }
    )
    setStatus("Playlist created and tracks added successfully!")
  }

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg mt-8">
      <h3 className="text-2xl font-bold mb-4">Manage Playlists</h3>
      <div className="flex gap-4 mb-4">
        <select
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="">Select a playlist</option>
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddToPlaylist}
          disabled={!selectedPlaylist || trackUris.length === 0}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded enabled:hover:bg-blue-600 disabled:opacity-50"
        >
          Add to Existing Playlist
        </button>
      </div>
      <div className="flex gap-4">
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New playlist name"
          className="bg-gray-700 text-white p-2 rounded"
        />
        <button
          onClick={handleCreatePlaylist}
          disabled={!newPlaylistName || trackUris.length === 0}
          className="bg-[--spotify-green] text-white font-bold py-2 px-4 rounded enabled:hover:bg-[#1ed760] disabled:opacity-50"
        >
          Create and Add
        </button>
      </div>
      {status && <p className="mt-4">{status}</p>}
    </div>
  )
}
