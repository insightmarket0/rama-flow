const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');
content = content.replace(
  'import { AlertCircle, Plus, Search, Store, Trash2, ExternalLink, CheckCircle2, Clock, Activity, LayoutGrid } from "lucide-react";',
  'import { AlertCircle, Plus, Search, Store, Trash2, ExternalLink, CheckCircle2, Check, Clock, Activity, LayoutGrid } from "lucide-react";'
);
fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Added Check to imports.');
