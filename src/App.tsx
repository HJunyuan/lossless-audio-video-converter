import { useState, useRef, useEffect } from "react";
import { LoaderCircle } from "lucide-react";

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

  return (
    <>
      <div className="container my-10 grow space-y-10">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Lossless Audio to Video Converter</h1>
          <p className="text-gray-400">Convert your audio files to video using FFmpeg</p>
        </header>

        {!isLoaded && (
          <section className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-10 text-center">
            <div className="space-y-2 text-gray-800">
              <LoaderCircle className="inline animate-spin" />
              <p className="font-medium">Loading FFmpeg...</p>
              <p className="text-sm text-gray-400">
                This may take a moment. Please ensure JavaScript is enabled in your browser.
              </p>
            </div>
          </section>
        )}

        {isLoaded && (
          <section>
            <FileDropzone
              onFilesAdded={(files) => {
                setInputFilesWithStatus(files.map((file) => ({ file, status: "PENDING" })));
              }}
            />
            <FileList filesWithStatus={inputFilesWithStatus} />
          </section>
        )}
      </div>

      <Footer />
    </>
  );
}

export default App;
