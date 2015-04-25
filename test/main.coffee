nvalidr = require '../lib/nvalidr.js'
assert = require 'power-assert'

describe 'nvalidr/', () ->

	describe 'trim/', () ->

		it 'trim', () ->
			org = '  aa  a		\n\r　　	';
			dst = nvalidr(org).trim().s;
			assert dst == 'aa  a'

		it 'rtrim', () ->
			org = '  aa  a		\n\r　　	';
			dst = nvalidr(org).rtrim().s;
			assert(dst == '  aa  a')

		it 'ltrim', () ->
			org = '  aa  a		\n\r　　	';
			dst = nvalidr(org).ltrim().s;
			assert dst == 'aa  a		\n\r　　	'


	describe 'date/', () ->
		it 'invalid date string', () ->
			org = 'あいう';
			errmsg = null
			nvalidr(org).date () ->
				errmsg = '日付じゃありません'
			assert errmsg == '日付じゃありません'

		it 'valid date string YYYY-MM-DD', () ->
			org = '2015/8/12';
			dst = nvalidr(org).date().s
			assert dst == '2015-08-12'

		it 'valid date string MM-DD', () ->
			org = '8/12';
			dst = nvalidr(org).date().s
			assert dst == new Date().getFullYear() + '-08-12'

		it 'with format', () ->
			org = '2222/8/12';
			dst = nvalidr(org).date({format:'YYYY/MM/DD'}).s
			assert dst == '2222/08/12'

		it 'with patterns', () ->
			org = '8/12/2222';
			dst = nvalidr(org).date({patterns:'MM/DD/YYYY'}).s
			assert dst == '2222-08-12'

		it 'wit options and error', () ->
			org = 'あいう';
			errmsg = null
			nvalidr(org).date {format:'YYYY/MM/DD'}, () ->
				errmsg = '日付じゃありません'
			assert errmsg == '日付じゃありません'


	describe 'replace/', () ->

		it 'from/dest string', () ->
			org = 'あいうえお'
			dst = nvalidr(org).replace('い', 'あ').s
			assert dst == 'ああうえお'

		it 'map of object', () ->
			org = 'あいうえお'
			dst = nvalidr(org).replace({'い':'あ','う':'あ'}).s
			assert dst == 'あああえお'

		it 'map of array', () ->
			org = 'あいうえお'
			dst = nvalidr(org).replace([['い','あ'],['う','あ']]).s
			assert dst == 'あああえお'

		it 'map of array with the from of RegExp', () ->
			org = 'あいうえお'
			dst = nvalidr(org).replace([[/[あいうえお]/g, 'あ'],[/(あ{3})(あ{2})/, '$1-$2']]).s
			assert dst == 'あああ-ああ'


		it '全角かたかな => 全角ひらがな', () ->
			org = 'アイウエオカサタナハマヤラワン'
			cnv = nvalidr(org).replace(nvalidr.KATA2HIRA).s
			assert cnv == 'あいうえおかさたなはまやらわん'

		it '全角かたかな => 半角かたかな', () ->
			org = 'アイウエオカサタナハマヤラワンガプ、。「」・ー'
			cnv = nvalidr(org).replace(nvalidr.H_KATA).s
			assert cnv == 'ｱｲｳｴｵｶｻﾀﾅﾊﾏﾔﾗﾜﾝｶﾞﾌﾟ､｡｢｣･ｰ'

		it '全角ひらがな => 全角かたかな', () ->
			org = 'あいうえおかさたなはまやらわん'
			cnv = nvalidr(org).replace(nvalidr.HIRA2KATA).s
			assert cnv == 'アイウエオカサタナハマヤラワン'

		it '全角ひらがな => 半角かたかな', () ->
			org = 'あいうえおかさたなはまやらわんがぷ、。「」・ー'
			cnv = nvalidr(org).replace(nvalidr.HIRA2KATA, nvalidr.H_KATA).s
			assert cnv == 'ｱｲｳｴｵｶｻﾀﾅﾊﾏﾔﾗﾜﾝｶﾞﾌﾟ､｡｢｣･ｰ'

		it '全角アルファベット => 半角アルファベット', () ->
			org = 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'
			cnv = nvalidr(org).replace(nvalidr.H_ALPHA).s
			assert cnv == 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

		it '全角数字 => 半角数字', () ->
			org = '０１２３４５６７８９'
			cnv = nvalidr(org).replace(nvalidr.H_NUM).s
			assert cnv == '0123456789'

		it '全角記号 => 半角記号', () ->
			org = '．，！？”’‘＠＿：；＃＄％＆（）－＝＊＋－／＜＞［￥］＾｛｜｝～'
			cnv = nvalidr(org).replace(nvalidr.H_KIGO).s
			assert cnv == '.,!?"\'`@_:;#$%&()-=*+-/<>[¥]^{|}~'

		it '半角アルファベット => 全角アルファベット', () ->
			org = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
			cnv = nvalidr(org).replace(nvalidr.Z_ALPHA).s
			assert cnv == 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'

		it '半角数字 => 全角数字', () ->
			org = '0123456789'
			cnv = nvalidr(org).replace(nvalidr.Z_NUM).s
			assert cnv == '０１２３４５６７８９'

		it '半角記号 => 全角記号', () ->
			org = '.,!?"\'`@_:;#$%&()-=*+-/<>[¥]^{|}~'
			cnv = nvalidr(org).replace(nvalidr.Z_KIGO).s
			assert cnv == '．，！？”’‘＠＿：；＃＄％＆（）－＝＊＋－／＜＞［￥］＾｛｜｝～'





