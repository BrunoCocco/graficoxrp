import { useState } from 'react';
import { auth } from '../lib/auth';
export default function Login() {
  const [mode, setMode] = useState('login');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault();
    if (!auth || busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true); setMessage('');
    try {
      const credentials = { email: data.get('email').trim(), password: data.get('password') };
      const result = mode === 'login' ? await auth.auth.signInWithPassword(credentials) : await auth.auth.signUp(credentials);
      if (result.error) throw result.error;
      if (mode === 'register' && !result.data.session) setMessage('Revisá tu correo para confirmar la cuenta y luego ingresá.');
    } catch { setMessage('No pudimos completar el ingreso. Revisá tus datos, la confirmación de correo o intentá nuevamente.'); }
    finally { setBusy(false); }
  }
  return <main className="entry-screen"><section className="product-card">
    <span className="eyebrow">GRAFICOS XRP · PRODUCTO</span><h1>Tu espacio de análisis.</h1>
    <p>Elegí tus activos y analizalos en semanal, diario y 4 horas.</p>
    {!auth && <p role="alert">El acceso todavía no está configurado. Faltan las variables de conexión de Supabase en este despliegue.</p>}
    <form onSubmit={submit}>
      <label>Correo electrónico<input name="email" type="email" autoComplete="email" required disabled={!auth || busy} /></label>
      <label>Contraseña<input name="password" type="password" minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required disabled={!auth || busy} /></label>
      <button disabled={!auth || busy}>{busy ? 'Conectando…' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}</button>
    </form>
    <button className="text-button" type="button" disabled={busy} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(''); }}>{mode === 'login' ? '¿Primera vez? Crear cuenta' : 'Ya tengo cuenta'}</button>
    <p role="status">{message}</p>
  </section></main>;
}
