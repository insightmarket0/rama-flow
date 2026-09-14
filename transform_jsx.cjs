const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

// 1. Update the CRM tab header & table columns
const oldTableHead = \<div className="flex items-center justify-between">
                <h2 className="text-white font-semibold text-lg">CRM Influenciadores</h2>
                <button onClick={handleAddCrm} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">Novo Parceiro +</button>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden flex flex-col shrink-0">
              <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-[#141414] sticky top-0 z-10">
                    <tr className="border-b border-[#222]">
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Parceiro</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Nicho</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Status</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Base Fixa</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Upside (Comissǜo)</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Cupom / UTM</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400 text-right">ROI</th>
                    </tr>
                  </thead>\;

const newTableHead = \<div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-white font-semibold text-lg">CRM & Scorecard de Influenciadores</h2>
                    <p className="text-[10px] text-gray-500 mt-0.5">Análise de retorno financeiro por parceria ativa.</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-transparent border border-white/10 hover:border-white/20 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" /> Exportar
                    </button>
                    <button onClick={handleAddCrm} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">Novo Parceiro +</button>
                  </div>
                </div>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden flex flex-col shrink-0 mt-2">
              <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-[#141414] sticky top-0 z-10">
                    <tr className="border-b border-[#222]">
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Creator</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Nicho</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Status</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Custo (Cachê)</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Custo (Seeding)</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Upside / Receita</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Cupom / UTM</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400 text-right">eCPA Final</th>
                    </tr>
                  </thead>\;

content = content.replace(oldTableHead, newTableHead);

// 2. Update the row rendering
const oldRowEnd = \                        <td className="px-4 py-2 text-xs text-gray-300">{partner.base}</td>
                        <td className="px-4 py-2 text-xs text-emerald-400/80 font-medium">{partner.upside}</td>
                        <td className="px-4 py-2">
                          <span className="text-[10px] font-mono text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{partner.tracking}</span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className={\	ext-xs font-semibold \\}>{partner.roi}</div>
                          <div className="text-[9px] text-gray-500 mt-0.5">CPA: {partner.cpa}</div>
                        </td>\;

const newRowEnd = \                        <td className="px-4 py-2 text-xs text-gray-300">{partner.base}</td>
                        <td className="px-4 py-2 text-xs text-gray-400">{partner.seedingCost}</td>
                        <td className="px-4 py-2">
                          <div className="text-[10px] text-gray-500">Upside: <span className="text-emerald-400/80 font-medium">{partner.upside}</span></div>
                          <div className="text-xs font-bold text-white mt-0.5">{partner.roi}</div>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-[10px] font-mono text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{partner.tracking}</span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold">{partner.cpa !== '-' ? partner.cpa : 'N/A'}</span>
                        </td>\;

content = content.replace(oldRowEnd, newRowEnd);

// 3. Delete the Scorecard table entirely
const scorecardRegex = /\{\/\* 3\. Tabela de ROI de Influenciadores \*\/\}\s*<div className="bg-\[#0a0a0a\] border border-white\/5 rounded-2xl overflow-hidden flex flex-col">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/;

const newEnding = \</div>
            </div>
          )}\;

content = content.replace(scorecardRegex, newEnding);


// 4. Update Modal logic to include "Custo (Seeding)" 
const oldModalGrid = \              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Status</label>\;

const newModalGrid = \              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Custo (Seeding)</label>
                <input type="text" value={crmForm.seedingCost} onChange={e => setCrmForm({...crmForm, seedingCost: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" placeholder="R$ 150 (1 Kit)" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Status</label>\;

content = content.replace(oldModalGrid, newModalGrid);

// Change Base Fixa label to Custo Cachê in modal
content = content.replace(
  /<label className="text-\[10px\] uppercase font-bold text-gray-500 mb-1 block">Base Fixa<\/label>/,
  '<label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Custo (Cachê)</label>'
);
// Change Upside label to Receita / Upside
content = content.replace(
  /<label className="text-\[10px\] uppercase font-bold text-gray-500 mb-1 block">Upside \(Comissǜo\)<\/label>/,
  '<label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Upside (Comissão)</label>'
);

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('JSX transformed');
