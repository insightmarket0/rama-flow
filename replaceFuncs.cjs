const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

const regexCreate = /const handleCreateTicket = async \(e: React\.FormEvent\) => \{([\s\S]*?)setIsModalOpen\(false\);\s*setFormData\(\{[^\}]+\}\);\s*\}\s*\};/;

const newCreate = `const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;
    const { data: insertedTicket, error } = await supabase.from('ajustes_tickets').insert({
      creator_id: user?.id, creator_name: userName,
      assignee_name: formData.assignee_name === 'livre' ? null : formData.assignee_name,
      marketplace: formData.marketplace, sku: formData.sku, link: formData.link, description: formData.description,
      status: "pendente", priority: formData.priority,
    }).select().single();
    
    if (!error && insertedTicket) {
      await supabase.from('ajustes_auditoria').insert({
        action_type: 'created', user_id: user?.id, user_name: userName, target_id: insertedTicket.id, target_type: 'ticket',
        context_text: \`SKU: \${insertedTicket.sku || 'N/A'}\`, message: 'abriu um ticket', priority: formData.priority
      });
      setIsModalOpen(false);
      setFormData({ marketplace: 'Mercado Livre', sku: '', link: '', description: '', priority: 'normal', assignee_name: 'livre' });
      await fetchTicketsAndAudits();
    }
  };`;

content = content.replace(regexCreate, newCreate);

const regexResolve = /const handleResolve = async \(id: string, sku: string\) => \{([\s\S]*?)message: 'resolveu um ticket', priority: 'normal'\s*\}\);\s*\};/;
const newResolve = `const handleResolve = async (id: string, sku: string) => {
    await supabase.from('ajustes_tickets').update({ status: 'resolvido', resolved_by_id: user?.id, resolved_by_name: userName }).eq('id', id);
    await supabase.from('ajustes_auditoria').insert({
      action_type: 'resolved', user_id: user?.id, user_name: userName, target_id: id, target_type: 'ticket',
      context_text: \`SKU: \${sku || 'N/A'}\`, message: 'resolveu um ticket', priority: 'normal'
    });
    await fetchTicketsAndAudits();
  };`;

content = content.replace(regexResolve, newResolve);

const regexDelete = /const handleDelete = async \(id: string, sku: string\) => \{([\s\S]*?)message: 'excluiu um ticket', priority: 'normal'\s*\}\);\s*\};/;
const newDelete = `const handleDelete = async (id: string, sku: string) => {
    if (!window.confirm('Excluir ticket permanentemente?')) return;
    await supabase.from('ajustes_tickets').delete().eq('id', id);
    await supabase.from('ajustes_auditoria').insert({
      action_type: 'deleted', user_id: user?.id, user_name: userName, target_id: id, target_type: 'ticket',
      context_text: \`SKU: \${sku || 'N/A'}\`, message: 'excluiu um ticket', priority: 'normal'
    });
    await fetchTicketsAndAudits();
  };`;

content = content.replace(regexDelete, newDelete);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Replaced all functions.');
