/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

export default function BuyPage() {
  return (
    <div className='bg-[#0a0f1c] min-h-screen text-white'>
      {/* Navbar */}
      <nav className='flex justify-between items-center px-8 py-4 border-b border-gray-800'>
        <h1 className='text-2xl font-bold text-blue-400'>Cardic Nexus</h1>
        <div className='space-x-6'>
          <Link href='/projects'>Projects</Link>
          <Link href='/about'>About</Link>
          <Link href='/contact'>Contact</Link>
          <Link href='/buy'>Buy</Link>
        </div>
      </nav>

      {/* Wallet Selection */}
      <section className='max-w-xl mx-auto py-20'>
        <h2 className='text-3xl font-extrabold text-center mb-12'>
          Select Wallet
        </h2>
        <div className='space-y-8'>
          <div className='text-center'>
            <img
              src='https://cryptologos.cc/logos/bitcoin-btc-logo.png'
              alt='Bitcoin logo'
              className='w-16 h-16 mx-auto'
            />
            <p className='mt-4 font-mono break-all'>
              bc1qm034jk98v7yzdy5yedyvwave96ujqjgnqyytm3
            </p>
          </div>
          <div className='text-center'>
            <img
              src='https://cryptologos.cc/logos/ethereum-eth-logo.png'
              alt='Ethereum logo'
              className='w-16 h-16 mx-auto'
            />
            <p className='mt-4 font-mono break-all'>
              0x713598879a14D07013d3154b225D2fa838bb0a54
            </p>
          </div>
          <div className='text-center'>
            <img
              src='https://cryptologos.cc/logos/tether-usdt-logo.png'
              alt='Tether logo'
              className='w-16 h-16 mx-auto'
            />
            <p className='mt-4 font-mono break-all'>
              0x713598879a14D07013d3154b225D2fa838bb0a54
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
