/* MATI 马格测试 核心数据（与语言无关）
 * 4 个类型维度取自职场研究最常用的大五人格维度：尽责性 C（卷度）、外向性 E（社交）、神经质 N（情绪）、宜人性 A（合群）
 * （Barrick & Mount, 1991；Judge, Heller & Mount, 2002；Judge et al., 1999）；4 维 × 高低 = 16 匹马。
 * 第 5 维开放性 O（野性）与工作绩效、工作满意度的关联最弱，只决定"野马款 / 家马款"，不决定是哪匹马。
 * 题目改写自公有领域 IPIP 大五题库；每个类型维度 6 题（正反向各 3），O 维 4 题（正反向各 2）。
 */
window.TI_CORE = {
  site: { id: 'mati', name: 'MATI', version: '1.0.0', hero: ['carousel', 'qianli', 'hippo'], runner: 'saima', loader: 'tuoma', combo: ['heima', 'banma'], combo2: ['pony', 'mule'] },
  typeDims: ['C', 'E', 'N', 'A'],
  modDim: 'O',
  eggTriggers: { speed: 'speed', sloth: 'sloth', night: 'night', early: 'early', again: 'again', twin: 'twin', shiny: 'shiny', work: 'work', goal: 'carrot' },
  petEgg: 'petter',
  consoleArt: '∩∩ 咴儿～ Neigh!',
  dims: [
    { key: 'C', color: '#ff8a3d' },
    { key: 'E', color: '#ff6fa5' },
    { key: 'N', color: '#8b7cff' },
    { key: 'A', color: '#1fb5a3' },
    { key: 'O', color: '#e3a400', human: true }
  ],
  // 题目顺序与 lang-*.js 里的 items 一一对应；k = 1 正向，-1 反向
  items: [
    { d: 'C', k: 1 }, { d: 'E', k: 1 }, { d: 'N', k: 1 }, { d: 'A', k: 1 },
    { d: 'C', k: -1 }, { d: 'E', k: -1 }, { d: 'O', k: 1 }, { d: 'N', k: -1 },
    { d: 'A', k: -1 }, { d: 'C', k: 1 }, { d: 'E', k: 1 }, { d: 'N', k: 1 },
    { d: 'A', k: 1 }, { d: 'O', k: -1 }, { d: 'C', k: -1 }, { d: 'E', k: -1 },
    { d: 'N', k: -1 }, { d: 'A', k: -1 }, { d: 'C', k: 1 }, { d: 'E', k: 1 },
    { d: 'O', k: 1 }, { d: 'N', k: 1 }, { d: 'A', k: 1 }, { d: 'C', k: -1 },
    { d: 'E', k: -1 }, { d: 'N', k: -1 }, { d: 'A', k: -1 }, { d: 'O', k: -1 }
  ],
  // 类型键 = C E N A 四维的高(H)/低(L)
  types: {
    HHLH: { art: 'qianli', bg: '#ffe9a8', ac: '#d9900f' },
    HHLL: { art: 'zhanma', bg: '#ffd9c7', ac: '#c8502a' },
    HHHH: { art: 'saima', bg: '#dcebff', ac: '#3f7fd6' },
    HHHL: { art: 'hanxue', bg: '#fff0b8', ac: '#c98a00' },
    HLLH: { art: 'laoma', bg: '#e4e8f2', ac: '#56698f' },
    HLLL: { art: 'heima', bg: '#dcf2ee', ac: '#1f8f86' },
    HLHH: { art: 'tuoma', bg: '#f6e7c1', ac: '#a8661f' },
    HLHL: { art: 'banma', bg: '#eceef3', ac: '#3f3d56' },
    LHLH: { art: 'carousel', bg: '#ffe3ef', ac: '#d94f8a' },
    LHLL: { art: 'yema', bg: '#ffe1c4', ac: '#d86c14' },
    LHHH: { art: 'pony', bg: '#ffe3e8', ac: '#e0567a' },
    LHHL: { art: 'showpony', bg: '#eadcf8', ac: '#8152cf' },
    LLLH: { art: 'hippo', bg: '#e4e3f7', ac: '#6a63b8' },
    LLLL: { art: 'rocking', bg: '#f3e2cc', ac: '#b0602a' },
    LLHH: { art: 'seahorse', bg: '#dcf0f3', ac: '#26879a' },
    LLHL: { art: 'mule', bg: '#ebe4dc', ac: '#7a6552' }
  },
  // 隐藏款：特殊作答方式触发，替换结果页主角（按顺序判定）
  hidden: {
    mystery: { art: 'mystery', bg: '#ece7ff', ac: '#6f59d9' },
    echo: { art: 'echo', bg: '#fff1b8', ac: '#c98a00' },
    rebel: { art: 'rebel', bg: '#ffd9d4', ac: '#c43c2f' },
  },
  hiddenOrder: ['mystery', 'echo', 'rebel'],
  // 彩蛋卡：收藏在图鉴里，不改变结果
  eggs: {
    speed: { art: 'speed', bg: '#fff3c4', ac: '#d99a00' },
    sloth: { art: 'sloth', bg: '#e3f0d9', ac: '#5e8f3a' },
    night: { art: 'night', bg: '#dcdcff', ac: '#3f46b8' },
    early: { art: 'early', bg: '#ffe6cc', ac: '#e07b25' },
    again: { art: 'again', bg: '#dff3f0', ac: '#1f9a88' },
    twin: { art: 'twin', bg: '#ffe0ea', ac: '#d6457f' },
    shiny: { art: 'shiny', bg: '#fff6c9', ac: '#c79a00' },
    petter: { art: 'petter', bg: '#ffe3ef', ac: '#d94f8a' },
    work: { art: 'work', bg: '#dbeeff', ac: '#2f7fc4' },
    carrot: { art: 'carrot', bg: '#ffe6cc', ac: '#e0701f' }
  },
  eggOrder: ['speed', 'sloth', 'night', 'early', 'again', 'twin', 'shiny', 'petter', 'work', 'carrot'],
  rules: {
    mysteryNeutral: 15,   // ≥15 题选"说不好"
    echoAgree: 23,        // ≥23 题选同意（4 或 5）
    rebelDisagree: 23,    // ≥23 题选不同意（1 或 2）
    speedMs: 50000, slothMs: 360000, petterTaps: 30, againRuns: 3
  },
  // 两匹马的关系：按"哪几个维度不同"（C E N A，1=不同）给基础默契值
  // 同样的工作态度 + 同样的合作方式最重要（0110 天选拍档）；卷躺不同又软硬不同最容易拌嘴（1001 欢喜冤家）
  rel: {
    '0000': 90, '1000': 84, '0100': 88, '0010': 91, '0001': 86,
    '1100': 80, '1010': 81, '1001': 77, '0110': 96, '0101': 79, '0011': 83,
    '1110': 74, '1101': 72, '1011': 73, '0111': 76, '1111': 70
  },
  circle: ['0110', '0000', '1001', '0010', '0100', '1111'],
  refs: [
    { cite: 'Barrick, M. R., & Mount, M. K. (1991). The Big Five personality dimensions and job performance: A meta-analysis. Personnel Psychology, 44(1), 1–26.', doi: '10.1111/j.1744-6570.1991.tb00688.x' },
    { cite: 'Judge, T. A., Heller, D., & Mount, M. K. (2002). Five-factor model of personality and job satisfaction: A meta-analysis. Journal of Applied Psychology, 87(3), 530–541.', doi: '10.1037/0021-9010.87.3.530' },
    { cite: 'Judge, T. A., Higgins, C. A., Thoresen, C. J., & Barrick, M. R. (1999). The Big Five personality traits, general mental ability, and career success across the life span. Personnel Psychology, 52(3), 621–652.', doi: '10.1111/j.1744-6570.1999.tb00174.x' },
    { cite: 'Lloyd, A. S., Martin, J. E., Bornett-Gauci, H. L. I., & Wilkinson, R. G. (2008). Horse personality: Variation between breeds. Applied Animal Behaviour Science, 112(3–4), 369–383.', doi: '10.1016/j.applanim.2007.08.010' },
    { cite: 'Goldberg, L. R., Johnson, J. A., Eber, H. W., Hogan, R., Ashton, M. C., Cloninger, C. R., & Gough, H. G. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.', doi: '10.1016/j.jrp.2005.08.007' },
    { cite: 'Donnellan, M. B., Oswald, F. L., Baird, B. M., & Lucas, R. E. (2006). The Mini-IPIP scales: Tiny-yet-effective measures of the Big Five factors of personality. Psychological Assessment, 18(2), 192–203.', doi: '10.1037/1040-3590.18.2.192' },
    { cite: 'Likert, R. (1932). A technique for the measurement of attitudes. Archives of Psychology, 22(140), 1–55.', doi: '' },
    { cite: 'Simms, L. J., Zelazny, K., Williams, T. F., & Bernstein, L. (2019). Does the number of response options matter? Psychometric perspectives using personality questionnaire data. Psychological Assessment, 31(4), 557–566.', doi: '10.1037/pas0000648' },
    { cite: 'Haslam, N., Holland, E., & Kuppens, P. (2012). Categories versus dimensions in personality and psychopathology: A quantitative review of taxometric research. Psychological Medicine, 42(5), 903–920.', doi: '10.1017/S0033291711001966' },
    { cite: 'Forer, B. R. (1949). The fallacy of personal validation: A classroom demonstration of gullibility. Journal of Abnormal and Social Psychology, 44(1), 118–123.', doi: '10.1037/h0059240' },
    { cite: 'Baumgartner, H., & Steenkamp, J.-B. E. M. (2001). Response styles in marketing research: A cross-national investigation. Journal of Marketing Research, 38(2), 143–156.', doi: '10.1509/jmkr.38.2.143.18840' },
    { cite: 'Van Vaerenbergh, Y., & Thomas, T. D. (2013). Response styles in survey research: A literature review of antecedents, consequences, and remedies. International Journal of Public Opinion Research, 25(2), 195–217.', doi: '10.1093/ijpor/eds021' },
    { cite: 'Butcher, J. N., Graham, J. R., Ben-Porath, Y. S., Tellegen, A., Dahlstrom, W. G., & Kaemmer, B. (2001). MMPI-2: Manual for administration, scoring, and interpretation (Rev. ed.). University of Minnesota Press.' }
  ]
};
