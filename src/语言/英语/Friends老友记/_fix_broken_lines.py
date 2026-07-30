# -*- coding: utf-8 -*-
"""修复 S01E17 / S01E22 转录损坏段落:
- 英文/西文台词行补回 **Name:** 格式与拉丁变音符
- 伪装成台词的中文行改为 > 引用翻译行
"""
from pathlib import Path

E17 = [
    ("Ross Geller: Aqui est�. (Here it is!)",
     "**Ross Geller:** Aquí está. (Here it is!)"),
    ("**罗斯·盖勒:** 阿奎伊斯特�. （在这里！）",
     "> 阿奎伊斯特。（在这里！）"),
    ("Monica Geller: �A qui�n pidio el pollo General Tso? (Who ordered General Sal's chicken?)",
     "**Monica Geller:** ¿A quién pidió el pollo General Tso? (Who ordered General Sal's chicken?)"),
    ("**莫妮卡·盖勒:** �魁�n皮迪奥·埃尔·波洛将军？（谁点了萨尔将军的鸡？）",
     "> 奎恩皮迪奥·埃尔·波洛将军？（谁点了萨尔将军的鸡？）"),
    ("Chandler Bing: �Pudo aver sido General Tso! (It could've been General Sal!)",
     "**Chandler Bing:** ¿Pudo haber sido General Tso! (It could've been General Sal!)"),
    ("**钱德勒·宾:** �普多阿弗西多将军曹！（可能是萨尔将军！）",
     "> 普多阿弗西多将军曹！（可能是萨尔将军！）"),
    ("Rachel Green: �Mira, mira, el viejo desnudo est� haciendo el hula hoop! (Look, look, Ugly Naked Guy is doing the hula!)",
     "**Rachel Green:** ¡Mira, mira, el viejo desnudo está haciendo el hula hoop! (Look, look, Ugly Naked Guy is doing the hula!)"),
    ("**瑞秋·格林:** �米拉，米拉，艾尔维乔·德斯努多东部� 哈西恩多呼啦圈！（看，看，丑陋的裸男正在跳草裙舞！）",
     "> 米拉，米拉，艾尔维乔·德斯努多东部·哈西恩多呼啦圈！（看，看，丑陋的裸男正在跳草裙舞！）"),
    ("All:�Ewww! (Ewww!)",
     "**All:** ¡Ewww! (Ewww!)"),
    ("全部：�哇！（www！）",
     "> 全部：哇！(www!)"),
    ("All: �Hola, Joey! (Hi, Joey!)",
     "**All:** ¡Hola, Joey! (Hi, Joey!)"),
    ("全部：�你好，乔伊！（嗨，乔伊！）",
     "> 全部：你好，乔伊！（嗨，乔伊！）"),
    ("Joey Tribbiani: �Hola, amigos! (Hey, everybody!)",
     "**Joey Tribbiani:** ¡Hola, amigos! (Hey, everybody!)"),
    ("**乔伊·崔比安尼:** �你好，朋友！（大家好！）",
     "> 你好，朋友！（大家好！）"),
    ("Ross Geller: �Lo que sucedio es que no le gusta la tele! (The thing is, he doesn`t like the program!)",
     "**Ross Geller:** ¡Lo que sucedió es que no le gusta la tele! (The thing is, he doesn't like the program!)"),
    ("**罗斯·盖勒:** �你不想在电视上看到我！（问题是，他不喜欢这个节目！）",
     "> 你不想在电视上看到我！（问题是，他不喜欢这个节目！）"),
]

E22 = [
    ("Ross Geller: (on phone) Yeah, hi, I was just beeped. (pause) No, Andr� is not here. (to Joey) Third time today. (on phone) Yes, I'm sure... No, sir. I don't perform those kind of services.",
     "**Ross Geller:** (on phone) Yeah, hi, I was just beeped. (pause) No, André is not here. (to Joey) Third time today. (on phone) Yes, I'm sure... No, sir. I don't perform those kind of services."),
    ("**罗斯·盖勒:** （在电话上）是的，嗨，刚才有人叫我。（停顿）不，安德烈� 他不在这里。（对乔伊）今天第三次了。（在电话里）是的，我肯定……不，先生。我不提供那种服务。",
     "> （在电话上）是的，嗨，刚才有人叫我。（停顿）不，安德烈，他不在这里。（对乔伊）今天第三次了。（在电话里）是的，我肯定……不，先生。我不提供那种服务。"),
    ("Ross Geller: (on phone) Okay, Andr� should be there in like 45 minutes. All rightie, bye bye. (to Phoebe) Just easier that way.",
     "**Ross Geller:** (on phone) Okay, André should be there in like 45 minutes. All rightie, bye bye. (to Phoebe) Just easier that way."),
    ("**罗斯·盖勒:** （打电话）好的，安德烈� 大概45分钟后到。好的，再见。（对菲比）那样更容易。",
     "> （打电话）好的，安德烈，大概45分钟后到。好的，再见。（对菲比）那样更容易。"),
    ("Joey Tribbiani: What about Andr�?",
     "**Joey Tribbiani:** What about André?"),
    ("**乔伊·崔比安尼:** 安德烈呢�?",
     "> 安德烈呢？"),
]


def apply(md: Path, pairs: list[tuple[str, str]]) -> None:
    text = md.read_text(encoding="utf-8")
    for old, new in pairs:
        if old not in text:
            print(f"MISS in {md.name}: {old[:50]!r}")
        text = text.replace(old, new, 1)
    md.write_text(text, encoding="utf-8")
    print(f"{md.name}: {len(pairs)} fixes applied")


base = Path(__file__).resolve().parent / "S01"
apply(base / "S01E17.md", E17)
apply(base / "S01E22.md", E22)
