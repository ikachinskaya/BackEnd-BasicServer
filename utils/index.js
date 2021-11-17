const fs = require('fs').promises;

// утилитка которая просто будет создавать нам папочку там где мы укажем, 
// создавая еще и родительские папки если их нет
module.exports.createPublicFolder = async path => {
  await fs.mkdir(path, { recursive: true });
};