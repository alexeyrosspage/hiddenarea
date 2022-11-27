# HiddenArea (jQuery plugin) — image viewer and editor
«HiddenArea» is a JQuery Plugin for watching and editing images with some unusual option: you can select any areas of your picture and hide them with a blur. You also can rotate your images clockwise and counterclockwise. «HiddenArea» allows you to save images on server safely, load them from it for editing and cache them through file names.

«HiddenArea» это jQuery плагин, к классическим опциям редактирования картинок добавляет ещё одну, не совсем  обычную: возможность скрывать выделенные области изображения наложенным блюром. Плагин также позволяет поворачивать картинки. «HiddenArea» безопасно сохраняет изображения на сервере, загружает их оттуда для редактирования и кеширует через имена файлов (а не через GET-параметры

![](https://github.com/alexrosspage/hiddenarea/blob/main/FOMA_B.png)

> Just select and hide any areas of your picture

> Important: your picture will be really edited, this is not just an overlaiding of a СSS property

**GitHub**: [https://github.com/alexrosspage/hiddenarea](https://github.com/alexrosspage/hiddenarea)

**Demo**: [http://hiddenarea.epizy.com](http://hiddenarea.epizy.com/)
***
## Setting
### Helper functions that can be defined before plugin initialization.
1. saveError. 
The function of showing and/or sending an error to the server. By default, the function will display an error on the browser screen through the alert command.
```
 function saveError(error)
    {
        alert('HiddenAres error. '+error['message']+': '+error['line']);
    }
```
***
## License
MIT
