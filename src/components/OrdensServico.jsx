import { useState, useEffect } from 'react'
<<<<<<< HEAD
import { Search, Plus, MoreVertical, X, Smartphone, User, Calendar, DollarSign, Trash2 } from 'lucide-react'
=======
import { Search, Plus, MoreVertical, X } from 'lucide-react'
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
import Header from './Header' 
import './OrdensServico.css'

export default function OrdensServico() {
  const [listaOS, setListaOS] = useState([])
<<<<<<< HEAD
  const [clientes, setClientes] = useState([])
=======
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
  const [carregando, setCarregando] = useState(true)
  
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false)
  const [modalVisaoAberto, setModalVisaoAberto] = useState(false)
  const [osSelecionada, setOsSelecionada] = useState(null)
<<<<<<< HEAD
=======
  const [menuAberto, setMenuAberto] = useState(null)
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
  
  const [filtroEtapa, setFiltroEtapa] = useState('Todas')
  const [buscaTexto, setBuscaTexto] = useState('')

<<<<<<< HEAD
  const [buscaCliente, setBuscaCliente] = useState('')
  const [clienteSelecionado, setClienteSelecionado] = useState(null)

  const [modalNovoClienteAberto, setModalNovoClienteAberto] = useState(false)
  const [formClienteData, setFormClienteData] = useState({
    cpf: '', data_nascimento: '', nome: '', telefone: '', 
    rua: '', numero: '', bairro: '', cidade: ''
  })

  const estadoInicial = {
=======
  const estadoInicial = {
    cliente_nome: '', telefone: '', cpf: '', 
    rua: '', numero: '', bairro: '', cidade: '', sem_numero: false,
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
    marca: '', aparelho: '', cor: '', senha: '', tipo_senha: 'texto',
    defeito: '', defeito_diagnosticado: '', acessorios: '', avarias: [], observacoes: '', valor_estimado: ''
  }
  const [formData, setFormData] = useState(estadoInicial)
  const [padraoDesbloqueio, setPadraoDesbloqueio] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)

  const [defeitoDiagEditado, setDefeitoDiagEditado] = useState('')
  const [valorEditado, setValorEditado] = useState('')
  const [garantia, setGarantia] = useState('90 dias')
  const [testesStatus, setTestesStatus] = useState({})

  const etapasFluxo = [
    'Avaliação Inicial',
    'Aprovação do Cliente',
    'Compra das Peças',
    'Aguardando Peça',
    'Realizar Reparo',
    'Testes de Qualidade',
    'Pronto (Avisar Cliente)',
    'Finalizado'
  ]

  const opcoesAvarias = [
    'Tela Trincada', 'Display Danificado', 'Bateria Estufada', 
    'Tampa Quebrada', 'Aro Amassado', 'Lente da Câmera Quebrada', 
    'Oxidação (Molhado)', 'Não Liga', 'Nenhuma Avaria'
  ]

  const listaTestesQC = [
    'Touch / Toque na Tela', 'Display / Imagem e Cores', 'Ajuste de Brilho', 
    'Áudio / Alto-falante e Microfone', 'Câmera Frontal e Traseira', 
    'Vibração / Motor Taptic', 'Conector de Carga / USB', 
    'Wi-Fi, Bluetooth e Rede', 'Biometria / Face ID', 'Bateria / Carregamento'
  ]

<<<<<<< HEAD
  const buscarDados = () => {
    setCarregando(true)
    fetch('http://localhost:3001/api/ordens')
      .then(res => res.json())
      .then(dados => setListaOS(dados))
      .catch(erro => console.error("Erro OS:", erro))
      .finally(() => setCarregando(false))

    fetch('http://localhost:3001/api/clientes')
      .then(res => res.json())
      .then(dados => setClientes(dados))
      .catch(erro => console.error("Erro Clientes:", erro))
  }

  useEffect(() => { buscarDados() }, [])

  const buscarCNPJCliente = async () => {
    const cnpjLimpo = formClienteData.cpf.replace(/\D/g, ''); 
    if (cnpjLimpo.length !== 14) {
      alert('Por favor, digite um CNPJ válido com 14 números.');
      return;
    }
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      if (!response.ok) throw new Error('CNPJ não encontrado');
      const data = await response.json();
      setFormClienteData(prev => ({
        ...prev,
        nome: data.razao_social || prev.nome,
        telefone: data.ddd_telefone_1 || prev.telefone,
        rua: data.logradouro || prev.rua,
        numero: data.numero || prev.numero,
        bairro: data.bairro || prev.bairro,
        cidade: data.municipio || prev.cidade
      }));
    } catch (error) {
      alert('Erro ao buscar CNPJ. Verifique o número digitado.');
    }
  }

  const salvarNovoClienteNaOS = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formClienteData)
      });
      
      const data = await response.json();

      if (response.ok) {
        setClientes(prev => [...prev, data]);
        setClienteSelecionado(data);
        setModalNovoClienteAberto(false);
        setFormClienteData({ cpf: '', data_nascimento: '', nome: '', telefone: '', rua: '', numero: '', bairro: '', cidade: '' });
      } else {
        alert(data.error || 'Erro ao salvar cliente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão com o servidor.');
    }
=======
  const buscarOrdens = () => {
    setCarregando(true)
    fetch('http://localhost:3001/api/ordens')
      .then(res => res.json())
      .then(dados => { setListaOS(dados); setCarregando(false) })
      .catch(erro => { console.error(erro); setCarregando(false) })
  }

  useEffect(() => { buscarOrdens() }, [])

  const handleBuscarCNPJ = async () => {
    const cnpjLimpo = formData.cpf.replace(/\D/g, '')
    if (cnpjLimpo.length !== 14) return alert("Digite um CNPJ válido com 14 números.")
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`)
      if (!res.ok) throw new Error("CNPJ não encontrado")
      const data = await res.json()
      setFormData(prev => ({
        ...prev, cliente_nome: data.razao_social || '', telefone: data.ddd_telefone_1 || '',
        rua: data.logradouro || '', numero: data.numero || '', bairro: data.bairro || '', cidade: data.municipio || ''
      }))
    } catch (error) { alert("CNPJ não encontrado.") }
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
  }

  const handleAvarias = (avaria) => {
    setFormData(prev => ({
      ...prev, avarias: prev.avarias.includes(avaria) ? prev.avarias.filter(item => item !== avaria) : [...prev.avarias, avaria]
    }))
  }

  const mudarStatusTeste = (teste, status) => {
    setTestesStatus(prev => {
      const novoObjeto = { ...prev, [teste]: status }
      salvarChecklistNoBanco(novoObjeto)
      return novoObjeto
    })
  }

  const salvarChecklistNoBanco = async (statusObj) => {
    if (!osSelecionada) return
    const stringTestes = Object.entries(statusObj)
      .map(([teste, status]) => `${teste}:${status}`)
      .join(', ')

    try {
      await fetch(`http://localhost:3001/api/ordens/${osSelecionada.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...osSelecionada,
<<<<<<< HEAD
=======
          cliente_id: osSelecionada.cliente_id,
          cliente_nome: osSelecionada.cliente_nome,
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
          testes_qualidade: stringTestes
        })
      })
    } catch (err) { console.error(err) }
  }

  const handleMouseDown = (num) => { setIsDrawing(true); setPadraoDesbloqueio([num]) }
  const handleMouseEnter = (num) => { if (isDrawing && !padraoDesbloqueio.includes(num)) setPadraoDesbloqueio(prev => [...prev, num]) }
  const handleMouseUp = () => setIsDrawing(false)

  const handleSalvarOS = async (e) => {
    e.preventDefault()
<<<<<<< HEAD
    
    if (!clienteSelecionado) {
      return alert("Por favor, selecione um cliente antes de criar a Ordem de Serviço.")
    }
    if (formData.tipo_senha === 'padrao' && padraoDesbloqueio.length === 0) {
      return alert("Desenhe o padrão de desbloqueio.")
    }
    if (formData.avarias.length === 0) {
      return alert("Selecione pelo menos uma avaria.")
    }
    
    const dadosParaEnviar = {
      ...formData,
      cliente_id: clienteSelecionado.id,
      senha: formData.tipo_senha === 'padrao' ? `Padrão: ${padraoDesbloqueio.join('-')}` : formData.senha,
=======
    if (formData.tipo_senha === 'padrao' && padraoDesbloqueio.length === 0) return alert("Desenhe o padrão de desbloqueio.")
    if (formData.avarias.length === 0) return alert("Selecione pelo menos uma avaria.")
    
    const dadosParaEnviar = {
      ...formData,
      senha: formData.tipo_senha === 'padrao' ? `Padrão: ${padraoDesbloqueio.join('-')}` : formData.senha,
      numero: formData.sem_numero ? 'S/N' : formData.numero,
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
      avarias: formData.avarias.join(', ')
    }
    
    try {
      const resposta = await fetch('http://localhost:3001/api/ordens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaEnviar)
      })
      if (resposta.ok) {
<<<<<<< HEAD
        setFormData(estadoInicial)
        setPadraoDesbloqueio([])
        setClienteSelecionado(null)
        setBuscaCliente('')
        setModalCadastroAberto(false)
        buscarDados()
=======
        setFormData(estadoInicial); setPadraoDesbloqueio([]); setModalCadastroAberto(false); buscarOrdens()
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
      } else alert("Erro ao salvar.")
    } catch (erro) { console.error(erro) }
  }

  const dispararWhatsAppPronto = async () => {
    try {
      await fetch(`http://localhost:3001/api/ordens/${osSelecionada.id}/enviar-whatsapp-pronto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telefone: osSelecionada.telefone,
          cliente_nome: osSelecionada.cliente_nome,
          aparelho: `${osSelecionada.marca} ${osSelecionada.aparelho}`,
          defeito_diagnosticado: osSelecionada.defeito_diagnosticado || osSelecionada.defeito,
          valor_estimado: osSelecionada.valor_estimado
        })
      })
    } catch (err) { console.error(err) }
  }

  const alterarStatusOS = async (novoStatus) => {
    if (osSelecionada.status === 'Testes de Qualidade' && novoStatus === 'Pronto (Avisar Cliente)') {
      const chavesRespondidas = Object.keys(testesStatus)
      const todosAvaliados = listaTestesQC.every(t => chavesRespondidas.includes(t))
      const temDefeitoNaoResolvido = Object.values(testesStatus).includes('nao_funciona')

      if (!todosAvaliados) {
        alert("⚠️ Por favor, avalie todos os itens do checklist de qualidade antes de avançar.")
        return
      }
      if (temDefeitoNaoResolvido) {
        alert("❌ Há itens marcados como 'Não Funciona'. Corrija ou altere para 'Cliente Não Aprovou' se for o caso.")
        return
      }
      dispararWhatsAppPronto()
    }

    try {
      const res = await fetch(`http://localhost:3001/api/ordens/${osSelecionada.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      })
      if (res.ok) {
        setOsSelecionada(prev => ({ ...prev, status: novoStatus }))
<<<<<<< HEAD
        buscarDados()
=======
        buscarOrdens()
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
      }
    } catch (err) { console.error(err) }
  }

  const avancarEtapa = () => {
    const currentIndex = etapasFluxo.indexOf(osSelecionada.status)
    if (currentIndex < etapasFluxo.length - 1) {
      alterarStatusOS(etapasFluxo[currentIndex + 1])
    }
  }

  const voltarEtapa = () => {
    const currentIndex = etapasFluxo.indexOf(osSelecionada.status)
    if (currentIndex > 0) {
      alterarStatusOS(etapasFluxo[currentIndex - 1])
    }
  }

  const salvarEdicaoAvaliacao = async () => {
    try {
      const stringTestes = Object.entries(testesStatus)
        .map(([teste, status]) => `${teste}:${status}`)
        .join(', ')

      const dadosAtualizados = {
        ...osSelecionada,
<<<<<<< HEAD
=======
        cliente_id: osSelecionada.cliente_id,
        cliente_nome: osSelecionada.cliente_nome,
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
        defeito_diagnosticado: defeitoDiagEditado,
        valor_estimado: valorEditado,
        testes_qualidade: stringTestes
      }

      const res = await fetch(`http://localhost:3001/api/ordens/${osSelecionada.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      })

      if (res.ok) {
        setOsSelecionada(dadosAtualizados)
<<<<<<< HEAD
        buscarDados()
=======
        buscarOrdens()
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
        alert("Avaliação inicial atualizada com sucesso!")
      } else {
        alert("Erro ao atualizar avaliação.")
      }
    } catch (err) { console.error(err) }
  }

<<<<<<< HEAD
  const excluirOS = async (id, e) => {
    if (e) e.stopPropagation() // Impede de abrir a ficha ao clicar na lixeira
    if (confirm("Tem certeza que deseja excluir esta Ordem de Serviço?")) {
      try {
        const res = await fetch(`http://localhost:3001/api/ordens/${id}`, { method: 'DELETE' })
        if (res.ok) { setModalVisaoAberto(false); buscarDados() }
=======
  const enviarOrcamentoWhatsApp = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/ordens/${osSelecionada.id}/enviar-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telefone: osSelecionada.telefone,
          cliente_nome: osSelecionada.cliente_nome,
          aparelho: `${osSelecionada.marca} ${osSelecionada.aparelho}`,
          defeito_diagnosticado: osSelecionada.defeito_diagnosticado || osSelecionada.defeito,
          valor_estimado: osSelecionada.valor_estimado,
          garantia: garantia
        })
      })
      if (res.ok) alert("Orçamento disparado no WhatsApp do cliente com sucesso!")
      else alert("Erro ao disparar mensagem.")
    } catch (err) { console.error(err) }
  }

  const excluirOS = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta Ordem de Serviço?")) {
      try {
        const res = await fetch(`http://localhost:3001/api/ordens/${id}`, { method: 'DELETE' })
        if (res.ok) { setModalVisaoAberto(false); buscarOrdens() }
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
      } catch (err) { console.error(err) }
    }
  }

  const abrirVisaoOS = (os) => { 
    setOsSelecionada(os)
    setDefeitoDiagEditado(os.defeito_diagnosticado || '')
    setValorEditado(os.valor_estimado || '')
    
    const objStatus = {}
    if (os.testes_qualidade) {
      os.testes_qualidade.split(', ').forEach(item => {
        const [teste, status] = item.split(':')
        if (teste && status) objStatus[teste] = status
      })
    }
    setTestesStatus(objStatus)
    setModalVisaoAberto(true) 
  }

  const formatarValor = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const formatarData = (d) => new Date(d).toLocaleDateString('pt-BR')
  const definirCorStatus = (s) => s === 'Finalizado' ? 'status-concluido' : s === 'Pronto (Avisar Cliente)' ? 'status-andamento' : 'status-aguardando'

  const ordensFiltradas = listaOS.filter(os => {
    let correspondeEtapa = false
    if (filtroEtapa === 'Todas') {
      correspondeEtapa = os.status !== 'Finalizado'
    } else {
      correspondeEtapa = os.status === filtroEtapa
    }

    const termo = buscaTexto.toLowerCase()
    const correspondeTexto = 
      os.numero_os.toLowerCase().includes(termo) ||
<<<<<<< HEAD
      (os.cliente_nome && os.cliente_nome.toLowerCase().includes(termo)) ||
=======
      os.cliente_nome.toLowerCase().includes(termo) ||
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
      os.aparelho.toLowerCase().includes(termo) ||
      os.marca.toLowerCase().includes(termo)

    return correspondeEtapa && correspondeTexto
  })

  return (
    <>
      <Header />
      <section className="os-page">
        <div className="os-actions">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar por número da OS, cliente ou aparelho..." 
              value={buscaTexto}
              onChange={e => setBuscaTexto(e.target.value)}
            />
          </div>
          <button className="btn-new-os" onClick={() => setModalCadastroAberto(true)}>
            <Plus size={18} /> Nova Ordem de Serviço
          </button>
        </div>

        {/* FILTROS POR ETAPA */}
<<<<<<< HEAD
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
=======
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
          <button 
            onClick={() => setFiltroEtapa('Todas')}
            style={{ 
              padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
              backgroundColor: filtroEtapa === 'Todas' ? 'var(--color-primary)' : 'var(--color-gray-200)',
              color: filtroEtapa === 'Todas' ? 'white' : 'var(--color-text-primary)'
            }}
          >
            Todas ({listaOS.filter(o => o.status !== 'Finalizado').length})
          </button>
          {etapasFluxo.map(etapa => {
            const qtd = listaOS.filter(o => o.status === etapa).length
            return (
              <button 
                key={etapa}
                onClick={() => setFiltroEtapa(etapa)}
                style={{ 
                  padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                  backgroundColor: filtroEtapa === etapa ? 'var(--color-primary)' : 'var(--color-gray-200)',
                  color: filtroEtapa === etapa ? 'white' : 'var(--color-text-primary)'
                }}
              >
                {etapa} ({qtd})
              </button>
            )
          })}
        </div>

<<<<<<< HEAD
        {/* EXIBIÇÃO EM FORMATO DE BOX (CLICÁVEL PARA ABRIR A FICHA) */}
        {carregando ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>Carregando Ordens de Serviço...</div>
        ) : ordensFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>Nenhuma Ordem de Serviço encontrada nesta etapa.</div>
        ) : (
          <div className="os-cards-grid">
            {ordensFiltradas.map((os) => (
              <div key={os.id} className="os-card-box" onClick={() => abrirVisaoOS(os)} style={{ cursor: 'pointer' }}>
                <div className="os-card-header">
                  <span className="os-card-number">{os.numero_os}</span>
                  <span className={`status-badge ${definirCorStatus(os.status)}`}>{os.status}</span>
                </div>

                <div className="os-card-body">
                  <div className="os-card-info-item">
                    <User size={15} color="var(--color-text-secondary)" />
                    <span><strong>{os.cliente_nome}</strong></span>
                  </div>
                  <div className="os-card-info-item">
                    <Smartphone size={15} color="var(--color-text-secondary)" />
                    <span>{os.marca} {os.aparelho}</span>
                  </div>
                  <div className="os-card-info-item" style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    <span>Defeito: {os.defeito_diagnosticado || os.defeito}</span>
                  </div>
                </div>

                <div className="os-card-footer">
                  <div className="os-card-footer-left">
                    <span className="os-card-value">{formatarValor(os.valor_estimado)}</span>
                    <span className="os-card-date">{formatarData(os.data_entrada)}</span>
                  </div>
                  <div className="os-card-actions">
                    <button 
                      className="btn-card-delete" 
                      onClick={(e) => excluirOS(os.id, e)}
                      title="Excluir Ordem"
                      style={{ 
                        background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', 
                        color: 'var(--color-danger, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '50%', transition: 'background 0.2s'
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
=======
        <div className="os-table-container" style={{ overflow: 'visible' }}>
          <table className="os-table">
            <thead>
              <tr>
                <th>Nº OS</th>
                <th>Cliente</th>
                <th>Aparelho / Defeito</th>
                <th>Data de Entrada</th>
                <th>Status Atual</th>
                <th>Valor Estimado</th>
                <th style={{ width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr><td colSpan="7" style={{textAlign:'center', padding:'20px'}}>Carregando...</td></tr>
              ) : ordensFiltradas.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center', padding:'20px', color: 'var(--color-text-secondary)'}}>Nenhuma Ordem de Serviço encontrada nesta etapa.</td></tr>
              ) : (
                ordensFiltradas.map((os) => (
                  <tr key={os.id}>
                    <td><strong>{os.numero_os}</strong></td>
                    <td>{os.cliente_nome}</td>
                    <td>
                      <div className="os-device">{os.marca} {os.aparelho}</div>
                      <div className="os-defect">{os.defeito_diagnosticado || os.defeito}</div>
                    </td>
                    <td>{formatarData(os.data_entrada)}</td>
                    <td><span className={`status-badge ${definirCorStatus(os.status)}`}>{os.status}</span></td>
                    <td>{formatarValor(os.valor_estimado)}</td>
                    <td style={{ position: 'visible', overflow: 'visible' }}>
                      <div className="action-container">
                        <button 
                          className="action-btn" 
                          onClick={() => setMenuAberto(menuAberto === os.id ? null : os.id)}
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {menuAberto === os.id && (
                          <div className="dropdown-menu" style={{ display: 'block' }}>
                            <button className="dropdown-item" onClick={() => { abrirVisaoOS(os); setMenuAberto(null) }}>
                              👀 Visualizar / Gerenciar
                            </button>
                            <button className="dropdown-item" style={{color: 'var(--color-danger)'}} onClick={() => { excluirOS(os.id); setMenuAberto(null) }}>
                              🗑️ Excluir Ordem
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
      </section>

      {/* MODAL DE VISUALIZAÇÃO E ESTEIRA */}
      {modalVisaoAberto && osSelecionada && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>Ficha da {osSelecionada.numero_os}</h2>
              <button onClick={() => setModalVisaoAberto(false)} style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}>
                <X size={24} />
              </button>
            </div>

            <div className="view-header-client">
              <div className="client-main-info">
                <h3 className="client-name">{osSelecionada.cliente_nome}</h3>
                <span className="client-phone" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', userSelect: 'text' }}>
                  📞 {osSelecionada.telefone}
                </span>
              </div>
<<<<<<< HEAD
=======
              <button className="btn-edit-client" onClick={() => alert('Função de editar cliente em breve')}>Editar Cliente</button>
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
            </div>

            <div className="stepper-container">
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                Progresso Atual: <span style={{ color: 'var(--color-primary)' }}>{osSelecionada.status}</span>
              </div>
              
              <div className="stepper-steps">
                {etapasFluxo.map((etapa, index) => {
                  const currentIndex = etapasFluxo.indexOf(osSelecionada.status)
                  const isCompleted = index < currentIndex
                  const isActive = index === currentIndex
                  return (
                    <div key={etapa} className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                      <div className="step-circle">{index + 1}</div>
                      <span className="step-label">{etapa}</span>
                    </div>
                  )
                })}
              </div>

              <div className="stepper-controls">
                <button type="button" className="btn-step btn-step-prev" onClick={voltarEtapa} disabled={etapasFluxo.indexOf(osSelecionada.status) === 0}>
                  ← Voltar Etapa
                </button>
<<<<<<< HEAD
                <button type="button" className="btn-step btn-step-next" onClick={avancarEtapa} disabled={osSelecionada.status === 'Finalizado'}>
                  Avançar Etapa →
                </button>
=======

                {osSelecionada.status === 'Aprovação du Cliente' || osSelecionada.status === 'Aprovação do Cliente' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
                    
                    <div className="approval-buttons">
                    </div>
                  </div>
                ) : (
                  <button type="button" className="btn-step btn-step-next" onClick={avancarEtapa} disabled={osSelecionada.status === 'Finalizado'}>
                    Avançar Etapa →
                  </button>
                )}
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
              </div>
            </div>

            {/* CHECKLIST DE QUALIDADE */}
            {osSelecionada.status === 'Testes de Qualidade' && (
              <div style={{ backgroundColor: '#fef3c7', border: '1px solid #f59e0b', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', color: '#b45309', marginBottom: '8px' }}>🛠️ Checklist de Qualidade (3 Opções)</h3>
                <p style={{ fontSize: '12px', color: '#92400e', marginBottom: '12px' }}>Avalie cada componente:</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {listaTestesQC.map(teste => {
                    const statusAtual = testesStatus[teste]
                    return (
                      <div key={teste} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{teste}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button 
                            type="button" 
                            onClick={() => mudarStatusTeste(teste, 'funciona')}
                            style={{ 
                              padding: '4px 8px', fontSize: '11px', fontWeight: '600', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                              backgroundColor: statusAtual === 'funciona' ? '#10b981' : '#e5e7eb',
                              color: statusAtual === 'funciona' ? 'white' : '#4b5563'
                            }}
                          >
                            ✓ Funciona
                          </button>
                          <button 
                            type="button" 
                            onClick={() => mudarStatusTeste(teste, 'nao_funciona')}
                            style={{ 
                              padding: '4px 8px', fontSize: '11px', fontWeight: '600', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                              backgroundColor: statusAtual === 'nao_funciona' ? '#ef4444' : '#e5e7eb',
                              color: statusAtual === 'nao_funciona' ? 'white' : '#4b5563'
                            }}
                          >
                            ✕ Não Funciona
                          </button>
                          <button 
                            type="button" 
                            onClick={() => mudarStatusTeste(teste, 'cliente_nao_aprovou')}
                            style={{ 
                              padding: '4px 8px', fontSize: '11px', fontWeight: '600', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                              backgroundColor: statusAtual === 'cliente_nao_aprovou' ? '#f59e0b' : '#e5e7eb',
                              color: statusAtual === 'cliente_nao_aprovou' ? 'white' : '#4b5563'
                            }}
                          >
                            ⊘ Cliente Não Aprovou
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label>Marca e Modelo</label>
                <div style={{ padding: '10px 12px', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', fontWeight: '600', border: '1px solid var(--color-border)' }}>
                  {osSelecionada.marca} {osSelecionada.aparelho} ({osSelecionada.cor})
                </div>
              </div>

              <div className="form-group">
                <label>Valor Orçado / Final (R$)</label>
                {osSelecionada.status === 'Avaliação Inicial' ? (
                  <input type="number" step="0.01" value={valorEditado} onChange={e => setValorEditado(e.target.value)} style={{ padding: '10px 12px', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '15px' }} />
                ) : (
                  <div style={{ padding: '10px 12px', backgroundColor: '#d1fae5', color: '#059669', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '16px', border: '1px solid #34d399' }}>
                    {formatarValor(osSelecionada.valor_estimado)}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Tempo de Garantia do Serviço</label>
                <input type="text" value={garantia} onChange={e => setGarantia(e.target.value)} style={{ padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: '600' }} />
              </div>

              <div className="form-group">
                <label>Defeito Relatado pelo Cliente</label>
                <div style={{ padding: '10px 12px', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: 'var(--radius-md)', fontWeight: '600', border: '1px solid #f87171' }}>
                  {osSelecionada.defeito}
                </div>
              </div>

              <div className="form-group form-full">
                <label>Defeito Diagnosticado (Bancada)</label>
                {osSelecionada.status === 'Avaliação Inicial' ? (
                  <input type="text" placeholder="Informe o laudo técnico..." value={defeitoDiagEditado} onChange={e => setDefeitoDiagEditado(e.target.value)} style={{ padding: '10px 12px', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-md)', fontWeight: '600' }} />
                ) : (
                  <div style={{ padding: '10px 12px', backgroundColor: 'var(--color-gray-50)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-md)', fontWeight: '600', border: '1px solid var(--color-border)' }}>
                    {osSelecionada.defeito_diagnosticado || 'Ainda não diagnosticado'}
                  </div>
                )}
              </div>

              {osSelecionada.status === 'Avaliação Inicial' && (
                <div className="form-group form-full">
                  <button type="button" className="btn-save" onClick={salvarEdicaoAvaliacao} style={{ width: '100%', padding: '10px', fontSize: '14px', backgroundColor: 'var(--color-primary)' }}>
                    💾 Salvar Alterações da Avaliação Inicial
                  </button>
                </div>
              )}

              <div className="form-group form-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--color-gray-50)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <label style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '700' }}>Senha de Desbloqueio</label>
                {osSelecionada.senha && osSelecionada.senha.startsWith('Padrão: ') ? (
                  <div className="pattern-grid" style={{ pointerEvents: 'none' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                      const numerosSenha = osSelecionada.senha.replace('Padrão: ', '').split('-').map(Number);
                      const isActive = numerosSenha.includes(num);
                      return (
                        <div key={num} className={`pattern-dot ${isActive ? 'active' : ''}`}>
                          {isActive ? numerosSenha.indexOf(num) + 1 : ''}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{osSelecionada.senha || 'Sem Senha'}</div>
                )}
              </div>

              <div className="form-group form-full">
                <label>Avarias Registradas</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  {osSelecionada.avarias ? osSelecionada.avarias.split(', ').map(avaria => (
                    <span key={avaria} style={{ padding: '6px 12px', backgroundColor: '#fef3c7', color: '#d97706', borderRadius: '99px', fontSize: '13px', fontWeight: '600' }}>
                      {avaria}
                    </span>
                  )) : 'Nenhuma avaria'}
                </div>
              </div>

              <div className="form-group">
                <label>Acessórios Deixados</label>
                <div style={{ padding: '10px 12px', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  {osSelecionada.acessorios}
                </div>
              </div>

              <div className="form-group">
                <label>Observações Internas</label>
                <div style={{ padding: '10px 12px', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  {osSelecionada.observacoes}
                </div>
              </div>
            </div>
            
            <div className="modal-actions" style={{ marginTop: '24px' }}>
              <button type="button" className="btn-cancel" onClick={() => setModalVisaoAberto(false)}>Fechar</button>
              <button type="button" className="btn-save" onClick={() => window.print()}>Imprimir OS</button>
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* MODAL DE NOVA ORDEM DE SERVIÇO */}
=======
      {/* MODAL DE CADASTRO */}
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
      {modalCadastroAberto && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>Nova Ordem de Serviço</h2>
              <button onClick={() => setModalCadastroAberto(false)} style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSalvarOS}>
<<<<<<< HEAD
              
              <div className="form-grid">
                
                {/* --- SEÇÃO DE SELEÇÃO DE CLIENTE --- */}
                <div className="form-group form-full">
                  <h3 style={{fontSize: '14px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', margin: '0 0 12px 0'}}>
                    Dados do Cliente
                  </h3>
                </div>
                
                {clienteSelecionado ? (
                  <div className="cliente-selecionado-box">
                    <div className="cliente-selecionado-info">
                      <h4>{clienteSelecionado.nome}</h4>
                      <p>{clienteSelecionado.telefone || 'Sem telefone'} • {clienteSelecionado.cpf || 'Sem CPF/CNPJ'}</p>
                    </div>
                    <button type="button" className="btn-trocar-cliente" onClick={() => setClienteSelecionado(null)}>
                      Trocar Cliente
                    </button>
                  </div>
                ) : (
                  <div className="busca-cliente-wrapper">
                    <input 
                      type="text" 
                      className="busca-cliente-input"
                      placeholder="Digite o nome, CPF ou celular para buscar o cliente..." 
                      value={buscaCliente}
                      onChange={(e) => setBuscaCliente(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="btn-save" 
                      onClick={() => setModalNovoClienteAberto(true)}
                      style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-md)' }}
                    >
                      + Novo Cliente
                    </button>

                    {buscaCliente && (
                      <ul className="lista-busca-flutuante">
                        {clientes
                          .filter(c => 
                            c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) || 
                            (c.telefone && c.telefone.includes(buscaCliente)) ||
                            (c.cpf && c.cpf.includes(buscaCliente))
                          )
                          .map(c => (
                            <li key={c.id} onClick={() => { 
                              setClienteSelecionado(c); 
                              setBuscaCliente(''); 
                            }}>
                              <strong style={{ color: 'var(--color-text-primary)' }}>{c.nome}</strong>
                              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{c.telefone || 'Sem número'}</span>
                            </li>
                        ))}
                        {clientes.filter(c => c.nome.toLowerCase().includes(buscaCliente.toLowerCase())).length === 0 && (
                          <li style={{ color: 'var(--color-gray-500)', cursor: 'default', justifyContent: 'center' }}>
                            Nenhum cliente encontrado.
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
                
                {/* --- SEÇÃO DO APARELHO --- */}
                <div className="form-group form-full" style={{ marginTop: '16px' }}>
                  <h3 style={{fontSize: '14px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', margin: '0 0 12px 0'}}>
                    Identificação e Triagem
                  </h3>
                </div>
=======
              <div className="form-grid">
                <div className="form-group form-full"><h3 style={{fontSize: '14px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px'}}>Dados do Cliente</h3></div>
                
                <div className="form-group form-full">
                  <label>CPF / CNPJ</label>
                  <div className="input-with-button">
                    <input type="text" required value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} placeholder="Apenas números" />
                    <button type="button" className="btn-buscar-cnpj" onClick={handleBuscarCNPJ}>Buscar CNPJ</button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Nome Completo / Razão Social</label>
                  <input type="text" required value={formData.cliente_nome} onChange={e => setFormData({...formData, cliente_nome: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Telefone / WhatsApp</label>
                  <input type="text" required value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
                </div>
                
                <div className="form-group form-full">
                  <label>Rua / Logradouro</label>
                  <input type="text" required value={formData.rua} onChange={e => setFormData({...formData, rua: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label>Número</label>
                  <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <input type="text" required={!formData.sem_numero} disabled={formData.sem_numero} value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} style={{flex: 1}} />
                    <label className="checkbox-label">
                      <input type="checkbox" checked={formData.sem_numero} onChange={e => setFormData({...formData, sem_numero: e.target.checked, numero: ''})} /> S/N
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Bairro</label>
                  <input type="text" required value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} />
                </div>
                <div className="form-group form-full">
                  <label>Cidade</label>
                  <input type="text" required value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} />
                </div>

                <div className="form-group form-full"><h3 style={{fontSize: '14px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px'}}>Identificação e Triagem</h3></div>
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804

                <div className="form-group"><label>Marca</label><input type="text" required value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} /></div>
                <div className="form-group"><label>Modelo do Aparelho</label><input type="text" required value={formData.aparelho} onChange={e => setFormData({...formData, aparelho: e.target.value})} /></div>
                <div className="form-group"><label>Cor do Aparelho</label><input type="text" required value={formData.cor} onChange={e => setFormData({...formData, cor: e.target.value})} /></div>
                
                <div className="form-group">
                  <label style={{display: 'flex', justifyContent: 'space-between'}}>
                    Senha de Desbloqueio
<<<<<<< HEAD
                    <select value={formData.tipo_senha} onChange={e => setFormData({...formData, tipo_senha: e.target.value, senha: ''})} style={{fontSize: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-primary)'}}>
=======
                    <select value={formData.type_senha || formData.tipo_senha} onChange={e => setFormData({...formData, tipo_senha: e.target.value, senha: ''})} style={{fontSize: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-primary)'}}>
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
                      <option value="texto">Texto/PIN</option>
                      <option value="padrao">Desenho (Padrão)</option>
                    </select>
                  </label>
                  {formData.tipo_senha === 'texto' ? (
                    <input type="text" required placeholder="Ex: 123456" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />
                  ) : (
                    <div className="pattern-lock-container" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                      <div className="pattern-grid">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <div key={num} className={`pattern-dot ${padraoDesbloqueio.includes(num) ? 'active' : ''}`} onMouseDown={() => handleMouseDown(num)} onMouseEnter={() => handleMouseEnter(num)}>
                            {padraoDesbloqueio.includes(num) ? padraoDesbloqueio.indexOf(num) + 1 : ''}
                          </div>
                        ))}
                      </div>
                      <span className="btn-clear-pattern" onClick={() => setPadraoDesbloqueio([])}>Limpar Padrão</span>
                    </div>
                  )}
                </div>

                <div className="form-group form-full"><label>Defeito Relatado pelo Cliente</label><input type="text" required value={formData.defeito} onChange={e => setFormData({...formData, defeito: e.target.value})} /></div>
                <div className="form-group form-full"><label>Defeito Diagnosticado (Opcional na entrada)</label><input type="text" value={formData.defeito_diagnosticado} onChange={e => setFormData({...formData, defeito_diagnosticado: e.target.value})} placeholder="Preencha agora ou depois na bancada" /></div>
                <div className="form-group form-full"><label>Acessórios Deixados</label><input type="text" required value={formData.acessorios} onChange={e => setFormData({...formData, acessorios: e.target.value})} /></div>

                <div className="form-group form-full">
                  <label>Estado Físico / Avarias</label>
                  <div className="checkbox-group">
                    {opcoesAvarias.map(avaria => (
                      <label key={avaria} className="checkbox-label">
                        <input type="checkbox" checked={formData.avarias.includes(avaria)} onChange={() => handleAvarias(avaria)} /> {avaria}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group form-full"><label>Observações Gerais</label><input type="text" required value={formData.observacoes} onChange={e => setFormData({...formData, observacoes: e.target.value})} /></div>
                <div className="form-group form-full"><label>Valor Estimado Inicial (R$)</label><input type="number" step="0.01" required value={formData.valor_estimado} onChange={e => setFormData({...formData, valor_estimado: e.target.value})} /></div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setModalCadastroAberto(false)}>Cancelar</button>
<<<<<<< HEAD
                <button type="submit" className="btn-save">Salvar Ordem de Serviço</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: CRIAR NOVO CLIENTE DIRETO NA OS */}
      {modalNovoClienteAberto && (
        <div className="modal-overlay" style={{ zIndex: 11000 }}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>Cadastrar Novo Cliente</h2>
              <button onClick={() => setModalNovoClienteAberto(false)} style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={salvarNovoClienteNaOS}>
              <div className="form-grid">
                <div className="form-group">
                  <label>CPF / CNPJ</label>
                  <div className="input-with-button" style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Apenas números" 
                      value={formClienteData.cpf} 
                      onChange={e => setFormClienteData({...formClienteData, cpf: e.target.value})} 
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="btn-save" onClick={buscarCNPJCliente} style={{ padding: '0 12px', fontSize: '13px' }}>
                      Buscar CNPJ
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Data de Nascimento</label>
                  <input 
                    type="date" 
                    value={formClienteData.data_nascimento} 
                    onChange={e => setFormClienteData({...formClienteData, data_nascimento: e.target.value})} 
                  />
                </div>

                <div className="form-group form-full">
                  <label>Nome Completo / Razão Social *</label>
                  <input 
                    type="text" 
                    required 
                    value={formClienteData.nome} 
                    onChange={e => setFormClienteData({...formClienteData, nome: e.target.value})} 
                  />
                </div>
                
                <div className="form-group form-full">
                  <label>Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    value={formClienteData.telefone} 
                    onChange={e => setFormClienteData({...formClienteData, telefone: e.target.value})} 
                  />
                </div>
                
                <div className="form-group form-full">
                  <label>Rua / Logradouro</label>
                  <input 
                    type="text" 
                    value={formClienteData.rua} 
                    onChange={e => setFormClienteData({...formClienteData, rua: e.target.value})} 
                  />
                </div>

                <div className="form-group">
                  <label>Número</label>
                  <input 
                    type="text" 
                    value={formClienteData.numero} 
                    onChange={e => setFormClienteData({...formClienteData, numero: e.target.value})} 
                  />
                </div>

                <div className="form-group">
                  <label>Bairro</label>
                  <input 
                    type="text" 
                    value={formClienteData.bairro} 
                    onChange={e => setFormClienteData({...formClienteData, bairro: e.target.value})} 
                  />
                </div>

                <div className="form-group form-full">
                  <label>Cidade</label>
                  <input 
                    type="text" 
                    value={formClienteData.cidade} 
                    onChange={e => setFormClienteData({...formClienteData, cidade: e.target.value})} 
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setModalNovoClienteAberto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar e Selecionar Cliente
                </button>
=======
                <button type="submit" className="btn-save">Salvar Ordem Completa</button>
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}