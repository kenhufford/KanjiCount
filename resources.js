class Resources{
    constructor(){
        this.resourceCache = {};
        this.loading = [];
        this.callbacks = [];
    }

    loadSelector(images){
        debugger
        if (images instanceof Array) {
            images.forEach((url) => {
                this.load(url);
            });
        }
        else {
            this.load(images);
        }
    }

    load(url){
        if (this.resourceCache[url]) {
            return this.resourceCache[url];
        }
        else {
            debugger
            let img = new Image();
            let onload = () => {
                this.resourceCache[url] = img;

                if (this.isReady()) {
                    this.callbacks.forEach((func) => {
                        func()
                    });
                }
            }
            onload = onload.bind(this)
            img.onload = onload;
            this.resourceCache[url] = false;
            img.src = url;
        }
    }

    get(url){
        return this.resourceCache[url];
    }

    isReady(){
        let ready = true;
        for (let k in this.resourceCache) {
            if (this.resourceCache.hasOwnProperty(k) && !this.resourceCache[k]) {//checks if obj has key of k
                ready = false;
            }
        }
        return ready;
    }

    onReady(func){
        this.callbacks.push(func);
    }
}



    