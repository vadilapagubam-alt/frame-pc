// Каталог загружается отдельно из products.json. Цены и названия меняются в этом файле.
let builds = [];
let components = {};
async function loadCatalog(){
  try {
    const response = await fetch("products.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const catalog = await response.json();
    if (!Array.isArray(catalog.builds) || !catalog.components) throw new Error("Неверный формат products.json");
    builds = catalog.builds;
    components = catalog.components;
    renderBuilds();
    updateConfigurator();
  } catch (error) {
    console.error("Не удалось загрузить products.json:", error);
    const grid = document.querySelector("#buildGrid");
    if (grid) grid.innerHTML = '<p class="demo-note">Не удалось загрузить каталог. Проверь, что файл products.json находится рядом с index.html и сайт открыт через GitHub Pages или локальный сервер.</p>';
  }
}
const translations = {
  ru: {
    navBuilds:"Сборки",navConfig:"Конфигуратор",navAbout:"Почему Frame",navContact:"Связаться",
    heroEyebrow:"ИГРОВЫЕ ПК · FRAME PC",heroTitle:'Твой следующий<br><span class="gradient-text">уровень FPS.</span>',
    heroText:"Подбираем игровые компьютеры под твои задачи и бюджет. Никаких случайных комплектующих — только продуманные сборки.",
    heroCta:"Собрать свой ПК",heroSecondary:"Выбрать готовую сборку",statFrom:"стартовый бюджет",statCheck:"проверка совместимости",statGoal:"фокус на производительности",
    featured:"FEATURED BUILD",available:"Пример сборки",performance:"Performance",exampleConfig:"Пример конфигурации",heroDisclaimer:"*FPS зависит от игры, разрешения и настроек. Изображение — стилизованная иллюстрация.",
    trust1:"Подбор под бюджет",trust2:"Проверка комплектующих",trust3:"Честная стоимость",trust4:"Фокус на FPS",
    buildsEyebrow:"ГОТОВЫЕ РЕШЕНИЯ",buildsTitle:'Выбери свой <span class="gradient-text">уровень.</span>',buildsText:"Стартовые варианты для разных бюджетов. Цены и характеристики ниже — демонстрационные, их можно заменить на реальные.",allBuilds:"Подобрать свою сборку",
    filterAll:"Все сборки",filterBudget:"Начальный уровень",filterBalanced:"Оптимальные",filterPower:"Высокая производительность",
    demoNote:"Демонстрационные цены не являются офертой. Перед публикацией укажи реальные комплектующие, стоимость и условия заказа.",
    configEyebrow:"ТВОЯ КОНФИГУРАЦИЯ",configTitle:'Собери ПК <span class="gradient-text">под себя.</span>',configText:"Выбери бюджет и приоритет. Конфигуратор пересчитает стоимость демонстрационного набора.",configLive:"Интерактивный демо-режим",
    budgetLabel:"Бюджет",priorityLabel:"Главный приоритет",priorityFps:"Максимум FPS",priorityFpsSub:"Больше кадров в играх",priorityUpgrade:"Апгрейд в будущем",priorityUpgradeSub:"Платформа с запасом",priorityWhite:"Белая эстетика",priorityWhiteSub:"Стильный внешний вид",marketLabel:"Предпочтение по деталям",marketNew:"Только новые",marketMixed:"Новые + б/у видеокарта",marketHint:"Пока это демонстрационный расчёт — реальные предложения ещё не подключены.",
    resultLabel:"ТВОЯ СБОРКА",compatibleDemo:"Демо-совместимость",performanceIndex:"Индекс производительности",estimatedTotal:"Ориентировочная стоимость",deliveryHint:"Без доставки и сборки",requestBuild:"Запросить эту сборку",resultDisclaimer:"Цены, индекс и совместимость условные. Не являются реальным предложением к покупке.",
    processEyebrow:"ПРОСТО И ПОНЯТНО",processTitle:'От идеи до <span class="gradient-text">игры.</span>',step1Title:"Выбираем",step1Text:"Определяем бюджет, игры и желаемую производительность.",step2Title:"Собираем",step2Text:"Подбираем совместимые детали и согласовываем конфигурацию.",step3Title:"Тестируем",step3Text:"Проверяем работу ПК и фиксируем результат сборки.",step4Title:"Отправляем",step4Text:"Передаём готовый компьютер и помогаем после покупки.",
    contactEyebrow:"НАЧНЁМ?",contactTitle:"Твой ПК. Твои правила.",contactText:"Расскажи, во что играешь и какой у тебя бюджет. Поможем подобрать конфигурацию.",contactCta:"Написать в Telegram",footerText:"Игровые ПК с фокусом на производительности.",footerRights:"Все права защищены.",
    cpu:"Процессор",board:"Материнская плата",gpu:"Видеокарта",ram:"Оперативная память",storage:"Накопитель",psu:"Блок питания",case:"Корпус",
    fpsDescription:"Приоритет — игровая производительность.",upgradeDescription:"Приоритет — платформа с возможностью апгрейда.",whiteDescription:"Приоритет — внешний вид и белая эстетика.",
    selected:"Выбрано",choose:"Использовать сборку",toastRequest:"Заявка пока не отправляется: укажи свой Telegram в настройках сайта.",marketUsed:"б/у вариант",marketNewTag:"новый вариант",overBudget:"Выше бюджета",underBudget:"В рамках бюджета",totalParts:"Комплектующие"
  },
  en: {
    navBuilds:"Builds",navConfig:"Configurator",navAbout:"Why Frame",navContact:"Contact",
    heroEyebrow:"GAMING PCS · FRAME PC",heroTitle:'Your next<br><span class="gradient-text">level of FPS.</span>',
    heroText:"Gaming PCs tailored to your needs and budget. No random parts — just thoughtfully balanced builds.",
    heroCta:"Build your PC",heroSecondary:"Explore ready builds",statFrom:"starting budget",statCheck:"compatibility checks",statGoal:"performance first",
    featured:"FEATURED BUILD",available:"Example build",performance:"Performance",exampleConfig:"Example configuration",heroDisclaimer:"*FPS depends on the game, resolution and settings. The image is a stylized illustration.",
    trust1:"Budget-focused",trust2:"Component checks",trust3:"Transparent pricing",trust4:"FPS-focused",
    buildsEyebrow:"READY-MADE BUILDS",buildsTitle:'Choose your <span class="gradient-text">level.</span>',buildsText:"Starting points for different budgets. Prices and specs are demo data and should be replaced with real details.",allBuilds:"Configure your build",
    filterAll:"All builds",filterBudget:"Entry level",filterBalanced:"Balanced",filterPower:"High performance",
    demoNote:"Demo prices are not an offer. Replace specs, prices and order terms with real information before publishing.",
    configEyebrow:"YOUR CONFIGURATION",configTitle:'Build a PC <span class="gradient-text">your way.</span>',configText:"Choose a budget and priority. The configurator recalculates a demo parts list.",configLive:"Interactive demo",
    budgetLabel:"Budget",priorityLabel:"Main priority",priorityFps:"Maximum FPS",priorityFpsSub:"More frames in games",priorityUpgrade:"Future upgrades",priorityUpgradeSub:"Room to grow",priorityWhite:"White aesthetic",priorityWhiteSub:"A clean, stylish look",marketLabel:"Component preference",marketNew:"New only",marketMixed:"New + used GPU",marketHint:"This is a demo calculation. Live marketplace offers are not connected yet.",
    resultLabel:"YOUR BUILD",compatibleDemo:"Demo compatibility",performanceIndex:"Performance index",estimatedTotal:"Estimated price",deliveryHint:"Excludes shipping and assembly",requestBuild:"Request this build",resultDisclaimer:"Prices, score and compatibility are illustrative, not a real offer to purchase.",
    processEyebrow:"SIMPLE PROCESS",processTitle:'From idea to <span class="gradient-text">game.</span>',step1Title:"Choose",step1Text:"Set your budget, games and target performance.",step2Title:"Build",step2Text:"Select compatible parts and confirm the configuration.",step3Title:"Test",step3Text:"Test the PC and document the completed build.",step4Title:"Deliver",step4Text:"Receive your PC and get help after purchase.",
    contactEyebrow:"LET'S START",contactTitle:"Your PC. Your rules.",contactText:"Tell us what you play and your budget. We'll help choose a configuration.",contactCta:"Message on Telegram",footerText:"Gaming PCs focused on performance.",footerRights:"All rights reserved.",
    cpu:"CPU",board:"Motherboard",gpu:"Graphics card",ram:"Memory",storage:"Storage",psu:"Power supply",case:"Case",
    fpsDescription:"Priority: gaming performance.",upgradeDescription:"Priority: a platform with upgrade options.",whiteDescription:"Priority: appearance and a white aesthetic.",
    selected:"Selected",choose:"Use this build",toastRequest:"Request form is not connected yet. Set your Telegram link in the site settings.",marketUsed:"used option",marketNewTag:"new option",overBudget:"Over budget",underBudget:"Within budget",totalParts:"Components"
  }
};
let lang = "ru";
let priority = "fps";
let activeFilter = "all";
const money = n => Math.round(n).toLocaleString(lang === "ru" ? "ru-RU" : "en-US") + (lang === "ru" ? " ₽" : " RUB");
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function t(key){ return (translations[lang] && translations[lang][key]) || translations.ru[key] || key; }
function applyLanguage(){
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach(el => { const key=el.dataset.i18n; if(translations[lang][key]) el.innerHTML=translations[lang][key]; });
  $("#languageToggle").innerHTML = (lang==="ru"?"RU":"EN")+' <span>⌄</span>';
  renderBuilds(); updateConfigurator();
}
function renderBuilds(){
  const filtered = builds.filter(b=>activeFilter==="all"||b.category===activeFilter);
  $("#buildGrid").innerHTML = filtered.map(b=>`
    <article class="build-card">
      <div class="build-art" style="--glow:${b.glow}">
        <span class="build-tag">${b.tag}</span><span class="build-fps">${b.fps}</span>
        <div class="mini-pc"><div class="mini-front"><span class="mini-fan"></span><span class="mini-fan"></span><span class="mini-fan"></span></div><div class="mini-side"><div class="mini-gpu"></div></div></div>
      </div>
      <div class="build-body">
        <div class="build-title-row"><div><h3>${b.name}</h3><span class="build-category">${b.category==="budget"?(lang==="ru"?"Начальный уровень":"Entry level"):b.category==="balanced"?(lang==="ru"?"Оптимальная сборка":"Balanced build"):(lang==="ru"?"Высокая производительность":"High performance")}</span></div><strong class="build-price">${money(b.price)}</strong></div>
        <p class="build-desc">${b.desc}</p><div class="spec-pills">${b.specs.map(s=>`<span>${s}</span>`).join("")}</div>
        <div class="build-footer"><small>${lang==="ru"?"Индекс FPS":"Performance index"}: ${b.score}/100</small><button data-use-build="${b.id}">${t("choose")} ↗</button></div>
      </div>
    </article>`).join("");
  $$("[data-use-build]").forEach(btn=>btn.addEventListener("click",()=>{
    const b=builds.find(x=>x.id===Number(btn.dataset.useBuild));
    $("#budgetRange").value=b.price; priority="fps"; $$("[data-priority]").forEach(x=>x.classList.toggle("selected",x.dataset.priority===priority));
    updateConfigurator(); location.hash="#configurator";
  }));
}
function chooseItem(type,budget,usedAllowed){
  let arr=components[type].filter(x=>x.min<=budget);
  if(type==="gpu" && usedAllowed) arr=arr.filter(x=>x.used || x.min>=70000);
  if(!arr.length) arr=components[type].slice(0,1);
  let item=arr[arr.length-1];
  if(priority==="upgrade" && ["cpu","board"].includes(type)){
    const up=arr.filter(x=>x.priority==="upgrade"); if(up.length)item=up[up.length-1];
  }
  if(priority==="white" && type==="case") return {name:"Белый панорамный ARGB",short:"Белый корпус · демонстрационный вариант",price:6000};
  return item;
}
function updateConfigurator(){
  const budget=Number($("#budgetRange").value);
  const market=$('input[name="market"]:checked').value;
  const usedAllowed=market==="mixed";
  $("#budgetValue").textContent=money(budget);
  const items=[
    ["cpu",chooseItem("cpu",budget,usedAllowed)],
    ["board",chooseItem("board",budget,usedAllowed)],
    ["gpu",chooseItem("gpu",budget,usedAllowed)],
    ["ram",chooseItem("ram",budget,usedAllowed)],
    ["storage",chooseItem("storage",budget,usedAllowed)],
    ["psu",chooseItem("psu",budget,usedAllowed)],
    ["case",chooseItem("case",budget,usedAllowed)]
  ];
  let total=items.reduce((s,[,v])=>s+v.price,0);
  // Adjust illustrative GPU/parts down if total exceeds the chosen target.
  if(total>budget){
    const reductions=["gpu","cpu","ram","board"];
    for(const key of reductions){
      if(total<=budget)break;
      const entry=items.find(x=>x[0]===key);
      const options=components[key].filter(x=>x.min<=budget).sort((a,b)=>a.price-b.price);
      const cheaper=options.find(x=>x.price<entry[1].price);
      if(cheaper){total-=entry[1].price-cheaper.price;entry[1]=cheaper;}
    }
  }
  const score=Math.min(98,Math.max(45,Math.round(50+(budget-50000)/1000*.78+(priority==="upgrade"?4:priority==="white"?-2:0)+(usedAllowed?5:0))));
  $("#resultName").textContent=`Frame ${priority==="fps"?"Pulse":priority==="upgrade"?"Evolve":"Snow"} ${Math.round(budget/1000)}`;
  $("#performanceScore").textContent=score;
  $("#performanceDescription").textContent=t(priority==="fps"?"fpsDescription":priority==="upgrade"?"upgradeDescription":"whiteDescription");
  $(".performance-ring").style.background=`conic-gradient(#a78bfa ${score*3.6}deg,#32283e ${score*3.6}deg 360deg)`;
  $("#partsList").innerHTML=items.map(([key,item])=>`<div class="part-row"><div class="part-info"><strong>${t(key)}</strong><span>${item.name} · ${item.short}</span><span class="part-source">${item.used?(lang==="ru"?"Возможен б/у вариант":"Used option possible"):(lang==="ru"?"Демо-цена":"Demo price")}</span></div><span class="part-price">${money(item.price)}</span></div>`).join("");
  $("#resultTotal").textContent=money(total);
  $("#requestBuild").dataset.budget=budget;
  $("#requestBuild").dataset.total=total;
}
function showToast(msg){const toast=$("#toast");toast.textContent=msg;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),3200);}
$$(".filter-chip").forEach(btn=>btn.addEventListener("click",()=>{activeFilter=btn.dataset.filter;$$(".filter-chip").forEach(x=>x.classList.toggle("active",x===btn));renderBuilds();}));
$$("[data-priority]").forEach(btn=>btn.addEventListener("click",()=>{priority=btn.dataset.priority;$$("[data-priority]").forEach(x=>x.classList.toggle("selected",x===btn));updateConfigurator();}));
$("#budgetRange").addEventListener("input",updateConfigurator);
$$('input[name="market"]').forEach(el=>el.addEventListener("change",updateConfigurator));
$("#languageToggle").addEventListener("click",()=>{lang=lang==="ru"?"en":"ru";applyLanguage();});
$("#requestBuild").addEventListener("click",()=>{
  const budget=$("#requestBuild").dataset.budget,total=$("#requestBuild").dataset.total;
  const msg=lang==="ru"?`Выбрана демонстрационная сборка на ${money(Number(budget))}. Расчётная стоимость деталей: ${money(Number(total))}. Замените ссылку Telegram в файле index.html на свой контакт.`:`Selected demo build budget: ${money(Number(budget))}. Estimated parts cost: ${money(Number(total))}. Replace the Telegram link in index.html with your contact.`;
  showToast(msg);
});
$("#menuToggle").addEventListener("click",()=>$("#nav").classList.toggle("open"));
$$(".nav a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));
$("#year").textContent=new Date().getFullYear();
loadCatalog();
