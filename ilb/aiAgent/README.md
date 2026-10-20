# AI Agent (كلمة تفعيل "كينج")

## الملفات
- `llm/wakeWord.js` — كشف كلمة التفعيل ("كينج"/"كنج"/"king") أو الرد (quoted).
- `llm/providers.js` — قايمة مزودي الذكاء الاصطناعي بالترتيب (Groq ثم Pollinations.ai)، وبتاخد المفتاح من `.env` تلقائيًا.
- `llm/botTools.js` — تعريف الأدوات (صيغة OpenAI-compatible tool calling، شغالة مع كل المزودين) + system instruction.
- `llm/executionMap.js` — التنفيذ الحقيقي، كل دالة موثّقة بمصدرها من `plugins/` الأصلية.
- `llm/format.js` — كروت الرد. رسائل النجاح بتتولد فقط بعد نجاح تنفيذ حقيقي.
- `llm/runAgent.js` — الأوركستريتور الرئيسي لوكيل "كينج" (function calling)، بيتنادى من `handler.js`.
- `llm/simpleChat.js` — نداء نصي بسيط (من غير tools) بنفس نظام الـ Fallback، بيستخدمه `plugins/ai/بوت.js` و`plugins/_autorespond.js`.
- `security.js` — فحص الصلاحيات (أدمن/أونر/البوت أدمن) قبل أي تنفيذ.
- `contextResolver.js` — تحديد العضو المقصود (منشن/رد/رقم).

## الإعداد
1. `cp .env.example .env`
2. املأ `GROQ_API_KEY` (من https://console.groq.com/keys — مجاني) — ده المزوّد الأساسي.
3. (اختياري) املأ `POLLINATIONS_API_KEY` (من https://enter.pollinations.ai — مجاني) — بيتستخدم بس لو Groq وصل لحده اليومي.
4. `npm install` (المكتبة المستخدمة هي `openai` الموجودة أصلاً في `package.json`، لأن Groq وPollinations كلاهما متوافق مع صيغة OpenAI)
5. شغّل البوت عادي: `npm start`

## إزاي نظام الـ Fallback شغال
لو Groq رجّع خطأ "نفدت الكوتة" (429) أو ازدحام مؤقت (500/502/503)،
`runAgent.js` و`simpleChat.js` بينتقلوا تلقائيًا لـ Pollinations.ai (لو مفتاحه
متظبط) من غير ما البوت يوقف أو يرد بفشل. لو الاتنين مش متاحين، بترجع رسالة
واضحة للمستخدم بدل ما البوت يعلّق.

لإضافة مزوّد تالت: ضيفه في `llm/providers.js` بنفس الشكل
(`name`, `envKey`, `baseURL`, `model`) وحط مفتاحه في `.env` — مفيش أي تعديل
تاني مطلوب، لأن `runAgent.js` و`simpleChat.js` بيقروا القايمة دي تلقائيًا.

## قاعدة التصميم
الموديل بيقترح الأداة والـ arguments بس. أي رسالة "تم بنجاح" بتتولد
من كود سيرفر-سايد فقط، وبعد ما نداء Baileys حقيقي (`conn.groupUpdateSubject`،
`conn.groupParticipantsUpdate`، إلخ) ينفذ وينجح فعليًا. لو الطلب مفيهوش أداة
حقيقية، الموديل بيرد بصراحة إنه مش متاح — البوت مبيدّعيش إنه نفذ حاجة ماتنفذتش.

## إضافة أداة جديدة
1. دوّر في `plugins/` على النداء الحقيقي المطابق (متخترعش نداء جديد).
2. ضيف الأداة في `llm/botTools.js` (بصيغة `{ type: "function", function: {...} }`).
3. ضيف التنفيذ الحقيقي في `llm/executionMap.js`.
4. ضيف القالب في `llm/format.js` (success case).
5. لو محتاجة صلاحية أدمن/أونر، ضيفها في `ADMIN_TOOLS`/`OWNER_ONLY_TOOLS` في `security.js`.

## مثال جاهز وموجود بالفعل
النظام ده مش مقصور على "قفل/فتح" بس. أداة `moderateMember` بتغطي
`kick` / `promote` / `demote` كمان، يعني أوامر زي:
- "كينج اقفل بار" → `manageGroup(action: "lock")`
- "كينج افتح بار" → `manageGroup(action: "unlock")`
- "كينج ارفعوا مشرف" (مع منشن/رد على العضو) → `moderateMember(action: "promote")`
- "كينج نزّل [فلان] من الإشراف" → `moderateMember(action: "demote")`
- "كينج اطرد [فلان]" → `moderateMember(action: "kick")`

كل واحدة فيهم بتعدي على نفس فحص الصلاحيات في `security.js` (لازم يكون
الطالب أدمن/أونر، والبوت نفسه أدمن في المجموعة) قبل ما تتنفذ فعليًا.
