export const defaultTokens = {
  name: 'default',
  version: '1.0.0',
  themes: {
    light: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        },
        neutral: {
          50: '#fafafa',
          900: '#171717'
        }
      },
      spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        4: '1rem',
        6: '1.5rem',
        8: '2rem'
      },
      typography: {
        fontFamily: {
          sans: 'Inter, sans-serif',
          mono: 'ui-monospace, monospace'
        },
        fontSize: {
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem'
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75'
        }
      },
      shadows: {
        sm: '0 1px 2px rgb(0 0 0 / 0.05)',
        md: '0 4px 6px rgb(0 0 0 / 0.1)'
      },
      radii: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        full: '9999px'
      },
      motion: {
        fast: '120ms',
        normal: '180ms',
        slow: '240ms'
      },
      zIndex: {
        base: 0,
        dropdown: 1000,
        modal: 2000,
        toast: 3000
      },
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },
      containers: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },
      borders: {
        thin: '1px',
        medium: '2px',
        thick: '4px'
      },
      opacity: {
        0: '0',
        50: '0.5',
        100: '1'
      },
      blur: {
        none: '0',
        sm: '4px',
        md: '8px'
      }
    },
    dark: {
      colors: {
        primary: {
          50: '#dbeafe',
          500: '#60a5fa',
          900: '#0f172a'
        },
        neutral: {
          50: '#e5e5e5',
          900: '#0a0a0a'
        }
      }
    }
  }
};

export function createTokenGroup(overrides = {}, base = {}) {
  return {
    ...base,
    ...overrides
  };
}
