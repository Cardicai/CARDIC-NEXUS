import Link from 'next/link';

export default function Home() {
  return (
    <div className='bg-[#0a0f1c] min-h-screen text-white'>
      {/* Navbar */}
      <nav className='flex justify-between items-center px-8 py-4 border-b border-gray-800'>
        <h1 className='text-2xl font-bold text-blue-400'>Cardic Nexus</h1>
        <div className='space-x-6'>
          <Link href='/projects'>Projects</Link>
          <Link href='/about'>About</Link>
          <Link href='/contact'>Contact</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='text-center py-20'>
        <h2 className='text-4xl font-extrabold text-blue-300'>
          Trading Intelligence Meets AI
        </h2>
        <p className='mt-4 text-gray-400 max-w-xl mx-auto'>
          Cardic Nexus is where trading intelligence, AI, and advanced tools
          merge to create next-level strategies, indicators, and automation.
        </p>
        <Link
          href='/projects'
          className='mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-500 transition'
        >
          Explore Projects
        </Link>
      </section>

      {/* CARDIC Heat */}
      <section className='px-8 py-16 bg-[#111827]'>
        <h3 className='text-3xl font-bold text-blue-300 text-center'>
          CARDIC Heat 🔥
        </h3>
        <p className='mt-4 text-gray-400 max-w-2xl mx-auto text-center'>
          A next-generation indicator that tracks liquidity zones, market
          sentiment, and trade signals in real time.
        </p>
        <ul className='mt-8 max-w-lg mx-auto space-y-4'>
          <li className='flex justify-between bg-gray-800/50 px-4 py-2 rounded-lg'>
            <span>CARDIC Heat 2.0</span>
            <span>$25 / 2 months access</span>
          </li>
          <li className='flex justify-between bg-gray-800/50 px-4 py-2 rounded-lg'>
            <span>CARDIC Heat 2.1</span>
            <span>$35 / 2 months access</span>
          </li>
          <li className='flex justify-between bg-gray-800/50 px-4 py-2 rounded-lg'>
            <span>
              CARDIC Heat 2.3
              <span className='ml-1 text-xs text-gray-400'>(early access)</span>
            </span>
            <span>$50 / 1 month</span>
          </li>
        </ul>
        <p className='mt-6 text-gray-500 text-center text-sm'>
          📈 The higher the version, the more acute, dynamic, and powerful the
          signal detection becomes.
        </p>
      </section>
    </div>
  );
}
