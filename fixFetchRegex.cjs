const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

// Use regex to find the end of handleCreateTicket block
content = content.replace(
  /setIsModalOpen\(false\);\s+setFormData\({[^}]+}\);\s+}\s+};/m,
  (match) => {
    return match.replace('}\n    };', '  await fetchTicketsAndAudits();\n      }\n    };');
  }
);

content = content.replace(
  /message: 'resolveu um ticket', priority: 'normal'\s+}\);\s+};/m,
  (match) => {
    return match.replace('});\n    };', '});\n      await fetchTicketsAndAudits();\n    };');
  }
);

content = content.replace(
  /message: 'excluiu um ticket', priority: 'normal'\s+}\);\s+};/m,
  (match) => {
    return match.replace('});\n    };', '});\n      await fetchTicketsAndAudits();\n    };');
  }
);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Fixed fetch with regex.');
