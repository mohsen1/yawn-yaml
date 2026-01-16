import { test, expect } from '@playwright/test';

test.describe('YAWN YAML Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    // Wait for editors to initialize
    await page.waitForSelector('.cm-editor', { state: 'visible' });
    // Wait for window.__editors to be available
    await page.waitForFunction(() => (window as any).__editors !== undefined, { timeout: 10000 });
    // Give editors time to fully initialize
    await page.waitForTimeout(300);
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('YAWN Demo');
  });

  test('header displays correctly', async ({ page }) => {
    await expect(page.locator('header h2')).toHaveText('YAWN Demo');
    await expect(page.locator('header p')).toContainText('Edit YAML or JSON');
    await expect(page.locator('header a[href*="github"]')).toBeVisible();
  });

  test('three editor columns are visible', async ({ page }) => {
    const columns = page.locator('.col');
    await expect(columns).toHaveCount(3);

    // Check labels
    await expect(page.locator('.col').nth(0).locator('label')).toContainText('Source YAML');
    await expect(page.locator('.col').nth(1).locator('label')).toContainText('JSON');
    await expect(page.locator('.col').nth(2).locator('label')).toContainText('Output YAML');
  });

  test('three CodeMirror editors are present', async ({ page }) => {
    const editors = page.locator('.cm-editor');
    await expect(editors).toHaveCount(3);
  });

  test('YAML editor contains default content', async ({ page }) => {
    const yamlEditor = page.locator('#yamlEditor .cm-content');
    const content = await yamlEditor.textContent();

    expect(content).toContain('YAWN Demo');
    expect(content).toContain('app:');
    expect(content).toContain('database:');
    expect(content).toContain('features:');
  });

  test('JSON editor shows parsed YAML content', async ({ page }) => {
    const jsonEditor = page.locator('#jsonEditor .cm-content');
    const content = await jsonEditor.textContent();

    expect(content).toContain('"app"');
    expect(content).toContain('"name"');
    expect(content).toContain('"My App"');
    expect(content).toContain('"database"');
  });

  test('output editor shows YAML with comments preserved', async ({ page }) => {
    const outputEditor = page.locator('#outputEditor .cm-content');
    const content = await outputEditor.textContent();

    // Check that comments are preserved in output
    expect(content).toContain('# YAWN Demo');
    expect(content).toContain('# Application settings');
    expect(content).toContain('# quoted string preserved');
  });

  test('status indicators show valid initially', async ({ page }) => {
    await expect(page.locator('#yamlStatus')).toHaveText('valid');
    await expect(page.locator('#yamlStatus')).toHaveClass(/ok/);
    await expect(page.locator('#jsonStatus')).toHaveText('valid');
    await expect(page.locator('#jsonStatus')).toHaveClass(/ok/);
  });

  test('editing JSON updates output YAML', async ({ page }) => {
    const outputEditor = page.locator('#outputEditor .cm-content');

    // Get initial output
    const initialOutput = await outputEditor.textContent();
    expect(initialOutput).toContain('"My App"');

    // Use exposed editors to set content directly and trigger update
    await page.evaluate(() => {
      const editors = (window as any).__editors;
      const view = editors.jsonEditor;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: '{"app": {"name": "Changed App"}}' }
      });
      // Manually trigger update since programmatic dispatch doesn't trigger listener
      (window as any).__updateFromJson();
    });

    // Wait for update
    await page.waitForTimeout(200);

    // Check output updated
    const newOutput = await outputEditor.textContent();
    expect(newOutput).toContain('Changed App');
  });

  test('editing YAML updates JSON and output', async ({ page }) => {
    const jsonEditor = page.locator('#jsonEditor .cm-content');
    const outputEditor = page.locator('#outputEditor .cm-content');

    // Use exposed editors to set content directly and trigger update
    await page.evaluate(() => {
      const editors = (window as any).__editors;
      const view = editors.yamlEditor;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: '# Test comment\ntest: value\n' }
      });
      // Manually trigger update since programmatic dispatch doesn't trigger listener
      (window as any).__updateFromYaml();
    });

    // Wait for update
    await page.waitForTimeout(200);

    // Check JSON updated
    const jsonContent = await jsonEditor.textContent();
    expect(jsonContent).toContain('"test"');
    expect(jsonContent).toContain('"value"');

    // Check output has comment preserved
    const outputContent = await outputEditor.textContent();
    expect(outputContent).toContain('# Test comment');
    expect(outputContent).toContain('test:');
  });

  test('invalid YAML shows error status', async ({ page }) => {
    // Use exposed editors to set invalid YAML content and trigger update
    await page.evaluate(() => {
      const editors = (window as any).__editors;
      const view = editors.yamlEditor;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: 'invalid: yaml: content: [' }
      });
      (window as any).__updateFromYaml();
    });

    // Wait for update
    await page.waitForTimeout(200);

    // Check error status
    await expect(page.locator('#yamlStatus')).toHaveText('parse error');
    await expect(page.locator('#yamlStatus')).toHaveClass(/error/);
  });

  test('invalid JSON shows error status', async ({ page }) => {
    // Use exposed editors to set invalid JSON content and trigger update
    await page.evaluate(() => {
      const editors = (window as any).__editors;
      const view = editors.jsonEditor;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: '{invalid json}' }
      });
      (window as any).__updateFromJson();
    });

    // Wait for update
    await page.waitForTimeout(200);

    // Check error status
    await expect(page.locator('#jsonStatus')).toHaveText('parse error');
    await expect(page.locator('#jsonStatus')).toHaveClass(/error/);
  });

  test('output editor is read-only', async ({ page }) => {
    // Check for readonly badge
    await expect(page.locator('.readonly-badge')).toHaveText('read-only');

    // Try to type in output editor - it should not change
    const outputEditor = page.locator('#outputEditor .cm-content');
    const initialContent = await outputEditor.textContent();

    await outputEditor.click();
    await page.keyboard.type('should not appear');

    // Content should be unchanged
    const finalContent = await outputEditor.textContent();
    expect(finalContent).toBe(initialContent);
  });

  test('comments are preserved when modifying values via JSON', async ({ page }) => {
    const outputEditor = page.locator('#outputEditor .cm-content');

    // First verify initial state has comments
    let outputContent = await outputEditor.textContent();
    expect(outputContent).toContain('# toggle this');
    expect(outputContent).toContain("# don't commit this!");

    // Use exposed editors to modify JSON - keep structure but change values
    const newJson = JSON.stringify({
      app: { name: "My App", version: 1.0, debug: false },
      database: {
        host: "localhost",
        port: 5432,
        credentials: { user: "admin", password: "newsecret" }
      },
      features: ["dark_mode", "notifications", "analytics"]
    }, null, 2);

    await page.evaluate((json) => {
      const editors = (window as any).__editors;
      const view = editors.jsonEditor;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: json }
      });
      (window as any).__updateFromJson();
    }, newJson);

    // Wait for update
    await page.waitForTimeout(200);

    // Check that comments are still preserved in output
    outputContent = await outputEditor.textContent();
    expect(outputContent).toContain('# toggle this');
    expect(outputContent).toContain("# don't commit this!");

    // And values are updated
    expect(outputContent).toContain('debug: false');
    expect(outputContent).toContain('newsecret');
  });

  test('GitHub link is correct', async ({ page }) => {
    const githubLink = page.locator('header a[href*="github"]');
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/mohsen1/yawn-yaml');
  });
});
