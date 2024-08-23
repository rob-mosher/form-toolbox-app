import {
  AnalyzeDocumentResponse as TAnalyzeDocumentResponse,
  Block as TBlock,
  BoundingBox as TBoundingBox,
  Relationship as TRelationship,
} from '@aws-sdk/client-textract'

function parseKeyValuePairs(textractData: TAnalyzeDocumentResponse) {
  const keyMap: Record<string, TBlock> = {}
  const valueMap: Record<string, TBlock> = {}
  const blockMap: Record<string, TBlock> = {}

  function limitDecimalPlaces(n: number, decimalPlaces: number): number {
    return Number(n.toFixed(decimalPlaces))
  }

  // Build maps for key-value pairs and block IDs
  textractData.Blocks?.forEach((block: TBlock) => {
    const blockId = block.Id!
    blockMap[blockId] = block
    if (block.BlockType === 'KEY_VALUE_SET') {
      if (block.EntityTypes?.includes('KEY')) {
        keyMap[blockId] = block
      } else {
        valueMap[blockId] = block
      }
    }
  })

  // Find a value block given a key block
  function findValueBlock(keyBlock: TBlock): TBlock | null {
    let valueBlock: TBlock | null = null
    if (keyBlock.Relationships) {
      keyBlock.Relationships.forEach((relationship: TRelationship) => {
        const { Ids } = relationship
        if (relationship.Type === 'VALUE' && Ids && Ids.length > 0) {
          // Assume that each key has only one value block for simplicity
          valueBlock = valueMap[Ids[0]]
        }
      })
    }
    return valueBlock
  }

  // Get text and bounding box from a block
  function getKeyValueAndBoundingBox(block: TBlock) {
    let boundingBox: TBoundingBox | undefined
    let text = ''

    if (block.Geometry?.BoundingBox) {
      boundingBox = block.Geometry.BoundingBox

      const decimalPlaces = 6

      boundingBox.Width = limitDecimalPlaces(boundingBox.Width ?? 0, decimalPlaces)
      boundingBox.Height = limitDecimalPlaces(boundingBox.Height ?? 0, decimalPlaces)
      boundingBox.Left = limitDecimalPlaces(boundingBox.Left ?? 0, decimalPlaces)
      boundingBox.Top = limitDecimalPlaces(boundingBox.Top ?? 0, decimalPlaces)
    }

    if (block.Relationships) {
      block.Relationships.forEach((relationship: TRelationship) => {
        if (relationship.Type === 'CHILD') {
          relationship.Ids?.forEach((childId: string) => {
            const wordBlock = blockMap[childId]
            if (wordBlock.BlockType === 'WORD') {
              text += `${wordBlock.Text} `
            } else if (wordBlock.BlockType === 'SELECTION_ELEMENT' && wordBlock.SelectionStatus === 'SELECTED') {
              text += 'X '
            }
          })
        }
      })
    }

    return {
      text: text.trim(),
      boundingBox,
    }
  }

  // Build the key-value pairs with bounding boxes
  const keyValuePairs: Record<
    string,
    { value: string; keyBoundingBox?: TBoundingBox; valueBoundingBox?: TBoundingBox }
  > = {}

  Object.keys(keyMap).forEach((keyBlockId: string) => {
    const keyBlock = keyMap[keyBlockId]
    const valueBlock = findValueBlock(keyBlock)

    if (valueBlock) {
      const {
        text: keyText,
        boundingBox: keyBoundingBox,
      } = getKeyValueAndBoundingBox(keyBlock)
      const {
        text: valueText,
        boundingBox: valueBoundingBox,
      } = getKeyValueAndBoundingBox(valueBlock)

      keyValuePairs[keyText] = {
        value: valueText,
        keyBoundingBox,
        valueBoundingBox,
      }
    }
  })

  return keyValuePairs
}

export { parseKeyValuePairs }
