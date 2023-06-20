function myDebugCache() {
  this.c = null;
}

myDebugCache.prototype.get = function() {
  console.log("GET - " + this.c);

  return this.c;
};

myDebugCache.prototype.set = function(key, item) {
  console.log("SET - " + item);

  this.c = item;
};

module.exports = myDebugCache;
