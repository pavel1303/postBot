import { MediaGroup } from "@dietime/telegraf-media-group";
import { Context, Telegraf } from "telegraf";
import dotenv from "dotenv";
import {
  photo_media_group,
  PhotoMediaGroupContext,
} from "@dietime/telegraf-media-group";
import { getPhotosUrlsFromUpdate } from "./helpers/getPhotosFromPost";
import { geminiFlashRequest } from "./gpt-api/geminiImageRequest";
import { createPromtForReportMeal } from "./prompt-generate/createPromptForReportMeal";
import { createMeal } from "./database/createMeal";
import { getMealsMedia } from "./helpers/getMealsMedia";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.use((ctx, next) => {
  if (ctx?.from?.id === Number(process.env.ALLOWED_USER_ID)) {
    next();
  } else {
    ctx.reply("Вы кто такие? Я вас не звал! Уходите!!!");
  }
});

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
    await ctx.reply(`Все отлично, отчет создан и записан в БД`);
  } else {
    await ctx.reply(`Пу пу пууууу.... Что то не зашло :(`);
  }
});

bot.command("create_post", async (ctx: Context) => {
  const { description, photos } = await getMealsMedia();
  try {
    if (description && photos.length) {
      await bot.telegram.sendMessage(
        process.env.CHANNEL_ID as string,
        description
      );
      await bot.telegram.sendMediaGroup(
        process.env.CHANNEL_ID as string,
        photos
      );
      ctx.reply(`Отчет успешно опубликован`);
    } else {
      throw Error("Нет описания или изображений");
    }
  } catch (e) {
    await ctx.reply(`Хъюстон, у нас проблема: ${(e as Error)?.message || ""}`);
  }
});

bot.launch().then(() => console.log("Started"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
