import { promises } from "fs";
import { resolve } from "path";

import { load } from "js-yaml";
import { z } from "zod";

import { BrowserConfig } from "./Browser";
import { DeviceConfig } from "./Device";

const Config = z.object({
  browser: BrowserConfig,
  devices: z.array(DeviceConfig),
});

type Config = z.infer<typeof Config>;

export const getConfigFromEnv = async (): Promise<Config> => {
  const { CONFIG_FILE } = z
    .object({
      CONFIG_FILE: z.string(),
    })
    .parse(process.env);

  return Config.parse(
    load(
      await promises.readFile(resolve(process.cwd(), CONFIG_FILE), {
        encoding: `utf-8`,
      }),
    ),
  );
};
