import { expect, test } from '@playwright/test';

test('complete presentation flow: replan, task progress, persistence, concierge and reset', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'こんにちは、佐藤さん。' })).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '46');
  await page.screenshot({
    path: 'test-results/dashboard-desktop.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('button', { name: '3つのシナリオを比較する' }).click();
  await expect(page.locator('.scenario-card.recommended .scenario-letter')).toContainText('B');
  await page.getByRole('button', { name: '条件が変わったら？', exact: true }).click();
  await page.getByRole('combobox', { name: '妻の関西異動', exact: true }).selectOption('possible');
  await page.getByRole('combobox', { name: '保育園受入見込み' }).selectOption('high');
  await page.getByRole('button', { name: '新しい条件で再計算', exact: true }).click();
  await expect(page.getByText('Plan v2 に更新')).toBeVisible();
  await expect(page.locator('.result-comparison > div').last()).toContainText('A');
  await page.getByRole('button', { name: '更新されたFamily Move Planを見る' }).click();
  await expect(page.locator('.plan-hero-letter')).toContainText('A');
  await expect(page.locator('.plan-update')).toContainText('B案からA案');
  await page.screenshot({
    path: 'test-results/plan-replanned.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('button', { name: 'やること', exact: false }).first().click();
  await page.getByRole('checkbox', { name: '妻の勤務先に関西異動可否を確認を完了にする' }).check();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '54');
  await page.reload();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '54');
  await expect(page.locator('.plan-label')).toContainText('A案');
  await expect(page.locator('.version-label')).toHaveText('Plan v2');
  await page.locator('.concierge-card').getByRole('button', { name: 'メッセージを見る' }).click();
  await expect(page.getByRole('dialog')).toContainText('保育園の申請条件を整理しました。');
  await page.getByLabel('コンシェルジュへのメッセージ').fill('家族で相談します。');
  await page.getByRole('button', { name: 'メッセージをデモ送信' }).click();
  await expect(page.getByText('家族で相談します。')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'デモを初期状態に戻す' }).click();
  await page.getByRole('button', { name: '初期状態に戻す', exact: true }).click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '46');
  await expect(page.locator('.plan-label')).toContainText('B案');
  await page.reload();
  await expect(page.locator('.version-label')).toHaveText('Plan v1');
  expect(errors).toEqual([]);
});

test('family check edits, filters, completion and privacy settings work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Family Move Check', exact: true }).click();
  await page.getByLabel('家族人数', { exact: true }).fill('4');
  await page.getByRole('button', { name: '次へ進む' }).click();
  await page.getByRole('slider', { name: '家族みんなで暮らす' }).fill('4');
  await page.getByRole('button', { name: '次へ進む' }).click();
  await page.getByRole('combobox', { name: '妻の関西異動', exact: true }).selectOption('possible');
  await page.getByRole('combobox', { name: '保育園受入見込み' }).selectOption('high');
  await page.getByRole('button', { name: '保存してシナリオを比較する' }).click();
  await expect(page.locator('.scenario-card.recommended .scenario-letter')).toContainText('A');
  await page.getByRole('button', { name: 'やること', exact: false }).first().click();
  for (const checkbox of await page.getByRole('checkbox').all()) await checkbox.check();
  await page.getByRole('button', { name: 'Transition Complete' }).click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  await page.getByRole('button', { name: 'プライバシー設定' }).click();
  await page.getByRole('checkbox', { name: 'ご家族の個別事情' }).check();
  await page.getByRole('button', { name: '共有設定を保存' }).click();
  await page.reload();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  await expect(page.getByText('家族4人の「これから」を、一つの計画に。')).toBeVisible();
  await page.getByRole('button', { name: 'プライバシー設定' }).click();
  await expect(page.getByRole('checkbox', { name: 'ご家族の個別事情' })).toBeChecked();
});

test('mobile navigation and dialogs fit a small screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'こんにちは、佐藤さん。' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({
    path: 'test-results/dashboard-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('button', { name: 'メニューを開く' }).click();
  await page.getByRole('button', { name: 'シナリオ比較', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: '3つの生活シナリオを比較しました' }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: '条件が変わったら？', exact: true }).click();
  await page.getByRole('combobox', { name: '妻の関西異動', exact: true }).selectOption('possible');
  await page.getByRole('combobox', { name: '保育園受入見込み' }).selectOption('high');
  await page.getByRole('button', { name: '新しい条件で再計算', exact: true }).click();
  await page.getByRole('button', { name: '更新されたFamily Move Planを見る' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'プレビュー', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('invalid saved data recovers and the app remains usable offline', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('family-move-support-demo-v1', '{invalid'));
  await page.reload();
  await expect(page.locator('.version-label')).toHaveText('Plan v1');
  await context.setOffline(true);
  await page.getByRole('button', { name: '3つのシナリオを比較する' }).click();
  await expect(page.locator('.scenario-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'この案のPlanを見る' }).click();
  await expect(page.locator('.plan-hero-letter')).toContainText('B');
  await context.setOffline(false);
});
