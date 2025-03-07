import { useState, useRef, useEffect } from "react";

import { useFfmpeg } from "./hooks/useFfmpeg";
import { FileDropzone } from "./components/Dropzone";
import { FileList, FileWithStatus } from "./components/FileList";
import Footer from "./components/Footer";

function App() {
  const { isLoaded, convertToMp4 } = useFfmpeg();
  const [inputFilesWithStatus, setInputFilesWithStatus] = useState<FileWithStatus[]>([]);
  const ongoingPromisesRef = useRef(Promise.resolve());

  useEffect(() => {
    inputFilesWithStatus.forEach((f, i) => {
      if (f.status !== "PENDING") return;

      ongoingPromisesRef.current = ongoingPromisesRef.current.then(async () => {
        try {
          console.log(`Converting ${f.file.name}`);
          setInputFilesWithStatus((prev) => {
            const modified = [...prev];
            modified[i] = { ...prev[i], status: "CONVERTING" };
            return modified;
          });
          const url = await convertToMp4(f.file);
          setInputFilesWithStatus((prev) => {
            const modified = [...prev];
            modified[i] = { ...prev[i], status: "CONVERTED", downloadUrl: url! };
            return modified;
          });
        } catch (e) {
          setInputFilesWithStatus((prev) => {
            const modified = [...prev];
            modified[i] = { ...prev[i], status: "FAILED" };
            return modified;
          });
          console.error(`Unable to convert ${f.file.name}:`, e);
        }
      });
    });
  }, [inputFilesWithStatus]);

  if (!isLoaded) {
    return (
      <div className="container mx-auto flex h-svh items-center justify-center text-gray-800">
        Please wait while ffmpeg.wasm is loading...
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto my-10 grow space-y-10">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Lossless Audio to Video Converter</h1>
          <p className="text-gray-400">Convert your audio files to video using FFmpeg</p>
        </header>

        <section>
          <FileDropzone
            onFilesAdded={(files) => {
              setInputFilesWithStatus(files.map((file) => ({ file, status: "PENDING" })));
            }}
          />
        </section>

        <section>
          <FileList filesWithStatus={inputFilesWithStatus} />
        </section>
      </div>

      <Footer />
    </>
  );
}

export default App;
