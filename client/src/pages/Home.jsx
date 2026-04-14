import { SignInButton } from "@clerk/clerk-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600 text-white">
      <h1 className="text-6xl font-black mb-4">Sura Library</h1>
      <p className="text-xl mb-8">Sign in to manage your books.</p>
      <SignInButton mode="modal">
        <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100">
          Enter Library
        </button>
      </SignInButton>
    </div>
  );
}