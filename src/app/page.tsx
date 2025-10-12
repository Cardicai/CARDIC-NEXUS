import CardicHero from '@/components/CardicHero';
import SocialRow from '@/components/SocialRow';

export default function Home(): JSX.Element {
  return (
    <>
      <CardicHero />
      <section className='bg-[#07060A] px-4 py-14 sm:px-6 lg:px-8'>
        <SocialRow />
      </section>
    </>
  );
}
