// Periodically checks whether a newer build of the app has been deployed.
// Vite hashes the JS bundle filename on every build, so comparing the
// script src currently loaded against what /index.html now points to is
// enough to detect a new deployment — no manual version number to
// remember to bump on every release.

export function startUpdateCheck(onUpdateAvailable: () => void): () => void {
  const currentScript = document.querySelector('script[type="module"]');
  const currentSrc = currentScript?.getAttribute("src");

  const check = async () => {
    if (!currentSrc) return;
    try {
      const res = await fetch("/index.html", { cache: "no-store" });
      const html = await res.text();
      const match = html.match(/<script[^>]*type="module"[^>]*src="([^"]+)"/);
      if (match && match[1] !== currentSrc) {
        onUpdateAvailable();
      }
    } catch {
      // Offline or request failed — just try again next interval.
    }
  };

  const interval = setInterval(check, 60000);
  const onVisible = () => {
    if (!document.hidden) check();
  };
  document.addEventListener("visibilitychange", onVisible);

  return () => {
    clearInterval(interval);
    document.removeEventListener("visibilitychange", onVisible);
  };
}
