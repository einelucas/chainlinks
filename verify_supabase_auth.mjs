import { chromium } from 'playwright';

const USERNAME = 'sbtest' + Date.now().toString().slice(-8);
const EMAIL = `${USERNAME}@gmail.com`;
const consoleErrors = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));
page.on('response', async (res) => {
  if (res.status() >= 400) {
    let body = '';
    try { body = (await res.text()).slice(0, 300); } catch {}
    console.log('HTTP', res.status(), res.url(), '|', body);
  }
});

console.log('--- 1. Registro por email/senha ---');
await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle' });
await page.fill('input[placeholder="Seu nome"]', 'Supabase Test');
await page.fill('input[placeholder="seu-usuario"]', USERNAME);
await page.fill('input[placeholder="voce@email.com"]', EMAIL);
await page.fill('input[placeholder="Mínimo 6 caracteres"]', 'senha123456');
await page.click('button[type="submit"]');
await page.waitForTimeout(5000);
console.log('URL após submit:', page.url());
const infoBox = await page.locator('.text-emerald-400').textContent().catch(() => null);
const errorBox = await page.locator('.text-red-400').textContent().catch(() => null);
console.log('info box:', infoBox);
console.log('error box:', errorBox);
const buttonText = await page.locator('button[type="submit"]').textContent().catch(() => null);
console.log('texto do botão submit:', buttonText);

if (page.url().includes('/admin')) {
  console.log('OK: sessão criada na hora, foi pro /admin');

  console.log('--- 2. Refresh mantém sessão ---');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  console.log('URL após reload:', page.url(), page.url().includes('/admin') ? 'OK' : 'FALHOU');

  console.log('--- 3. Página foi criada com o username escolhido? ---');
  const pageData = await page.evaluate(async () => {
    const res = await fetch('/api/page');
    return res.ok ? res.json() : { error: await res.text() };
  });
  console.log('username da Page:', pageData.username, pageData.username === USERNAME ? 'OK (username escolhido preservado)' : 'DIVERGENTE: ' + JSON.stringify(pageData).slice(0,200));

  console.log('--- 4. Logout ---');
  await page.click('.admin-logout-button, [aria-label="Sair da conta"]');
  await page.waitForURL('**/login', { timeout: 10000 });
  console.log('OK: logout -> /login');

  console.log('--- 5. Login de novo por email/senha ---');
  await page.fill('input[placeholder="voce@email.com"]', EMAIL);
  await page.fill('input[placeholder="Sua senha"]', 'senha123456');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 15000 });
  console.log('OK: login de novo -> /admin');

  console.log('--- 6. Logout de novo, testar botão Google ---');
  await page.click('.admin-logout-button, [aria-label="Sair da conta"]');
  await page.waitForURL('**/login', { timeout: 10000 });
} else {
  console.log('INFO: precisa confirmar email antes de logar (comportamento do projeto Supabase)');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
}

const googleButton = page.locator('button:has-text("Continuar com Google")');
console.log('botão Google visível:', await googleButton.isVisible());
await googleButton.click();
await page.waitForTimeout(2500);
console.log('URL após clicar no botão Google:', page.url());

console.log('\nCONSOLE_ERRORS:', JSON.stringify(consoleErrors));
console.log('USERNAME=' + USERNAME, 'EMAIL=' + EMAIL);

await browser.close();
