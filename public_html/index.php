<?php
error_reporting(E_ALL);
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
setlocale(LC_ALL, 'ru_RU.UTF-8');
setlocale(LC_NUMERIC, 'C');

spl_autoload_register('classAutoload');//функции автоподгрузки
register_shutdown_function('shutDown');//запуск функции после завершения скрипта
set_error_handler('systemError');//перехват системных ошибок

define ('D1', dirname(__DIR__) . '/');
define ('PUBLIC_DIR',getcwd().'/');

if(is_dir(D1.'.idea'))//это LOCALHOST
{
    define ('MDIR', basename(D1));
}
else
{
    define ('MDIR', 'hiddenarea.epizy.com');
}


define ('TEMP','temp');

if(!empty($_SERVER['REMOTE_ADDR']))
{
    define ('TEMP_DIR',TEMP.'/'.$_SERVER['REMOTE_ADDR']);
}
else
{
    define ('TEMP_DIR',TEMP.'/server');
}

define ('TEMP_PATH',PUBLIC_DIR.TEMP_DIR.'/');

define ('STATICS_DIR','statics');
define ('STATICS_PATH',PUBLIC_DIR.STATICS_DIR.'/');
define ('HDIR','http://');
define('MAIN_URL',HDIR.MDIR.'/');
define('TEMP_URL',MAIN_URL.TEMP_DIR.'/');
define('STATICS_URL',MAIN_URL.STATICS_DIR.'/');

if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
{
    require 'index_ajax_post.php';
    exit;
}

last_directory_cleanup(3);//автоматическая очистка через 3 суток

$cache=[];
$cache['style.css']=filemtime(STATICS_PATH.'css/style.css');
$cache['main.js']=filemtime(STATICS_PATH.'js/main.js');
$cache['tips.js']=filemtime(STATICS_PATH.'js/tips.js');
$cache['hiddenarea.js']=filemtime(STATICS_PATH.'js/hiddenarea.js');

if(!empty($_COOKIE['ru_language']))
{
    $lng=1;
    $lng_en='';
    $lng_ru='act';
}
else
{
    $lng=0;
    $lng_en='act';
    $lng_ru='';
}

$lngs=
    [
        0=>[
            'str1'=>'«HiddenArea» is a JQuery Plugin for watching and editing images with some unusual option: you can select any areas of your picture and hide them with a blur. You also can rotate your images clockwise and counterclockwise. «HiddenArea» allows you to save images on server safely, load them from it for editing and cache them through file names (not through GET parameters).',
            'str2'=>'«HiddenArea» is a useful tool for all projects with user\'s content like a social media, marketplaces, classified ads, medical applications for self-diagnosis and other cases when user want to control the level of privacy on their images.',
            'str3'=>'«HiddenArea» works on touch screens too!',
            'str4'=>'See on <a href="https://github.com/alexeyrosspage/hiddenarea" target="_blank"><svg height="22" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="22" data-view-component="true" class="octicon octicon-mark-github">
    <path fill="#0b8693" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
</svg> GitHub</a>'
        ],
        1=>[
            'str1'=>'jQuery плагин «HiddenArea» к классическим опциям редактирования картинок добавляет ещё одну, не совсем  обычную: возможность скрывать выделенные области изображения наложенным блюром. Плагин также позволяет поворачивать картинки. «HiddenArea» безопасно сохраняет изображения на сервере, загружает их оттуда для редактирования и кеширует через имена файлов (а не через GET-параметры).',
            'str2'=>'«HiddenArea» — полезный инструмент для всех проектов с пользовательским контентом, таких, как социальные сети, маркетплейсы, доски объявлений, медицинские приложения для самодиагностики — в целом любые кейсы, где пользователю важно контролировать уровень конфиденциальности своих изображений.',
            'str3'=>'«HiddenArea» также работает на тачскринах!',
            'str4'=>'Посмотреть на <a href="https://github.com/alexrosspage/hiddenarea" target="_blank"><svg height="22" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="22" data-view-component="true" class="octicon octicon-mark-github">
    <path fill="#0b8693" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
</svg> GitHub</a>'
        ]
    ];

$jsServerStorage="
var serverStorage={};
serverStorage['MAIN_URL']='".MAIN_URL."';
serverStorage['STATICS_URL']='".STATICS_URL."';
serverStorage['TEMP_URL']='".TEMP_URL."';";

include 'index_html.php';
define ('CLOSE','NORMAL');
exit;


function classAutoload($class){
    $file=PUBLIC_DIR.'classes/'.$class.'.php';
    if(is_file($file))
    {
        require_once $file;
    }
    else systemError(0, 'Class «'.$class.'» not found', 'index.php', 0);//функция перехвата ошибок};
}

function systemError($type, $message, $file, $line)//функция перехвата ошибок
{
    if(!defined('CLOSE'))
    {
        header($_SERVER['SERVER_PROTOCOL'].' 503 Service Temporarily Unavailable');
        header('Status: 503 Service Temporarily Unavailable');
        header("Connection: Close");
        file_put_contents(PUBLIC_DIR.'last_php_error.php','CLOSE: '.$type.' '.$message.' '.$file.': '.$line,LOCK_EX);
        
        define('CLOSE','ERROR');
    }
    exit;
}

function shutDown()
{
    if(($error = error_get_last()) && (isset($error['type'])))//передать в исключения системные ошибки если есть ошибка
    {
        systemError($error['type'], $error['message'], $error['file'], $error['line']);
    }
}
function last_directory_cleanup($days)
{
    $file_cleanup=PUBLIC_DIR.'last_directory_cleanup.php';
    $time=time();
    $max_seconds_all=86400;//интервал проверки директорий, по умолчанию 1 сутки
    $max_seconds_direct=$days*86400;
    $file_cleanup_diff=$max_seconds_all+1;
    if((is_file($file_cleanup)) && ($data=file_get_contents($file_cleanup)))
    {
        $file_cleanup_diff=$file_cleanup_diff-$data;
    }
    
    if($file_cleanup_diff>$max_seconds_all)
    {
        $ddir=opendir(PUBLIC_DIR.TEMP.'/');//открываем каталог
        $i=0;
        while(($file=readdir($ddir))!==false)// считываем каталог
        {
            $ip_dir=PUBLIC_DIR.TEMP.'/'.$file;//определяем путь к каталогу или файлу
            
            if(!is_dir($ip_dir))
            {
                continue;
            }
            
            if((time()-filemtime($ip_dir))>$max_seconds_direct)
            {
                $i++;
                $ddir2=opendir($ip_dir);//открываем каталог
                while(($file2=readdir($ddir2))!==false)// считываем каталог
                {
                    if(!is_file($file2))//если корень, то переходим дальше
                    {
                        continue;
                    }
                    unlink($file2);
                }
                closedir($ddir2);
                rmdir($ip_dir);
            }
        }
        closedir($ddir);
        file_put_contents($file_cleanup,$time,LOCK_EX);
        return $i;
    }
    return false;
}
