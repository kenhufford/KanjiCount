class Music{
    constructor(audioURL){
        this.audio = new Audio(audioURL)
        this.mute = false;
        this.audio.loop = true;
    }

    play(){
        this.mute = !this.mute;
        if (this.mute){
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }
}