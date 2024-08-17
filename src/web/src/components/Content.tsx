import ContentToolbar from './ContentToolbar'

type ContentProps = {
  imageUrls: string[];
}

export default function Content({ imageUrls }: ContentProps) {
  const mockImageUrls = [imageUrls[0], imageUrls[0], imageUrls[0], imageUrls[0]]

  return (
    <div className='flex size-full flex-col items-center justify-start'>
      {/* Below needed for 'sticky' to remain */}
      <div className='w-full'>
        <ContentToolbar />
        <div className='flex w-full flex-col gap-12 border-r border-r-stone-300 bg-gray-100 p-12'>
          {mockImageUrls.map((url, index) => {
            const pageNumber = index + 1 // Pages are 1-indexed

            return (
              <div
                className='flex w-full flex-col gap-16'
                id={`tbx-scanned-doc-page-${pageNumber}'`}
              // eslint-disable-next-line react/no-array-index-key
                key={index}
              >
                <img
                  alt={`Page ${pageNumber}`}
                  className='h-auto w-full shadow-xl'
                  src={url}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
