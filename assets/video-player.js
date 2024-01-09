class VideoPlayer extends HTMLElement {
  constructor() {
    super();
    this.playerElement = this.querySelector('.plyr__video-embed');
    this.poster = this.playerElement.dataset['poster'] || '';
    this.initVideo();
  }

  initVideo(){
    this.player = new Plyr(this.playerElement);
    // make use of player instance do anything you want.
    // want to pause video offscreen make use of intersection observer and pause it
    // want to track if the video is played make use of the event listener 
    // client want something to happen when the video is played 
    // read here how to do it https://github.com/sampotts/plyr
    
    this.player.on('ready', (event) => {
      const instance = event.detail.plyr;
      instance.poster = this.poster;
    });
  }
}

customElements.define('video-player', VideoPlayer);