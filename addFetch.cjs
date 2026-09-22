const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

content = content.replace(
  `setIsModalOpen(false);
        setFormData({ marketplace: 'Mercado Livre', sku: '', link: '', description: '', priority: 'normal', assignee_name: 'livre' });
      }
    };`,
  `setIsModalOpen(false);
        setFormData({ marketplace: 'Mercado Livre', sku: '', link: '', description: '', priority: 'normal', assignee_name: 'livre' });
        fetchTicketsAndAudits();
      }
    };`
);

content = content.replace(
  `        context_text: \`SKU: \${sku || 'N/A'}\`, message: 'resolveu um ticket', priority: 'normal'
      });
    };`,
  `        context_text: \`SKU: \${sku || 'N/A'}\`, message: 'resolveu um ticket', priority: 'normal'
      });
      fetchTicketsAndAudits();
    };`
);

content = content.replace(
  `        context_text: \`SKU: \${sku || 'N/A'}\`, message: 'excluiu um ticket', priority: 'normal'
      });
    };`,
  `        context_text: \`SKU: \${sku || 'N/A'}\`, message: 'excluiu um ticket', priority: 'normal'
      });
      fetchTicketsAndAudits();
    };`
);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Added manual fetch to handlers.');
