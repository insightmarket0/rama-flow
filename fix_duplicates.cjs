const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const badBlock = `  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState("instagram");
  const [socialForm, setSocialForm] = useState({ followers: 0, likes: 0, comments: 0 });

  const handleEditSocial = (platform) => {
    setEditingSocial(platform);
    setSocialForm({
      followers: socialMetrics[platform].followers,
      likes: socialMetrics[platform].likes,
      comments: socialMetrics[platform].comments
    });
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = () => {
    const oldFollowers = socialMetrics[editingSocial].followers;
    let growth = 0;
    if (oldFollowers > 0 && socialForm.followers !== oldFollowers) {
      growth = (((socialForm.followers - oldFollowers) / oldFollowers) * 100);
    } else {
      growth = socialMetrics[editingSocial].followersGrowth; 
    }
    const newHistory = [...socialMetrics[editingSocial].history, { name: "Novo", value: socialForm.followers }];
    if (newHistory.length > 10) newHistory.shift();

    const updated = {
      ...socialMetrics,
      [editingSocial]: {
        ...socialForm,
        followersGrowth: parseFloat(Number(growth).toFixed(1)),
        history: newHistory
      }
    };
    setSocialMetrics(updated);
    localStorage.setItem("rama_social_metrics", JSON.stringify(updated));
    setIsSocialModalOpen(true);
    // wait, modal false
    setIsSocialModalOpen(false);
  };`;

content = content.replace(badBlock, '');
fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Removed duplicate social handlers.");
