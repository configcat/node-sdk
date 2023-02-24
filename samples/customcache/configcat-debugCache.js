function myDebugCache() {
  this.c = null;
}

myDebugCache.prototype.get = function() {
  console.log("GET - " + (this.c ? this.c.HttpETag : this.c));

  return this.c;
};

myDebugCache.prototype.set = function(key, item) {
  console.log("SET - " + item.HttpETag);
  this.c = item;
};

module.exports = myDebugCache;
