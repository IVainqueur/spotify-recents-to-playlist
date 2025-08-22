'use client'

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import TrackList from "@/components/TrackList"
import LoadingSpinner from "./LoadingSpinner"

export default function RecentTracks() {
  const { data: session } = useSession()
  const [tracks, setTracks] = useState<any[]>([])
  const [nextUrl, setNextUrl] = useState<string | null>(
    "https://api.spotify.com/v1/me/player/recently-played?limit=50"
  )
  const [loading, setLoading] = useState(false)

  const getRecentTracks = useCallback(async () => {
    if (!nextUrl || loading || !session?.accessToken) return
    setLoading(true)

    try {
      const response = await fetch(nextUrl, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recent tracks")
      }

      const data = await response.json()
      const newTracks = data.items.filter(
        (newItem: any) =>
          !tracks.some(
            (existingItem) => existingItem.track.id === newItem.track.id
          )
      )

      setTracks((prev) => [...prev, ...newTracks])
      setNextUrl(data.next)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [nextUrl, loading, session?.accessToken, tracks])

  useEffect(() => {
    getRecentTracks()
  }, [session, getRecentTracks])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500
      ) {
        getRecentTracks()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [getRecentTracks])

  if (!session?.accessToken) {
    return null
  }

  return (
    <>
      <TrackList tracks={tracks} accessToken={session.accessToken!} />
      {loading && <LoadingSpinner />}
      {!nextUrl && (
        <p className="text-center text-gray-500 mt-4">
          You've reached the end of your listening history.
        </p>
      )}
    </>
  )
}
