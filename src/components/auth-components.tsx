import { signIn, signOut } from "@/auth"

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("spotify")
      }}
    >
      <button
        type="submit"
        className="bg-[#1ed760] text-white font-bold py-3 px-6 rounded-full uppercase tracking-widest hover:bg-[#1ed760]/80 transition-colors"
      >
        Login with Spotify
      </button>
    </form>
  )
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button
        type="submit"
        className="bg-red-500 text-white font-bold py-3 px-6 rounded-full uppercase tracking-widest hover:bg-red-600 transition-colors"
      >
        Sign out
      </button>
    </form>
  )
}
