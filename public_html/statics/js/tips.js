'use strics';
if(typeof (saveError)=='undefined')
{
    var saveError=function (error)
    {
        alert('Tips error. '+error['message']+': '+error['line']);
    }
}

$.Tip = function (input, options, tip)
{
    try
    {
        function hide_all()
        {
            try
            {
                $('#all_tips').find('div.itips_view').removeClass('on').stop().fadeOut('normal');
            } catch (e)
            {
                saveError(e);
            }
        }

        function clear()
        {
            try
            {
                $('#all_tips').html('');
            } catch (e)
            {
                saveError(e);
            }
        }

        function itips_out(tip)
        {
            try
            {
                $('#itips' + tip).removeClass('on').stop().fadeOut('normal');
            }
            catch (e)
            {
                saveError(e);
            }
        }

        function itips_in(input, tip)
        {
            try
            {
                let
                    div = $('#itips' + tip),
                    text = null;

                if (options.text)
                {
                    text = options.text;
                }
                else
                {
                    if ((typeof (input.data('tip')) != 'undefined') && (input.data('tip').length))
                    {
                        text = input.data('tip');
                    }
                }

                if (!text)
                {
                    return;
                }

                if (options.hide)
                {
                    hide_all();
                }

                if (div.length)
                {
                    if (div.find('div').find('span').text() !== text)
                    {
                        div.find('div').find('span').html(text);
                    }

                    if (div.hasClass('on'))
                    {
                        if (!options.close)//запрет на закрытие
                        {
                            itips_out(tip);
                        }
                    }
                    else
                    {
                        div.addClass('on').stop().fadeIn('normal');
                    }
                }
                else
                {
                    let
                        offset = input.offset(),
                        div_result, top, left, color, padding = 10,
                        input_width = input.width(),
                        div_width,
                        div_width_half,
                        width_doc = $(document).width(),
                        results = document.createElement('div'),
                        $results;

                    color = ((options.color === 'red') ? ' style="color:#FF0000"' : '');

                    $results = $(results).addClass('itips_view').addClass('on').attr('id', 'itips' + tip).html('<div' + color + '><span>' + text + '</span></div>');// Create jQuery object for results - создаем объект результатов
                    $('#all_tips').append(results);// Add to body element - добавляем результаты в body

                    div_result = $(results).find('div:first');

                    left = parseInt(offset.left);

                    div_width = parseInt(div_result.css('width'));
                    div_width_half = div_width / 2;

                    if (div_width_half > left)
                    {
                        left = div_width_half + padding;
                        div_result.addClass('left');
                    }
                    else
                    {
                        if ((left + input_width / 2 + div_width_half) > width_doc)
                        {
                            left = width_doc - div_width_half - padding;
                            div_result.addClass('right');
                        }
                        else
                        {
                            left += (input_width / 2);
                            div_result.addClass('center');
                        }
                    }

                    top = parseInt(offset.top);

                    if(top<=0)
                    {
                        top=100;
                        div_result.addClass('center_up');
                    }

                    $results.css(
                        {
                            top: top + 'px',
                            left: left + 'px'
                        }).fadeIn('normal');// reposition

                    if ((options.replace !== false) && (input.parent().length))
                    {
                        input.parent().html(options.replace);
                    }

                    if (options.close)
                    {
                        $results.on('click', function (e)
                        {
                            itips_out(tip);
                        });

                        if (options.close === 'auto')
                        {
                            setTimeout(function ()
                            {
                                itips_out(tip);
                            }, options.time);
                        }
                    }

                    if(options.function)
                    {
                        options.function();
                    }
                }
            } catch (e)
            {
                saveError(e);
            }
        }

        if (options.id)
        {
            tip = options.id;
        }

        switch (options.type)
        {
            case('hover')://подсказка по наведению
                input.hover(
                    function ()
                    {
                        itips_in(input, tip);
                    },
                    function ()
                    {
                        itips_out(tip);
                    }
                );

                //подсказка по клику по тачпаду
                input.on('touchstart', function ()
                {
                    itips_in(input, tip);
                    setTimeout(function ()
                    {
                        itips_out(tip);
                    }, options.time);
                });
                break;

            case('click')://подсказка по клику/отключение повторный клик
                input.on('click', function ()
                {
                    itips_in(input, tip);
                });
                break;

            case('click_mess')://автопоказ сообщения/отключение клик по сообщению
                itips_in(input, tip);
                break;

            case('click_auto')://автопоказ сообщения/отключение через time секунды/клик по сообщению
                itips_in(input, tip);
                setTimeout(function ()
                {
                    itips_out(tip);
                }, options.time);
                break;

            case('hide_all')://скрыть все подсказки с экрана
                hide_all();
                break;
        }
    }
    catch (e)
    {
        saveError(e);
    }
};

let tip = 0;
$.fn.Tip = function (options)
{
    //опции настройки плагина подсказок
    //plugin configuration option
    options = options || {};

    //Возможность определения конкретного ID для каждой подсказки для дальнейших манипуляций с её поведением на странице
    //Ability to define a specific ID for each tips for further manipulation of its behavior on the page
    options.id = options.id || 0;

    //Тип подсказок:
    // - подсказка по наведению (клик по тачпаду),
    // - подсказка по клику/отключение повторный клик
    // - автопоказ подсказки/отключение клик по подсказке
    // - автопоказ подсказки/отключение через установленное время
    // - скрыть все подсказки с экрана
    //Tips type:
    // - hover tips (touchpad click),
    // - click tips/disable re-click
    // - auto show tips/disable click on tips
    // - auto-show tips/turn off after a set time
    // - hide all tips from the screen
    options.type = options.type || 'hover';

    //время автоскрывания подсказки по умолчанию
    //default tips auto-hide time
    options.time = options.time || 3000;

    //запрет на закрытие подсказки
    //permission to close the tips
    options.close = options.close || true;

    //закрыть все подсказки на экране
    //close all tips on the screen
    options.hide = options.hide || true;

    //цвет подсказки
    //tips color
    options.color = options.color || 'grey';

    //замена объекта подсказки
    //replace tips object
    options.replace = options.replace || false;

    //передача текста подсказки напрямую, без data-tip
    //transmitting the tips text directly, without data-tip
    options.text = options.text || null;

    //передача собственной функции для выполнения после показа подсказки
    //passing your own function to execute after the tips is shown
    options.function = options.function || null;

    this.each(function ()//обход всех задействованных input
    {
        tip++;
        new $.Tip($(this), options, tip);//запуск функции для каждого input c указанными опциями, либо теме, что по умолчанию
    });
};

$(document).ready(function ()
{
    let tips=$('#tips');
    if(tips.length)
    {
        tips.Tip();
    }
});