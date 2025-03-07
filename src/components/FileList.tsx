import { Download, LoaderCircle, CircleAlert } from "lucide-react";
import { InlineCode } from "./Code";

export type FileWithStatus = { file: File } & (
  | { status: "PENDING" }
  | { status: "CONVERTING" }
  | { status: "FAILED" }
  | { status: "CONVERTED"; downloadUrl: string }
);

interface FileListProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  filesWithStatus: FileWithStatus[];
}

export function FileList({ filesWithStatus: files }: FileListProps) {
  if (files.length <= 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-800 shadow">
      <div className="flex items-center justify-between border-b-2 border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Converted Files</h2>
        <div className="space-x-2">
          {/* <button
            onClick={() => alert("To be implemented")}
            className="flex cursor-pointer gap-2 rounded-lg border-2 border-gray-600 px-3 py-2 hover:bg-gray-700 hover:text-white"
          >
            <Download />
            Download All
          </button> */}
        </div>
      </div>
      <div>
        <ul className="divide-y divide-gray-200">
          {files.length <= 0 && (
            <li className="bg-white px-4 py-8 text-center text-sm text-gray-400">No files added yet</li>
          )}
          {files.map((f, i) => (
            <li key={i} className="bg-white px-4 py-6 hover:bg-gray-100">
              <div className="flex items-center space-x-4">
                <div className="grow">
                  <p>
                    <InlineCode className="text-base">{outputFilename(f.file.name)}</InlineCode>
                  </p>
                  <p className="text-xs text-gray-400">
                    Original: <InlineCode>{f.file.name}</InlineCode>
                  </p>
                </div>
                {f.status === "PENDING" && (
                  <span className="flex cursor-progress gap-2 text-gray-400">
                    <LoaderCircle /> Pending
                  </span>
                )}
                {f.status === "CONVERTING" && (
                  <span className="flex cursor-progress gap-2 text-gray-400">
                    <LoaderCircle className="animate-spin" /> Converting
                  </span>
                )}
                {f.status === "CONVERTED" && (
                  <a
                    className="flex cursor-pointer gap-2 rounded-lg border-2 border-gray-300 px-3 py-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                    href={f.downloadUrl}
                    download={outputFilename(f.file.name)}
                  >
                    <Download /> Download
                  </a>
                )}
                {f.status === "FAILED" && (
                  <span className="flex gap-2 text-red-500">
                    <CircleAlert className="" /> Failed
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function outputFilename(inputFilename: string) {
  return `${inputFilename.split(".")[0]}-converted.mp4`;
}
