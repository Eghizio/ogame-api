// Simple in memory cache
export class CacheService{
    cache: Map<string, { value: any, ttl: number }>
    constructor(){
        console.log("Creating cache...");
        this.cache = new Map();
    }

    // 0 = infinite
    set(key: string, value: any, ttl: number = 0){
        // console.log(`Setting "${key}" to cache...`);
        ttl = ttl === 0 ? 0 : Date.now() + ttl;
        this.cache.set(key, { value, ttl });
        return value;
    }

    get(key: string){
        // console.log(`Retrieving "${key}" from cache...`);
        const item = this.cache.get(key);

        if(item === undefined) return undefined;

        const now = Date.now()
        // simple ttl, validating only when getting key // should add some flush or timed clearing
        if(item.ttl && now > item.ttl){
            // console.log({ ttl: item.ttl, now })
            // console.log("Expired ttl");
            this.cache.delete(key);
            return undefined;
        }

        return item.value;
    }

    delete(key: string){
        // console.log(`Deleting "${key}" from cache...`);
        return this.cache.delete(key);
    }

    clearCache(){
        // console.log("Clearing cache...");
        this.cache.clear();
    }

    has(key: string){
        const result = this.cache.has(key);
        // if(result) console.log(`Found cache item for "${key}"...`);
        // else console.log(`No cache item found for "${key}"...`);
        return result;
    }

    keys(){
        return Array.from(this.cache.keys());
    }
    
    values(){
        return Array.from(this.cache.values()).map(item => item.value);
    }
}
