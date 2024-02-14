const esclient = require('../config/elasticsearch');

/**
 * @function createIndex
 * @returns {void}
 * @description Creates an index in ElasticSearch.
 */
async function createIndex(index) {
  try {
    await esclient.indices.create({ index });
    console.log(`Created index ${index}`);
  } catch (err) {
    console.error(`An error occurred while creating the index ${index}:`);
    console.error(err);
  }
}

async function insert(index, type, body) {
  return esclient.index({
    index,
    type,
    body,
  });
}
/**
 * @function setListingsMapping,
 * @returns {void}
 * @description Sets the Listings mapping to the database.
 */
async function setMapping(index, type, schema) {
  try {
    // const schema = {
    //   quote: {
    //     type: 'text',
    //   },
    //   author: {
    //     type: 'text',
    //   },
    // };

    await esclient.indices.putMapping({
      index,
      type,
      include_type_name: true,
      body: {
        properties: schema,
      },
    });

    console.log('Listings mapping created successfully');
  } catch (err) {
    console.error('An error occurred while setting the  mapping:');
    console.error(err);
  }
}
/**
 * @function checkConnection
 * @returns {Promise}
 * @description Checks if the client is connected to ElasticSearch
 */
function checkConnection() {
  return new Promise(async (resolve) => {
    console.log('Checking connection to ElasticSearch...');
    let isConnected = false;
    while (!isConnected) {
      try {
        await esclient.cluster.health({});
        console.log('Successfully connected to ElasticSearch');
        isConnected = true;
        // eslint-disable-next-line no-empty
      } catch (_) {}
    }
    resolve(true);
  });
}

async function main(index, type, schema) {
  const isElasticReady = await elastic.checkConnection();
  if (isElasticReady) {
    const elasticIndex = await elastic.esclient.indices.exists(index);

    if (!elasticIndex.body) {
      await createIndex(index);
      await setMapping(index, type, schema);
      await data.populateDatabase();
    }
  }
}
module.exports = {
  esclient,
  setMapping,
  checkConnection,
  createIndex,
  // index,
  // type,
  insert,
  main,
};

// check connection
// check index exists
// if not exists => create index, mapping, 
// create function populate() to async database



