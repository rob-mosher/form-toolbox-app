import { useRef, useState } from 'react'
import {
  Button, Header, Input, Segment
} from 'semantic-ui-react'
import { toast } from 'react-toastify'
import ACCEPTED_UPLOAD_MIME_TYPES from '../common/acceptedUploadMimeTypes'

export default function UploadForm() {
  const fileRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  // const [imageFile, setImageFile] = useState(null)

  function handleUpload(e) {
    e.preventDefault()

    setIsUploading(true)
    const filePointer = fileRef?.current?.files?.[0]

    // eslint-disable-next-line no-use-before-define
    validateFilePromise(filePointer)
      .then((formData) => {
        toast.info('Uploading file.')

        const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/upload`
        return fetch(
          url,
          {
            body: formData,
            method: 'POST',
          }
        )
      })
      .then((fetchResult) => {
        if (!fetchResult) throw new Error('Server did not provide a response.')
        if (fetchResult.ok) return fetchResult.text()
        throw new Error(`${fetchResult.status} ${fetchResult.statusText}`)
      })
      .then(() => {
        fileRef.current.value = null
        toast.success('Upload complete!')
      })
      .catch((error) => {
        toast.error(`Upload unsuccessful: ${error.message}`)
      })
      .finally(() => {
        setIsUploading(false)
      })

    function validateFilePromise(file) {
      return new Promise((resolve, reject) => {
        if (!file) {
          reject(new Error('No file provided.'))
        }

        if (!ACCEPTED_UPLOAD_MIME_TYPES.includes(file.type)) {
          reject(new Error('Invalid file type.'))
        }

        const formData = new FormData()
        formData.append('user-upload', file)
        resolve(formData)
      })
    }
  }

  return (
    <form onSubmit={(e) => handleUpload(e)}>
      <Segment placeholder>
        <Header as='h2' icon>Upload</Header>
        <Input type='file'>
          <input
            accept={ACCEPTED_UPLOAD_MIME_TYPES.join(', ')}
            id='upload-picker'
            // multiple
            name='user-upload'
            // onInput={(event) => {
            //   event.preventDefault()
            //   if (fileRef?.current?.files?.[0]?.type?.includes('image')) {
            //     setImageFile(() => fileRef?.current?.files?.[0])
            //   } else {
            //     setImageFile(() => null)
            //   }
            // }}
            ref={fileRef}
            type='file'
          />
        </Input>
        <br />
        <Button
          className={isUploading ? 'disabled' : ''}
          id='upload-button'
          type='submit'
          primary
        >
          Upload
        </Button>
        {/* <Button secondary>Cancel</Button> */}
        {/* {imageFile?.type?.includes('image') && (
          <>
            <br />
            <img src={URL.createObjectURL(imageFile)} alt='' />
          </>
        )} */}
      </Segment>
    </form>
  )
}
