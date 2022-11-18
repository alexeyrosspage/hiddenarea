<?php
final class imgAutoload
{
    public function get($post)
    {
        $json=[];
        foreach($post as $i=>$val)
        {
            if(isset($val['name'],$val['server'],$val['hash']))
            {
                $i=(int)$i;
                $file=TEMP_PATH.$val['name'].$val['hash'];
            
                if((is_file($file.'b'.$i.'.jpg')) && (is_file($file.'a'.$i.'.jpg')))
                {
                    $json['value'][$i]=1;
                }
            }
        }
        return $json;
    }
}
?>