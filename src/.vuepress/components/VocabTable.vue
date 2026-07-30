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
  // 第11课
  { id: 331, kana: "うた", romaji: "uta", kanji: "歌", accent: "②", pos: "名", cn: "歌，歌曲", lesson: 11 },
  { id: 332, kana: "カラオケ", romaji: "karaoke", kanji: "", accent: "⓪", pos: "名", cn: "卡拉OK", lesson: 11 },
  { id: 333, kana: "ロック", romaji: "rokku", kanji: "", accent: "①", pos: "名", cn: "摇滚乐", lesson: 11 },
  { id: 334, kana: "ポップス", romaji: "poppusu", kanji: "", accent: "①", pos: "名", cn: "流行音乐", lesson: 11 },
  { id: 335, kana: "クラシック", romaji: "kurashikku", kanji: "", accent: "④", pos: "名", cn: "古典音乐", lesson: 11 },
  { id: 336, kana: "ピアノ", romaji: "piano", kanji: "", accent: "⓪", pos: "名", cn: "钢琴", lesson: 11 },
  { id: 337, kana: "え", romaji: "e", kanji: "絵", accent: "①", pos: "名", cn: "画儿", lesson: 11 },
  { id: 338, kana: "えいご", romaji: "ēgo", kanji: "英語", accent: "⓪", pos: "名", cn: "英语", lesson: 11 },
  { id: 339, kana: "スポーツ", romaji: "supōtsu", kanji: "", accent: "③", pos: "名", cn: "体育，运动", lesson: 11 },
  { id: 340, kana: "すいえい", romaji: "suiē", kanji: "水泳", accent: "⓪", pos: "名", cn: "游泳", lesson: 11 },
  { id: 341, kana: "ゴルフ", romaji: "gorufu", kanji: "", accent: "①", pos: "名", cn: "高尔夫", lesson: 11 },
  { id: 342, kana: "うんてん", romaji: "unten", kanji: "運転", accent: "⓪", pos: "名", cn: "驾驶", lesson: 11 },
  { id: 343, kana: "のみもの", romaji: "nomimono", kanji: "飲み物", accent: "③", pos: "名", cn: "饮料", lesson: 11 },
  { id: 344, kana: "おさけ", romaji: "osake", kanji: "お酒", accent: "⓪", pos: "名", cn: "酒", lesson: 11 },
  { id: 345, kana: "にく", romaji: "niku", kanji: "肉", accent: "②", pos: "名", cn: "肉", lesson: 11 },
  { id: 346, kana: "やさい", romaji: "yasai", kanji: "野菜", accent: "⓪", pos: "名", cn: "蔬菜", lesson: 11 },
  { id: 347, kana: "くだもの", romaji: "kudamono", kanji: "果物", accent: "③", pos: "名", cn: "水果", lesson: 11 },
  { id: 348, kana: "ヒマワリ", romaji: "himawari", kanji: "", accent: "③", pos: "名", cn: "向日葵", lesson: 11 },
  { id: 349, kana: "バラ", romaji: "bara", kanji: "", accent: "⓪", pos: "名", cn: "玫瑰", lesson: 11 },
  { id: 350, kana: "まど", romaji: "mado", kanji: "窓", accent: "①", pos: "名", cn: "窗户", lesson: 11 },
  { id: 351, kana: "けっこんしき", romaji: "kekkonshiki", kanji: "結婚式", accent: "④", pos: "名", cn: "结婚典礼", lesson: 11 },
  { id: 352, kana: "しゃしんてん", romaji: "shashinten", kanji: "写真展", accent: "⓪", pos: "名", cn: "摄影展", lesson: 11 },
  { id: 353, kana: "りょかん", romaji: "ryokan", kanji: "旅館", accent: "⓪", pos: "名", cn: "旅馆", lesson: 11 },
  { id: 354, kana: "がいこく", romaji: "gaikoku", kanji: "外国", accent: "⓪", pos: "名", cn: "外国", lesson: 11 },
  { id: 355, kana: "かいぎ", romaji: "kaigi", kanji: "会議", accent: "①", pos: "名", cn: "会议", lesson: 11 },
  { id: 356, kana: "ぼく", romaji: "boku", kanji: "", accent: "①", pos: "代", cn: "我（男性自称）", lesson: 11 },
  { id: 357, kana: "わかります", romaji: "wakarimasu", kanji: "分かります", accent: "④", pos: "动1", cn: "懂，明白", lesson: 11 },
  { id: 358, kana: "まよいます", romaji: "mayoimasu", kanji: "迷います", accent: "④", pos: "动1", cn: "犹豫，难以决定", lesson: 11 },
  { id: 359, kana: "できます", romaji: "dekimasu", kanji: "", accent: "③", pos: "动2", cn: "会；能；完成", lesson: 11 },
  { id: 360, kana: "しめます", romaji: "shimemasu", kanji: "閉めます", accent: "③", pos: "动2", cn: "关闭", lesson: 11 },
  { id: 361, kana: "つかれます", romaji: "tsukaremasu", kanji: "疲れます", accent: "④", pos: "动2", cn: "疲倦", lesson: 11 },
  { id: 362, kana: "さんぽします", romaji: "sanposhimasu", kanji: "散歩します", accent: "⑤", pos: "动3", cn: "散步", lesson: 11 },
  { id: 363, kana: "こわい", romaji: "kowai", kanji: "怖い", accent: "②", pos: "形1", cn: "害怕", lesson: 11 },
  { id: 364, kana: "あかい", romaji: "akai", kanji: "赤い", accent: "⓪", pos: "形1", cn: "红", lesson: 11 },
  { id: 365, kana: "いたい", romaji: "itai", kanji: "痛い", accent: "②", pos: "形1", cn: "疼，疼痛", lesson: 11 },
  { id: 366, kana: "じょうず", romaji: "jōzu", kanji: "上手", accent: "③", pos: "形2", cn: "擅长", lesson: 11 },
  { id: 367, kana: "へた", romaji: "heta", kanji: "下手", accent: "②", pos: "形2", cn: "不擅长", lesson: 11 },
  { id: 368, kana: "にがて", romaji: "nigate", kanji: "苦手", accent: "⓪", pos: "形2", cn: "不善于", lesson: 11 },
  { id: 369, kana: "ときどき", romaji: "tokidoki", kanji: "時々", accent: "⓪", pos: "副", cn: "有时", lesson: 11 },
  { id: 370, kana: "よく", romaji: "yoku", kanji: "", accent: "①", pos: "副", cn: "经常", lesson: 11 },
  { id: 371, kana: "たまに", romaji: "tamani", kanji: "", accent: "⓪", pos: "副", cn: "偶尔", lesson: 11 },
  { id: 372, kana: "どうして", romaji: "dōshite", kanji: "", accent: "①", pos: "副", cn: "为什么", lesson: 11 },
  { id: 373, kana: "だから", romaji: "dakara", kanji: "", accent: "①", pos: "副", cn: "所以", lesson: 11 },
  { id: 374, kana: "うーん", romaji: "ūn", kanji: "", accent: "①", pos: "叹", cn: "嗯……", lesson: 11 },
  { id: 375, kana: "けっこうです", romaji: "kekkō desu", kanji: "結構です", accent: "①", pos: "短语", cn: "不用，不要", lesson: 11 },
  // 第12课
  { id: 376, kana: "きせつ", romaji: "kisetsu", kanji: "季節", accent: "②", pos: "名", cn: "季节", lesson: 12 },
  { id: 377, kana: "ふゆ", romaji: "fuyu", kanji: "冬", accent: "②", pos: "名", cn: "冬天", lesson: 12 },
  { id: 378, kana: "はる", romaji: "haru", kanji: "春", accent: "①", pos: "名", cn: "春天", lesson: 12 },
  { id: 379, kana: "にほんりょうり", romaji: "nihonryōri", kanji: "日本料理", accent: "⑤", pos: "名", cn: "日式饭菜", lesson: 12 },
  { id: 380, kana: "すし", romaji: "sushi", kanji: "寿司", accent: "②", pos: "名", cn: "寿司", lesson: 12 },
  { id: 381, kana: "ナシ", romaji: "nashi", kanji: "", accent: "②", pos: "名", cn: "梨", lesson: 12 },
  { id: 382, kana: "バナナ", romaji: "banana", kanji: "", accent: "①", pos: "名", cn: "香蕉", lesson: 12 },
  { id: 383, kana: "ミカン", romaji: "mikan", kanji: "", accent: "①", pos: "名", cn: "橘子", lesson: 12 },
  { id: 384, kana: "にほんしゅ", romaji: "nihonshu", kanji: "日本酒", accent: "⓪", pos: "名", cn: "日本酒", lesson: 12 },
  { id: 385, kana: "こうちゃ", romaji: "kōcha", kanji: "紅茶", accent: "⓪", pos: "名", cn: "红茶", lesson: 12 },
  { id: 386, kana: "ウーロンちゃ", romaji: "ūroncha", kanji: "ウーロン茶", accent: "③", pos: "名", cn: "乌龙茶", lesson: 12 },
  { id: 387, kana: "りょくちゃ", romaji: "ryokucha", kanji: "緑茶", accent: "⓪", pos: "名", cn: "绿茶", lesson: 12 },
  { id: 388, kana: "ジュース", romaji: "jūsu", kanji: "", accent: "①", pos: "名", cn: "果汁", lesson: 12 },
  { id: 389, kana: "にんき", romaji: "ninki", kanji: "人気", accent: "⓪", pos: "名", cn: "受欢迎", lesson: 12 },
  { id: 390, kana: "せき", romaji: "seki", kanji: "席", accent: "①", pos: "名", cn: "座位", lesson: 12 },
  { id: 391, kana: "クラス", romaji: "kurasu", kanji: "", accent: "①", pos: "名", cn: "班级", lesson: 12 },
  { id: 392, kana: "しゅるい", romaji: "shurui", kanji: "種類", accent: "①", pos: "名", cn: "种类", lesson: 12 },
  { id: 393, kana: "せ", romaji: "se", kanji: "背", accent: "①", pos: "名", cn: "个子", lesson: 12 },
  { id: 394, kana: "あに", romaji: "ani", kanji: "兄", accent: "①", pos: "名", cn: "哥哥", lesson: 12 },
  { id: 395, kana: "さいきん", romaji: "saikin", kanji: "最近", accent: "⓪", pos: "名", cn: "最近", lesson: 12 },
  { id: 396, kana: "ふります", romaji: "furimasu", kanji: "降ります", accent: "③", pos: "动1", cn: "下（雨，雪）", lesson: 12 },
  { id: 397, kana: "わかい", romaji: "wakai", kanji: "若い", accent: "②", pos: "形1", cn: "年轻", lesson: 12 },
  { id: 398, kana: "あたたかい", romaji: "atatakai", kanji: "暖かい", accent: "④", pos: "形1", cn: "暖和", lesson: 12 },
  { id: 399, kana: "すずしい", romaji: "suzushī", kanji: "涼しい", accent: "③", pos: "形1", cn: "凉爽", lesson: 12 },
  { id: 400, kana: "はやい", romaji: "hayai", kanji: "速い", accent: "②", pos: "形1", cn: "快", lesson: 12 },
  { id: 401, kana: "だいすき", romaji: "daisuki", kanji: "大好き", accent: "①", pos: "形2", cn: "非常喜欢", lesson: 12 },
  { id: 402, kana: "いちばん", romaji: "ichiban", kanji: "", accent: "⓪", pos: "副", cn: "最，第一", lesson: 12 },
  { id: 403, kana: "ずっと", romaji: "zutto", kanji: "", accent: "⓪", pos: "副", cn: "～得多", lesson: 12 },
  { id: 404, kana: "やはり", romaji: "yahari", kanji: "", accent: "③", pos: "副", cn: "仍然，还是", lesson: 12 },
  { id: 405, kana: "やっぱり", romaji: "yappari", kanji: "", accent: "③", pos: "副", cn: "仍然，还是", lesson: 12 },
  { id: 406, kana: "エベレスト", romaji: "eberesuto", kanji: "", accent: "③", pos: "专", cn: "珠穆朗玛峰", lesson: 12 },
  // 第13课
  { id: 407, kana: "にもつ", romaji: "nimotsu", kanji: "荷物", accent: "①", pos: "名", cn: "包裹", lesson: 13 },
  { id: 408, kana: "はがき", romaji: "hagaki", kanji: "", accent: "⓪", pos: "名", cn: "明信片", lesson: 13 },
  { id: 409, kana: "きって", romaji: "kitte", kanji: "切手", accent: "⓪", pos: "名", cn: "邮票", lesson: 13 },
  { id: 410, kana: "ひきだし", romaji: "hikidashi", kanji: "引き出し", accent: "⓪", pos: "名", cn: "抽屉", lesson: 13 },
  { id: 411, kana: "アルバム", romaji: "arubamu", kanji: "", accent: "⓪", pos: "名", cn: "相册", lesson: 13 },
  { id: 412, kana: "タバコ", romaji: "tabako", kanji: "", accent: "⓪", pos: "名", cn: "烟", lesson: 13 },
  { id: 413, kana: "まんが", romaji: "manga", kanji: "漫画", accent: "⓪", pos: "名", cn: "漫画", lesson: 13 },
  { id: 414, kana: "ガレージ", romaji: "garēji", kanji: "", accent: "②", pos: "名", cn: "车库", lesson: 13 },
  { id: 415, kana: "しゅうり", romaji: "shūri", kanji: "修理", accent: "①", pos: "名", cn: "修理", lesson: 13 },
  { id: 416, kana: "いざかや", romaji: "izakaya", kanji: "居酒屋", accent: "⓪", pos: "名", cn: "酒馆", lesson: 13 },
  { id: 417, kana: "なまビール", romaji: "namabīru", kanji: "生ビール", accent: "③", pos: "名", cn: "生啤", lesson: 13 },
  { id: 418, kana: "やきとり", romaji: "yakitori", kanji: "焼き鳥", accent: "⓪", pos: "名", cn: "烤鸡肉串", lesson: 13 },
  { id: 419, kana: "からあげ", romaji: "karaage", kanji: "唐揚げ", accent: "⓪", pos: "名", cn: "炸鸡", lesson: 13 },
  { id: 420, kana: "にくじゃが", romaji: "nikujaga", kanji: "肉じゃが", accent: "⓪", pos: "名", cn: "土豆炖肉", lesson: 13 },
  { id: 421, kana: "ボウリング", romaji: "bōringu", kanji: "", accent: "⓪", pos: "名", cn: "保龄球", lesson: 13 },
  { id: 422, kana: "ぞう", romaji: "zō", kanji: "象", accent: "①", pos: "名", cn: "大象", lesson: 13 },
  { id: 423, kana: "ひる", romaji: "hiru", kanji: "昼", accent: "②", pos: "名", cn: "白天，中午", lesson: 13 },
  { id: 424, kana: "ほか", romaji: "hoka", kanji: "", accent: "⓪", pos: "名", cn: "另外，其他", lesson: 13 },
  { id: 425, kana: "かかります", romaji: "kakarimasu", kanji: "", accent: "④", pos: "动1", cn: "花费（时间，金钱）", lesson: 13 },
  { id: 426, kana: "さきます", romaji: "sakimasu", kanji: "咲きます", accent: "③", pos: "动1", cn: "花开", lesson: 13 },
  { id: 427, kana: "およぎます", romaji: "oyogimasu", kanji: "泳ぎます", accent: "④", pos: "动1", cn: "游泳", lesson: 13 },
  { id: 428, kana: "あそびます", romaji: "asobimasu", kanji: "遊びます", accent: "④", pos: "动1", cn: "玩，玩耍", lesson: 13 },
  { id: 429, kana: "すいます", romaji: "suimasu", kanji: "吸います", accent: "③", pos: "动1", cn: "吸（烟）", lesson: 13 },
  { id: 430, kana: "きります", romaji: "kirimasu", kanji: "切ります", accent: "③", pos: "动1", cn: "剪，切", lesson: 13 },
  { id: 431, kana: "だいたい", romaji: "daitai", kanji: "", accent: "⓪", pos: "副", cn: "大约，大概", lesson: 13 },
  { id: 432, kana: "とりあえず", romaji: "toriaezu", kanji: "", accent: "④", pos: "副", cn: "暂且", lesson: 13 },
  { id: 433, kana: "どのぐらい", romaji: "donogurai", kanji: "", accent: "①", pos: "短语", cn: "多久，多少钱", lesson: 13 },
  // 第14课
  { id: 434, kana: "ふなびん", romaji: "funabin", kanji: "船便", accent: "⓪", pos: "名", cn: "海运", lesson: 14 },
  { id: 435, kana: "しょるい", romaji: "shorui", kanji: "書類", accent: "⓪", pos: "名", cn: "文件", lesson: 14 },
  { id: 436, kana: "げんこう", romaji: "genkō", kanji: "原稿", accent: "⓪", pos: "名", cn: "稿子", lesson: 14 },
  { id: 437, kana: "きじ", romaji: "kiji", kanji: "記事", accent: "①", pos: "名", cn: "报道", lesson: 14 },
  { id: 438, kana: "メモ", romaji: "memo", kanji: "", accent: "①", pos: "名", cn: "记录", lesson: 14 },
  { id: 439, kana: "えきまえ", romaji: "ekimae", kanji: "駅前", accent: "③", pos: "名", cn: "车站一带", lesson: 14 },
  { id: 440, kana: "はし", romaji: "hashi", kanji: "橋", accent: "②", pos: "名", cn: "桥", lesson: 14 },
  { id: 441, kana: "かど", romaji: "kado", kanji: "角", accent: "①", pos: "名", cn: "拐角", lesson: 14 },
  { id: 442, kana: "おうだんほどう", romaji: "ōdanhodō", kanji: "横断歩道", accent: "⑤", pos: "名", cn: "人行横道", lesson: 14 },
  { id: 443, kana: "みぎ", romaji: "migi", kanji: "右", accent: "⓪", pos: "名", cn: "右", lesson: 14 },
  { id: 444, kana: "ひだり", romaji: "hidari", kanji: "左", accent: "⓪", pos: "名", cn: "左", lesson: 14 },
  { id: 445, kana: "こうさてん", romaji: "kōsaten", kanji: "交差点", accent: "⓪", pos: "名", cn: "十字路口", lesson: 14 },
  { id: 446, kana: "みち", romaji: "michi", kanji: "道", accent: "⓪", pos: "名", cn: "道路", lesson: 14 },
  { id: 447, kana: "ドア", romaji: "doa", kanji: "", accent: "①", pos: "名", cn: "门", lesson: 14 },
  { id: 448, kana: "でんき", romaji: "denki", kanji: "電気", accent: "①", pos: "名", cn: "电", lesson: 14 },
  { id: 449, kana: "たいきょくけん", romaji: "taikyokuken", kanji: "太極拳", accent: "④", pos: "名", cn: "太极拳", lesson: 14 },
  { id: 450, kana: "あさごはん", romaji: "asagohan", kanji: "朝ご飯", accent: "③", pos: "名", cn: "早饭", lesson: 14 },
  { id: 451, kana: "ばんごはん", romaji: "bangohan", kanji: "晩ご飯", accent: "③", pos: "名", cn: "晚饭", lesson: 14 },
  { id: 452, kana: "バーベキュー", romaji: "bābekyū", kanji: "", accent: "③", pos: "名", cn: "户外烧烤", lesson: 14 },
  { id: 453, kana: "とおります", romaji: "tōrimasu", kanji: "通ります", accent: "④", pos: "动1", cn: "通过，经过", lesson: 14 },
  { id: 454, kana: "いそぎます", romaji: "isogimasu", kanji: "急ぎます", accent: "④", pos: "动1", cn: "急，急忙", lesson: 14 },
  { id: 455, kana: "とびます", romaji: "tobimasu", kanji: "飛びます", accent: "③", pos: "动1", cn: "飞", lesson: 14 },
  { id: 456, kana: "しにます", romaji: "shinimasu", kanji: "死にます", accent: "③", pos: "动1", cn: "死", lesson: 14 },
  { id: 457, kana: "まちます", romaji: "machimasu", kanji: "待ちます", accent: "③", pos: "动1", cn: "等待", lesson: 14 },
  { id: 458, kana: "うります", romaji: "urimasu", kanji: "売ります", accent: "③", pos: "动1", cn: "卖", lesson: 14 },
  { id: 459, kana: "はなします", romaji: "hanashimasu", kanji: "話します", accent: "④", pos: "动1", cn: "说话", lesson: 14 },
  { id: 460, kana: "わたります", romaji: "watarimasu", kanji: "渡ります", accent: "④", pos: "动1", cn: "过（桥，河）", lesson: 14 },
  { id: 461, kana: "おろします", romaji: "oroshimasu", kanji: "下ろします", accent: "④", pos: "动1", cn: "取，卸货", lesson: 14 },
  { id: 462, kana: "えらびます", romaji: "erabimasu", kanji: "選びます", accent: "④", pos: "动1", cn: "挑选", lesson: 14 },
  { id: 463, kana: "けします", romaji: "keshimasu", kanji: "消します", accent: "③", pos: "动1", cn: "关（灯）", lesson: 14 },
  { id: 464, kana: "あるきます", romaji: "arukimasu", kanji: "歩きます", accent: "④", pos: "动1", cn: "步行", lesson: 14 },
  { id: 465, kana: "まがります", romaji: "magarimasu", kanji: "曲がります", accent: "④", pos: "动1", cn: "拐弯", lesson: 14 },
  { id: 466, kana: "あらいます", romaji: "araimasu", kanji: "洗います", accent: "④", pos: "动1", cn: "洗", lesson: 14 },
  { id: 467, kana: "でます", romaji: "demasu", kanji: "出ます", accent: "①", pos: "动2", cn: "离开", lesson: 14 },
  { id: 468, kana: "でかけます", romaji: "dekakemasu", kanji: "出かけます", accent: "⓪", pos: "动2", cn: "外出", lesson: 14 },
  { id: 469, kana: "あけます", romaji: "akemasu", kanji: "開けます", accent: "⓪", pos: "动2", cn: "打开", lesson: 14 },
  { id: 470, kana: "すぎます", romaji: "sugimasu", kanji: "過ぎます", accent: "③", pos: "动2", cn: "过", lesson: 14 },
  { id: 471, kana: "みせます", romaji: "misemasu", kanji: "見せます", accent: "③", pos: "动2", cn: "给～看", lesson: 14 },
  { id: 472, kana: "つけます", romaji: "tsukemasu", kanji: "", accent: "⓪", pos: "动2", cn: "开（灯）", lesson: 14 },
  { id: 473, kana: "おります", romaji: "orimasu", kanji: "降ります", accent: "③", pos: "动2", cn: "下（车）", lesson: 14 },
  { id: 474, kana: "かいものします", romaji: "kaimonoshimasu", kanji: "買い物します", accent: "⓪", pos: "动3", cn: "买东西", lesson: 14 },
  { id: 475, kana: "そつぎょうします", romaji: "sotsugyōshimasu", kanji: "卒業します", accent: "⓪", pos: "动3", cn: "毕业", lesson: 14 },
  { id: 476, kana: "しょくじします", romaji: "shokujishimasu", kanji: "食事します", accent: "⓪", pos: "动3", cn: "吃饭", lesson: 14 },
  { id: 477, kana: "コピーします", romaji: "kopīshimasu", kanji: "", accent: "①", pos: "动3", cn: "复印", lesson: 14 },
  { id: 478, kana: "くらい", romaji: "kurai", kanji: "暗い", accent: "⓪", pos: "形1", cn: "黑暗", lesson: 14 },
  { id: 479, kana: "たいへん", romaji: "taihen", kanji: "大変", accent: "⓪", pos: "形2", cn: "够受的", lesson: 14 },
  { id: 480, kana: "なかなか", romaji: "nakanaka", kanji: "", accent: "⓪", pos: "副", cn: "相当，很", lesson: 14 },
  { id: 481, kana: "あとで", romaji: "atode", kanji: "後で", accent: "①", pos: "副", cn: "过会儿", lesson: 14 },
  { id: 482, kana: "それから", romaji: "sorekara", kanji: "", accent: "⓪", pos: "副", cn: "然后", lesson: 14 },
  // 第15课
  { id: 483, kana: "ボート", romaji: "bōto", kanji: "", accent: "①", pos: "名", cn: "小船", lesson: 15 },
  { id: 484, kana: "ベンチ", romaji: "benchi", kanji: "", accent: "①", pos: "名", cn: "长椅", lesson: 15 },
  { id: 485, kana: "しやくしょ", romaji: "shiyakusho", kanji: "市役所", accent: "②", pos: "名", cn: "市政府", lesson: 15 },
  { id: 486, kana: "けいたいでんわ", romaji: "kētaidenwa", kanji: "携帯電話", accent: "⑤", pos: "名", cn: "手机", lesson: 15 },
  { id: 487, kana: "きんえん", romaji: "kin'en", kanji: "禁煙", accent: "⓪", pos: "名", cn: "禁止吸烟", lesson: 15 },
  { id: 488, kana: "かぜ", romaji: "kaze", kanji: "風邪", accent: "⓪", pos: "名", cn: "感冒", lesson: 15 },
  { id: 489, kana: "ねつ", romaji: "netsu", kanji: "熱", accent: "②", pos: "名", cn: "发烧", lesson: 15 },
  { id: 490, kana: "すいみん", romaji: "suimin", kanji: "睡眠", accent: "⓪", pos: "名", cn: "睡眠", lesson: 15 },
  { id: 491, kana: "おふろ", romaji: "ofuro", kanji: "お風呂", accent: "②", pos: "名", cn: "浴室", lesson: 15 },
  { id: 492, kana: "やっきょく", romaji: "yakkyoku", kanji: "薬局", accent: "⓪", pos: "名", cn: "药店", lesson: 15 },
  { id: 493, kana: "クーラー", romaji: "kūrā", kanji: "", accent: "①", pos: "名", cn: "空调", lesson: 15 },
  { id: 494, kana: "うちあわせ", romaji: "uchiawase", kanji: "打ち合わせ", accent: "⓪", pos: "名", cn: "事先商量", lesson: 15 },
  { id: 495, kana: "むり", romaji: "muri", kanji: "無理", accent: "①", pos: "名", cn: "勉强", lesson: 15 },
  { id: 496, kana: "ちゅうしゃきんし", romaji: "chūshakinshi", kanji: "駐車禁止", accent: "⓪", pos: "名", cn: "禁止停车", lesson: 15 },
  { id: 497, kana: "たちいりきんし", romaji: "tachiirikinshi", kanji: "立入禁止", accent: "⓪", pos: "名", cn: "禁止进入", lesson: 15 },
  { id: 498, kana: "かきげんきん", romaji: "kakigenkin", kanji: "火気厳禁", accent: "①", pos: "名", cn: "严禁烟火", lesson: 15 },
  { id: 499, kana: "さつえいきんし", romaji: "satsēkinshi", kanji: "撮影禁止", accent: "⓪", pos: "名", cn: "禁止拍照", lesson: 15 },
  { id: 500, kana: "のります", romaji: "norimasu", kanji: "乗ります", accent: "③", pos: "动1", cn: "乘坐", lesson: 15 },
  { id: 501, kana: "つかいます", romaji: "tsukaimasu", kanji: "使います", accent: "④", pos: "动1", cn: "使用", lesson: 15 },
  { id: 502, kana: "すわります", romaji: "suwarimasu", kanji: "座ります", accent: "④", pos: "动1", cn: "坐", lesson: 15 },
  { id: 503, kana: "はいります", romaji: "hairimasu", kanji: "入ります", accent: "④", pos: "动1", cn: "进入", lesson: 15 },
  { id: 504, kana: "もうします", romaji: "mōshimasu", kanji: "申します", accent: "④", pos: "动1", cn: "说，讲（谦让）", lesson: 15 },
  { id: 505, kana: "とります", romaji: "torimasu", kanji: "", accent: "①", pos: "动1", cn: "取", lesson: 15 },
  { id: 506, kana: "うたいます", romaji: "utaimasu", kanji: "歌います", accent: "④", pos: "动1", cn: "唱", lesson: 15 },
  { id: 507, kana: "つたえます", romaji: "tsutaemasu", kanji: "伝えます", accent: "⓪", pos: "动2", cn: "传达，转告", lesson: 15 },
  { id: 508, kana: "とめます", romaji: "tomemasu", kanji: "止めます", accent: "⓪", pos: "动2", cn: "停，制止", lesson: 15 },
  { id: 509, kana: "だいじょうぶ", romaji: "daijōbu", kanji: "大丈夫", accent: "③", pos: "形2", cn: "没关系", lesson: 15 },
  { id: 510, kana: "だめ", romaji: "dame", kanji: "", accent: "②", pos: "形2", cn: "不行", lesson: 15 },
  { id: 511, kana: "じゅうぶん", romaji: "jūbun", kanji: "十分", accent: "③", pos: "副", cn: "好好地，充足地", lesson: 15 },
  { id: 512, kana: "もちろん", romaji: "mochiron", kanji: "", accent: "③", pos: "副", cn: "当然", lesson: 15 },
  { id: 513, kana: "ゆっくり", romaji: "yukkuri", kanji: "", accent: "③", pos: "副", cn: "好好地", lesson: 15 },
  { id: 514, kana: "もしもし", romaji: "moshimoshi", kanji: "", accent: "①", pos: "叹", cn: "喂", lesson: 15 },
  { id: 515, kana: "おだいじに", romaji: "odaijini", kanji: "お大事に", accent: "⓪", pos: "短语", cn: "请多保重", lesson: 15 },
  { id: 516, kana: "いけません", romaji: "ikemasen", kanji: "", accent: "④", pos: "短语", cn: "不行", lesson: 15 },
  { id: 517, kana: "かまいません", romaji: "kamaimasen", kanji: "", accent: "⑤", pos: "短语", cn: "没关系", lesson: 15 },
  { id: 518, kana: "きをつけます", romaji: "ki o tsukemasu", kanji: "気をつけます", accent: "⓪", pos: "短语", cn: "注意", lesson: 15 },
  // 第16课
  { id: 519, kana: "すぐ", romaji: "sugu", kanji: "", accent: "①", pos: "副", cn: "马上", lesson: 16 },
  { id: 520, kana: "もう", romaji: "mō", kanji: "", accent: "①", pos: "副", cn: "已经", lesson: 16 },
  { id: 521, kana: "まだ", romaji: "mada", kanji: "", accent: "①", pos: "副", cn: "还，尚", lesson: 16 },
  { id: 522, kana: "さっき", romaji: "sakki", kanji: "", accent: "①", pos: "副", cn: "刚才", lesson: 16 },
  { id: 523, kana: "さあ", romaji: "sā", kanji: "", accent: "①", pos: "叹", cn: "啊，喂", lesson: 16 },
  { id: 524, kana: "ぜひ", romaji: "zehi", kanji: "", accent: "①", pos: "副", cn: "一定，务必", lesson: 16 },
  { id: 525, kana: "いつ", romaji: "itsu", kanji: "", accent: "①", pos: "代", cn: "什么时候", lesson: 16 },
  { id: 526, kana: "こんど", romaji: "kondo", kanji: "今度", accent: "①", pos: "名", cn: "这次，下次", lesson: 16 },
  { id: 527, kana: "そろそろ", romaji: "sorosoro", kanji: "", accent: "①", pos: "副", cn: "就要，不久", lesson: 16 },
  { id: 528, kana: "どうやって", romaji: "dōyatte", kanji: "", accent: "①", pos: "副", cn: "怎么，如何", lesson: 16 },
  { id: 529, kana: "どのくらい", romaji: "donokurai", kanji: "", accent: "⑤", pos: "副", cn: "多久，多少", lesson: 16 },
  { id: 530, kana: "ゆっくり", romaji: "yukkuri", kanji: "", accent: "③", pos: "副", cn: "慢慢地", lesson: 16 },
  { id: 531, kana: "へや", romaji: "heya", kanji: "部屋", accent: "②", pos: "名", cn: "房间", lesson: 16 },
  { id: 532, kana: "でんき", romaji: "denki", kanji: "電気", accent: "①", pos: "名", cn: "电灯", lesson: 16 },
  { id: 533, kana: "つける", romaji: "tsukeru", kanji: "", accent: "②", pos: "动2", cn: "开（灯）", lesson: 16 },
  { id: 534, kana: "けす", romaji: "kesu", kanji: "消す", accent: "①", pos: "动1", cn: "关（灯）", lesson: 16 },
  { id: 535, kana: "いそぐ", romaji: "isogu", kanji: "急ぐ", accent: "②", pos: "动1", cn: "急，着急", lesson: 16 },
  { id: 536, kana: "まつ", romaji: "matsu", kanji: "待つ", accent: "①", pos: "动1", cn: "等", lesson: 16 },
  { id: 537, kana: "うる", romaji: "uru", kanji: "売る", accent: "②", pos: "动1", cn: "卖", lesson: 16 },
  { id: 538, kana: "だす", romaji: "dasu", kanji: "出す", accent: "①", pos: "动1", cn: "拿出，提出", lesson: 16 },
  { id: 539, kana: "いれる", romaji: "ireru", kanji: "入れる", accent: "⓪", pos: "动2", cn: "放入", lesson: 16 },
  { id: 540, kana: "あける", romaji: "akeru", kanji: "開ける", accent: "⓪", pos: "动2", cn: "打开", lesson: 16 },
  { id: 541, kana: "しめる", romaji: "shimeru", kanji: "閉める", accent: "②", pos: "动2", cn: "关上", lesson: 16 },
  { id: 542, kana: "たいへん", romaji: "taihen", kanji: "大変", accent: "⓪", pos: "形2", cn: "严重", lesson: 16 },
  { id: 543, kana: "おちる", romaji: "ochiru", kanji: "落ちる", accent: "②", pos: "动2", cn: "掉，落下", lesson: 16 },
  { id: 544, kana: "みつける", romaji: "mitsukeru", kanji: "見つける", accent: "⓪", pos: "动2", cn: "找到", lesson: 16 },
  { id: 545, kana: "きねん", romaji: "kinen", kanji: "記念", accent: "⓪", pos: "名", cn: "纪念", lesson: 16 },
  { id: 546, kana: "きゅうこう", romaji: "kyūkō", kanji: "急行", accent: "⓪", pos: "名", cn: "快车", lesson: 16 },
  { id: 547, kana: "のんびり", romaji: "nonbiri", kanji: "", accent: "③", pos: "副", cn: "悠闲地", lesson: 16 },
  { id: 548, kana: "まずい", romaji: "mazui", kanji: "", accent: "②", pos: "形1", cn: "难吃，糟糕", lesson: 16 },
  // 第17课
  { id: 549, kana: "もり", romaji: "mori", kanji: "森", accent: "⓪", pos: "专", cn: "森", lesson: 17 },
  { id: 550, kana: "しごと", romaji: "shigoto", kanji: "仕事", accent: "⓪", pos: "名", cn: "工作", lesson: 17 },
  { id: 551, kana: "やすみ", romaji: "yasumi", kanji: "休み", accent: "③", pos: "名", cn: "休息，假", lesson: 17 },
  { id: 552, kana: "やすむ", romaji: "yasumu", kanji: "休む", accent: "②", pos: "动1", cn: "休息", lesson: 17 },
  { id: 553, kana: "のむ", romaji: "nomu", kanji: "飲む", accent: "①", pos: "动1", cn: "喝", lesson: 17 },
  { id: 554, kana: "たべる", romaji: "taberu", kanji: "食べる", accent: "②", pos: "动2", cn: "吃", lesson: 17 },
  { id: 555, kana: "きる", romaji: "kiru", kanji: "着る", accent: "⓪", pos: "动2", cn: "穿（上衣）", lesson: 17 },
  { id: 556, kana: "はく", romaji: "haku", kanji: "", accent: "⓪", pos: "动1", cn: "穿（下身/鞋）", lesson: 17 },
  { id: 557, kana: "ぼうし", romaji: "bōshi", kanji: "帽子", accent: "⓪", pos: "名", cn: "帽子", lesson: 17 },
  { id: 558, kana: "めがね", romaji: "megane", kanji: "眼鏡", accent: "①", pos: "名", cn: "眼镜", lesson: 17 },
  { id: 559, kana: "ふく", romaji: "fuku", kanji: "服", accent: "②", pos: "名", cn: "衣服", lesson: 17 },
  { id: 560, kana: "スーツ", romaji: "sūtsu", kanji: "", accent: "①", pos: "名", cn: "西装", lesson: 17 },
  { id: 561, kana: "ズボン", romaji: "zubon", kanji: "", accent: "①", pos: "名", cn: "裤子", lesson: 17 },
  { id: 562, kana: "シャツ", romaji: "shatsu", kanji: "", accent: "①", pos: "名", cn: "衬衫", lesson: 17 },
  { id: 563, kana: "ネクタイ", romaji: "nekutai", kanji: "", accent: "①", pos: "名", cn: "领带", lesson: 17 },
  { id: 564, kana: "ハンカチ", romaji: "hankachi", kanji: "", accent: "⓪", pos: "名", cn: "手帕", lesson: 17 },
  { id: 565, kana: "とけい", romaji: "tokei", kanji: "時計", accent: "⓪", pos: "名", cn: "钟，表", lesson: 17 },
  { id: 566, kana: "もつ", romaji: "motsu", kanji: "持つ", accent: "①", pos: "动1", cn: "拿，带", lesson: 17 },
  { id: 567, kana: "とる", romaji: "toru", kanji: "撮る", accent: "①", pos: "动1", cn: "拍（照）", lesson: 17 },
  { id: 568, kana: "しゃしん", romaji: "shashin", kanji: "写真", accent: "⓪", pos: "名", cn: "照片", lesson: 17 },
  { id: 569, kana: "まいにち", romaji: "mainichi", kanji: "毎日", accent: "⓪", pos: "名", cn: "每天", lesson: 17 },
  { id: 570, kana: "まいしゅう", romaji: "maishū", kanji: "毎週", accent: "⓪", pos: "名", cn: "每周", lesson: 17 },
  { id: 571, kana: "まいとし", romaji: "maitoshi", kanji: "毎年", accent: "⓪", pos: "名", cn: "每年", lesson: 17 },
  { id: 572, kana: "あさ", romaji: "asa", kanji: "朝", accent: "①", pos: "名", cn: "早上", lesson: 17 },
  { id: 573, kana: "ばん", romaji: "ban", kanji: "晩", accent: "⓪", pos: "名", cn: "晚上", lesson: 17 },
  { id: 574, kana: "しゅうまつ", romaji: "shūmatsu", kanji: "週末", accent: "⓪", pos: "名", cn: "周末", lesson: 17 },
  { id: 575, kana: "びょうき", romaji: "byōki", kanji: "病気", accent: "⓪", pos: "名", cn: "病", lesson: 17 },
  { id: 576, kana: "よてい", romaji: "yotei", kanji: "予定", accent: "⓪", pos: "名", cn: "预定", lesson: 17 },
  { id: 577, kana: "たぶん", romaji: "tabun", kanji: "多分", accent: "①", pos: "副", cn: "大概", lesson: 17 },
  // 第18课
  { id: 578, kana: "べんきょう", romaji: "benkyō", kanji: "勉強", accent: "⓪", pos: "名", cn: "学习", lesson: 18 },
  { id: 579, kana: "べんきょうする", romaji: "benkyōsuru", kanji: "勉強する", accent: "⓪", pos: "动3", cn: "学习", lesson: 18 },
  { id: 580, kana: "おんがく", romaji: "ongaku", kanji: "音楽", accent: "①", pos: "名", cn: "音乐", lesson: 18 },
  { id: 581, kana: "うたう", romaji: "utau", kanji: "歌う", accent: "⓪", pos: "动1", cn: "唱", lesson: 18 },
  { id: 582, kana: "おどる", romaji: "odoru", kanji: "踊る", accent: "⓪", pos: "动1", cn: "跳舞", lesson: 18 },
  { id: 583, kana: "りょうり", romaji: "ryōri", kanji: "料理", accent: "①", pos: "名", cn: "料理", lesson: 18 },
  { id: 584, kana: "つくる", romaji: "tsukuru", kanji: "作る", accent: "②", pos: "动1", cn: "做", lesson: 18 },
  { id: 585, kana: "はしる", romaji: "hashiru", kanji: "走る", accent: "②", pos: "动1", cn: "跑", lesson: 18 },
  { id: 586, kana: "およぐ", romaji: "oyogu", kanji: "泳ぐ", accent: "②", pos: "动1", cn: "游泳", lesson: 18 },
  { id: 587, kana: "あそぶ", romaji: "asobu", kanji: "遊ぶ", accent: "⓪", pos: "动1", cn: "玩", lesson: 18 },
  { id: 588, kana: "うんどうする", romaji: "undōsuru", kanji: "運動する", accent: "⓪", pos: "动3", cn: "运动", lesson: 18 },
  { id: 589, kana: "かいぎ", romaji: "kaigi", kanji: "会議", accent: "①", pos: "名", cn: "会议", lesson: 18 },
  { id: 590, kana: "せつめい", romaji: "setsumei", kanji: "説明", accent: "⓪", pos: "名", cn: "说明", lesson: 18 },
  { id: 591, kana: "レポート", romaji: "repōto", kanji: "", accent: "⓪", pos: "名", cn: "报告", lesson: 18 },
  { id: 592, kana: "ろんぶん", romaji: "ronbun", kanji: "論文", accent: "⓪", pos: "名", cn: "论文", lesson: 18 },
  { id: 593, kana: "れんしゅう", romaji: "renshū", kanji: "練習", accent: "⓪", pos: "名", cn: "练习", lesson: 18 },
  { id: 594, kana: "れんしゅうする", romaji: "renshūsuru", kanji: "練習する", accent: "⓪", pos: "动3", cn: "练习", lesson: 18 },
  { id: 595, kana: "かぜ", romaji: "kaze", kanji: "風邪", accent: "⓪", pos: "名", cn: "感冒", lesson: 18 },
  { id: 596, kana: "ひく", romaji: "hiku", kanji: "引く", accent: "⓪", pos: "动1", cn: "患（感冒）", lesson: 18 },
  { id: 597, kana: "ねつ", romaji: "netsu", kanji: "熱", accent: "②", pos: "名", cn: "发烧", lesson: 18 },
  { id: 598, kana: "だいたい", romaji: "daitai", kanji: "大体", accent: "⓪", pos: "副", cn: "大致", lesson: 18 },
  { id: 599, kana: "なかなか", romaji: "nakanaka", kanji: "", accent: "⓪", pos: "副", cn: "相当", lesson: 18 },
  { id: 600, kana: "だんだん", romaji: "dandan", kanji: "段々", accent: "⓪", pos: "副", cn: "渐渐地", lesson: 18 },
  { id: 601, kana: "さんぽする", romaji: "sanposuru", kanji: "散歩する", accent: "①", pos: "动3", cn: "散步", lesson: 18 },
  { id: 602, kana: "そうじする", romaji: "sōjisuru", kanji: "掃除する", accent: "⓪", pos: "动3", cn: "打扫", lesson: 18 },
  // 第19课
  { id: 603, kana: "かってくる", romaji: "kattekuru", kanji: "買ってくる", accent: "⓪", pos: "短语", cn: "买来", lesson: 19 },
  { id: 604, kana: "もってくる", romaji: "mottekuru", kanji: "持ってくる", accent: "⓪", pos: "短语", cn: "带来", lesson: 19 },
  { id: 605, kana: "もっていく", romaji: "motteiku", kanji: "持っていく", accent: "⓪", pos: "短语", cn: "带去", lesson: 19 },
  { id: 606, kana: "とってくる", romaji: "tottekuru", kanji: "取ってくる", accent: "⓪", pos: "短语", cn: "拿来", lesson: 19 },
  { id: 607, kana: "つれてくる", romaji: "tsuretekuru", kanji: "連れてくる", accent: "⓪", pos: "短语", cn: "带来（人）", lesson: 19 },
  { id: 608, kana: "もってかえる", romaji: "mottekaeru", kanji: "持って帰る", accent: "⓪", pos: "短语", cn: "带回", lesson: 19 },
  { id: 609, kana: "おくる", romaji: "okuru", kanji: "送る", accent: "⓪", pos: "动1", cn: "送", lesson: 19 },
  { id: 610, kana: "とどける", romaji: "todokeru", kanji: "届ける", accent: "③", pos: "动2", cn: "送达", lesson: 19 },
  { id: 611, kana: "もどる", romaji: "modoru", kanji: "戻る", accent: "②", pos: "动1", cn: "返回", lesson: 19 },
  { id: 612, kana: "かえる", romaji: "kaeru", kanji: "帰る", accent: "①", pos: "动1", cn: "回去", lesson: 19 },
  { id: 613, kana: "あがる", romaji: "agaru", kanji: "上がる", accent: "⓪", pos: "动1", cn: "上去", lesson: 19 },
  { id: 614, kana: "さがる", romaji: "sagaru", kanji: "下がる", accent: "②", pos: "动1", cn: "下降", lesson: 19 },
  { id: 615, kana: "たつ", romaji: "tatsu", kanji: "立つ", accent: "①", pos: "动1", cn: "站", lesson: 19 },
  { id: 616, kana: "すわる", romaji: "suwaru", kanji: "座る", accent: "⓪", pos: "动1", cn: "坐", lesson: 19 },
  { id: 617, kana: "げんかん", romaji: "genkan", kanji: "玄関", accent: "①", pos: "名", cn: "玄关", lesson: 19 },
  { id: 618, kana: "うえ", romaji: "ue", kanji: "上", accent: "⓪", pos: "名", cn: "上", lesson: 19 },
  { id: 619, kana: "した", romaji: "shita", kanji: "下", accent: "⓪", pos: "名", cn: "下", lesson: 19 },
  { id: 620, kana: "なか", romaji: "naka", kanji: "中", accent: "①", pos: "名", cn: "里面", lesson: 19 },
  { id: 621, kana: "そと", romaji: "soto", kanji: "外", accent: "②", pos: "名", cn: "外面", lesson: 19 },
  { id: 622, kana: "まえ", romaji: "mae", kanji: "前", accent: "①", pos: "名", cn: "前面", lesson: 19 },
  { id: 623, kana: "うしろ", romaji: "ushiro", kanji: "後ろ", accent: "⓪", pos: "名", cn: "后面", lesson: 19 },
  { id: 624, kana: "よこ", romaji: "yoko", kanji: "横", accent: "⓪", pos: "名", cn: "旁边", lesson: 19 },
  { id: 625, kana: "となり", romaji: "tonari", kanji: "隣", accent: "⓪", pos: "名", cn: "邻居，旁边", lesson: 19 },
  { id: 626, kana: "ちかく", romaji: "chikaku", kanji: "近く", accent: "②", pos: "名", cn: "附近", lesson: 19 },
  { id: 627, kana: "とおく", romaji: "tōku", kanji: "遠く", accent: "⓪", pos: "名", cn: "远处", lesson: 19 },
  { id: 628, kana: "あいだ", romaji: "aida", kanji: "間", accent: "⓪", pos: "名", cn: "之间", lesson: 19 },
  { id: 629, kana: "スープ", romaji: "sūpu", kanji: "", accent: "①", pos: "名", cn: "汤", lesson: 19 },
  // 第20课
  { id: 630, kana: "もうすぐ", romaji: "mōsugu", kanji: "", accent: "③", pos: "副", cn: "马上", lesson: 20 },
  { id: 631, kana: "たぶん", romaji: "tabun", kanji: "多分", accent: "①", pos: "副", cn: "大概", lesson: 20 },
  { id: 632, kana: "きっと", romaji: "kitto", kanji: "", accent: "⓪", pos: "副", cn: "一定", lesson: 20 },
  { id: 633, kana: "ほんとうに", romaji: "hontōni", kanji: "本当に", accent: "⓪", pos: "副", cn: "真的", lesson: 20 },
  { id: 634, kana: "あまり", romaji: "amari", kanji: "余り", accent: "⓪", pos: "副", cn: "不太", lesson: 20 },
  { id: 635, kana: "たくさん", romaji: "takusan", kanji: "沢山", accent: "③", pos: "副", cn: "很多", lesson: 20 },
  { id: 636, kana: "だいぶ", romaji: "daibu", kanji: "大分", accent: "⓪", pos: "副", cn: "颇，相当", lesson: 20 },
  { id: 637, kana: "あつい", romaji: "atsui", kanji: "暑い", accent: "②", pos: "形1", cn: "热（天气）", lesson: 20 },
  { id: 638, kana: "さむい", romaji: "samui", kanji: "寒い", accent: "②", pos: "形1", cn: "冷（天气）", lesson: 20 },
  { id: 639, kana: "あたたかい", romaji: "atatakai", kanji: "暖かい", accent: "④", pos: "形1", cn: "暖和", lesson: 20 },
  { id: 640, kana: "すずしい", romaji: "suzushī", kanji: "涼しい", accent: "③", pos: "形1", cn: "凉爽", lesson: 20 },
  { id: 641, kana: "ひろい", romaji: "hiroi", kanji: "広い", accent: "②", pos: "形1", cn: "宽广", lesson: 20 },
  { id: 642, kana: "せまい", romaji: "semai", kanji: "狭い", accent: "②", pos: "形1", cn: "狭窄", lesson: 20 },
  { id: 643, kana: "あかるい", romaji: "akarui", kanji: "明るい", accent: "③", pos: "形1", cn: "明亮", lesson: 20 },
  { id: 644, kana: "くらい", romaji: "kurai", kanji: "暗い", accent: "②", pos: "形1", cn: "暗", lesson: 20 },
  { id: 645, kana: "たかい", romaji: "takai", kanji: "高い", accent: "②", pos: "形1", cn: "高，贵", lesson: 20 },
  { id: 646, kana: "ひくい", romaji: "hikui", kanji: "低い", accent: "②", pos: "形1", cn: "低", lesson: 20 },
  { id: 647, kana: "やすい", romaji: "yasui", kanji: "安い", accent: "②", pos: "形1", cn: "便宜", lesson: 20 },
  { id: 648, kana: "あたらしい", romaji: "atarashī", kanji: "新しい", accent: "④", pos: "形1", cn: "新", lesson: 20 },
  { id: 649, kana: "ふるい", romaji: "furui", kanji: "古い", accent: "②", pos: "形1", cn: "旧", lesson: 20 },
  // 第21课
  { id: 650, kana: "すきやき", romaji: "sukiyaki", kanji: "すき焼き", accent: "⓪", pos: "名", cn: "日式牛肉火锅", lesson: 21 },
  { id: 651, kana: "けいけん", romaji: "keiken", kanji: "経験", accent: "⓪", pos: "名", cn: "经验", lesson: 21 },
  { id: 652, kana: "おととし", romaji: "ototoshi", kanji: "一昨年", accent: "③", pos: "名", cn: "前年", lesson: 21 },
  { id: 653, kana: "かんこく", romaji: "kankoku", kanji: "韓国", accent: "①", pos: "专", cn: "韩国", lesson: 21 },
  { id: 654, kana: "たいわん", romaji: "taiwan", kanji: "台湾", accent: "③", pos: "专", cn: "台湾", lesson: 21 },
  { id: 655, kana: "スイス", romaji: "suisu", kanji: "", accent: "①", pos: "专", cn: "瑞士", lesson: 21 },
  { id: 656, kana: "イタリア", romaji: "itaria", kanji: "", accent: "⓪", pos: "专", cn: "意大利", lesson: 21 },
  { id: 657, kana: "いけ", romaji: "ike", kanji: "池", accent: "②", pos: "名", cn: "池子", lesson: 21 },
  { id: 658, kana: "みなと", romaji: "minato", kanji: "港", accent: "⓪", pos: "名", cn: "港口", lesson: 21 },
  { id: 659, kana: "せんろ", romaji: "senro", kanji: "線路", accent: "①", pos: "名", cn: "铁轨", lesson: 21 },
  { id: 660, kana: "うんてん", romaji: "unten", kanji: "運転", accent: "⓪", pos: "名", cn: "驾驶", lesson: 21 },
  { id: 661, kana: "けが", romaji: "kega", kanji: "怪我", accent: "②", pos: "名", cn: "伤", lesson: 21 },
  { id: 662, kana: "まっすぐ", romaji: "massugu", kanji: "真っ直ぐ", accent: "③", pos: "副", cn: "一直", lesson: 21 },
  { id: 663, kana: "はなみ", romaji: "hanami", kanji: "花見", accent: "③", pos: "名", cn: "赏花", lesson: 21 },
  { id: 664, kana: "やります", romaji: "yarimasu", kanji: "", accent: "③", pos: "动1", cn: "做", lesson: 21 },
  { id: 665, kana: "あるきます", romaji: "arukimasu", kanji: "歩きます", accent: "③", pos: "动1", cn: "走路", lesson: 21 },
  { id: 666, kana: "みせます", romaji: "misemasu", kanji: "見せます", accent: "③", pos: "动2", cn: "给…看", lesson: 21 },
  { id: 667, kana: "おしえます", romaji: "oshiemasu", kanji: "教えます", accent: "④", pos: "动2", cn: "教", lesson: 21 },
  { id: 668, kana: "ならいます", romaji: "naraimasu", kanji: "習います", accent: "④", pos: "动1", cn: "学习", lesson: 21 },
  { id: 669, kana: "つくります", romaji: "tsukurimasu", kanji: "作ります", accent: "③", pos: "动1", cn: "制作", lesson: 21 },
  // 第22课
  { id: 670, kana: "せいかつ", romaji: "seikatsu", kanji: "生活", accent: "⓪", pos: "名", cn: "生活", lesson: 22 },
  { id: 671, kana: "べんり", romaji: "benri", kanji: "便利", accent: "①", pos: "形2", cn: "方便", lesson: 22 },
  { id: 672, kana: "ふべん", romaji: "fuben", kanji: "不便", accent: "①", pos: "形2", cn: "不便", lesson: 22 },
  { id: 673, kana: "こうつう", romaji: "kōtsū", kanji: "交通", accent: "⓪", pos: "名", cn: "交通", lesson: 22 },
  { id: 674, kana: "まわり", romaji: "mawari", kanji: "周り", accent: "⓪", pos: "名", cn: "周围", lesson: 22 },
  { id: 675, kana: "しずか", romaji: "shizuka", kanji: "静か", accent: "①", pos: "形2", cn: "安静", lesson: 22 },
  { id: 676, kana: "にぎやか", romaji: "nigiyaka", kanji: "賑やか", accent: "②", pos: "形2", cn: "热闹", lesson: 22 },
  { id: 677, kana: "あんぜん", romaji: "anzen", kanji: "安全", accent: "⓪", pos: "形2", cn: "安全", lesson: 22 },
  { id: 678, kana: "きけん", romaji: "kiken", kanji: "危険", accent: "⓪", pos: "形2", cn: "危险", lesson: 22 },
  { id: 679, kana: "ひるま", romaji: "hiruma", kanji: "昼間", accent: "③", pos: "名", cn: "白天", lesson: 22 },
  { id: 680, kana: "あかるい", romaji: "akarui", kanji: "明るい", accent: "③", pos: "形1", cn: "明亮", lesson: 22 },
  { id: 681, kana: "くらい", romaji: "kurai", kanji: "暗い", accent: "②", pos: "形1", cn: "暗", lesson: 22 },
  { id: 682, kana: "きたない", romaji: "kitanai", kanji: "汚い", accent: "③", pos: "形1", cn: "脏", lesson: 22 },
  { id: 683, kana: "ねだん", romaji: "nedan", kanji: "値段", accent: "⓪", pos: "名", cn: "价格", lesson: 22 },
  { id: 684, kana: "すむ", romaji: "sumu", kanji: "住む", accent: "①", pos: "动1", cn: "居住", lesson: 22 },
  { id: 685, kana: "はたらきます", romaji: "hatarakimasu", kanji: "働きます", accent: "④", pos: "动1", cn: "工作", lesson: 22 },
  { id: 686, kana: "しんぱい", romaji: "shinpai", kanji: "心配", accent: "⓪", pos: "形2", cn: "担心", lesson: 22 },
  { id: 687, kana: "そんなに", romaji: "sonnani", kanji: "", accent: "⓪", pos: "副", cn: "那么", lesson: 22 },
  { id: 688, kana: "たてもの", romaji: "tatemono", kanji: "建物", accent: "②", pos: "名", cn: "建筑物", lesson: 22 },
  // 第23课
  { id: 689, kana: "よやく", romaji: "yoyaku", kanji: "予約", accent: "⓪", pos: "名", cn: "预约", lesson: 23 },
  { id: 690, kana: "てがみ", romaji: "tegami", kanji: "手紙", accent: "⓪", pos: "名", cn: "信", lesson: 23 },
  { id: 691, kana: "そうだん", romaji: "sōdan", kanji: "相談", accent: "⓪", pos: "名", cn: "商量", lesson: 23 },
  { id: 692, kana: "れんらく", romaji: "renraku", kanji: "連絡", accent: "⓪", pos: "名", cn: "联系", lesson: 23 },
  { id: 693, kana: "れんしゅう", romaji: "renshū", kanji: "練習", accent: "⓪", pos: "名", cn: "练习", lesson: 23 },
  { id: 694, kana: "しけん", romaji: "shiken", kanji: "試験", accent: "①", pos: "名", cn: "考试", lesson: 23 },
  { id: 695, kana: "しゅくだい", romaji: "shukudai", kanji: "宿題", accent: "⓪", pos: "名", cn: "作业", lesson: 23 },
  { id: 696, kana: "せんぱい", romaji: "senpai", kanji: "先輩", accent: "⓪", pos: "名", cn: "前辈", lesson: 23 },
  { id: 697, kana: "しんゆう", romaji: "shinyū", kanji: "親友", accent: "⓪", pos: "名", cn: "好朋友", lesson: 23 },
  { id: 698, kana: "おとうと", romaji: "otōto", kanji: "弟", accent: "④", pos: "名", cn: "弟弟", lesson: 23 },
  { id: 699, kana: "いもうと", romaji: "imōto", kanji: "妹", accent: "④", pos: "名", cn: "妹妹", lesson: 23 },
  { id: 700, kana: "あに", romaji: "ani", kanji: "兄", accent: "①", pos: "名", cn: "哥哥", lesson: 23 },
  { id: 701, kana: "あね", romaji: "ane", kanji: "姉", accent: "①", pos: "名", cn: "姐姐", lesson: 23 },
  { id: 702, kana: "おとうさん", romaji: "otōsan", kanji: "お父さん", accent: "②", pos: "名", cn: "父亲", lesson: 23 },
  { id: 703, kana: "おかあさん", romaji: "okāsan", kanji: "お母さん", accent: "②", pos: "名", cn: "母亲", lesson: 23 },
  { id: 704, kana: "おっと", romaji: "otto", kanji: "夫", accent: "①", pos: "名", cn: "丈夫", lesson: 23 },
  { id: 705, kana: "つま", romaji: "tsuma", kanji: "妻", accent: "①", pos: "名", cn: "妻子", lesson: 23 },
  { id: 706, kana: "むすこ", romaji: "musuko", kanji: "息子", accent: "⓪", pos: "名", cn: "儿子", lesson: 23 },
  { id: 707, kana: "むすめ", romaji: "musume", kanji: "娘", accent: "①", pos: "名", cn: "女儿", lesson: 23 },
  { id: 708, kana: "りょうしん", romaji: "ryōshin", kanji: "両親", accent: "①", pos: "名", cn: "父母", lesson: 23 },
  { id: 709, kana: "きょうだい", romaji: "kyōdai", kanji: "兄弟", accent: "①", pos: "名", cn: "兄弟姐妹", lesson: 23 },
  { id: 710, kana: "しゅじゅつ", romaji: "shujutsu", kanji: "手術", accent: "①", pos: "名", cn: "手术", lesson: 23 },
  { id: 711, kana: "せわ", romaji: "sewa", kanji: "世話", accent: "②", pos: "名", cn: "照顾", lesson: 23 },
  { id: 712, kana: "てつだいます", romaji: "tetsudaimasu", kanji: "手伝います", accent: "④", pos: "动1", cn: "帮忙", lesson: 23 },
  { id: 713, kana: "さがします", romaji: "sagashimasu", kanji: "探します", accent: "④", pos: "动1", cn: "寻找", lesson: 23 },
  { id: 714, kana: "かします", romaji: "kashimasu", kanji: "貸します", accent: "③", pos: "动1", cn: "借出", lesson: 23 },
  { id: 715, kana: "かります", romaji: "karimasu", kanji: "借ります", accent: "③", pos: "动2", cn: "借入", lesson: 23 },
  { id: 716, kana: "もらいます", romaji: "moraimasu", kanji: "貰います", accent: "③", pos: "动1", cn: "得到", lesson: 23 },
  { id: 717, kana: "あげます", romaji: "agemasu", kanji: "上げます", accent: "⓪", pos: "动2", cn: "给", lesson: 23 },
  // 第24课
  { id: 718, kana: "もうすぐ", romaji: "mōsugu", kanji: "", accent: "③", pos: "副", cn: "马上", lesson: 24 },
  { id: 719, kana: "きょう", romaji: "kyō", kanji: "今日", accent: "①", pos: "名", cn: "今天", lesson: 24 },
  { id: 720, kana: "あした", romaji: "ashita", kanji: "明日", accent: "③", pos: "名", cn: "明天", lesson: 24 },
  { id: 721, kana: "あさって", romaji: "asatte", kanji: "明後日", accent: "②", pos: "名", cn: "后天", lesson: 24 },
  { id: 722, kana: "きのう", romaji: "kinō", kanji: "昨日", accent: "②", pos: "名", cn: "昨天", lesson: 24 },
  { id: 723, kana: "おととい", romaji: "ototoi", kanji: "一昨日", accent: "③", pos: "名", cn: "前天", lesson: 24 },
  { id: 724, kana: "せんしゅう", romaji: "senshū", kanji: "先週", accent: "⓪", pos: "名", cn: "上周", lesson: 24 },
  { id: 725, kana: "こんしゅう", romaji: "konshū", kanji: "今週", accent: "⓪", pos: "名", cn: "本周", lesson: 24 },
  { id: 726, kana: "らいしゅう", romaji: "raishū", kanji: "来週", accent: "⓪", pos: "名", cn: "下周", lesson: 24 },
  { id: 727, kana: "せんげつ", romaji: "sengetsu", kanji: "先月", accent: "①", pos: "名", cn: "上个月", lesson: 24 },
  { id: 728, kana: "こんげつ", romaji: "kongetsu", kanji: "今月", accent: "⓪", pos: "名", cn: "这个月", lesson: 24 },
  { id: 729, kana: "らいげつ", romaji: "raigetsu", kanji: "来月", accent: "⓪", pos: "名", cn: "下个月", lesson: 24 },
  { id: 730, kana: "きょねん", romaji: "kyonen", kanji: "去年", accent: "①", pos: "名", cn: "去年", lesson: 24 },
  { id: 731, kana: "ことし", romaji: "kotoshi", kanji: "今年", accent: "⓪", pos: "名", cn: "今年", lesson: 24 },
  { id: 732, kana: "らいねん", romaji: "rainen", kanji: "来年", accent: "⓪", pos: "名", cn: "明年", lesson: 24 },
  { id: 733, kana: "おととし", romaji: "ototoshi", kanji: "一昨年", accent: "③", pos: "名", cn: "前年", lesson: 24 },
  { id: 734, kana: "てんき", romaji: "tenki", kanji: "天気", accent: "①", pos: "名", cn: "天气", lesson: 24 },
  { id: 735, kana: "よてい", romaji: "yotei", kanji: "予定", accent: "⓪", pos: "名", cn: "预定", lesson: 24 },
  { id: 736, kana: "たいいん", romaji: "taiin", kanji: "退院", accent: "⓪", pos: "名", cn: "出院", lesson: 24 },
  { id: 737, kana: "しけん", romaji: "shiken", kanji: "試験", accent: "①", pos: "名", cn: "考试", lesson: 24 },
  { id: 738, kana: "てつだいます", romaji: "tetsudaimasu", kanji: "手伝います", accent: "④", pos: "动1", cn: "帮忙", lesson: 24 },
  { id: 739, kana: "あんない", romaji: "annai", kanji: "案内", accent: "③", pos: "名", cn: "向导，指南", lesson: 24 },
  { id: 740, kana: "おくります", romaji: "okurimasu", kanji: "送ります", accent: "④", pos: "动1", cn: "送，寄", lesson: 24 },
  { id: 741, kana: "むかえます", romaji: "mukaemasu", kanji: "迎えます", accent: "④", pos: "动2", cn: "迎接", lesson: 24 },
  { id: 742, kana: "よびます", romaji: "yobimasu", kanji: "呼びます", accent: "③", pos: "动1", cn: "叫，呼唤", lesson: 24 },
  { id: 743, kana: "おこします", romaji: "okoshimasu", kanji: "起こします", accent: "④", pos: "动1", cn: "叫醒", lesson: 24 },
  { id: 744, kana: "おきます", romaji: "okimasu", kanji: "起きます", accent: "②", pos: "动2", cn: "起床", lesson: 24 },
  { id: 745, kana: "ねます", romaji: "nemasu", kanji: "寝ます", accent: "②", pos: "动2", cn: "睡觉", lesson: 24 },
  { id: 746, kana: "そうじします", romaji: "sōjishimasu", kanji: "掃除します", accent: "①", pos: "动3", cn: "打扫", lesson: 24 },
  { id: 747, kana: "せんたくします", romaji: "sentakushimasu", kanji: "洗濯します", accent: "①", pos: "动3", cn: "洗衣服", lesson: 24 },
  { id: 748, kana: "れんらくします", romaji: "renrakushimasu", kanji: "連絡します", accent: "①", pos: "动3", cn: "联系", lesson: 24 },
  { id: 749, kana: "そうだんします", romaji: "sōdanshimasu", kanji: "相談します", accent: "①", pos: "动3", cn: "商量", lesson: 24 },
  { id: 750, kana: "きって", romaji: "kitte", kanji: "切手", accent: "⓪", pos: "名", cn: "邮票", lesson: 24 },
  { id: 751, kana: "はがき", romaji: "hagaki", kanji: "葉書", accent: "⓪", pos: "名", cn: "明信片", lesson: 24 },
  { id: 752, kana: "ふるびん", romaji: "furubin", kanji: "古びん", accent: "⓪", pos: "名", cn: "旧瓶", lesson: 24 },
  { id: 753, kana: "はいたつ", romaji: "haitatsu", kanji: "配達", accent: "⓪", pos: "名", cn: "配送", lesson: 24 },
  { id: 754, kana: "そつぎょう", romaji: "sotsugyō", kanji: "卒業", accent: "⓪", pos: "名", cn: "毕业", lesson: 24 },
  { id: 755, kana: "かんげいかい", romaji: "kangeikai", kanji: "歓迎会", accent: "③", pos: "名", cn: "欢迎会", lesson: 24 },
  { id: 756, kana: "おいわい", romaji: "oiwai", kanji: "お祝い", accent: "⓪", pos: "名", cn: "祝贺", lesson: 24 },
  { id: 757, kana: "おみまい", romaji: "omimai", kanji: "お見舞い", accent: "⓪", pos: "名", cn: "探望", lesson: 24 },
  { id: 758, kana: "しけん", romaji: "shiken", kanji: "試験", accent: "①", pos: "名", cn: "考试", lesson: 24 },
  { id: 759, kana: "やくにたちます", romaji: "yaku ni tachimasu", kanji: "役に立ちます", accent: "⑤", pos: "短语", cn: "起作用，有帮助", lesson: 24 },
  { id: 760, kana: "だいじょうぶです", romaji: "daijōbu desu", kanji: "大丈夫です", accent: "⑤", pos: "短语", cn: "没关系", lesson: 24 },
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
  return "/audio/words/" + encodeURIComponent(item.kana) + ".mp3";
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
