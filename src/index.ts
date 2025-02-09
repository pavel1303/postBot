import { MediaGroup } from "@dietime/telegraf-media-group";
import { Context, Telegraf } from "telegraf";
import dotenv from "dotenv";
import {
  photo_media_group,
  PhotoMediaGroupContext,
} from "@dietime/telegraf-media-group";
import { getPhotosUrlsFromUpdate } from "./helpers/getPhotosFromPost";
import { geminiFlashRequest } from "./gpt-api/geminiRequests";
import { createPromtForReportMeal } from "./prompt-generate/createPromptForReportMeal";
import { createMeal } from "./database/createMeal";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.use(new MediaGroup({ timeout: 1000 }).middleware());

bot.on(photo_media_group(), async (ctx: PhotoMediaGroupContext<Context>) => {
  const photoData = await getPhotosUrlsFromUpdate(ctx);

  const modelResponse = await geminiFlashRequest(
    createPromtForReportMeal(photoData.urls)
  );

  if (modelResponse) {
    createMeal({
      photoIds: photoData.ids,
      description: modelResponse,
      date: new Date().toISOString().split("T")[0],
    });
    await ctx.reply(
      `Все отлично, получилась такоя вот красота:\n${modelResponse}`
    );
  } else {
    await ctx.reply(`Пу пу пууууу.... Что то не зашло :(`);
  }
});

bot.launch().then(() => console.log("Started"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
