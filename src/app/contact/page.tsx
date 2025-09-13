import ContactForm from '@/components/ContactForm';
import Section from '@/components/Section';
import SocialRow from '@/components/SocialRow';

export default function ContactPage() {
  return (
    <Section>
      <h1 className='mb-4 text-3xl font-bold'>Contact</h1>
      <div className='mb-8'>
        <SocialRow />
      </div>
      <ContactForm />
    </Section>
  );
}
