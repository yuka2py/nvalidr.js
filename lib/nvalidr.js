
var moment = require('moment');

var reesc = /\W/g;


function nvalidr (s) {
	return new Jvalid(s);
};

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
}

Jvalid.prototype.trim = function () {
	this.s = this.s.replace(/^[\s　]+|[\s　]+$/g,'');
	return this;
}

Jvalid.prototype.rtrim = function () {
	this.s = this.s.replace(/[\s　]+$/g,'');
	return this;
}

Jvalid.prototype.ltrim = function () {
	this.s = this.s.replace(/^[\s　]+/g,'');
	return this;
}

Jvalid.prototype.date = function (ops, onerr) {
	if (this.s) {

		if (typeof ops === 'function') {
			onerr = ops
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
}


Jvalid.prototype.replace = function (fr, to) {

	if ((typeof fr === 'string' || fr instanceof RegExp) && typeof to === 'string') {

		if (!(fr instanceof RegExp)) {
			fr = new RegExp(fr.replace(_esc_, '\\$&'), 'g');
		}
		this.s = this.s.replace(fr, to);

	} else {

		var _esc_ = reesc;
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
						fr = new RegExp(fr.replace(_esc_, '\\$&'), 'g');
					}
					this.s = this.s.replace(fr, to);
				}

			} else if (typeof map === 'object') {

				for (var fr in map) {
					var re = new RegExp(fr.replace(_esc_, '\\$&'), 'g');
					var to = map[fr];
					this.s = this.s.replace(re, to);
				}

			} else {
				throw 'Unexpected type of map. given type: ' + map +' '+ (typeof map);
			}

		}
	}


	return this;
}



nvalidr.H_SPACE =
nvalidr.HS = [
	[/　/g,' ']
];

nvalidr.H_NUM =
nvalidr.HN = [
	[/０/g,'0'],[/１/g,'1'],[/２/g,'2'],[/３/g,'3'],[/４/g,'4'],
	[/５/g,'5'],[/６/g,'6'],[/７/g,'7'],[/８/g,'8'],[/９/g,'9']
];
nvalidr.Z_NUM =
nvalidr.ZN = [
	[/0/g, '０'], [/1/g, '１'], [/2/g, '２'], [/3/g, '３'], [/4/g, '４'],
	[/5/g, '５'], [/6/g, '６'], [/7/g, '７'], [/8/g, '８'], [/9/g, '９']
];

nvalidr.H_ALPHA =
nvalidr.HA = [
	[/ａ/g, 'a'], [/ｂ/g, 'b'], [/ｃ/g, 'c'], [/ｄ/g, 'd'], [/ｅ/g, 'e'],
	[/ｆ/g, 'f'], [/ｇ/g, 'g'], [/ｈ/g, 'h'], [/ｉ/g, 'i'], [/ｊ/g, 'j'],
	[/ｋ/g, 'k'], [/ｌ/g, 'l'], [/ｍ/g, 'm'], [/ｎ/g, 'n'], [/ｏ/g, 'o'],
	[/ｐ/g, 'p'], [/ｑ/g, 'q'], [/ｒ/g, 'r'], [/ｓ/g, 's'], [/ｔ/g, 't'],
	[/ｕ/g, 'u'], [/ｖ/g, 'v'], [/ｗ/g, 'w'], [/ｘ/g, 'x'], [/ｙ/g, 'y'],
	[/ｚ/g, 'z'],
	[/Ａ/g, 'A'], [/Ｂ/g, 'B'], [/Ｃ/g, 'C'], [/Ｄ/g, 'D'], [/Ｅ/g, 'E'],
	[/Ｆ/g, 'F'], [/Ｇ/g, 'G'], [/Ｈ/g, 'H'], [/Ｉ/g, 'I'], [/Ｊ/g, 'J'],
	[/Ｋ/g, 'K'], [/Ｌ/g, 'L'], [/Ｍ/g, 'M'], [/Ｎ/g, 'N'], [/Ｏ/g, 'O'],
	[/Ｐ/g, 'P'], [/Ｑ/g, 'Q'], [/Ｒ/g, 'R'], [/Ｓ/g, 'S'], [/Ｔ/g, 'T'],
	[/Ｕ/g, 'U'], [/Ｖ/g, 'V'], [/Ｗ/g, 'W'], [/Ｘ/g, 'X'], [/Ｙ/g, 'Y'],
	[/Ｚ/g, 'Z']
];

nvalidr.Z_ALPHA =
nvalidr.ZA = [
	[/a/g, 'ａ'], [/b/g, 'ｂ'], [/c/g, 'ｃ'], [/d/g, 'ｄ'], [/e/g, 'ｅ'],
	[/f/g, 'ｆ'], [/g/g, 'ｇ'], [/h/g, 'ｈ'], [/i/g, 'ｉ'], [/j/g, 'ｊ'],
	[/k/g, 'ｋ'], [/l/g, 'ｌ'], [/m/g, 'ｍ'], [/n/g, 'ｎ'], [/o/g, 'ｏ'],
	[/p/g, 'ｐ'], [/q/g, 'ｑ'], [/r/g, 'ｒ'], [/s/g, 'ｓ'], [/t/g, 'ｔ'],
	[/u/g, 'ｕ'], [/v/g, 'ｖ'], [/w/g, 'ｗ'], [/x/g, 'ｘ'], [/y/g, 'ｙ'],
	[/z/g, 'ｚ'],
	[/A/g, 'Ａ'], [/B/g, 'Ｂ'], [/C/g, 'Ｃ'], [/D/g, 'Ｄ'], [/E/g, 'Ｅ'],
	[/F/g, 'Ｆ'], [/G/g, 'Ｇ'], [/H/g, 'Ｈ'], [/I/g, 'Ｉ'], [/J/g, 'Ｊ'],
	[/K/g, 'Ｋ'], [/L/g, 'Ｌ'], [/M/g, 'Ｍ'], [/N/g, 'Ｎ'], [/O/g, 'Ｏ'],
	[/P/g, 'Ｐ'], [/Q/g, 'Ｑ'], [/R/g, 'Ｒ'], [/S/g, 'Ｓ'], [/T/g, 'Ｔ'],
	[/U/g, 'Ｕ'], [/V/g, 'Ｖ'], [/W/g, 'Ｗ'], [/X/g, 'Ｘ'], [/Y/g, 'Ｙ'],
	[/Z/g, 'Ｚ']
];

nvalidr.H_KIGO =
nvalidr.HKG = [
	[/．/g, '.'], [/，/g, ','], [/！/g, '!'], [/？/g, '?'], [/”/g, '"'],
	[/’/g, '\''], [/‘/g, '`'], [/＠/g, '@'], [/＿/g, '_'], [/：/g, ':'],
	[/；/g, ';'], [/＃/g, '#'], [/＄/g, '$'], [/％/g, '%'], [/＆/g, '&'],
	[/（/g, '('], [/）/g, ')'], [/－/g, '-'], [/＝/g, '='], [/＊/g, '*'],
	[/＋/g, '+'], [/－/g, '-'], [/／/g, '/'], [/＜/g, '<'], [/＞/g, '>'],
	[/［/g, '['], [/￥/g, '¥'], [/］/g, ']'], [/＾/g, '^'], [/｛/g, '{'],
	[/｜/g, '|'], [/｝/g, '}'], [/～/g, '~']
];

nvalidr.Z_KIGO =
nvalidr.ZKG = [
	[/\./g, '．'], [/\,/g, '，'], [/\!/g, '！'], [/\?/g, '？'], [/\"/g, '”'],
	[/\'/g, '’'], [/\`/g, '‘'], [/\@/g, '＠'], [/\_/g, '＿'], [/\:/g, '：'],
	[/\;/g, '；'], [/\#/g, '＃'], [/\$/g, '＄'], [/\%/g, '％'], [/\&/g, '＆'],
	[/\(/g, '（'], [/\)/g, '）'], [/\-/g, '－'], [/\=/g, '＝'], [/\*/g, '＊'],
	[/\+/g, '＋'], [/\-/g, '－'], [/\//g, '／'], [/\</g, '＜'], [/\>/g, '＞'],
	[/\[/g, '［'], [/\¥/g, '￥'], [/\]/g, '］'], [/\^/g, '＾'], [/\{/g, '｛'],
	[/\|/g, '｜'], [/\}/g, '｝'], [/\~/g, '～']
];

nvalidr.H_KATA =
nvalidr.HK = [
	[/ァ/g, 'ｧ'], [/ィ/g, 'ｨ'], [/ゥ/g, 'ｩ'], [/ェ/g, 'ｪ'], [/ォ/g, 'ｫ'],
	[/ッ/g, 'ｯ'], [/ャ/g, 'ｬ'], [/ュ/g, 'ｭ'], [/ョ/g, 'ｮ'],
	[/ガ/g, 'ｶﾞ'], [/ギ/g, 'ｷﾞ'], [/グ/g, 'ｸﾞ'], [/ゲ/g, 'ｹﾞ'], [/ゴ/g, 'ｺﾞ'],
	[/ザ/g, 'ｻﾞ'], [/ジ/g, 'ｼﾞ'], [/ズ/g, 'ｽﾞ'], [/ゼ/g, 'ｾﾞ'], [/ゾ/g, 'ｿﾞ'],
	[/ダ/g, 'ﾀﾞ'], [/ヂ/g, 'ﾁﾞ'], [/ヅ/g, 'ﾂﾞ'], [/デ/g, 'ﾃﾞ'], [/ド/g, 'ﾄﾞ'],
	[/バ/g, 'ﾊﾞ'], [/ビ/g, 'ﾋﾞ'], [/ブ/g, 'ﾌﾞ'], [/ベ/g, 'ﾍﾞ'], [/ボ/g, 'ﾎﾞ'],
	[/パ/g, 'ﾊﾟ'], [/ピ/g, 'ﾋﾟ'], [/プ/g, 'ﾌﾟ'], [/ペ/g, 'ﾍﾟ'], [/ポ/g, 'ﾎﾟ'],
	[/ヴ/g, 'ｳﾞ'],
	[/ア/g, 'ｱ'], [/イ/g, 'ｲ'], [/ウ/g, 'ｳ'], [/エ/g, 'ｴ'], [/オ/g, 'ｵ'],
	[/カ/g, 'ｶ'], [/キ/g, 'ｷ'], [/ク/g, 'ｸ'], [/ケ/g, 'ｹ'], [/コ/g, 'ｺ'],
	[/サ/g, 'ｻ'], [/シ/g, 'ｼ'], [/ス/g, 'ｽ'], [/セ/g, 'ｾ'], [/ソ/g, 'ｿ'],
	[/タ/g, 'ﾀ'], [/チ/g, 'ﾁ'], [/ツ/g, 'ﾂ'], [/テ/g, 'ﾃ'], [/ト/g, 'ﾄ'],
	[/ナ/g, 'ﾅ'], [/ニ/g, 'ﾆ'], [/ヌ/g, 'ﾇ'], [/ネ/g, 'ﾈ'], [/ノ/g, 'ﾉ'],
	[/ハ/g, 'ﾊ'], [/ヒ/g, 'ﾋ'], [/フ/g, 'ﾌ'], [/ヘ/g, 'ﾍ'], [/ホ/g, 'ﾎ'],
	[/マ/g, 'ﾏ'], [/ミ/g, 'ﾐ'], [/ム/g, 'ﾑ'], [/メ/g, 'ﾒ'], [/モ/g, 'ﾓ'],
	[/ヤ/g, 'ﾔ'], [/ユ/g, 'ﾕ'], [/ヨ/g, 'ﾖ'],
	[/ラ/g, 'ﾗ'], [/リ/g, 'ﾘ'], [/ル/g, 'ﾙ'], [/レ/g, 'ﾚ'], [/ロ/g, 'ﾛ'],
	[/ワ/g, 'ﾜ'], [/ヲ/g, 'ｦ'], [/ン/g, 'ﾝ'],
	[/。/g, '｡'], [/、/g, '､'], [/゛/g, 'ﾞ'], [/゜/g, 'ﾟ'],
	[/「/g, '｢'], [/」/g, '｣'], [/・/g, '･'], [/ー/g, 'ｰ']
];

nvalidr.Z_KATA =
nvalidr.ZK = [
	[/ｧ/g, 'ァ'], [/ｨ/g, 'ィ'], [/ｩ/g, 'ゥ'], [/ｪ/g, 'ェ'], [/ｫ/g, 'ォ'],
	[/ｯ/g, 'ッ'], [/ｬ/g, 'ャ'], [/ｭ/g, 'ュ'], [/ｮ/g, 'ョ'],
	[/ｶﾞ/g, 'ガ'], [/ｷﾞ/g, 'ギ'], [/ｸﾞ/g, 'グ'], [/ｹﾞ/g, 'ゲ'], [/ｺﾞ/g, 'ゴ'],
	[/ｻﾞ/g, 'ザ'], [/ｼﾞ/g, 'ジ'], [/ｽﾞ/g, 'ズ'], [/ｾﾞ/g, 'ゼ'], [/ｿﾞ/g, 'ゾ'],
	[/ﾀﾞ/g, 'ダ'], [/ﾁﾞ/g, 'ヂ'], [/ﾂﾞ/g, 'ヅ'], [/ﾃﾞ/g, 'デ'], [/ﾄﾞ/g, 'ド'],
	[/ﾊﾞ/g, 'バ'], [/ﾋﾞ/g, 'ビ'], [/ﾌﾞ/g, 'ブ'], [/ﾍﾞ/g, 'ベ'], [/ﾎﾞ/g, 'ボ'],
	[/ﾊﾟ/g, 'パ'], [/ﾋﾟ/g, 'ピ'], [/ﾌﾟ/g, 'プ'], [/ﾍﾟ/g, 'ペ'], [/ﾎﾟ/g, 'ポ'],
	[/ｳﾞ/g, 'ヴ'],
	[/ｱ/g, 'ア'], [/ｲ/g, 'イ'], [/ｳ/g, 'ウ'], [/ｴ/g, 'エ'], [/ｵ/g, 'オ'],
	[/ｶ/g, 'カ'], [/ｷ/g, 'キ'], [/ｸ/g, 'ク'], [/ｹ/g, 'ケ'], [/ｺ/g, 'コ'],
	[/ｻ/g, 'サ'], [/ｼ/g, 'シ'], [/ｽ/g, 'ス'], [/ｾ/g, 'セ'], [/ｿ/g, 'ソ'],
	[/ﾀ/g, 'タ'], [/ﾁ/g, 'チ'], [/ﾂ/g, 'ツ'], [/ﾃ/g, 'テ'], [/ﾄ/g, 'ト'],
	[/ﾅ/g, 'ナ'], [/ﾆ/g, 'ニ'], [/ﾇ/g, 'ヌ'], [/ﾈ/g, 'ネ'], [/ﾉ/g, 'ノ'],
	[/ﾊ/g, 'ハ'], [/ﾋ/g, 'ヒ'], [/ﾌ/g, 'フ'], [/ﾍ/g, 'ヘ'], [/ﾎ/g, 'ホ'],
	[/ﾏ/g, 'マ'], [/ﾐ/g, 'ミ'], [/ﾑ/g, 'ム'], [/ﾒ/g, 'メ'], [/ﾓ/g, 'モ'],
	[/ﾔ/g, 'ヤ'], [/ﾕ/g, 'ユ'], [/ﾖ/g, 'ヨ'],
	[/ﾗ/g, 'ラ'], [/ﾘ/g, 'リ'], [/ﾙ/g, 'ル'], [/ﾚ/g, 'レ'], [/ﾛ/g, 'ロ'],
	[/ﾜ/g, 'ワ'], [/ｦ/g, 'ヲ'], [/ﾝ/g, 'ン'],
	[/｡/g, '。'], [/､/g, '、'], [/ﾞ/g, '゛'], [/ﾟ/g, '゜'],
	[/｢/g, '「'], [/｣/g, '」'], [/･/g, '・'], [/ｰ/g, 'ー']
];

nvalidr.HIRA2KATA = [
	[/ぁ/g, 'ァ'], [/ぃ/g, 'ィ'], [/ぅ/g, 'ゥ'], [/ぇ/g, 'ェ'], [/ぉ/g, 'ォ'],
	[/っ/g, 'ッ'], [/ゃ/g, 'ャ'], [/ゅ/g, 'ュ'], [/ょ/g, 'ョ'],
	[/が/g, 'ガ'], [/ぎ/g, 'ギ'], [/ぐ/g, 'グ'], [/げ/g, 'ゲ'], [/ご/g, 'ゴ'],
	[/ざ/g, 'ザ'], [/じ/g, 'ジ'], [/ず/g, 'ズ'], [/ぜ/g, 'ゼ'], [/ぞ/g, 'ゾ'],
	[/だ/g, 'ダ'], [/ぢ/g, 'ヂ'], [/づ/g, 'ヅ'], [/で/g, 'デ'], [/ど/g, 'ド'],
	[/ば/g, 'バ'], [/び/g, 'ビ'], [/ぶ/g, 'ブ'], [/べ/g, 'ベ'], [/ぼ/g, 'ボ'],
	[/ぱ/g, 'パ'], [/ぴ/g, 'ピ'], [/ぷ/g, 'プ'], [/ぺ/g, 'ペ'], [/ぽ/g, 'ポ'],
	[/ゔ/g, 'ヴ'],
	[/あ/g, 'ア'], [/い/g, 'イ'], [/う/g, 'ウ'], [/え/g, 'エ'], [/お/g, 'オ'],
	[/か/g, 'カ'], [/き/g, 'キ'], [/く/g, 'ク'], [/け/g, 'ケ'], [/こ/g, 'コ'],
	[/さ/g, 'サ'], [/し/g, 'シ'], [/す/g, 'ス'], [/せ/g, 'セ'], [/そ/g, 'ソ'],
	[/た/g, 'タ'], [/ち/g, 'チ'], [/つ/g, 'ツ'], [/て/g, 'テ'], [/と/g, 'ト'],
	[/な/g, 'ナ'], [/に/g, 'ニ'], [/ぬ/g, 'ヌ'], [/ね/g, 'ネ'], [/の/g, 'ノ'],
	[/は/g, 'ハ'], [/ひ/g, 'ヒ'], [/ふ/g, 'フ'], [/へ/g, 'ヘ'], [/ほ/g, 'ホ'],
	[/ま/g, 'マ'], [/み/g, 'ミ'], [/む/g, 'ム'], [/め/g, 'メ'], [/も/g, 'モ'],
	[/や/g, 'ヤ'], [/ゆ/g, 'ユ'], [/よ/g, 'ヨ'],
	[/ら/g, 'ラ'], [/り/g, 'リ'], [/る/g, 'ル'], [/れ/g, 'レ'], [/ろ/g, 'ロ'],
	[/わ/g, 'ワ'], [/を/g, 'ヲ'], [/ん/g, 'ン']
];

nvalidr.KATA2HIRA = [
	[/ァ/g,'ぁ'],[/ィ/g,'ぃ'],[/ゥ/g,'ぅ'],[/ェ/g,'ぇ'],[/ォ/g,'ぉ'],
	[/ッ/g,'っ'],[/ャ/g,'ゃ'],[/ュ/g,'ゅ'],[/ョ/g,'ょ'],
	[/ガ/g,'が'],[/ギ/g,'ぎ'],[/グ/g,'ぐ'],[/ゲ/g,'げ'],[/ゴ/g,'ご'],
	[/ザ/g,'ざ'],[/ジ/g,'じ'],[/ズ/g,'ず'],[/ゼ/g,'ぜ'],[/ゾ/g,'ぞ'],
	[/ダ/g,'だ'],[/ヂ/g,'ぢ'],[/ヅ/g,'づ'],[/デ/g,'で'],[/ド/g,'ど'],
	[/バ/g,'ば'],[/ビ/g,'び'],[/ブ/g,'ぶ'],[/ベ/g,'べ'],[/ボ/g,'ぼ'],
	[/パ/g,'ぱ'],[/ピ/g,'ぴ'],[/プ/g,'ぷ'],[/ペ/g,'ぺ'],[/ポ/g,'ぽ'],
	[/ヴ/g,'ゔ'],
	[/ア/g,'あ'],[/イ/g,'い'],[/ウ/g,'う'],[/エ/g,'え'],[/オ/g,'お'],
	[/カ/g,'か'],[/キ/g,'き'],[/ク/g,'く'],[/ケ/g,'け'],[/コ/g,'こ'],
	[/サ/g,'さ'],[/シ/g,'し'],[/ス/g,'す'],[/セ/g,'せ'],[/ソ/g,'そ'],
	[/タ/g,'た'],[/チ/g,'ち'],[/ツ/g,'つ'],[/テ/g,'て'],[/ト/g,'と'],
	[/ナ/g,'な'],[/ニ/g,'に'],[/ヌ/g,'ぬ'],[/ネ/g,'ね'],[/ノ/g,'の'],
	[/ハ/g,'は'],[/ヒ/g,'ひ'],[/フ/g,'ふ'],[/ヘ/g,'へ'],[/ホ/g,'ほ'],
	[/マ/g,'ま'],[/ミ/g,'み'],[/ム/g,'む'],[/メ/g,'め'],[/モ/g,'も'],
	[/ヤ/g,'や'],[/ユ/g,'ゆ'],[/ヨ/g,'よ'],
	[/ラ/g,'ら'],[/リ/g,'り'],[/ル/g,'る'],[/レ/g,'れ'],[/ロ/g,'ろ'],
	[/ワ/g,'わ'],[/ヲ/g,'を'],[/ン/g,'ん']
];



function _concat() {
	var _concat = {};
	var maps = arguments;
	for (var i = 0; i < maps.length; i++) {
		var map = maps[i];
		if (typeof map !== 'object') {
			throw 'Provided map is not Object.';
		}
		for (var k in map) {
			var v = map[k];
			_concat[v] = k;
		}
	}
	return _concat;
}

nvalidr.H_ASCII = nvalidr.HAC = _concat(nvalidr.H_ALPHA, nvalidr.H_NUM, nvalidr.H_KIGO);
nvalidr.Z_ASCII = nvalidr.ZAC = _concat(nvalidr.Z_ALPHA, nvalidr.Z_NUM, nvalidr.Z_KIGO);



module.exports = nvalidr;


