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
  // 第6课 吉田さんは 来月 中国へ 行きます
  { id: 121, kana: "きっぷ", romaji: "kippu", kanji: "切符", accent: "⓪", pos: "名", cn: "票（车票、门票等）", lesson: 6 },
  { id: 122, kana: "まいげつ", romaji: "maigetsu", kanji: "毎月", accent: "⓪", pos: "名", cn: "每月", lesson: 6 },
  { id: 123, kana: "まいつき", romaji: "maitsuki", kanji: "毎月", accent: "⓪", pos: "名", cn: "每月", lesson: 6 },
  { id: 124, kana: "らいげつ", romaji: "raigetsu", kanji: "来月", accent: "⓪", pos: "名", cn: "下个月", lesson: 6 },
  { id: 125, kana: "せんげつ", romaji: "sengetsu", kanji: "先月", accent: "①", pos: "名", cn: "上个月", lesson: 6 },
  { id: 126, kana: "よねだ", romaji: "yoneda", kanji: "吉田", accent: "⓪", pos: "专", cn: "吉田", lesson: 6 },
  { id: 127, kana: "り", romaji: "ri", kanji: "李", accent: "①", pos: "专", cn: "李", lesson: 6 },
  { id: 128, kana: "ペキン", romaji: "pekin", kanji: "北京", accent: "①", pos: "专", cn: "北京", lesson: 6 },
  { id: 129, kana: "こうしゅう", romaji: "kōshū", kanji: "杭州", accent: "①", pos: "专", cn: "杭州", lesson: 6 },
  { id: 130, kana: "ちゅうごく", romaji: "chūgoku", kanji: "中国", accent: "①", pos: "专", cn: "中国", lesson: 6 },
  { id: 131, kana: "アメリカ", romaji: "amerika", kanji: "", accent: "⓪", pos: "专", cn: "美国", lesson: 6 },
  { id: 132, kana: "オーストラリア", romaji: "ōsutoraria", kanji: "", accent: "⑤", pos: "专", cn: "澳大利亚", lesson: 6 },
  { id: 133, kana: "フランス", romaji: "furansu", kanji: "", accent: "⓪", pos: "专", cn: "法国", lesson: 6 },
  { id: 134, kana: "イギリス", romaji: "igirisu", kanji: "", accent: "⓪", pos: "专", cn: "英国", lesson: 6 },
  { id: 135, kana: "シンガポール", romaji: "shingapōru", kanji: "", accent: "⑤", pos: "专", cn: "新加坡", lesson: 6 },
  { id: 136, kana: "かんこく", romaji: "kankoku", kanji: "韓国", accent: "①", pos: "专", cn: "韩国", lesson: 6 },
  { id: 137, kana: "しけん", romaji: "shiken", kanji: "試験", accent: "②", pos: "名", cn: "考试", lesson: 6 },
  { id: 138, kana: "てんき", romaji: "tenki", kanji: "天気", accent: "①", pos: "名", cn: "天气", lesson: 6 },
  { id: 139, kana: "あめ", romaji: "ame", kanji: "雨", accent: "①", pos: "名", cn: "雨，雨水", lesson: 6 },
  { id: 140, kana: "くもり", romaji: "kumori", kanji: "曇り", accent: "③", pos: "名", cn: "阴天", lesson: 6 },
  { id: 141, kana: "ゆき", romaji: "yuki", kanji: "雪", accent: "②", pos: "名", cn: "雪", lesson: 6 },
  { id: 142, kana: "のりまちがえる", romaji: "norimachigaeru", kanji: "乗り間違える", accent: "⑥", pos: "动2", cn: "坐错车", lesson: 6 },
  { id: 143, kana: "きく", romaji: "kiku", kanji: "聞く", accent: "⓪", pos: "动1", cn: "听", lesson: 6 },
  { id: 144, kana: "たべる", romaji: "taberu", kanji: "食べる", accent: "②", pos: "动2", cn: "吃", lesson: 6 },
  { id: 145, kana: "のむ", romaji: "nomu", kanji: "飲む", accent: "①", pos: "动1", cn: "喝", lesson: 6 },
  { id: 146, kana: "する", romaji: "suru", kanji: "", accent: "⓪", pos: "动3", cn: "做", lesson: 6 },
  { id: 147, kana: "みる", romaji: "miru", kanji: "見る", accent: "①", pos: "动2", cn: "看", lesson: 6 },
  { id: 148, kana: "ねる", romaji: "neru", kanji: "寝る", accent: "①", pos: "动2", cn: "睡觉", lesson: 6 },
  { id: 149, kana: "かう", romaji: "kau", kanji: "買う", accent: "⓪", pos: "动1", cn: "买", lesson: 6 },
  { id: 150, kana: "とる", romaji: "toru", kanji: "撮る", accent: "①", pos: "动1", cn: "拍照", lesson: 6 },
  { id: 151, kana: "かく", romaji: "kaku", kanji: "書く", accent: "①", pos: "动1", cn: "写", lesson: 6 },
  { id: 152, kana: "まんが", romaji: "manga", kanji: "漫画", accent: "⓪", pos: "名", cn: "漫画", lesson: 6 },
  { id: 153, kana: "えいが", romaji: "eiga", kanji: "映画", accent: "①", pos: "名", cn: "电影", lesson: 6 },
  { id: 154, kana: "てがみ", romaji: "tegami", kanji: "手紙", accent: "⓪", pos: "名", cn: "信", lesson: 6 },
  { id: 155, kana: "としょかん", romaji: "toshokan", kanji: "図書館", accent: "②", pos: "名", cn: "图书馆", lesson: 6 },
  { id: 156, kana: "ちゅうごくご", romaji: "chūgokugo", kanji: "中国語", accent: "⓪", pos: "名", cn: "汉语，中文", lesson: 6 },
  { id: 157, kana: "しゅくだい", romaji: "shukudai", kanji: "宿題", accent: "⓪", pos: "名", cn: "作业", lesson: 6 },
  { id: 158, kana: "クラス", romaji: "kurasu", kanji: "", accent: "①", pos: "名", cn: "班级", lesson: 6 },
  // 第7课 李さんは 毎日 コーヒーを 飲みます
  { id: 159, kana: "まいにち", romaji: "mainichi", kanji: "毎日", accent: "①", pos: "名", cn: "每天，每日", lesson: 7 },
  { id: 160, kana: "まいあさ", romaji: "maiasa", kanji: "毎朝", accent: "①", pos: "名", cn: "每天早上", lesson: 7 },
  { id: 161, kana: "まいばん", romaji: "maiban", kanji: "毎晩", accent: "①", pos: "名", cn: "每天晚上", lesson: 7 },
  { id: 162, kana: "まいしゅう", romaji: "maishū", kanji: "毎週", accent: "⓪", pos: "名", cn: "每周", lesson: 7 },
  { id: 163, kana: "ぜんぜん", romaji: "zen'zen", kanji: "全然", accent: "⓪", pos: "副", cn: "完全（不）", lesson: 7 },
  { id: 164, kana: "コーヒー", romaji: "kōhī", kanji: "", accent: "③", pos: "名", cn: "咖啡", lesson: 7 },
  { id: 165, kana: "こうちゃ", romaji: "kōcha", kanji: "紅茶", accent: "⓪", pos: "名", cn: "红茶", lesson: 7 },
  { id: 166, kana: "ぎゅうにゅう", romaji: "gyūnyū", kanji: "牛乳", accent: "⓪", pos: "名", cn: "牛奶", lesson: 7 },
  { id: 167, kana: "パン", romaji: "pan", kanji: "", accent: "①", pos: "名", cn: "面包", lesson: 7 },
  { id: 168, kana: "たまご", romaji: "tamago", kanji: "卵", accent: "②", pos: "名", cn: "鸡蛋", lesson: 7 },
  { id: 169, kana: "サラダ", romaji: "sarada", kanji: "", accent: "⓪", pos: "名", cn: "沙拉", lesson: 7 },
  { id: 170, kana: "おさら", romaji: "osara", kanji: "お皿", accent: "⓪", pos: "名", cn: "盘子", lesson: 7 },
  { id: 171, kana: "ナイフ", romaji: "naifu", kanji: "", accent: "①", pos: "名", cn: "刀", lesson: 7 },
  { id: 172, kana: "フォーク", romaji: "fōku", kanji: "", accent: "①", pos: "名", cn: "叉子", lesson: 7 },
  { id: 173, kana: "ニュース", romaji: "nyūsu", kanji: "", accent: "①", pos: "名", cn: "新闻", lesson: 7 },
  { id: 174, kana: "くすり", romaji: "kusuri", kanji: "薬", accent: "⓪", pos: "名", cn: "药", lesson: 7 },
  { id: 175, kana: "てんきよほう", romaji: "tenkiyohō", kanji: "天気予報", accent: "④", pos: "名", cn: "天气预报", lesson: 7 },
  { id: 176, kana: "テニス", romaji: "tenisu", kanji: "", accent: "①", pos: "名", cn: "网球", lesson: 7 },
  { id: 177, kana: "バスケットボール", romaji: "basukettobōru", kanji: "", accent: "⑥", pos: "名", cn: "篮球", lesson: 7 },
  { id: 178, kana: "サッカー", romaji: "sakkā", kanji: "", accent: "①", pos: "名", cn: "足球", lesson: 7 },
  { id: 179, kana: "ピンポン", romaji: "pinpon", kanji: "", accent: "①", pos: "名", cn: "乒乓球", lesson: 7 },
  { id: 180, kana: "うんどう", romaji: "undō", kanji: "運動", accent: "⓪", pos: "名", cn: "运动", lesson: 7 },
  { id: 181, kana: "ぎんこう", romaji: "ginkō", kanji: "銀行", accent: "⓪", pos: "名", cn: "银行", lesson: 7 },
  { id: 182, kana: "えいがかん", romaji: "eigakan", kanji: "映画館", accent: "③", pos: "名", cn: "电影院", lesson: 7 },
  { id: 183, kana: "ホテル", romaji: "hoteru", kanji: "", accent: "①", pos: "名", cn: "宾馆，饭店", lesson: 7 },
  { id: 184, kana: "コンビニ", romaji: "konbini", kanji: "", accent: "⓪", pos: "名", cn: "便利店", lesson: 7 },
  { id: 185, kana: "びょういん", romaji: "byōin", kanji: "病院", accent: "⓪", pos: "名", cn: "医院", lesson: 7 },
  { id: 186, kana: "ほんや", romaji: "hon'ya", kanji: "本屋", accent: "①", pos: "名", cn: "书店", lesson: 7 },
  { id: 187, kana: "やおや", romaji: "yaoya", kanji: "八百屋", accent: "⓪", pos: "名", cn: "蔬菜店", lesson: 7 },
  { id: 188, kana: "ケーキ", romaji: "kēki", kanji: "", accent: "①", pos: "名", cn: "蛋糕", lesson: 7 },
  { id: 189, kana: "くだもの", romaji: "kudamono", kanji: "果物", accent: "②", pos: "名", cn: "水果", lesson: 7 },
  { id: 190, kana: "はな", romaji: "hana", kanji: "花", accent: "②", pos: "名", cn: "花", lesson: 7 },
  { id: 191, kana: "おみやげ", romaji: "omiyage", kanji: "お土産", accent: "⓪", pos: "名", cn: "礼物", lesson: 7 },
  { id: 192, kana: "おかし", romaji: "okashi", kanji: "お菓子", accent: "②", pos: "名", cn: "点心", lesson: 7 },
  // 第8課 李さんは 日本語で 手紙を 書きます
  { id: 193, kana: "にほんご", romaji: "nihongo", kanji: "日本語", accent: "⓪", pos: "名", cn: "日语", lesson: 8 },
  { id: 194, kana: "えいご", romaji: "eigo", kanji: "英語", accent: "⓪", pos: "名", cn: "英语", lesson: 8 },
  { id: 195, kana: "かんこくご", romaji: "kankokugo", kanji: "韓国語", accent: "⓪", pos: "名", cn: "韩语", lesson: 8 },
  { id: 196, kana: "フランスご", romaji: "furansugo", kanji: "フランス語", accent: "⓪", pos: "名", cn: "法语", lesson: 8 },
  { id: 197, kana: "スペインご", romaji: "supeingo", kanji: "スペイン語", accent: "④", pos: "名", cn: "西班牙语", lesson: 8 },
  { id: 198, kana: "ロシアご", romaji: "roshiago", kanji: "ロシア語", accent: "⓪", pos: "名", cn: "俄语", lesson: 8 },
  { id: 199, kana: "じてんしゃ", romaji: "jitensha", kanji: "自転車", accent: "②", pos: "名", cn: "自行车", lesson: 8 },
  { id: 200, kana: "でんしゃ", romaji: "densha", kanji: "電車", accent: "⓪", pos: "名", cn: "电车", lesson: 8 },
  { id: 201, kana: "びん", romaji: "bin", kanji: "便", accent: "①", pos: "名", cn: "（邮件、航班的）班次", lesson: 8 },
  { id: 202, kana: "こうくうき", romaji: "kōkūki", kanji: "航空機", accent: "③", pos: "名", cn: "飞机", lesson: 8 },
  { id: 203, kana: "でんわ", romaji: "denwa", kanji: "電話", accent: "⓪", pos: "名", cn: "电话", lesson: 8 },
  { id: 204, kana: "ペン", romaji: "pen", kanji: "", accent: "①", pos: "名", cn: "钢笔", lesson: 8 },
  { id: 205, kana: "ボールペン", romaji: "bōrupen", kanji: "", accent: "④", pos: "名", cn: "圆珠笔", lesson: 8 },
  { id: 206, kana: "えんぴつ", romaji: "enpitsu", kanji: "鉛筆", accent: "⓪", pos: "名", cn: "铅笔", lesson: 8 },
  { id: 207, kana: "かぎ", romaji: "kagi", kanji: "鍵", accent: "②", pos: "名", cn: "钥匙", lesson: 8 },
  { id: 208, kana: "とけい", romaji: "tokei", kanji: "時計", accent: "⓪", pos: "名", cn: "钟表", lesson: 8 },
  { id: 209, kana: "くつ", romaji: "kutsu", kanji: "靴", accent: "②", pos: "名", cn: "鞋", lesson: 8 },
  { id: 210, kana: "うんどうぐ", romaji: "undōgu", kanji: "運動靴", accent: "③", pos: "名", cn: "运动鞋", lesson: 8 },
  { id: 211, kana: "にもつ", romaji: "nimotsu", kanji: "荷物", accent: "①", pos: "名", cn: "行李", lesson: 8 },
  { id: 212, kana: "タクシー", romaji: "takushī", kanji: "", accent: "①", pos: "名", cn: "出租车", lesson: 8 },
  { id: 213, kana: "トラック", romaji: "torakku", kanji: "", accent: "②", pos: "名", cn: "卡车", lesson: 8 },
  { id: 214, kana: "インターネット", romaji: "intānetto", kanji: "", accent: "⑤", pos: "名", cn: "互联网", lesson: 8 },
  { id: 215, kana: "しんぶん", romaji: "shinbun", kanji: "新聞", accent: "⓪", pos: "名", cn: "报纸", lesson: 8 },
  { id: 216, kana: "カメラ", romaji: "kamera", kanji: "", accent: "①", pos: "名", cn: "照相机", lesson: 8 },
  { id: 217, kana: "かんがえる", romaji: "kangaeru", kanji: "考える", accent: "④", pos: "动2", cn: "考虑", lesson: 8 },
  { id: 218, kana: "なおす", romaji: "naosu", kanji: "直す", accent: "②", pos: "动1", cn: "改正，修改", lesson: 8 },
  { id: 219, kana: "せつめいする", romaji: "setsumei suru", kanji: "説明する", accent: "⓪", pos: "动3", cn: "说明，解释", lesson: 8 },
  { id: 220, kana: "つかう", romaji: "tsukau", kanji: "使う", accent: "⓪", pos: "动1", cn: "使用", lesson: 8 },
  { id: 221, kana: "やめる", romaji: "yameru", kanji: "止める", accent: "⓪", pos: "动2", cn: "停止，放弃", lesson: 8 },
  { id: 222, kana: "おくる", romaji: "okuru", kanji: "送る", accent: "⓪", pos: "动1", cn: "发送，寄", lesson: 8 },
  { id: 223, kana: "かえす", romaji: "kaesu", kanji: "返す", accent: "①", pos: "动1", cn: "归还", lesson: 8 },
  { id: 224, kana: "かす", romaji: "kasu", kanji: "貸す", accent: "⓪", pos: "动1", cn: "借出", lesson: 8 },
  { id: 225, kana: "かりる", romaji: "kariru", kanji: "借りる", accent: "⓪", pos: "动2", cn: "借入", lesson: 8 },
  { id: 226, kana: "おしえる", romaji: "oshieru", kanji: "教える", accent: "⓪", pos: "动2", cn: "告诉，教", lesson: 8 },
  { id: 227, kana: "まなぶ", romaji: "manabu", kanji: "学ぶ", accent: "⓪", pos: "动1", cn: "学习", lesson: 8 },
  { id: 228, kana: "のる", romaji: "noru", kanji: "乗る", accent: "⓪", pos: "动1", cn: "乘坐", lesson: 8 },
  { id: 229, kana: "つくる", romaji: "tsukuru", kanji: "作る", accent: "②", pos: "动1", cn: "做，制造", lesson: 8 },
  { id: 230, kana: "はなす", romaji: "hanasu", kanji: "話す", accent: "②", pos: "动1", cn: "说，讲", lesson: 8 },
  // 第9課 四川料理は 辛いです
  { id: 231, kana: "しせんりょうり", romaji: "shisen ryōri", kanji: "四川料理", accent: "④", pos: "名", cn: "四川菜", lesson: 9 },
  { id: 232, kana: "すぶた", romaji: "subuta", kanji: "酢豚", accent: "⓪", pos: "名", cn: "糖醋里脊", lesson: 9 },
  { id: 233, kana: "とんかつ", romaji: "tonkatsu", kanji: "豚カツ", accent: "⓪", pos: "名", cn: "炸猪排", lesson: 9 },
  { id: 234, kana: "てばなす", romaji: "tebanasu", kanji: "手放す", accent: "②", pos: "动1", cn: "放手", lesson: 9 },
  { id: 235, kana: "すきやき", romaji: "sukiyaki", kanji: "すき焼き", accent: "⓪", pos: "名", cn: "日式牛肉火锅", lesson: 9 },
  { id: 236, kana: "おんせん", romaji: "onsen", kanji: "温泉", accent: "⓪", pos: "名", cn: "温泉", lesson: 9 },
  { id: 237, kana: "おちゃ", romaji: "ocha", kanji: "お茶", accent: "⓪", pos: "名", cn: "茶", lesson: 9 },
  { id: 238, kana: "からい", romaji: "karai", kanji: "辛い", accent: "②", pos: "形1", cn: "辣", lesson: 9 },
  { id: 239, kana: "あまい", romaji: "amai", kanji: "甘い", accent: "⓪", pos: "形1", cn: "甜", lesson: 9 },
  { id: 240, kana: "しょっぱい", romaji: "shoppai", kanji: "塩辛い", accent: "③", pos: "形1", cn: "咸", lesson: 9 },
  { id: 241, kana: "すっぱい", romaji: "suppai", kanji: "酸っぱい", accent: "③", pos: "形1", cn: "酸", lesson: 9 },
  { id: 242, kana: "にがい", romaji: "nigai", kanji: "苦い", accent: "②", pos: "形1", cn: "苦", lesson: 9 },
  { id: 243, kana: "おいしい", romaji: "oishii", kanji: "", accent: "⓪", pos: "形1", cn: "好吃，美味", lesson: 9 },
  { id: 244, kana: "まずい", romaji: "mazui", kanji: "不味い", accent: "②", pos: "形1", cn: "不好吃，难吃", lesson: 9 },
  { id: 245, kana: "たかい", romaji: "takai", kanji: "高い", accent: "②", pos: "形1", cn: "高，贵", lesson: 9 },
  { id: 246, kana: "やすい", romaji: "yasui", kanji: "安い", accent: "②", pos: "形1", cn: "便宜", lesson: 9 },
  { id: 247, kana: "ひくい", romaji: "hikui", kanji: "低い", accent: "②", pos: "形1", cn: "低", lesson: 9 },
  { id: 248, kana: "おもしろい", romaji: "omoshiroi", kanji: "面白い", accent: "④", pos: "形1", cn: "有趣，有意思", lesson: 9 },
  { id: 249, kana: "つまらない", romaji: "tsumaranai", kanji: "", accent: "④", pos: "形1", cn: "无聊", lesson: 9 },
  { id: 250, kana: "おおきい", romaji: "ōkii", kanji: "大きい", accent: "③", pos: "形1", cn: "大", lesson: 9 },
  { id: 251, kana: "ちいさい", romaji: "chiisai", kanji: "小さい", accent: "③", pos: "形1", cn: "小", lesson: 9 },
  { id: 252, kana: "あたらしい", romaji: "atarashii", kanji: "新しい", accent: "④", pos: "形1", cn: "新", lesson: 9 },
  { id: 253, kana: "ふるい", romaji: "furui", kanji: "古い", accent: "②", pos: "形1", cn: "旧，老", lesson: 9 },
  { id: 254, kana: "いい", romaji: "ii", kanji: "良い", accent: "①", pos: "形1", cn: "好", lesson: 9 },
  { id: 255, kana: "わるい", romaji: "warui", kanji: "悪い", accent: "②", pos: "形1", cn: "坏，不好", lesson: 9 },
  { id: 256, kana: "すばらしい", romaji: "subarashii", kanji: "素晴らしい", accent: "④", pos: "形1", cn: "极佳，绝佳", lesson: 9 },
  { id: 257, kana: "とおい", romaji: "tōi", kanji: "遠い", accent: "⓪", pos: "形1", cn: "远", lesson: 9 },
  { id: 258, kana: "ちかい", romaji: "chikai", kanji: "近い", accent: "②", pos: "形1", cn: "近", lesson: 9 },
  { id: 259, kana: "はやい", romaji: "hayai", kanji: "早い", accent: "②", pos: "形1", cn: "早", lesson: 9 },
  { id: 260, kana: "おそい", romaji: "osoi", kanji: "遅い", accent: "②", pos: "形1", cn: "晚，慢", lesson: 9 },
  { id: 261, kana: "おおい", romaji: "ōi", kanji: "多い", accent: "①", pos: "形1", cn: "多", lesson: 9 },
  { id: 262, kana: "すくない", romaji: "sukunai", kanji: "少ない", accent: "③", pos: "形1", cn: "少", lesson: 9 },
  { id: 263, kana: "あたたかい", romaji: "atatakai", kanji: "暖かい", accent: "④", pos: "形1", cn: "温暖", lesson: 9 },
  { id: 264, kana: "つめたい", romaji: "tsumetai", kanji: "冷たい", accent: "③", pos: "形1", cn: "凉，冷", lesson: 9 },
  { id: 265, kana: "おもしろい", romaji: "omoshiroi", kanji: "面白い", accent: "④", pos: "形1", cn: "有趣", lesson: 9 },
  { id: 266, kana: "ひま", romaji: "hima", kanji: "暇", accent: "⓪", pos: "形2", cn: "空闲", lesson: 9 },
  { id: 267, kana: "しずか", romaji: "shizuka", kanji: "静か", accent: "①", pos: "形2", cn: "安静", lesson: 9 },
  { id: 268, kana: "にぎやか", romaji: "nigiyaka", kanji: "賑やか", accent: "②", pos: "形2", cn: "热闹", lesson: 9 },
  { id: 269, kana: "きれい", romaji: "kirei", kanji: "綺麗", accent: "①", pos: "形2", cn: "漂亮，干净", lesson: 9 },
  { id: 270, kana: "ひろい", romaji: "hiroi", kanji: "広い", accent: "②", pos: "形1", cn: "宽敞", lesson: 9 },
  // 第10課 典型的な 漢字の 部分は 何ですか
  { id: 271, kana: "てんき", romaji: "tenki", kanji: "天気", accent: "①", pos: "名", cn: "天气", lesson: 10 },
  { id: 272, kana: "あめ", romaji: "ame", kanji: "雨", accent: "①", pos: "名", cn: "雨", lesson: 10 },
  { id: 273, kana: "ゆき", romaji: "yuki", kanji: "雪", accent: "②", pos: "名", cn: "雪", lesson: 10 },
  { id: 274, kana: "くもり", romaji: "kumori", kanji: "曇り", accent: "③", pos: "名", cn: "阴天", lesson: 10 },
  { id: 275, kana: "でんき", romaji: "denki", kanji: "電気", accent: "①", pos: "名", cn: "电，电力", lesson: 10 },
  { id: 276, kana: "てんらい", romaji: "tenrai", kanji: "天来", accent: "⓪", pos: "名", cn: "天然", lesson: 10 },
  { id: 277, kana: "なつ", romaji: "natsu", kanji: "夏", accent: "②", pos: "名", cn: "夏天", lesson: 10 },
  { id: 278, kana: "ふゆ", romaji: "fuyu", kanji: "冬", accent: "②", pos: "名", cn: "冬天", lesson: 10 },
  { id: 279, kana: "あき", romaji: "aki", kanji: "秋", accent: "①", pos: "名", cn: "秋天", lesson: 10 },
  { id: 280, kana: "はる", romaji: "haru", kanji: "春", accent: "①", pos: "名", cn: "春天", lesson: 10 },
  { id: 281, kana: "かぜ", romaji: "kaze", kanji: "風", accent: "⓪", pos: "名", cn: "风", lesson: 10 },
  { id: 282, kana: "くさ", romaji: "kusa", kanji: "草", accent: "⓪", pos: "名", cn: "草", lesson: 10 },
  { id: 283, kana: "き", romaji: "ki", kanji: "木", accent: "①", pos: "名", cn: "树", lesson: 10 },
  { id: 284, kana: "はな", romaji: "hana", kanji: "花", accent: "②", pos: "名", cn: "花", lesson: 10 },
  { id: 285, kana: "みち", romaji: "michi", kanji: "道", accent: "⓪", pos: "名", cn: "道路", lesson: 10 },
  { id: 286, kana: "は", romaji: "ha", kanji: "歯", accent: "①", pos: "名", cn: "牙齿", lesson: 10 },
  { id: 287, kana: "くち", romaji: "kuchi", kanji: "口", accent: "⓪", pos: "名", cn: "嘴，口", lesson: 10 },
  { id: 288, kana: "かお", romaji: "kao", kanji: "顔", accent: "⓪", pos: "名", cn: "脸", lesson: 10 },
  { id: 289, kana: "あし", romaji: "ashi", kanji: "足", accent: "②", pos: "名", cn: "脚，腿", lesson: 10 },
  { id: 290, kana: "て", romaji: "te", kanji: "手", accent: "①", pos: "名", cn: "手", lesson: 10 },
  { id: 291, kana: "め", romaji: "me", kanji: "目", accent: "①", pos: "名", cn: "眼睛", lesson: 10 },
  { id: 292, kana: "みみ", romaji: "mimi", kanji: "耳", accent: "②", pos: "名", cn: "耳朵", lesson: 10 },
  { id: 293, kana: "はな", romaji: "hana", kanji: "鼻", accent: "⓪", pos: "名", cn: "鼻子", lesson: 10 },
  { id: 294, kana: "かみ", romaji: "kami", kanji: "髪", accent: "②", pos: "名", cn: "头发", lesson: 10 },
  { id: 295, kana: "あたま", romaji: "atama", kanji: "頭", accent: "③", pos: "名", cn: "头", lesson: 10 },
  { id: 296, kana: "からだ", romaji: "karada", kanji: "体", accent: "⓪", pos: "名", cn: "身体", lesson: 10 },
  { id: 297, kana: "せなか", romaji: "senaka", kanji: "背中", accent: "⓪", pos: "名", cn: "背，后背", lesson: 10 },
  { id: 298, kana: "おなか", romaji: "onaka", kanji: "", accent: "⓪", pos: "名", cn: "肚子", lesson: 10 },
  { id: 299, kana: "うで", romaji: "ude", kanji: "腕", accent: "②", pos: "名", cn: "手臂", lesson: 10 },
  { id: 300, kana: "こえ", romaji: "koe", kanji: "声", accent: "①", pos: "名", cn: "声音", lesson: 10 },
  { id: 301, kana: "ねだん", romaji: "nedan", kanji: "値段", accent: "⓪", pos: "名", cn: "价格", lesson: 10 },
  { id: 302, kana: "ひと", romaji: "hito", kanji: "人", accent: "⓪", pos: "名", cn: "人", lesson: 10 },
  { id: 303, kana: "かぞく", romaji: "kazoku", kanji: "家族", accent: "①", pos: "名", cn: "家人，家庭", lesson: 10 },
  { id: 304, kana: "こども", romaji: "kodomo", kanji: "子供", accent: "⓪", pos: "名", cn: "孩子", lesson: 10 },
  { id: 305, kana: "おとこのひと", romaji: "otoko no hito", kanji: "男の人", accent: "③", pos: "名", cn: "男人", lesson: 10 },
  { id: 306, kana: "おんなのひと", romaji: "onna no hito", kanji: "女の人", accent: "③", pos: "名", cn: "女人", lesson: 10 },
  { id: 307, kana: "ともだち", romaji: "tomodachi", kanji: "友達", accent: "⓪", pos: "名", cn: "朋友", lesson: 10 },
  { id: 308, kana: "かれ", romaji: "kare", kanji: "彼", accent: "①", pos: "代", cn: "他", lesson: 10 },
  { id: 309, kana: "かのじょ", romaji: "kanojo", kanji: "彼女", accent: "①", pos: "代", cn: "她；女朋友", lesson: 10 },
  { id: 310, kana: "おとこのこ", romaji: "otokonoko", kanji: "男の子", accent: "③", pos: "名", cn: "男孩", lesson: 10 },
  { id: 311, kana: "おんなのこ", romaji: "onnanoko", kanji: "女の子", accent: "③", pos: "名", cn: "女孩", lesson: 10 },
  { id: 312, kana: "せんしゅう", romaji: "senshū", kanji: "先週", accent: "⓪", pos: "名", cn: "上周", lesson: 10 },
  { id: 313, kana: "らいねん", romaji: "rainen", kanji: "来年", accent: "⓪", pos: "名", cn: "明年", lesson: 10 },
  { id: 314, kana: "きょねん", romaji: "kyonen", kanji: "去年", accent: "①", pos: "名", cn: "去年", lesson: 10 },
  { id: 315, kana: "こんねん", romaji: "konnen", kanji: "今年", accent: "①", pos: "名", cn: "今年", lesson: 10 },
  { id: 316, kana: "あさって", romaji: "asatte", kanji: "明後日", accent: "②", pos: "名", cn: "后天", lesson: 10 },
  { id: 317, kana: "おととい", romaji: "ototoi", kanji: "一昨日", accent: "③", pos: "名", cn: "前天", lesson: 10 },
  { id: 318, kana: "ゆうべ", romaji: "yūbe", kanji: "昨夜", accent: "③", pos: "名", cn: "昨晚", lesson: 10 },
  { id: 319, kana: "こんや", romaji: "kon'ya", kanji: "今夜", accent: "①", pos: "名", cn: "今晚", lesson: 10 },
  { id: 320, kana: "やすむ", romaji: "yasumu", kanji: "休む", accent: "②", pos: "动1", cn: "休息", lesson: 10 },
  { id: 321, kana: "はいる", romaji: "hairu", kanji: "入る", accent: "①", pos: "动1", cn: "进入", lesson: 10 },
  { id: 322, kana: "でる", romaji: "deru", kanji: "出る", accent: "①", pos: "动2", cn: "出去", lesson: 10 },
  { id: 323, kana: "かく", romaji: "kaku", kanji: "書く", accent: "①", pos: "动1", cn: "写", lesson: 10 },
  { id: 324, kana: "よむ", romaji: "yomu", kanji: "読む", accent: "①", pos: "动1", cn: "读", lesson: 10 },
  { id: 325, kana: "きく", romaji: "kiku", kanji: "聞く", accent: "⓪", pos: "动1", cn: "听", lesson: 10 },
  { id: 326, kana: "みる", romaji: "miru", kanji: "見る", accent: "①", pos: "动2", cn: "看", lesson: 10 },
  { id: 327, kana: "いう", romaji: "iu", kanji: "言う", accent: "⓪", pos: "动1", cn: "说", lesson: 10 },
  { id: 328, kana: "かう", romaji: "kau", kanji: "買う", accent: "⓪", pos: "动1", cn: "买", lesson: 10 },
  { id: 329, kana: "とる", romaji: "toru", kanji: "撮る", accent: "①", pos: "动1", cn: "拍（照）", lesson: 10 },
  { id: 330, kana: "はなす", romaji: "hanasu", kanji: "話す", accent: "②", pos: "动1", cn: "说，讲", lesson: 10 },
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
