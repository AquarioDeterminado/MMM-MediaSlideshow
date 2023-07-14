/* global Module */


/**  MMM-ImageSlideshow.js
 * 
 * Magic Mirror
 * Module: MMM-MediaSlideshow
 * 
 * Magic Mirror By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 * 
 * Module MMM-ImageSlideshow By Adam Moses http://adammoses.com
 * MIT Licensed.
 *
 * Modified by:  Aquario_Determinado
 * Date: 
 * Adds video output
**/

Module.register("MMM-MediaSlideshow", {

    defaults: {
        mediaPaths: ["modules/MMM-MediaSlideshow/defaultMedia/"],
        
        displayInterval: 10 * 1000,

        orderByName: true,
        
        validImageFileExtensions: 'png,jpg,jpeg',
        validVideoFileExtensions: 'mp3,mp4',

        fadeInTime: "2s",
        displayDuration: undefined,
    },

    start: function () {
        // add identifier to the config
        this.config.identifier = this.identifier;
        // ensure file extensions are lower case
        this.config.validImageFileExtensions = this.config.validImageFileExtensions.toLowerCase();
        this.config.validVideoFileExtensions = this.config.validVideoFileExtensions.toLowerCase();
        // set no error
		this.errorMessage = null;
        if (this.config.mediaPaths.length == 0) 
        {
            this.errorMessage = "MMM-MediaSlideshow: Missing Media Paths;";
        }
        else 
        {
            // create an empty image list
            this.mediaList = [];
            // set beginning image index to -1, as it will auto increment on start
            this.currentMediaIndex = -1;
            // ask helper function to get the image list
            this.sendSocketNotification('MEDIASLIDESHOW_REGISTER_CONFIG', this.config);
			// do one update time to clear the html
			this.updateDom();
			// set a blank timer
			this.interval = null;
        }
    },
    getStyles: function(){
        return ["styles.css"]
    },

    socketNotificationReceived: function(notification, payload) {
		// if an update was received
		if (notification === 'MEDIASLIDESHOW_FILELIST') 
        {
			// check this is for this module based on the woeid
			if (payload.identifier === this.identifier)
			{
				// set the image list
				this.mediaList = payload.mediaList;
                // if image list actually contains images
                // set loaded flag to true and update dom
                if (this.mediaList.length > 0) 
                {
                    this.loaded = true;
                    this.updateDom();
					// set the timer schedule to the slideshow speed			
					var self = this;
					this.interval = setInterval(function() {
                        self.updateDom();
                    }, this.config.displayInterval);					
                }
			}
		}
    },    

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";

        var map = document.createElement("map");
        map.setAttribute("id", "map");
        map.setAttribute("name", "map");

        var areasNumber = 4;
        for(var i = 1; i <= areasNumber; i++)
        {
            var area = document.createElement("area")
            area.setAttribute("id", '${i}');
            area.setAttribute("shape", "rect");
            var width = (1080 / areasNumber) * i;
            area.setAttribute("coords", '0,0,1920,${width}');
            document.getElementById("map").appendChild(area);
        }

        document.appendChild(map);

        var self = this;
        
        if (this.errorMessage != null) 
        {
            wrapper.innerHTML = this.errorMessage;
        }
        // if no errors
        else 
        {
            // if the image list has been loaded
            if (this.loaded == true) 
            {
				// if was delayed until restart, reset index reset timer
				if (this.currentMediaIndex == -2) 
                {
					this.currentMediaIndex = -1;
					clearInterval(this.interval);
					var self = this;
					this.interval = setInterval(function() {
						self.updateDom(0);
						}, this.config.displayInterval);						
				}				
                // iterate the image list index
                this.currentMediaIndex += 1;
				// set flag to show stuff
				var showSomething = true;
                // if exceeded the size of the list, go back to zero
                if (this.currentMediaIndex == this.mediaList.length) 
                {
					this.currentMediaIndex = 0;
				}

				if (showSomething) 
                {
                    var media = null;

					// create the image dom bit
                    if(this.mediaList[this.currentMediaIndex].typeOfMedia == "Image")
                    {
					    media = document.createElement("img");
                        media.className = "img";
                        //Assumes the media will stay for the spipulated amoutn of time
                        var timeForFadeOut = (parseFloat(this.config.displayInterval) /1000)- parseFloat(this.config.fadeInTime);
                        self.config.displayDuration = timeForFadeOut + "s";
                    } 
                    else if (this.mediaList[this.currentMediaIndex].typeOfMedia == "Video") 
                    {
                        media = document.createElement("video");
                        media.className = "video";
                        media.setAttribute("autoplay", "autoplay");
                        

                        //Resets paramaters for video to play until the end;
                        media.onloadedmetadata = function() {
                            
                            var video = this;
                            //Keeps how long the video will me showing for (Important for fade out)
                            var timeForFadeOut = 0;
                            self.config.displayDuration = timeForFadeOut + "s";
                            //Resets old timer 
                            clearInterval(self.interval)
                            
                            //Creates new timer with video duration
                            video.interval = setTimeout(function() {
                                //Gets next media
                                self.updateDom();
                                //Resets to normal interval
                                self.interval = setInterval(function() {
                                        self.updateDom();
                                    }, self.config.displayInterval);

                            }, video.duration * 1000);
                        };
                    }

					// set the image location
					media.src = encodeURI(this.mediaList[this.currentMediaIndex].filepath);
                    
                    media.setAttribute("usemap", '#${map.name}')
                    media.classList.add("fadeInOut");
                    // add the image to the dom
  					wrapper.appendChild(media);
			    }

                [
                    "displayDuration", 
                    "fadeInTime"
                ].forEach((stat) => wrapper.style.setProperty(`--${stat}`, self.config[stat]));
        
            }
            else  
            {
                // if no data loaded yet, empty html
                wrapper.innerHTML = "&nbsp;";
            }
        }

        
        

        // return the dom
		return wrapper;
    },

    clearLastImage: function (){
        const dom = getDom();
    
    }
})