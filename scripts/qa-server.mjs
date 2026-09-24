// Local-only browser test fixture. Never use as a production server.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("dist");
let mode = "success";
let turnstileMode = "success";
const types = {".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".webp":"image/webp",".avif":"image/avif",".png":"image/png",".svg":"image/svg+xml",".woff2":"font/woff2",".pdf":"application/pdf",".xml":"application/xml"};
createServer(async (request,response) => {
  const url = new URL(request.url, "http://127.0.0.1:4323");
  if (url.pathname === "/__qa/turnstile-mode") {
    turnstileMode = url.searchParams.get("value") || "success";
    response.writeHead(200,{"content-type":"application/json"}).end(JSON.stringify({turnstileMode})); return;
  }
  if (url.pathname === "/__qa/turnstile.js") {
    if (turnstileMode === "load-error") { response.writeHead(503).end(); return; }
    const mock = await readFile(new URL("./fixtures/turnstile.js", import.meta.url), "utf8");
    response.writeHead(200,{"content-type":"text/javascript"}).end(`window.__qaTurnstileMode=${JSON.stringify(turnstileMode)};\n${mock}`); return;
  }
  if (url.pathname === "/__qa/mode") {
    mode = url.searchParams.get("value") || "success";
    response.writeHead(200,{"content-type":"application/json"}).end(JSON.stringify({mode})); return;
  }
  if (url.pathname === "/api/vip-signup") {
    let text = ""; for await (const chunk of request) text += chunk;
    let body; try { body=JSON.parse(text); } catch { response.writeHead(400).end(); return; }
    if (mode === "network-error") { request.socket.destroy(); return; }
    const valid = body.firstName && body.email && body.consent === true && body.turnstileToken === "local-mock-token" && Number.isFinite(body.startedAt) && body.website === "";
    const ok = mode === "success" && valid;
    response.writeHead(ok ? 200 : 503,{"content-type":"application/json"}).end(JSON.stringify(ok ? {ok:true,message:"You’re on the list."} : {ok:false,message:"We couldn’t add you just now. Please try again.",fields:{email:"Please check your email address."}})); return;
  }
  try {
    let file=resolve(root,"."+decodeURIComponent(url.pathname));
    if (file !== root && !file.startsWith(root+sep)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file=resolve(file,"index.html");
    let data=await readFile(file);
    const headers={"content-type":types[extname(file)] || "application/octet-stream"};
    if (extname(file)===".html") {
      // Keep challenge loading/rendering testable without contacting Cloudflare.
      data=Buffer.from(data.toString().replace(/<script[^>]*src="https:\/\/challenges\.cloudflare\.com[^"]*"[^>]*><\/script>/g,""));
      data=Buffer.from(data.toString().replace("<head>", `<head><script>
        const append = HTMLHeadElement.prototype.appendChild;
        HTMLHeadElement.prototype.appendChild = function(node) {
          if (node.tagName === 'SCRIPT' && node.src.startsWith('https://challenges.cloudflare.com/turnstile/')) {
            node.src = '/__qa/turnstile.js' + new URL(node.src).search;
          }
          return append.call(this, node);
        };
      </script>`));
      if (mode==="no-js") headers["content-security-policy"]="script-src 'none'";
    }
    response.writeHead(200,headers).end(data);
  } catch { response.writeHead(404).end("Not found"); }
}).listen(4323,"127.0.0.1",()=>console.log("Local QA fixture: http://127.0.0.1:4323 (mock VIP only)"));
