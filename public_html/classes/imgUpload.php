<?php
final class imgUpload extends imgSett
{
    public function get($id)
    {
        $R=
            [
                'server'=>null,
                'error'=>null,
                'path'=>null,
                'hash'=>null,
                'name'=>null,
                'id'=>null
            ];

        if(!isset($_FILES['pic']['error']))
        {
            return $R;
        }

        $id=(int)$id;
        if($id<1 || $id>9)
        {
            $R['error']='Неверный ID';
            return $R;
        }
        $R['id']=$id;

        if($_FILES['pic']['error'])
        {
            switch($_FILES['pic']['error'])
			{
				case(1):
					$R['error']='Допускаются фотографии размером до 5 мегабайт. Вы можете воспользоваться бесплатным сервисом <a href="https://imagecompressor.com/ru/">Optimizilla</a>, чтобы сжать свои фото.';
					break;

				case(2):
					$R['error']='Допускаются фотографии размером не больше 5 мегабайт. Вы можете воспользоваться бесплатным сервисом <a href="https://imagecompressor.com/ru/">Optimizilla</a>, чтобы сжать свои фото.';
					break;

				case(3):
					$R['error']='Не удалось загрузить фотографию. Попробуйте ещё раз.';
					break;

				case(4):
					$R['error']='Файл картинки не загружен';
					break;

				default:
					$R['error']='Ошибка загрузки файла картинки';
					break;
			}

            return $R;
        }

        $ext=pathinfo(basename($_FILES['pic']['name']), PATHINFO_EXTENSION);
        $ext=strtolower($ext);
        if(($ext!='jpg') && ($ext!='jpeg') && ($ext!='png'))
        {
            $R['error']='разрешаются фотографии только JPG или PNG формата';
            return $R;
        }

        $imageinfo = getimagesize($_FILES['pic']['tmp_name']);
        if (($imageinfo['mime']!='image/jpg') && ($imageinfo['mime']!='image/png') && ($imageinfo['mime']!='image/jpeg'))
        {
            $R['error']='разрешаются файлы только JPG или PNG формата';
            return $R;
        }

        if($_FILES['pic']['size']>5250000)
        {
            $R['error']='Допускаются файлы размером не больше 5 мегабайт. Вы можете воспользоваться бесплатным сервисом <a href="https://imagecompressor.com/ru/">Optimizilla</a>, чтобы сжать свои фото.';
            return $R;
        }

        $path=TEMP_PATH;

        if(!is_dir($path))
        {
            if(!mkdir($path,0777,true))
            {
                $R['error']='Фото-каталог не создан. Обратитесь в службу Технической поддержки.';
                return $R;
            }
        }
    
        $R2=$this->download($path,$ext);
        if(!$R2['uploadfile'])
        {
            $R['error']=$R2['error'];
            return $R;
        }
        
        $name=$this->name(0);
        $hash=$this->hash();
        //$files=$this->files($path,$name,$id,$hash);
    
        if(!$this->imgresize_ad_pics($path,$name,$id,$hash,$R2['uploadfile']))
        {
            $R['error']='Не удалось записать файл картинки';
            return $R;
        }

        $R['server']='temp';
        $R['name']=$name;
        $R['hash']=$hash;

        return $R;
    }

    private function imgresize_ad_pics($path,$name,$id,$hash,$uploadfile)
    {
        $old=[];
        $arr=glob($path.$name.'*[ab]'.$id.'.jpg');
        if($arr)
        {
            foreach($arr as $val)
            {
                $old[]=$val;
            }
        }
    
        $new=
            [
                'a'=>$path.$name.$hash.'a'.$id.'.jpg',
                'b'=>$path.$name.$hash.'b'.$id.'.jpg'
            ];
        
        $wa=226;
        $ha=226;
        $wb=800;
        $hb=600;
        $logo=0;

        if(!$size = @GetImageSize($uploadfile))// вытаскиваем,0-ширину, 1-высоту, 2-тип, 3-текстовая строка
        {
            unlink($uploadfile);
            return false;
        }

        if(count($size)<3)
        {
            unlink($uploadfile);
            return false;
        }

        if($size[2]==2)
        {
            if(!$image_cr = @imagecreatefromjpeg($uploadfile))
            {
                unlink($uploadfile);
                return false;
            }
        }
        else
        {
            if($size[2]==3)
            {
                if(!$image_cr = @imagecreatefrompng($uploadfile))
                {
                    unlink($uploadfile);
                    return false;
                }
            }
            else
            {
                unlink($uploadfile);
                return false;
            }
        }

        unlink($uploadfile);
    
        if(!$image_a = @imagecreatetruecolor($wa, $ha))
        {
            return false;
        }
        
        if ($size[0] < $size[1])
        {
            $razn=($size[1]-$size[0])/2;
            if(!$image_pp = @imagecreatetruecolor($size[0], $size[0]))
            {
                return false;
            }
            
            imagecopy($image_pp,$image_cr, 0, 0,0,$razn,   $size[0], $size[1]-$razn);
            imagecopyresampled($image_a, $image_pp, 0, 0, 0, 0, $wa, $ha, $size[0], $size[0]-$logo);
        }
        else
        {
            $razn=($size[0]-$size[1])/2;
            if(!$image_pp = @imagecreatetruecolor($size[1], $size[1]))
            {
                return false;
            }
            
            imagecopy($image_pp,$image_cr, 0, 0,$razn,0,   $size[0]-$razn, $size[1]);
            imagecopyresampled($image_a, $image_pp, 0, 0, 0, 0, $wa, $ha, $size[1], $size[1]-$logo);
        }


        imagejpeg($image_a, $new['a'], 75);
        imagedestroy($image_pp);
        

        if($size[0]<$wb)$wb=$size[0]+5;
        if($size[1]<$hb)$hb=$size[1]+5;

        if ($size[0] < $size[1])
        {
            $delitel=$size[0]/$size[1];
            if($delitel<0.5)
            {
                $delitel=0.5;
            }
            $wb=$delitel*$hb;
        }
        else
        {
            $delitel=$size[1]/$size[0];
            if($delitel<0.5)
            {
                $delitel=0.5;
            }
            $hb=$delitel*$wb;
        }

        if(!$image_b = @imagecreatetruecolor($wb, $hb))
        {
            unlink($new['a']);
            return false;
        }
    
        imagecopyresampled($image_b, $image_cr, 0, 0, 0, 0, $wb, $hb, $size[0], $size[1]-$logo);
    
        imagejpeg($image_b, $new['b'], 75);
        imagedestroy($image_b);
        
        if($old)
        {
            foreach ($old as $val)
            {
                unlink($val);
            }
        }
    
        return true;
    }
    
    private function download($path,$ext)
    {
        $R=
            [
                'error'=>'',
                'uploadfile'=>''
            ];
        
        $uploadfile = $path.'tmp'.time().'.'.$ext;
        if(!move_uploaded_file($_FILES['pic']['tmp_name'], $uploadfile))
        {
            $R['error']='Сбой загрузки файла картинки';
            return $R;
        }
        
        if(!is_file($uploadfile))
        {
            $R['error']='Не удалось сохранить файл картинки';
            return $R;
        }
        
        $R['uploadfile']=$uploadfile;
        return $R;
    }
}
?>