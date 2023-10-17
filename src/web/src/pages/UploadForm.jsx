import React, { useRef, useState } from 'react';
import { Button, Header, Input } from 'semantic-ui-react';

export default function UploadForm() {
  const fileRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  return (
    <>
      <Header as="h2">Upload</Header>
      <Input type="file">
        <input
          accept=".jpg, .jpeg, .png, .pdf"
          id="uploadpicker"
          // multiple
          name="user-upload"
          onInput={(event) => {
            event.preventDefault();
            if (fileRef?.current?.files?.[0]?.type?.includes('image')) {
              setImageFile(() => fileRef?.current?.files?.[0]);
            } else {
              setImageFile(() => null);
            }
          }}
          ref={fileRef}
          type="file"
        />
      </Input>
      <br />
      <Button
        onClick={() => {
          console.table(import.meta.env);
          Promise.resolve()
            .then(() => {
              if (!fileRef?.current?.files?.[0]) throw new Error('No file selected');
              if (
                !['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'].includes(
                  fileRef?.current?.files?.[0]?.type || ''
                )
              )
                throw new Error('Invalid file type');
              const formData = new FormData();
              formData.append('user-upload', fileRef.current.files[0]);
              return formData;
            })
            .then((formData) =>
              fetch(`//localhost:${import.meta.env.VITE_API_PORT || 3000}/api/upload`, {
                body: formData,
                method: 'POST',
              })
            )
            .then((fetchResult) => {
              if (!fetchResult) throw new Error('Server did not provide a response');
              if (!fetchResult.ok) throw new Error(`${fetchResult.status} ${fetchResult.statusText}`);
              if (fetchResult.status === 201) return fetchResult.text();
              throw new Error('Unknown error occured');
            })
            .then((textResult) => {
              // TODO update web application state
              console.log(textResult);
            })
            .catch((error) => {
              // error handling
              console.error(error); // TODO May want to replace with ErrorBoundary
            });
        }}
        primary
      >
        Upload
      </Button>
      <Button secondary>Cancel</Button>
      {imageFile?.type?.includes('image') && (
        <>
          <br />
          <img src={URL.createObjectURL(imageFile)} alt="" />
        </>
      )}
    </>
  );
}
