import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Deployment contract: nginx.conf is plain config, so textual assertions are
// the appropriate level of testing here. Vitest's root is the project root.
const nginxConf = readFileSync(join(process.cwd(), 'nginx.conf'), 'utf8');

describe('nginx deployment contract', () => {
  it('serves the SPA fallback for client-side routes', () => {
    expect(nginxConf).toMatch(/try_files \$uri \$uri\/ \/index\.html;/);
  });

  it('sets the required security headers', () => {
    expect(nginxConf).toMatch(/add_header X-Frame-Options "SAMEORIGIN" always;/);
    expect(nginxConf).toMatch(
      /add_header X-Content-Type-Options "nosniff" always;/
    );
    expect(nginxConf).toMatch(
      /add_header Referrer-Policy "strict-origin-when-cross-origin" always;/
    );
    expect(nginxConf).toMatch(/add_header Content-Security-Policy "[^"]+" always;/);
  });
});
