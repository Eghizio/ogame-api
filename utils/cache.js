// Simple permanent in memory cache
class Cache{
    constructor(){
        this.cache = new Map();
    }

    set(key, value){
        this.cache.set(key, value);
        return value;
    }

    get(key){
        return this.cache.get(key);
    }

    delete(key){
        return this.cache.delete(key);
    }

    clearCache(){
        this.cache.clear();
    }

    has(key){
        return this.cache.has(key);
    }

    keys(){
        return this.cache.keys();
    }
    
    values(){
        return this.cache.values();
    }
}

module.exports = Cache;