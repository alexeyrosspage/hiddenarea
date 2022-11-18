'use strics';

if(typeof(serverStorage)=='undefined')
{
    var serverStorage=
        {
            'MAIN_URL':'http://hiddenarea/',
            'STATICS_URL':'http://hiddenarea/statics/',
            'TEMP_URL':'http://hiddenarea/temp/'
        };
}

function ServerMessage(script, line, text)
{
    confirm(script + ': ' + line + "\n" + text + "\n");
    //AJAX to server
}

function CheckJSON(jsonString)
{
    function error(e)
    {
        ServerMessage('this', 0, 'JSON ERROR FOR ['+e+']: ' + jsonString, false);
    }

    try
    {
        if((jsonString) && (typeof(jsonString)==='string'))
        {
            let json = $.parseJSON(jsonString);
            if ((json) && (typeof json === "object"))
            {
                return json;
            }
            else
            {
                error('parse');
            }
        }
        else
        {
            error('empty or nostring');
        }
    }
    catch (e)
    {
        error(e['message']);
    }

    return false;
}


function saveError(error_obj)
{
    function stack(str)
    {
        str = str.replace(new RegExp(serverStorage['STATICS_URL'] + 'js/', "gi"), '');
        str = str.replace(new RegExp('http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/', "gi"), '');
        return str;
    }

    let error_code;

    if (typeof (error_obj['script']) != 'undefined')
    {
        if (error_obj['stack'])
        {
            error_obj['message'] += "\n" + stack(error_obj['stack']);
        }

        ServerMessage(error_obj['script'], error_obj['line'], error_obj['message'], true);
        return true;
    }

    let R = {'script': 'unknow', 'line': '?'};

    if (typeof (error_obj['stack']) == 'undefined')
    {
        error_obj['stack'] = '';
    }
    else
    {
        if (error_obj['stack'])
        {
            error_obj['stack'] = String(error_obj['stack']);

            let ar = error_obj['stack'].split('http');
            if (typeof (ar[1]) != 'undefined')
            {
                ar = ar[1].split('/');
                if (typeof (ar[1]) != 'undefined')
                {
                    ar = ar.pop().split('?');
                    if (typeof (ar[1]) != 'undefined')
                    {
                        R['script'] = ar[0];

                        ar = ar[1].split(':');
                        if (typeof (ar[1]) != 'undefined')
                        {
                            R['line'] = ar[1];
                        }
                    }
                }
            }
        }
        error_obj['message'] += "\n" + stack(error_obj['stack']);
    }

    ServerMessage(R['script'], R['line'], error_obj['message'], true);
    return true;
}

window.onerror = function (message, url, line, col, error)
{
    let ar = url.split('http'),
        script = 'UNKNOW';

    if (typeof (ar[1]) != 'undefined')
    {
        ar = ar[1].split('/');
        if (typeof (ar[1]) != 'undefined')
        {
            ar = ar.pop().split('?');
            if (typeof (ar[1]) != 'undefined')
            {
                script = ar[0];
            }
        }
    }

    if (typeof (line) == 'undefined' || (!line))
    {
        line = '?';
    }

    let stack = '';
    if ((typeof (error) != 'undefined') && (error['stack']))
    {
        stack = String(error['stack']);
    }
    saveError({'script': script, 'line': line, 'message': message, 'stack': stack});

    return false;
};

$(document).ready(function ()
{
    $('#lngs>span[data-lng]').on('click',function ()
    {
        if($(this).data('lng')===1)
        {
            let date = new Date();
            date.setTime(date.getTime() + (31536000*1000));
            document.cookie = 'ru_language' + "=1; expires=" + date.toGMTString() + "; path=/";
        }
        else
        {
            document.cookie = 'ru_language' + "=0; max-age=0; path=/";
        }
        location.reload();
    });
});