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
			err = null
			nvalidr(org).date {format:'YYYY/MM/DD'}, () ->
				err = '日付じゃありません'
			assert err == '日付じゃありません'


	describe 'replace/', () ->

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
			org = 'アイウエオカサタナハマヤラワンガプ'
			cnv = nvalidr(org).replace(nvalidr.H_KATA).s
			assert cnv == 'ｱｲｳｴｵｶｻﾀﾅﾊﾏﾔﾗﾜﾝｶﾞﾌﾟ'

		it '全角ひらがな => 全角かたかな', () ->
			org = 'あいうえおかさたなはまやらわん'
			cnv = nvalidr(org).replace(nvalidr.HIRA2KATA).s
			assert cnv == 'アイウエオカサタナハマヤラワン'

		it '全角ひらがな => 半角かたかな', () ->
			org = 'あいうえおかさたなはまやらわんがぷ'
			cnv = nvalidr(org).replace(nvalidr.HIRA2KATA, nvalidr.H_KATA).s
			assert cnv == 'ｱｲｳｴｵｶｻﾀﾅﾊﾏﾔﾗﾜﾝｶﾞﾌﾟ'

		it '全角アルファベット => 半角アルファベット', () ->
			org = 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'
			cnv = nvalidr(org).replace(nvalidr.H_ALPHA).s
			assert cnv == 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

		it '全角数字 => 半角数字', () ->
			org = '０１２３４５６７８９'
			cnv = nvalidr(org).replace(nvalidr.H_NUM).s
			assert cnv == '0123456789'

		it '全角記号 => 半角記号', () ->
			org = '．，！？”’‘＠＿：；＃＄％＆（）＝＊＋－／＜＞［￥］＾｛｜｝～、。「」・ー'
			cnv = nvalidr(org).replace(nvalidr.H_KIGO).s
			assert cnv == '.,!?"\'`@_:;#$%&()=*+-/<>[¥]^{|}~､｡｢｣･ｰ'

		it '半角アルファベット => 全角アルファベット', () ->
			org = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
			cnv = nvalidr(org).replace(nvalidr.Z_ALPHA).s
			assert cnv == 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'

		it '半角数字 => 全角数字', () ->
			org = '0123456789'
			cnv = nvalidr(org).replace(nvalidr.Z_NUM).s
			assert cnv == '０１２３４５６７８９'

		it '半角記号 => 全角記号', () ->
			org = '.,!?"\'`@_:;#$%&()=*+-/<>[¥]^{|}~､｡｢｣･ｰ'
			cnv = nvalidr(org).replace(nvalidr.Z_KIGO).s
			assert cnv == '．，！？”’‘＠＿：；＃＄％＆（）＝＊＋－／＜＞［￥］＾｛｜｝～、。「」・ー'

		it '半角スペース => 全角スペース', () ->
			org = ' '
			cnv = nvalidr(org).replace(nvalidr.Z_SPACE).s
			assert cnv == '　'

		it '全角スペース => 半角スペース', () ->
			org = '　'
			cnv = nvalidr(org).replace(nvalidr.H_SPACE).s
			assert cnv == ' '

		it 'skip chars', () ->
			org = '０１２３４５６７８９'
			cnv = nvalidr(org).replace(nvalidr.H_NUM, { skip:'７８' }).s
			assert cnv == '0123456７８9'

		it 'extra chars', () ->
			org = '０１２３４５６７．８９'
			cnv = nvalidr(org).replace(nvalidr.H_NUM, { extra:[['．','.']] }).s
			assert cnv == '01234567.89'


	describe 'validation/', () ->

		it 'normtext', () ->
			org = 'ｶﾗﾊﾞｲﾖあかさたな松本伊代０２３４ＡＢＣ、。「」'
			cnv = nvalidr(org).normtext().s
			assert cnv == 'カラバイヨあかさたな松本伊代0234ABC、。「」'

		it 'hiragana', () ->
			org = 'ｶﾗﾊﾞｲﾖばーすﾛｯﾃ'
			cnv = nvalidr(org).hiragana().s
			assert cnv == 'からばいよばーすろって'

		it 'hiragana => failed', () ->
			err = null
			nvalidr('ｶﾗﾊﾞｲﾖ漢字ばーすﾛｯﾃ').hiragana () ->
				err = 'ひらがなで入力してください。'
			assert err == 'ひらがなで入力してください。'

		it 'katakana', () ->
			org = 'ｶﾗﾊﾞｲﾖばーすﾛｯﾃ'
			cnv = nvalidr(org).katakana().s
			assert cnv == 'カラバイヨバースロッテ'

		it 'number', () ->
			org = '0１２347２'
			cnv = nvalidr(org).number().s
			assert cnv == '0123472'

		it 'int', () ->
			org = '-0１２，347'
			cnv = nvalidr(org).int().s
			assert cnv == '-012347'

		it 'float', () ->
			org = '-0１２，347．２'
			cnv = nvalidr(org).float().s
			assert cnv == '-012347.2'

		it 'alpha', () ->
			org = 'ａｂｃｄｅｆｇＨＩＪＫＬＭＮ'
			cnv = nvalidr(org).alpha().s
			assert cnv == 'abcdefgHIJKLMN'

		it 'alphanum', () ->
			org = '0123ABＸＹＺ７８９'
			cnv = nvalidr(org).alphanum().s
			assert cnv == '0123ABXYZ789'

		it 'phone', () ->
			org = '０１２３−４５６７ー８９０漢字'
			cnv = nvalidr(org).phone().s
			assert cnv == '0123-4567-890'

		it 'email', () ->
			org = 'ｉｎｆｏ＠ｈｏｇｅｈｏｇｅ.com';
			cnv = nvalidr(org).email().s
			assert cnv == 'info@hogehoge.com'

		it 'maxlen => success', () ->
			errmsg = null;
			nvalidr('１２３４５６７').maxlen(7, () ->
					errmsg = '7文字以内で入力してください。'
				).s
			assert errmsg == null;

		it 'maxlen => fail', () ->
			errmsg = null;
			nvalidr('１２３４５６７８').maxlen(7, () ->
					errmsg = '7文字以内で入力してください。'
				).s
			assert errmsg == '7文字以内で入力してください。'

		it 'minlen => success', () ->
			errmsg = null;
			nvalidr('１２３４５６７').minlen(7, () ->
					errmsg = '7文字以内で入力してください。'
				).s
			assert errmsg == null;

		it 'minlen => fail', () ->
			errmsg = null;
			nvalidr('１２３４５６').minlen(7, () ->
					errmsg = '7文字以上で入力してください。'
				).s
			assert errmsg == '7文字以上で入力してください。';

		it 'length => success', () ->
			errmsg = null;
			nvalidr('１２３４５６７８').length(4, 8, () ->
					errmsg = '7文字以内で入力してください。'
				).s
			assert errmsg == null;

		it 'length => fail', () ->
			errmsg = null;
			nvalidr('１２３').length(4, 8, () ->
					errmsg = '4〜8文字で入力してください。'
				).s
			assert errmsg == '4〜8文字で入力してください。';

		it 'max => fail', () ->
			errmsg = null;
			nvalidr(21).max(20, () ->
					errmsg = '20以下の数値で指定してください。'
				).s
			assert errmsg == '20以下の数値で指定してください。';

		it 'min => fail', () ->
			errmsg = null;
			nvalidr('19').min(20, () ->
					errmsg = '20以上の数値で指定してください。'
				).s
			assert errmsg == '20以上の数値で指定してください。';

		it 'range => fail', () ->
			errmsg = null;
			nvalidr('19').range(20, 40, () ->
					errmsg = '20〜40の数値で指定してください。'
				).s
			assert errmsg == '20〜40の数値で指定してください。';

		it 'presence => fail', () ->
			errmsg = null;
			nvalidr('').presence(() ->
					errmsg = '値を入力してください。'
				).s
			assert errmsg == '値を入力してください。';




