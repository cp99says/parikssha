import React, { useEffect, useState } from "react";
import styles from "./Prepare.module.scss";
import { useDropzone } from "react-dropzone";
import Button from "components/shared/Button";
import { colors } from "components/shared/colors";
import { postRequest } from "utils/requests";
import axios from "axios";
import Preloader from "components/shared/Preloader";

export default function Prepare() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [fileUrl, setFileUrl] = useState(null);
  const [keytopics, setKeytopics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function uploadImage() {
    setIsLoading(true);
    const data = new FormData();
    data.append("file", acceptedFiles[0]);
    axios
      .post("https://api.cp99says.in/upload/file", data)
      .then((resp) => {
        console.log(resp);
        setFileUrl(resp.data.file_url);

        const payload = {
          blob_url: resp.data.file_url,
          blob_type: "string",
        };
        postRequest("/api/students/keytopics", payload)
          .then((resp) => {
            console.log(resp);
            setKeytopics(resp.data);
          })
          .catch((err) => console.log(err))
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (fileUrl) {
        }
      });
  }

  useEffect(() => {
    console.log(acceptedFiles);
  }, [acceptedFiles]);

  return isLoading ? (
    <Preloader />
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.uploader}>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop a file here, or click to select a file</p>
        </div>
      </div>
      <div className={styles.selectedFiles}>
        {acceptedFiles.map((file) => (
          <p>{file.name}</p>
        ))}
      </div>
      <div className={styles.controller}>
        <Button
          onClick={uploadImage}
          name="Upload"
          width="150px"
          backgroundColor={colors.PRIMARY}
        />
      </div>
      {keytopics && (
        <div className={styles.keytopics}>
          <p className={styles.heading}>Important Topics :</p>
          {Object.entries(keytopics).map((item) => (
            <div className={styles.topic}>
              <p>{item[0]}</p>
              <div className={styles.data}>
                {item[1].map((data) => (
                  <p>{data}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
