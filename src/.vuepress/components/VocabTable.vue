<template>
  <div class="vocab-shell">
    <!-- 工具栏 -->
    <section class="vocab-toolbar">
      <div class="vocab-search">
        <input
          v-model="searchQuery"
          type="text"
          class="vocab-input"
          placeholder="搜索单词 / 读音 / 中文..."
        />
      </div>
      <div class="vocab-filters">
        <button
          class="vocab-chip"
          :class="{ 'is-active': activePos === 'all' }"
          @click="activePos = 'all'"
        >全部</button>
        <button
          v-for="pos in posList"
          :key="pos"
          class="vocab-chip"
          :class="{ 'is-active': activePos === pos }"
          @click="activePos = pos"
        >{{ pos }}</button>
      </div>
      <div class="vocab-settings">
        <button class="vocab-chip" :class="{ 'is-active': !hideChinese }" @click="hideChinese = false">显示中文</button>
        <button class="vocab-chip" :class="{ 'is-active': hideChinese }" @click="hideChinese = true">隐藏中文</button>
        <button class="vocab-chip" @click="speakAll" v-if="!speakingAll">朗读本页</button>
        <button class="vocab-chip is-active" @click="stopSpeakAll" v-else>停止朗读</button>
      </div>
    </section>

    <!-- 统计栏 -->
    <div class="vocab-stats">
      <span class="vocab-stat">共 <b>{{ filteredList.length }}</b> 词</span>
      <span class="vocab-stat" v-if="searchQuery">搜索："{{ searchQuery }}"</span>
      <span class="vocab-stat" v-if="activePos !== 'all'">词性：{{ activePos }}</span>
    </div>

    <!-- 速记表格 -->
    <div class="vocab-table-wrap">
      <table class="vocab-table">
        <thead>
          <tr>
            <th class="col-idx">#</th>
            <th class="col-kana">假名</th>
            <th class="col-romaji">罗马音</th>
            <th class="col-kanji">汉字</th>
            <th class="col-accent">声调</th>
            <th class="col-pos">词性</th>
            <th class="col-cn">中文</th>
            <th class="col-play">朗读</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in pagedList"
            :key="item.id"
            class="vocab-row"
            :class="{ 'is-playing': playingId === item.id }"
          >
            <td class="col-idx">{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td class="col-kana">
              <span class="vocab-kana">{{ item.kana }}</span>
            </td>
            <td class="col-romaji">{{ item.romaji }}</td>
            <td class="col-kanji">{{ item.kanji || '—' }}</td>
            <td class="col-accent">{{ item.accent || '—' }}</td>
            <td class="col-pos">
              <span class="vocab-pos-tag">{{ item.pos }}</span>
            </td>
            <td class="col-cn">
              <span v-if="!hideChinese" class="vocab-cn">{{ item.cn }}</span>
              <span v-else class="vocab-cn-hidden" @click="reveal(item.id)" :class="{ 'is-revealed': revealed.has(item.id) }">
                {{ revealed.has(item.id) ? item.cn : '点击显示' }}
              </span>
            </td>
            <td class="col-play">
              <button class="vocab-play-btn" @click="speak(item)" :class="{ 'is-playing': playingId === item.id }">
                <span class="play-icon"></span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredList.length === 0" class="vocab-empty">
      <p>没有匹配的单词</p>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="vocab-pagination">
      <button class="vocab-page-btn" :disabled="page === 1" @click="page = 1">«</button>
      <button class="vocab-page-btn" :disabled="page === 1" @click="page--">‹</button>
      <span class="vocab-page-info">第 {{ page }} / {{ totalPages }} 页</span>
      <button class="vocab-page-btn" :disabled="page === totalPages" @click="page++">›</button>
      <button class="vocab-page-btn" :disabled="page === totalPages" @click="page = totalPages">»</button>
    </div>

    <audio ref="player" preload="none"></audio>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";

// ── 单词数据（新标日初级 第1-5课精选）──
const vocabData = [
  // 第1课
  { id: 1, kana: "ちゅうごくじん", romaji: "chūgokujin", kanji: "中国人", accent: "④", pos: "名", cn: "中国人", lesson: 1 },
  { id: 2, kana: "にほんじん", romaji: "nihonjin", kanji: "日本人", accent: "④", pos: "名", cn: "日本人", lesson: 1 },
  { id: 3, kana: "かんこくじん", romaji: "kankokujin", kanji: "韓国人", accent: "④", pos: "名", cn: "韩国人", lesson: 1 },
  { id: 4, kana: "がくせい", romaji: "gakusei", kanji: "学生", accent: "⓪", pos: "名", cn: "(大)学生", lesson: 1 },
  { id: 5, kana: "せんせい", romaji: "sensei", kanji: "先生", accent: "③", pos: "名", cn: "老师", lesson: 1 },
  { id: 6, kana: "りゅうがくせい", romaji: "ryūgakusei", kanji: "留学生", accent: "④", pos: "名", cn: "留学生", lesson: 1 },
  { id: 7, kana: "きょうじゅ", romaji: "kyōju", kanji: "教授", accent: "⓪", pos: "名", cn: "教授", lesson: 1 },
  { id: 8, kana: "しゃいん", romaji: "shain", kanji: "社員", accent: "①", pos: "名", cn: "职员", lesson: 1 },
  { id: 9, kana: "かいしゃいん", romaji: "kaishain", kanji: "会社員", accent: "③", pos: "名", cn: "公司职员", lesson: 1 },
  { id: 10, kana: "てんいん", romaji: "ten'in", kanji: "店員", accent: "⓪", pos: "名", cn: "店员", lesson: 1 },
  { id: 11, kana: "けんしゅうせい", romaji: "kenshūsei", kanji: "研修生", accent: "⓪", pos: "名", cn: "进修生", lesson: 1 },
  { id: 12, kana: "きぎょう", romaji: "kigyō", kanji: "企業", accent: "①", pos: "名", cn: "企业", lesson: 1 },
  { id: 13, kana: "だいがく", romaji: "daigaku", kanji: "大学", accent: "⓪", pos: "名", cn: "大学", lesson: 1 },
  { id: 14, kana: "ちち", romaji: "chichi", kanji: "父", accent: "②", pos: "名", cn: "(我)父亲", lesson: 1 },
  { id: 15, kana: "かちょう", romaji: "kachō", kanji: "課長", accent: "⓪", pos: "名", cn: "科长", lesson: 1 },
  { id: 16, kana: "しゃちょう", romaji: "shachō", kanji: "社長", accent: "⓪", pos: "名", cn: "总经理，社长", lesson: 1 },
  { id: 17, kana: "でむかえ", romaji: "demukae", kanji: "出迎え", accent: "⓪", pos: "名", cn: "迎接", lesson: 1 },
  { id: 18, kana: "あのひと", romaji: "anohito", kanji: "あの人", accent: "②", pos: "名", cn: "那个人", lesson: 1 },
  { id: 19, kana: "わたし", romaji: "watashi", kanji: "", accent: "⓪", pos: "代", cn: "我", lesson: 1 },
  { id: 20, kana: "あなた", romaji: "anata", kanji: "", accent: "②", pos: "代", cn: "你", lesson: 1 },
  { id: 21, kana: "どうも", romaji: "dōmo", kanji: "", accent: "①", pos: "副", cn: "非常，很", lesson: 1 },
  { id: 22, kana: "はい", romaji: "hai", kanji: "", accent: "①", pos: "叹", cn: "哎，是(应答)；是的", lesson: 1 },
  { id: 23, kana: "いいえ", romaji: "iie", kanji: "", accent: "③", pos: "叹", cn: "不，不是", lesson: 1 },
  { id: 24, kana: "こんにちは", romaji: "konnichiwa", kanji: "", accent: "⓪", pos: "短语", cn: "你好", lesson: 1 },
  { id: 25, kana: "すみません", romaji: "sumimasen", kanji: "", accent: "④", pos: "短语", cn: "对不起，请问", lesson: 1 },
  { id: 26, kana: "どうぞ", romaji: "dōzo", kanji: "", accent: "①", pos: "短语", cn: "请", lesson: 1 },
  { id: 27, kana: "よろしくおねがいします", romaji: "yoroshiku onegaishimasu", kanji: "～お願いします", accent: "⓪", pos: "短语", cn: "请多关照", lesson: 1 },
  { id: 28, kana: "はじめまして", romaji: "hajimemashite", kanji: "", accent: "④", pos: "短语", cn: "初次见面", lesson: 1 },
  { id: 29, kana: "こちらこそ", romaji: "kochira koso", kanji: "", accent: "④", pos: "短语", cn: "我才要(请您～)", lesson: 1 },
  { id: 30, kana: "そうです", romaji: "sō desu", kanji: "", accent: "①", pos: "短语", cn: "是(这样)", lesson: 1 },
  { id: 31, kana: "ちがいます", romaji: "chigaimasu", kanji: "違います", accent: "④", pos: "短语", cn: "不是", lesson: 1 },
  { id: 32, kana: "わかりません", romaji: "wakarimasen", kanji: "分かりません", accent: "⑤", pos: "短语", cn: "不知道", lesson: 1 },
  // 第2课
  { id: 33, kana: "ほん", romaji: "hon", kanji: "本", accent: "①", pos: "名", cn: "书", lesson: 2 },
  { id: 34, kana: "かばん", romaji: "kaban", kanji: "", accent: "⓪", pos: "名", cn: "包，公文包", lesson: 2 },
  { id: 35, kana: "ノート", romaji: "nōto", kanji: "", accent: "①", pos: "名", cn: "笔记本，本子", lesson: 2 },
  { id: 36, kana: "えんぴつ", romaji: "enpitsu", kanji: "鉛筆", accent: "⓪", pos: "名", cn: "铅笔", lesson: 2 },
  { id: 37, kana: "かさ", romaji: "kasa", kanji: "傘", accent: "①", pos: "名", cn: "伞", lesson: 2 },
  { id: 38, kana: "くつ", romaji: "kutsu", kanji: "靴", accent: "②", pos: "名", cn: "鞋", lesson: 2 },
  { id: 39, kana: "しんぶん", romaji: "shinbun", kanji: "新聞", accent: "⓪", pos: "名", cn: "报纸", lesson: 2 },
  { id: 40, kana: "雑誌", romaji: "zasshi", kanji: "雑誌", accent: "⓪", pos: "名", cn: "杂志", lesson: 2 },
  { id: 41, kana: "じしょ", romaji: "jisho", kanji: "辞書", accent: "①", pos: "名", cn: "词典", lesson: 2 },
  { id: 42, kana: "カメラ", romaji: "kamera", kanji: "", accent: "①", pos: "名", cn: "照相机", lesson: 2 },
  { id: 43, kana: "テレビ", romaji: "terebi", kanji: "", accent: "①", pos: "名", cn: "电视机", lesson: 2 },
  { id: 44, kana: "パソコン", romaji: "pasokon", kanji: "", accent: "⓪", pos: "名", cn: "个人电脑", lesson: 2 },
  { id: 45, kana: "ラジオ", romaji: "rajio", kanji: "", accent: "①", pos: "名", cn: "收音机", lesson: 2 },
  { id: 46, kana: "でんわ", romaji: "denwa", kanji: "電話", accent: "⓪", pos: "名", cn: "电话", lesson: 2 },
  { id: 47, kana: "つくえ", romaji: "tsukue", kanji: "机", accent: "⓪", pos: "名", cn: "桌子，书桌", lesson: 2 },
  { id: 48, kana: "いす", romaji: "isu", kanji: "椅子", accent: "⓪", pos: "名", cn: "椅子", lesson: 2 },
  { id: 49, kana: "かぎ", romaji: "kagi", kanji: "鍵", accent: "②", pos: "名", cn: "钥匙", lesson: 2 },
  { id: 50, kana: "とけい", romaji: "tokei", kanji: "時計", accent: "⓪", pos: "名", cn: "钟，表", lesson: 2 },
  { id: 51, kana: "てちょう", romaji: "techō", kanji: "手帳", accent: "⓪", pos: "名", cn: "记事本", lesson: 2 },
  { id: 52, kana: "しゃしん", romaji: "shashin", kanji: "写真", accent: "⓪", pos: "名", cn: "照片", lesson: 2 },
  { id: 53, kana: "くるま", romaji: "kuruma", kanji: "車", accent: "⓪", pos: "名", cn: "车", lesson: 2 },
  { id: 54, kana: "じてんしゃ", romaji: "jitensha", kanji: "自転車", accent: "②", pos: "名", cn: "自行车", lesson: 2 },
  { id: 55, kana: "みち", romaji: "michi", kanji: "道", accent: "⓪", pos: "名", cn: "路，道路", lesson: 2 },
  { id: 56, kana: "こうえん", romaji: "kōen", kanji: "公園", accent: "⓪", pos: "名", cn: "公园", lesson: 2 },
  { id: 57, kana: "ほんや", romaji: "hon'ya", kanji: "本屋", accent: "①", pos: "名", cn: "书店", lesson: 2 },
  { id: 58, kana: "レストラン", romaji: "resutoran", kanji: "", accent: "①", pos: "名", cn: "餐馆，西餐厅", lesson: 2 },
  { id: 59, kana: "がっこう", romaji: "gakkō", kanji: "学校", accent: "⓪", pos: "名", cn: "学校", lesson: 2 },
  { id: 60, kana: "スーパー", romaji: "sūpā", kanji: "", accent: "①", pos: "名", cn: "超市", lesson: 2 },
  // 第3课
  { id: 61, kana: "デパート", romaji: "depāto", kanji: "", accent: "②", pos: "名", cn: "百货商店", lesson: 3 },
  { id: 62, kana: "えき", romaji: "eki", kanji: "駅", accent: "①", pos: "名", cn: "车站", lesson: 3 },
  { id: 63, kana: "ちかてつ", romaji: "chikatetsu", kanji: "地下鉄", accent: "⓪", pos: "名", cn: "地铁", lesson: 3 },
  { id: 64, kana: "きっぷうりば", romaji: "kippūriba", kanji: "切符売り場", accent: "⑤", pos: "名", cn: "售票处", lesson: 3 },
  { id: 65, kana: "いりぐち", romaji: "iriguchi", kanji: "入り口", accent: "⓪", pos: "名", cn: "入口", lesson: 3 },
  { id: 66, kana: "でぐち", romaji: "deguchi", kanji: "出口", accent: "①", pos: "名", cn: "出口", lesson: 3 },
  { id: 67, kana: "ばいてん", romaji: "baiten", kanji: "売店", accent: "⓪", pos: "名", cn: "小卖部", lesson: 3 },
  { id: 68, kana: "しんばし", romaji: "shimbashi", kanji: "新橋", accent: "⓪", pos: "专", cn: "新桥", lesson: 3 },
  { id: 69, kana: "しながわ", romaji: "shinagawa", kanji: "品川", accent: "⓪", pos: "专", cn: "品川", lesson: 3 },
  { id: 70, kana: "ギンざ", romaji: "ginza", kanji: "銀座", accent: "⓪", pos: "专", cn: "银座", lesson: 3 },
  { id: 71, kana: "うえの", romaji: "ueno", kanji: "上野", accent: "⓪", pos: "专", cn: "上野", lesson: 3 },
  { id: 72, kana: "あきはばら", romaji: "akihabara", kanji: "秋葉原", accent: "③", pos: "专", cn: "秋叶原", lesson: 3 },
  { id: 73, kana: "しぶや", romaji: "shibuya", kanji: "渋谷", accent: "①", pos: "专", cn: "涩谷", lesson: 3 },
  { id: 74, kana: "しんじゅく", romaji: "shinjuku", kanji: "新宿", accent: "⓪", pos: "专", cn: "新宿", lesson: 3 },
  { id: 75, kana: "ここ", romaji: "koko", kanji: "", accent: "⓪", pos: "代", cn: "这里，这儿", lesson: 3 },
  { id: 76, kana: "そこ", romaji: "soko", kanji: "", accent: "⓪", pos: "代", cn: "那里，那儿", lesson: 3 },
  { id: 77, kana: "あそこ", romaji: "asoko", kanji: "", accent: "⓪", pos: "代", cn: "那里，那儿(远)", lesson: 3 },
  { id: 78, kana: "こちら", romaji: "kochira", kanji: "", accent: "⓪", pos: "代", cn: "这儿，这位", lesson: 3 },
  { id: 79, kana: "そちら", romaji: "sochira", kanji: "", accent: "⓪", pos: "代", cn: "那儿，那位", lesson: 3 },
  { id: 80, kana: "あちら", romaji: "achira", kanji: "", accent: "⓪", pos: "代", cn: "那儿，那位(远)", lesson: 3 },
  { id: 81, kana: "どこ", romaji: "doko", kanji: "", accent: "①", pos: "代", cn: "哪里，哪儿", lesson: 3 },
  { id: 82, kana: "どちら", romaji: "dochira", kanji: "", accent: "①", pos: "代", cn: "哪里，哪位", lesson: 3 },
  // 第4课
  { id: 83, kana: "いま", romaji: "ima", kanji: "今", accent: "①", pos: "名", cn: "现在", lesson: 4 },
  { id: 84, kana: "せんしゅう", romaji: "senshū", kanji: "先週", accent: "⓪", pos: "名", cn: "上个星期", lesson: 4 },
  { id: 85, kana: "らいしゅう", romaji: "raishū", kanji: "来週", accent: "⓪", pos: "名", cn: "下个星期", lesson: 4 },
  { id: 86, kana: "こんしゅう", romaji: "konshū", kanji: "今週", accent: "⓪", pos: "名", cn: "这个星期", lesson: 4 },
  { id: 87, kana: "さらいしゅう", romaji: "saraishū", kanji: "再来週", accent: "⓪", pos: "名", cn: "下下个星期", lesson: 4 },
  { id: 88, kana: "きのう", romaji: "kinō", kanji: "昨日", accent: "②", pos: "名", cn: "昨天", lesson: 4 },
  { id: 89, kana: "あした", romaji: "ashita", kanji: "明日", accent: "③", pos: "名", cn: "明天", lesson: 4 },
  { id: 90, kana: "あさって", romaji: "asatte", kanji: "明後日", accent: "②", pos: "名", cn: "后天", lesson: 4 },
  { id: 91, kana: "おととい", romaji: "ototoi", kanji: "一昨日", accent: "③", pos: "名", cn: "前天", lesson: 4 },
  { id: 92, kana: "けさ", romaji: "kesa", kanji: "今朝", accent: "①", pos: "名", cn: "今天早上", lesson: 4 },
  { id: 93, kana: "こんばん", romaji: "konban", kanji: "今晚", accent: "①", pos: "名", cn: "今天晚上", lesson: 4 },
  { id: 94, kana: "よる", romaji: "yoru", kanji: "夜", accent: "①", pos: "名", cn: "晚上，夜里", lesson: 4 },
  { id: 95, kana: "あさ", romaji: "asa", kanji: "朝", accent: "①", pos: "名", cn: "早上，早晨", lesson: 4 },
  { id: 96, kana: "ごご", romaji: "gogo", kanji: "午後", accent: "①", pos: "名", cn: "下午", lesson: 4 },
  { id: 97, kana: "にちようび", romaji: "nichiyōbi", kanji: "日曜日", accent: "③", pos: "名", cn: "星期日", lesson: 4 },
  { id: 98, kana: "げつようび", romaji: "getsuyōbi", kanji: "月曜日", accent: "③", pos: "名", cn: "星期一", lesson: 4 },
  { id: 99, kana: "かようび", romaji: "kayōbi", kanji: "火曜日", accent: "③", pos: "名", cn: "星期二", lesson: 4 },
  { id: 100, kana: "すいようび", romaji: "suiyōbi", kanji: "水曜日", accent: "③", pos: "名", cn: "星期三", lesson: 4 },
  { id: 101, kana: "もくようび", romaji: "mokuyōbi", kanji: "木曜日", accent: "③", pos: "名", cn: "星期四", lesson: 4 },
  { id: 102, kana: "きんようび", romaji: "kinyōbi", kanji: "金曜日", accent: "③", pos: "名", cn: "星期五", lesson: 4 },
  { id: 103, kana: "どようび", romaji: "doyōbi", kanji: "土曜日", accent: "⓪", pos: "名", cn: "星期六", lesson: 4 },
  // 第5课
  { id: 104, kana: "いま", romaji: "ima", kanji: "今", accent: "①", pos: "名", cn: "现在", lesson: 5 },
  { id: 105, kana: "じ", romaji: "ji", kanji: "時", accent: "①", pos: "名", cn: "点(钟)", lesson: 5 },
  { id: 106, kana: "はん", romaji: "han", kanji: "半", accent: "⓪", pos: "名", cn: "半", lesson: 5 },
  { id: 107, kana: "ふん", romaji: "fun", kanji: "分", accent: "①", pos: "名", cn: "分(钟)", lesson: 5 },
  { id: 108, kana: "ごぜん", romaji: "gozen", kanji: "午前", accent: "①", pos: "名", cn: "上午", lesson: 5 },
  { id: 109, kana: "ごご", romaji: "gogo", kanji: "午後", accent: "①", pos: "名", cn: "下午", lesson: 5 },
  { id: 110, kana: "あさ", romaji: "asa", kanji: "朝", accent: "①", pos: "名", cn: "早上", lesson: 5 },
  { id: 111, kana: "ひる", romaji: "hiru", kanji: "昼", accent: "②", pos: "名", cn: "白天，中午", lesson: 5 },
  { id: 112, kana: "よる", romaji: "yoru", kanji: "夜", accent: "①", pos: "名", cn: "晚上", lesson: 5 },
  { id: 113, kana: "おととい", romaji: "ototoi", kanji: "一昨日", accent: "③", pos: "名", cn: "前天", lesson: 5 },
  { id: 114, kana: "きのう", romaji: "kinō", kanji: "昨日", accent: "②", pos: "名", cn: "昨天", lesson: 5 },
  { id: 115, kana: "きょう", romaji: "kyō", kanji: "今日", accent: "①", pos: "名", cn: "今天", lesson: 5 },
  { id: 116, kana: "あした", romaji: "ashita", kanji: "明日", accent: "③", pos: "名", cn: "明天", lesson: 5 },
  { id: 117, kana: "あさって", romaji: "asatte", kanji: "明後日", accent: "②", pos: "名", cn: "后天", lesson: 5 },
  { id: 118, kana: "せんしゅう", romaji: "senshū", kanji: "先週", accent: "⓪", pos: "名", cn: "上周", lesson: 5 },
  { id: 119, kana: "こんしゅう", romaji: "konshū", kanji: "今週", accent: "⓪", pos: "名", cn: "本周", lesson: 5 },
  { id: 120, kana: "らいしゅう", romaji: "raishū", kanji: "来週", accent: "⓪", pos: "名", cn: "下周", lesson: 5 },
];

// ── 状态 ──
const player = ref(null);
const searchQuery = ref("");
const activePos = ref("all");
const hideChinese = ref(false);
const revealed = ref(new Set());
const playingId = ref(null);
const speakingAll = ref(false);
const page = ref(1);
const pageSize = 30;

const posList = computed(() => {
  const set = new Set(vocabData.map((v) => v.pos));
  return Array.from(set);
});

const filteredList = computed(() => {
  let list = vocabData;
  if (activePos.value !== "all") {
    list = list.filter((v) => v.pos === activePos.value);
  }
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter((v) =>
      v.kana.toLowerCase().includes(q) ||
      v.romaji.toLowerCase().includes(q) ||
      v.cn.toLowerCase().includes(q) ||
      (v.kanji && v.kanji.includes(q))
    );
  }
  return list;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / pageSize)));

const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredList.value.slice(start, start + pageSize);
});

function reveal(id) {
  const s = new Set(revealed.value);
  s.add(id);
  revealed.value = s;
}

function getAudioUrl(item) {
  return "https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=" + encodeURIComponent(item.kana);
}

async function speak(item) {
  const el = player.value;
  if (!el) return;
  if (playingId.value === item.id) {
    el.pause();
    playingId.value = null;
    return;
  }
  el.pause();
  playingId.value = item.id;
  el.src = getAudioUrl(item);
  el.load();
  try {
    await el.play();
  } catch (e) {
    playingId.value = null;
  }
}

async function speakAll() {
  speakingAll.value = true;
  const list = pagedList.value;
  for (const item of list) {
    if (!speakingAll.value) break;
    await new Promise((resolve) => {
      const el = player.value;
      if (!el) { resolve(); return; }
      playingId.value = item.id;
      el.src = getAudioUrl(item);
      el.load();
      el.onended = () => { resolve(); };
      el.onerror = () => { resolve(); };
      el.play().catch(() => resolve());
      setTimeout(resolve, 3000);
    });
  }
  speakingAll.value = false;
  playingId.value = null;
}

function stopSpeakAll() {
  speakingAll.value = false;
  const el = player.value;
  if (el) { el.pause(); }
  playingId.value = null;
}

onBeforeUnmount(() => {
  stopSpeakAll();
});
</script>

<style scoped>
.vocab-shell {
  max-width: 1120px;
  margin: 1.5rem auto 3rem;
  padding: 0 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* ── 工具栏 ── */
.vocab-toolbar {
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.vocab-search { display: flex; }
.vocab-input {
  width: 100%;
  padding: 0.5rem 0.85rem;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #1f2329);
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}
.vocab-input:focus { border-color: var(--theme-color, #3eaf7c); }
.vocab-filters, .vocab-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
}
.vocab-chip {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0.15rem 0.75rem;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-2, #4e5969);
  border-radius: 999px;
  font-size: 0.82rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.vocab-chip:hover { border-color: var(--theme-color, #3eaf7c); color: var(--vp-c-text-1, #1f2329); }
.vocab-chip.is-active {
  background: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
  color: #fff;
  font-weight: 600;
}

/* ── 统计栏 ── */
.vocab-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-3, #8a919f);
  flex-wrap: wrap;
}
.vocab-stat b { color: var(--theme-color, #3eaf7c); font-weight: 700; }

/* ── 表格 ── */
.vocab-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 12px;
  background: var(--vp-c-bg, #fff);
}
.vocab-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}
.vocab-table thead {
  background: var(--vp-c-bg-soft, #f6f6f7);
}
.vocab-table th {
  padding: 0.65rem 0.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--vp-c-text-3, #8a919f);
  border-bottom: 1px solid var(--vp-c-border, #e3e5e8);
  white-space: nowrap;
}
.vocab-table td {
  padding: 0.55rem 0.5rem;
  border-bottom: 1px solid var(--vp-c-border, #e3e5e8);
  color: var(--vp-c-text-1, #1f2329);
  vertical-align: middle;
}
.vocab-row:hover { background: var(--vp-c-bg-soft, #f6f6f7); }
.vocab-row.is-playing { background: rgba(62, 175, 124, 0.08); }
.vocab-row:last-child td { border-bottom: none; }

.col-idx { width: 3rem; text-align: center; color: var(--vp-c-text-3, #8a919f); font-size: 0.82rem; }
.col-kana { min-width: 7rem; }
.col-romaji { min-width: 6rem; color: var(--vp-c-text-3, #8a919f); font-size: 0.82rem; font-family: "SF Mono", Menlo, monospace; }
.col-kanji { min-width: 4rem; text-align: center; }
.col-accent { width: 3rem; text-align: center; color: var(--vp-c-text-3, #8a919f); }
.col-pos { width: 4rem; text-align: center; }
.col-cn { min-width: 8rem; }
.col-play { width: 3.5rem; text-align: center; }

.vocab-kana {
  font-size: 1rem;
  font-weight: 600;
  font-family: "Hiragino Sans", "Yu Gothic", "Meiryo", "Noto Sans JP", sans-serif;
  color: var(--vp-c-text-1, #1f2329);
}
.vocab-row.is-playing .vocab-kana { color: var(--theme-color, #3eaf7c); }

.vocab-pos-tag {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  background: var(--vp-c-bg-soft, #f6f6f7);
  color: var(--vp-c-text-3, #8a919f);
  border-radius: 999px;
}

.vocab-cn { color: var(--vp-c-text-2, #4e5969); }
.vocab-cn-hidden {
  color: var(--vp-c-text-3, #8a919f);
  cursor: pointer;
  font-style: italic;
  user-select: none;
}
.vocab-cn-hidden.is-revealed { color: var(--theme-color, #3eaf7c); font-style: normal; font-weight: 500; }

.vocab-play-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-3, #8a919f);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s;
}
.vocab-play-btn:hover { border-color: var(--theme-color, #3eaf7c); color: var(--theme-color, #3eaf7c); }
.vocab-play-btn.is-playing {
  background: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
  color: #fff;
}
.play-icon {
  width: 0; height: 0;
  border-block: 5px solid transparent;
  border-left: 7px solid currentColor;
  margin-left: 2px;
}

/* ── 空状态 ── */
.vocab-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-3, #8a919f);
}

/* ── 分页 ── */
.vocab-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
}
.vocab-page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 0.6rem;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-2, #4e5969);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.15s;
}
.vocab-page-btn:hover:not(:disabled) { border-color: var(--theme-color, #3eaf7c); color: var(--theme-color, #3eaf7c); }
.vocab-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.vocab-page-info {
  font-size: 0.85rem;
  color: var(--vp-c-text-3, #8a919f);
  padding: 0 0.5rem;
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .vocab-shell { padding: 0 0.5rem; }
  .vocab-toolbar { padding: 0.85rem 1rem; }
  .vocab-table { font-size: 0.82rem; }
  .vocab-table th, .vocab-table td { padding: 0.45rem 0.35rem; }
  .col-romaji, .col-accent { display: none; }
}
</style>
