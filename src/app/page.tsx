import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#0a0f1c] min-h-screen text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400">Cardic Nexus</h1>
        <div className="space-x-6">
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20">
        <h2 className="text-4xl font-extrabold text-blue-300">
          Trading Intelligence Meets AI
        </h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Cardic Nexus is where trading intelligence, AI, and advanced tools
          merge to create next-level strategies, indicators, and automation.
        </p>
        <Link
          href="/projects"
          className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-500 transition"
        >
          Explore Projects
        </Link>
      </section>
    </div>
  );
}
