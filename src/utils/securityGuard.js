// Supreme Security Guard & Data Protection Shield

export function initSecurityGuard() {
  if (typeof window === 'undefined') return;

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // 1. Password & Sensitive Key Console Scrubber (Applies in All Environments)
  const originalLog = window.console.log;
  const originalError = window.console.error;

  const sanitizeLogArgs = (args) => {
    return args.map(arg => {
      if (typeof arg === 'string') {
        return arg.replace(/password\s*[:=]\s*['"]?[^'"]+['"]?/gi, 'password: [PROTECTED]')
                  .replace(/token\s*[:=]\s*['"]?[^'"]+['"]?/gi, 'token: [PROTECTED]');
      }
      if (arg && typeof arg === 'object') {
        try {
          const clone = JSON.parse(JSON.stringify(arg));
          if (clone.password) clone.password = '[PROTECTED]';
          if (clone.passwordHash) clone.passwordHash = '[PROTECTED]';
          if (clone.token) clone.token = '[PROTECTED]';
          return clone;
        } catch (e) {
          return '[OBJECT PROTECTED]';
        }
      }
      return arg;
    });
  };

  // Override console methods with security scrubber
  window.console.log = (...args) => originalLog.apply(console, sanitizeLogArgs(args));
  window.console.error = (...args) => originalError.apply(console, sanitizeLogArgs(args));

  // 2. Disable Right Click Context Menu (Production Only)
  if (!isLocalhost) {
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });

    // 3. Block DevTools Key Shortcuts (F12, Cmd+Alt+I, Ctrl+Shift+I, Cmd+Alt+J, Ctrl+Shift+J, Cmd+U, Ctrl+U)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey && e.altKey : e.ctrlKey && e.shiftKey;

      if (
        modifier && (
          e.key === 'I' || e.key === 'i' ||
          e.key === 'J' || e.key === 'j' ||
          e.key === 'C' || e.key === 'c' ||
          e.key === 'U' || e.key === 'u' ||
          e.key === 'S' || e.key === 's'
        )
      ) {
        e.preventDefault();
        return false;
      }

      // Block View Source Shortcut (Cmd+U or Ctrl+U)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }
    });

    // 4. Overwrite Console Inspection in Production
    const noop = () => {};
    window.console.log = noop;
    window.console.debug = noop;
    window.console.info = noop;
    window.console.dir = noop;
    window.console.table = noop;
  }
}
