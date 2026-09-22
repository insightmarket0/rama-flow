const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

const oldFilter = `    const filteredTickets = tickets.filter(t => {
      const matchesFilter = filter === "todos" || t.marketplace.toLowerCase() === filter.toLowerCase();
      const matchesSearch = search === "" || t.sku?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });`;

const newFilter = `    const filteredTickets = tickets.filter(t => {
      // Esconder tickets resolvidos há mais de 24 horas (seja pela data de atualização ou criação)
      if (t.status === 'resolvido') {
        const referenceDate = new Date(t.updated_at || t.created_at);
        const diffHours = (new Date().getTime() - referenceDate.getTime()) / (1000 * 60 * 60);
        if (diffHours > 24) return false;
      }
      
      const matchesFilter = filter === "todos" || t.marketplace.toLowerCase() === filter.toLowerCase();
      const matchesSearch = search === "" || t.sku?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });`;

content = content.replace(oldFilter, newFilter);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Added 24h filter.');
