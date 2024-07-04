"use client";
import React, { useEffect, useState } from "react";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { useForm } from "react-hook-form";
import { FilePondFile } from "filepond";

import Cookies from "js-cookie";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
// Import the plugin styles
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css";
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFilePoster
);

export default function Page() {
  const [files, setFiles] = useState<FilePondFile[]>([]);
  const [response, setResponse] = useState({ img_src: "" });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      image: "",
    },
    mode: "onChange",
    shouldUnregister: true,
  });

  const handleFormSubmit = async () => {
    setResponse({ img_src: "" });

    if (files.length > 0) {
      console.log(files[0].file);
    }

    const formData = new FormData();
    formData.append("image", files[0].file);

    const sendImage = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/face/restore`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-CSRFTOKEN": Cookies.get("csrftoken")!,
        },
        body: formData,
      }
    );

    const res = await sendImage.json();
    setResponse(res);
  };

  const downloadImage = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${response.img_src}`;
    const imgDownload = await fetch(url);
    const resBlob = await imgDownload.blob();
    const blobUrl = window.URL.createObjectURL(resBlob);

    const a = document.createElement("a");
    a.download = url.replace(/^.*[\\\/]/, "");
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <title>Restore face photo</title>
      <meta name="description" content={'Restore any face photo'} />

      <main className="mt-16 max-w-5xl mx-auto">
        <div className="text-center">
          <p className="font-bold text-2xl">Restore Face Photo</p>
        </div>

        <div>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-3">
            <div
              className={`flex ${
                response.img_src
                  ? "flex-col md:flex-row justify-center items-center md:items-start gap-5"
                  : "flex-col justify-center items-center"
              } `}
            >
              <div className={"w-5/6 md:w-1/2"}>
                <div className="mt-3 border-dashed border-2 border-[#dddddd] rounded h-[300px] content-center">
                  <FilePond
                    files={files.map((file) => file.source)}
                    onupdatefiles={(newFiles) => {
                      setFiles(newFiles as FilePondFile[]);
                      setResponse({ img_src: "" });
                    }}
                    allowMultiple={false}
                    allowImagePreview={true}
                    imagePreviewHeight={250}
                    acceptedFileTypes={["image/png", "image/jpg", "image/jpeg"]}
                  />
                </div>
                <div className="mt-3 mb-3 text-right">
                  {isSubmitting ? (
                    <button
                      disabled
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Loading...
                    </button>
                  ) : (
                    !response.img_src && (
                      <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        Restore
                      </button>
                    )
                  )}
                </div>
              </div>

              <div
                className={`${
                  response.img_src ? "block w-5/6 md:w-1/2" : "hidden"
                } `}
              >
                <div className="mt-3 border-dashed border-2 border-[#dddddd] rounded h-[300px] content-center">
                  <FilePond
                    files={[
                      {
                        source:
                          response.img_src &&
                          `${process.env.NEXT_PUBLIC_API_URL}${response.img_src}`,

                        options: {
                          type: "local",

                          file: {
                            name: "front_face.jpg",
                            size: 1001025,
                          },

                          metadata: {
                            poster:
                              response.img_src &&
                              `${process.env.NEXT_PUBLIC_API_URL}${response.img_src}`,
                          },
                        },
                      },
                    ]}
                    allowFilePoster={true}
                    allowMultiple={false}
                    filePosterMaxHeight={250}
                    acceptedFileTypes={["image/png", "image/jpg", "image/jpeg"]}
                  />
                </div>

                <div className="mt-3 mb-3 text-right">
                  <button
                    type="button"
                    onClick={downloadImage}
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        {isSubmitting ? (
          <div className="mb-10">
            <p className="text-center font-bold">
              Please wait about 20 seconds ...
            </p>
          </div>
        ) : (
          ""
        )}
      </main>
    </>
  );
}
