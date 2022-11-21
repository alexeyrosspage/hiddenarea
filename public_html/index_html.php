<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="Content-language" content="ru"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="robots" content="noindex, nofollow">
<meta name="copyright" content="">
<meta name="author" content="">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
<link rel="stylesheet" type="text/css" href="<?=STATICS_URL.'/css/style.css?'.$cache['style.css']?>">
<title>HiddenArea</title>
</head>
<body>
<div class="hiddenarea">
	<div>
		<div id="lngs">
			<span class="eng <?=$lng_en?>" data-lng="0">EN</span>
			<span class="rus <?=$lng_ru?>" data-lng="1">RU</span>
		</div>
		<div class="description">
			<h1>LightBox <b><i>HiddenArea</i></b></h1>
			<p><?=$lngs[$lng]['str1']?></p>
			<p><?=$lngs[$lng]['str2']?></p>
			<p><?=$lngs[$lng]['str3']?></p>
            <p><?=$lngs[$lng]['str4']?></p>
		</div>
		<div class="uploads" id="hiddenarea" data-number="3" data-message="Мы рекомендуем не загружать фото с изображением где присутвуют номера документов, машин, лица детей и т.д. "></div>
	</div>
</div>
<div id="all_tips"></div>
<script defer src="<?=STATICS_URL.'js/jquery_2.2.4.min.js'?>"></script>
<script><?=$jsServerStorage?></script>
<script defer src="<?=STATICS_URL.'js/main.js?'.$cache['main.js']?>"></script>
<script defer src="<?=STATICS_URL.'js/tips.js?'.$cache['tips.js']?>"></script>
<script defer src="<?=STATICS_URL.'js/hiddenarea.js?'.$cache['hiddenarea.js']?>"></script>
</body>
</html>