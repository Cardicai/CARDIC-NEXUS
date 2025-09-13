/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const fs = require('fs'),
  path = require('path');
const page = path.join('src', 'app', 'CardicNexusLanding.jsx');
const usdtP = path.join('public', 'crypto', 'usdt.png');
const btcP = path.join('public', 'crypto', 'btc.png');

function dataURL(p) {
  const b64 = fs.readFileSync(p).toString('base64');
  return `data:image/png;base64,${b64}`;
}

let code = fs.readFileSync(page, 'utf8');
if (fs.existsSync(usdtP))
  code = code.replace(
    /src=["']\/crypto\/usdt\.png["']/g,
    `src="${dataURL(usdtP)}"`
  );
if (fs.existsSync(btcP))
  code = code.replace(
    /src=["']\/crypto\/btc\.png["']/g,
    `src="${dataURL(btcP)}"`
  );
fs.writeFileSync(page, code);
console.log('Inlined QR images into CardicNexusLanding.jsx');
