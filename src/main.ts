import { emitKeypressEvents } from "readline";

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { getConfigFromEnv } from "./lib/Config";
import { createConsoleLogger } from "./lib/Logger";
import { useBrowser } from "./lib/Browser";
import { findDevice } from "./lib/Device";

const main = async (): Promise<void> => {
  puppeteer.use(StealthPlugin());

  const argv = await Promise.resolve(
    yargs(hideBin(process.argv)).option(`inline`, {
      alias: `i`,
      type: `string`,
      description: `Find device with this shortcut inline (non-interactive)`,
    }).argv,
  );

  const config = await getConfigFromEnv();

  const logger = createConsoleLogger();

  if (argv.inline) {
    const device = config.devices.find(
      (device) => device.shortcut === argv.inline,
    );
    if (!device) {
      logger.error(`Device not found: ${argv.inline}`);
      throw new Error(`Device not found: ${argv.inline}`);
    } else {
      await useBrowser(config.browser, puppeteer, logger, (browser) =>
        findDevice(device, browser, logger),
      );
    }
  } else {
    try {
      emitKeypressEvents(process.stdin);

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
      }

      process.stdin.on(`keypress`, (key: string) => {
        if (key === `\x03`) {
          process.exit(0);
        }
      });

      for (const device of config.devices) {
        process.stdin.on(`keypress`, async (key: string) => {
          if (key === device.shortcut) {
            await useBrowser(config.browser, puppeteer, logger, (browser) =>
              findDevice(device, browser, logger),
            );
          }
        });
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
};

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
} else {
  console.error(`This should be the main module.`);
  process.exit(1);
}
