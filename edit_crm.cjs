
const fs = require("fs");
let content = fs.readFileSync("src/pages/Marketing.tsx", "utf-8");

// 1. Add state variables
const stateHookPos = content.indexOf("const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);");
const stateVars = `
  const [crmPartners, setCrmPartners] = useState(CRM_PARTNERS);
  const [isCrmModalOpen, setIsCrmModalOpen] = useState(false);
  const [editingCrmPartner, setEditingCrmPartner] = useState<any>(null);

  const handleEditCrmPartner = (partner: any) => {
    setEditingCrmPartner({ ...partner });
    setIsCrmModalOpen(true);
  };

  const handleSaveCrmPartner = () => {
    setCrmPartners(prev => prev.map(p => p.id === editingCrmPartner.id ? editingCrmPartner : p));
    setIsCrmModalOpen(false);
  };
`;
content = content.substring(0, stateHookPos) + stateVars + "\\n  " + content.substring(stateHookPos);

// 2. Change CRM_PARTNERS map to use crmPartners state
content = content.replace(
    "{CRM_PARTNERS.map(partner => (\\n                      <tr key={partner.id} className=\\"hover:bg-[#161616]\\">",
    "{crmPartners.map(partner => (\\n                      <tr key={partner.id} onClick={() => handleEditCrmPartner(partner)} className=\\"hover:bg-[#161616] cursor-pointer\\">"
);

// 3. Add CRM Modal at the bottom, just before the closing </div> of the page.
const modalCode = `
      {/* MODAL EDITAR CRM PARTNER */}
      {isCrmModalOpen && editingCrmPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-[#222] rounded-xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-[#222] flex justify-between items-center bg-[#111]">
              <h2 className="text-white font-semibold">Editar Parceiro</h2>
              <button onClick={() => setIsCrmModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[70vh] custom-scrollbar grid grid-cols-2 gap-4">
              <div className="col-span-2 flex gap-4 items-center mb-2">
                <Avatar className="w-16 h-16 rounded border border-[#333]">
                  <AvatarImage src={editingCrmPartner.avatar} />
                  <AvatarFallback className="bg-[#222] text-white rounded">?</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">URL da Foto (Avatar)</label>
                  <input type="text" value={editingCrmPartner.avatar} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, avatar: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Nome do Parceiro</label>
                <input type="text" value={editingCrmPartner.name} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, name: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Nicho</label>
                <input type="text" value={editingCrmPartner.niche} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, niche: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Status</label>
                <input type="text" value={editingCrmPartner.status} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, status: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Tier (A, B, C)</label>
                <input type="text" value={editingCrmPartner.tier} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, tier: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Base Fixa (Custo Cachê)</label>
                <input type="text" value={editingCrmPartner.base} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, base: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Upside (Comissão)</label>
                <input type="text" value={editingCrmPartner.upside} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, upside: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Custo (Seeding)</label>
                <input type="text" value={editingCrmPartner.seeding} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, seeding: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Cupom / UTM</label>
                <input type="text" value={editingCrmPartner.tracking} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, tracking: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Receita (Cupom)</label>
                <input type="text" value={editingCrmPartner.roi} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, roi: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">eCPA Final</label>
                <input type="text" value={editingCrmPartner.cpa} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, cpa: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Cor da Receita (Tailwind)</label>
                <input type="text" value={editingCrmPartner.roiColor} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, roiColor: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" placeholder="text-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Expiração (Dias)</label>
                <input type="text" value={editingCrmPartner.rightsExp} onChange={(e) => setEditingCrmPartner({...editingCrmPartner, rightsExp: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded text-white text-sm p-2 focus:border-cyan-500 outline-none" />
              </div>

            </div>
            <div className="p-4 border-t border-[#222] bg-[#0a0a0a] flex justify-end gap-2">
              <button onClick={() => setIsCrmModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleSaveCrmPartner} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm font-semibold transition-colors">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}
`;

const lastDivIdx = content.lastIndexOf("</div>");
content = content.substring(0, lastDivIdx) + modalCode + "\\n    " + content.substring(lastDivIdx);

fs.writeFileSync("src/pages/Marketing.tsx", content, "utf-8");
console.log("Added CRM edit modal.");

