import { useRef, useState } from 'react'
import {
  Button, Header, Input, Segment
} from 'semantic-ui-react'
import ACCEPTED_UPLOAD_MIME_TYPES from '../common/acceptedUploadMimeTypes'

export default function UploadForm() {
  const fileRef = useRef(null)
  const [imageFile, setImageFile] = useState(null)

  function handleUpload(e) {
    e.preventDefault()

    // eslint-disable-next-line no-use-before-define
    validateFilePromise()
      .then((formData) => fetch(
        `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/upload`,
        {
          body: formData,
          method: 'POST',
        }
      ))
      .then((fetchResult) => {
        if (!fetchResult) throw new Error('Server did not provide a response.')
        if (fetchResult.ok) return fetchResult.text()
        throw new Error(`${fetchResult.status} ${fetchResult.statusText}`)
      })
      .then((textResult) => {
        // TODO update web application state
        console.log(textResult)
      })
      .catch((error) => {
        // error handling
        console.error(error) // TODO May want to replace with ErrorBoundary
      })

    function validateFilePromise() {
      const file = fileRef?.current?.files?.[0]
      if (!file) throw new Error('No file provided.')
      if (!ACCEPTED_UPLOAD_MIME_TYPES.includes(file.type)
      ) { throw new Error('Invalid file type.') }

      const formData = new FormData()
      formData.append('user-upload', file)
      return Promise.resolve(formData)
    }
  }

  return (
    <form onSubmit={(e) => handleUpload(e)}>
      <Segment placeholder>
        <Header as='h2' icon>Upload</Header>
        <Input type='file'>
          <input
            accept={ACCEPTED_UPLOAD_MIME_TYPES.join(', ')}
            id='uploadpicker'
          // multiple
            name='user-upload'
            onInput={(event) => {
              event.preventDefault()
              if (fileRef?.current?.files?.[0]?.type?.includes('image')) {
                setImageFile(() => fileRef?.current?.files?.[0])
              } else {
                setImageFile(() => null)
              }
            }}
            ref={fileRef}
            type='file'
          />
        </Input>
        <br />
        <Button
          type='submit'
          primary
        >
          Upload
        </Button>
        {/* <Button secondary>Cancel</Button> */}
        {imageFile?.type?.includes('image') && (
          <>
            <br />
            <img src={URL.createObjectURL(imageFile)} alt='' />
          </>
        )}
      </Segment>
    </form>
  )
}
