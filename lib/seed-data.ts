// ── Mock data for Phase 1 (no database yet) ──

export interface Year {
  id: number;
  number: number;
  labelFr: string;
  labelAr: string;
  totalCoefficient: number;
}

export interface Module {
  id: string;
  yearId: number;
  nameFr: string;
  nameAr: string;
  coefficient: number;
  order: number;
  icon: string; // lucide icon name
}

export interface FAQEntry {
  id: string;
  categoryFr: string;
  categoryAr: string;
  questionFr: string;
  questionAr: string;
  answerFr: string;
  answerAr: string;
  createdAt: string;
}

export interface Year6Rotation {
  id: string;
  nameFr: string;
  nameAr: string;
  disciplinesFr: string;
  disciplinesAr: string;
  icon: string; // lucide icon name
}

// ── Years ──
export const years: Year[] = [
  { id: 1, number: 1, labelFr: "1ère Année", labelAr: "السنة الأولى", totalCoefficient: 22 },
  { id: 2, number: 2, labelFr: "2ème Année", labelAr: "السنة الثانية", totalCoefficient: 15 },
  { id: 3, number: 3, labelFr: "3ème Année", labelAr: "السنة الثالثة", totalCoefficient: 14 },
  { id: 4, number: 4, labelFr: "4ème Année", labelAr: "السنة الرابعة", totalCoefficient: 10 },
  { id: 5, number: 5, labelFr: "5ème Année", labelAr: "السنة الخامسة", totalCoefficient: 13 },
  { id: 6, number: 6, labelFr: "6ème Année", labelAr: "السنة السادسة", totalCoefficient: 0 },
];

// ── Modules by Year ──
export const modules: Module[] = [
  // Year 1
  { id: "y1-m1", yearId: 1, nameFr: "Biomathématique, informatique et statistique", nameAr: "الرياضيات الحيوية والإعلام الآلي والإحصاء", coefficient: 3, order: 1, icon: "calculator" },
  { id: "y1-m2", yearId: 1, nameFr: "Chimie pharmaceutique générale", nameAr: "الكيمياء الصيدلانية العامة", coefficient: 3, order: 2, icon: "flask-conical" },
  { id: "y1-m3", yearId: 1, nameFr: "Chimie pharmaceutique organique", nameAr: "الكيمياء الصيدلانية العضوية", coefficient: 3, order: 3, icon: "atom" },
  { id: "y1-m4", yearId: 1, nameFr: "Biologie cellulaire", nameAr: "البيولوجيا الخلوية", coefficient: 3, order: 4, icon: "microscope" },
  { id: "y1-m5", yearId: 1, nameFr: "Physique pharmaceutique", nameAr: "الفيزياء الصيدلانية", coefficient: 2, order: 5, icon: "zap" },
  { id: "y1-m6", yearId: 1, nameFr: "Biologie végétale", nameAr: "البيولوجيا النباتية", coefficient: 2, order: 6, icon: "leaf" },
  { id: "y1-m7", yearId: 1, nameFr: "Anatomie fonctionnelle descriptive", nameAr: "التشريح الوظيفي الوصفي", coefficient: 2, order: 7, icon: "bone" },
  { id: "y1-m8", yearId: 1, nameFr: "Physiologie", nameAr: "علم وظائف الأعضاء", coefficient: 2, order: 8, icon: "heart-pulse" },
  { id: "y1-m9", yearId: 1, nameFr: "Histoire de la pharmacie et galénique", nameAr: "تاريخ الصيدلة والصيدلة الغالينية", coefficient: 1, order: 9, icon: "scroll-text" },
  { id: "y1-m10", yearId: 1, nameFr: "Langue française", nameAr: "اللغة الفرنسية", coefficient: 1, order: 10, icon: "languages" },

  // Year 2
  { id: "y2-m1", yearId: 2, nameFr: "Biophysique", nameAr: "الفيزياء الحيوية", coefficient: 2, order: 1, icon: "waves" },
  { id: "y2-m2", yearId: 2, nameFr: "Botanique pharmaceutique", nameAr: "علم النبات الصيدلاني", coefficient: 2, order: 2, icon: "flower-2" },
  { id: "y2-m3", yearId: 2, nameFr: "Chimie analytique fondamentale", nameAr: "الكيمياء التحليلية الأساسية", coefficient: 2, order: 3, icon: "test-tubes" },
  { id: "y2-m4", yearId: 2, nameFr: "Chimie minérale pharmaceutique", nameAr: "الكيمياء المعدنية الصيدلانية", coefficient: 2, order: 4, icon: "gem" },
  { id: "y2-m5", yearId: 2, nameFr: "Génétique", nameAr: "علم الوراثة", coefficient: 2, order: 5, icon: "dna" },
  { id: "y2-m6", yearId: 2, nameFr: "Biochimie structurale, métabolique", nameAr: "الكيمياء الحيوية البنيوية والأيضية", coefficient: 2, order: 6, icon: "scan-eye" },
  { id: "y2-m7", yearId: 2, nameFr: "Physiopathologie", nameAr: "علم وظائف الأعضاء المرضية", coefficient: 2, order: 7, icon: "stethoscope" },
  { id: "y2-m8", yearId: 2, nameFr: "Culture générale", nameAr: "الثقافة العامة", coefficient: 1, order: 8, icon: "book-open" },

  // Year 3
  { id: "y3-m1", yearId: 3, nameFr: "Chimie thérapeutique", nameAr: "الكيمياء العلاجية", coefficient: 3, order: 1, icon: "pill" },
  { id: "y3-m2", yearId: 3, nameFr: "Pharmacie galénique", nameAr: "الصيدلة الغالينية", coefficient: 3, order: 2, icon: "flask-round" },
  { id: "y3-m3", yearId: 3, nameFr: "Chimie analytique", nameAr: "الكيمياء التحليلية", coefficient: 2, order: 3, icon: "test-tubes" },
  { id: "y3-m4", yearId: 3, nameFr: "Pharmacognosie", nameAr: "علم العقاقير", coefficient: 2, order: 4, icon: "leaf" },
  { id: "y3-m5", yearId: 3, nameFr: "Pharmacologie", nameAr: "علم الأدوية", coefficient: 2, order: 5, icon: "syringe" },
  { id: "y3-m6", yearId: 3, nameFr: "Sémiologie médicale", nameAr: "السيميولوجيا الطبية", coefficient: 2, order: 6, icon: "clipboard-list" },

  // Year 4
  { id: "y4-m1", yearId: 4, nameFr: "Biochimie médicale", nameAr: "الكيمياء الحيوية الطبية", coefficient: 2, order: 1, icon: "test-tube" },
  { id: "y4-m2", yearId: 4, nameFr: "Microbiologie médicale", nameAr: "الأحياء الدقيقة الطبية", coefficient: 2, order: 2, icon: "bug" },
  { id: "y4-m3", yearId: 4, nameFr: "Immunologie", nameAr: "علم المناعة", coefficient: 2, order: 3, icon: "shield" },
  { id: "y4-m4", yearId: 4, nameFr: "Parasitologie – Mycologie", nameAr: "علم الطفيليات - الفطريات", coefficient: 2, order: 4, icon: "microscope" },
  { id: "y4-m5", yearId: 4, nameFr: "Hémobiologie / Transfusion sanguine", nameAr: "علم الدم / نقل الدم", coefficient: 2, order: 5, icon: "droplets" },

  // Year 5
  { id: "y5-m1", yearId: 5, nameFr: "Toxicologie", nameAr: "علم السموم", coefficient: 3, order: 1, icon: "skull" },
  { id: "y5-m2", yearId: 5, nameFr: "Hydro-bromatologie", nameAr: "هيدرو-بروماتولوجيا", coefficient: 2, order: 2, icon: "droplet" },
  { id: "y5-m3", yearId: 5, nameFr: "Épidémiologie – Méthodologie de la recherche", nameAr: "علم الأوبئة - منهجية البحث", coefficient: 1, order: 3, icon: "bar-chart-3" },
  { id: "y5-m4", yearId: 5, nameFr: "Droit pharmaceutique", nameAr: "القانون الصيدلاني", coefficient: 1, order: 4, icon: "scale" },
  { id: "y5-m5", yearId: 5, nameFr: "Gestion pharmaceutique", nameAr: "الإدارة الصيدلانية", coefficient: 1, order: 5, icon: "briefcase" },
  { id: "y5-m6", yearId: 5, nameFr: "Pharmacie hospitalière", nameAr: "الصيدلة الاستشفائية", coefficient: 1, order: 6, icon: "hospital" },
  { id: "y5-m7", yearId: 5, nameFr: "Pharmacie clinique", nameAr: "الصيدلة السريرية", coefficient: 2, order: 7, icon: "clipboard-check" },
  { id: "y5-m8", yearId: 5, nameFr: "Pharmacie industrielle", nameAr: "الصيدلة الصناعية", coefficient: 2, order: 8, icon: "factory" },
];

// ── Year 6 rotations (internship year — no modules) ──
export const year6Rotations: Year6Rotation[] = [
  {
    id: "y6-r1",
    nameFr: "Stage en officine",
    nameAr: "تربص في الصيدلية المفتوحة",
    disciplinesFr: "Gestion d'officine, délivrance, conseil au comptoir",
    disciplinesAr: "إدارة الصيدلية، صرف الأدوية، الإرشاد على المنضدة",
    icon: "store",
  },
  {
    id: "y6-r2",
    nameFr: "Stage en pharmacie hospitalière et clinique",
    nameAr: "تربص في الصيدلة الاستشفائية والسريرية",
    disciplinesFr: "Pharmacie hospitalière, pharmacie clinique",
    disciplinesAr: "الصيدلة الاستشفائية، الصيدلة السريرية",
    icon: "building-2",
  },
  {
    id: "y6-r3",
    nameFr: "Stage en biologie exploratrice",
    nameAr: "تربص في البيولوجيا الاستكشافية",
    disciplinesFr: "Biochimie, hémobiologie, immunologie",
    disciplinesAr: "الكيمياء الحيوية، علم الدم، علم المناعة",
    icon: "microscope",
  },
  {
    id: "y6-r4",
    nameFr: "Stage en biologie infectieuse",
    nameAr: "تربص في البيولوجيا المعدية",
    disciplinesFr: "Microbiologie, parasitologie",
    disciplinesAr: "الأحياء الدقيقة، علم الطفيليات",
    icon: "dna",
  },
  {
    id: "y6-r5",
    nameFr: "Stage en sciences pharmaceutiques",
    nameAr: "تربص في العلوم الصيدلانية",
    disciplinesFr: "Industrie pharmaceutique",
    disciplinesAr: "الصيدلة الصناعية",
    icon: "factory",
  },
];

// ── Mock FAQ Entries ──
export const mockFaqEntries: FAQEntry[] = [
  {
    id: "faq1",
    categoryFr: "Pratique Clinique",
    categoryAr: "الممارسة السريرية",
    questionFr: "Quelle est la différence entre les antibiotiques bactériostatiques et bactéricides ?",
    questionAr: "ما الفرق بين المضادات الحيوية المثبطة للجراثيم والقاتلة للجراثيم؟",
    answerFr: "**Les antibiotiques bactéricides** tuent directement les bactéries. Ils interfèrent généralement avec la formation de la paroi cellulaire bactérienne ou de sa membrane cellulaire. Exemples : Pénicillines, Céphalosporines, Fluoroquinolones.\n\n**Les antibiotiques bactériostatiques** empêchent les bactéries de se multiplier. Ils interfèrent souvent avec la production de protéines bactériennes, la réplication de l'ADN ou d'autres aspects du métabolisme cellulaire bactérien. Exemples : Tétracyclines, Macrolides, Sulfonamides.\n\n*Note Clinique :* La distinction est cruciale lors du traitement de patients immunodéprimés ou d'infections graves, où les agents bactéricides sont préférés.",
    answerAr: "**المضادات الحيوية القاتلة للجراثيم** تقتل البكتيريا مباشرة. تتداخل عادة مع تكوين جدار الخلية البكتيرية أو غشائها. أمثلة: البنسلينات، السيفالوسبورينات، الفلوروكينولونات.\n\n**المضادات الحيوية المثبطة للجراثيم** تمنع البكتيريا من التكاثر. تتداخل في كثير من الأحيان مع إنتاج البروتين البكتيري أو تكرار الحمض النووي. أمثلة: التتراسيكلينات، الماكروليدات، السلفوناميدات.\n\n*ملاحظة سريرية:* هذا التمييز مهم عند علاج المرضى ذوي المناعة المنخفضة أو الالتهابات الخطيرة.",
    createdAt: "2024-10-20",
  },
  {
    id: "faq2",
    categoryFr: "Pharmacologie",
    categoryAr: "علم الأدوية",
    questionFr: "Comment les inhibiteurs de l'ECA provoquent-ils une toux sèche ?",
    questionAr: "كيف تسبب مثبطات الإنزيم المحول للأنجيوتنسين السعال الجاف؟",
    answerFr: "Les inhibiteurs de l'ECA bloquent la dégradation de la bradykinine et de la substance P. L'accumulation de bradykinine dans les voies respiratoires sensibilise les terminaisons nerveuses sensorielles, provoquant une toux sèche et persistante chez environ 10-20% des patients.",
    answerAr: "مثبطات الإنزيم المحول للأنجيوتنسين تمنع تحلل البراديكينين والمادة P. يؤدي تراكم البراديكينين في الجهاز التنفسي إلى تحسيس النهايات العصبية الحسية، مما يسبب سعالاً جافاً ومستمراً عند حوالي 10-20% من المرضى.",
    createdAt: "2024-10-18",
  },
  {
    id: "faq3",
    categoryFr: "Calculs",
    categoryAr: "الحسابات",
    questionFr: "Quelle est la formule la plus simple pour calculer les débits de perfusion IV ?",
    questionAr: "ما هي أبسط صيغة لحساب معدلات التنقيط الوريدي؟",
    answerFr: "La formule standard est : (Volume en mL × Facteur de goutte en gtt/mL) / Temps en minutes = Débit en gtt/min. Pour les tubulures macro-goutte, le facteur est généralement 10, 15 ou 20 gtt/mL. Pour les micro-gouttes, c'est toujours 60 gtt/mL.",
    answerAr: "الصيغة القياسية هي: (الحجم بالمل × عامل القطرة بالقطرات/مل) / الوقت بالدقائق = المعدل بالقطرات/دقيقة. بالنسبة لأنابيب القطرة الكبيرة، العامل عادة 10 أو 15 أو 20 قطرة/مل. بالنسبة للقطرة الدقيقة، هو دائماً 60 قطرة/مل.",
    createdAt: "2024-10-15",
  },
  {
    id: "faq4",
    categoryFr: "Pharmacologie",
    categoryAr: "علم الأدوية",
    questionFr: "Expliquez simplement le métabolisme de premier passage.",
    questionAr: "اشرح الأيض الأولي ببساطة.",
    answerFr: "Le métabolisme de premier passage est lorsqu'un médicament pris par voie orale est significativement métabolisé par le foie avant d'atteindre la circulation sanguine systémique. Cela réduit considérablement la concentration du médicament actif disponible pour l'organisme. C'est pourquoi certains médicaments doivent être administrés par voie IV ou sublinguale.",
    answerAr: "الأيض الأولي يحدث عندما يتم استقلاب الدواء المأخوذ عن طريق الفم بشكل كبير بواسطة الكبد قبل أن يصل إلى الدورة الدموية الجهازية. هذا يقلل بشكل كبير من تركيز الدواء الفعال المتاح للجسم. لهذا السبب يجب إعطاء بعض الأدوية عن طريق الوريد أو تحت اللسان.",
    createdAt: "2024-10-10",
  },
];
