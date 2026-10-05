import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login({ setAuth }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        setAuth(true);
        navigate('/dashboard');
      } else {
        setErro(data.error || 'Erro ao efetuar login');
      }
    } catch (err) {
      setErro('Falha na ligação ao servidor.');
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleLogin} className="login-form-container">
        <h2 className="login-title">AlphaOS</h2>
        
        {erro && <div className="login-error">{erro}</div>}
        
        <div className="login-form-group">
          <label className="login-label">E-mail</label>
          <input 
            type="email" 
            className="login-input"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="login-form-group last">
          <label className="login-label">Palavra-passe</label>
          <input 
            type="password" 
            className="login-input"
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  );
}