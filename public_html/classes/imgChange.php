<?php
final class imgChange extends imgSett
{
    public function get($post)
    {
        $R =
            [
                'error' => '',
                'result' => ''
            ];
    
    
        if ((!isset($post['original_pic']))
            || (!$parse = parse_url($post['original_pic']))
            || (empty($parse['host']))
            || (empty($parse['path']))
            || ($parse['host']!=MDIR))
        {
            $R['error']='Некорректный URL[1]';
            return $R;
        }

        $paths=explode('/',$parse['path']);
        $name=basename(array_pop($paths),'.jpg');
        
        if((isset($paths[2])) && (PUBLIC_DIR.$paths[1].'/'.$paths[2].'/'!==TEMP_PATH))
        {
            $R['error']='Некорректный URL[3]';
            return $R;
        }
    
        $file=TEMP_PATH.$name.'.jpg';
        $path_pdir=[];
        
        if(!is_file($file))
        {
            $R['error']='Не удалось найти файл изображения, попробуйте загрузить его ёще раз.';
            return $R;
        }
        
        $id=substr($name,-1,1);
        if($id<1 || $id>9)
        {
            $R['error']='Некорректный URL[5]';
            return $R;
        }
    
        $original_file=$file;
    
        if(!is_dir(TEMP_PATH))
        {
            mkdir(TEMP_PATH,0777,true);
        }
    
        $name=$this->name(0);
        $name_editing='E'.$name;//новое (временное) имя картинки
        
        $editing_file=TEMP_PATH.$name_editing.$this->hash().'.jpg';
        $old=[];
        foreach(glob(TEMP_PATH.$name_editing.'*.jpg') as $val)
        {
            $old[basename($val)]=$val;
        }
    
        if(($post['original_pic']==$post['editing_pic']) || (!$parse2 = parse_url($post['editing_pic'],PHP_URL_PATH)) || (!$file=basename($parse2)) || (!isset($old[$file])))//адреcа совпали, изменений ещё не было
        {
            $current_file=$original_file;
        }
        else//уже было редактирование
        {
            $current_file=$old[$file];
        }
        
        if(!isset($post['change']))
        {
            $R['error']='Не удалось определить действие';
            return $R;
        }
   
        switch($post['change'])
        {
            case('rotate'):
                if((isset($post['direction'])) && ($direct=(int)$post['direction']) && ($direct==90 || $direct==-90))
                {
                    $R=$this->rotate($R,$current_file,$editing_file,$direct);
                }
                else
                {
                    $R['error']='Не удалось найти параметры изображения для rotate';
                }
                break;
        
            case('blur'):
                if(isset($post['sizes']['top'],$post['sizes']['left'],$post['sizes']['height'],$post['sizes']['width']))
                {
                    $R=$this->blur($R,$current_file,$editing_file,$post['sizes']);
                    
                }
                else
                {
                    $R['error']='Не удалось найти параметры изображения для blur';
                }
                break;
        
            case('rollback'):
                $R=$this->rollback($R,$original_file);
                break;
        
        
            case('save'):
                $R=$this->saveUser($R,$original_file,$current_file,$id,$name);
                break;
        
            case('delete'):
                if($post['online'])
                {
                    $R=$this->delete($R,$original_file,$id);
                }
                
                break;
                
            default:
                $R['error']='Не удалось найти обработчик изображения';
                break;
        }
        
        if(!$R['error'])
        {
            $this->old_files_delete($old);
        }

        return $R;
    }
    
    private function old_files_delete($old)
    {
        foreach ($old as $i=>$val)
        {
            unlink($val);
        }
    }
    
    private function Gaussian($resource,$max)
    {
        for ($x=1; $x <=$max; $x++)
        {
            imagefilter($resource, IMG_FILTER_GAUSSIAN_BLUR, 999);//применяем размытие по Гауссу $max раз
        }
        return $resource;
    }

    private function blur($R,$current_file,$editing_file,$sizes)
    {
        $size_img = getimagesize($current_file);
        
		$sizes['left']=round($size_img[0]*$sizes['left']);
		$sizes['top']=round($size_img[1]*$sizes['top']);
		$sizes['width']=round($size_img[0]*$sizes['width']);
		$sizes['height']=round($size_img[1]*$sizes['height']);
        
        if(($sizes['width']<2) || ($sizes['height']<2))//Ошибку не отправляем
        {
            return $R;
        }
        
        $format = strtolower(substr($size_img['mime'], strpos($size_img['mime'], '/')+1));
        if($format!='jpeg')
        {
            $R['error']='Поддерживается только формат jpg(jpeg)';
            return $R;
        }
        
        $old_image = imagecreatefromjpeg($current_file);//исходник
        $image = imagecreatetruecolor($sizes['width'],$sizes['height']);//создаем холст под нужный фрагмент
        imagecopy($image, $old_image, 0, 0, $sizes['left'], $sizes['top'], $sizes['width'], $sizes['height']);//копируем в холст нужный фрагмент из исходника
    
        
        //********************************  Стягиваем исходный фрагмент и фильтруем Гауссом  *********************************//
        $size_sm=//Создадим массив с шириной и высотой уменьшенных изображений
            [
                'w'=>intval($sizes['width']/4),
                'h'=>intval($sizes['height']/4)
            ];

        if($size_sm['w']<1)
        {
            $size_sm['w']=1;
        }

        if(($size_sm['h']<1))
        {
            $size_sm['h']=1;
        }

        $sm = imagecreatetruecolor($size_sm['w'],$size_sm['h']);//содаем минихолст - масштабируем на 25%
        imagecopyresampled($sm, $image, 0, 0, 0, 0, $size_sm['w'], $size_sm['h'], $sizes['width'], $sizes['height']);//стягиваем фрагмент до минихолста
        $sm=$this->Gaussian($sm,10);
        //imagefilter($sm, IMG_FILTER_SMOOTH,99);
        //imagefilter($sm, IMG_FILTER_BRIGHTNESS, 10);
        //***********************************************************************************************************//


        //********************************  Расгягиваем сжатый фрагмент и фильтруем Гауссом  *********************************//
        //Создадим массив с шириной и высотой у изображений
        $size_md=
            [
                'w'=>intval($sizes['width']*2),
                'h'=>intval($sizes['height']*2)
            ];
        $md = imagecreatetruecolor($size_md['w'], $size_md['h']);//Масштабируем результат на 200% и снова делаем размытие
        imagecopyresampled($md, $sm, 0, 0, 0, 0, $size_md['w'], $size_md['h'], $size_sm['w'], $size_sm['h']);

        $md=$this->Gaussian($md,10);
        //imagefilter($md, IMG_FILTER_SMOOTH,99);
        //imagefilter($md, IMG_FILTER_BRIGHTNESS, 10);
        imagedestroy($sm);//удалим уже ненужный сжатый фрагмент
        //***********************************************************************************************************//

        //Масштабируем растянутый фрагмент до исходного размера
        imagecopyresampled($image, $md, 0, 0, 0, 0, $sizes['width'], $sizes['height'], $size_md['w'], $size_md['h']);
        imagedestroy($md);//удалим уже ненужный растягутый фрагмент

        //Можно Применить фильтры увеличенного изображения, но, вероятно, не нужно

        //imagefilter($image, IMG_FILTER_GAUSSIAN_BLUR);
        //imagefilter($image, IMG_FILTER_SMOOTH,99);
        //imagefilter($image, IMG_FILTER_BRIGHTNESS, 10);

        //копируем фрагмент на место
        imagecopy($old_image,$image, $sizes['left'], $sizes['top'],  0, 0, $sizes['width'], $sizes['height']);

        imagejpeg($old_image, $editing_file);//создаём новый файл и замаскированным контентом
        imagedestroy($image);
        
        $R['result']=$this->file_to_url($editing_file);
        return $R;
    }

    private function rotate($R,$current_file,$editing_file,$deg)
    {
        $image=imagecreatefromjpeg($current_file);
        $rotate = imagerotate($image, $deg, 0);
        imagejpeg($rotate, $editing_file, 100);
        imagedestroy($image);
    
        $R['result']=$this->file_to_url($editing_file);
        return $R;
    }

    private function saveUser($R,$original_file_b,$current_file,$id,$name)
    {
        $R['sett']=[];
        
        $hash=$this->hash();
        $name='T'.$name;

        if($original_file_b==$current_file)
        {
            return $R;
        }
        
        $new_file_a=TEMP_PATH.$name.$hash.'a'.$id.'.jpg';
        $new_file_b=TEMP_PATH.$name.$hash.'b'.$id.'.jpg';
        
        if(!$this->imgresize_for_mini($current_file,$new_file_a))
        {
            $R['error']='Не удалось создать миниатюру';
            return $R;
        }
    

        $original_file_a=str_replace('b'.$id.'.jpg','a'.$id.'.jpg',$original_file_b);

        if(is_file($original_file_a))
        {
            unlink($original_file_a);
        }

        if(is_file($original_file_b))
        {
            unlink($original_file_b);
        }
        
        copy($current_file,$new_file_b);
        
        $R['sett']['server']='temp';
        $R['sett']['name']=$name;
        $R['sett']['hash']=$hash;
        $R['sett']['id']=$id;
        $R['sett']['access']=1;
    
        $R['result']=$this->file_to_url($new_file_b);
    
        return $R;
    }
    
    private function rollback($R,$original_file)
    {
        $R['show']=0;
        $R['result']=$this->file_to_url($original_file);

        return $R;
    }

    private function imgresize_for_mini($old_image,$new_name)
    {
        $wa=226;
        $ha=226;

        if(!$size = @GetImageSize($old_image))// вытаскиваем,0-ширину, 1-высоту, 2-тип, 3-текстовая строка
        {
            return false;
        }

        if(count($size)<3)
        {
            return false;
        }

        if(!$image_cr = @imagecreatefromjpeg($old_image))
        {
            return false;
        }

        if(!$image_a = @imagecreatetruecolor($wa, $ha))
        {
            return false;
        }

        if ($size[0] < $size[1])
        {
            $razn=($size[1]-$size[0])/2;
            if($image_pp = @imagecreatetruecolor($size[0], $size[0]))
            {
                imagecopy($image_pp,$image_cr, 0, 0,0,$razn,   $size[0], $size[1]-$razn);
                imagecopyresampled($image_a, $image_pp, 0, 0, 0, 0, $wa, $ha, $size[0], $size[0]);
            }
            else
            {
                return false;
            }
        }
        else
        {
            $razn=($size[0]-$size[1])/2;
            if($image_pp = @imagecreatetruecolor($size[1], $size[1]))
            {
                imagecopy($image_pp,$image_cr, 0, 0,$razn,0,   $size[0]-$razn, $size[1]);
                imagecopyresampled($image_a, $image_pp, 0, 0, 0, 0, $wa, $ha, $size[1], $size[1]);
            }
            else
            {
                return false;
            }
        }

        imagejpeg($image_a, $new_name, 100);
        imagedestroy($image_pp);
        
        return $new_name;
    }

    private function delete($R,$original_file,$id)
    {
        $R['sett']=[];
        
        $original_file_mini=str_replace('b'.$id.'.jpg','a'.$id.'.jpg',$original_file);
        
        if(is_file($original_file))
        {
            unlink($original_file);
        }
    
        if(is_file($original_file_mini))
        {
            unlink($original_file_mini);
        }
        $R['result']=$id;
       
        return $R;
    }
    
    private function file_to_url($file)
    {
        return str_replace([TEMP_PATH,'\\'],[MAIN_URL.'/'.TEMP_DIR.'/','','/'],$file);
    }
}
?>