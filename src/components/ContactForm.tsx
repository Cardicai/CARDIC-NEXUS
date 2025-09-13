'use client';
import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      alert('Please fill out all fields correctly.');
      return;
    }
    setSent(true);
  }

  if (sent) {
    return <p className='text-brand-gold'>Message sent! We'll be in touch.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <input
        className='w-full rounded bg-black/20 p-2'
        name='name'
        placeholder='Name'
        value={form.name}
        onChange={handleChange}
      />
      <input
        className='w-full rounded bg-black/20 p-2'
        name='email'
        placeholder='Email'
        value={form.email}
        onChange={handleChange}
      />
      <input
        className='w-full rounded bg-black/20 p-2'
        name='subject'
        placeholder='Subject'
        value={form.subject}
        onChange={handleChange}
      />
      <textarea
        className='w-full rounded bg-black/20 p-2'
        name='message'
        placeholder='Message'
        rows={4}
        value={form.message}
        onChange={handleChange}
      />
      <button
        type='submit'
        className='rounded bg-brand-blue px-4 py-2 text-white hover:shadow-gold'
      >
        Send
      </button>
    </form>
  );
}
