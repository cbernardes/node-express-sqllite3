var cache_manager = require('cache-manager');
let memoryCache = cache_manager.caching({ store: 'memory', max: 100, ttl: 30/*seconds*/ });
//TODO set in the config


function cacheWrapperWithCB({key, params, method}, done) {
    memoryCache.wrap(key + JSON.stringify(params), function (cacheCallback) {
        method(params, cacheCallback);
    }, {}, done);
}

// rewriting the method with the promisse structure
function cacheWrapper(key, method) {
  console.log({key});
  return (params) => {
    return new Promise(function (resolve, reject) {
      const parsedMethod = (p, cb)=>{
        method(p).then((r)=>{cb(undefined,r)}).catch(cb)
      };
      cacheWrapperWithCB({key, params, method: parsedMethod}, (err, resp)=>{
        if (err) return reject(err);
        return resolve(resp);
      })
    });
  }
}

module.exports = { cacheWrapper };