// Simple permanent in memory cache
class CacheService{
    cache: Map<string, any>
    constructor(){
        this.cache = new Map();
    }

    set(key: string, value: any){
        console.log(`Setting "${key}" to cache...`);
        this.cache.set(key, value);
        return value;
    }

    get(key: string){
        console.log(`Retrieving "${key}" from cache...`);
        return this.cache.get(key);
    }

    delete(key: string){
        console.log(`Deleting "${key}" from cache...`);
        return this.cache.delete(key);
    }

    clearCache(){
        console.log("Clearing cache...")
        this.cache.clear();
    }

    has(key: string){
        const result = this.cache.has(key);
        if(result) console.log(`Found cache item for "${key}"...`);
        else console.log(`No cache item found for "${key}"...`);
        return result;
    }

    keys(){
        return this.cache.keys();
    }
    
    values(){
        return this.cache.values();
    }
}

export default CacheService;