import React, { useState } from "react";
import axios from "axios";
import ProgressFileUpload from "./../ProgressFileUpload";

const UploadDocumentsContainer = () => {
  const [selectedFile, setSelectedFile] = useState("Choose File");
  const [displayFile, setDisplayFile] = useState([]);
  const [file, setFile] = useState([]);
  const [uploadPercentage, setUploadPercentage] = useState(0);


  const onChangeFile = event => {
    console.log("event.target.files", event.target.files[0]);

    for (let i = 0; i < event.target.files.length; i++) {
      let _ = event.target.files[i];
      setFile(file => [...file, _]);
    }
    event.target.files.length > 1
      ? setSelectedFile(`${event.target.files.length} Files`)
      : setSelectedFile(event.target.files[0].name);
  };

  const onUpload = async e => {
    e.preventDefault();
    console.log("file", file);
    console.log("selectedFile", selectedFile);
    const formData = new FormData();
    file.forEach(_ => {
      console.log("_", _);
      formData.append("file", _);
    });
    console.log("FORMDATA INSIDE UploadDocumentsContainer", formData);

    try {
      const response = await axios.post(
        "http://localhost:9001/client/public/uploads",
        formData,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "multipart/form-data"
          },
          onUploadProgress: progressEvent => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );

            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 10000);
          }
        }
      );

      let { fileName, filePath } = response.data;
      console.log("response.data", response.data);
      fileName = fileName.split(",");
      filePath = filePath.split(",");
      console.log("fileName", fileName);
      console.log("filePath", filePath);

      setDisplayFile(displayFile => [...displayFile, ...fileName]);
      console.log(
        "displayFile from the server",
        displayFile,
        ":",
        displayFile.length
      );
      console.log("response back from server:-", fileName, " AND ", filePath);

      // const importAll = r => {
      //   return r.keys().map(r);
      // };

      // setImages(
      //   importAll(
      //     require.context(
      //       "./../../../../../../../public/uploads/",
      //       false,
      //       /\.(png|jpeg|svg|jpg)$/
      //     )
      //   )
      // );
    } catch (error) {
      if (error.response.status == 500) {
        console.log("There was a problem with the server");
      } else {
        console.log(error.response.data.msg);
      }
    }
  };

  const DisplayFile = () => {
    console.log("displayFile", displayFile);
    console.log("uploadPercentage", uploadPercentage);
    return (
      <div className="displayFileContainer">
        {displayFile.length > 0
          ? displayFile.map((_, idx) => {
              const myimg = require(`./../../../public/uploads/${_}`)
                .default;
              console.log("myimg", myimg);
              return (
                <div className="fileDimension" key={idx}>
                  <img src={myimg} />
                </div>
              );
            })
          : null}
      </div>
    );
  };

  return (
    <div className="formOuterWrapper">
      <div className="formInnerWrapper">
        <div className="fileUploadContainer">
          <form className="fileUploadForm " name="myForm" onSubmit={onUpload}>
            <div className="custom-file mb-5">
              <input
                type="file"
                multiple
                className="custom-file-input"
                id="customFile"
                onChange={onChangeFile}
              />
              <label className="custom-file-label" htmlFor="customFile">
                {selectedFile}
              </label>
            </div>

            <div className="progressbar">
              <ProgressFileUpload percentage={uploadPercentage} />
            </div>

            <input
              type="submit"
              value="Upload"
              className="btn btn-primary btn-block mt-5"
            />
            <DisplayFile />
          </form>
        </div>
      </div>
  
    </div>
  );
};

export default UploadDocumentsContainer;
