const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const metasRouteStart = content.indexOf('<Route\r\n                path="/metas"');
if (metasRouteStart === -1) {
    const metasRouteStartUnix = content.indexOf('<Route\n                path="/metas"');
    if (metasRouteStartUnix !== -1) {
        const metasRouteEnd = content.indexOf('/>', metasRouteStartUnix) + 2;
        content = content.substring(0, metasRouteStartUnix) + content.substring(metasRouteEnd);
    }
} else {
    const metasRouteEnd = content.indexOf('/>', metasRouteStart) + 2;
    content = content.substring(0, metasRouteStart) + content.substring(metasRouteEnd);
}

fs.writeFileSync('src/App.tsx', content);
console.log('Done!');
