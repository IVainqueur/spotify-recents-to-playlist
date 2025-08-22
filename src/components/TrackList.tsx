'use client'

import { useState, useEffect } from "react"
import PlaylistManager from "./PlaylistManager"

function formatPlayedAt(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  return `just now`
}

export default function TrackList({
  tracks,
  accessToken,
}: {
  tracks: any[]
  accessToken: string
}) {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const savedViewMode = localStorage.getItem('spotify-view-mode')
    if (savedViewMode === 'list' || savedViewMode === 'grid') {
      setViewMode(savedViewMode)
    }
  }, [])

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    localStorage.setItem('spotify-view-mode', mode)
  }

  const handleSelectTrack = (trackId: string) => {
    setSelectedTracks((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId]
    )
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() =>
            setSelectedTracks(tracks.map(({ track }) => track.uri))
          }
          className="bg-gray-700 text-white font-bold py-2 px-4 rounded-full mr-2 cursor-pointer hover:bg-gray-600"
        >
          Select All
        </button>
        <button
          onClick={() => setSelectedTracks([])}
          className="bg-gray-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer hover:bg-gray-600"
        >
          Clear Selection
        </button>
        <p className="mt-2">{selectedTracks.length} tracks selected</p>
      </div>
      
      {/* View Toggle */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-300">View:</span>
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => handleViewModeChange('grid')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-[#1db954] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-[#1db954] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {selectedTracks.length > 0 && (
        <PlaylistManager
          accessToken={accessToken}
          trackUris={selectedTracks}
        />
      )}
      
      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tracks.map(({ track, played_at }, index) => (
            <div
              key={track.id + index}
              className={`bg-[#1a1a1a] p-4 rounded-lg cursor-pointer transition-all relative ${
                selectedTracks.includes(track.uri)
                  ? "bg-[--spotify-green] border-2 border-[--spotify-green]"
                  : ""
              }`}
              onClick={() => handleSelectTrack(track.uri)}
            >
              <input
                type="checkbox"
                checked={selectedTracks.includes(track.uri)}
                onChange={() => handleSelectTrack(track.uri)}
                className="absolute top-2 right-2"
              />
              <img
                src={track.album.images[0]?.url}
                alt={track.album.name}
                className="w-full h-auto rounded-md mb-4"
              />
              <h3 className="font-bold">{track.name}</h3>
              <p className="text-sm text-gray-400">
                {track.artists.map((artist: any) => artist.name).join(", ")}
              </p>
              <p className="text-xs text-gray-500 mt-1">{formatPlayedAt(played_at)}</p>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {tracks.map(({ track, played_at }, index) => (
            <div
              key={track.id + index}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                selectedTracks.includes(track.uri)
                  ? "bg-[#1db954] bg-opacity-30 border border-[#1db954]"
                  : "bg-[#1a1a1a] hover:bg-[#2a2a2a]"
              }`}
              onClick={() => handleSelectTrack(track.uri)}
            >
              <input
                type="checkbox"
                checked={selectedTracks.includes(track.uri)}
                onChange={() => handleSelectTrack(track.uri)}
                className="flex-shrink-0"
              />
              <img
                src={track.album.images[0]?.url}
                alt={track.album.name}
                className="w-12 h-12 rounded-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{track.name}</h3>
                <p className="text-sm text-gray-300 truncate">
                  {track.artists.map((artist: any) => artist.name).join(", ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 whitespace-nowrap">{formatPlayedAt(played_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
