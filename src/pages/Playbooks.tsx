import React, { useState } from "react";
import { 
  Package, 
  MessageSquare, 
  Store, 
  Wrench, 
  ChevronRight, 
  BookOpen,
  Search,
  FileText,
  Clock,
  Printer,
  Share2,
  X,
  Folder
} from "lucide-react";

const CATEGORIES = [
  { id: "logistica", name: "Logística & Embalagem", icon: Package, color: "text-[#CCFF00]", bg: "bg-[#CCFF00]/10" },
  { id: "atendimento", name: "Atendimento ao Cliente", icon: MessageSquare, color: "text-[#CCFF00]", bg: "bg-[#CCFF00]/10" },
  { id: "marketplaces", name: "Marketplaces (Cadastros)", icon: Store, color: "text-black", bg: "bg-black/10" },
  { id: "resolucao", name: "Resolução de Problemas", icon: Wrench, color: "text-[#CCFF00]", bg: "bg-[#CCFF00]/10" },
];

const ARTICLES = [
  {
    id: "art_1",
    categoryId: "marketplaces",
    title: "Padrão de Títulos e Fotos",
    author: "Anderson",
    lastUpdated: "Há 2 dias",
    featured: false,
    content: `
## Diretrizes para Títulos
Os títulos dos nossos produtos precisam seguir uma estrutura exata para otimizar as buscas e evitar punições dos algoritmos.

### Estrutura Obrigatória:
**[Produto] + [Marca] + [Característica Principal] + [Quantidade/Voltagem]**

*Correto:* Kit de Gás Aliança Completo com Mangueira 1,20m
*Incorreto:* Lindo kit de gás barato promoção

### Imagens do Produto:
1. **1ª Foto (Capa):** Padrão da plataforma, fundo branco, máxima qualidade do produto possível.
2. **2ª Foto (Explicativo 1):** Imagem chamativa. Preferência para mostrar o produto em alta qualidade, mas, em uso, ou de alguma forma que mostre a sua aplicação de uma forma nítida e bonita.
3. **3ª Foto (Explicativo 2):** Imagem do produto com especificações técnicas, ou, com algum descritivo sobre a aplicação, ou, que faça um resumo de descrição.
4. **4ª Foto em diante:** Podemos já imaginar mais em mostrar outros ângulos, ou, outras informações.

*Regra de Ouro:* Obrigatório o mínimo de 3 imagens (Capa / Explicativo / Explicativo 2) com essas informações no cadastro de anúncio.

Se tiver dúvidas com a imagem, suba no sistema de *Mural de Ajustes* e peça avaliação da coordenação antes de publicar o anúncio.
    `
  },
  {
    id: "art_prompts",
    categoryId: "marketplaces",
    title: "Prompts Oficiais de IA (Anúncios & Imagens)",
    author: "Estratégia",
    lastUpdated: "Hoje",
    featured: true,
    content: `
## Central de Prompts Oficiais
Utilize estes prompts copiando e colando na nossa IA para manter a padronização e a alta conversão dos anúncios em Marketplaces.

### 1. PROMPT FOTO DE CAPA
> Melhore essa imagem do meu produto para deixá-la o mais vendível possível, nas dimensões de 1200x1200 pixels, com fundo branco puro (RGB #FFFFFF), seguindo as exigências do Mercado Livre. A imagem deve parecer realista, profissional, limpa e atrativa visualmente. Mantenha foco no produto, centralizado, sem distorções, com o máximo de resolução e parecendo o mais real possível.

### 2. PROMPT SEGUNDA IMAGEM (Produto em Uso/Contexto)
> a imagem em anexo mostra a capa de um produto anunciado em ecommerce. criar nova imagem de 1200x1200 px do produto em anexo, criar o produto grande centralizado, com o máximo de resolução possível com fundo branco puro (RGB #FFFFFF), seguindo as exigências do Mercado Livre. alterar a posição do produto em relação a imagem em anexo

### 3. PROMPT DESCRIÇÃO
> Estou criando anúncios do Mercado Livre. Fornecer mais duas opções de DESCRIÇÃO DE PRODUTO limitado a 1200 caracteres, sem ícones, baseado no texto da descrição abaixo. O texto deve conter as palavras-chave mais corretas para esse tipo de produto, sempre visando vender o máximo possível por ter um título com as palavras certas para gerar mais clique e acessos a paginas. O texto atual é o que segue:

### 4. PROMPT TÍTULO
> Criar mais duas opções de título com no máximo 60 caracteres para anúncio nas plataformas de ecommerce para o seguinte produto:
    `
  },
  {
    id: "art_2",
    categoryId: "resolucao",
    title: "Como contestar devolução injusta (Mercado Livre)",
    author: "Estratégia",
    lastUpdated: "Há 1 semana",
    featured: false,
    content: `
## Passo a Passo para Contestar Devoluções no ML

Quando o cliente devolver um produto avariado ou com peça faltando, siga este script *no mesmo dia*:

1. Tire 3 fotos nítidas assim que abrir a caixa:
   - A etiqueta de devolução dos Correios/Transportadora.
   - A caixa recebida (mostrando as fitas rompidas).
   - O produto avariado em detalhes.

2. Abra a mediação no Mercado Livre informando que o produto retornou fora do padrão.

3. **Texto Padrão para a Mediação:**
   "Olá equipe do Mercado Livre. O pacote referente à venda #XXXX retornou para nós no dia de hoje, porém o produto foi devolvido [sem a peça X / quebrado na lateral]. Anexamos as imagens que comprovam o estado que a caixa chegou. Solicitamos o reembolso da venda conforme a política de Proteção ao Vendedor."

**Atenção:** Você tem no máximo 3 dias corridos para abrir essa reclamação. Passou disso, a empresa perde o dinheiro. Fique atento ao Mural de Ajustes!
    `
  }
];
// -------------------

export default function Playbooks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeArticle, setActiveArticle] = useState<typeof ARTICLES[0] | null>(null);

  const filteredArticles = ARTICLES.filter(art => {
    return art.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex-1 min-h-[100dvh] bg-[#050505] text-white pt-0 pl-0 -ml-4 -mt-2 pr-4 md:pr-8 animate-in fade-in duration-500 font-sans selection:bg-[#CCFF00] selection:text-black pb-24">
      
      {/* HEADER / HERO - BRUTALIST */}
      <div className="w-full mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="flex flex-col">
          <span className="text-[#CCFF00] font-black uppercase tracking-widest text-sm relative z-10">Base de Conhecimento</span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.92] -mt-[2px] md:-mt-[4px] -ml-1 md:-ml-[6px]">
            SISTEMA DE<br />
            <span className="text-[#CCFF00]">PLAYBOOKS</span>
          </h1>
        </div>

        <div className="w-full max-w-lg shrink-0 lg:mb-2 border-l-4 border-[#CCFF00] pl-6">
          <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
            Processos, scripts e manuais oficiais. Consulte nossa base para garantir a execução com excelência em todas as pontas da operação.
          </p>
        </div>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="w-full">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Todos os Manuais</h2>
        
        {filteredArticles.length === 0 ? (
          <div className="py-20 border-2 border-dashed border-white/10 flex items-center justify-center">
            <p className="text-xl font-bold text-gray-500 uppercase tracking-widest">Nenhum resultado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art, idx) => {
              const cat = CATEGORIES.find(c => c.id === art.categoryId);
              
              // Estilização condicional baseada na flag "featured"
              if (art.featured) {
                return (
                  <button 
                    key={art.id}
                    onClick={() => setActiveArticle(art)}
                    className="col-span-1 md:col-span-2 lg:col-span-2 group relative overflow-hidden bg-[#CCFF00] p-8 md:p-10 text-left transition-transform hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(204,255,0,0.2)]"
                  >
                    {/* Número de Fundo Gigante */}
                    <div className="absolute -right-8 -bottom-16 text-[15rem] font-black text-black opacity-10 pointer-events-none select-none tracking-tighter leading-none">
                      {idx + 1}
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="mb-12">
                        <span className="inline-block px-3 py-1 bg-black text-[#CCFF00] text-xs font-black uppercase tracking-widest mb-6">
                          {cat?.name}
                        </span>
                        <h3 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter leading-tight mb-4 group-hover:underline decoration-4 underline-offset-4">
                          {art.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto border-t-4 border-black pt-6">
                        <div className="flex items-center gap-4 text-black font-bold text-sm uppercase">
                          <span>Atualizado {art.lastUpdated}</span>
                          <span>•</span>
                          <span>{art.author}</span>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center text-[#CCFF00] group-hover:scale-110 transition-transform">
                          <ChevronRight className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </button>
                )
              }

              // Estilo Padrão Escuro
              return (
                <button 
                  key={art.id}
                  onClick={() => setActiveArticle(art)}
                  className="col-span-1 group relative overflow-hidden bg-[#111111] p-8 md:p-10 text-left transition-transform hover:-translate-y-2 hover:shadow-2xl border-t-4 border-[#CCFF00]"
                >
                  <div className="absolute -right-4 -bottom-10 text-[10rem] font-black text-white/5 pointer-events-none select-none tracking-tighter leading-none">
                    {idx + 1}
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="mb-12">
                      <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-black uppercase tracking-widest mb-6">
                        {cat?.name}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-4 group-hover:text-[#CCFF00] transition-colors">
                        {art.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-6">
                      <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase flex-wrap">
                        <span>{art.lastUpdated}</span>
                        <span>•</span>
                        <span>{art.author}</span>
                      </div>
                      <ChevronRight className="h-6 w-6 text-[#CCFF00] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL DE LEITURA (Painel Lateral / Drawer) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveArticle(null)}
          />
          
          {/* Drawer Minimalista */}
          <div className="relative w-full max-w-3xl bg-[#0A0A0A] border-l-4 border-[#CCFF00] h-full flex flex-col animate-in slide-in-from-right duration-500 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/10">
              <div className="flex-1 pr-8">
                <span className="text-[#CCFF00] text-xs font-black uppercase tracking-widest mb-2 block">Playbook</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">
                  {activeArticle.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => setActiveArticle(null)}
                  className="h-12 w-12 flex items-center justify-center bg-white/5 hover:bg-[#CCFF00] hover:text-black text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Conteudo (Brutalist Markdown Mock) */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-none font-sans">
                {activeArticle.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-3xl font-black text-[#CCFF00] uppercase tracking-tighter mt-12 mb-6">{paragraph.replace('## ', '')}</h2>
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold mt-10 mb-4 text-white uppercase tracking-tight">{paragraph.replace('### ', '')}</h3>
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <div key={index} className="bg-[#111111] border-l-4 border-[#CCFF00] p-6 my-6">
                        <p className="text-lg text-gray-300 font-mono leading-relaxed">
                          {paragraph.replace('> ', '')}
                        </p>
                      </div>
                    )
                  }
                  if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ') || paragraph.startsWith('- ')) {
                    return <div key={index} className="flex gap-4 mb-4">
                      <span className="text-[#CCFF00] font-black">{paragraph.substring(0, 2)}</span>
                      <p className="text-gray-300 text-lg leading-relaxed">{paragraph.substring(3)}</p>
                    </div>
                  }
                  if (paragraph.trim() === '') return <div key={index} className="h-2" />
                  
                  const parts = paragraph.split('**');
                  return (
                    <p key={index} className="mb-6 text-lg leading-relaxed text-gray-400">
                      {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part)}
                    </p>
                  );
                })}
              </div>

              <div className="mt-16 p-8 bg-[#111111] border-2 border-[#CCFF00] flex flex-col sm:flex-row items-center gap-6">
                <div className="h-16 w-16 bg-[#CCFF00] rounded-none flex items-center justify-center text-black shrink-0">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-white font-black text-xl mb-2 uppercase tracking-tight">Siga o processo</h4>
                  <p className="text-gray-400">A operação atualiza estes guias regularmente. Execute sempre o procedimento mais recente descrito acima.</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
