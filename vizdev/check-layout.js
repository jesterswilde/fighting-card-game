// Real layout regression check. Uses installed Chromium and Bun's WebSocket; no packages.
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "vizdev-check-"));
const browser = spawn(process.env.CHROMIUM || "chromium", [
  "--headless",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "--remote-debugging-port=0",
  "--user-data-dir=" + profile,
  "about:blank",
]);
let socket;
const timeout = setTimeout(() => {
  console.error("Browser test timed out");
  browser.kill();
  process.exitCode = 1;
}, 90000);
(async () => {
  const endpoint = await new Promise((resolve, reject) => {
    let log = "";
    browser.stderr.on("data", (chunk) => {
      log += chunk;
      const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        resolve(match[1]);
      }
    });
    browser.on("error", reject);
    browser.on("exit", (code) => reject(new Error("Chromium exited: " + code + "\n" + log)));
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  let nextId = 0;
  const pending = new Map();
  socket.onmessage = (e) => {
    const r = JSON.parse(e.data);
    if (pending.has(r.id)) {
      const { resolve, reject } = pending.get(r.id);
      pending.delete(r.id);
      r.error ? reject(new Error(JSON.stringify(r.error))) : resolve(r.result);
    }
  };
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);
  const evaluate = async (expression) => {
    const r = await call("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (r.exceptionDetails) {
      throw new Error(JSON.stringify(r.exceptionDetails));
    }
    return r.result.value;
  };
  await call("Page.enable");
  await call("Page.navigate", { url: pathToFileURL(path.join(__dirname, "index.html")).href });
  await evaluate(
    `new Promise(resolve => { const ready=()=>document.readyState==='complete' ? document.fonts.ready.then(()=>resolve(true)) : setTimeout(ready,20);ready();})`,
  );
  const reports = [];
  for (const width of [1440, 1051, 768, 650, 390, 320]) {
    await call("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    reports.push(
      await evaluate(`(() => {
      const failures=[], density={};
      for(const c of cards){picker.value=c.name;render();for(const el of document.querySelectorAll('.card')){
        if(el.querySelector('.card-footer').offsetHeight!==42) failures.push({card:c.name,style:el.className,footerHeight:el.querySelector('.card-footer').offsetHeight});
        const name=el.className; density[el.dataset.density]=(density[el.dataset.density]||0)+1;
        if(el.offsetHeight!==600 || el.scrollHeight>el.clientHeight+1 || el.scrollWidth>el.clientWidth+1) failures.push({card:c.name,style:name,height:el.offsetHeight,overflowY:el.scrollHeight-el.clientHeight,overflowX:el.scrollWidth-el.clientWidth});
        for(const child of el.querySelectorAll('.rules,.card-title,.card-footer')) if(child.scrollWidth>child.clientWidth+1 || child.scrollHeight>child.clientHeight+1) failures.push({card:c.name,style:name,child:child.className,overflowX:child.scrollWidth-child.clientWidth,overflowY:child.scrollHeight-child.clientHeight});
        if(el.querySelectorAll('.requirements .piece').length!==c.requirements.length || el.querySelectorAll('.mechanic').length!==c.mechanics.length) failures.push({card:c.name,style:name,data:'missing'});
      }}
      return {width:innerWidth,cards:cards.length,failures,density};
    })()`),
    );
  }
  fs.writeFileSync(
    path.join(os.tmpdir(), "vizdev-layout-report.json"),
    JSON.stringify(reports, null, 2),
  );
  console.log(
    JSON.stringify(
      reports.map((r) => ({ ...r, failures: r.failures.length, examples: r.failures.slice(0, 5) })),
      null,
      2,
    ),
  );
  const controls = await evaluate(`(() => {
    picker.value='1000 Cuts';render();
    document.querySelector('[data-direction="punk"][data-palette="1"]').click();
    const tone=document.querySelector('.card.punk').style.getPropertyValue('--tone');
    const sameStyle=cards.find(c=>c.style==='Finesse'&&c.name!=='1000 Cuts');picker.value=sameStyle.name;render();
    const remembered=document.querySelector('.card.punk').style.getPropertyValue('--tone')===tone;
    const before=picker.value;document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'r',bubbles:true}));
    return {paletteRemembered:remembered,randomChanged:picker.value!==before,requiresLabels:document.querySelectorAll('.requirements h4').length,normalCursor:getComputedStyle(document.querySelector('.piece')).cursor==='default'};
  })()`);
  console.log("Controls:", JSON.stringify(controls));
  if (
    reports.some((r) => r.failures.length) ||
    !controls.paletteRemembered ||
    !controls.randomChanged ||
    controls.requiresLabels ||
    !controls.normalCursor
  ) {
    process.exitCode = 1;
  }
  // Capture a dense, branching card at desktop width for review.
  await call("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await evaluate(`picker.value='Targeted Strike';render();document.fonts.ready`);
  const capture = await call("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });
  fs.writeFileSync(
    path.join(os.tmpdir(), "vizdev-complex.png"),
    Buffer.from(capture.data, "base64"),
  );
  await evaluate(
    `picker.value='Leaping Smash';render();document.querySelectorAll('.study').forEach((s,i)=>s.querySelectorAll('[data-palette]')[1+i%3].click());`,
  );
  const alternate = await call("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });
  fs.writeFileSync(
    path.join(os.tmpdir(), "vizdev-palettes.png"),
    Buffer.from(alternate.data, "base64"),
  );
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    clearTimeout(timeout);
    if (socket) {
      socket.close();
    }
    browser.kill();
  });
