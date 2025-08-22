import { auth } from "@/auth"
import { SignOut } from "./auth-components"

export default async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-4 z-50 bg-black/50 backdrop-blur-lg text-white p-4 flex justify-between items-center rounded-xl mx-4 border border-white/10 shadow-lg">
      <h1 className="text-2xl font-bold">Spotify Recents</h1>
      {session?.user && (
        <div className="flex items-center gap-4">
          <p>{session.user.name}</p>
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name ?? ""}
              className="w-10 h-10 rounded-full"
            />
          )}
          <SignOut />
        </div>
      )}
    </header>
  )
}
