import React from "react";
import styles from "./styles.module.scss";

const FileUpload = ({ source, render, setSource, setRender }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sourceUpload}>
        <input
          type="file"
          onChange={(e) => {
            console.log(e.target.files[0]);
            setSource(e.target.files[0]);
          }}
          id="image-upload"
          accept=".zip"
          hidden
        />
        <label htmlFor="image-upload"> Upload Source File </label>
        {source && <h1 className={styles.fileName}>{source.name}</h1>}
      </div>
      <div className={styles.renderUpload}>
        <input
          type="file"
          onChange={(e) => {
            setRender(e.target.files[0]);
          }}
          accept="image/png, image/jpeg, "
          id="render-upload"
          hidden
        />
        <label htmlFor="render-upload"> Upload Render File </label>
        {render && <h1 className={styles.fileName}>{render.name}</h1>}
      </div>
    </div>
  );
};

export default FileUpload;
