

var NodeHelper = require("node_helper");
var FileSistemMediaSlideshow = require("fs");
const { forEach } = require("lodash");

module.exports = NodeHelper.create({
    start: function() {
        this.moduleConfigs = [];
    },
    sortByFilename: function (a, b) {
        aL = a.filename.toLowerCase();
        bL = b.filename.toLowerCase();
        if (aL > bL) 
			return 1;
		else 
			return -1;
    },
    getMediaFromPath: function(config){

        var mediaList = [];
        var mediaPaths = config.mediaPaths;

        for(var i = 0; i < mediaPaths.length; i++)
        {
            var currentPath = mediaPaths[i];
            var filesFromDir = FileSistemMediaSlideshow.readdirSync(path = currentPath);
            
            for (var currentMediaIndex = 0; currentMediaIndex < filesFromDir.length; currentMediaIndex++)
            {

                var currentMedia = null;
                var fileSufixs = filesFromDir[currentMediaIndex].split(".");
                
                var ImageFileTypes = [];
                ImageFileTypes = config.validImageFileExtensions.split(',');
                var VideoFileTypes = [];
                VideoFileTypes = config.validVideoFileExtensions.split(',');

                //Checks if extension of files is either on images or videos accepted list
                if(ImageFileTypes.indexOf(fileSufixs[fileSufixs.length - 1]) != -1)
                {
                    currentMedia = {filename: filesFromDir[currentMediaIndex], path: currentPath, typeOfMedia: "Image"};
                }
                else if(VideoFileTypes.indexOf(fileSufixs[fileSufixs.length - 1]) != -1)
                {
                    currentMedia = {filename: filesFromDir[currentMediaIndex], path: currentPath,typeOfMedia: "Video"};
                }   
                
                if( currentMedia != null)
                {
                    mediaList.push(currentMedia);
                }
            }   
        }
        
        //Sorts
        if(config.orderByName) mediaList.sort(this.sortByFilename);

        var finalMediaList = [];
        mediaList.forEach(media => {
            var newElement = {filepath: media.path + media.filename, typeOfMedia: media.typeOfMedia};
            finalMediaList.push(newElement);
        }); 


        return finalMediaList;
    },
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'MEDIASLIDESHOW_REGISTER_CONFIG') {
            // add the current config to an array of all configs used by the helper
            this.moduleConfigs.push(payload);
            // this to self
            var self = this;
            // get the image list
            var mediaList = this.getMediaFromPath(payload);
            // build the return payload
            var returnPayload = { identifier: payload.identifier, mediaList: mediaList };
            // send the image list back
            self.sendSocketNotification('MEDIASLIDESHOW_FILELIST', returnPayload );
        }
    },    
})