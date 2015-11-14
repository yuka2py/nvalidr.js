'use strict';

var moment = require('moment');
var assign = require('object-assign');



function nvalidr (s) {
	return new Nvalidr(s);
}


var Nvalidr = function (s)
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

nvalidr.Nvalidr = Nvalidr;


/**
 * Integer として値を得る
 * @return integer
 */
Nvalidr.prototype.toInt = function(defaultValue) {
	if (defaultValue === void 0) {
		defaultValue = 0;
	}
	return parseInt(this.s, 10) || defaultValue;
};

/**
 * Float として値を得る
 * @return float
 */
Nvalidr.prototype.toFloat = function(defaultValue) {
	if (defaultValue === void 0) {
		defaultValue = 0.0;
	}
	return parseFloat(this.s) || defaultValue;
};

/**
 * Number として値を得る
 * @return float
 */
Nvalidr.prototype.toNumber = function(defaultValue) {
	if (defaultValue === void 0) {
		defaultValue = 0;
	}
	var number = this.s * 1;
	return isNaN(number) ? defaultValue : number;
};




/**
 * 値が空かどうかを返す。
 * @return boolean
 */
Nvalidr.prototype.isEmpty = function() {
	return !this.s && this.s !== 0;
};

/**
 *
 * @param replaceArgs {Array} Nvalidr.replace メソッドに与える引数を配列で提供。
 * @param validator {string|RegExp|Function}
 *					string は、妥当な文字のリスト、
 *					RegExp は、検査用の正規表現
 *					Function は、検査結果をbooleanで返す関数
 * @param onError
 */
Nvalidr.prototype.normalize = function(replaceArgs, validator, onError) {

	//normalize
	this.replace.apply(this, replaceArgs);

	//validation
	this.validate(validator, onError);
};

/**
 * 与えられた関数を適用する。
 * @param filter
 * @returns {Nvalidr}
 */
Nvalidr.prototype.filter = function(filter) {
	this.s = filter(this.s);
	return this;
};



/**
 * validator を実行する。
 * 失敗した時には、onError を実行する。
 * @param validator {string|RegExp|Function}
 * @param onError
 * @returns {Nvalidr}
 */
Nvalidr.prototype.validate = function(validator, onError) {

	//arrange validator
	if (typeof validator === 'string') {
		validator = new RegExp('^[' + _reesc(validator) + ']+$');
	}

	//validation
	var isValid;
	if (validator instanceof RegExp) {
		isValid = validator.test(this.s);
	} else if (typeof validator === 'function') {
		isValid = validator(this.s);
	} else  {
		throw 'Unexpected validator type given: ' + validator;
	}

	//handle error
	if (!isValid) {
		onError && onError(this);
	}

	return this;
};


/**
 * 文字列の変換を行います。
 * その他は変換マップの指定とみなして処理します。
 * @param repr1 reprN 規定構造の変換マップまたは変換用関数の列挙
 * @param repr2 optional
 * @param reprN optional
 * @param ops
 * @returns {Nvalidr}
 */
Nvalidr.prototype.replace = function (repr1, repr2, reprN, ops) {

	//arrange arguments
	var replaceArgs = Array.prototype.slice.call(arguments);
	var lastMap = replaceArgs[replaceArgs.length - 1];
	if (!(lastMap instanceof Array) && typeof lastMap === 'object') {
		ops = replaceArgs.pop();
	} else {
		ops = null;
	}
	ops = assign({
		'skip': null, //<string> skip chars
		'extra': null //<Array> extra repr
	}, ops);

	//add extra map
	if (ops.extra) {
		replaceArgs.push(ops.extra);
	}

	//replace
	var len = replaceArgs.length;
	for (var i = 0; i < len; i++) {

		var repr = replaceArgs[i];

		//変換マップ
		if (repr instanceof Array) {

			var mapLen = repr.length;
			for (var ii = 0; ii < mapLen; ii++) {
				var m = repr[ii];
				var fr = m[0];
				var to = m[1];
				var re = m[2];
				if (ops.skip && 0 <= ops.skip.indexOf(fr)) {
					continue;
				}
				if (!re) {
					m[2] = re = (fr instanceof RegExp)
						? fr : new RegExp(_reesc(fr), 'g');
				}
				this.s = this.s.replace(re, to);
			}

		//変換関数
		} else if (typeof repr === 'function') {
			this.s = repr(this.s);

		} else {
			throw 'Unexpected type of map. given type: ' + repr +' '+ (typeof repr);
		}
	}

	return this;
};



/**
 * 値があることを確認する
 * @param onError
 * @returns {Nvalidr}
 */
Nvalidr.prototype.presence = function(onError) {

	if (this.isEmpty() && onError) {
		onError(this)
	}
	return this;
};

/**
 * トリムする
 * @return Nvalidr
 */
Nvalidr.prototype.trim = function () {
	this.s = this.s.replace(/^[\s　]+|[\s　]+$/g,'');
	return this;
};

/**
 * 左トリムする
 * @return Nvalidr
 */
Nvalidr.prototype.ltrim = function () {
	this.s = this.s.replace(/^[\s　]+/g,'');
	return this;
};

/**
 * 右トリムする
 * @return Nvalidr
 */
Nvalidr.prototype.rtrim = function () {
	this.s = this.s.replace(/[\s　]+$/g,'');
	return this;
};

Nvalidr.prototype.alpha = function(ops, onError) {

	if (!this.isEmpty()) {

		//arrange arguments
		if (typeof ops === 'function') {
			onError = ops;
			ops = null;
		}
		ops = assign({
			'extra': null,
			'skip': null,
			'validChars': ''
		}, ops);

		//normalize
		var replaceArgs = [
			nvalidr.H_ALPHA,
			nvalidr.H_KIGO,
			nvalidr.H_SPACE,
			ops
		];
		var validator = _hAlpha.join('') + ops.validChars;
		this.normalize(replaceArgs, validator, onError);
	}

	return this;
};

Nvalidr.prototype.alphanum = function(ops, onError) {

	if (!this.isEmpty()) {

		//arrange arguments
		if (typeof ops === 'function') {
			onError = ops;
			ops = null;
		}
		ops = assign({
			'extra': null,
			'skip': null,
			'validChars': ''
		}, ops);

		//normalize
		var replaceArgs = [
			nvalidr.H_ALPHA,
			nvalidr.H_NUM,
			nvalidr.H_KIGO,
			nvalidr.H_SPACE,
			ops
		];
		var validator = _hAlpha.join('') + _hNum.join('') + ops.validChars;
		this.normalize(replaceArgs, validator, onError);
	}

	return this;
};

Nvalidr.prototype.number = function(ops, onError) {

	if (!this.isEmpty()) {

		//arrange arguments
		if (typeof ops === 'function') {
			onError = ops;
			ops = null;
		}
		ops = assign({
			'extra': null,
			'skip': null,
			'validChars': ''
		}, ops);

		//normalize
		var replaceArgs = [
			nvalidr.H_NUM,
			nvalidr.H_KIGO,
			ops
		];
		var validator = '0123456789' + ops.validChars;
		this.normalize(replaceArgs, validator, onError);
	}

	return this;
};


Nvalidr.prototype.int = function(ops, onError) {

	if (!this.isEmpty()) {

		//arrange arguments
		if (typeof ops === 'function') {
			onError = ops;
			ops = null;
		}
		ops = assign({
			'positive': void 0 //only
		}, ops);

		//normalize
		var replaceArgs = [
			nvalidr.H_NUM,
			nvalidr.H_KIGO,
			function(s) { return s.replace(/[,]/g, ''); }
		];

		var validator = (ops.positive === 'only')
			? new RegExp('^[0-9]+?$') : new RegExp('^-?[0-9]+?$');

		this.normalize(replaceArgs, validator, onError);
	}

	return this;
};



Nvalidr.prototype.float = function(onError) {

	if (!this.isEmpty()) {

		//normalize
		var replaceArgs = [
			nvalidr.H_NUM,
			nvalidr.H_KIGO,
			function(s) { return s.replace(/[,]/g, ''); }
		];
		var validator = new RegExp('^-?[0-9]+(?:\.[0-9]*)?$');
		this.normalize(replaceArgs, validator, onError);
	}

	return this;
};


Nvalidr.prototype.hiragana = function(ops, onError) {

	if (!this.isEmpty()) {

		//arrange arguments
		if (typeof ops === 'function') {
			onError = ops;
			ops = null;
		}
		ops = assign({
			'extra': null,
			'skip': null,
			'validChars': ''
		}, ops);

		//normalize
		var replaceArgs = [
			nvalidr.Z_KATA,
			nvalidr.KATA2HIRA,
			ops
		];
		var validator = _zHiragana.join('') + 'ー' + ops.validChars;
		this.normalize(replaceArgs, validator, onError);
	}

	return this;
};

Nvalidr.prototype.katakana = function(ops, onError) {

	if (!this.isEmpty()) {

		//arrange arguments
		if (typeof ops === 'function') {
			onError = ops;
			ops = null;
		}
		ops = assign({
			'extra': null,
			'skip': null,
			'validChars': ''
		}, ops);

		//normalize
		var replaceArgs = [
			nvalidr.HIRA2KATA,
			nvalidr.Z_KATA,
			ops
		];
		var validator = _zKatakana.join('') + 'ー' + ops.validChars;
		this.normalize(replaceArgs, validator, onError);
	}

	return this;
};

Nvalidr.prototype.phone = function(ops, onError) {

	if (!this.isEmpty()) {

		//arrange arguments
		if (typeof ops === 'function') {
			onError = ops;
			ops = null;
		}
		ops = assign({
			'extra': null,
			'skip': null
		}, ops);

		//normalize
		var replaceArgs = [
			nvalidr.H_NUM,
			nvalidr.H_KIGO,
			[['−','-'],['ｰ','-']],
			function(s) { return s.replace(/[^0-9-]/g, ''); },
			ops
		];
		var validator = /^(0\d{1,4}-|\(0\d{1,4}\) ?)?\d{1,4}-\d{4}$/;
		this.normalize(replaceArgs, validator, onError);
	}

	return this;
};

Nvalidr.prototype.email = function(ops, onError) {

	if (!this.isEmpty()) {

		//arrange arguments
		if (typeof ops === 'function') {
			onError = ops;
			ops = null;
		}
		ops = assign({
			'extra': null,
			'skip': null
		}, ops);

		//normalize
		var replaceArgs = [
			nvalidr.H_ALPHA,
			nvalidr.H_NUM,
			nvalidr.H_KIGO,
			[['−','-'],['ｰ','-']],
			ops
		];
		var validator = /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		this.normalize(replaceArgs, validator, onError);
	}

	return this;
};

/**
 * 郵便番号の正規化とバリデーション
 */
Nvalidr.prototype.zipcode = function(onError) {

	if (!this.isEmpty()) {

		//normalize
		var replaceArgs = [
			nvalidr.H_NUM,
			nvalidr.H_KIGO,
			[['−','-'],['ｰ','-']]
		];
		var validator = /^\d{3}(?:-\d{4})?$/;
		this.normalize(replaceArgs, validator, onError);
	}

	return this;
};

/**
 * 日付正規化とバリデーション
 */
Nvalidr.prototype.date = function (ops, onError) {

	if (!this.isEmpty()) {

		//arrange arguments
		if (typeof ops === 'function') {
			onError = ops;
			ops = null;
		}
		ops = assign({
			'format': 'YYYY-MM-DD',
			'patterns': ['YYYY-MM-DD', 'YY-MM-DD', 'MM-DD']
		}, ops);

		//normalize
		this.trim();
		this.replace(nvalidr.H_NUM, nvalidr.H_ALPHA, nvalidr.H_KIGO);

		var d = moment(this.s, ops.patterns);

		if (d.isValid()) {
			this.s = d.format(ops.format);
		} else if (onError) {
			onError(this);
		}
	}

	return this;
};

/**
 * 時刻の正規化とバリデーション
 */
Nvalidr.prototype.time = function (ops, onError) {

	if (!this.isEmpty()) {

		//arrange arguments
		if (typeof ops === 'function') {
			onError = ops;
			ops = null;
		}
		ops = assign({
			'format': 'HH:mm',
			'patterns': ['HH:mm']
		}, ops);

		//normalize
		this.trim();
		this.replace(nvalidr.H_NUM, nvalidr.H_ALPHA, nvalidr.H_KIGO);

		var d = moment(this.s, ops.patterns);

		if (d.isValid()) {
			this.s = d.format(ops.format);
		} else if (onError) {
			onError(this);
		}
	}

	return this;
};


/**
 * テキストを正規化する。ルールは σ(°□°)ｵﾚ
 */
Nvalidr.prototype.normtext = function(ops) {

	if (!this.isEmpty()) {

		ops = assign({
			'extra': null,
			'skip': null
		}, ops);

		//normalize
		this.replace(
			nvalidr.H_ALPHA,
			nvalidr.H_NUM,
			nvalidr.Z_KATA,
			ops);
	}
	return this;
};

/**
 * 文字列の長さを確認する。
 * @param max
 * @param onError
 * @returns {Nvalidr}
 */
Nvalidr.prototype.maxlen = function(max, onError) {

	if (!this.isEmpty()) {
		this.validate(function(value) {
			return value.length <= max;
		}, onError);
	}
	return this;
};

/**
 * 文字列の長さを確認する。
 * @param min
 * @param onError
 * @returns {Nvalidr}
 */
Nvalidr.prototype.minlen = function(min, onError) {

	if (!this.isEmpty()) {
		this.validate(function(value) {
			return min <= value.length;
		}, onError);
	}
	return this;
};

/**
 * 文字列の長さを確認する。
 * @param min
 * @param max
 * @param onError
 * @returns {Nvalidr}
 */
Nvalidr.prototype.length = function(min, max, onError) {

	if (!this.isEmpty()) {
		this.validate(function(value) {
			return min <= value.length && value.length <= max;
		}, onError);
	}
	return this;
};

/**
 * 数値の大きさを確認する。
 * @param max
 * @param onError
 * @returns {Nvalidr}
 */
Nvalidr.prototype.max = function(max, onError) {

	if (!this.isEmpty()) {
		this.validate(function(value) {
			return !isNaN(value) && value <= max;
		}, onError);
	}
	return this;
};

/**
 * 数値の大きさを確認する。
 * @param min
 * @param onError
 * @returns {Nvalidr}
 */
Nvalidr.prototype.min = function(min, onError) {

	if (!this.isEmpty()) {
		this.validate(function(value) {
			return !isNaN(value) && min <= value;
		}, onError);
	}
	return this;
};

/**
 * 数値の大きさを確認する。
 * @param min
 * @param max
 * @param onError
 * @returns {Nvalidr}
 */
Nvalidr.prototype.range = function(min, max, onError) {

	if (!this.isEmpty()) {
		this.validate(function(value) {
			return !isNaN(value) && min <= value && value <= max;
		}, onError);
	}
	return this;
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
	'。','、','「','」','・',
	'．', '，', '！', '？', '”',
	'’', '‘', '＠', '＿', '：',
	'；', '＃', '＄', '％', '＆',
	'（', '）', '＝', '＊',
	'＋', '－', '／', '＜', '＞',
	'［', '￥', '］', '＾', '｛',
	'｜', '｝', '～',
	'−', //全角ダッシュ
	'ー' //全角音引
];

var _hKigo = [
	'｡', '､', '｢', '｣', '･',
	'.', ',', '!', '?', '"',
	'\'', '`', '@', '_', ':',
	';', '#', '$', '%', '&',
	'(', ')', '=', '*',
	'+', '-', '/', '<', '>',
	'[', '¥', ']', '^', '{',
	'|', '}', '~',
	'-', //半角ダッシュ
	'ｰ' //半角音引
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
		map.push([f, t]);
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
nvalidr.H_SPACE = [['　', ' ']];
nvalidr.Z_SPACE = [[' ', '　']];


module.exports = nvalidr;



