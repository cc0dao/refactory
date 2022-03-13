import axios from "axios";

const cloudURL = "https://digitalax.mypinata.cloud";

const pinataOptions = {
  pinata_api_key: process.env.PINATA_API_KEY,
  pinata_secret_api_key: process.env.PINATA_API_SECRET_KEY,
};

export const uploadFile = async (file) => {
  try {
    if (file) {
      let sourceFormData = new FormData();
      sourceFormData.append("file", file);

      const sourceImage = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        sourceFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...pinataOptions,
          },
        }
      );

      return `${cloudURL}/ipfs/${sourceImage.data.IpfsHash}`;
    }

    return null;
  } catch (error) {
    console.log("error --> ", error);
    return null;
  }
};

export const uploadSource = async (sourceFile) => {
  try {
    let sourceFormData = new FormData();
    sourceFormData.append("file", sourceFile);

    let sourceImage = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      sourceFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          ...pinataOptions,
        },
      }
    );

    return sourceImage;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const uploadRender = async (renderFile) => {
  try {
    let formData = new FormData();
    formData.append("file", renderFile);

    const image = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          ...pinataOptions,
        },
      }
    );

    return image;
  } catch (e) {
    throw e;
  }
};

export const upload = async (metaJson, renderFile, sourceFile = null) => {
  try {
    const result = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataMetadata: {
          name: "metadata.json",
        },
        pinataContent: {
          ...metaJson,
          [renderFile.key]: renderFile
            ? `${cloudURL}/ipfs/${renderFile.IpfsHash}`
            : null,
          source_url: sourceFile
            ? `${cloudURL}/ipfs/${sourceFile.IpfsHash}`
            : null,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...pinataOptions,
        },
      }
    );

    return `${cloudURL}/ipfs/${result.data.IpfsHash}`;
  } catch (error) {
    console.log("error --> ", error);
    return null;
  }
};
