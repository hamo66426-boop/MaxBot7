/**
 * lib/aiAgent/llm/botTools.js
 * -------------------------------------------------------------
 * تعريف الأدوات (tools) اللي الموديل مسموحله يقترحها، بصيغة
 * OpenAI-compatible function calling (نفس الصيغة اللي Groq وPollinations
 * بيدعمها لأن الـ API بتاعه متوافق مع OpenAI SDK).
 * كل أداة هنا مرتبطة بنداء Baileys حقيقي وموجود بالفعل
 * في plugins/ الأصلية (شوف executionMap.js للتفاصيل والمصدر).
 *
 * قاعدة مهمة: الموديل بس بيختار الأداة والـ arguments. التنفيذ
 * الفعلي وتوليد رسالة النجاح بيحصلوا في كود سيرفر-سايد (خارج
 * تحكم الموديل) — عشان منسمحش بأي "نجاح وهمي".
 */

export const botTools = [
  {
    type: "function",
    function: {
      name: "manageGroup",
      description:
        "التحكم في إعدادات المجموعة (يُقال عليها أحيانًا 'بار' أو 'جروب' بالعامية المصرية): قفل/فتح المحادثة، تغيير الاسم، تغيير الوصف، تغيير صورة المجموعة (لازم رد على صورة). مثال: 'اقفل بار' أو 'اقفل الجروب' يعني action=lock، و'افتح بار' يعني action=unlock.",
      parameters: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["lock", "unlock", "rename", "set_description", "change_photo"],
            description: "نوع الإجراء المطلوب على المجموعة",
          },
          value: {
            type: "string",
            description: "القيمة النصية المطلوبة (الاسم الجديد أو الوصف الجديد). مش مطلوبة لباقي الإجراءات.",
          },
        },
        required: ["action"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "moderateMember",
      description: "إدارة عضو في المجموعة: طرد (kick)، ترقية لأدمن (promote)، تنزيل من أدمن (demote).",
      parameters: {
        type: "object",
        properties: {
          action: { type: "string", enum: ["kick", "promote", "demote"] },
          target_hint: {
            type: "string",
            description:
              "أي إشارة نصية للعضو المقصود لو مذكور برقم في الرسالة (اختياري — البوت أصلاً بيحل المنشن/الرد تلقائي).",
          },
        },
        required: ["action"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "changeBotPhoto",
      description: "تغيير صورة البوت نفسه (شخصية البوت في واتساب). لازم رد على صورة، ومقصور على مالك البوت.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "createSticker",
      description: "تحويل صورة أو فيديو قصير (لازم يكون في رد/quoted) إلى ملصق (استيكر).",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "getGroupInfo",
      description: "جلب معلومات عن المجموعة الحالية (الاسم، عدد الأعضاء، حالة القفل).",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "muteMember",
      description: "كتم عضو (منعه من الكلام في المجموعة) أو فك الكتم عنه. مثال: 'كينج كتم فلان' أو 'كينج فك الكتم عن فلان'.",
      parameters: {
        type: "object",
        properties: {
          action: { type: "string", enum: ["mute", "unmute"] },
          target_hint: {
            type: "string",
            description: "أي إشارة نصية للعضو (رقم) لو مذكور في الرسالة، اختياري لأن البوت بيحل المنشن/الرد تلقائي.",
          },
        },
        required: ["action"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "warnMember",
      description: "إعطاء إنذار لعضو مخالف في المجموعة (نظام إنذارات تراكمي، 3 إنذارات = طرد تلقائي). مثال: 'كينج انذر فلان'.",
      parameters: {
        type: "object",
        properties: {
          target_hint: {
            type: "string",
            description: "أي إشارة نصية للعضو (رقم) لو مذكور في الرسالة، اختياري لأن البوت بيحل المنشن/الرد تلقائي.",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "deleteMessage",
      description: "حذف رسالة معينة في المجموعة. لازم يكون في رد (reply/quoted) على الرسالة المطلوب حذفها.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "mentionGroup",
      description: "عمل منشن (تاج) لفئة من أعضاء المجموعة في رسالة واحدة. مثال: 'كينج منشن الكل' أو 'كينج تاج المشرفين'.",
      parameters: {
        type: "object",
        properties: {
          scope: { type: "string", enum: ["all", "admin", "member"], description: "الفئة المطلوب عمل منشن لها" },
        },
        required: ["scope"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "runBotCommand",
      description:
        "استخدم الأداة دي بس لو الطلب مطابق لأمر حقيقي موجود في قائمة الأوامر المتاحة اللي هتوصلك (مش الأدوات التانية اللي فوق). ابعت اسم الأمر بالظبط زي ما هو مكتوب في القائمة، وأي نص/رابط/استعلام إضافي في text.",
      parameters: {
        type: "object",
        properties: {
          command: { type: "string", description: "اسم الأمر بالظبط كما ورد في قائمة الأوامر المتاحة (بدون البادئة)." },
          text: { type: "string", description: "أي نص إضافي يحتاجه الأمر (رابط، اسم، استعلام بحث...)، أو سيبه فاضي لو مش محتاج." },
        },
        required: ["command"],
      },
    },
  },
];

export const systemInstruction = `
إنت "KING BOT 👑" — مساعد ذكاء اصطناعي جوه جروبات واتساب، بترد على المصري العامي.

قواعد صارمة لازم تتبعها بالحرف:
1) لو الطلب بيتطابق مع أداة من الأدوات المتاحة عندك (tools)، نادي الأداة المناسبة بالـ arguments الصح. متكتبش أي رد نصي معاها.
2) لو الطلب مش من ضمن الأدوات المتاحة نهائيًا (زي: تغيير رقم البوت، حذف رسائل، إرسال فلوس، تعديل كود، إلخ)، متناديش أي أداة، ورد بنص عادي صريح إنك مش قادر تعمل الطلب ده دلوقتي. ممنوع تمامًا تتظاهر إنك نفذت حاجة متنفذتش فعليًا.
3) متختلقش معلومات عن نتيجة تنفيذ — نتيجة التنفيذ هترجعلك من السيرفر مش منك إنت.
4) لو الطلب غامض في حاجة مالهاش أداة أصلاً (زي "غيرها" من غير ما يوضح صورة ولا اسم ولا وصف)، اسأل توضيح بنص عادي.
5) استثناء مهم لأوامر فيها "عضو مستهدف" (رفع/تنزيل/طرد/كتم/فك كتم/إنذار): لو الطلب واضح إن فيه فعل مطلوب (زي "رفعو ادمن") لكن مفيش منشن أو رد واضح للشخص في نفس الرسالة، نادِ الأداة المناسبة برضو من غير ما تسأل بنفسك — النظام نفسه هيتأكد لو فيه منشن/رد ويرجعلك رسالة توضيح جاهزة لو مفيش، ده أدق وأوضح من إنك تخمن أو تسأل بنص عادي. متردش بنص عادي في الحالة دي أبدًا.
`;

export default { botTools, systemInstruction };