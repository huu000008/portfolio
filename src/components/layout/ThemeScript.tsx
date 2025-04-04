export function ThemeScript() {
  const code = `
    (function () {
      try {
        var theme = localStorage.getItem('theme');
        if (!theme || theme === 'system') {
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          theme = prefersDark ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);
      } catch (_) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
