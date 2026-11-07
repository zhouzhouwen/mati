/* MATI 马格测试 原创小马插画（纯代码绘制的 SVG，无外部素材、无文字、无位图）
 * TI_ART.svg(key, {size, cls, shiny, title}) -> SVG 字符串
 * 画风与 DOGTI 同一家族：粗描边 + 扁平暖色 + 腮红 + 趴在底边的两只小蹄子
 * 只用 ES5 语法（老旧 App 内置浏览器也能跑）
 */
(function () {
  'use strict';
  var INK = '#3a2a22';
  var SW = 5;
  var PINK = '#ffb3c1';
  var BLUSH = '#ff9aae';
  var EYE = '#2a1d17';
  var uid = 0;

  /* ---------- 基础工具 ---------- */
  function ext(o, b) {
    var r = {}, k;
    if (o) for (k in o) if (o.hasOwnProperty(k)) r[k] = o[k];
    if (b) for (k in b) if (b.hasOwnProperty(k)) r[k] = b[k];
    return r;
  }
  function f(n) { return Math.round(n * 10) / 10; }
  function a(attrs) {
    var s = '', k;
    for (k in attrs) if (attrs.hasOwnProperty(k) && attrs[k] !== undefined && attrs[k] !== null) s += ' ' + k + '="' + attrs[k] + '"';
    return s;
  }
  function E(cx, cy, rx, ry, fill, extra) { return '<ellipse' + a(ext({ cx: f(cx), cy: f(cy), rx: f(rx), ry: f(ry), fill: fill }, extra)) + '/>'; }
  function P(d, fill, extra) { return '<path' + a(ext({ d: d, fill: fill || 'none' }, extra)) + '/>'; }
  var OL = { stroke: INK, 'stroke-width': SW, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  function ol(w) { return { stroke: INK, 'stroke-width': w || SW, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }; }
  function ln(d, color, w, extra) { return P(d, 'none', ext({ stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, extra)); }
  // 粗描边的线条：先画一条加粗的墨线，再盖一条彩色线
  function band(d, color, w) { return ln(d, INK, w + 5) + ln(d, color, w); }
  function mirror(inner) { return '<g transform="matrix(-1 0 0 1 200 0)">' + inner + '</g>'; }
  function pair(inner) { return inner + mirror(inner); }
  function rot(deg, cx, cy, inner) { return '<g transform="rotate(' + deg + ' ' + cx + ' ' + cy + ')">' + inner + '</g>'; }
  function place(x, y, s, inner) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + inner + '</g>'; }
  function acc(inner) { return '<g class="d-acc">' + inner + '</g>'; }
  function clipWith(cid, d, inner) {
    return '<defs><clipPath id="' + cid + '"><path d="' + d + '"/></clipPath></defs><g clip-path="url(#' + cid + ')">' + inner + '</g>';
  }
  function rrect(x, y, w, h, r) {
    return 'M' + (x + r) + ' ' + y + ' H' + (x + w - r) + ' Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) + ' V' + (y + h - r) + ' Q' + (x + w) + ' ' + (y + h) + ' ' + (x + w - r) + ' ' + (y + h) +
      ' H' + (x + r) + ' Q' + x + ' ' + (y + h) + ' ' + x + ' ' + (y + h - r) + ' V' + (y + r) + ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'Z';
  }

  /* ---------- 小装饰 ---------- */
  function star4(x, y, r, fill, w) { // 四角闪光
    var k = 0.22;
    var d = 'M' + f(x) + ' ' + f(y - r) + ' Q' + f(x + r * k) + ' ' + f(y - r * k) + ' ' + f(x + r) + ' ' + f(y) + ' Q' + f(x + r * k) + ' ' + f(y + r * k) + ' ' + f(x) + ' ' + f(y + r) +
      ' Q' + f(x - r * k) + ' ' + f(y + r * k) + ' ' + f(x - r) + ' ' + f(y) + ' Q' + f(x - r * k) + ' ' + f(y - r * k) + ' ' + f(x) + ' ' + f(y - r) + 'Z';
    return P(d, fill || '#ffd54a', w === 0 ? null : ol(w || 3));
  }
  function star5(x, y, r, fill, w) { // 五角星（贴纸、额头白星）
    var d = '', i, ang, rr;
    for (i = 0; i < 10; i++) {
      ang = -Math.PI / 2 + (i * Math.PI) / 5; rr = i % 2 ? r * 0.48 : r;
      d += (i ? ' L' : 'M') + f(x + rr * Math.cos(ang)) + ' ' + f(y + rr * Math.sin(ang));
    }
    return P(d + 'Z', fill || '#ffd23f', w === 0 ? null : ol(w || 3));
  }
  function heart(x, y, s, fill) {
    var d = 'M' + x + ' ' + f(y + 9 * s) + ' C' + f(x - 14 * s) + ' ' + f(y - s) + ' ' + f(x - 9 * s) + ' ' + f(y - 12 * s) + ' ' + x + ' ' + f(y - 5 * s) +
      ' C' + f(x + 9 * s) + ' ' + f(y - 12 * s) + ' ' + f(x + 14 * s) + ' ' + f(y - s) + ' ' + x + ' ' + f(y + 9 * s) + 'Z';
    return P(d, fill || '#ff6f91', ol(3));
  }
  function drop(x, y, s, fill) { // 汗滴（尖头朝上）
    s = s || 1;
    return P('M' + x + ' ' + y + ' Q' + f(x - 8 * s) + ' ' + f(y + 13 * s) + ' ' + f(x - 5 * s) + ' ' + f(y + 18 * s) + ' Q' + x + ' ' + f(y + 24 * s) + ' ' + f(x + 5 * s) + ' ' + f(y + 18 * s) +
      ' Q' + f(x + 8 * s) + ' ' + f(y + 13 * s) + ' ' + x + ' ' + y + 'Z', fill || '#9fd8ff', ol(3)) +
      E(x - 2 * s, y + 15 * s, 1.6 * s, 2.6 * s, '#fff', { opacity: 0.8 });
  }
  function note(x, y, s, fill) { // 音符
    s = s || 1;
    return ln('M' + f(x + 5 * s) + ' ' + f(y + 12 * s) + ' L' + f(x + 5 * s) + ' ' + f(y - 8 * s) + ' Q' + f(x + 12 * s) + ' ' + f(y - 4 * s) + ' ' + f(x + 14 * s) + ' ' + f(y + 2 * s), INK, 3.4) +
      E(x, y + 12 * s, 6 * s, 4.6 * s, fill || '#7d8cff', ext(ol(3), { transform: 'rotate(-18 ' + x + ' ' + f(y + 12 * s) + ')' }));
  }
  function qmark(x, y, s) { // 问号（路径画）
    s = s || 1;
    return ln('M' + f(x - 9 * s) + ' ' + f(y - 6 * s) + ' Q' + f(x - 9 * s) + ' ' + f(y - 19 * s) + ' ' + x + ' ' + f(y - 19 * s) + ' Q' + f(x + 10 * s) + ' ' + f(y - 19 * s) + ' ' + f(x + 10 * s) + ' ' + f(y - 9 * s) +
      ' Q' + f(x + 10 * s) + ' ' + f(y - 2 * s) + ' ' + f(x + 1 * s) + ' ' + f(y + 1 * s) + ' L' + f(x + 1 * s) + ' ' + f(y + 7 * s), INK, 5.4) +
      E(x + 1 * s, y + 16 * s, 3.4 * s, 3.4 * s, INK);
  }
  function bubbleDot(x, y, r) {
    return E(x, y, r, r, '#e4f7ff', ol(2.6)) + E(x - r * 0.35, y - r * 0.35, r * 0.28, r * 0.22, '#fff');
  }
  function sparkles(list) {
    var s = '', i;
    for (i = 0; i < list.length; i++) s += star4(list[i][0], list[i][1], list[i][2], list[i][3]);
    return s;
  }

  /* ---------- 五官 ---------- */
  var EY = 90, EXL = 72;
  function eyes(kind, o) {
    o = o || {};
    var y = o.y || EY, xl = o.xl || EXL, xr = o.xr || (200 - xl), ink = o.ink || EYE, s = '';
    var rx = o.rx || 7, ry = o.ry || 8.6;
    function dot(x, rx2, ry2, dx) {
      dx = dx || 0;
      return E(x + dx, y, rx2, ry2, ink) + E(x + dx + rx2 * 0.3, y - ry2 * 0.38, rx2 * 0.4, ry2 * 0.32, '#fff') + E(x + dx - rx2 * 0.32, y + ry2 * 0.42, rx2 * 0.18, ry2 * 0.15, '#fff');
    }
    function arcUp(x) { return ln('M' + (x - 9) + ' ' + (y + 3) + ' Q' + x + ' ' + (y - 9) + ' ' + (x + 9) + ' ' + (y + 3), INK, 4.6); }
    function arcDown(x) { return ln('M' + (x - 9) + ' ' + (y - 2) + ' Q' + x + ' ' + (y + 7) + ' ' + (x + 9) + ' ' + (y - 2), INK, 4.4); }
    function lid(x, cut, dx) { // 半眯眼：上眼皮盖住一半
      var fur = o.fur || '#fff';
      return E(x + dx, y + 1, rx, ry, ink) + E(x + dx + 2.4, y + 3, 2.1, 1.9, '#fff') +
        P('M' + (x - 11) + ' ' + (y - 12) + ' H' + (x + 11) + ' V' + (y + cut) + ' H' + (x - 11) + 'Z', fur) +
        ln('M' + (x - 9) + ' ' + (y + cut) + ' L' + (x + 9) + ' ' + (y + cut), INK, 4);
    }
    function sparkle(x) {
      return E(x, y, 8.4, 10, ink) + star4(x + 2.6, y - 3.4, 4.6, '#fff', 0) + E(x - 3, y + 4.4, 1.6, 1.4, '#fff');
    }
    if (kind === 'dot') s = dot(xl, rx, ry) + dot(xr, rx, ry);
    else if (kind === 'big') s = dot(xl, 9.6, 11.6) + dot(xr, 9.6, 11.6);
    else if (kind === 'huge') {
      s = dot(xl, 12, 14) + dot(xr, 12, 14);
    }
    else if (kind === 'look') s = dot(xl, rx, ry, o.dx || 3) + dot(xr, rx, ry, o.dx || 3);
    else if (kind === 'happy') s = arcUp(xl) + arcUp(xr);
    else if (kind === 'closed') s = arcDown(xl) + arcDown(xr);
    else if (kind === 'side') s = lid(xl, -1, 3) + lid(xr, -1, 3);
    else if (kind === 'half') s = lid(xl, 0, 0) + lid(xr, 0, 0);
    else if (kind === 'sparkle') s = sparkle(xl) + sparkle(xr);
    else if (kind === 'wink') s = dot(xl, rx, ry) + arcUp(xr);
    else if (kind === 'split') s = sparkle(xl) + arcDown(xr);
    else if (kind === 'lash') {
      s = dot(xl, rx, ry) + dot(xr, rx, ry) +
        ln('M' + (xl - 5) + ' ' + (y - 7) + ' L' + (xl - 10) + ' ' + (y - 12) + ' M' + (xl - 7.5) + ' ' + (y - 2) + ' L' + (xl - 13.5) + ' ' + (y - 4.5) +
          ' M' + (xr + 5) + ' ' + (y - 7) + ' L' + (xr + 10) + ' ' + (y - 12) + ' M' + (xr + 7.5) + ' ' + (y - 2) + ' L' + (xr + 13.5) + ' ' + (y - 4.5), INK, 3.2);
    }
    return '<g class="d-eyes">' + s + '</g>';
  }
  function brows(kind, o) {
    o = o || {};
    var y = (o.y || EY) - 16, xl = o.xl || EXL, xr = 200 - xl, d = '';
    if (kind === 'determined') d = 'M' + (xl - 10) + ' ' + (y - 3) + ' L' + (xl + 8) + ' ' + (y + 3) + ' M' + (xr + 10) + ' ' + (y - 3) + ' L' + (xr - 8) + ' ' + (y + 3);
    else if (kind === 'worry') d = 'M' + (xl - 9) + ' ' + (y + 1) + ' Q' + xl + ' ' + (y - 1) + ' ' + (xl + 8) + ' ' + (y - 6) + ' M' + (xr + 9) + ' ' + (y + 1) + ' Q' + xr + ' ' + (y - 1) + ' ' + (xr - 8) + ' ' + (y - 6);
    else if (kind === 'raise') d = 'M' + (xl - 11) + ' ' + (y + 2) + ' Q' + (xl - 1) + ' ' + (y - 10) + ' ' + (xl + 9) + ' ' + (y - 2) + ' M' + (xr - 9) + ' ' + (y + 4) + ' L' + (xr + 9) + ' ' + (y + 4);
    else if (kind === 'stubborn') d = 'M' + (xl - 11) + ' ' + (y - 2) + ' L' + (xl + 9) + ' ' + (y + 5) + ' M' + (xr + 11) + ' ' + (y - 2) + ' L' + (xr - 9) + ' ' + (y + 5);
    return ln(d, o.c || INK, o.w || 4.2);
  }
  function nostrils(y, o) {
    o = o || {};
    var dx = o.dx || 17, c = o.c || '#5e3f34', rx = o.rx || 4.4, ry = o.ry || 6;
    return E(100 - dx, y, rx, ry, c, { transform: 'rotate(-20 ' + (100 - dx) + ' ' + y + ')' }) +
      E(100 + dx, y, rx, ry, c, { transform: 'rotate(20 ' + (100 + dx) + ' ' + y + ')' });
  }
  function mouth(kind, y, o) {
    o = o || {};
    var x = o.x || 100, s = '', red = '#8e3b46';
    if (kind === 'smile') s = ln('M' + (x - 10) + ' ' + y + ' Q' + x + ' ' + (y + 8) + ' ' + (x + 10) + ' ' + y, o.c || INK, 4);
    else if (kind === 'grin') { // 马式露齿笑
      s = P('M' + (x - 15) + ' ' + (y - 2) + ' Q' + x + ' ' + (y + 2) + ' ' + (x + 15) + ' ' + (y - 2) + ' Q' + (x + 13) + ' ' + (y + 14) + ' ' + x + ' ' + (y + 14) + ' Q' + (x - 13) + ' ' + (y + 14) + ' ' + (x - 15) + ' ' + (y - 2) + 'Z', red, ol(3.6)) +
        E(x, y + 11, 7, 3.2, '#ff8fa3') +
        P('M' + (x - 8) + ' ' + y + ' Q' + x + ' ' + (y + 1.6) + ' ' + (x + 8) + ' ' + y + ' V' + (y + 5) + ' Q' + (x + 8) + ' ' + (y + 7) + ' ' + (x + 6) + ' ' + (y + 7) + ' H' + (x - 6) + ' Q' + (x - 8) + ' ' + (y + 7) + ' ' + (x - 8) + ' ' + (y + 5) + 'Z', '#fff') +
        ln('M' + x + ' ' + (y + 1) + ' V' + (y + 6.5), INK, 1.8);
    } else if (kind === 'open') {
      s = P('M' + (x - 11) + ' ' + (y - 1) + ' Q' + x + ' ' + (y + 3) + ' ' + (x + 11) + ' ' + (y - 1) + ' Q' + (x + 10) + ' ' + (y + 14) + ' ' + x + ' ' + (y + 14) + ' Q' + (x - 10) + ' ' + (y + 14) + ' ' + (x - 11) + ' ' + (y - 1) + 'Z', red, ol(3.6)) +
        P('M' + (x - 6) + ' ' + (y + 11) + ' Q' + x + ' ' + (y + 5) + ' ' + (x + 6) + ' ' + (y + 11) + ' Q' + x + ' ' + (y + 15) + ' ' + (x - 6) + ' ' + (y + 11) + 'Z', '#ff8fa3');
    } else if (kind === 'o') s = E(x, y + 4, 4.6, 5.6, red, ol(3.4));
    else if (kind === 'smirk') s = ln('M' + (x - 11) + ' ' + (y + 1) + ' Q' + (x - 1) + ' ' + (y + 7) + ' ' + (x + 11) + ' ' + (y - 4), INK, 4);
    else if (kind === 'flat') s = ln('M' + (x - 7) + ' ' + (y + 3) + ' L' + (x + 7) + ' ' + (y + 3), INK, 4);
    else if (kind === 'pout') s = ln('M' + (x - 8) + ' ' + (y + 5) + ' Q' + x + ' ' + (y - 1) + ' ' + (x + 8) + ' ' + (y + 5), INK, 4);
    else if (kind === 'wave') s = ln('M' + (x - 11) + ' ' + (y + 2) + ' Q' + (x - 6) + ' ' + (y - 2) + ' ' + (x - 2) + ' ' + (y + 2) + ' Q' + (x + 3) + ' ' + (y + 6) + ' ' + (x + 7) + ' ' + (y + 1) + ' Q' + (x + 9) + ' ' + (y - 1) + ' ' + (x + 11) + ' ' + (y + 1), INK, 3.8);
    return '<g class="d-mouth">' + s + '</g>';
  }
  function blush(o) {
    o = o || {};
    var y = o.y || 110, dx = o.dx || 41, rx = o.rx || 10, op = o.op || 0.6;
    return E(100 - dx, y, rx, rx * 0.6, BLUSH, { opacity: op }) + E(100 + dx, y, rx, rx * 0.6, BLUSH, { opacity: op });
  }
  // 蹄子：圆圆的小腿 + 深色蹄尖
  function hoof(x, y, fill, hc) {
    var rx = 16, ry = 13, yy = y + 2, xo = f(rx * Math.sqrt(1 - 4 / (ry * ry)));
    return E(x, y, rx, ry, fill) +
      P('M' + f(x - xo) + ' ' + yy + ' A' + rx + ' ' + ry + ' 0 0 0 ' + f(x + xo) + ' ' + yy + ' Q' + x + ' ' + (yy - 5) + ' ' + f(x - xo) + ' ' + yy + 'Z', hc || '#6f5448') +
      ln('M' + f(x - xo + 1) + ' ' + yy + ' Q' + x + ' ' + (yy - 5) + ' ' + f(x + xo - 1) + ' ' + yy, INK, 3.2) +
      E(x, y, rx, ry, 'none', OL);
  }
  function hooves(fill, o) {
    o = o || {};
    var y = o.y || 177, dx = o.dx || 42, hc = o.hoof, xs = o.xs || [100 - dx, 100 + dx], s = '', i;
    for (i = 0; i < xs.length; i++) s += hoof(xs[i], y, o.fills ? o.fills[i] : fill, hc);
    return '<g class="d-paws">' + s + '</g>';
  }

  /* ---------- 马头部件 ---------- */
  var FACE = 'M100 36 C130 36 151 56 151 90 C151 110 146 120 146 130 L54 130 C54 120 49 110 49 90 C49 56 70 36 100 36Z';
  var MUZ = 'M100 114 C134 114 152 126 152 145 C152 164 130 173 100 173 C70 173 48 164 48 145 C48 126 66 114 100 114Z';
  function ear(fill, inner) { // 左耳（叶子形），右耳镜像
    return P('M66 66 Q46 38 62 9 Q84 26 88 52 Z', fill, OL) + (inner ? P('M69 56 Q57 38 64 22 Q78 34 81 52 Z', inner) : '');
  }
  function lockSwoop(fill) { // 额前一撮刘海
    return P('M84 62 Q70 54 74 38 Q82 22 104 24 Q124 26 130 40 Q120 36 112 40 Q122 50 116 62 Q110 50 100 48 Q102 58 84 62 Z', fill, OL);
  }
  function lockShort(fill) { // 短一点的刘海（给有眉毛表情的角色留位置）
    return P('M86 54 Q76 44 84 33 Q94 24 108 26 Q122 30 123 42 Q117 40 113 43 Q119 49 115 56 Q109 49 100 49 Q96 54 86 54 Z', fill, OL);
  }
  function maneFlow(fill) { // 右侧披下的鬃毛 + 左侧一小缕
    return P('M104 30 Q152 26 166 70 Q174 100 160 134 Q160 118 152 110 Q156 128 144 146 Q148 118 138 100 L116 60 Z', fill, OL) +
      P('M96 34 Q60 30 46 62 Q42 74 46 84 Q50 72 60 66 Z', fill, OL);
  }

  /* 通用小马：o = {coat, muzzle, maneC, earIn, eyes, eyeOpt, mouth, brows, marks, mmarks, back, mid, top, front, after, acc …} */
  function horse(id, o) {
    var s = o.back || '';
    if (o.mane !== false) s += o.maneSvg || (o.flip ? mirror(maneFlow(o.maneC)) : maneFlow(o.maneC));
    if (o.ears !== false) s += o.earSvg || pair(ear(o.earC || o.coat, o.earIn || PINK));
    s += o.mid || '';
    s += o.marks ? P(FACE, o.coat) + clipWith('hf' + id, FACE, o.marks) + P(FACE, 'none', OL) : P(FACE, o.coat, OL);
    s += o.mmarks ? P(MUZ, o.muzzle) + clipWith('hm' + id, MUZ, o.mmarks) + P(MUZ, 'none', OL) : P(MUZ, o.muzzle, OL);
    if (o.lock !== false) s += o.lockSvg || (o.flip ? mirror(lockSwoop(o.maneC)) : lockSwoop(o.maneC));
    s += o.top || '';
    if (o.brows) s += brows(o.brows, o.browOpt);
    s += eyes(o.eyes || 'dot', o.eyeOpt);
    if (o.nose !== false) s += nostrils(o.ny || 138, o.nostril);
    if (o.mouth !== false) s += mouth(o.mouth || 'smile', o.my || 152, o.mouthOpt);
    if (o.blush !== false) s += blush(o.blushOpt);
    s += o.front || '';
    if (o.hooves !== false) s += hooves(o.hoofC || o.coat, o.hoofOpt);
    s += o.after || '';
    if (o.acc) s += acc(o.acc);
    return s;
  }

  /* ---------- 道具 ---------- */
  function medal(x, y) { // 金牌（绶带挂在脖子上，从脸侧露出来）
    return P('M' + (x - 17) + ' ' + (y - 46) + ' L' + (x - 6) + ' ' + (y - 46) + ' L' + (x + 5) + ' ' + (y - 12) + ' L' + (x - 6) + ' ' + (y - 12) + 'Z', '#e8534a', ol(3.6)) +
      P('M' + (x + 17) + ' ' + (y - 46) + ' L' + (x + 6) + ' ' + (y - 46) + ' L' + (x - 5) + ' ' + (y - 12) + ' L' + (x + 6) + ' ' + (y - 12) + 'Z', '#4f8fe8', ol(3.6)) +
      E(x, y, 16, 16, '#ffd23f', ol(4)) + E(x, y, 10, 10, '#ffe57a', { stroke: '#e3a400', 'stroke-width': 2.4 }) + star5(x, y, 6.4, '#f5a800', 0) +
      P('M' + (x - 10) + ' ' + (y - 6) + ' Q' + (x - 9) + ' ' + (y - 11) + ' ' + (x - 4) + ' ' + (y - 12), 'none', { stroke: '#fff', 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: 0.85 });
  }
  function helmet() { // 骑士头盔 + 羽饰
    var steel = '#d3dae4', dark = '#9ba7b6';
    return P('M50 74 Q46 30 100 26 Q154 30 150 74 Q100 62 50 74 Z', steel, OL) +
      P('M60 50 Q66 38 80 33', 'none', { stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }) +
      ln('M100 28 V64', dark, 4) +
      ln('M53 68 Q100 56 147 68', INK, 3.4) +
      E(64, 64, 2.6, 2.6, dark) + E(82, 61, 2.6, 2.6, dark) + E(118, 61, 2.6, 2.6, dark) + E(136, 64, 2.6, 2.6, dark) +
      P('M92 62 L108 62 L104 82 Q100 86 96 82 Z', steel, ol(3.6));
  }
  function plumeRed() { // 头盔顶上的大红羽饰：从正中竖起，再向右后方飘
    return P('M90 32 C84 16 94 5 110 7 C130 9 150 20 160 38 C150 34 144 35 139 39 C148 46 152 56 150 66 C140 52 128 44 116 40 C114 34 110 31 106 32 Z', '#e8534a', OL) +
      ln('M98 18 Q104 11 116 12 M100 26 Q110 18 126 20 M120 30 Q136 32 146 46', '#ff8f80', 3);
  }
  function goggles() { // 护目镜推到额头上
    return band('M50 62 Q100 48 150 62', '#ff8a3d', 5) +
      E(83, 55, 14, 11.5, '#9fdcff', ol(4)) + E(117, 55, 14, 11.5, '#9fdcff', ol(4)) +
      ln('M96 54 Q100 51 104 54', INK, 4) +
      P('M75 51 Q79 46 85 46', 'none', { stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' }) +
      P('M109 51 Q113 46 119 46', 'none', { stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' });
  }
  function bib() { // 号码布「1」
    return P(rrect(79, 163, 42, 29, 5), '#fff', ol(4)) + P(rrect(84, 167, 32, 21, 3), 'none', { stroke: '#e8534a', 'stroke-width': 2.4 }) +
      ln('M95 172 L101 168 V185 M95 185 H107', INK, 3.8) +
      E(84, 167, 2, 2, '#9aa5b5') + E(116, 167, 2, 2, '#9aa5b5');
  }
  function shades(y) { // 墨镜滑到鼻梁上，眼睛从镜框上方往外瞄
    var lens = 'M0 0 H28 Q30 0 29.6 2.6 L28 10 Q26.4 16 19 16 H9 Q2 16 0.6 10 L-0.6 2.6 Q-1 0 0 0Z';
    return '<g transform="translate(57 ' + y + ')">' + P(lens, '#2a2430', ol(3.8)) + '</g><g transform="translate(115 ' + y + ')">' + P(lens, '#2a2430', ol(3.8)) + '</g>' +
      ln('M86 ' + (y + 3) + ' Q100 ' + (y - 3) + ' 114 ' + (y + 3), INK, 4) +
      ln('M53 ' + (y + 2) + ' L46 ' + (y - 2) + ' M147 ' + (y + 2) + ' L154 ' + (y - 2), INK, 3.6) +
      ln('M62 ' + (y + 5) + ' L71 ' + (y + 4) + ' M120 ' + (y + 5) + ' L129 ' + (y + 4), 'rgba(255,255,255,.8)', 3);
  }
  function roundGlasses() {
    var c = '#9a6a35';
    return E(72, 90, 15, 15, 'rgba(255,255,255,.28)', { stroke: c, 'stroke-width': 3.6 }) + E(128, 90, 15, 15, 'rgba(255,255,255,.28)', { stroke: c, 'stroke-width': 3.6 }) +
      ln('M87 89 Q100 82 113 89', c, 3.6) + ln('M57 88 L50 85 M143 88 L150 85', c, 3.4);
  }
  function map(x, y) { // 折叠小地图
    var d = 'M' + x + ' ' + (y + 4) + ' L' + (x + 13) + ' ' + y + ' L' + (x + 26) + ' ' + (y + 4) + ' L' + (x + 39) + ' ' + y + ' V' + (y + 28) + ' L' + (x + 26) + ' ' + (y + 32) + ' L' + (x + 13) + ' ' + (y + 28) + ' L' + x + ' ' + (y + 32) + 'Z';
    return P(d, '#fff3d1', ol(3.6)) +
      P('M' + (x + 13) + ' ' + y + ' V' + (y + 28) + ' L' + (x + 26) + ' ' + (y + 32) + ' V' + (y + 4) + 'Z', '#cdeac0') +
      ln('M' + (x + 13) + ' ' + y + ' V' + (y + 28) + ' M' + (x + 26) + ' ' + (y + 4) + ' V' + (y + 32), INK, 2.4) +
      ln('M' + (x + 5) + ' ' + (y + 24) + ' Q' + (x + 14) + ' ' + (y + 10) + ' ' + (x + 24) + ' ' + (y + 18) + ' T' + (x + 33) + ' ' + (y + 11), '#e8534a', 2.6, { 'stroke-dasharray': '3 4' }) +
      ln('M' + (x + 30) + ' ' + (y + 7) + ' l6 6 M' + (x + 36) + ' ' + (y + 7) + ' l-6 6', '#e8534a', 2.8);
  }
  function headphones() {
    var c = '#5fd3bc', d = '#3fb39d';
    return band('M42 96 Q34 24 100 22 Q166 24 158 96', c, 6) +
      P(rrect(31, 78, 20, 32, 9), c, ol(4)) + P(rrect(149, 78, 20, 32, 9), c, ol(4)) +
      ln('M37 86 V102 M163 86 V102', d, 3);
  }
  function saddlebags() {
    var lth = '#9a6236', flap = '#b87a45', paper = '#fffdf6';
    function sheet(cx, cy, deg) {
      return rot(deg, cx, cy, P(rrect(cx - 9, cy - 13, 18, 24, 2), paper, ol(3)) + ln('M' + (cx - 5) + ' ' + (cy - 7) + ' h10 M' + (cx - 5) + ' ' + (cy - 2) + ' h10 M' + (cx - 5) + ' ' + (cy + 3) + ' h6', '#a9b6c8', 2.2));
    }
    function bag(x) {
      return sheet(x + 9, 98, -16) + sheet(x + 26, 96, 14) + sheet(x + 17, 92, -2) +
        P(rrect(x, 102, 36, 46, 9), lth, ol(4.4)) +
        P('M' + x + ' 111 Q' + x + ' 102 ' + (x + 9) + ' 102 H' + (x + 27) + ' Q' + (x + 36) + ' 102 ' + (x + 36) + ' 111 V122 Q' + (x + 18) + ' 132 ' + x + ' 122Z', flap, ol(3.6)) +
        P(rrect(x + 13, 120, 10, 9, 2), '#ffd65c', ol(2.6));
    }
    return band('M36 96 Q40 26 100 24 Q160 26 164 96', '#7a4a2a', 3) + bag(16) + bag(148);
  }
  function clipboard(x, y) {
    return P(rrect(x, y, 38, 48, 6), '#c8935c', ol(4)) + P(rrect(x + 5, y + 8, 28, 35, 3), '#fff', { stroke: INK, 'stroke-width': 2.2 }) +
      P(rrect(x + 11, y - 4, 16, 10, 3), '#b9c3cf', ol(3)) +
      ln('M' + (x + 9) + ' ' + (y + 17) + ' l3 3 l5 -6 M' + (x + 9) + ' ' + (y + 27) + ' l3 3 l5 -6 M' + (x + 9) + ' ' + (y + 37) + ' l3 3 l5 -6', '#2fa36b', 2.6) +
      ln('M' + (x + 21) + ' ' + (y + 17) + ' h7 M' + (x + 21) + ' ' + (y + 27) + ' h7 M' + (x + 21) + ' ' + (y + 37) + ' h7', '#b8aca4', 2.4);
  }
  function flower(x, y, r, c) {
    var s = '', i, ang;
    for (i = 0; i < 5; i++) { ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5; s += E(x + r * Math.cos(ang), y + r * Math.sin(ang), r * 0.75, r * 0.75, c, ol(2.4)); }
    return s + E(x, y, r * 0.55, r * 0.55, '#ffd65c', ol(2.2));
  }
  function bandana(c) {
    return P('M64 160 Q100 176 136 160 L100 191 Z', c, ol(4)) +
      E(100, 176, 3, 3, '#fff') + E(88, 168, 2.6, 2.6, '#fff') + E(112, 168, 2.6, 2.6, '#fff') + E(100, 184, 2.2, 2.2, '#fff');
  }
  function bow(x, y, c, k) {
    k = k || 1;
    var w = 20 * k, h = 12 * k, b = 26 * k;
    return P('M' + x + ' ' + y + ' L' + f(x - w) + ' ' + f(y - h) + ' Q' + f(x - b) + ' ' + y + ' ' + f(x - w) + ' ' + f(y + h) + ' Z', c, ol(3.6)) +
      P('M' + x + ' ' + y + ' L' + f(x + w) + ' ' + f(y - h) + ' Q' + f(x + b) + ' ' + y + ' ' + f(x + w) + ' ' + f(y + h) + ' Z', c, ol(3.6)) +
      E(x - w * 0.55, y - h * 0.2, 2.2 * k, 2.2 * k, '#fff', { opacity: 0.85 }) + E(x + w * 0.55, y - h * 0.2, 2.2 * k, 2.2 * k, '#fff', { opacity: 0.85 }) +
      E(x, y, 6 * k, 6 * k, c, ol(3.4));
  }
  function feather(x, y, len, deg, c, rib) { // 一根弯弯的羽毛，根部在 (x, y)
    var d = 'M' + x + ' ' + y + ' C' + (x - 13) + ' ' + (y - len * 0.35) + ' ' + (x - 11) + ' ' + (y - len * 0.8) + ' ' + (x + 4) + ' ' + (y - len) +
      ' C' + (x + 12) + ' ' + (y - len * 0.75) + ' ' + (x + 10) + ' ' + (y - len * 0.3) + ' ' + x + ' ' + y + 'Z';
    return rot(deg, x, y, P(d, c, ol(3.6)) + ln('M' + x + ' ' + (y - 2) + ' Q' + (x - 2) + ' ' + (y - len * 0.5) + ' ' + (x + 2) + ' ' + (y - len * 0.86), rib, 2.4));
  }
  function plume() { // 马戏团羽毛头饰：三根大羽毛 + 宝石额饰
    return feather(96, 46, 36, -26, '#b98cf0', '#e2d0ff') + feather(104, 46, 36, 26, '#7fd6ff', '#d4f2ff') + feather(100, 46, 37, 0, '#ff6fae', '#ffd0e6') +
      P('M84 50 Q100 42 116 50 L114 56 Q100 50 86 56 Z', '#ffd23f', ol(3.2)) +
      E(100, 49, 6.5, 6, '#ffd23f', ol(3.2)) + E(100, 49, 3, 2.8, '#ff4f8b');
  }
  function lanyard(c) { // 工牌挂绳 + 工牌
    return band('M70 156 Q76 170 96 172 M130 156 Q124 170 104 172', c, 3) +
      P(rrect(84, 168, 32, 24, 4), '#fff', ol(3.6)) + P(rrect(88, 173, 10, 12, 2), '#9fd0ff') +
      ln('M102 176 h9 M102 182 h7', '#b9ada6', 2.6) + P(rrect(95, 165, 10, 6, 2), '#b9c3cf', ol(2.4));
  }
  function cowHorn(x) { // 左边的小牛角（向外弯）
    return P('M' + x + ' 50 Q' + (x - 4) + ' 34 ' + (x - 12) + ' 22 Q' + (x + 4) + ' 22 ' + (x + 12) + ' 44 Z', '#fbe8c4', ol(3.6)) +
      ln('M' + (x - 3) + ' 38 Q' + (x + 2) + ' 36 ' + (x + 6) + ' 39', '#e5c99a', 2.4);
  }
  function sun(x, y, r) {
    var s = '', i, ang;
    for (i = 0; i < 8; i++) {
      ang = (i * Math.PI) / 4;
      s += 'M' + f(x + (r + 4) * Math.cos(ang)) + ' ' + f(y + (r + 4) * Math.sin(ang)) + ' L' + f(x + (r + 9) * Math.cos(ang)) + ' ' + f(y + (r + 9) * Math.sin(ang)) + ' ';
    }
    return ln(s, '#f5a300', 3.4) + E(x, y, r, r, '#ffd65c', ol(3.4));
  }
  function moon(x, y, r) {
    return P('M' + x + ' ' + (y - r) + ' A' + r + ' ' + r + ' 0 1 0 ' + f(x + r * 0.62) + ' ' + f(y + r * 0.82) + ' A' + f(r * 0.8) + ' ' + f(r * 0.8) + ' 0 1 1 ' + x + ' ' + (y - r) + 'Z', '#ffe066', ol(3.4));
  }

  /* ---------- 16 匹马 + 隐藏款 + 彩蛋 ---------- */
  var ARTS = {
    qianli: function (id) { // 千里马：栗色 + 金牌
      return horse(id, {
        coat: '#e3925a', muzzle: '#f9d4ae', maneC: '#9a4f2c',
        marks: P('M97.5 58 Q100 55 102.5 58 L107 116 Q100 121 93 116 Z', '#fff2e2'),
        mouth: 'grin', mid: medal(167, 146),
        acc: star4(36, 30, 7, '#ffe066') + star4(176, 28, 9, '#ffe066')
      });
    },
    zhanma: function (id) { // 战马：深棕 + 头盔羽饰
      return horse(id, {
        coat: '#8a5236', muzzle: '#c9946f', maneC: '#2f2622', lock: false, top: helmet(), mid: plumeRed(),
        brows: 'determined', mouth: 'smile', nostril: { c: '#4a2d22' }
      });
    },
    saima: function (id) { // 赛马：护目镜 + 号码布 1
      return horse(id, {
        coat: '#b3c2d7', muzzle: '#e6ecf5', maneC: '#4c5a7a', top: goggles(),
        brows: 'worry', mouth: 'wave', front: bib(),
        acc: drop(170, 24, 0.9)
      });
    },
    hanxue: function (id) { // 汗血宝马：金色 + 墨镜 + 闪光
      return horse(id, {
        coat: '#f3bf45', muzzle: '#fde2a0', maneC: '#d9821c', earIn: '#ffc58e',
        marks: ln('M62 62 Q68 50 80 46', 'rgba(255,255,255,.75)', 5) + ln('M134 52 Q140 56 142 64', 'rgba(255,255,255,.6)', 4),
        lockSvg: lockShort('#d9821c'), brows: 'raise', mouth: 'smirk', front: shades(94),
        acc: star4(26, 40, 8, '#fff3a8') + star4(176, 30, 11, '#fff3a8') + star4(186, 60, 6, '#fff3a8')
      });
    },
    laoma: function (id) { // 老马：灰白 + 圆眼镜 + 小地图
      return horse(id, {
        coat: '#cdc6be', muzzle: '#efe9e2', maneC: '#fbf8f3', earIn: '#f2c4cc',
        top: ln('M60 72 Q70 66 82 70 M140 72 Q130 66 118 70', '#fffaf3', 6),
        front: roundGlasses(), mouth: 'smile',
        after: map(150, 150)
      });
    },
    heima: function (id) { // 黑马：白色星形额斑 + 耳机
      return horse(id, {
        coat: '#4b4654', muzzle: '#6e6679', maneC: '#24212a', earIn: '#d79ab0',
        marks: star5(100, 74, 10, '#fffdf8', 0),
        eyeOpt: { ink: '#100d12' }, nostril: { c: '#2a2530' }, top: headphones(), blushOpt: { op: 0.5 },
        acc: note(174, 30, 1, '#5fd3bc') + note(24, 50, 0.7, '#ffd65c')
      });
    },
    tuoma: function (id) { // 驮马：两侧鞍袋塞满文件 + 汗滴
      return horse(id, {
        coat: '#b37b4e', muzzle: '#e8bb90', maneC: '#5e3b25', mid: saddlebags(),
        brows: 'worry', mouth: 'wave',
        acc: drop(160, 20, 1)
      });
    },
    banma: function (id) { // 斑马：条纹 + 夹板打勾
      var st = '#3b3640';
      var stripes = ln('M44 62 Q58 66 66 74 M42 80 Q50 80 58 86 M44 104 Q54 102 62 108 M48 120 Q58 118 66 124', st, 6.5) +
        ln('M156 62 Q142 66 134 74 M158 80 Q150 80 142 86 M156 104 Q146 102 138 108 M152 120 Q142 118 134 124', st, 6.5) +
        ln('M85 58 Q89 68 88 80 M115 58 Q111 68 112 80 M100 62 V82', st, 5.5);
      var mohawk = 'M76 46 Q78 18 100 16 Q122 18 124 46 Z';
      var mstripes = ln('M84 14 L88 48 M100 12 V48 M116 14 L112 48', st, 6);
      var earZ = P('M66 66 Q46 38 62 9 Q84 26 88 52 Z', '#fdfdfd', OL) + P('M69 56 Q57 38 64 22 Q78 34 81 52 Z', PINK) + P('M58 26 Q60 14 62 9 Q70 14 74 22 Q66 20 58 26Z', st);
      return horse(id, {
        coat: '#fdfdfd', muzzle: '#857f8c', mane: false, earSvg: pair(earZ),
        marks: stripes, lockSvg: P(mohawk, '#fdfdfd') + clipWith('zm' + id, mohawk, mstripes) + P(mohawk, 'none', OL),
        nostril: { c: '#2b2730' }, mouth: 'smile',
        after: clipboard(150, 136)
      });
    },
    carousel: function (id) { // 旋转木马：白马 + 粉彩鬃毛 + 金色螺旋杆 + 花环
      var pd = rrect(92, 18, 16, 170, 4), tw = '', ty;
      for (ty = 10; ty < 200; ty += 11) tw += 'M86 ' + (ty + 12) + ' L114 ' + ty + ' ';
      var pole = P(pd, '#f8cd55') + clipWith('cp' + id, pd, ln(tw, '#d99a26', 4.4) + ln('M96 18 V188', 'rgba(255,255,255,.55)', 2.4)) + P(pd, 'none', OL) +
        E(100, 20, 12, 6, '#ffd65c', OL) + E(100, 12.5, 3.6, 3.6, '#ffd65c', ol(3.2)) + E(100, 187, 12, 5, '#ffd65c', OL);
      var mane = P('M104 30 Q152 26 166 70 Q174 100 160 134 Q160 118 152 110 Q156 128 144 146 Q148 118 138 100 L116 60 Z', '#ffb6d3', OL) +
        P('M150 58 Q170 84 164 110 Q156 96 148 92 Q156 80 150 58Z', '#c6b4ff', ol(3.4)) +
        P('M96 34 Q60 30 46 62 Q42 74 46 84 Q50 72 60 66 Z', '#a8e6cf', OL);
      var lock = P('M84 62 Q70 54 74 38 Q82 22 104 24 Q124 26 130 40 Q120 36 112 40 Q122 50 116 62 Q110 50 100 48 Q102 58 84 62 Z', '#ffb6d3', OL) +
        P('M88 52 Q82 40 92 32 Q98 36 96 44 Q92 46 88 52Z', '#c6b4ff');
      var crown = flower(70, 62, 5.5, '#ff9fc4') + flower(130, 62, 5.5, '#b9a6ff') + flower(84, 56, 4.6, '#9fe3c8') + flower(116, 56, 4.6, '#ffd08a');
      return horse(id, {
        coat: '#fffaf4', muzzle: '#ffe6ee', back: pole, maneSvg: mane, lockSvg: lock, earIn: '#ffc6d9',
        top: crown, eyes: 'happy', mouth: 'open', blushOpt: { op: 0.75 },
        acc: star4(30, 40, 7, '#ffe8a3') + star4(178, 34, 8, '#ffe8a3')
      });
    },
    yema: function (id) { // 野马：狂野鬃毛 + 方巾
      var c = '#5a3826';
      var mane = P('M100 28 Q150 18 172 54 Q192 82 184 116 Q176 104 168 102 Q182 128 170 158 Q162 140 150 132 Q156 118 146 96 L118 58 Z', c, OL) +
        P('M98 30 Q56 22 36 50 Q22 70 28 96 Q36 84 46 82 Q40 66 52 60 Z', c, OL);
      var lock = P('M80 64 Q62 56 66 38 Q74 20 100 20 Q130 20 138 38 Q126 34 118 38 Q130 48 126 62 Q118 50 108 50 Q112 60 104 66 Q98 52 90 52 Q92 60 80 64 Z', c, OL);
      return horse(id, {
        coat: '#d9a066', muzzle: '#f4d4a8', maneSvg: mane, lockSvg: lock,
        brows: 'determined', mouth: 'grin', front: bandana('#e8534a')
      });
    },
    pony: function (id) { // 小马驹：小小一只 + 大眼睛 + 蝴蝶结
      return place(18, 28, 0.82, horse(id, {
        coat: '#ffe4d6', muzzle: '#fff6f0', maneC: '#ffadc9', earIn: '#ffc0cf',
        eyes: 'huge', mouth: 'smile', blushOpt: { op: 0.8, rx: 11, dx: 44, y: 112 },
        top: rot(-14, 112, 30, bow(112, 30, '#ff5f7e', 1.35)),
        acc: heart(176, 34, 0.9, '#ff8fb1') + heart(24, 48, 0.6, '#ffb3c8')
      }));
    },
    showpony: function (id) { // 戏精马：马戏团羽饰 + 星星贴纸
      return horse(id, {
        coat: '#e4d0f7', muzzle: '#f8f1ff', maneC: '#a978e0', earIn: '#ffbfe0', lock: false,
        top: P('M84 62 Q70 54 74 40 Q80 30 96 30 L104 30 Q120 30 126 40 Q130 54 116 62 Q112 50 100 52 Q88 50 84 62Z', '#a978e0', OL) + plume(),
        eyes: 'lash', mouth: 'open', blush: false,
        front: star5(56, 112, 8, '#ffd23f', 2.6) + star5(146, 108, 6, '#ff9fc4', 2.4) + star5(138, 122, 4.6, '#7fd6ff', 2.2),
        acc: star4(28, 36, 7, '#ffe066') + star4(176, 50, 9, '#ffe066')
      });
    },
    hippo: function (id) { // 河马：超宽圆头 + 小圆耳 + 大鼻孔 + 咖啡
      var c = '#b9adcd', m = '#dbd1e8';
      var head = 'M100 44 C148 44 176 70 176 104 C176 114 174 122 170 128 L30 128 C26 122 24 114 24 104 C24 70 52 44 100 44Z';
      var muz = 'M100 102 C150 102 182 120 182 144 C182 168 148 178 100 178 C52 178 18 168 18 144 C18 120 50 102 100 102Z';
      var earL = E(60, 50, 13, 12, c, OL) + E(60, 51, 6.5, 6, PINK);
      var cup = P('M143 128 L173 128 L168 176 L148 176 Z', '#fff6ea', ol(4)) + P('M145 144 L171 144 L169 160 L147 160 Z', '#c8956a', ol(3)) +
        P(rrect(139, 120, 38, 10, 4), '#8a6a5a', ol(3.6)) + P(rrect(150, 114, 16, 8, 3), '#8a6a5a', ol(3));
      var foot = function (x, y) {
        return E(x, y, 17, 13, c, OL) + E(x - 7, y + 6, 3.6, 3, '#f1ebf7', ol(2)) + E(x, y + 8, 3.6, 3, '#f1ebf7', ol(2)) + E(x + 7, y + 6, 3.6, 3, '#f1ebf7', ol(2));
      };
      return pair(earL) + P(head, c, OL) + P(muz, m, OL) +
        eyes('dot', { y: 80, xl: 68 }) +
        E(76, 124, 7, 9.5, '#7f7096', { transform: 'rotate(-16 76 124)' }) + E(124, 124, 7, 9.5, '#7f7096', { transform: 'rotate(16 124 124)' }) +
        '<g class="d-mouth">' + ln('M70 150 Q100 168 130 150', INK, 4.4) + P('M84 156 L84 163 L91 163 L91 159 Z', '#fff', ol(2.4)) + P('M116 156 L116 163 L109 163 L109 159 Z', '#fff', ol(2.4)) + '</g>' +
        blush({ y: 98, dx: 58, rx: 11 }) + cup + '<g class="d-paws">' + foot(50, 176) + foot(150, 178) + '</g>' +
        acc(ln('M152 106 Q146 99 152 92 Q158 85 152 78 M165 106 Q159 99 165 92 Q171 85 165 78', 'rgba(58,42,34,.45)', 3.4));
    },
    rocking: function (id) { // 木马：木头马头 + 彩点 + 弧形摇板
      var wood = '#e9b47c', dk = '#c98d55';
      var grain = ln('M60 60 Q66 76 62 96 M140 58 Q134 74 138 92 M84 100 Q88 108 86 118', '#d59a62', 2.6);
      var dots = E(60, 106, 5.5, 5.5, '#e8534a', ol(2.2)) + E(140, 106, 5.5, 5.5, '#5aa9e6', ol(2.2)) + E(122, 68, 3.8, 3.8, '#ffd65c', ol(2)) + E(78, 68, 3.8, 3.8, '#5aa9e6', ol(2));
      var yarn = '#e8534a';
      var mane = P('M104 30 Q150 24 164 62 Q172 88 162 118 Q156 104 152 100 Q160 86 152 72 Q146 92 138 98 Q146 74 132 58 Z', yarn, OL) +
        P('M96 32 Q62 26 48 56 Q46 66 50 76 Q54 64 64 60 Z', yarn, OL);
      var lock = yarnLock(yarn);
      var peg = band('M30 66 H170', '#c98d55', 7) + E(28, 66, 6, 6, '#e9b47c', ol(3.4)) + E(172, 66, 6, 6, '#e9b47c', ol(3.4));
      var rocker = band('M18 168 Q100 200 182 168', '#c98d55', 9) + ln('M34 176 Q100 196 166 176', '#e9b47c', 2.4);
      var bridle = ln('M48 128 Q100 112 152 128', INK, 7) + ln('M48 128 Q100 112 152 128', '#3f7fd6', 3.6) + E(100, 120, 4.2, 4.2, '#ffd23f', ol(2.4)) + E(52, 128, 4.6, 4.6, '#ffd23f', ol(2.4)) + E(148, 128, 4.6, 4.6, '#ffd23f', ol(2.4));
      return horse(id, {
        coat: wood, muzzle: '#f5cc9b', earIn: dk, maneSvg: mane, lockSvg: lock, mid: peg, marks: grain + dots,
        nostril: { c: '#7a4a2a', rx: 3.6, ry: 4.6 }, mouth: 'smile', mouthOpt: { c: '#c0392b' }, blush: false,
        front: bridle, hoofOpt: { y: 166, hoof: '#3a2f2a' }, after: rocker
      });
    },
    seahorse: function (id) { // 海马：侧身卷尾
      var body = '#a6e3d3', belly = '#eafff8', fin = '#ffc4dc', dk = '#78c8b4';
      var headD = 'M74 62 C74 38 92 24 112 26 C132 28 142 44 140 60 C138 74 130 82 118 86 L86 86 C78 80 74 72 74 62Z';
      var snoutD = 'M128 52 L164 58 C174 60 176 76 164 78 L126 76 Z';
      var bodyD = 'M84 72 C62 90 58 126 78 150 C90 164 116 162 124 146 C140 120 136 92 118 78 Z';
      var tailD = 'M100 152 C96 172 106 184 122 182 C138 180 144 166 136 158 C128 151 118 157 122 165';
      var finD = 'M70 104 C50 98 40 112 44 126 C48 138 60 142 70 136 Z';
      var crest = 'M90 36 L92 16 L102 27 L110 12 L117 27 L127 17 L126 40 Z';
      var THICK = { stroke: INK, 'stroke-width': 10, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
      var bellyD = 'M112 82 C134 92 138 124 122 148 C114 158 102 156 100 148 C112 128 112 102 104 84 Z';
      return P(finD, fin, OL) + ln('M48 112 L66 112 M47 122 L66 120 M52 132 L66 128', '#ff9cc4', 2.4) +
        P(crest, fin, OL) +
        P(headD, INK, THICK) + P(snoutD, INK, THICK) + P(bodyD, INK, THICK) + ln(tailD, INK, 23) +
        ln(tailD, body, 13) + P(bodyD, body) + P(headD, body) + P(snoutD, body) +
        clipWith('sb' + id, bodyD, P(bellyD, belly) + ln('M104 98 Q116 96 124 100 M108 112 Q120 110 128 114 M108 126 Q120 125 127 128 M104 140 Q114 140 120 142', dk, 3)) +
        E(84, 106, 3, 3, dk) + E(80, 124, 2.4, 2.4, dk) + E(90, 92, 2.2, 2.2, dk) +
        P('M96 70 Q88 62 92 52 Q100 58 102 68 Z', fin, ol(3)) +
        '<g class="d-eyes">' + E(112, 54, 8.4, 10, EYE) + E(114.6, 50.4, 3.4, 3, '#fff') + E(109.6, 58, 1.6, 1.4, '#fff') + '</g>' +
        E(124, 70, 8, 5, BLUSH, { opacity: 0.65 }) +
        ln('M168 64 Q171 68 168 72', INK, 3) +
        acc(bubbleDot(178, 42, 6) + bubbleDot(186, 22, 4.4) + bubbleDot(166, 24, 3.6));
    },
    mule: function (id) { // 骡子：超长耳朵 + 倔强眉 + 小乌云
      var c = '#a08672', m = '#ece0d2';
      var longEar = P('M64 70 Q24 54 18 14 Q52 16 92 52 Z', c, OL) + P('M66 60 Q34 48 28 22 Q54 28 82 52 Z', '#ffbfc8') + P('M18 14 Q32 14 44 18 Q30 24 22 28 Q19 22 18 14Z', '#5a4636');
      var mane = P('M118 38 Q150 40 160 74 Q164 92 156 108 Q150 90 140 82 Z', '#55402f', OL);
      var cl = 'M80 32 Q71 32 71 25.5 Q71 18.5 79 18.5 Q81 11 91 12 Q97 6 107 10 Q117 8.5 121 16.5 Q129 17.5 129 24.5 Q129 32 120 32 Z';
      return horse(id, {
        coat: c, muzzle: m, earSvg: pair(longEar), maneSvg: mane, maneC: '#55402f',
        lockSvg: P('M88 56 Q84 44 92 38 Q100 34 108 38 Q116 44 112 56 Q106 49 100 52 Q94 49 88 56Z', '#55402f', OL),
        brows: 'stubborn', mouth: 'pout', blushOpt: { op: 0.7 },
        acc: ln('M86 37 l-2.5 6 M100 38 l-2.5 6 M114 37 l-2.5 6', '#4f95ff', 3.4) + P(cl, '#b9c3d6', ol(3.6)) + ln('M84 23 Q86 19 91 18.5 M101 14 Q105 12 109 13.5', '#e9eef7', 2.6)
      });
    },

    /* ---------- 隐藏款 ---------- */
    mystery: function (id) { // 白马非马：白马 + 挑眉 + 问号 + 蹄子托腮
      return horse(id, {
        coat: '#fdfbff', muzzle: '#efeaf6', maneC: '#d8d1e8', earIn: '#f7c9d6', lockSvg: lockShort('#d8d1e8'),
        brows: 'raise', mouth: 'smirk', mouthOpt: { x: 104 },
        hoofOpt: { xs: [142] },
        after: '<g class="d-paws">' + rot(-32, 70, 168, hoof(70, 168, '#fdfbff')) + '</g>',
        acc: qmark(174, 34, 1.1)
      });
    },
    echo: function (id) { // 牛马本马：奶牛斑 + 小牛角 + 工牌 + 对勾气泡
      var spots = 'M48 52 Q60 44 70 52 Q76 62 66 68 Q54 72 48 64Z M124 96 Q134 92 142 98 Q148 108 140 114 Q128 116 124 106Z M102 66 Q110 62 116 68 Q118 76 110 78 Q102 78 102 66Z';
      return horse(id, {
        coat: '#ffffff', muzzle: '#ffc7d3', maneC: '#3d3842', earIn: '#ffc0cc',
        marks: P(spots, '#3d3842'),
        mid: cowHorn(78) + mirror(cowHorn(78)),
        lockSvg: P('M88 56 Q82 42 92 34 Q100 30 110 34 Q118 42 112 56 Q106 48 100 52 Q94 48 88 56Z', '#3d3842', OL),
        eyes: 'big', mouth: 'open', front: lanyard('#4f8fe8'), hoofC: '#ffffff', hoofOpt: { dx: 46 },
        acc: P('M144 10 h40 a9 9 0 0 1 9 9 v14 a9 9 0 0 1 -9 9 h-22 l-9 9 l2 -9 h-11 a9 9 0 0 1 -9 -9 v-14 a9 9 0 0 1 9 -9z', '#fff', ol(3.4)) +
          ln('M154 26 l6 6 l12 -12', '#2fa36b', 4.4)
      });
    },
    rebel: function (id) { // 脱缰野马：风吹鬃毛 + 断缰绳 + 斜眼坏笑 + 风线
      var c = '#c8644a', m = '#f0b99c', mn = '#3b2a24';
      var mane = P('M98 28 Q150 14 184 36 Q170 42 166 48 Q188 58 188 78 Q172 70 162 72 Q176 92 170 112 Q160 96 148 92 L118 58 Z', mn, OL) +
        P('M96 32 Q70 26 54 40 Q66 44 70 52 Z', mn, OL);
      var lock = P('M80 60 Q68 46 80 34 Q96 22 122 24 Q144 26 156 18 Q152 34 140 38 Q150 42 154 52 Q138 46 126 48 Q130 56 124 62 Q114 50 102 50 Q98 58 80 60Z', mn, OL);
      var rein = band('M52 128 Q100 112 148 128', '#8a5a36', 4) +
        band('M48 134 Q28 146 32 166', '#8a5a36', 5) +
        ln('M27 167 L22 177 M32 168 L31 180 M37 167 L41 177', '#8a5a36', 3) +
        ln('M17 158 L11 154 M16 168 L9 169 M22 180 L17 186', '#ffb02e', 3) +
        E(50, 131, 6, 6, '#ffd23f', ol(3.2));
      return horse(id, {
        coat: c, muzzle: m, maneSvg: mane, lockSvg: lock, earIn: '#ffb0a8',
        eyes: 'side', eyeOpt: { fur: c }, mouth: 'smirk', front: rein,
        acc: ln('M10 64 H34 M6 84 H28 M12 104 H32', '#9fb4c8', 4) + ln('M20 46 Q30 38 38 46 Q42 52 36 54', '#9fb4c8', 3.4)
      });
    },
    diode: function (id) { // 马上马下：一半醒着一半睡
      var day = '#ffd27a', night = '#a7b1d6';
      var half = '<rect x="100" y="0" width="100" height="200" fill="' + night + '"/>';
      var halfM = '<rect x="100" y="0" width="100" height="200" fill="#dfe4f4"/>';
      var cap = P('M120 40 Q150 10 178 28 Q186 46 182 64 Q170 44 146 52 Z', '#7d86c9', ol(4)) +
        ln('M134 30 Q150 26 160 36 M146 22 Q162 22 170 32', '#c8cdf3', 3.4) +
        P('M118 46 Q146 30 172 52', 'none', { stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round' }) + ln('M118 46 Q146 30 172 52', '#ffffff', 5) +
        E(182, 68, 7, 7, '#fff', ol(3.4));
      var sw = P(rrect(80, 170, 40, 20, 10), '#fff', ol(3.6)) + P('M90 170 H100 V190 H90 Q80 190 80 180 Q80 170 90 170Z', '#ffd23f') + P(rrect(80, 170, 40, 20, 10), 'none', ol(3.6)) + E(110, 180, 7, 7, '#3a3b45', ol(2.6));
      return horse(id, {
        coat: day, muzzle: '#fff2cf', maneC: '#6f78a3', marks: half, mmarks: halfM,
        earSvg: ear(day, PINK) + mirror(ear(night, '#d0d6f0')),
        lockSvg: P('M84 62 Q70 54 74 38 Q82 22 104 24 Q124 26 130 40 Q120 36 112 40 Q122 50 116 62 Q110 50 100 48 Q102 58 84 62 Z', '#f0a03a', OL),
        top: cap, mouth: 'smile', blushOpt: { op: 0.6 },
        eyes: 'split',
        front: sw, hoofOpt: { fills: [day, night] },
        acc: sun(28, 30, 10) + ln('M150 92 h7 l-7 8 h7', '#7d8cff', 3)
      });
    },

    /* ---------- 彩蛋卡 ---------- */
    speed: function (id) { // 快马加鞭：涡轮火焰 + 速度线 + 坚定眼神
      var flame = P('M44 150 Q19 160 9 146 Q21 142 23 134 Q11 128 15 114 Q29 122 39 120 Q35 106 45 96 Q51 116 63 126 Z', '#ff7a3d', ol(4)) +
        P('M44 140 Q31 144 25 138 Q35 132 33 126 Q43 128 51 128 Z', '#ffd23f');
      return flame + horse(id, {
        coat: '#f2f4fa', muzzle: '#ffffff', maneC: '#ff6a3d', flip: true, earIn: '#ffc0c8',
        brows: 'determined', mouth: 'grin',
        acc: ln('M14 62 H34 M10 80 H28 M18 98 H32', '#9aa4b8', 4)
      });
    },
    sloth: function (id) { // 马拉松选手：头带 + 汗滴 + 水壶
      var headband = band('M50 66 Q100 52 150 66', '#4f8fe8', 8) + P('M146 62 Q164 56 174 66 Q164 68 160 74 Z', '#4f8fe8', ol(3.4)) + P('M146 66 Q158 76 160 90 Q150 84 144 76 Z', '#4f8fe8', ol(3.4));
      var bottle = P(rrect(148, 126, 26, 44, 8), '#9fdcff', ol(4)) + P(rrect(153, 116, 16, 12, 3), '#ff8a3d', ol(3.4)) + P(rrect(148, 140, 26, 14, 2), '#ffffff', { opacity: 0.6 });
      return horse(id, {
        coat: '#c9ab8a', muzzle: '#f1dfc8', maneC: '#7a5a40', top: headband,
        eyes: 'half', eyeOpt: { fur: '#c9ab8a' }, mouth: 'smile',
        mid: bottle,
        acc: drop(30, 40, 0.9) + drop(172, 96, 0.7)
      });
    },
    night: function (id) { // 夜奔马：深蓝马 + 月亮星星 + 眼罩推到额头
      var mask = P('M64 50 Q64 38 82 38 Q96 38 100 46 Q104 38 118 38 Q136 38 136 50 Q136 62 118 62 Q104 62 100 56 Q96 62 82 62 Q64 62 64 50Z', '#d6c4ff', ol(4)) +
        ln('M74 52 Q82 58 90 52 M110 52 Q118 58 126 52', INK, 3) + ln('M58 52 H64 M136 52 H142', '#d6c4ff', 4);
      return horse(id, {
        coat: '#41509b', muzzle: '#6a78c4', maneC: '#232b5e', earIn: '#a7b4ff',
        top: mask, eyeOpt: { ink: '#120f2e' }, nostril: { c: '#232a5c' }, blushOpt: { op: 0.55 },
        acc: moon(170, 30, 15) + star4(30, 34, 7, '#fff3a8') + star4(186, 70, 5, '#fff3a8') + star4(18, 82, 4.6, '#fff3a8')
      });
    },
    early: function (id) { // 晨跑马：身后朝阳 + 运动发带
      var sunrise = acc(sun(152, 54, 30)); // 身后的太阳也轻轻浮动，像在升起
      var sweat = band('M50 64 Q100 50 150 64', '#ffffff', 9) + ln('M50 64 Q100 50 150 64', '#ff6f6f', 2.4, { 'stroke-dasharray': '1 9' });
      return horse(id, {
        coat: '#ffdfb0', muzzle: '#fff4de', maneC: '#ff9447', back: sunrise, top: sweat,
        mouth: 'open', eyes: 'dot'
      });
    },
    again: function (id) { // 回头马：屁股朝外，回头看你，嘴里叼着回头草
      var c = '#bfe6d4', mn = '#3f8f7f';
      // 背影：圆滚滚的马屁股 + 中间垂下的尾巴 + 两只后蹄
      var rump = 'M76 140 C76 110 96 96 118 96 C127 96 132 100 135 105 C138 100 143 96 152 96 C174 96 192 112 192 140 C192 168 170 182 134 182 C98 182 76 168 76 140Z';
      var tail = P('M129 104 Q135 96 141 104 Q147 124 151 144 Q157 166 147 188 Q141 174 135 170 Q139 152 133 138 Q127 120 129 104Z', mn, OL) +
        ln('M139 114 Q143 134 143 154 M135 128 Q139 148 141 166', '#6cb3a2', 2.6);
      var grass = ln('M112 158 L134 140 M112 160 L140 150 M112 162 L142 162 M112 164 L134 174', INK, 7.4) +
        ln('M112 158 L134 140 M112 160 L140 150 M112 162 L142 162 M112 164 L134 174', '#6cc96f', 3.4);
      var head = horse(id, { coat: c, muzzle: '#eefaf4', maneC: mn, hooves: false, mouth: 'smile', mouthOpt: { x: 96 }, front: grass, eyes: 'look', eyeOpt: { dx: -2 } });
      return P(rump, c, OL) + ln('M134 104 Q120 120 122 148', '#9fd2bd', 3.4) + tail +
        '<g class="d-paws">' + hoof(112, 178, c) + hoof(162, 178, c) + '</g>' +
        rot(-8, 70, 110, place(-6, 4, 0.78, head)) +
        acc(band('M178 50 A16 16 0 1 0 160 64', '#ffd65c', 4.4) + P('M150 63 L163 55 L165 70 Z', '#ffd65c', ol(3)));
    },
    twin: function (id) { // 双马同槽：两匹小马贴贴 + 一个桶
      var h1 = horse(id + 'a', { coat: '#f6c8a0', muzzle: '#fde6cf', maneC: '#a0603a', hooves: false, eyes: 'happy', flip: true });
      var h2 = horse(id + 'b', { coat: '#d2ddf4', muzzle: '#eff3fd', maneC: '#56648f', hooves: false, eyes: 'happy', earIn: '#ffc0cf', flip: true });
      var bucket = P('M56 140 Q74 128 88 136 Q100 124 112 136 Q126 128 144 140 Z', '#ffcf6a', ol(3.6)) +
        P('M86 134 L96 116 L102 136 Z', '#ff8a3d', ol(3)) + ln('M95 116 l-4 -7 M96 116 l3 -8', '#58b95c', 3.2) +
        P('M54 140 H146 L138 192 H62 Z', '#7fb5e8', ol(4.4)) + ln('M57 156 H143 M60 176 H140', '#5b8fc6', 4) + ln('M66 146 L64 182', 'rgba(255,255,255,.6)', 3);
      return mirror(rot(7, 64, 120, place(-2, 5, 0.66, h2))) + rot(7, 64, 120, place(-2, 5, 0.66, h1)) + bucket +
        '<g class="d-paws">' + hoof(70, 144, '#f6c8a0') + hoof(130, 144, '#d2ddf4') + '</g>' +
        acc(heart(100, 20, 0.95));
    },
    shiny: function (id) { // 闪光宝驹：金色 + 满屏闪光
      return horse(id, {
        coat: '#ffd84d', muzzle: '#fff3b8', maneC: '#ffac1c', earIn: '#ffc98f',
        marks: ln('M62 62 Q68 50 80 46', 'rgba(255,255,255,.8)', 5),
        eyes: 'sparkle', mouth: 'open', blushOpt: { op: 0.7 },
        acc: sparkles([[26, 34, 10, '#fff3a8'], [178, 30, 12, '#fff3a8'], [186, 98, 7, '#fff3a8'], [17, 108, 7, '#fff3a8'], [30, 150, 6, '#fff3a8'], [174, 150, 6, '#fff3a8']])
      });
    },
    petter: function (id) { // 撸马达人：被梳毛梳到眯眼 + 刷子 + 爱心
      var bristles = '', bx, by;
      for (by = 0; by < 3; by++) for (bx = 0; bx < 3; bx++) bristles += E(150.3 + bx * 7 + (by % 2 ? 3.5 : 0), 32 + by * 7, 1.8, 1.8, '#fff7ee');
      var brush = rot(36, 158, 50, band('M158 58 L158 84', '#c98d55', 7) + E(158, 40, 16, 19, '#c98d55', ol(4.4)) + E(158, 40, 11, 13.5, '#f2d2b0') + bristles);
      return horse(id, {
        coat: '#ffe1ea', muzzle: '#fff4f7', maneC: '#ee86ae', eyes: 'closed', mouth: 'open', blushOpt: { op: 0.85, rx: 11 },
        acc: brush + heart(30, 50, 0.9, '#ff8fb1') + heart(20, 84, 0.6, '#ffb3c8') + ln('M140 20 Q146 14 152 16 M188 92 Q192 98 188 104', '#ff8fb1', 3)
      });
    },
    work: function (id) { // 带薪摸鱼马：工牌 + 怀里抱条小鱼 + 偷乐
      var c = '#f2d2a6';
      var fish = P('M40 174 Q58 158 92 161 Q120 164 140 174 L163 160 Q159 175 165 190 L140 179 Q118 191 88 189 Q56 188 40 174Z', '#6fc3ff', ol(4.4)) +
        P('M64 162 Q74 155 88 157 L82 165 Z', '#4aa8ec', ol(3)) +
        E(56, 172, 4, 4, INK) + E(57.4, 170.6, 1.4, 1.4, '#fff') + ln('M44 176 Q48 180 52 179', INK, 2.6) +
        ln('M118 170 Q122 177 118 184 M128 172 Q131 177 128 182', '#4aa8ec', 2.6);
      var badge = band('M58 118 Q48 132 52 142', '#ff6f91', 3) + P(rrect(34, 140, 26, 30, 4), '#fff', ol(3.6)) + P(rrect(39, 146, 9, 10, 2), '#9fd0ff') + ln('M51 148 h5 M39 162 h16', '#b9ada6', 2.4) + P(rrect(42, 136, 10, 6, 2), '#b9c3cf', ol(2.4));
      return horse(id, {
        coat: c, muzzle: '#fff1dd', maneC: '#8a5a3a', eyes: 'side', eyeOpt: { fur: c }, mouth: 'smirk', my: 148, ny: 135,
        front: badge + fish, hoofOpt: { y: 175, xs: [86, 120] },
        acc: star4(178, 34, 8, '#ffe066') + drop(24, 40, 0.7)
      });
    },
    carrot: function (id) { // 胡萝卜猎手：叼着大胡萝卜
      var car = P('M58 150 Q60 140 72 142 L146 146 Q156 148 154 158 Q150 166 140 164 L70 160 Q58 160 58 150Z', '#ff8a3d', ol(4)) +
        ln('M84 146 L86 152 M104 147 L106 154 M124 148 L126 154', '#d9631e', 3) +
        P('M152 150 Q168 134 178 140 Q170 146 160 154 Z', '#58b95c', ol(3.4)) + P('M154 156 Q176 158 182 168 Q168 168 156 160 Z', '#6cc96f', ol(3.4));
      return horse(id, {
        coat: '#f0c08a', muzzle: '#fde3c3', maneC: '#a35f35', eyes: 'happy', mouth: false, front: car,
        acc: sparkles([[30, 36, 8, '#ffe066'], [178, 32, 10, '#ffe066'], [184, 92, 6, '#ffe066']])
      });
    }
  };

  function yarnLock(c) { // 毛线刘海：一排圆头毛线穗
    var s = '', i, x;
    for (i = 0; i < 5; i++) {
      x = 80 + i * 10;
      s += P('M' + (x - 5.5) + ' 28 V' + (50 + (i % 2) * 5) + ' Q' + (x - 5.5) + ' ' + (56 + (i % 2) * 5) + ' ' + x + ' ' + (56 + (i % 2) * 5) + ' Q' + (x + 5.5) + ' ' + (56 + (i % 2) * 5) + ' ' + (x + 5.5) + ' ' + (50 + (i % 2) * 5) + ' V28 Z', c, ol(3.6));
    }
    return s + P('M72 34 Q100 18 128 34 Q100 28 72 34Z', c, ol(3.6)) + ln('M80 36 V48 M100 36 V48 M120 36 V48', '#ff8f80', 2.2);
  }

  var SHINY = function () {
    return '<g class="d-shiny">' + star4(24, 30, 9, '#fff3a8') + star4(178, 112, 7, '#fff3a8') + star4(36, 150, 6, '#fff3a8') + '</g>';
  };

  function svg(key, opts) {
    opts = opts || {};
    var fn = ARTS[key] || ARTS.mystery;
    var id = ++uid;
    var size = opts.size ? ' width="' + opts.size + '" height="' + opts.size + '"' : '';
    var title = opts.title ? '<title>' + opts.title + '</title>' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"' + size + ' class="art art-' + key + (opts.cls ? ' ' + opts.cls : '') + '" data-art="' + key + '" role="img">' + title +
      '<g class="d-body">' + fn('m' + id) + '</g>' + (opts.shiny ? SHINY() : '') + '</svg>';
  }

  var REACT = {
    qianli: 'gallop', zhanma: 'rear', saima: 'gallop', hanxue: 'neigh', laoma: 'nod', heima: 'jump', tuoma: 'wobble', banma: 'shake',
    carousel: 'carousel', yema: 'rear', pony: 'bounce', showpony: 'scream', hippo: 'squish', rocking: 'rock', seahorse: 'float', mule: 'kick',
    mystery: 'tilt', echo: 'nod', rebel: 'neigh', diode: 'flip',
    speed: 'long', sloth: 'sway', night: 'howl', early: 'jump', again: 'spin', twin: 'wag', shiny: 'pop', petter: 'jelly', work: 'twerk', carrot: 'smile'
  };

  var ICONS = {
    particle: '<svg viewBox="0 0 40 40" width="26" height="26"><path d="M9.5 6.5 C3 15 3 27 10.5 33.3 C15 37 25 37 29.5 33.3 C37 27 37 15 30.5 6.5 L24.6 8.4 C29.2 15 29 25 24.4 28.6 C21.8 30.6 18.2 30.6 15.6 28.6 C11 25 10.8 15 15.4 8.4 Z" fill="FILL" stroke="#2b211c" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<g fill="#2b211c"><circle cx="10" cy="12.6" r="1.35"/><circle cx="8.5" cy="19.6" r="1.35"/><circle cx="10.2" cy="26.6" r="1.35"/><circle cx="30" cy="12.6" r="1.35"/><circle cx="31.5" cy="19.6" r="1.35"/><circle cx="29.8" cy="26.6" r="1.35"/></g></svg>',
    goal: '<svg viewBox="0 0 40 40" width="34" height="34">' +
      '<path d="M20 12 Q14 4 9 5 Q12 11 18 14 Z M20 12 Q20 3 25 1 Q26 8 22 13 Z M21 13 Q27 6 33 8 Q29 14 22 15 Z" fill="#58b95c" stroke="#2b211c" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M12 16 Q20 10 28 16 Q27 28 20 38 Q13 28 12 16 Z" fill="#ff8a3d" stroke="#2b211c" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M15 21 L19 22 M21 26 L25 25 M17 30 L20 31" stroke="#d9631e" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>'
  };

  window.TI_ART = { svg: svg, keys: Object.keys(ARTS), react: REACT, icons: ICONS };
})();
