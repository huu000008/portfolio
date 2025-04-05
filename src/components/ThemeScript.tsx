export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const theme = localStorage.getItem('theme');
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const initialTheme = theme || systemTheme;

            document.documentElement.dataset.theme = initialTheme;
          })();
        `,
      }}
    />
  );
}
