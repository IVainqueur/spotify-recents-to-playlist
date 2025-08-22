import { auth } from "@/auth"
import { SignIn } from "@/components/auth-components"
import RecentTracks from "@/components/RecentTracks"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Suspense } from "react"

export default async function Home() {
  const session = await auth()

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <main>
        <h2 className="text-3xl font-bold mb-6">Recently Played</h2>
        {session?.accessToken ? (
          <Suspense fallback={<LoadingSpinner />}>
            <RecentTracks />
          </Suspense>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <h2 className="text-2xl font-bold mb-4">
              Please log in to see your recently played tracks.
            </h2>
            <SignIn />
          </div>
        )}
      </main>
    </div>
  )
}
