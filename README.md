# HiddenArea (jQuery plugin) — image viewer and editor
«HiddenArea» is a JQuery Plugin for watching and editing images with some unusual option: you can select any areas of your picture and hide them with a blur. You also can rotate your images clockwise and counterclockwise. «HiddenArea» allows you to save images on server safely, load them from it for editing and cache them through file names.

![](https://github.com/alexrosspage/hiddenarea/blob/main/FOMA_B.png)

> Just select and hide any areas of your picture

> Important: your picture will be really edited, this is not just an overlaiding of a СSS property

**GitHub**: [https://github.com/alexrosspage/hiddenarea](https://github.com/alexrosspage/hiddenarea)

**Demo**: [http://hiddenarea.epizy.com](http://hiddenarea.epizy.com/)
***
## Setting
### Helper functions that can be defined before plugin initialization.
1. saveError. 
This function is to show and/or send an error to the server. By default (if the function is not defined above), the function will display an error on the browser screen through the «alert» command.
```
 function saveError(error)
    {
        alert('HiddenAres error. '+error['message']+': '+error['line']);//You can comment
this line and then no errors will be displayed
    }
```

2. Tip
This function is needed to show hints and the result of your actions. By default (if the function is not defined above), the function will display an message on the browser screen through the «alert» command.
```
    $.fn.Tip=function (error)
    {
        if(typeof (error['text'])!='undefined'){
            alert(error['text']);//You can comment
this line and then no messages will be displayed
        }
    }
```
### Plugin settings
Plugin settings are defined by the «option» variable. The variable option is an object, with the following keys:
```diff
@@ text in purple (and bold)option['message']@@ - Message under the block, pictures. The default is empty.

option['megabyte'] - The maximum image size in megabytes. The default is 5 megabytes.

option['number'] - The number of images in the block. The default is one picture.
```
***
## License
MIT
