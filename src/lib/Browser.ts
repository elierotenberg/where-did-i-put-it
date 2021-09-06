import { Browser, LaunchOptions } from "puppeteer";
import { PuppeteerExtra } from "puppeteer-extra";
import { z } from "zod";

import { Logger } from "./Logger";

export const BrowserConfig = z.object({
  kind: z.literal(`chromium`),
  executablePath: z.string(),
  headless: z.boolean(),
});

type BrowserConfig = z.infer<typeof BrowserConfig>;

export const useBrowser = async <T>(
  config: BrowserConfig,
  puppeteer: PuppeteerExtra,
  logger: Logger,
  fn: (browser: Browser) => Promise<T>,
): Promise<T> => {
  logger.log(`Creating browser`);
  const browser = await puppeteer.launch({
    executablePath: config.executablePath,
    headless: config.headless,
    args: [`--disable-gpu`, `--no-sandbox`],
  } as LaunchOptions);
  try {
    logger.log(`Running inner function`);
    const r = await fn(browser);
    logger.log(`Returning value`);
    return r;
  } catch (error) {
    logger.error(error);
    throw error;
  } finally {
    logger.log(`Closing browser`);
    await browser.close();
    logger.log(`Browser closed`);
  }
};
