import sharp from "sharp";

const canvas = "public/images/social-card.svg";
const logo = "public/brand/nipo-logo.svg";
const output = "public/images/social-card.png";

const logoBuffer = await sharp(logo)
  .resize(180, 159, { fit: "contain" })
  .png()
  .toBuffer();

await sharp(canvas, { density: 144 })
  .resize(1200, 630)
  .composite([{ input: logoBuffer, left: 510, top: 64 }])
  .png()
  .toFile(output);

console.log(`Generated ${output}`);
