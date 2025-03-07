const Footer = () => {
  return (
    <footer className="flex flex-col items-center space-y-2 bg-gray-100 py-8 text-sm text-gray-700">
      <p>
        This tool uses{" "}
        <a
          href="https://github.com/ffmpegwasm/ffmpeg.wasm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          ffmpeg.wasm
        </a>
      </p>

      <a
        href="https://github.com/HJunyuan/lossless-audio-video-converter"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500"
      >
        @HJunyuan
      </a>
    </footer>
  );
};

export default Footer;
