const fs = require('fs');
let content = fs.readFileSync('src/pages/MeuDia.tsx', 'utf8');

try {
  let buf = Buffer.from(content, 'latin1');
  let decoded = buf.toString('utf8');
  if (decoded.includes("Rogério")) {
     console.log("Buffer conversion worked for MeuDia!");
     
     // Remove BOM if exists
     if (decoded.charCodeAt(0) === 0xFEFF || decoded.charCodeAt(0) === 65533) {
       decoded = decoded.substring(1);
     }
     decoded = decoded.replace(/^[^a-zA-Z]+/, '');
     decoded = "import " + decoded.replace(/^import\s+/, "");

     fs.writeFileSync('src/pages/MeuDia.tsx', decoded, 'utf8');
  } else {
     console.log("Buffer conversion didn't produce expected words. Will ignore.");
  }
} catch(e) {
  console.log("Error in buffer:", e);
}
