class Resources{
    constructor(){
        this.resourceCache = {};
        this.loading = [];
        this.callbacks = [];
    }

    loadSelector(images){
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

let sushiUrls = ['https://i.imgur.com/d9eAFpv.png', 'https://i.imgur.com/OgYpn5g.png',
    'https://i.imgur.com/iPHtdFJ.png', 'https://i.imgur.com/MfRYOUY.png',
    'https://i.imgur.com/Fak1dg2.png', 'https://i.imgur.com/AzURS4x.png',
    'https://i.imgur.com/sjC5DTt.png', 'https://i.imgur.com/u0Dgq2e.png'
]

let mouseImages = ['https://i.imgur.com/NYu9p6I.png','https://i.imgur.com/DgTx4Wg.png']

let kirbyUrl = ['https://i.imgur.com/JD6rhR7.png']

let images = ["https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png",'https://i.imgur.com/4Ornj5u.png', 'https://i.imgur.com/yHVGEZl.png'].concat(sushiUrls, mouseImages, kirbyUrl)

