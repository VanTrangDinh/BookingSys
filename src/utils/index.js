//loai bo nhung than so null or undefined when client transmit data
const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
};

const updateNestedObjectPraser = (obj) => {
  console.log(`[1]:::`, obj);
  const final = {};
  Object.keys(obj).forEach((key) => {
    console.log(`[2]:::`, key);
    console.log(`[3]:::`, typeof obj[key]);
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      console.log(`obj[key]:::`, obj[key]);
      const response = updateNestedObjectPraser(obj[key]);
      Object.keys(response).forEach((a) => {
        console.log(`[4]:::`, a);
        if (response[a] !== null && response[a] !== undefined) {
          final[`${key}.${a}`] = response[a];
        }
      });
    } else {
      if (obj[key] !== null && obj[key] !== undefined) {
        final[key] = obj[key];
      }

      // final[key] = obj[key];
    }
  });

  console.log(`[5]:::`, final);
  return final;
};

module.exports = {
  updateNestedObjectPraser,
  removeUndefinedObject,
};
