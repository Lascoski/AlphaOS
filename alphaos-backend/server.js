const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o Banco de Dados
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// ==========================================
// ROTA GET: Buscar todas as Ordens de Serviço
// ==========================================
app.get('/api/ordens', async (req, res) => {
  try {
    const query = `
      SELECT 
        os.*, 
        c.nome as cliente_nome, 
        c.telefone, 
        c.cpf, 
        c.rua, 
        c.numero, 
        c.bairro, 
        c.cidade 
      FROM ordens_servico os
      JOIN clientes c ON os.cliente_id = c.id
      ORDER BY os.data_entrada DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// ==========================================
// ROTA POST: Criar uma nova Ordem de Serviço (Começando do 001)
// ==========================================
app.post('/api/ordens', async (req, res) => {
  const { 
    cliente_nome, telefone, cpf, rua, numero, bairro, cidade, 
    marca, aparelho, cor, senha, defeito, defeito_diagnosticado,
    acessorios, avarias, observacoes, valor_estimado 
  } = req.body;

  try {
    await pool.query('BEGIN');

    // 1. Cria o cliente e pega o ID gerado
    const insertCliente = 'INSERT INTO clientes (nome, telefone, cpf, rua, numero, bairro, cidade) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
    const clienteResult = await pool.query(insertCliente, [cliente_nome, telefone, cpf, rua, numero, bairro, cidade]);
    const clienteId = clienteResult.rows[0].id;

    // 2. Gera o próximo número sequencial da OS a partir de 001
    const countResult = await pool.query('SELECT COUNT(*) FROM ordens_servico');
    const proximoNumero = parseInt(countResult.rows[0].count) + 1;
    const numeroFormatado = String(proximoNumero).padStart(3, '0');
    const numeroOs = `OS-${numeroFormatado}`;

    // 3. Cria a Ordem de Serviço vinculada ao cliente
    const insertOs = `
      INSERT INTO ordens_servico (
        numero_os, cliente_id, marca, aparelho, cor, senha, 
        defeito, defeito_diagnosticado, acessorios, avarias, observacoes, valor_estimado, status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Avaliação Inicial') 
      RETURNING *
    `;
    const valoresOs = [numeroOs, clienteId, marca, aparelho, cor, senha, defeito, defeito_diagnosticado || '', acessorios, avarias, observacoes, valor_estimado];
    
    const osResult = await pool.query(insertOs, valoresOs);

    await pool.query('COMMIT');
    res.status(201).json(osResult.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Erro ao criar OS:', err.message);
    res.status(500).json({ error: 'Erro ao criar Ordem de Serviço' });
  }
});

// ==========================================
// ROTA POST: Enviar Orçamento via WhatsApp
// ==========================================
app.post('/api/ordens/:id/enviar-whatsapp', async (req, res) => {
  const { telefone, cliente_nome, aparelho, defeito_diagnosticado, valor_estimado, garantia } = req.body;

  try {
    const mensagem = `Olá *${cliente_nome}*, aqui é da assistência técnica. \n\n` +
      `Analisamos o seu *${aparelho}* e o diagnóstico técnico foi: *${defeito_diagnosticado}*.\n` +
      `O valor total do serviço é de *R$ ${Number(valor_estimado).toFixed(2)}* com garantia de *${garantia || '90 dias'}*.\n\n` +
      `Por favor, responda com o número da sua escolha:\n` +
      `1️⃣ - Aprovado\n` +
      `2️⃣ - Recusado\n` +
      `3️⃣ - Descarte\n` +
      `4️⃣ - Dúvida (Falar com atendente)`;

    console.log(`📲 Mensagem de orçamento gerada para ${telefone}: \n${mensagem}`);
    res.json({ message: 'Orçamento enviado com sucesso via WhatsApp!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao enviar mensagem no WhatsApp' });
  }
});

// ==========================================
// ROTA POST: Enviar Aviso de Aparelho Pronto via WhatsApp
// ==========================================
app.post('/api/ordens/:id/enviar-whatsapp-pronto', async (req, res) => {
  const { telefone, cliente_nome, aparelho, defeito_diagnosticado, valor_estimado } = req.body;

  try {
    const mensagem = `Olá *${cliente_nome}*, ótimas notícias! O seu *${aparelho}* está pronto e passou por todos os nossos testes de qualidade. 🛠️✨\n\n` +
      `📋 *Diagnóstico do Reparo:* ${defeito_diagnosticado}\n` +
      `💰 *Valor Final:* R$ ${Number(valor_estimado).toFixed(2)}\n\n` +
      `🕒 *Horário de Funcionamento:* Segunda a Sexta das 09:00 às 18:00, e Sábado das 09:00 às 13:00.\n` +
      `💳 *Formas de Pagamento:* Dinheiro, Pix, Débito e Crédito (consulte condições para parcelamento).\n\n` +
      `Te esperamos aqui na loja para a retirada! Qualquer dúvida é só chamar.`;

    console.log(`📲 Mensagem de Aparelho Pronto gerada para ${telefone}: \n${mensagem}`);
    res.json({ message: 'Aviso de pronto enviado com sucesso!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao enviar mensagem de aparelho pronto' });
  }
});

// ==========================================
// ROTA DELETE: Excluir Ordem de Serviço
// ==========================================
app.delete('/api/ordens/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM ordens_servico WHERE id = $1', [id]);
    res.json({ message: 'Ordem excluída com sucesso!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao excluir Ordem de Serviço' });
  }
});

// ==========================================
// ROTA PATCH: Atualizar APENAS o Status (Barra de Progresso)
// ==========================================
app.patch('/api/ordens/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query('UPDATE ordens_servico SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Status atualizado com sucesso!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar o status' });
  }
});

// ==========================================
// ROTA PUT: Editar Dados da OS, Cliente e Checklist de Qualidade
// ==========================================
app.put('/api/ordens/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    cliente_id, cliente_nome, telefone, cpf, rua, numero, bairro, cidade, 
    marca, aparelho, cor, senha, defeito, defeito_diagnosticado, 
    acessorios, avarias, observacoes, valor_estimado, testes_qualidade 
  } = req.body;

  try {
    await pool.query('BEGIN');

    const updateCliente = `
      UPDATE clientes 
      SET nome = $1, telefone = $2, cpf = $3, rua = $4, numero = $5, bairro = $6, cidade = $7 
      WHERE id = $8
    `;
    await pool.query(updateCliente, [cliente_nome, telefone, cpf, rua, numero, bairro, cidade, cliente_id]);

    const updateOs = `
      UPDATE ordens_servico 
      SET marca = $1, aparelho = $2, cor = $3, senha = $4, defeito = $5, 
          defeito_diagnosticado = $6, acessorios = $7, avarias = $8, observacoes = $9, 
          valor_estimado = $10, testes_qualidade = $11
      WHERE id = $12
    `;
    await pool.query(updateOs, [
      marca, aparelho, cor, senha, defeito, defeito_diagnosticado, 
      acessorios, avarias, observacoes, valor_estimado, testes_qualidade || '', id
    ]);

    await pool.query('COMMIT');
    res.json({ message: 'Ordem atualizada com sucesso!' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao editar a Ordem de Serviço' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Back-end do alphaOS rodando na porta ${PORT}`);
});