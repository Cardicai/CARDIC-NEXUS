import CardicHero from '@/components/CardicHero';
import SocialRow from '@/components/SocialRow';

import CardicNexusLanding from './CardicNexusLanding';

export default function Home() {
  return (
    <>
      <CardicHero />
      <section className='bg-[#07060A] px-4 py-14 sm:px-6 lg:px-8'>
        <SocialRow />
      </section>
      <CardicNexusLanding />
    </>
  );
}
