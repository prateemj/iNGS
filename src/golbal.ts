import { environment } from "./environments/environment";

export class Global {
    public static BASE_PATH = environment.baseUrl;

    //Subtitles API
    public static GET_SUBTITLE_FROM_URL = this.BASE_PATH+'/api/extractSubtitlesFromURL'
}