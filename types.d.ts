type audio = {
  duration: number;
  file_name: string;
  mime_type: string;
  file_id: string;
  file_unique_id: string;
  file_size: number;
};

type animation = {
  file_name: string;
  mime_type: string;
  duration: number;
  width: number;
  height: number;
  file_id: string;
  file_unique_id: string;
  file_size: number;
};

type photo = {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
};

type video = {
  duration: number;
  width: number;
  height: number;
  file_name: string;
  mime_type: string;
  thumbnail: photo;
  thumb: photo;
  file_id: string;
  file_unique_id: string;
  file_size: number;
};

type MessageObject = {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
  };
  chat: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    type: string;
  };
  date: number;
  text?: string;
  photo?: photo[];
  animation?: animation;
  audio?: audio;
  video?: video;
  caption?: string;
  reply_to_message?: MessageObject;
};

export { MessageObject, photo, animation, audio, video };
