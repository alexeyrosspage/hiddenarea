<?php
class imgSett
{
    public function hash()//всегда начинается с буквы, а заканчивается цифрой
    {
        return substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 3).rand(0,9);
    }
    public function name($salt)
    {
        return 'T'.substr(md5(session_id().$salt),0,8);
    }
}
?>