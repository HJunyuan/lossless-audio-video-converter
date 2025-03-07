import React, { JSX, useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { InlineCode } from "./Code";

const MAX_INPUT_FILES = 10;
const MAX_FILE_SIZE_IN_BYTES = 50 * 1024 * 1024; // 50 MiB

interface FileDropzoneProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  onFilesAdded: (files: File[]) => void;
  isDisabled?: boolean;
}

export function FileDropzone({ onFilesAdded, isDisabled = false, className, ...rest }: FileDropzoneProps) {
  const [errors, setErrors] = useState<JSX.Element[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setErrors([]);
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded],
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const errors: JSX.Element[] = [];
    fileRejections.forEach((rejection) => {
      if (rejection.errors.some((e) => e.code === "file-too-large")) {
        errors.push(
          <li>
            Input file <InlineCode>{rejection.file.name}</InlineCode> has been rejected as it exceeds the{" "}
            {MAX_FILE_SIZE_IN_BYTES / 1024 / 1024} MiB limit.
          </li>,
        );
      }
      if (rejection.errors.some((e) => e.code === "too-many-files")) {
        errors.push(
          <li className="list-disc">
            Too many files: Input file <InlineCode>{rejection.file.name}</InlineCode> rejected
          </li>,
        );
      }

      setErrors(errors);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
    },
    maxFiles: MAX_INPUT_FILES,
    maxSize: MAX_FILE_SIZE_IN_BYTES,
    disabled: isDisabled,
  });

  return (
    <div
      {...getRootProps()}
      className={twMerge(
        "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500",
        isDisabled && "cursor-not-allowed opacity-50",
        className,
      )}
      {...rest}
    >
      <input {...getInputProps()} />

      <div className="space-y-8">
        <div className="inline-block rounded-full bg-blue-100 p-3">
          <Upload className="h-8 w-8 text-blue-500" />
        </div>

        <div>
          <p className="text-lg font-medium text-gray-800">
            {isDragActive ? "Drop the files here" : "Drag & drop audio files here"}
          </p>
          <p className="mt-1 text-sm text-gray-500">or click anywhere to browse files</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-400">
            Accepted input file formats: <InlineCode>.wav</InlineCode>, <InlineCode>.mp3</InlineCode>
          </p>

          <p className="text-xs text-gray-400">
            Upload a maximum of <b>{MAX_INPUT_FILES}</b> files, each up to{" "}
            <b>{MAX_FILE_SIZE_IN_BYTES / 1024 / 1024} MiB</b>
          </p>
        </div>

        {errors.length > 1 && <ul className="text-left text-red-500">{errors}</ul>}
      </div>
    </div>
  );
}
