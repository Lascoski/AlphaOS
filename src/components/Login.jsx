import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login({ setAuth }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false); // Novo estado
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos também a preferência de lembrar
        body: JSON.stringify({ email, senha, lembrar }), 
      });

      const data = await response.json();

      if (response.ok) {
        // Se a caixa estiver marcada, guarda no localStorage (permanente)
        if (lembrar) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('usuario', JSON.stringify(data.usuario));
        } else {
          // Se não, guarda no sessionStorage (apaga ao fechar a janela)
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        }
        
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
        
        <div className="login-form-group">
          <label className="login-label">Palavra-passe</label>
          <input 
            type="password" 
            className="login-input"
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required 
          />
        </div>

        {/* Nova Checkbox */}
        <div className="login-form-group last" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="checkbox" 
            id="lembrar" 
            checked={lembrar}
            onChange={(e) => setLembrar(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="lembrar" style={{ color: '#4b5563', fontSize: '14px', cursor: 'pointer', margin: 0 }}>
            Lembrar de mim por 30 dias
          </label>
        </div>
        
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  );
}