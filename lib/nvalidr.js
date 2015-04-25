'use strict';

var moment = require('moment');



function nvalidr (s) {
	return new Jvalid(s);
}

var Jvalid = function (s)
{
	if (typeof s === 'number') {
		s = '' + s;
	} else if (!s) {
		s = '';
	} else if (typeof s !== 'string') {
		throw 'Unexpected value. ' + (typeof s);
	}
	this.s = s;
};

Jvalid.prototype.trim = function () {
	this.s = this.s.replace(/^[\s　]+|[\s　]+$/g,'');
	return this;
};

Jvalid.prototype.rtrim = function () {
	this.s = this.s.replace(/[\s　]+$/g,'');
	return this;
};

Jvalid.prototype.ltrim = function () {
	this.s = this.s.replace(/^[\s　]+/g,'');
	return this;
};



Jvalid.prototype.date = function (ops, onerr) {
	if (this.s) {

		if (typeof ops === 'function') {
			onerr = ops;
			ops = {};
		}
		ops = ops || {};

		var format = ops.format || 'YYYY-MM-DD';
		var patterns = ops.patterns || ['YYYY-MM-DD', 'YY-MM-DD', 'MM-DD'];

		this.trim();
		this.replace(nvalidr.H_NUM, nvalidr.H_ALPHA, nvalidr.H_KIGO);

		var d = moment(this.s, patterns);

		if (d.isValid()) {
			this.s = d.format(format);
		} else if (onerr) {
			onerr();
		}
	}

	return this;
};


Jvalid.prototype.replace = function (fr, to) {

	if ((typeof fr === 'string' || fr instanceof RegExp) && typeof to === 'string') {

		if (!(fr instanceof RegExp)) {
			fr = new RegExp(_reesc(fr), 'g');
		}
		this.s = this.s.replace(fr, to);

	} else {

		var len = arguments.length;
		var maps = Array.prototype.slice.call(arguments);

		for (var i = 0; i < len; i++) {

			var map = maps[i];
			if (map instanceof Array) {

				for (var ii = 0; ii < map.length; ii++) {
					var m = map[ii];
					var fr = m[0];
					var to = m[1];
					if (!(fr instanceof RegExp)) {
						fr = new RegExp(_reesc(fr), 'g');
					}
					this.s = this.s.replace(fr, to);
				}

			} else if (typeof map === 'object') {

				for (var fr in map) {
					var re = new RegExp(_reesc(fr), 'g');
					var to = map[fr];
					this.s = this.s.replace(re, to);
				}

			} else {
				throw 'Unexpected type of map. given type: ' + map +' '+ (typeof map);
			}

		}
	}

	return this;
};



Jvalid.prototype.hiragana = function(ops, onerr) {

	//arrange options
	if (typeof ops === 'function') {
		onerr = ops;
		ops = {};
	}
	ops = ops || {};
	ops.maps = ops.maps || [nvalidr.Z_KATA, nvalidr.KATA2HIRA];

	//normalize
	this.replace.apply(this, ops.maps);

	//validation
	var isAllHiragana = new RegExp('^[' + _zHiragana.join('') + ']+$');
	if (!this.s.match(isAllHiragana) && onerr) {
		onerr();
	}

	return this
};


Jvalid.prototype.katakana = function(ops, onerr) {

	//arrange options
	if (typeof ops === 'function') {
		onerr = ops;
		ops = {};
	}
	ops = ops || {};
	ops.maps = ops.maps || [nvalidr.HIRA2KATA, nvalidr.Z_KATA];

	//normalize
	this.replace.apply(this, ops.maps);

	//validation
	var isAllHiragana = new RegExp('^[' + _zHiragana.join('') + ']+$');
	if (!this.s.match(isAllHiragana) && onerr) {
		onerr();
	}

	return this
};




var _zNum = [
	'０', '１', '２', '３', '４',
	'５', '６', '７', '８', '９'
];

var _hNum = [
	'0', '1', '2', '3', '4',
	'5', '6', '7', '8', '9'
];

var _zAlpha = [
	'ａ', 'ｂ', 'ｃ', 'ｄ', 'ｅ',
	'ｆ', 'ｇ', 'ｈ', 'ｉ', 'ｊ',
	'ｋ', 'ｌ', 'ｍ', 'ｎ', 'ｏ',
	'ｐ', 'ｑ', 'ｒ', 'ｓ', 'ｔ',
	'ｕ', 'ｖ', 'ｗ', 'ｘ', 'ｙ', 'ｚ',
	'Ａ', 'Ｂ', 'Ｃ', 'Ｄ', 'Ｅ',
	'Ｆ', 'Ｇ', 'Ｈ', 'Ｉ', 'Ｊ',
	'Ｋ', 'Ｌ', 'Ｍ', 'Ｎ', 'Ｏ',
	'Ｐ', 'Ｑ', 'Ｒ', 'Ｓ', 'Ｔ',
	'Ｕ', 'Ｖ', 'Ｗ', 'Ｘ', 'Ｙ', 'Ｚ'
];

var _hAlpha = [
	'a', 'b', 'c', 'd', 'e',
	'f', 'g', 'h', 'i', 'j',
	'k', 'l', 'm', 'n', 'o',
	'p', 'q', 'r', 's', 't',
	'u', 'v', 'w', 'x', 'y', 'z',
	'A', 'B', 'C', 'D', 'E',
	'F', 'G', 'H', 'I', 'J',
	'K', 'L', 'M', 'N', 'O',
	'P', 'Q', 'R', 'S', 'T',
	'U', 'V', 'W', 'X', 'Y', 'Z'
];

var _zHiragana = [
	'ぁ','ぃ','ぅ','ぇ','ぉ',
	'っ','ゃ','ゅ','ょ','ゔ',
	'が','ぎ','ぐ','げ','ご',
	'ざ','じ','ず','ぜ','ぞ',
	'だ','ぢ','づ','で','ど',
	'ば','び','ぶ','べ','ぼ',
	'ぱ','ぴ','ぷ','ぺ','ぽ',
	'あ','い','う','え','お',
	'か','き','く','け','こ',
	'さ','し','す','せ','そ',
	'た','ち','つ','て','と',
	'な','に','ぬ','ね','の',
	'は','ひ','ふ','へ','ほ',
	'ま','み','む','め','も',
	'や','ゆ','よ',
	'ら','り','る','れ','ろ',
	'わ','ゐ','ゑ','を','ん'
];

var _zKatakana = [
	'ァ','ィ','ゥ','ェ','ォ',
	'ッ','ャ','ュ','ョ','ヴ',
	'ガ','ギ','グ','ゲ','ゴ',
	'ザ','ジ','ズ','ゼ','ゾ',
	'ダ','ヂ','ヅ','デ','ド',
	'バ','ビ','ブ','ベ','ボ',
	'パ','ピ','プ','ペ','ポ',
	'ア','イ','ウ','エ','オ',
	'カ','キ','ク','ケ','コ',
	'サ','シ','ス','セ','ソ',
	'タ','チ','ツ','テ','ト',
	'ナ','ニ','ヌ','ネ','ノ',
	'ハ','ヒ','フ','ヘ','ホ',
	'マ','ミ','ム','メ','モ',
	'ヤ','ユ','ヨ',
	'ラ','リ','ル','レ','ロ',
	'ワ','ヰ','ヱ','ヲ','ン'
];

var _hKatakana = [
	'ｧ' ,'ｨ' ,'ｩ' ,'ｪ' ,'ｫ',
	'ｯ' ,'ｬ' ,'ｭ' ,'ｮ' ,'ｳﾞ',
	'ｶﾞ','ｷﾞ','ｸﾞ','ｹﾞ','ｺﾞ',
	'ｻﾞ','ｼﾞ','ｽﾞ','ｾﾞ','ｿﾞ',
	'ﾀﾞ','ﾁﾞ','ﾂﾞ','ﾃﾞ','ﾄﾞ',
	'ﾊﾞ','ﾋﾞ','ﾌﾞ','ﾍﾞ','ﾎﾞ',
	'ﾊﾟ','ﾋﾟ','ﾌﾟ','ﾍﾟ','ﾎﾟ',
	'ｱ','ｲ','ｳ','ｴ','ｵ',
	'ｶ','ｷ','ｸ','ｹ','ｺ',
	'ｻ','ｼ','ｽ','ｾ','ｿ',
	'ﾀ','ﾁ','ﾂ','ﾃ','ﾄ',
	'ﾅ','ﾆ','ﾇ','ﾈ','ﾉ',
	'ﾊ','ﾋ','ﾌ','ﾍ','ﾎ',
	'ﾏ','ﾐ','ﾑ','ﾒ','ﾓ',
	'ﾔ','ﾕ','ﾖ',
	'ﾗ','ﾘ','ﾙ','ﾚ','ﾛ',
	'ﾜ','ｲ','ｴ','ｦ','ﾝ'
];

var _zKigo = [
	'。','、','「','」','・','ー',
	'．', '，', '！', '？', '”',
	'’', '‘', '＠', '＿', '：',
	'；', '＃', '＄', '％', '＆',
	'（', '）', '－', '＝', '＊',
	'＋', '－', '／', '＜', '＞',
	'［', '￥', '］', '＾', '｛',
	'｜', '｝', '～'
];

var _hKigo = [
	'｡', '､', '｢', '｣', '･', 'ｰ',
	'.', ',', '!', '?', '"',
	'\'', '`', '@', '_', ':',
	';', '#', '$', '%', '&',
	'(', ')', '-', '=', '*',
	'+', '-', '/', '<', '>',
	'[', '¥', ']', '^', '{',
	'|', '}', '~'
];


function _reesc(chars) {
	return chars.replace(_reEscRegExp, '\\$&');
}
var _reEscRegExp = /\W/g;


function _mkmap(fr, to) {
	var map = [];
	for (var i = 0; i < fr.length; i++) {
		var f = fr[i];
		var t = to[i];
		map.push([new RegExp(_reesc(f), 'g'), t]);
	}
	return map;
}

nvalidr.H_NUM =
nvalidr.HN = _mkmap(_zNum, _hNum);
nvalidr.Z_NUM =
nvalidr.ZN = _mkmap(_hNum, _zNum);
nvalidr.H_ALPHA =
nvalidr.HA = _mkmap(_zAlpha, _hAlpha);
nvalidr.Z_ALPHA =
nvalidr.ZA = _mkmap(_hAlpha, _zAlpha);
nvalidr.H_KIGO =
nvalidr.HKG = _mkmap(_zKigo, _hKigo);
nvalidr.Z_KIGO =
nvalidr.ZKG = _mkmap(_hKigo, _zKigo);
nvalidr.H_KATA =
nvalidr.HK = _mkmap(_zKatakana, _hKatakana);
nvalidr.Z_KATA =
nvalidr.ZK = _mkmap(_hKatakana, _zKatakana);
nvalidr.HIRA2KATA = _mkmap(_zHiragana, _zKatakana);
nvalidr.KATA2HIRA = _mkmap(_zKatakana, _zHiragana);



module.exports = nvalidr;



