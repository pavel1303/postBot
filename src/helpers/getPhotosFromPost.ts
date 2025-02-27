import { PhotoMediaGroupContext } from "@dietime/telegraf-media-group";
import { Context } from "telegraf";

export const getPhotosUrlsFromUpdate = async (
  ctx: PhotoMediaGroupContext<Context>
) => {
  const photoUrls: string[] = [];
  const photoIds: string[] = [];

  const photoMsgs = ctx.update.media_group;

  for (const msg of photoMsgs) {
    const largestPhoto = msg.photo[msg.photo.length - 1];
    const fileId = largestPhoto.file_id;
    const fileInfo = await ctx.telegram.getFile(fileId);
    const filePath = fileInfo.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`;
    photoUrls.push(fileUrl);
    photoIds.push(fileId);
  }

  return {
    ids: photoIds,
    urls: photoUrls,
  };
};
