# MMM_MediaSlideshow

 Magic Mirror Module that displays media (video and audio) in a slideshow format. Addaptation from [OneOfInfiniteMonkeys]() [ImageSlideshow](). 

---
 ### Config:
 ``` js
    {
			module: "MMM-MediaSlideshow",
			position: "fullscreen_below",
			config: {
				mediaPath: 'modules/MMM-MediaSlideshow/defaultMedia/',
                displayInterval: 10000,
				validImageFileExtensions: 'png,jpg,jpeg',
        		validVideoFileExtensions: 'mp3, mp4',
        		fadeInTime: "1s",
			}
		},
```
| Paramater | Descrip.  | Defaults |
|:--|:-:|--:|
| **mediaPath** | The path to the media folder |  ``` 'modules/MMM-MediaSlideshow/defaultMedia/' ```|
| **displayInterval** | How long each piece of media is displayed| ``` 10 * 1000 (10s) ``` |
| **orderByName** | True if the media should be displayed by alphabetical order |``` true ```|
| **validImageFileExtensions** | The types of images to be displayed |``` 'png,jpg,jpeg' ```|
| **validVideoFileExtensions** | The types of videos to be displayed |``` 'mp3,mp4' ```|
| **fadeInTime** | How long it takes for the media to fade in and out |``` "2s" ```|