import React, { useState } from 'react';

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === form.email.trim().toLowerCase())) {
      setMessage('Account already exists.');
      return;
    }
    users.push({ email: form.email.trim().toLowerCase(), password: form.password });
    localStorage.setItem('users', JSON.stringify(users));
    setMessage('Account created! You can now log in.');
    setForm({ email: '', password: '' });
  };

  return (
    <main style={{ padding: '40px 20px', maxWidth: 420, margin: '0 auto' }}>
      <h1>Create Account</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </main>
  );
}
