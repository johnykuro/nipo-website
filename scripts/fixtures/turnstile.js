// Local QA fixture only; the server still requires the known mock token.
(() => {
  const widgets = new Map();
  const qa = window.__qaChallenge = { renders: 0, resets: 0, options: null };
  qa.complete = () => {
    for (const { input, options } of widgets.values()) {
      input.value = "local-mock-token";
      options.callback();
    }
  };
  qa.expire = () => { for (const { input } of widgets.values()) input.value = ""; };
  qa.fail = () => {
    qa.expire();
    for (const { options } of widgets.values()) options["error-callback"]();
  };
  window.turnstile = {
    render(container, options) {
      qa.renders++;
      qa.options = options;
      const id = String(qa.renders);
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = options["response-field-name"];
      container.append(input);
      widgets.set(id, { input, options });
      if (window.__qaTurnstileMode === "success") setTimeout(qa.complete, 50);
      return id;
    },
    reset(id) {
      qa.resets++;
      widgets.get(id).input.value = "";
      if (window.__qaTurnstileMode === "success") setTimeout(qa.complete, 50);
    },
    remove(id) { widgets.get(id)?.input.remove(); widgets.delete(id); },
  };
  const callback = new URL(document.currentScript.src).searchParams.get("onload");
  window[callback]();
})();
