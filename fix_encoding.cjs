const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// The file might be double UTF-8 encoded. 
// If it is, we can reverse it by converting to binary (latin1) and then reading as utf8
try {
  let buf = Buffer.from(content, 'latin1');
  let decoded = buf.toString('utf8');
  // Let's check if it fixed "Gest"
  if (decoded.includes("Gestão") || decoded.includes("Orçamento") || decoded.includes("Tráfego")) {
     console.log("Buffer conversion worked!");
     fs.writeFileSync('src/pages/Marketing.tsx', decoded, 'utf8');
  } else {
     console.log("Buffer conversion didn't produce expected words. Will use manual replace.");
  }
} catch(e) {
  console.log("Error in buffer:", e);
}
