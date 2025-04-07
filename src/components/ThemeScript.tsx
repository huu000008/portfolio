export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const theme = localStorage.getItem('theme');
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              const initialTheme = theme || systemTheme;
              document.documentElement.setAttribute('data-theme', initialTheme);
              
              window.__THEME_DATA__ = initialTheme;
            } catch (e) {
              document.documentElement.setAttribute('data-theme', 'light');
              window.__THEME_DATA__ = 'light';
            }
          })();
        `,
      }}
    />
  );
}
