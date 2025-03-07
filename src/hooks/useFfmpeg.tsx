import { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

const BASE_URL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm";

export function useFfmpeg() {
  const [isLoaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    // ffmpeg.on("log", ({ message }) => {
    //   console.log(message);
    // });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    setLoaded(true);
  };

  const convertToMp4 = async (file: File) => {
    const ffmpeg = ffmpegRef.current;

    try {
      // Write files to FFmpeg filesystem
      await ffmpeg.writeFile("input.wav", await fetchFile(file));

      // Convert to MP4
      // ffmpeg -i input.wav -f lavfi -i color=c=black:s=320x240 -c:a alac -c:v libx264 -preset ultrafast -crf 51 -shortest output.mp4
      const flags = `-i input.wav -f lavfi -i color=c=black:s=320x240 -c:a alac -c:v libx264 -preset ultrafast -crf 51 -shortest output.mp4`;
      await ffmpeg.exec(flags.split(" "));

      // Get the result
      const fileData = await ffmpeg.readFile("output.mp4");
      const data = new Uint8Array(fileData as ArrayBuffer);

      const blob = new Blob([data.buffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      return url;
    } catch (error) {
      console.error("Conversion error:", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { isLoaded, ffmpeg: ffmpegRef.current, convertToMp4 };
}
