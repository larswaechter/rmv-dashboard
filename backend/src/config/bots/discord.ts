import { Client, GatewayIntentBits } from "discord.js";

import { getSettingValue, Settings } from "../settings";

export const getDiscordBot = async (
  cb: (err: Error, client: Client) => void
) => {
  const key = await getSettingValue(Settings.DISCORD_KEY);

  if (!key) {
    return undefined;
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.on("ready", () => {
    cb(null, client);
  });

  client.on("error", (err) => {
    cb(err, null);
  });

  //make sure this line is the last line
  client.login(key); //login bot using token
};
