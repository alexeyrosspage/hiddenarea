<?php
error_reporting(E_ALL);
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
setlocale(LC_ALL, 'ru_RU.UTF-8');
setlocale(LC_NUMERIC, 'C');
session_start();

spl_autoload_register('classAutoload');//функции автоподгрузки
register_shutdown_function('shutDown');//запуск функции после завершения скрипта
set_error_handler('systemError');//перехват системных ошибок

define ('D1',dirname(__DIR__).'/');
define ('PUBLIC_DIR',D1.'public_html/');
define ('MDIR', basename(D1));

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
            'str2'=>'«HiddenArea» is a useful tool for all progects with user\'s content like a social media, marketplaces, classified ads, medical applications for self-diagnosis and other cases when user want to control the level of privacy on their images.',
            'str3'=>'«HiddenArea» works on touch screens too!'
        ],
        1=>[
            'str1'=>'jQuery плагин «HiddenArea» к классическим опциям редактирования картинок добавляет ещё одну, не совсем  обычную: возможность скрывать выделенные области изображения наложенным блюром. Плагин также позволяет поворачивать картинки. «HiddenArea» безопасно сохраняет изображения на сервере, загружает их оттуда для редактирования и кеширует через имена файлов (а не через GET-параметры).',
            'str2'=>'«HiddenArea» — полезный инструмент для всех проектов с пользовательским контентом, таких, как социальные сети, маркетплейсы, доски объявлений, медицинские приложения для самодиагностики — в целом любые кейсы, где пользователю важно контролировать уровень конфиденциальности своих изображений.',
            'str3'=>'«HiddenArea» также работает на тачскринах!'
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