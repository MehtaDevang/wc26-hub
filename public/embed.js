(function () {
  var script = document.currentScript;
  if (!script || !script.parentNode) return;

  var host = (script.getAttribute("data-host") || "https://www.thegoalposts.in").replace(/\/$/, "");
  var height = script.getAttribute("data-height") || "360";

  var iframe = document.createElement("iframe");
  iframe.src = host + "/embed/live-scores";
  iframe.title = "World Cup 2026 Live Scores";
  iframe.style.width = "100%";
  iframe.style.minHeight = height + "px";
  iframe.style.border = "0";
  iframe.style.borderRadius = "12px";
  iframe.loading = "lazy";
  iframe.setAttribute("allowtransparency", "true");

  script.parentNode.insertBefore(iframe, script);
})();
