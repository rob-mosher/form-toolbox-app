import { useEffect, useRef, useState } from 'react'
import {
  Button, Header, Input, Segment
} from 'semantic-ui-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import ACCEPTED_UPLOAD_MIME_TYPES from '../common/acceptedUploadMimeTypes'

export default function UploadForm() {
  const fileRef = useRef(null)
  const toastRef = useRef(null)
  const [acceptedMimeTypes, setAcceptedMimeTypes] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  // const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/upload/acceptedMimeTypes`
    axios.get(url)
      .then((resp) => {
        setAcceptedMimeTypes(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load supported file types, so uploading is temporarily disabled. Try this page again in a bit.', {
          autoClose: 8000,
        })
        console.error('Error fetching MIME types:', error)
      })
  }, [])

  function handleUpload(e) {
    e.preventDefault()

    setIsUploading(true)
    toastRef.current = toast('Upload in progress...', {
      // autoClose: false,
      progress: 0,
      type: toast.TYPE.INFO,
    })

    const filePointer = fileRef?.current?.files?.[0]

    // eslint-disable-next-line no-use-before-define
    validateFilePromise(filePointer)
      .then((formData) => {
        const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/upload`

        return axios.request(
          {
            data: formData,
            method: 'POST',
            onUploadProgress: (prog) => {
              const progress = prog.loaded / prog.total
              toast.update(toastRef.current, { progress })
            },
            url,
          }
        )
      })
      .then(() => {
        toast.update(toastRef.current, {
          autoClose: 5000,
          render: 'Upload complete!',
          type: toast.TYPE.SUCCESS,
        })
        if (fileRef.current) fileRef.current.value = null
      })
      .catch((error) => {
        toast.update(toastRef.current, {
          autoClose: 5000,
          render: `Upload unsuccessful: ${error.message}`,
          type: toast.TYPE.ERROR,
        })
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
            accept={acceptedMimeTypes?.join(', ')}
            disabled={acceptedMimeTypes === null || isUploading}
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
          disabled={acceptedMimeTypes === null || isUploading}
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
