const textractFunctions = {};

textractFunctions.parseKeyValuePairs = (textractData) => {
  const keyMap = {};
  const valueMap = {};
  const blockMap = {};

  // Build maps for key-value pairs and block IDs
  textractData.Blocks.forEach((block) => {
    const blockId = block.Id;
    blockMap[blockId] = block;
    if (block.BlockType === 'KEY_VALUE_SET') {
      if (block.EntityTypes.includes('KEY')) {
        keyMap[blockId] = block;
      } else {
        valueMap[blockId] = block;
      }
    }
  });

  // Find a value block given a key block
  function findValueBlock(keyBlock) {
    let valueBlock = null;
    if (keyBlock.Relationships) {
      keyBlock.Relationships.forEach((relationship) => {
        if (relationship.Type === 'VALUE') {
          // Assume that each key has only one value block for simplicity
          valueBlock = valueMap[relationship.Ids[0]];
        }
      });
    }
    return valueBlock;
  }

  // Get text from a block
  function getText(block) {
    let text = '';
    if (block.Relationships) {
      block.Relationships.forEach((relationship) => {
        if (relationship.Type === 'CHILD') {
          relationship.Ids.forEach((childId) => {
            const wordBlock = blockMap[childId];
            if (wordBlock.BlockType === 'WORD') {
              text += `${wordBlock.Text} `;
            } else if (wordBlock.BlockType === 'SELECTION_ELEMENT' && wordBlock.SelectionStatus === 'SELECTED') {
              text += 'X ';
            }
          });
        }
      });
    }
    return text.trim();
  }

  // Build the key-value pairs
  const keyValuePairs = {};
  Object.keys(keyMap).forEach((keyBlockId) => {
    const keyBlock = keyMap[keyBlockId];
    const valueBlock = findValueBlock(keyBlock);
    if (valueBlock) {
      const keyText = getText(keyBlock);
      const valueText = getText(valueBlock);
      keyValuePairs[keyText] = valueText;
    }
  });

  return keyValuePairs;
};

module.exports = textractFunctions;
