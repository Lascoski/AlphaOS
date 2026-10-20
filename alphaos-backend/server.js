const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'chave_fallback_super_secreta');
if (!jwtSecret) throw new Error('Defina JWT_SECRET nas variáveis de ambiente.');

// Conexão com o Banco de Dados
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
    };
if (process.env.PGSSLMODE === 'require') {
  poolConfig.ssl = { rejectUnauthorized: false };
}
const pool = new Pool(poolConfig);

// ==========================================
// ROTA POST: Criar Utilizador Inicial (Registo)
// ==========================================
app.post('/api/usuarios/registrar', async (req, res) => {
  const { nome, email, senha, papel } = req.body;
  try {
    const usuariosExistentes = await pool.query('SELECT COUNT(*)::int AS total FROM usuarios');
    if (usuariosExistentes.rows[0].total > 0) {
      return res.status(403).json({ error: 'O cadastro inicial já foi concluído.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, papel) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, papel',
      [nome, email, senhaHash, papel || 'Administrador']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Este e-mail já está registado.' });
    }
    console.error('Erro ao criar utilizador:', err.message);
    res.status(500).json({ error: 'Erro ao criar utilizador' });
  }
});
// ==========================================
// ROTA POST: Login
// ==========================================
app.post('/api/login', async (req, res) => {
  const { email, senha, lembrar } = req.body; // <-- Adicionámos o "lembrar" aqui
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'E-mail ou palavra-passe incorretos' });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaValida) {
      return res.status(401).json({ error: 'E-mail ou palavra-passe incorretos' });
    }

    // Se "lembrar" for true, o token dura 30 dias. Se for false, dura apenas 8 horas.
    const tempoExpiracao = lembrar ? '30d' : '8h';

    const token = jwt.sign(
      { id: usuario.id, papel: usuario.papel }, 
      jwtSecret,
      { expiresIn: tempoExpiracao }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel }
    });
  } catch (err) {
    console.error('Erro ao efetuar login:', {
      name: err?.name,
      message: err?.message || String(err),
      code: err?.code,
      detail: err?.detail,
      hint: err?.hint,
      stack: err?.stack,
    });
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Protege as rotas da aplicação. O login, o cadastro inicial e o webhook
// permanecem públicos para permitir autenticação e integração com a Meta.
app.use('/api', (req, res, next) => {
  if (req.path === '/login' || req.path === '/usuarios/registrar' || req.path.startsWith('/webhook/whatsapp')) {
    return next();
  }

  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Autenticação necessária.' });

  try {
    req.usuario = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
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
    console.error('❌ Erro ao buscar ordens:', err.message);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// ==========================================
// ROTA GET: Buscar todos os Clientes com métricas atualizadas
// ==========================================
app.get('/api/clientes', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*,
        COALESCE(
          (SELECT SUM(valor_estimado) FROM ordens_servico WHERE cliente_id = c.id AND status = 'Finalizado') +
          (SELECT SUM(valor_total) FROM vendas WHERE cliente_id = c.id), 0
        ) as valor_gasto,
        GREATEST(
          (SELECT MAX(data_entrada) FROM ordens_servico WHERE cliente_id = c.id),
          (SELECT MAX(data_venda) FROM vendas WHERE cliente_id = c.id)
        ) as ultima_compra
      FROM clientes c
      ORDER BY c.nome ASC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err.message);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// ==========================================
// ROTA POST: Criar um Novo Cliente
// ==========================================
app.post('/api/clientes', async (req, res) => {
  let { nome, telefone, cpf, rua, numero, bairro, cidade, data_nascimento } = req.body;
  
  cpf = cpf ? cpf.trim() : null;
  if (cpf === '') cpf = null;

  try {
    const query = `
      INSERT INTO clientes (nome, telefone, cpf, rua, numero, bairro, cidade, data_nascimento) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *;
    `;
    const values = [nome, telefone, cpf, rua, numero, bairro, cidade, data_nascimento || null];
    
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Este CPF/CNPJ já está cadastrado no sistema.' });
    }
    console.error('Erro ao criar cliente:', err.message);
    res.status(500).json({ error: 'Erro interno ao criar cliente' });
  }
});

// ==========================================
// ROTA PUT: Editar Cliente
// ==========================================
app.put('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;
  let { nome, telefone, cpf, rua, numero, bairro, cidade, data_nascimento } = req.body;
  
  cpf = cpf ? cpf.trim() : null;
  if (cpf === '') cpf = null;

  try {
    const query = `
      UPDATE clientes 
      SET nome = $1, telefone = $2, cpf = $3, rua = $4, numero = $5, bairro = $6, cidade = $7, data_nascimento = $8
      WHERE id = $9
      RETURNING *;
    `;
    const values = [nome, telefone, cpf, rua, numero, bairro, cidade, data_nascimento || null, id];
    
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Este CPF/CNPJ já está cadastrado para outro cliente.' });
    }
    console.error('Erro ao editar cliente:', err.message);
    res.status(500).json({ error: 'Erro interno ao editar cliente' });
  }
});

// ==========================================
// ROTA POST: Criar uma nova Ordem de Serviço
// ==========================================
app.post('/api/ordens', async (req, res) => {
  const { 
    cliente_id, marca, aparelho, cor, senha, defeito, defeito_diagnosticado,
    acessorios, avarias, observacoes, valor_estimado 
  } = req.body;

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const maxIdResult = await client.query('SELECT COALESCE(MAX(id), 0) as max_id FROM ordens_servico');
    const proximoNumero = parseInt(maxIdResult.rows[0].max_id) + 1;
    const numeroFormatado = String(proximoNumero).padStart(3, '0');
    const numeroOs = `OS-${numeroFormatado}`;

    const insertOs = `
      INSERT INTO ordens_servico (
        numero_os, cliente_id, marca, aparelho, cor, senha, 
        defeito, defeito_diagnosticado, acessorios, avarias, observacoes, valor_estimado, status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Avaliação Inicial') 
      RETURNING *
    `;
    const valoresOs = [
      numeroOs, cliente_id, marca, aparelho, cor, senha, 
      defeito, defeito_diagnosticado || '', acessorios, avarias, observacoes, valor_estimado
    ];
    
    const osResult = await client.query(insertOs, valoresOs);

    await client.query('COMMIT');
    client.release();
    res.status(201).json(osResult.rows[0]);
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
      client.release();
    }
    console.error('Erro ao criar OS:', err.message);
    res.status(500).json({ error: 'Erro ao criar Ordem de Serviço: ' + err.message });
  }
});

// ==========================================
// ROTAS DE PRODUTOS / ESTOQUE
// ==========================================
app.get('/api/produtos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY nome ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err.message);
    res.status(500).json({ error: 'Erro ao buscar estoque' });
  }
});

app.post('/api/produtos', async (req, res) => {
  const { nome, preco, quantidade_estoque } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO produtos (nome, preco, quantidade_estoque) VALUES ($1, $2, $3) RETURNING *',
      [nome, preco, quantidade_estoque || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar produto:', err.message);
    res.status(500).json({ error: 'Erro ao cadastrar produto' });
  }
});

// ==========================================
// ROTAS DE VENDAS
// ==========================================
app.get('/api/vendas', async (req, res) => {
  try {
    const query = `
      SELECT 
        v.*, 
        c.nome as cliente_nome, 
        c.telefone,
        os.numero_os
      FROM vendas v
      JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN ordens_servico os ON v.os_id = os.id
      ORDER BY v.data_venda DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar vendas:', err.message);
    res.status(500).json({ error: 'Erro ao buscar vendas' });
  }
});

app.post('/api/vendas', async (req, res) => {
  const { cliente_id, os_id, valor_total, meio_pagamento, itens } = req.body;
  
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const insertVenda = `
      INSERT INTO vendas (cliente_id, os_id, valor_total, meio_pagamento) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
    const vendaResult = await client.query(insertVenda, [cliente_id, os_id || null, valor_total, meio_pagamento]);
    const vendaId = vendaResult.rows[0].id;

    if (itens && Array.isArray(itens) && itens.length > 0) {
      for (let item of itens) {
        let produtoFinalId = item.produto_id;

        if (item.isManual || typeof item.produto_id === 'string') {
          const prodRes = await client.query(
            'INSERT INTO produtos (nome, preco, quantidade_estoque) VALUES ($1, $2, $3) RETURNING id',
            [`(Avulso) ${item.nome}`, item.preco_unitario, 0]
          );
          produtoFinalId = prodRes.rows[0].id;
        }

        await client.query(
          `INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)`,
          [vendaId, produtoFinalId, item.quantidade, item.preco_unitario]
        );

        if (!item.isManual && typeof item.produto_id !== 'string') {
          await client.query(
            `UPDATE produtos SET quantidade_estoque = quantidade_estoque - $1 WHERE id = $2`,
            [item.quantidade, produtoFinalId]
          );
        }
      }
    }

    if (os_id) {
      await client.query(`UPDATE ordens_servico SET status = 'Finalizado' WHERE id = $1`, [os_id]);
    }

    await client.query('COMMIT');
    client.release();
    res.status(201).json(vendaResult.rows[0]);
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
      client.release();
    }
    console.error('Erro ao registrar venda:', err.message);
    res.status(500).json({ error: 'Erro ao registrar venda' });
  }
});

app.delete('/api/vendas/:id', async (req, res) => {
  const { id } = req.params;

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query('DELETE FROM itens_venda WHERE venda_id = $1', [id]);
    await client.query('DELETE FROM vendas WHERE id = $1', [id]);
    await client.query('COMMIT');
    client.release();
    res.json({ message: 'Venda cancelada e excluída com sucesso!' });
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
      client.release();
    }
    console.error("Erro ao deletar venda:", err.message);
    res.status(500).json({ error: 'Erro ao deletar venda e seus itens.' });
  }
});

app.put('/api/vendas/:id', async (req, res) => {
  const { id } = req.params;
  const { cliente_id, valor_total, meio_pagamento, itens } = req.body;

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query(
      'UPDATE vendas SET cliente_id = $1, valor_total = $2, meio_pagamento = $3 WHERE id = $4',
      [cliente_id, valor_total, meio_pagamento, id]
    );
    await client.query('DELETE FROM itens_venda WHERE venda_id = $1', [id]);

    if (itens && itens.length > 0) {
      for (let item of itens) {
        let produtoFinalId = item.produto_id;

        if (item.isManual || typeof item.produto_id === 'string') {
          const prodRes = await client.query(
            'INSERT INTO produtos (nome, preco, quantidade_estoque) VALUES ($1, $2, $3) RETURNING id',
            [`(Avulso) ${item.nome}`, item.preco_unitario, 0]
          );
          produtoFinalId = prodRes.rows[0].id;
        }

        await client.query(
          'INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)',
          [id, produtoFinalId, item.quantidade, item.preco_unitario]
        );
      }
    }

    await client.query('COMMIT');
    client.release();
    res.json({ message: 'Venda e itens atualizados com sucesso!' });
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
      client.release();
    }
    console.error("Erro ao atualizar venda:", err.message);
    res.status(500).json({ error: 'Erro ao atualizar os dados da venda.' });
  }
});

// ==========================================
// ROTAS DE WHATSAPP / EXCLUIR OS / ATUALIZAR STATUS COM DISPARO
// ==========================================

// Rota de disparo manual de Orçamento
app.post('/api/ordens/:id/enviar-whatsapp', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT os.numero_os, os.valor_estimado, c.telefone, c.nome 
      FROM ordens_servico os
      JOIN clientes c ON os.cliente_id = c.id
      WHERE os.id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Ordem de serviço não encontrada.' });

    const { numero_os, valor_estimado, telefone } = result.rows[0];
    if (!telefone) return res.status(400).json({ error: 'O cliente não possui telefone cadastrado.' });

    let telefoneLimpo = telefone.replace(/\D/g, '');
    if (!telefoneLimpo.startsWith('55')) telefoneLimpo = '55' + telefoneLimpo;

    const data = {
      messaging_product: 'whatsapp',
      to: telefoneLimpo, 
      type: 'template',
      template: {
        name: 'orcamento_aprovacao_os', 
        language: { code: 'pt_BR' },
        components: [{
          type: 'body',
          parameters: [
            { type: 'text', text: numero_os },
            { type: 'text', text: `R$ ${Number(valor_estimado || 0).toFixed(2)}` }
          ]
        }]
      }
    };

    const metaResponse = await fetch(`https://graph.facebook.com/v18.0/${process.env.META_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const metaData = await metaResponse.json();

    if (metaResponse.ok) {
      console.log(`✅ Orçamento enviado para ${telefoneLimpo}`);
      await pool.query(`UPDATE ordens_servico SET status = 'Aprovação do Cliente' WHERE id = $1`, [id]);
      return res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
    } else {
      console.error('❌ Erro retornado pela Meta (Manual):', JSON.stringify(metaData, null, 2));
      return res.status(500).json({ error: 'Falha ao enviar WhatsApp.', details: metaData });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno: ' + err.message });
  }
});

// Rota de disparo manual Aparelho Pronto
app.post('/api/ordens/:id/enviar-whatsapp-pronto', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT os.numero_os, os.aparelho, os.defeito_diagnosticado, os.valor_estimado, c.telefone, c.nome 
      FROM ordens_servico os
      JOIN clientes c ON os.cliente_id = c.id
      WHERE os.id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Ordem de serviço não encontrada.' });

    const { aparelho, defeito_diagnosticado, valor_estimado, telefone, nome } = result.rows[0];
    if (!telefone) return res.status(400).json({ error: 'O cliente não possui telefone.' });

    let telefoneLimpo = telefone.replace(/\D/g, '');
    if (!telefoneLimpo.startsWith('55')) telefoneLimpo = '55' + telefoneLimpo;

    const data = {
      messaging_product: 'whatsapp',
      to: telefoneLimpo, 
      type: 'template',
      template: {
        name: 'aparelho_pronto_retirada', 
        language: { code: 'pt_BR' },
        components: [{
          type: 'body',
          parameters: [
            { type: 'text', text: nome },
            { type: 'text', text: aparelho },
            { type: 'text', text: defeito_diagnosticado || 'Reparo concluído' },
            { type: 'text', text: Number(valor_estimado || 0).toFixed(2) }
          ]
        }]
      }
    };

    const metaResponse = await fetch(`https://graph.facebook.com/v18.0/${process.env.META_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (metaResponse.ok) {
      return res.status(200).json({ success: true, message: 'Enviado!' });
    } else {
      return res.status(500).json({ error: 'Falha ao enviar.' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno: ' + err.message });
  }
});

// AQUI OCORRE A MÁGICA DE MUDAR O STATUS DA OS E DISPARAR O WHATSAPP AUTOMATICAMENTE
app.patch('/api/ordens/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, meio_pagamento } = req.body;

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query('UPDATE ordens_servico SET status = $1 WHERE id = $2', [status, id]);

    // 1. Se finalizou a OS, gera a venda automaticamente
    if (status === 'Finalizado') {
      const osData = await client.query('SELECT cliente_id, valor_estimado FROM ordens_servico WHERE id = $1', [id]);
      if (osData.rowCount > 0) {
        const { cliente_id, valor_estimado } = osData.rows[0];
        const vendaExistente = await client.query('SELECT id FROM vendas WHERE os_id = $1', [id]);
        if (vendaExistente.rowCount === 0) {
          await client.query(
            `INSERT INTO vendas (cliente_id, os_id, valor_total, meio_pagamento) VALUES ($1, $2, $3, $4)`,
            [cliente_id, id, valor_estimado || 0, meio_pagamento || 'Dinheiro']
          );
        }
      }
    }

    // 2. Se a OS for avançada para a etapa de Aprovação, dispara a API do WhatsApp
    if (status === 'Aprovação do Cliente') {
      const query = `
        SELECT os.numero_os, os.valor_estimado, c.telefone 
        FROM ordens_servico os
        JOIN clientes c ON os.cliente_id = c.id
        WHERE os.id = $1
      `;
      const result = await client.query(query, [id]);
      
      if (result.rowCount > 0 && result.rows[0].telefone) {
        const { numero_os, valor_estimado, telefone } = result.rows[0];
        
        let telefoneLimpo = telefone.replace(/\D/g, '');
        if (!telefoneLimpo.startsWith('55')) telefoneLimpo = '55' + telefoneLimpo;

        const dataTemplate = {
          messaging_product: 'whatsapp',
          to: telefoneLimpo, 
          type: 'template',
          template: {
            name: 'orcamento_aprovacao_os', 
            language: { code: 'pt_BR' },
            components: [{
              type: 'body',
              parameters: [
                { type: 'text', text: numero_os },
                { type: 'text', text: `R$ ${Number(valor_estimado || 0).toFixed(2)}` }
              ]
            }]
          }
        };

        // Dispara assincronamente (em segundo plano)
        fetch(`https://graph.facebook.com/v18.0/${process.env.META_PHONE_ID}/messages`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(dataTemplate)
        })
        .then(async resMeta => {
          if (resMeta.ok) {
            console.log(`✅ Automático: Orçamento disparado com sucesso para ${telefoneLimpo}`);
          } else {
            const errData = await resMeta.json();
            console.error('❌ Erro da Meta no disparo automático:', JSON.stringify(errData, null, 2));
          }
        })
        .catch(errFetch => console.error('❌ Erro de Fetch no disparo automático:', errFetch.message));
      }
    }

    await client.query('COMMIT');
    client.release();
    res.json({ message: 'Status atualizado com sucesso!' });
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
      client.release();
    }
    res.status(500).json({ error: 'Erro ao atualizar status: ' + err.message });
  }
});

app.delete('/api/ordens/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM ordens_servico WHERE id = $1', [id]);
    res.json({ message: 'Ordem excluída com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir Ordem de Serviço' });
  }
});

app.put('/api/ordens/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    marca, aparelho, cor, senha, defeito, defeito_diagnosticado, 
    acessorios, avarias, observacoes, valor_estimado, testes_qualidade 
  } = req.body;

  try {
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
    res.json({ message: 'Ordem atualizada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao editar a Ordem de Serviço' });
  }
});

// ==========================================
// WEBHOOK DO WHATSAPP (Aprovação de Orçamentos via Celular)
// ==========================================
app.get('/api/webhook/whatsapp', (req, res) => {
  const TOKEN_VERIFICACAO = "alphaos26";
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === TOKEN_VERIFICACAO) {
    res.status(200).send(challenge); 
  } else {
    res.sendStatus(403); 
  }
});

app.post('/api/webhook/whatsapp', async (req, res) => {
  const body = req.body;
  res.sendStatus(200); // Libera o ngrok e a Meta rapidamente

  console.log('\n📦 [WEBHOOK] Novo evento recebido da Meta:');
  console.log(JSON.stringify(body, null, 2));

  if (body.object === 'whatsapp_business_account' && body.entry?.[0]?.changes?.[0]?.value?.messages) {
    const mensagem = body.entry[0].changes[0].value.messages[0];
    const numeroCliente = mensagem.from; 

    // Somente atua se a mensagem for o clique de um botão iterativo (nossos templates)
    if (mensagem.type === 'interactive') {
      const idBotaoClicado = mensagem.interactive.button_reply.id;
      let novoStatus = idBotaoClicado === 'btn_aprovar' ? 'Compra das Peças' : idBotaoClicado === 'btn_recusar' ? 'Pronto (Avisar Cliente)' : '';

      if (novoStatus) {
        try {
          const telefoneFinal = numeroCliente.slice(-8); // Pega os últimos 8 dígitos do telefone para buscar no banco
          await pool.query(`
            UPDATE ordens_servico
            SET status = $1
            WHERE id = (
              SELECT os.id FROM ordens_servico os JOIN clientes c ON os.cliente_id = c.id
              WHERE regexp_replace(c.telefone, '\\D', '', 'g') LIKE $2 AND os.status = 'Aprovação do Cliente'
              ORDER BY os.data_entrada DESC LIMIT 1
            )
          `, [novoStatus, `%${telefoneFinal}%`]);
          console.log(`🚀 Sucesso! A OS foi aprovada via celular e atualizada para: ${novoStatus}`);
        } catch (err) {
          console.error('❌ Erro ao atualizar OS via Webhook:', err.message);
        }
      }
    }
  }
});

// ==========================================
// ROTA POST: Reconhecer Aparelho via IA (Gemini)
// ==========================================
app.post('/api/reconhecer-aparelho', async (req, res) => {
  const { imagem } = req.body;
  if (!imagem) return res.status(400).json({ error: 'Nenhuma imagem enviada.' });

  const base64Data = imagem.replace(/^data:image\/\w+;base64,/, '');
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Chave da API do Gemini não configurada.' });

  let tentativas = 3;
  let sucesso = false;
  let dadosResposta = null;

  while (tentativas > 0 && !sucesso) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Você é um especialista em eletrônicos. Analise esta foto da parte traseira de um smartphone e identifique o modelo exato. Retorne APENAS o nome do modelo limpo. Se não conseguir, responda 'Desconhecido'." },
              { inline_data: { mime_type: "image/jpeg", data: base64Data } }
            ]
          }]
        })
      });

      dadosResposta = await response.json();
      if (response.ok) {
        sucesso = true;
      } else if (dadosResposta.error?.code === 503) {
        tentativas--;
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        break;
      }
    } catch (err) {
      tentativas--;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  if (!sucesso || !dadosResposta?.candidates) {
    return res.status(503).json({ error: 'IA congestionada. Tente novamente.' });
  }

  try {
    const modeloIdentificado = dadosResposta.candidates[0].content.parts[0].text.trim();
    if (modeloIdentificado.toLowerCase().includes('desconhecido') || modeloIdentificado.length < 2) {
      return res.status(404).json({ error: 'Não foi possível reconhecer o modelo.' });
    }
    return res.json({ modelo: modeloIdentificado });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao interpretar resposta da IA.' });
  }
});

const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Rota não encontrada.' });
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Back-end do alphaOS rodando na porta ${PORT}`);
});
