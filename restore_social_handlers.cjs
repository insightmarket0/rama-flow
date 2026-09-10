const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const missingFuncs = `
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
    setIsSocialModalOpen(false);
  };
`;

if (!content.includes('const handleEditSocial =')) {
    content = content.replace('const handleEditBudget = () => {', missingFuncs + '\n  const handleEditBudget = () => {');
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Success! Added social handlers back.");
} else {
    console.log("Handlers already exist.");
}
