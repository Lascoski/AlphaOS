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
<<<<<<< HEAD
// ROTA GET: Buscar todos os Clientes com métricas
// ==========================================
app.get('/api/clientes', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*,
        COALESCE(SUM(os.valor_estimado), 0) as valor_gasto,
        MAX(os.data_entrada) as ultima_compra
      FROM clientes c
      LEFT JOIN ordens_servico os ON c.id = os.cliente_id
      GROUP BY c.id
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
  
  // Se o CPF vier vazio (só espaços ou nada), convertemos para NULL
  // Isso evita que o banco ache que dois CPFs "em branco" são duplicados
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
    // 23505 é o código de erro do PostgreSQL para violação de UNIQUE
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
=======
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
// ROTA POST: Criar uma nova Ordem de Serviço (Começando do 001)
// ==========================================
app.post('/api/ordens', async (req, res) => {
  const { 
<<<<<<< HEAD
    cliente_id, marca, aparelho, cor, senha, defeito, defeito_diagnosticado,
=======
    cliente_nome, telefone, cpf, rua, numero, bairro, cidade, 
    marca, aparelho, cor, senha, defeito, defeito_diagnosticado,
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
    acessorios, avarias, observacoes, valor_estimado 
  } = req.body;

  try {
    await pool.query('BEGIN');

<<<<<<< HEAD
    // 1. Gera o próximo número sequencial da OS a partir de 001[cite: 3]
=======
    // 1. Cria o cliente e pega o ID gerado
    const insertCliente = 'INSERT INTO clientes (nome, telefone, cpf, rua, numero, bairro, cidade) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
    const clienteResult = await pool.query(insertCliente, [cliente_nome, telefone, cpf, rua, numero, bairro, cidade]);
    const clienteId = clienteResult.rows[0].id;

    // 2. Gera o próximo número sequencial da OS a partir de 001
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
    const countResult = await pool.query('SELECT COUNT(*) FROM ordens_servico');
    const proximoNumero = parseInt(countResult.rows[0].count) + 1;
    const numeroFormatado = String(proximoNumero).padStart(3, '0');
    const numeroOs = `OS-${numeroFormatado}`;

<<<<<<< HEAD
    // 2. Cria a Ordem de Serviço vinculada ao cliente existente (cliente_id)
=======
    // 3. Cria a Ordem de Serviço vinculada ao cliente
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
    const insertOs = `
      INSERT INTO ordens_servico (
        numero_os, cliente_id, marca, aparelho, cor, senha, 
        defeito, defeito_diagnosticado, acessorios, avarias, observacoes, valor_estimado, status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Avaliação Inicial') 
      RETURNING *
    `;
<<<<<<< HEAD
    const valoresOs = [
      numeroOs, cliente_id, marca, aparelho, cor, senha, 
      defeito, defeito_diagnosticado || '', acessorios, avarias, observacoes, valor_estimado
    ];
=======
    const valoresOs = [numeroOs, clienteId, marca, aparelho, cor, senha, defeito, defeito_diagnosticado || '', acessorios, avarias, observacoes, valor_estimado];
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
    
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
// ROTA POST: Enviar Orçamento via WhatsApp Oficial (Meta API) - Rota Manual
// ==========================================
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

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada.' });
    }

    const { numero_os, valor_estimado, telefone } = result.rows[0];

    if (!telefone) {
      return res.status(400).json({ error: 'O cliente desta OS não possui telefone cadastrado.' });
    }

<<<<<<< HEAD
    // Limpa o telefone e garante o +55 permanente de forma inteligente[cite: 3]
=======
    // Limpa o telefone e garante o +55 permanente de forma inteligente
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
    let telefoneLimpo = telefone.replace(/\D/g, '');
    if (!telefoneLimpo.startsWith('55')) {
      telefoneLimpo = '55' + telefoneLimpo;
    }

<<<<<<< HEAD
    // --- TEMPLATE ATUAL DE TESTE (HELLO_WORLD) ---[cite: 3]
=======
    // --- TEMPLATE ATUAL DE TESTE (HELLO_WORLD) ---
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
    const data = {
      messaging_product: 'whatsapp',
      to: telefoneLimpo, 
      type: 'template',
      template: {
        name: 'hello_world', 
        language: { code: 'en_US' }
      }
    };

<<<<<<< HEAD
    /* --- PRONTO PARA QUANDO O SEU TEMPLATE DE ORÇAMENTO FOR APROVADO ---[cite: 3]
=======
    /* --- PRONTO PARA QUANDO O SEU TEMPLATE DE ORÇAMENTO FOR APROVADO ---
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
    const data = {
      messaging_product: 'whatsapp',
      to: telefoneLimpo, 
      type: 'template',
      template: {
        name: 'orcamento_aprovacao_os', 
        language: { code: 'pt_BR' },
        components: [
          {
            type: 'body',
            parameters: [
<<<<<<< HEAD
              { type: 'text', text: numero_os },                                  // {{1}}[cite: 3]
              { type: 'text', text: '90 dias' },                                  // {{2}}[cite: 3]
              { type: 'text', text: `R$ ${Number(valor_estimado || 0).toFixed(2)}` } // {{3}}[cite: 3]
=======
              { type: 'text', text: numero_os },                                  // {{1}}
              { type: 'text', text: '90 dias' },                                  // {{2}}
              { type: 'text', text: `R$ ${Number(valor_estimado || 0).toFixed(2)}` } // {{3}}
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
            ]
          }
        ]
      }
    };
    ---------------------------------------------------------------- */

    const metaResponse = await fetch(`https://graph.facebook.com/v18.0/${process.env.META_PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const metaData = await metaResponse.json();

    if (metaResponse.ok) {
      console.log(`✅ Mensagem enviada com sucesso para ${telefoneLimpo}!`);
      await pool.query(`UPDATE ordens_servico SET status = 'Aprovação do Cliente' WHERE id = $1`, [id]);
      return res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
    } else {
      console.error('❌ Erro retornado pela API da Meta:', JSON.stringify(metaData, null, 2));
      return res.status(500).json({ error: 'Falha ao enviar WhatsApp pela Meta.', details: metaData });
    }

  } catch (err) {
    console.error('❌ Erro interno ao processar envio de WhatsApp:', err.message);
    return res.status(500).json({ error: 'Erro interno no servidor: ' + err.message });
  }
});

// ==========================================
// ROTA POST: Enviar Aviso de Aparelho Pronto via WhatsApp (Modo Texto Antigo)
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
// ROTA PATCH: Atualizar Status (Disparo Automático Seguro)
// ==========================================
app.patch('/api/ordens/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
<<<<<<< HEAD
    // 1. Atualiza o status no banco de dados com segurança[cite: 3]
    await pool.query('UPDATE ordens_servico SET status = $1 WHERE id = $2', [status, id]);

    // Busca os dados da OS e do cliente (sem colunas inexistentes)[cite: 3]
=======
    // 1. Atualiza o status no banco de dados com segurança
    await pool.query('UPDATE ordens_servico SET status = $1 WHERE id = $2', [status, id]);

    // Busca os dados da OS e do cliente (sem colunas inexistentes)
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
    const query = `
      SELECT os.numero_os, os.aparelho, os.defeito_diagnosticado, os.valor_estimado, c.telefone, c.nome 
      FROM ordens_servico os
      JOIN clientes c ON os.cliente_id = c.id
      WHERE os.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rowCount > 0) {
      const { numero_os, aparelho, defeito_diagnosticado, valor_estimado, telefone, nome } = result.rows[0];
      
      if (telefone) {
        let telefoneLimpo = telefone.replace(/\D/g, '');
        if (!telefoneLimpo.startsWith('55')) {
          telefoneLimpo = '55' + telefoneLimpo;
        }

        let dataTemplate = null;

<<<<<<< HEAD
        // 2. Se mudou para "Aprovação do Cliente", dispara o template de orçamento[cite: 3]
        if (status === 'Aprovação do Cliente') {
          // --- TEMPLATE ATUAL DE TESTE (HELLO_WORLD) ---[cite: 3]
=======
        // 2. Se mudou para "Aprovação do Cliente", dispara o template de orçamento
        if (status === 'Aprovação do Cliente') {
          // --- TEMPLATE ATUAL DE TESTE (HELLO_WORLD) ---
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
          dataTemplate = {
            messaging_product: 'whatsapp',
            to: telefoneLimpo, 
            type: 'template',
            template: {
              name: 'hello_world', 
              language: { code: 'en_US' }
            }
          };

<<<<<<< HEAD
          /* --- PRONTO PARA O SEU TEMPLATE DE ORÇAMENTO FUTURO ---[cite: 3]
=======
          /* --- PRONTO PARA O SEU TEMPLATE DE ORÇAMENTO FUTURO ---
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
          dataTemplate = {
            messaging_product: 'whatsapp',
            to: telefoneLimpo, 
            type: 'template',
            template: {
              name: 'orcamento_aprovacao_os', 
              language: { code: 'pt_BR' },
              components: [
                {
                  type: 'body',
                  parameters: [
                    { type: 'text', text: numero_os },
                    { type: 'text', text: '90 dias' },
                    { type: 'text', text: `R$ ${Number(valor_estimado || 0).toFixed(2)}` }
                  ]
                }
              ]
            }
          };
          ----------------------------------------------------- */
        }

<<<<<<< HEAD
        // 3. Se mudou para "Pronto (Avisar Cliente)", dispara o template de retirada[cite: 3]
        else if (status === 'Pronto (Avisar Cliente)') {
          // --- TEMPLATE ATUAL DE TESTE (HELLO_WORLD) ---[cite: 3]
=======
        // 3. Se mudou para "Pronto (Avisar Cliente)", dispara o template de retirada
        else if (status === 'Pronto (Avisar Cliente)') {
          // --- TEMPLATE ATUAL DE TESTE (HELLO_WORLD) ---
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
          dataTemplate = {
            messaging_product: 'whatsapp',
            to: telefoneLimpo, 
            type: 'template',
            template: {
              name: 'hello_world', 
              language: { code: 'en_US' }
            }
          };

<<<<<<< HEAD
          /* --- PRONTO PARA O SEU TEMPLATE DE RETIRADA FUTURO ---[cite: 3]
=======
          /* --- PRONTO PARA O SEU TEMPLATE DE RETIRADA FUTURO ---
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
          dataTemplate = {
            messaging_product: 'whatsapp',
            to: telefoneLimpo, 
            type: 'template',
            template: {
              name: 'aparelho_pronto_retirada', 
              language: { code: 'pt_BR' },
              components: [
                {
                  type: 'body',
                  parameters: [
<<<<<<< HEAD
                    { type: 'text', text: nome },                                         // {{1}}[cite: 3]
                    { type: 'text', text: aparelho },                                     // {{2}}[cite: 3]
                    { type: 'text', text: defeito_diagnosticado || 'Reparo concluído' },  // {{3}}[cite: 3]
                    { type: 'text', text: Number(valor_estimado || 0).toFixed(2)}           // {{4}}[cite: 3]
=======
                    { type: 'text', text: nome },                                         // {{1}}
                    { type: 'text', text: aparelho },                                     // {{2}}
                    { type: 'text', text: defeito_diagnosticado || 'Reparo concluído' },  // {{3}}
                    { type: 'text', text: Number(valor_estimado || 0).toFixed(2)}           // {{4}}
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
                  ]
                }
              ]
            }
          };
          ----------------------------------------------------- */
        }

<<<<<<< HEAD
        // Se houver um template mapeado para o status, executa o envio automático em background[cite: 3]
=======
        // Se houver um template mapeado para o status, executa o envio automático em background
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
        if (dataTemplate) {
          fetch(`https://graph.facebook.com/v18.0/${process.env.META_PHONE_ID}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataTemplate)
          })
          .then(async resMeta => {
            if (resMeta.ok) {
              console.log(`✅ WhatsApp automático disparado com sucesso para ${telefoneLimpo} (Status: ${status})!`);
            } else {
              const errData = await resMeta.json();
              console.error('❌ Erro da Meta no disparo automático de status:', errData);
            }
          })
          .catch(errFetch => console.error('❌ Erro na requisição fetch para a Meta:', errFetch.message));
        }
      }
    }

    res.json({ message: 'Status atualizado com sucesso!' });
  } catch (err) {
    console.error('❌ ERRO NO PATCH DE STATUS:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar o status: ' + err.message });
  }
});

// ==========================================
<<<<<<< HEAD
// ROTA PUT: Editar Dados da OS e Checklist de Qualidade
=======
// ROTA PUT: Editar Dados da OS, Cliente e Checklist de Qualidade
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
// ==========================================
app.put('/api/ordens/:id', async (req, res) => {
  const { id } = req.params;
  const { 
<<<<<<< HEAD
=======
    cliente_id, cliente_nome, telefone, cpf, rua, numero, bairro, cidade, 
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
    marca, aparelho, cor, senha, defeito, defeito_diagnosticado, 
    acessorios, avarias, observacoes, valor_estimado, testes_qualidade 
  } = req.body;

  try {
<<<<<<< HEAD
=======
    await pool.query('BEGIN');

    const updateCliente = `
      UPDATE clientes 
      SET nome = $1, telefone = $2, cpf = $3, rua = $4, numero = $5, bairro = $6, cidade = $7 
      WHERE id = $8
    `;
    await pool.query(updateCliente, [cliente_nome, telefone, cpf, rua, numero, bairro, cidade, cliente_id]);

>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
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

<<<<<<< HEAD
    res.json({ message: 'Ordem atualizada com sucesso!' });
  } catch (err) {
=======
    await pool.query('COMMIT');
    res.json({ message: 'Ordem atualizada com sucesso!' });
  } catch (err) {
    await pool.query('ROLLBACK');
>>>>>>> 0042aed5dacb8571902e270d7f02b1107c13c804
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao editar a Ordem de Serviço' });
  }
});

// ==========================================
// ROTA GET: Verificação de Segurança do Webhook (Exigência da Meta)
// ==========================================
app.get('/api/webhook/whatsapp', (req, res) => {
  const TOKEN_VERIFICACAO = "alphaos26";

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === TOKEN_VERIFICACAO) {
      console.log('✅ Webhook verificado pela Meta com sucesso!');
      res.status(200).send(challenge); 
    } else {
      res.sendStatus(403); 
    }
  } else {
    res.sendStatus(400);
  }
});

// ==========================================
// ROTA POST: Receber as Respostas dos Clientes via Webhook
// ==========================================
app.post('/api/webhook/whatsapp', async (req, res) => {
  const body = req.body;
  res.sendStatus(200); // Retorna OK rápido para a Meta

  if (body.object === 'whatsapp_business_account') {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const mensagem = body.entry[0].changes[0].value.messages[0];
      const numeroCliente = mensagem.from; 

      if (mensagem.type === 'interactive') {
        const idBotaoClicado = mensagem.interactive.button_reply.id;
        console.log(`📲 Interação recebida do número ${numeroCliente}: Botão [${idBotaoClicado}]`);

        let novoStatus = '';
        if (idBotaoClicado === 'btn_aprovar') novoStatus = 'Compra das Peças';
        else if (idBotaoClicado === 'btn_recusar') novoStatus = 'Pronto (Avisar Cliente)';
        else if (idBotaoClicado === 'btn_duvida') novoStatus = 'Avaliação Inicial'; 

        if (novoStatus) {
          try {
            const telefoneFinal = numeroCliente.slice(-8); 
            const updateQuery = `
              UPDATE ordens_servico
              SET status = $1
              WHERE id = (
                SELECT os.id FROM ordens_servico os JOIN clientes c ON os.cliente_id = c.id
                WHERE c.telefone LIKE $2 AND os.status = 'Aprovação do Cliente'
                ORDER BY os.data_entrada DESC LIMIT 1
              ) RETURNING numero_os;
            `;
            const result = await pool.query(updateQuery, [novoStatus, `%${telefoneFinal}%`]);
            if (result.rowCount > 0) {
              console.log(`🚀 SUCESSO! A OS ${result.rows[0].numero_os} avançou para: ${novoStatus}`);
            }
          } catch (err) {
            console.error('Erro ao atualizar a OS:', err.message);
          }
        }
      }
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Back-end do alphaOS rodando na porta ${PORT}`);
});