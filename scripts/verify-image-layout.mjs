// Regression check for intrinsic image overflow in desktop grids.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const binary = process.env.AGENT_BROWSER_BIN;
if (!binary) throw new Error("Set AGENT_BROWSER_BIN to the agent-browser executable.");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4322";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error("Use a local preview.");
function run(...args) {
  let text;
  try { text = execFileSync(binary, ["--session","nipo-layout","--json",...args], {encoding:"utf8",timeout:30000}); }
  catch (error) {
    if (error.code !== "ETIMEDOUT" || !error.stdout || !JSON.parse(error.stdout).success) throw error;
    text = error.stdout;
  }
  const output = JSON.parse(text);
  if (!output.success) throw new Error(output.error);
  return output.data;
}
const viewports = [[360,800],[390,844],[1024,768],[1440,900],[1920,1080],[2560,1440],[3440,1440]];
const report = [];
for (const [width,height] of viewports) {
  run("set","viewport",String(width),String(height));
  for (const path of ["/","/concept/","/menus/","/gallery/","/contact/"]) {
    run("open",origin+path);
    const result = run("eval",`(() => {
      const failures = [];
      document.querySelectorAll(".photo").forEach((frame,index) => {
        const f=frame.getBoundingClientRect(), img=frame.querySelector("img"), i=img.getBoundingClientRect();
        const section=frame.closest(".concept-opening, .contact-opening, .editorial-feature, .hospitality"), s=section?.getBoundingClientRect();
        const label=img.alt || "Photo " + index;
        if (f.width <= 0 || f.height <= 0) failures.push(label + ": collapsed frame");
        if (i.top < f.top-1 || i.bottom > f.bottom+1 || i.left < f.left-1 || i.right > f.right+1) failures.push(label + ": image outside frame");
        if (s && (f.top < s.top-1 || f.bottom > s.bottom+1)) failures.push(label + ": frame outside section");
      });
      return {frames:document.querySelectorAll(".photo").length,overflow:document.documentElement.scrollWidth>innerWidth,failures};
    })()`).result;
    assert.equal(result.overflow,false,path+" horizontal overflow at "+width);
    assert.deepEqual(result.failures,[],path+" image containment at "+width);
    report.push({path,width,height,...result});
  }
  console.log("PASS image containment at "+width+"×"+height);
}
mkdirSync("tmp/qa",{recursive:true});
writeFileSync("tmp/qa/image-containment.json",JSON.stringify(report,null,2));
console.log(report.length+" page/viewport image-containment checks passed.");
run("close");
