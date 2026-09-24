import sharp from "sharp";
const output = "public/images/social-card.png";
const logo = await sharp("public/brand/nipo-logo.svg").resize(250).png().toBuffer();
const overlay = Buffer.from('<svg width="1200" height="630"><defs><linearGradient id="shade"><stop stop-color="#091411" stop-opacity=".92"/><stop offset="1" stop-color="#091411" stop-opacity="0"/></linearGradient></defs><rect width="1200" height="630" fill="url(#shade)"/><text x="80" y="510" font-family="Arial, sans-serif" font-size="14" letter-spacing="3" fill="#f7f1de">NEWCASTLE QUAYSIDE</text></svg>');
await sharp("src/assets/photos/shoot-2026-09/DSC07608-Edit.jpg").resize(1200,630,{fit:"cover"}).composite([{input:overlay},{input:logo,left:85,top:150}]).png().toFile(output);
console.log("Generated " + output);
