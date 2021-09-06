import { Browser } from "puppeteer";
import { z } from "zod";

import { Logger } from "./Logger";

export const DeviceConfig = z.object({
  kind: z.literal(`android`),
  email: z.string(),
  password: z.string(),
  shortcut: z.string().length(1),
});

type DeviceConfig = z.infer<typeof DeviceConfig>;

export const findDevice = async (
  config: DeviceConfig,
  browser: Browser,
  logger: Logger,
): Promise<void> => {
  return findAndroidDevice(config, browser, logger);
};

const findAndroidDevice = async (
  device: { readonly email: string; readonly password: string },
  browser: Browser,
  logger: Logger,
): Promise<void> => {
  logger.log(`Finding Android device of ${device.email}`);
  const page = await browser.newPage();
  page.setViewport({ width: 800, height: 600 });
  page.setDefaultTimeout(120000);
  logger.log(`Navigating to https://www.google.com/android/find`);
  await page.goto(`https://www.google.com/android/find`);
  logger.log(`Waiting for email input`);
  await page.waitForSelector(`input[type=email]`, { visible: true });
  logger.log(`Typing email`);
  await page.type(`input[type=email]`, device.email);
  await page.keyboard.press(`Enter`);
  logger.log(`Waiting for password input`);
  await page.waitForSelector(`input[type=password]`, { visible: true });
  logger.log(`Typing password`);
  await page.type(`input[type=password]`, device.password);
  await page.keyboard.press(`Enter`);
  logger.log(`Waiting for device status`);
  await page.waitForSelector(`.cellular-carrier.enabled-state`, {
    visible: true,
  });
  logger.log(`Waiting for button`);
  const button = await page.waitForSelector(`.device-button-ring .nova-button`);
  logger.log(`Clicking button`);
  await button?.click();
  logger.log(`Waiting for user`);
  await page.waitForSelector(`.notification.alerter:not(.hidden)`);
  logger.log(`Device found!`);
};
