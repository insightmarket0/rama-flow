const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

// 1. Add fetchTicketsAndAudits to handlers safely.

content = content.replace(
  `        setIsModalOpen(false);
        setFormData({ marketplace: 'Mercado Livre', sku: '', link: '', description: '', priority: 'normal', assignee_name: 'livre' });
      }
    };`,
  `        setIsModalOpen(false);
        setFormData({ marketplace: 'Mercado Livre', sku: '', link: '', description: '', priority: 'normal', assignee_name: 'livre' });
        await fetchTicketsAndAudits();
      }
    };`
);

content = content.replace(
  `        context_text: \`SKU: \${sku || 'N/A'}\`, message: 'resolveu um ticket', priority: 'normal'
      });
    };`,
  `        context_text: \`SKU: \${sku || 'N/A'}\`, message: 'resolveu um ticket', priority: 'normal'
      });
      await fetchTicketsAndAudits();
    };`
);

content = content.replace(
  `        context_text: \`SKU: \${sku || 'N/A'}\`, message: 'excluiu um ticket', priority: 'normal'
      });
    };`,
  `        context_text: \`SKU: \${sku || 'N/A'}\`, message: 'excluiu um ticket', priority: 'normal'
      });
      await fetchTicketsAndAudits();
    };`
);

// 2. Add Clear History function

const clearHistoryFn = `
  const handleClearHistory = async () => {
    if (!window.confirm('Tem certeza que deseja limpar todo o histórico de auditoria? Esta ação não pode ser desfeita.')) return;
    const { error } = await supabase.from('ajustes_auditoria').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
    if (!error) {
      await fetchTicketsAndAudits();
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {`;

content = content.replace(`  const handleCreateTicket = async (e: React.FormEvent) => {`, clearHistoryFn);


// 3. Add Clear History button to Audit Sidebar Header

const auditHeaderOld = `<div className="p-5 border-b border-white/5 flex items-center gap-3">
            <Activity className="h-5 w-5 text-[#00FF00]" />
            <h3 className="text-white font-bold text-xs tracking-widest uppercase">Feed de Auditoria</h3>
          </div>`;

const auditHeaderNew = `<div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-[#00FF00]" />
              <h3 className="text-white font-bold text-xs tracking-widest uppercase">Feed de Auditoria</h3>
            </div>
            <button onClick={handleClearHistory} className="text-gray-500 hover:text-red-400 transition-colors" title="Limpar Histórico">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>`;

content = content.replace(auditHeaderOld, auditHeaderNew);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Fixed fetch and added clear history.');
