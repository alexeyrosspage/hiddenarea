<?php
if(!isset($_POST['type']))exit;

$construct=function ($result)
{
    echo $result;
    exit;
};

switch ($_POST['type'])
{
    case('pic_change')://php-server выступает только в качестве хранилища, все переменные передаются
        $R=(new imgChange())->get($_POST);
        $construct(json_encode($R,JSON_UNESCAPED_UNICODE|JSON_NUMERIC_CHECK));
        break;
        
    case('pic_check_ad'):
        if(isset($_POST['pics']) && is_array($_POST['pics']))
        {
            $R=(new imgAutoload())->get($_POST['pics']);
            $construct(json_encode($R,JSON_UNESCAPED_UNICODE|JSON_NUMERIC_CHECK));
        }
        break;

    case('pic_upload'):
        if(isset($_POST['id']))
        {
            $R=(new imgUpload())->get($_POST['id']);
            $construct(json_encode($R,JSON_UNESCAPED_UNICODE|JSON_NUMERIC_CHECK));
        }
        break;
        
    default:exit;
}

exit;