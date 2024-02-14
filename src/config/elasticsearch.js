const { Client } = require('@elastic/elasticsearch');
const elasticUrl = process.env.ELASTIC_URL || 'http://localhost:9200';
const elasticSearch = new Client({ node: elasticUrl });

module.exports = elasticSearch;
