import { BoundingBox as TBoundingBox } from '@aws-sdk/client-textract'
import { useRef, useEffect } from 'react'
import ContentToolbar from './ContentToolbar'
import { userFormHighlightColors } from '../lib'
import { TUserPrefs } from '../types'

type ContentProps = {
  imageUrls: string[];
  focusedBoundingBox?: TBoundingBox[];
  userFormHighlightKey: TUserPrefs['form']['highlightKey'];
};

export default function Content({
  imageUrls,
  focusedBoundingBox = [],
  userFormHighlightKey,
}: ContentProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const getPixelCoordinates = (
    boundingBox: TBoundingBox,
    imageWidth: number,
    imageHeight: number,
    padding: number = 0,
  ) => {
    const left = boundingBox.Left !== undefined ? boundingBox.Left : 0
    const top = boundingBox.Top !== undefined ? boundingBox.Top : 0
    const width = boundingBox.Width !== undefined ? boundingBox.Width : 0
    const height = boundingBox.Height !== undefined ? boundingBox.Height : 0

    return {
      x: left * imageWidth - padding,
      y: top * imageHeight - padding,
      width: width * imageWidth + 2 * padding,
      height: height * imageHeight + 2 * padding,
    }
  }

  useEffect(() => {
    if (imageRef.current && svgRef.current && focusedBoundingBox.length > 0) {
      const { width: imageWidth, height: imageHeight } = imageRef.current
      const svg = svgRef.current
      const rectPadding = 6

      // Clear any previous rectangles
      svg.innerHTML = ''

      focusedBoundingBox.forEach((boundingBox) => {
        const {
          x, y, width, height,
        } = getPixelCoordinates(boundingBox, imageWidth, imageHeight, rectPadding)

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        rect.setAttribute('x', String(x))
        rect.setAttribute('y', String(y))
        rect.setAttribute('width', String(width))
        rect.setAttribute('height', String(height))
        rect.setAttribute('class', userFormHighlightColors[userFormHighlightKey].className)

        svg.appendChild(rect)
      })
    }
  }, [focusedBoundingBox, imageUrls, userFormHighlightKey])

  return (
    <div className='flex size-full flex-col items-center justify-start'>
      {/* Below needed for 'sticky' to remain within ContentToolbar */}
      <div className='flex w-full grow flex-col'>
        <ContentToolbar />
        {/* w-full _might_ be needed */}
        <div className='flex grow flex-col justify-center gap-12 border-r p-12'>
          {imageUrls.map((url, index) => {
            const pageNumber = index + 1 // Pages are 1-indexed
            return (
              <div
                className='relative flex w-full flex-col gap-16'
                id={`tbx-scanned-doc-page-${pageNumber}`}
                key={`tbx-scanned-doc-page-${pageNumber}`}
              >
                <img
                  ref={imageRef}
                  alt={`Page ${pageNumber}`}
                  className='h-auto w-full shadow-xl'
                  src={url}
                />
                <svg
                  ref={svgRef}
                  className='pointer-events-none absolute left-0 top-0 size-full'
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
