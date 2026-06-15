(function () {
  var script = document.currentScript;
  if (!script || !script.parentNode) return;

  var DEFAULT_HOST = "https://www.thegoalposts.in";
  var rawHost = script.getAttribute("data-host") || DEFAULT_HOST;
  var host = DEFAULT_HOST;

  try {
    var parsed = new URL(rawHost.replace(/\/$/, ""));
    var h = parsed.hostname.toLowerCase();
    var ok =
      h === "www.thegoalposts.in" ||
      h === "thegoalposts.in" ||
      h === "www.thegoalposts.com" ||
      h === "thegoalposts.com" ||
      h === "localhost" ||
      h === "127.0.0.1";
    if (ok && (parsed.protocol === "https:" || (parsed.protocol === "http:" && (h === "localhost" || h === "127.0.0.1")))) {
      host = parsed.origin;
    }
  } catch (e) {
    host = DEFAULT_HOST;
  }

  var height = script.getAttribute("data-height") || "360";
  var maxHeight = Math.min(Math.max(parseInt(height, 10) || 360, 200), 800);

  var iframe = document.createElement("iframe");
  iframe.src = host + "/embed/live-scores";
  iframe.title = "World Cup 2026 Live Scores";
  iframe.style.width = "100%";
  iframe.style.minHeight = maxHeight + "px";
  iframe.style.border = "0";
  iframe.style.borderRadius = "12px";
  iframe.loading = "lazy";
  iframe.setAttribute("allowtransparency", "true");
  iframe.setAttribute(
    "sandbox",
    "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
  );

  script.parentNode.insertBefore(iframe, script);
})();
