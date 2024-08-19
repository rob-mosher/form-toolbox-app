// TODO finish typescript conversion

function parseKeyValuePairs(textractData) {
  const keyMap = {}
  const valueMap = {}
  const blockMap = {}

  // Build maps for key-value pairs and block IDs
  textractData.Blocks.forEach((block) => {
    const blockId = block.Id
    blockMap[blockId] = block
    if (block.BlockType === 'KEY_VALUE_SET') {
      if (block.EntityTypes.includes('KEY')) {
        keyMap[blockId] = block
      } else {
        valueMap[blockId] = block
      }
    }
  })

  // Find a value block given a key block
  function findValueBlock(keyBlock) {
    let valueBlock = null
    if (keyBlock.Relationships) {
      keyBlock.Relationships.forEach((relationship) => {
        if (relationship.Type === 'VALUE') {
          // Assume that each key has only one value block for simplicity
          valueBlock = valueMap[relationship.Ids[0]]
        }
      })
    }
    return valueBlock
  }

  // Get text and bounding box from a block
  function getKeyValueAndBoundingBox(block) {
    let boundingBox = null
    let text = ''

    if (block.Geometry && block.Geometry.BoundingBox) {
      boundingBox = block.Geometry.BoundingBox
    }

    if (block.Relationships) {
      block.Relationships.forEach((relationship) => {
        if (relationship.Type === 'CHILD') {
          relationship.Ids.forEach((childId) => {
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
  const keyValuePairs = {}
  Object.keys(keyMap).forEach((keyBlockId) => {
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
