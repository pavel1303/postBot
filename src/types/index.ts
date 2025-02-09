export type Role = "user" | "system" | "assistant";

export type ContentType = "text" | "image_url";

export type TextContent = {
  type: ContentType;
  text: string;
};

export type ImageContent = {
  type: ContentType;
  image_url: string;
};

export type Message = {
  role: Role;
  content: Array<ImageContent | TextContent> | string;
};

export type Choices = {
  logprobs: number | null;
  finish_reason: string;
  native_finish_reason: string;
  index: number;
  message: {
    role: Role;
    content: string;
    refusal?: string | number | boolean | null;
  };
};

export type GeminiSuccessResponse = {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: Choices[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};
