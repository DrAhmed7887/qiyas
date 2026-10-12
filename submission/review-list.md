# Review list

**For Dr. Ahmed's clinical review before recording.**

Every parent-facing string in the app, English and Arabic side by side. Edit the wording in `web/src/i18n/en.json` and `ar.json` (same keys). The maths never changes with wording; only the text does.

Things to check clinically: no diagnosis labels, no invented timings ("soon", "today" are the only ones), the red-flag wording, and the "usual range" phrasing for each band.

## Bands (what the measurement shows)

| Key | English | العربية |
|---|---|---|
| `ind.wfa` | Weight for age | الوزن بالنسبة للعمر |
| `ind.wfa.q` | Is the weight usual for this age? | هل الوزن معتاد لهذا العمر؟ |
| `ind.lhfa` | Length or height for age | الطول بالنسبة للعمر |
| `ind.lhfa.q` | Is the length or height usual for this age? | هل الطول معتاد لهذا العمر؟ |
| `ind.wflh` | Weight for length or height | الوزن بالنسبة للطول |
| `ind.wflh.q` | Is the weight usual for this length or height? | هل الوزن معتاد لهذا الطول؟ |
| `band.severely_low` | Far below the usual range | أقل بكثير من المعتاد |
| `band.low` | Below the usual range | أقل من المعتاد |
| `band.normal` | In the usual range | ضمن المعتاد |
| `band.risk_overweight` | A little above the usual range | أعلى قليلاً من المعتاد |
| `band.overweight` | Above the usual range | أعلى من المعتاد |
| `band.obesity` | Far above the usual range | أعلى بكثير من المعتاد |
| `msg.wfa.severely_low` | Your child's weight is far below what is usual for this age. This can have many causes, and the measurement alone does not say why. A health worker can look at your child and explain. | وزن طفلك أقل بكثير من المعتاد لهذا العمر. قد تكون الأسباب كثيرة، والقياس وحده لا يبيّن السبب. يستطيع العامل الصحي فحص طفلك وتوضيح الأمر. |
| `msg.wfa.low` | Your child's weight is below what is usual for this age. Many children are measured here, and the measurement alone does not say why. Mention it to a health worker. | وزن طفلك أقل من المعتاد لهذا العمر. يوجد أطفال كثيرون عند هذا المستوى، والقياس وحده لا يبيّن السبب. اذكر ذلك لعامل صحي. |
| `msg.wfa.normal` | Your child's weight is in the usual range for this age. | وزن طفلك ضمن المعتاد لهذا العمر. |
| `msg.lhfa.severely_low` | Your child's length or height is far below what is usual for this age. This can have many causes, and the measurement alone does not say why. A health worker can look at your child and explain. | طول طفلك أقل بكثير من المعتاد لهذا العمر. قد تكون الأسباب كثيرة، والقياس وحده لا يبيّن السبب. يستطيع العامل الصحي فحص طفلك وتوضيح الأمر. |
| `msg.lhfa.low` | Your child's length or height is below what is usual for this age. Many children are measured here, and the measurement alone does not say why. Mention it to a health worker. | طول طفلك أقل من المعتاد لهذا العمر. يوجد أطفال كثيرون عند هذا المستوى، والقياس وحده لا يبيّن السبب. اذكر ذلك لعامل صحي. |
| `msg.lhfa.normal` | Your child's length or height is in the usual range for this age. | طول طفلك ضمن المعتاد لهذا العمر. |
| `msg.wflh.severely_low` | Your child's weight is far below what is usual for their length or height. This can have many causes, and the measurement alone does not say why. A health worker can look at your child and explain. | وزن طفلك أقل بكثير من المعتاد بالنسبة لطوله. قد تكون الأسباب كثيرة، والقياس وحده لا يبيّن السبب. يستطيع العامل الصحي فحص طفلك وتوضيح الأمر. |
| `msg.wflh.low` | Your child's weight is below what is usual for their length or height. Many children are measured here, and the measurement alone does not say why. Mention it to a health worker. | وزن طفلك أقل من المعتاد بالنسبة لطوله. يوجد أطفال كثيرون عند هذا المستوى، والقياس وحده لا يبيّن السبب. اذكر ذلك لعامل صحي. |
| `msg.wflh.normal` | Your child's weight is in the usual range for their length or height. | وزن طفلك ضمن المعتاد بالنسبة لطوله. |
| `msg.wflh.risk_overweight` | Your child's weight is a little above what is usual for their length or height. Many children are measured here. Mention it to a health worker at a regular visit. | وزن طفلك أعلى قليلاً من المعتاد بالنسبة لطوله. يوجد أطفال كثيرون عند هذا المستوى. اذكر ذلك لعامل صحي في إحدى الزيارات المعتادة. |
| `msg.wflh.overweight` | Your child's weight is above what is usual for their length or height. The measurement alone does not say why. Mention it to a health worker. | وزن طفلك أعلى من المعتاد بالنسبة لطوله. القياس وحده لا يبيّن السبب. اذكر ذلك لعامل صحي. |
| `msg.wflh.obesity` | Your child's weight is far above what is usual for their length or height. The measurement alone does not say why. A health worker can look at your child and explain. | وزن طفلك أعلى بكثير من المعتاد بالنسبة لطوله. القياس وحده لا يبيّن السبب. يستطيع العامل الصحي فحص طفلك وتوضيح الأمر. |

## Overall (what this means, when to see a health worker)

| Key | English | العربية |
|---|---|---|
| `meaning.title` | What this means | ماذا يعني ذلك |
| `see.title` | When to see a health worker | متى تراجع عاملاً صحياً |
| `meaning.urgent` | You answered yes to a warning sign. That matters more than the numbers shown above. | كانت الإجابة نعم عن علامة تحذيرية، وهذا أهم من الأرقام المعروضة أعلاه. |
| `see.urgent` | See a health worker today. | راجع عاملاً صحياً اليوم. |
| `meaning.see_soon` | At least one measurement is far from the usual range. The measurement alone does not say why. A health worker can look at your child and explain. | قياس واحد على الأقل بعيد عن المعتاد. القياس وحده لا يبيّن السبب. يستطيع العامل الصحي فحص طفلك وتوضيح الأمر. |
| `see.see_soon` | Please arrange to see a health worker soon. Ask them when to come back. | رتّب لمراجعة عامل صحي قريباً، واسأله متى تعود. |
| `meaning.check` | At least one measurement is a little outside the usual range. Many children are measured here. A health worker can follow your child's growth over time. | قياس واحد على الأقل خارج المعتاد قليلاً. يوجد أطفال كثيرون عند هذا المستوى. يستطيع العامل الصحي متابعة نمو طفلك مع الوقت. |
| `see.check` | Mention this to a health worker. Ask them when to come back. | اذكر ذلك لعامل صحي، واسأله متى تعود. |
| `meaning.routine` | The measurements are in the usual range for this age. | القياسات ضمن المعتاد لهذا العمر. |
| `see.routine` | Keep going to regular health visits. See a health worker any time you are worried or your child seems unwell. | واصل زيارات الرعاية الصحية المعتادة. راجع عاملاً صحياً في أي وقت تشعر فيه بالقلق أو يبدو طفلك مريضاً. |
| `meaning.routine_remeasure` | The numbers that could be checked are in the usual range, but at least one number looks unlikely. This result is not complete. | الأرقام التي أمكن فحصها ضمن المعتاد، لكن رقماً واحداً على الأقل يبدو غير محتمل. هذه النتيجة غير مكتملة. |
| `see.routine_remeasure` | Measure again. See a health worker any time you are worried or your child seems unwell. | أعد القياس. راجع عاملاً صحياً في أي وقت تشعر فيه بالقلق أو يبدو طفلك مريضاً. |

## Flags (measure again, not applicable)

| Key | English | العربية |
|---|---|---|
| `remeasure.title` | Measure again | أعد القياس |
| `remeasure.body` | At least one number looks unlikely. This is often a measuring or typing mistake. Check what you entered, then measure again. | رقم واحد على الأقل يبدو غير محتمل. غالباً يكون السبب خطأً في القياس أو في الكتابة. راجع ما أدخلته ثم أعد القياس. |
| `remeasure.how` | How to measure: under 2 years, lay the child flat and measure length. From 2 years, stand the child straight without shoes and measure height. Weigh with little or no clothing. | طريقة القياس: دون السنتين، يُستلقى الطفل على سطح مستوٍ ويُقاس طوله. من عمر سنتين، يقف الطفل مستقيماً بلا حذاء ويُقاس طوله. يُوزن الطفل بملابس خفيفة أو بدونها. |
| `status.implausible.chip` | Measure again | أعد القياس |
| `status.implausible` | This result looks unlikely, so it is not shown as a band. Measure again and check the numbers. | هذه النتيجة تبدو غير محتملة، لذلك لا نعرضها. أعد القياس وتحقق من الأرقام. |
| `status.not_applicable.chip` | Not applicable | لا ينطبق |
| `status.not_applicable` | No result for this check. The number is outside the range covered by the WHO table. | لا توجد نتيجة لهذا الفحص. الرقم خارج النطاق الذي يغطيه جدول منظمة الصحة العالمية. |

## Red flags (warning-sign questions and the urgent action)

| Key | English | العربية |
|---|---|---|
| `rf.oedema` | Is there swelling of both feet? | هل يوجد تورّم في كلتا القدمين؟ |
| `rf.weak` | Is the child very weak, not feeding, or unusually sleepy? | هل الطفل ضعيف جداً، أو يرفض الرضاعة أو الأكل، أو نعسان بشكل غير معتاد؟ |
| `rf.loss` | Has the child lost weight recently? | هل فقد الطفل وزناً مؤخراً؟ |
| `urgent.title` | See a health worker today | راجع عاملاً صحياً اليوم |
| `urgent.body` | You answered yes to a warning sign. These signs can be serious, whatever the measurements show. Do not wait. | كانت الإجابة نعم عن علامة تحذيرية. قد تكون هذه العلامات خطيرة مهما كانت القياسات. لا تنتظر. |
| `urgent.signs` | The answer was yes to: | كانت الإجابة نعم عن: |
| `urgent.sign.oedema` | Swelling of both feet | تورّم في كلتا القدمين |
| `urgent.sign.weak` | Very weak, not feeding, or unusually sleepy | ضعف شديد، أو رفض الرضاعة أو الأكل، أو نعاس غير معتاد |
| `urgent.sign.loss` | Recent weight loss | فقدان وزن مؤخراً |

## UI (form, errors, "How this was calculated", footer)

| Key | English | العربية |
|---|---|---|
| `doc.title` | Qiyas · Child growth check | قياس · فحص نمو الطفل |
| `app.title` | Qiyas | قياس |
| `app.subtitle` | Qiyas: the measurement, explained. | قياس: القياس مشروحاً. |
| `lang.toggle` | العربية | English |
| `lang.toggleLabel` | Switch the language to Arabic | تبديل اللغة إلى الإنجليزية |
| `intro.text` | Check your child's growth for one visit. For children from birth up to 5 years old. | افحص نمو طفلك لزيارة واحدة. للأطفال من الولادة حتى عمر 5 سنوات. |
| `demo.title` | Try an example | جرّب مثالاً |
| `demo.note` | Made-up children. No real data. | أطفال افتراضيون. لا توجد بيانات حقيقية. |
| `demo.correction` | Example 1: measured standing (length is adjusted) | مثال 1: قيس واقفاً (يُعدَّل الطول) |
| `demo.redflag` | Example 2: unlikely number and swollen feet | مثال 2: رقم غير محتمل وتورّم في القدمين |
| `demo.normal` | Example 3: usual range | مثال 3: ضمن المعتاد |
| `form.title` | Your child's details | بيانات طفلك |
| `form.sex` | Sex | الجنس |
| `form.sex.boys` | Boy | ولد |
| `form.sex.girls` | Girl | بنت |
| `form.dob` | Date of birth | تاريخ الولادة |
| `form.or` | or | أو |
| `form.ageMonths` | Age in months | العمر بالأشهر |
| `form.ageMonthsHint` | Use this only if you do not know the date of birth. | استخدم هذا فقط إذا كنت لا تعرف تاريخ الولادة. |
| `form.visit` | Date of measurement | تاريخ القياس |
| `form.weight` | Weight | الوزن |
| `form.weightHint` | Example: 9.5 | مثال: 9.5 |
| `form.length` | Length or height | الطول |
| `form.lengthHint` | Example: 75.5 | مثال: 75.5 |
| `form.position` | How was your child measured? | كيف تم قياس طفلك؟ |
| `form.position.lying` | Lying down | مستلقياً |
| `form.position.standing` | Standing | واقفاً |
| `form.positionHint` | Children under 2 years are usually measured lying down. Older children are measured standing. | الأطفال دون السنتين يُقاسون عادةً وهم مستلقون، والأكبر سناً يُقاسون وهم واقفون. |
| `form.redflags` | Warning signs | علامات تحذيرية |
| `form.redflagsHint` | Please answer all three questions. | أجب عن الأسئلة الثلاثة. |
| `form.yes` | Yes | نعم |
| `form.no` | No | لا |
| `form.check` | Check | افحص |
| `form.clear` | Clear | مسح |
| `unit.kg` | kg | كجم |
| `unit.cm` | cm | سم |
| `unit.days` | days | يوماً |
| `result.title` | Result | النتيجة |
| `measure.title` | What the measurement shows | ماذا يُظهر القياس |
| `measure.note` | This compares your child with the WHO Child Growth Standards. It is not a diagnosis. | هذه النتيجة تقارن طفلك بمعايير منظمة الصحة العالمية لنمو الطفل. وهي ليست تشخيصاً. |
| `calc.title` | How this was calculated | كيف حُسبت النتيجة |
| `calc.intro` | Every number comes from the WHO tables and a fixed formula. No AI is used to calculate anything. | كل رقم يأتي من جداول منظمة الصحة العالمية ومعادلة ثابتة. لا يُستخدم الذكاء الاصطناعي في أي حساب. |
| `calc.age` | Age | العمر |
| `calc.entered` | Length or height you entered | الطول الذي أدخلته |
| `calc.measuredAs.lying` | measured lying down | قيس مستلقياً |
| `calc.measuredAs.standing` | measured standing | قيس واقفاً |
| `calc.adjustment` | Adjustment | التعديل |
| `calc.adjust.plus` | Your child is under 2 years old (730 days or fewer) but was measured standing. WHO length is measured lying down, so 0.7 cm is added. | طفلك دون السنتين (730 يوماً أو أقل) لكنه قيس واقفاً. طول الطفل في معايير المنظمة يُقاس مستلقياً، لذلك تُضاف 0.7 سم. |
| `calc.adjust.minus` | Your child is 2 years or older (731 days or more) but was measured lying down. WHO height is measured standing, so 0.7 cm is subtracted. | عمر طفلك سنتان أو أكثر (731 يوماً أو أكثر) لكنه قيس مستلقياً. طول الطفل في معايير المنظمة يُقاس واقفاً، لذلك تُطرح 0.7 سم. |
| `calc.adjust.none` | No adjustment: the way your child was measured matches the WHO standard for this age. | لا تعديل: طريقة قياس طفلك تطابق معيار منظمة الصحة العالمية لهذا العمر. |
| `calc.adjusted` | Length or height after adjustment | الطول بعد التعديل |
| `calc.table` | WHO table | جدول منظمة الصحة العالمية |
| `calc.tableWithSex` | {table} ({sex}) | {table} ({sex}) |
| `calc.sex.boys` | boys | أولاد |
| `calc.sex.girls` | girls | بنات |
| `table.wfa` | Weight-for-age | الوزن بالنسبة للعمر |
| `table.lhfa` | Length/height-for-age | الطول بالنسبة للعمر |
| `table.wfl` | Weight-for-length | الوزن بالنسبة للطول (مستلقياً) |
| `table.wfh` | Weight-for-height | الوزن بالنسبة للطول (واقفاً) |
| `calc.value` | Value used | القيمة المستخدمة |
| `calc.lookup` | Table row looked up | الصف المستخدم في الجدول |
| `calc.z` | z-score | درجة z |
| `calc.percentile` | Percentile | المئين |
| `calc.noResult` | No result | لا توجد نتيجة |
| `calc.notShown` | Not shown (looks unlikely) | غير معروض (تبدو غير محتملة) |
| `calc.zHelp` | z-score: how many steps your child is from the middle of the WHO standard. Zero is the middle. | درجة z: كم خطوة يبعد طفلك عن منتصف معيار منظمة الصحة العالمية. الصفر هو المنتصف. |
| `calc.percentileHelp` | Percentile: out of 100 children in the WHO standard, about this many measure lower. | المئين: من كل 100 طفل في معيار منظمة الصحة العالمية، يكون هذا العدد تقريباً أقل قياساً. |
| `err.sex` | Choose boy or girl. | اختر ولد أو بنت. |
| `err.position` | Choose how your child was measured. | اختر كيف تم قياس طفلك. |
| `err.redflags` | Answer all three warning-sign questions. | أجب عن أسئلة العلامات التحذيرية الثلاثة. |
| `err.number` | Enter a number, for example 9.5. | أدخل رقماً، مثل 9.5. |
| `err.age_missing` | Enter the date of birth or the age in months. | أدخل تاريخ الولادة أو العمر بالأشهر. |
| `err.age_range` | This check is for children from birth up to 5 years old. Check the date of birth or the age. | هذا الفحص للأطفال من الولادة حتى عمر 5 سنوات. تحقق من تاريخ الولادة أو العمر. |
| `err.visit_before_dob` | The measurement date is before the date of birth. Check both dates. | تاريخ القياس قبل تاريخ الولادة. تحقق من التاريخين. |
| `err.weight_range` | Weight should be between 0.9 and 58 kg. Check the number. | يجب أن يكون الوزن بين 0.9 و58 كجم. تحقق من الرقم. |
| `err.length_range` | Length or height should be between 38 and 150 cm. Check the number. | يجب أن يكون الطول بين 38 و150 سم. تحقق من الرقم. |
| `footer.text` | Uses WHO Child Growth Standards (2006). Not a diagnosis. Nothing you enter is stored. | يستخدم معايير منظمة الصحة العالمية لنمو الطفل (2006). ليس تشخيصاً. لا يُحفظ أي شيء تُدخله. |
| `footer.source` | WHO Child Growth Standards | معايير منظمة الصحة العالمية لنمو الطفل |
| `footer.repo` | Data sources and download dates: data/who/SOURCE.md in the repository. | مصادر البيانات وتواريخ التنزيل: الملف data/who/SOURCE.md في المستودع. |


### Added by the orchestrator (correction call-out)
| Key | EN | AR |
|---|---|---|
| calc.without | Without this correction, length-for-age would read | بدون هذا التعديل، كان الطول بالنسبة للعمر سيُقرأ |
| calc.without.changed | The correction changes the result to: {band}. Measuring the right way matters. | التعديل يغيّر النتيجة إلى: {band}. طريقة القياس الصحيحة مهمة. |


## AI layer strings
The AI answer is optional, experimental, and always shown below the fixed card. The model may only use the approved meaning/see text for the current result.

| Key | English | العربية |
|---|---|---|
| `ask.button` | Ask: what does this mean, and what should I do next? | اسأل: ماذا يعني هذا، وماذا أفعل الآن؟ |
| `ask.label` | AI answer (experimental): the result above does not change | إجابة الذكاء الاصطناعي (تجريبية): النتيجة أعلاه لا تتغير |
| `ask.unavailable` | AI not available, showing the approved text | الذكاء الاصطناعي غير متاح، نعرض النص المعتمد |
| `ask.loading` | Thinking... | جارٍ التفكير... |


## UI upgrade strings
Added with the visual upgrade (form steps, empty state, z-scale bar, AI box). Not clinical text, but please check the wording.

| Key | English | العربية |
|---|---|---|
| `step.child` | About your child | عن طفلك |
| `step.measure` | The measurement | القياس |
| `result.empty.title` | Your result will appear here | ستظهر النتيجة هنا |
| `result.empty.body` | Try an example, or fill in the three steps and press Check. | جرّب مثالاً، أو املأ الخطوات الثلاث واضغط «افحص». |
| `zscale.usual` | Usual range | المعتاد |
| `zscale.lower` | Lower | أقل |
| `zscale.higher` | Higher | أعلى |
| `zscale.ghost` | Without correction | بدون التعديل |
| `zscale.final` | With WHO correction | مع تعديل منظمة الصحة العالمية |
| `zscale.aria` | WHO scale: z {z}, {band}. | مقياس منظمة الصحة العالمية: z {z}، {band}. |
| `ask.badge` | Experimental | تجريبي |
| `ask.note` | Optional extra. The result above stays the same. | إضافة اختيارية. النتيجة أعلاه لا تتغير. |
