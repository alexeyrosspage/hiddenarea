'use strics';

if(typeof (saveError)=='undefined')
{
    var saveError=function (error)
    {
        if(typeof (error['message'])!='undefined' && typeof (error['line'])!='undefined')
        {
            alert('HiddenAres error. '+error['message']+': '+error['line']);//
        }
    }
}

if(typeof ($.Tip)=='undefined')
{
    $.fn.Tip=function (error)
    {
        if(typeof (error['text'])!='undefined'){
            alert(error['text']);
        }
    }
}


let varStorage = {};
let TGIF='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA';
let lng=0;
if (document.cookie.match('(^|;) ?' + 'ru_language' + '=([^;]*)(;|$)'))
{
    lng=1;
}
let body=$('body');
let localStorageIsOn=true;


if ((!window.sessionStorage) || (!window.localStorage))
{
    sessionStorage = {};
    localStorage = {};
    localStorageIsOn = false;
}

let touchScreenIsOn=false;
if(('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
{
    touchScreenIsOn=true;
}

if(typeof (CheckJSON)=='undefined')alert('v');

let lngs={
    0:
        {
            'max-size':'Only files with JPG or PNG extensions are allowed, no larger than',
            'download':'upload',
            'loaded':'loaded',
            'cancel':'Cancel',
            'save':'Save changes',
            'close':'Close',
            'return':'return',
            'delete':'Delete the image',
            'str_about':'Sometimes you need to hide some fragments of your image: faces, private information in your documents, details of your location and adress or unsightly background.',
            'str_steps':'You can do this in three easy steps:',
            'str_1_no_touch':'1. Press left mouse button (do not release it) and select rectangular area on the image by moving a cursor to the right and down',
            'str_2_no_touch':'2. Release mouse button and click inside the selected area',
            'str_1_ok_touch':'1. Circle the desired area of ​​the image with your finger as if drawing a rectangle',
            'str_2_ok_touch':'2. Release your finger and click inside the selected area',
            'str_3_save':'3. Click "Save Changes" if everything is ok or "Cancel" otherwise.'
        },
    1:
        {
            'max-size':'Допускаются файлы с расширеним JPG или PNG, размером не больше чем',
            'download':'загрузить',
            'loaded':'загружено',
            'cancel':'Отменить',
            'save':'Сохранить изменения',
            'close':'Закрыть',
            'return':'вернуть',
            'delete':'Удалить изображение',
            'str_about':'Иногда вам нужно скрыть некоторые фрагменты вашего изображения: лица, личную информацию из ваших документов, детали вашего местоположения и адреса или неприглядный фон.',
            'str_steps':'Вы можете сделать это в три простых шага:',
            'str_1_no_touch':'1. Нажмите левую кнопку мыши (не отпуская) и выберите прямоугольную область на изображении, перемещая курсор вправо и вниз',
            'str_2_no_touch':'2. Отпустите кнопку мыши и клините внутри выделенной области.',
            'str_1_ok_touch':'1. Обведите пальцем нужную область изображения, как будто рисуете прямоугольник',
            'str_2_ok_touch':'2. Отпустите палец и кликните внутри выделенной области.',
            'str_3_save':'3. Нажмите "Сохранить изменения", если все в порядке или "Отмена" в противном случае.'
        }};


(function ($)
{
    $.fn.hiddenarea = function (options)
    {
        try
        {
            let hiddenarea_block = $(this),
                local = {},
                servers =
                    {
                        'temp': serverStorage['TEMP_URL'],
                        'load': 'pic_check_ad',
                        'double': true//двойная картинка - большая и маленькая
                    },
                colorBackground = '#000',//фон вокруг
                colorOpacity = 0.8,//прозрачность фона
                picSett = [],//массив изображений
                currentPic = 0,//текущее изображение
                PageSize = [],//размеры страницы
                pct = 0.75,//процентов от реальных размеров
                obj = {};

            if (typeof (varStorage) != 'object')
            {

                varStorage['pics'] = {};
            }
            else
            {
                if (typeof (varStorage['pics']) != 'object')
                {
                    varStorage['pics'] = {};
                }
            }

            if (typeof (options) == 'undefined')
            {
                options = {};
            }

            if (!options['message'])
            {
                options['message'] = '';
            }

            if (!options['megabyte'])
            {
                options['megabyte'] = 5;
            }

            if (!options['number'])
            {
                options['number'] = 1;
            }

            let htmlblock = '';
            for (let id = 1; id < options['number'] + 1; id++)
            {
                htmlblock +=
                    '<div class="upload">' +
                    '<strong>' +
                    '<i><svg class="pics_icons"><use xlink:href="' + serverStorage['STATICS_URL'] + 'img/svg/blank_spryte.svg#upload_icon"></use></svg><b>'+lngs[lng]['download']+'</b></i>' +
                    '<img src="' + TGIF + '" height="160" width="160">' +
                    '<input type="file" data-id="' + id + '" id="b' + id + '" accept="image/jpeg,image/jpg,image/png">' +
                    '<em></em>' +
                    '<span><span class="name"></span></span>' +
                    '</strong>' +
                    '<div>' +
                    '<div class="imgcontrol">' +
                    '<span class="delfoto" data-error="">' +
                    '<input name="delete_pic" type="checkbox" class="checkbox" id="d' + id + '" data-id="' + id + '">' +
                    '<label for="d' + id + '" title="delete" style="display:none"><i><svg class="pics_icons"><use xlink:href="' + serverStorage['STATICS_URL'] + 'img/svg/blank_spryte.svg#delphoto_icon"></use></svg></i></label>' +
                    '</span>' +
                    '<a href="#" data-id="' + id + '"><img src="' + TGIF + '" height="30" width="30"><i><svg class="pics_icons"><use xlink:href="' + serverStorage['STATICS_URL'] + 'img/svg/blank_spryte.svg#editphoto_icon"></use></svg></i></a>' +
                    '</div>' +
                    '<div class="return" style="display:none;">' +
                    '<span>'+lngs[lng]['return']+'</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            htmlblock = '<div>' + htmlblock + '</div>' +
                '<span id="hiddenarea-error" class="error red" data-n="img" style="font-size:small"><em></em></span>' +
                '<p class="chit">' +
                ''+lngs[lng]['max-size']+' ' + options['megabyte'] + ' Mb' +
                '</p>' +
                '<p class="coverhint">' +
                options['message'] +
                '</p>';
            hiddenarea_block.append(htmlblock);


            let
                gallery = hiddenarea_block.find('a'),//набор ссылок
                buttons = hiddenarea_block.find('input[type="file"]');//набор кнопок загрузки

            autoLoad(buttons);

            function picSetting(modified_href)
            {
                picSett = [];

                currentPic = 0;// Index активной картинки по умолчанию
                let i = 0, id;//используем i, а не index так как в INDEX могут быть пропуски из-за неподходящих условий для value
                gallery.each(function (index, value)
                {
                    value = String(value);
                    if ((value) && ((value.includes('.jpg')) || (value.includes('.png'))))
                    {
                        id = 0;
                        if ($(this).attr('data-id'))
                        {
                            id = $(this).data('id');
                        }

                        picSett[i] =
                            {
                                'id': id,
                                'original_href': value,
                                'modified_href': value,
                                'height': 0,
                                'width': 0,
                                'left': 0,
                                'top': 0
                            };

                        if (value === modified_href)
                        {
                            currentPic = i;
                        }

                        i++;
                    }
                });
            }

            function editInitialization(modified_href)
            {
                PageSize = getPageSize();// получение размеров страницы

                $('embed, object, select').css({'visibility': 'hidden'});//Скрыть элементы, чтобы избежать конфликта с оверлеем в IE. Эти элементы появляются над наложением.

                picSetting(modified_href);

                setInterface();

                loadNewPic('original_href');// Загружаем(вставляем) оригинальную картинку
            }

            gallery.unbind('click').click(function ()// Метод unbind используется, чтобы избежать конфликта кликов, когда плагин вызывается более одного раза
            {
                try
                {
                    let a = $(this).closest('a');
                    if (a.prop('href'))
                    {
                        let href = a.attr('href');
                        if ((href.length) && ((href.includes('.jpg')) || (href.includes('.png'))))
                        {
                            editInitialization(href); // this - обект по которому кликнул юзер
                        }
                    }
                    return false;// не даём открыть ссылку
                }
                catch (e)
                {
                    saveError(e);
                }
            });

            buttons.on('change',function ()// Метод unbind используется, чтобы избежать конфликта кликов, когда плагин вызывается более одного раза
            {
                try
                {
                    obj = objectsOfButton($(this));
                    $('#hiddenarea-error').html('');
                    loadPic(obj);

                }
                catch (e)
                {
                    saveError(e);
                }
            });

            function thisButton(id)
            {
                obj = null;
                buttons.each(function ()
                {
                    if ($(this).data('id') === id)
                    {
                        obj = objectsOfButton($(this));
                    }
                });
                return obj;
            }

            function thisA(id)
            {
                obj = null;
                gallery.each(function ()
                {
                    if ($(this).data('id') === id)
                    {
                        obj =
                            {
                                'a': $(this),
                                'img': $(this).find('img:first'),
                                'id': id
                            };
                    }
                });
                return obj;
            }

            function getPageSize()//Сбор размеров страницы
            {
                let
                    arrayPageSize,
                    xScroll,
                    yScroll,
                    windowWidth,
                    windowHeight,
                    pageHeight,
                    pageWidth;

                //определение сколла экрана
                if (window.innerHeight && window.scrollMaxY)
                {
                    xScroll = window.innerWidth + window.scrollMaxX;//Ширина окна + максимальная доступная скролла  ширины
                    yScroll = window.innerHeight + window.scrollMaxY;//Высота окна + максимальная доступная скролла высоты
                }
                else
                {
                    if (document.body.scrollHeight > document.body.offsetHeight)// если высота всего скрола больше высоты страницы, берем за основу скролл
                    {
                        xScroll = document.body.scrollWidth;
                        yScroll = document.body.scrollHeight;
                    }
                    else// берем за основу высоту страницы
                    {
                        xScroll = document.body.offsetWidth;
                        yScroll = document.body.offsetHeight;
                    }
                }

                //определение ширины/высоты экрана
                if (self.innerHeight)// all except Explorer
                {
                    if (document.documentElement.clientWidth)
                    {
                        windowWidth = document.documentElement.clientWidth;//ширина видимой области окна
                    }
                    else
                    {
                        windowWidth = self.innerWidth;
                    }
                    windowHeight = self.innerHeight;//высота видимой области окна
                }
                else
                {
                    if (document.documentElement && document.documentElement.clientHeight)// Explorer 6 Strict Mode
                    {
                        windowWidth = document.documentElement.clientWidth;//ширина видимой области окна
                        windowHeight = document.documentElement.clientHeight;//высота видимой области окна
                    }
                    else
                    {
                        if (document.body)// other Explorers
                        {
                            windowWidth = document.body.clientWidth;//ширина видимой области окна
                            windowHeight = document.body.clientHeight;//высота видимой области окна
                        }
                    }
                }

                //определение высоты для небольших страниц с общей высотой меньше высоты окна просмотра
                if (yScroll < windowHeight)
                {
                    pageHeight = windowHeight;
                }
                else
                {
                    pageHeight = yScroll;
                    pageHeight = pageHeight * 2;//на всякий случай
                }

                // определение ширины для маленьких страниц общей шириной меньше ширины области просмотра
                if (xScroll < windowWidth)
                {
                    pageWidth = xScroll;
                }
                else
                {
                    pageWidth = windowWidth;
                }

                arrayPageSize =
                    {
                        'pageWidth': pageWidth,
                        'pageHeight': pageHeight,
                        'windowWidth': windowWidth,
                        'windowHeight': windowHeight
                    };

                return arrayPageSize;
            }

            function getPageScroll()//Сбор размеров скролла
            {
                let
                    xScroll,
                    yScroll,
                    arrayPageScroll;

                if (self.pageYOffset)
                {
                    yScroll = self.pageYOffset;
                    xScroll = self.pageXOffset;
                }
                else
                {
                    if (document.documentElement && document.documentElement.scrollTop)// Explorer 6 Strict
                    {
                        yScroll = document.documentElement.scrollTop;
                        xScroll = document.documentElement.scrollLeft;
                    }
                    else
                    {
                        if (document.body)// all other Explorers
                        {
                            yScroll = document.body.scrollTop;
                            xScroll = document.body.scrollLeft;
                        }
                    }
                }

                arrayPageScroll =
                    {
                        'xScroll': xScroll,
                        'yScroll': yScroll
                    };
                return arrayPageScroll;
            }

            function backgroundOverlay(width, height)// Фон вокруг изображения
            {
                $('#jquery-overlay').css
                ({
                    backgroundColor: colorBackground,
                    opacity: colorOpacity,
                    width: width,
                    height: height
                }).fadeIn();
            }

            function hiddenareaBlock(scrolltop, scrollleft, pagesize)
            {
                $('#jquery-hiddenarea').css({
                    top: scrolltop + (pagesize / 10),
                    left: scrollleft[0]
                }).show();// Рассчитаем координаты и покажем картинку
            }

            function linksSaveRallback(on)
            {
                if (on)
                {
                    $('#hiddenarea-rollback').animate({opacity: 1}, 2000);
                    $('#hiddenarea-save').animate({opacity: 1}, 2000);
                }
                else
                {
                    $('#hiddenarea-rollback').animate({opacity: 0.2}, 2000);
                    $('#hiddenarea-save').animate({opacity: 0.2}, 2000);
                }

            }

            function setInterface(deleted)
            {
                let picDelete = '';
                let term = '';
                if (touchScreenIsOn)
                {
                    term = lngs[lng]['str_about']+' <p>'+lngs[lng]['str_steps']+' </p><p>'+lngs[lng]['str_1_ok_touch']+';</p><p>'+lngs[lng]['str_2_ok_touch']+';</p><p>'+lngs[lng]['str_3_save']+'</p>';
                }
                else
                {
                    term = lngs[lng]['str_about']+' <p>'+lngs[lng]['str_steps']+' </p><p>'+lngs[lng]['str_1_no_touch']+';</p><p>'+lngs[lng]['str_2_no_touch']+';</p><p>'+lngs[lng]['str_3_save']+'</p>';
                }

                body.append('' +
                    '<div id="jquery-overlay"><i title="close"><svg class="pics_icons"><use xlink:href="' + serverStorage['STATICS_URL'] + 'img/svg/header_spryte.svg#close"></use></svg></i></div>' +
                    '<div id="jquery-hiddenarea" style="-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;">' +
                    '<div id="hiddenarea-container-image-box">' +
                    '<div id="hiddenarea-container-image">' +
                    '<div id="hiddenarea-secNav-btnClose"><span><i><svg class="pics_icons"><use xlink:href="' + serverStorage['STATICS_URL'] + 'img/svg/header_spryte.svg#close"></use></svg></i>'+lngs[lng]['close']+'</span></div>' +
                    '<img id="hiddenarea-image">' +
                    '<div style="" id="hiddenarea-nav">' +
                    '<a href="#" id="hiddenarea-nav-btnPrev"></a>' +
                    '<a href="#" id="hiddenarea-nav-btnNext"></a>' +
                    '</div>' +
                    '<div id="hiddenarea-loading">' +
                    '<a href="#" id="hiddenarea-loading-link">' +
                    '<img src="'+serverStorage['STATICS_URL']+'img/loading_l.gif">' +
                    '</a>' +
                    '</div>' +
                    '<div id="hiddenarea-edit" style="margin-top:20px;position:relative;z-index:9999;-webkit-touch-callout: none;">' +
                    '<div id="hiddenarea-eraser" style="display: none"></div>' +
                    '<a href="#" id="hiddenarea-rotate-right" title="Rotate clockwise" style="color:#FFF5EE;">↻</a>' +
                    '<a href="#" id="hiddenarea-rotate-left" title="Rotate counterclockwise" style="color:#FFF5EE;">↺</a>' +
                    '<a href="#" id="hiddenarea-rollback" title="Cancel editing" style="color:#F0FFFF;">'+lngs[lng]['cancel']+'</a>' +
                    '<a href="#" id="hiddenarea-save" title="Save changes" style="color:#F0FFF0;">'+lngs[lng]['save']+'</a>' +
                    picDelete +
                    '<div class="manual">' + term + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');

                linksSaveRallback(false);

                if (!PageSize.length)// Если размеры страницы неизвестны получим их
                {
                    PageSize = getPageSize();
                }

                backgroundOverlay(PageSize['pageWidth'], PageSize['pageHeight']);

                let arrPageScroll = getPageScroll();// Get page scroll

                hiddenareaBlock(arrPageScroll['yScroll'], arrPageScroll['xScroll'], PageSize['windowWidth']);

                $('#jquery-overlay').click(function ()
                {
                    closePlugin();// Assigning click events in elements to close overlay
                });

                $('#hiddenarea-loading-link,#hiddenarea-secNav-btnClose').click(function ()
                {
                    closePlugin();// Закрываем плагин
                    return false;
                });

                $(window).resize(function ()// Если размер окна был изменен, рассчитаем новые размеры
                {
                    PageSize = getPageSize();

                    backgroundOverlay(PageSize['pageWidth'], PageSize['pageHeight']);

                    let arrPageScroll = getPageScroll();

                    hiddenareaBlock(arrPageScroll['yScroll'], arrPageScroll['xScroll'], PageSize['windowWidth']);
                });
            }

            function loadNewPic(href)//Предварительная загрузка картинки с вычисление её размера
            {
                $('#hiddenarea-loading').show();// Иконка загрузки
                $('#hiddenarea-image,#hiddenarea-nav,#hiddenarea-nav-btnPrev,#hiddenarea-nav-btnNext,#hiddenarea-edit').hide();//всю навигацию прячем

                let objImagePreloader = new Image();// Процесс предварительной загрузки картинки
                objImagePreloader.src = picSett[currentPic][href];
                objImagePreloader.onload = function ()
                {
                    let width = PageSize['pageWidth'] * pct;//допустимо pct % от ширины

                    if (objImagePreloader.width > width)
                    {
                        objImagePreloader.width = width;
                    }

                    $('#hiddenarea-image').attr('src', picSett[currentPic][href]);//Дальще будет плавный ресайз контейнера

                    picSett[currentPic]['width'] = objImagePreloader.width;
                    picSett[currentPic]['height'] = objImagePreloader.height;

                    resizePicContainer(objImagePreloader.width, objImagePreloader.height);
                };
                objImagePreloader.src = picSett[currentPic][href];
            }

            function resizePicContainer(newPicWidth, newPicHeight)//Плавный ресайз
            {

                let
                    containerResizeSpeed = 400,// Скорость изменения контейнера
                    margin;

                if ((newPicWidth > PageSize['pageWidth']))//ширина новой картинки больше ширины контейнера
                {
                    if ((newPicHeight > PageSize['pageHeight']))
                    {
                        backgroundOverlay(newPicWidth, newPicHeight + PageSize['pageHeight']);
                    }
                    else
                    {
                        backgroundOverlay(newPicWidth + PageSize['pageWidth'], PageSize['pageHeight']);
                    }

                    margin = Math.floor(PageSize['pageWidth'] / 2);
                }
                else
                {
                    if ((newPicHeight > PageSize['pageHeight']))
                    {
                        if ((newPicWidth > PageSize['pageWidth']))
                        {
                            backgroundOverlay(newPicWidth + PageSize['pageWidth'], newPicHeight + PageSize['pageHeight']);
                        }
                        else
                        {
                            backgroundOverlay(PageSize['pageWidth'], newPicHeight + PageSize['pageHeight']);
                        }
                    }
                    margin = Math.floor((PageSize['pageWidth'] - newPicWidth) / 2);
                }

                $('#hiddenarea-container-image-box').animate(
                    {
                        width: newPicWidth,
                        height: newPicHeight
                    },
                    containerResizeSpeed, function ()//Эффект плавной смены размера
                    {
                        showPic();
                        $('#hiddenarea-nav-btnPrev').css({height: newPicHeight, left: (-1) * margin + 'px', width: margin + 'px'});
                        $('#hiddenarea-nav-btnNext').css({height: newPicHeight, right: (-1) * margin + 'px', width: margin + 'px'});
                    });
            }

            function showPic()//Показываем картинку и навигацию
            {
                $('#hiddenarea-loading').hide();//плашку загрузки скрываем

                let hiddenarea_image=$('#hiddenarea-image');
                hiddenarea_image.fadeIn('slow', function ()
                {
                    if(hiddenarea_image.length)//Какой-то баг? Приходится проверять иначе иногда вылетает ошибка.
                    {
                        picSett[currentPic]['left'] = hiddenarea_image.offset().left;
                        picSett[currentPic]['top'] = hiddenarea_image.offset().top;
                        picSett[currentPic]['height']=hiddenarea_image.height();
                        picSett[currentPic]['width']=hiddenarea_image.width();

                        $('#hiddenarea-edit').fadeIn();

                        setControl();//подключаем навигацию, если фоток больше 1
                    }
                });
            }

            function setNavigation()
            {
                let access = 0;
                if (picSett.length > 0)
                {
                    if ($.isEmptyObject(varStorage['pics']))
                    {
                        access = picSett.length;
                    }
                    else
                    {
                        for (let i = 0; i < picSett.length; i++)
                        {
                            if ((typeof (varStorage['pics'][picSett[i]['id']]) != 'undefined') && (varStorage['pics'][picSett[i]['id']]['access']))
                            {
                                access++;
                            }
                        }
                    }
                }

                if (access > 1)
                {
                    $('#hiddenarea-nav-btnPrev').unbind().show().bind('click', function ()// Показывем следующую картинку
                    {
                        try
                        {
                            if ($.isEmptyObject(varStorage['pics']))
                            {
                                currentPic = currentPic - 1;
                                if (currentPic < 0)
                                {
                                    currentPic = picSett.length - 1;
                                }
                                loadNewPic('original_href');
                            }
                            else
                            {
                                for (let i = 0; i < picSett.length; i++)
                                {
                                    currentPic = currentPic - 1;
                                    if (currentPic < 0)
                                    {
                                        currentPic = picSett.length - 1;
                                    }

                                    if (varStorage['pics'][picSett[currentPic]['id']]['access'])
                                    {
                                        loadNewPic('original_href');
                                        return false;
                                    }
                                }
                            }

                            return false;
                        }
                        catch (e)
                        {
                            saveError(e);
                        }
                    });

                    $('#hiddenarea-nav-btnNext').unbind().show().bind('click', function ()// Показывем предыдушую картинку
                    {
                        try
                        {
                            if ($.isEmptyObject(varStorage['pics']))
                            {
                                currentPic = currentPic + 1;
                                if (currentPic > picSett.length - 1)
                                {
                                    currentPic = 0;
                                }
                                loadNewPic('original_href');
                            }
                            else
                            {
                                for (let i = 0; i < picSett.length; i++)
                                {
                                    currentPic = currentPic + 1;
                                    if (currentPic > picSett.length - 1)
                                    {
                                        currentPic = 0;
                                    }

                                    if (varStorage['pics'][picSett[currentPic]['id']]['access'])
                                    {
                                        loadNewPic('original_href');
                                        return false;
                                    }
                                }
                            }
                            return false;
                        } catch (e)
                        {
                            saveError(e);
                        }
                    });
                }
                else
                {
                    $('#hiddenarea-nav-btnPrev').unbind().hide();
                    $('#hiddenarea-nav-btnNext').unbind().hide();
                }
            }

            function setControl()//Панель навигации по картинкам
            {
                let hiddenarea_nav=$('#hiddenarea-nav');
                hiddenarea_nav.show();

                setNavigation();

                function createAjaxObject(obj)
                {
                    obj['cats'] = 'form';
                    obj['type'] = 'pic_change';
                    obj['original_pic'] = String(picSett[currentPic]['original_href']);
                    obj['editing_pic'] = String($('#hiddenarea-image').attr('src'));

                    return obj;
                }

                hiddenarea_nav.unbind('touchstart').unbind('touchmove').unbind('touchend').unbind('touchcancel');
                hiddenarea_nav.on('touchstart', function (e)
                {
                    let
                        nav = $(this),
                        touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
                        pageX = touch.pageX,
                        pageY = touch.pageY,
                        mouseX = touch.clientX,
                        mouseY = touch.clientY,
                        mouseXmax = 0,
                        mouseYmax = 0,
                        leftBlur = 0,
                        topBlur = 0,
                        widthBlur = 0,
                        heightBlur = 0;

                    e.preventDefault();

                    if (
                        (mouseX < picSett[currentPic]['left']) &&
                        (mouseX > (picSett[currentPic]['left'] + picSett[currentPic]['width'])) &&
                        (mouseY < picSett[currentPic]['top']) &&
                        (mouseY > (picSett[currentPic]['top'] + picSett[currentPic]['height'])))
                    {
                        return false;
                    }

                    let hiddenarea_blur=$('#hiddenarea-blur');

                    if (hiddenarea_blur.length)
                    {
                        hiddenarea_blur.remove();
                        return false;
                    }

                    body.append('<div id="hiddenarea-blur"></div>');
                    hiddenarea_blur.css({'position': 'absolute', 'z-index': 9999, 'backgroundColor': 'black', 'opacity': '0.5', 'border': '1px dashed yellow'});

                    nav.on('touchcancel', function (e)
                    {
                        e.stopPropagation();
                    });

                    nav.on('touchmove', function (e)
                    {
                        let
                            touch2 = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
                            //pageX2 = touch2.pageX,
                            //pageY2 = touch2.pageY,
                            mouseX2 = touch2.clientX,
                            mouseY2 = touch2.clientY;

                        if (
                            (mouseX2 < picSett[currentPic]['left']) &&
                            (mouseX2 > (picSett[currentPic]['left'] + picSett[currentPic]['width'])) &&
                            (mouseY2 < picSett[currentPic]['top']) &&
                            (mouseY2 > (picSett[currentPic]['top'] + picSett[currentPic]['height'])))
                        {
                            return false;
                        }

                        if (mouseX2 > mouseXmax)
                        {
                            mouseXmax = mouseX2;
                        }

                        if (mouseY2 > mouseYmax)
                        {
                            mouseYmax = mouseY2;
                        }

                        e.stopPropagation();
                    });

                    $('#hiddenarea-blur, #hiddenarea-nav').on('touchend', function ()
                    {
                        leftBlur = picSett[currentPic]['left'] + (pageX - picSett[currentPic]['left']);
                        topBlur = picSett[currentPic]['top'] + (pageY - picSett[currentPic]['top']);
                        widthBlur = mouseXmax - mouseX;
                        heightBlur = mouseYmax - mouseY;

                        $('#hiddenarea-blur').css({'left': leftBlur, 'top': topBlur, 'width': widthBlur, 'height': heightBlur});
                        nav.unbind('touchmove');
                        nav.unbind('touchend');

                        e.stopPropagation();
                    });

                    hiddenarea_blur.click(function ()
                    {
                        $(this).css({'background-image': 'url(' + serverStorage["STATICS_URL"] + 'img/selection.gif)', 'opacity': '0.5'});

                        let
                            sizes = {},
                            sizes_pct = {};

                        sizes['top'] = $(this).offset().top - $('#hiddenarea-image').offset().top;
                        sizes['left'] = $(this).offset().left - $('#hiddenarea-image').offset().left;
                        sizes['height'] = $(this).height();
                        sizes['width'] = $(this).width();

                        sizes_pct['top'] = parseFloat(sizes['top'] / $('#hiddenarea-image').height()).toFixed(4);
                        sizes_pct['left'] = parseFloat(sizes['left'] / $('#hiddenarea-image').width()).toFixed(4);
                        sizes_pct['height'] = parseFloat(sizes['height'] / $('#hiddenarea-image').height()).toFixed(4);
                        sizes_pct['width'] = parseFloat(sizes['width'] / $('#hiddenarea-image').width()).toFixed(4);

                        $.post(serverStorage['MAIN_URL'], createAjaxObject({'change': 'blur', 'sizes': sizes_pct}), function (data)
                        {
                            try
                            {
                                $('#hiddenarea-blur').unbind().remove();
                                if ((data) && (data = CheckJSON(data)))
                                {
                                    if (data['result'])
                                    {
                                        picSett[currentPic]['modified_href'] = data['result'];
                                        linksSaveRallback(true);
                                        loadNewPic('modified_href');
                                    }
                                    else
                                    {
                                        $('#hiddenarea-save').Tip({type: 'click_auto', time: 5000, 'text': data['error']});
                                    }
                                }
                                else
                                {
                                    $('#hiddenarea-save').Tip({type: 'click_auto', time: 5000, 'text': 'Неизвестный запрос'});
                                }
                            } catch (e)
                            {
                                saveError(e);
                            }
                        });

                        return false;
                    });
                });


                $('#hiddenarea-nav').unbind('mousedown').unbind('mousemove').unbind('mouseup');
                $('#hiddenarea-nav').mousedown(function (e)
                {
                    let
                        nav = $(this),
                        mouseX = e.pageX,
                        mouseY = e.pageY;

                    if (
                        (mouseX < picSett[currentPic]['left']) ||
                        (mouseX > (picSett[currentPic]['left'] + picSett[currentPic]['width'])) ||
                        (mouseY < picSett[currentPic]['top']) ||
                        (mouseY > (picSett[currentPic]['top'] + picSett[currentPic]['height'])))
                    {
                        e.stopPropagation();
                        return false;
                    }

                    if ($('#hiddenarea-blur').length)
                    {
                        $('#hiddenarea-blur').remove();
                        return false;
                    }

                    body.append('<div id="hiddenarea-blur"></div>');
                    $('#hiddenarea-blur').css({'position': 'absolute', 'z-index': 9999, 'backgroundColor': 'black', 'opacity': '0.5', 'border': '1px dashed yellow'});


                    nav.mousemove(function (e)
                    {
                        if ((e.pageX > (picSett[currentPic]['left'] + picSett[currentPic]['width'])) || (e.pageY > (picSett[currentPic]['top'] + picSett[currentPic]['height'])))
                        {
                            return false;
                        }
                        $('#hiddenarea-blur').css({'left': mouseX, 'top': mouseY, 'width': e.pageX - mouseX, 'height': e.pageY - mouseY});
                    });

                    $('#hiddenarea-blur, #hiddenarea-nav').mouseup(function ()
                    {
/*                        if((e.pageX > (picSett[currentPic]['left'] + picSett[currentPic]['width'])) || (e.pageY > (picSett[currentPic]['top'] + picSett[currentPic]['height'])))
                        {
                            $('#hiddenarea-blur').remove();
                        }*/

                        nav.unbind('mousemove');
                        nav.unbind('mouseup');
                    });

                    $('#hiddenarea-blur').click(function ()
                    {
                        $(this).css({'background-image': 'url(' + serverStorage["STATICS_URL"] + 'img/selection.gif)', 'opacity': '0.5'});

                        let
                            sizes = {},
                            sizes_pct = {};

                        let hiddenarea_image=$('#hiddenarea-image');

                        sizes['top'] = $(this).offset().top - hiddenarea_image.offset().top;
                        sizes['left'] = $(this).offset().left - hiddenarea_image.offset().left;
                        sizes['height'] = $(this).height();
                        sizes['width'] = $(this).width();

                        sizes_pct['top'] = parseFloat(sizes['top'] / hiddenarea_image.height()).toFixed(4);
                        sizes_pct['left'] = parseFloat(sizes['left'] / hiddenarea_image.width()).toFixed(4);
                        sizes_pct['height'] = parseFloat(sizes['height'] / hiddenarea_image.height()).toFixed(4);
                        sizes_pct['width'] = parseFloat(sizes['width'] / hiddenarea_image.width()).toFixed(4);

                        $.post(serverStorage['MAIN_URL'], createAjaxObject({'change': 'blur', 'sizes': sizes_pct}), function (data)
                        {
                            try
                            {
                                $('#hiddenarea-blur').unbind().remove();
                                if ((data) && (data = CheckJSON(data)))
                                {
                                    if (data['result'])
                                    {
                                        picSett[currentPic]['modified_href'] = data['result'];
                                        linksSaveRallback(true);
                                        loadNewPic('modified_href');
                                    }
                                    else
                                    {
                                        $('#hiddenarea-save').Tip({type: 'click_auto', time: 5000, 'text': data['error']});
                                    }
                                }
                                else
                                {
                                    $('#hiddenarea-save').Tip({type: 'click_auto', time: 5000, 'text': 'Неизвестный запрос'});
                                }
                            }
                            catch (e)
                            {
                                saveError(e);
                            }
                        });

                        return false;
                    });
                });

                $('#hiddenarea-rotate-right').unbind().show().bind('click', function ()
                {
                    $.post(serverStorage['MAIN_URL'], createAjaxObject({'change': 'rotate', 'direction': 90}), function (data)
                    {
                        try
                        {
                            if ((data) && (data = CheckJSON(data)))
                            {
                                if (data['result'])
                                {
                                    picSett[currentPic]['modified_href'] = data['result'];
                                    linksSaveRallback(true);
                                    loadNewPic('modified_href');
                                }
                                else
                                {
                                    $('#hiddenarea-rotate-right').Tip({type: 'click_auto', time: 5000, 'text': data['error']});
                                }
                            }
                            else
                            {
                                $('#hiddenarea-rotate-right').Tip({type: 'click_auto', time: 5000, 'text': 'Неизвестный запрос'});
                            }
                        } catch (e)
                        {
                            saveError(e);
                        }
                    });

                    return false;
                });

                $('#hiddenarea-rotate-left').unbind().show().bind('click', function ()
                {
                    $.post(serverStorage['MAIN_URL'], createAjaxObject({'change': 'rotate', 'direction': -90}), function (data)
                    {
                        try
                        {
                            if ((data) && (data = CheckJSON(data)))
                            {
                                if (data['result'])
                                {
                                    picSett[currentPic]['modified_href'] = data['result'];
                                    linksSaveRallback(true);
                                    loadNewPic('modified_href');
                                }
                                else
                                {
                                    $('#hiddenarea-rotate-right').Tip({type: 'click_auto', time: 5000, 'text': data['error']});
                                }
                            }
                            else
                            {
                                $('#hiddenarea-rotate-right').Tip({type: 'click_auto', time: 5000, 'text': 'Неизвестный запрос'});
                            }
                        } catch (e)
                        {
                            saveError(e);
                        }
                    });

                    return false;
                });

                $('#hiddenarea-rollback').unbind().show().bind('click', function ()
                {
                    $.post(serverStorage['MAIN_URL'], createAjaxObject({'change': 'rollback'}), function (data)
                    {
                        try
                        {
                            if ((data) && (data = CheckJSON(data)))
                            {
                                if (data['result'])
                                {
                                    picSett[currentPic]['modified_href'] = data['result'];
                                    if (data['show'])
                                    {
                                        linksSaveRallback(true);
                                    }
                                    else
                                    {
                                        linksSaveRallback(false);
                                    }
                                    loadNewPic('modified_href');
                                }
                                else
                                {
                                    $('#hiddenarea-rollback').Tip({type: 'click_auto', time: 5000, 'text': data['error']});
                                }
                            }
                            else
                            {
                                $('#hiddenarea-rollback').Tip({type: 'click_auto', time: 5000, 'text': 'Неизвестный запрос'});
                            }
                        } catch (e)
                        {
                            saveError(e);
                        }
                    });
                    return false;
                });

                $('#hiddenarea-save').unbind().show().bind('click', function ()
                {
                    $.post(serverStorage['MAIN_URL'], createAjaxObject({'change': 'save'}), function (data)
                    {
                        try
                        {
                            if ((data) && (data = CheckJSON(data)))
                            {
                                if (data['result'])
                                {
                                    if (buttons.length)
                                    {
                                        obj = thisButton(data['sett']['id']);
                                    }
                                    else
                                    {
                                        obj = thisA(data['sett']['id']);
                                    }

                                    picSett[currentPic]['modified_href'] = data['result'];
                                    picSett[currentPic]['original_href'] = picSett[currentPic]['modified_href'];

                                    if (data['sett']['access'])
                                    {
                                        local_save(data['sett']['id'],
                                            {
                                                'server': data['sett']['server'],
                                                'name': data['sett']['name'],
                                                'hash': data['sett']['hash'],
                                                'access': data['sett']['access']
                                            });
                                    }

                                    picUpdate(obj, data['sett']);
                                    linksSaveRallback(false);
                                    loadNewPic('original_href');
                                }
                                else
                                {
                                    $('#hiddenarea-save').Tip({type: 'click_auto', time: 5000, 'text': data['error']});
                                }
                            }
                            else
                            {
                                $('#hiddenarea-save').Tip({type: 'click_auto', time: 5000, 'text': 'Неизвестный запрос'});
                            }
                        } catch (e)
                        {
                            saveError(e);
                        }
                    });
                    return false;
                });
            }

            function closePlugin()//Удаляем все связанные с плагином элементы
            {
                $('#jquery-hiddenarea').remove();
                $('#hiddenarea-blur').remove();
                $('#jquery-overlay').fadeOut(function ()
                {
                    $('#jquery-overlay').remove();
                });

                $('embed, object, select').css({'visibility': 'visible'});// Показать элементы, чтобы избежать конфликта с оверлеем в IE. Эти элементы появляются над наложением.
            }

            function codePause(ms)//Пауза выполнения кода
            {
                let date = new Date();
                curDate = null;

                do
                {
                    let curDate = new Date();
                }
                while (curDate - date < ms);
            }

            function local_load(options)
            {
                if (localStorageIsOn)
                {
                    let fromLocalStorage;
                    if ((localStorage['hiddenarea']) && (fromLocalStorage = CheckJSON(localStorage['hiddenarea'])))
                    {
                        return fromLocalStorage;
                    }
                }

                return false;
            }

            function local_save(id, value)
            {
                varStorage['pics'][id] = value;

                if (localStorageIsOn)
                {
                    if (local = local_load(options))
                    {
                        if ((typeof (local['pics']) == 'undefined') || (local['pics'] == null))
                        {
                            local['pics'] = {};
                        }
                    }
                    else
                    {
                        local = {};
                        local['pics'] = {};
                    }

                    local['pics'][id] = value;
                    localStorage['hiddenarea'] = JSON.stringify(local);
                }
            }

            function objectsOfButton(button)
            {
                let obj = {};

                obj['button'] = button;
                obj['id'] = button.data('id');
                obj['wait'] = button.next('em');
                obj['name'] = obj['wait'].next('span').find('span.name:first');
                obj['img'] = button.prev('img');

                let strong = button.parent('strong');

                obj['upload'] = strong.parent('div.upload');

                obj['sett'] = strong.next('div');

                obj['control'] = obj['sett'].find('div.imgcontrol');

                obj['span_del_foto'] = obj['control'].find('span.delfoto:first');
                obj['trash'] = obj['span_del_foto'].find('input:first');
                obj['edit'] = obj['span_del_foto'].next('a');

                obj['return'] = obj['control'].next('div.return');

                return obj;
            }

            //показ миниатюр
            function picUpdate(obj, sett)
            {
                obj['img'].attr('src', servers[sett['server']] + sett['name'] + sett['hash'] + 'a' + sett['id'] + '.jpg');//вставляем картинку
                obj['img'].css(
                    {
                        'width': '160px',
                        'height': '160px',
                        'cursor': 'pointer',
                        'margin-top': 0
                    });

                if (servers['double'])
                {
                    obj['edit'].attr('href', servers[sett['server']]  + sett['name'] + sett['hash'] + 'b' + sett['id'] + '.jpg');
                }
                else
                {
                    obj['edit'].attr('href', servers[sett['server']]  + sett['name'] + sett['hash'] + 'a' + sett['id']  + '.jpg');
                }

                accessPic(obj, sett['access'], sett['server']);
            }

            function autoLoad(buttons)
            {
                //проверка и автоподгрузка картинок
                if ((localStorageIsOn) && ((local = local_load(options))) && (typeof (local['pics']) != 'undefined') && (local['pics'] != null))
                {
                    let button, id, allObjectsOfButton = {},localAjax={'pics':{}};

                    $.each(buttons, function ()
                    {
                        id = $(this).data('id');
                        allObjectsOfButton[id] = objectsOfButton($(this));

                        if(local['pics'][id])
                        {
                            localAjax['pics'][id]=local['pics'][id];//так как у Куплю картинок менбше чем у Продам
                            loadWait(allObjectsOfButton[id]);
                        }
                    });

                    function loadFailAll()
                    {
                        $.each(allObjectsOfButton, function (index, value)
                        {
                            loadFail(value);
                        });
                    }

                    $.ajax({
                        url: serverStorage['MAIN_URL'],
                        dataType: 'text',
                        data: {cats: 'form', 'type': servers['load'], 'pics': localAjax['pics']},
                        type: 'post',
                        success: function (data)
                        {
                            if ((data) && (data = CheckJSON(data)))
                            {
                                $.each(localAjax['pics'], function (id, value)
                                {
                                    if ((typeof (data['value']) != 'undefined') && (typeof (data['value'][id]) != 'undefined') && (typeof (local['pics'][id]['server'])!='undefined') && (typeof (servers[local['pics'][id]['server']]) != 'undefined'))
                                    {
                                        varStorage['pics'][id] = local['pics'][id];

                                        local['pics'][id]['id'] = id;
                                        obj = allObjectsOfButton[id];

                                        picUpdate(obj, local['pics'][id]);

                                        //удаление картинок
                                        obj['trash'].unbind().click(function ()
                                        {
                                            obj = objectsOfButton($('#b' + $(this).data('id')));
                                            obj['img'].animate({'marginTop': '100%'}, 500, function ss()
                                            {
                                                changeAccessPic(obj);
                                            });
                                        });
                                    }
                                    else
                                    {
                                        local_save(id, null);
                                    }
                                    loadFail(allObjectsOfButton[id]);
                                });
                            }
                            loadFailAll();
                        },
                        error: function ()
                        {
                            loadFailAll();
                        }
                    });
                }
            }

            function loadWait(obj)
            {
                obj['wait'].css(
                    {
                        'background-image': 'url(' + serverStorage["STATICS_URL"] + 'img/selection.gif)',
                        'cursor': 'progress'
                    });
            }

            function loadFail(obj)
            {
                obj['wait'].css(
                    {
                        'background-image': 'none',
                        'cursor': 'default'
                    })
            }

            function deletePic(obj)
            {
                obj['img'].attr('src', TGIF).css({'cursor': 'default'});
                if(obj['edit'])
                {
                    obj['edit'].attr('href', '#');
                }

                if (obj['button'])
                {
                    obj['button'].val('');

                    let text = '';
                    if (obj['error'])
                    {
                        $("#hiddenarea-error").html(obj['error']);
                    }
                    obj['name'].html(text);

                    local_save(obj['id'], null);
                }


                if (obj['full_delete'])
                {
                    for (let p in obj)
                    {
                        if (typeof (obj[p]) == 'object')
                        {
                            obj[p].remove();
                        }
                    }
                    obj = null;
                }
            }

            function clearPic(obj)
            {
                obj['name'].html('');
                obj['trash'].prop('checked', true);
                obj['upload'].removeClass('ready');
                obj['upload'].removeClass('temp');
                obj['button'].val('');
                obj['img'].hide();
                obj['control'].fadeOut();
                obj['return'].fadeIn();

                obj['return'].unbind().click(function ()
                {
                    obj['img'].show().animate({'marginTop': 0}, 500, function ss()
                    {
                        changeAccessPic(obj);
                    });
                });
            }

            function accessPic(obj, access, server)
            {
                obj['sett'].show();

                if (access)
                {
                    obj['name'].html(lngs[lng]['loaded']);
                    obj['trash'].prop('checked', false);
                    obj['upload'].addClass('ready');
                    obj['img'].show();
                    obj['upload'].addClass('temp');
                    obj['control'].fadeIn();
                    obj['return'].fadeOut();
                }
                else
                {
                    clearPic(obj);
                }
            }

            function changeAccessPic(obj)
            {
                let id = obj['id'];

                if (varStorage['pics'][id])
                {
                    if (varStorage['pics'][id]['access'])
                    {
                        varStorage['pics'][id]['access'] = 0;
                    }
                    else
                    {
                        varStorage['pics'][id]['access'] = 1;
                    }

                    accessPic(obj, varStorage['pics'][id]['access'], varStorage['pics'][id]['server']);

                    if (localStorageIsOn)
                    {
                        if (local = local_load(options))
                        {
                            if ((typeof (local['pics']) != 'undefined') && (local['pics'][id]))
                            {
                                local['pics'][id]['access'] = varStorage['pics'][id]['access'];
                                localStorage['hiddenarea'] = JSON.stringify(local);
                            }
                        }
                    }
                    return true;
                }
                return false;
            }

            function loadPic(obj)
            {
                try
                {
                    let
                        fileName, text_error,//по умолчанию нельзя
                        fileObj, size, ext,
                        reWin = /.*\\(.*)/,
                        reUnix = /.*\/(.*)/,
                        regExExt = /.*\.(.*)/,
                        ajax_data;

                    if (typeof (obj['button'].prop('files')[0]) == 'undefined')
                    {
                        return false;
                    }

                    fileObj = obj['button'].prop('files')[0];

                    size = fileObj.size; // Size returned in bytes.

                    if (size <= 10000000)
                    {
                        fileName = obj['button'].val().replace(reWin, '$1').replace(reUnix, '$1');

                        if (ext = fileName.replace(regExExt, '$1'))
                        {
                            ext = ext.toLowerCase();
                            if (ext != 'jpg' && ext != 'jpeg' && ext != 'png')
                            {
                                text_error = 'Допускаются фотографии только JPG или PNG формата';
                            }
                        }
                        else
                        {
                            text_error = 'Допускаются файлы только JPG или PNG формата';
                        }
                    }
                    else //Показываем значок и имя файла (по умолчанию неудачу)
                    {
                        text_error = 'Допускаются фотографии размером до 5 мегабайт. Вы можете воспользоваться бесплатным сервисом <a href="https://imagecompressor.com/ru/">Optimizilla</a>, чтобы сжать свои фото.';
                    }

                    if (!text_error)//картинку можно читать
                    {
                        ajax_data = new FormData();

                        ajax_data.append("cats", "form");
                        ajax_data.append("type", 'pic_upload');
                        ajax_data.append('pic', fileObj);
                        ajax_data.append('id', obj['id']);

                        loadWait(obj);

                        $.ajax({
                            url: serverStorage['MAIN_URL'],
                            dataType: 'text',
                            cache: false,
                            contentType: false,
                            processData: false,
                            data: ajax_data,
                            type: 'post',
                            success: function (data)
                            {
                                if ((data) && (data = CheckJSON(data)))
                                {
                                    if (data['error'])
                                    {
                                        obj['error'] = data['error'];
                                        deletePic(obj);
                                    }
                                    else
                                    {
                                        if (data['name'])
                                        {
                                            data['access'] = 1;

                                            local_save(data['id'],
                                                {
                                                    'server': data['server'],
                                                    'name': data['name'],
                                                    'hash': data['hash'],
                                                    'access': data['access']
                                                });

                                            picUpdate(obj, data);
                                            //удаление картинок

                                            obj['trash'].unbind().click(function ()
                                            {
                                                obj = objectsOfButton($('#b' + $(this).data('id')));
                                                obj['img'].animate({'marginTop': '100%'}, 500, function ss()
                                                {
                                                    changeAccessPic(obj);
                                                });
                                            });
                                        }
                                    }
                                }
                                loadFail(obj);
                            },
                            error: function (data)
                            {
                                loadFail(obj);
                            }
                        });
                    }
                    else
                    {
                        clearPic(obj);
                        $("#hiddenarea-error").html(text_error);
                    }
                } catch (e)
                {
                    saveError(e);
                }
            }
        }
        catch (e)
        {
            saveError(e);
        }
    };
})($);

$(document).ready(function ()
{
    setTimeout(function ()
    {
        let  hiddenarea_block = $('#hiddenarea');
        if(hiddenarea_block.length)
        {
            hiddenarea_block.hiddenarea(
                {
                    'number': hiddenarea_block.data('number'),
                    'message': hiddenarea_block.data('message')
                });
        }
    },1);
});