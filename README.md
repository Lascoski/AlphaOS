# TechFix - Painel Financeiro

Uma aplicação web de dashboard financeiro desenvolvida com React e Vite, implementando fielmente o design do Figma.

## 📋 Recursos

- ✅ React 18 com Vite para máximo desempenho
- ✅ Componentes reutilizáveis e bem organizados
- ✅ Sidebar responsiva com navegação
- ✅ Cards de KPIs (Receita Bruta, Lucro Líquido, Ticket Médio, Ordens Abertas)
- ✅ Gráfico de Evolução de Receita interativo
- ✅ Seção Mais Vendidos com visualização de barras
- ✅ Tabela Técnicos em Destaque
- ✅ Ícones do Lucide React (semelhantes ao Figma)
- ✅ Design responsivo (Desktop, Tablet, Mobile)
- ✅ CSS modular e organizado
- ✅ Fidelidade visual máxima ao design original

## 🛠️ Dependências

- **React**: 18.2.0
- **React DOM**: 18.2.0
- **Vite**: 5.0.8
- **Lucide React**: 0.263.1 (ícones SVG)

## 🚀 Como Executar

### Passo 1: Instalar Dependências
```bash
npm install
```

### Passo 2: Executar em Desenvolvimento
```bash
npm run dev
```

A aplicação abrirá automaticamente em `http://localhost:5173`

### Passo 3: Build para Produção
```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

## 📁 Estrutura do Projeto

```
figmaprojeto/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx / Sidebar.css          # Navegação lateral
│   │   ├── Header.jsx / Header.css            # Cabeçalho do painel
│   │   ├── KPICard.jsx / KPICard.css          # Cartões de métricas
│   │   ├── RevenueChart.jsx / RevenueChart.css # Gráfico de receita
│   │   ├── TopProducts.jsx / TopProducts.css  # Produtos mais vendidos
│   │   └── TechniciansTable.jsx / TechniciansTable.css # Tabela técnicos
│   ├── App.jsx                                # Componente principal
│   ├── App.css                                # Estilos do layout principal
│   ├── main.jsx                               # Ponto de entrada
│   └── index.css                              # Estilos globais
├── index.html                                 # HTML principal
├── vite.config.js                             # Configuração Vite
├── package.json                               # Dependências
└── .gitignore                                 # Gitignore
```

## 🎨 Design e Fidelidade

O design foi implementado com máxima fidelidade ao arquivo Figma original:

- **Cores**: Paleta de cores exata conforme Figma
- **Tipografia**: Espaçamento e tamanhos de fonte precisos
- **Layout**: Grid e Flexbox para replicar o layout original
- **Responsividade**: Pontos de quebra em 1440px, 1024px e 768px
- **Componentes**: Cada seção do Figma foi convertida em componentes React reutilizáveis

## 📱 Responsividade

- **Desktop (1440px+)**: Layout completo com 4 KPIs em linha
- **Tablet (1024px)**: Layout 2x2 para KPIs, gráficos empilhados
- **Mobile (768px)**: Layout em coluna única, com ajustes de tipografia

## 🔧 Customização

Todos os valores, cores e textos podem ser facilmente customizados:

- **Valores dos KPIs**: Editar em `App.jsx`
- **Cores**: Variáveis CSS em `index.css`
- **Espaçamento**: Variáveis de spacing em `index.css`
- **Dados**: Passar como props para os componentes

## 📝 Notas

- Os dados exibidos são estáticos e podem ser substituídos por dados dinâmicos de uma API
- O gráfico de receita é uma visualização SVG sem biblioteca externa
- Todos os ícones utilizam Lucide React para melhor performance
- O projeto está pronto para integração com um backend

## 🎯 Próximos Passos

- Integrar com API para dados dinâmicos
- Adicionar mais interatividade (filtros, exportação)
- Implementar autenticação de usuário
- Adicionar temas (light/dark mode)
- Otimizar performance com React.memo e useMemo
