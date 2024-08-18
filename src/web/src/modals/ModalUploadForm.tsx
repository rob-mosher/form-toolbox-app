import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { toast, Id as ToastId } from 'react-toastify'
import Button from '../components/Button'
import Heading from '../components/Heading'
// import type { Form } from '../types'

type ModalDeleteFormProps = {
  hideModal: () => void,
}

export default function ModalUploadForm({
  hideModal,
}: ModalDeleteFormProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const toastRef = useRef<ToastId | null>(null)
  const [acceptedMimeTypes, setAcceptedMimeTypes] = useState<string[] | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  // const [imageFile, setImageFile] = useState(null)

  // setAcceptedMimeTypes
  useEffect(() => {
    const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms/accepted-mime-types`
    axios.get<string[]>(url)
      .then((resp) => {
        setAcceptedMimeTypes(resp.data)
      })
      .catch((error) => {
        toast.error('Error: Unable to load supported file types, so uploading is temporarily disabled. Try this page again in a bit.', {
          autoClose: 8000,
        })
        // eslint-disable-next-line no-console
        console.error('Error fetching MIME types:', error)
      })
  }, [])

  function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsUploading(true)
    toastRef.current = toast('Upload in progress...', {
      // autoClose: false,
      progress: 0,
      type: 'info',
    })

    const filePointer = fileRef?.current?.files?.[0]

    // eslint-disable-next-line no-use-before-define
    validateFilePromise(filePointer)
      .then((formData) => {
        const url = `//${import.meta.env.VITE_API_HOST || '127.0.0.1'}:${import.meta.env.VITE_API_PORT || 3000}/api/forms`

        return axios.request(
          {
            data: formData,
            method: 'POST',
            onUploadProgress: (prog) => {
              const progress = prog.loaded / prog.total!
              toast.update(toastRef.current!, { progress })
            },
            url,
          },
        )
      })
      .then(() => {
        toast.update(toastRef.current!, {
          autoClose: 5000,
          render: 'Upload complete!',
          type: 'success',
        })
        if (fileRef.current) fileRef.current.value = ''

        // Close the modal if the upload completes (keeping open on error)
        hideModal()
      })
      .catch((error) => {
        toast.update(toastRef.current!, {
          autoClose: 5000,
          render: `Upload unsuccessful: ${error.message}`,
          type: 'error',
        })
      })
      .finally(() => {
        setIsUploading(false)
        toastRef.current = null
      })

    function validateFilePromise(file: File | undefined) {
      return new Promise((resolve, reject) => {
        if (!file) {
          reject(new Error('No file provided.'))
          return
        }

        if (!acceptedMimeTypes?.includes(file.type)) {
          reject(new Error('Invalid file type.'))
          return
        }

        const formData = new FormData()
        formData.append('user-upload', file)
        resolve(formData)
      })
    }
  }

  return (

    <form onSubmit={(e) => handleUpload(e)}>
      <section className='flex flex-col items-center justify-center gap-6'>
        <Heading as='h2'>Upload New Form</Heading>
        <input
          accept={acceptedMimeTypes?.join(', ')}
          className='w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-6 text-sm text-gray-900 focus:outline-none'
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

        <Button
          ariaLabel='Upload file'
          disabled={acceptedMimeTypes === null || isUploading}
          id='upload-button'
          type='submit'
          primary
        >
          Upload
        </Button>
        <button
          type='button'
          onClick={() => hideModal()}
        >
          close
        </button>
        {/* {imageFile?.type?.includes('image') && (
          <>
            <br />
            <img src={URL.createObjectURL(imageFile)} alt='' />
          </>
        )} */}
      </section>
    </form>

  )
}
