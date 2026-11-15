(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // 阅读进度条
  const progress = $("#scrollProgress");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // 移动端导航：支持键盘关闭、点击外部关闭和状态同步
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  if (menuToggle && mainNav) {
    const setMenuOpen = open => {
      mainNav.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
    };
    menuToggle.addEventListener("click", () => setMenuOpen(!mainNav.classList.contains("open")));
    mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenuOpen(false)));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && mainNav.classList.contains("open")) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });
    document.addEventListener("click", event => {
      if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) setMenuOpen(false);
    });
  }

  // 滚动进入动画：不支持 IntersectionObserver 时保持内容可见
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // 历史节点内容
  const events = {
    start: {
      date: "1934年10月",
      title: "踏上战略转移之路",
      text: "中央红军主力从中央革命根据地出发，开始战略转移。长征是在当时严峻形势下作出的重大历史行动。首页以这一节点作为叙事起点，后续专题可进一步呈现出发背景、行军路线与相关史料。"
    },
    zunyi: {
      date: "1935年1月",
      title: "遵义会议",
      text: "中共中央政治局在贵州遵义召开扩大会议。会议在极其重要的历史关头，事实上确立了毛泽东同志在党中央和红军的领导地位，在中国革命史上具有重要意义。"
    },
    snow: {
      date: "1935年—1936年（各部队行程不同）",
      title: "翻越雪山 · 穿越草地",
      text: "翻越雪山、穿越草地是红军长征中极具代表性的艰苦历程。不同方面军、不同部队经过相关地区的时间与路线并不相同，因此这里不将其标注为单一日期。正式专题应按部队分别核对史料。"
    },
    meeting: {
      date: "1936年10月9日、22日",
      title: "三大主力红军胜利会师",
      text: "10月9日，红一、红四方面军在甘肃会宁会师；10月22日，红一、红二方面军在将台堡会师。至此，红军三大主力胜利会师。会师是一个分阶段推进的历史过程，不应误写成同一天、同一地点完成。"
    }
  };

  const eventModal = $("#eventModal");
  let lastFocused = null;
  const openModal = modal => {
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $(".modal-close", modal).focus();
  };
  const closeModal = modal => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  $$("[data-event]").forEach(button => {
    button.addEventListener("click", () => {
      const event = events[button.dataset.event];
      if (!event) return;
      $("#modalDate").textContent = event.date;
      $("#modalTitle").textContent = event.title;
      $("#modalText").textContent = event.text;
      openModal(eventModal);
    });
  });
  $$("[data-close-modal]").forEach(el => el.addEventListener("click", () => closeModal(eventModal)));


  // 长征路线探索：示意图强调不同部队的不同历程，不作为地理导航
  const routeData = {
    central: { period: "1934.10 — 1935.10", title: "中央红军（红一方面军）", description: "中央红军从中央革命根据地出发，历经艰苦转战，于1935年10月到达陕北吴起镇。这里展示的是代表性节点，不是完整行军路线。", stops: ["江西于都等地：出发", "贵州遵义：遵义会议", "四川懋功地区：一、四方面军会师", "陕北吴起镇：中央红军主力到达"] },
    fourth: { period: "1935.05 — 1936.10", title: "红四方面军", description: "红四方面军从川陕根据地转移，历经艰苦行军与多次转战，1936年10月在甘肃会宁与红一方面军会师。", stops: ["川陕根据地：开始战略转移", "川西地区：与红一方面军会师后共同北上", "甘肃会宁：1936年10月9日会师"] },
    second: { period: "1935.11 — 1936.10", title: "红二方面军（由红二、六军团组成）", description: "红二、六军团从湘鄂川黔根据地出发，1936年在甘孜地区与红四方面军会合，随后北上，并于10月在将台堡与红一方面军会师。", stops: ["湖南桑植刘家坪等地：出发", "四川甘孜：1936年6月底至7月初会合", "将台堡：1936年10月22日会师"] }
  };
  const routeTabs = $$("[data-route]");
  const setRoute = key => {
    const route = routeData[key];
    if (!route) return;
    routeTabs.forEach(tab => { const active = tab.dataset.route === key; tab.classList.toggle("active", active); tab.setAttribute("aria-pressed", String(active)); });
    $$('[data-route-line]').forEach(line => line.classList.toggle("is-active", line.dataset.routeLine === key));
    $("#routePeriod").textContent = route.period;
    $("#routeTitle").textContent = route.title;
    $("#routeDescription").textContent = route.description;
    $("#routeStops").replaceChildren(...route.stops.map(stop => { const li = document.createElement("li"); li.textContent = stop; return li; }));
  };
  routeTabs.forEach(tab => tab.addEventListener("click", () => setRoute(tab.dataset.route)));
  setRoute("central");

  // 青春宣言：只在当前浏览器内生成，不上传内容
  const pledgeModal = $("#pledgeModal");
  const pledgeInput = $("#pledgeInput");
  const charCount = $("#charCount");
  const pledgeResult = $("#pledgeResult");
  const toast = $("#toast");
  let toastTimer;
  const showToast = message => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  };

  $("#pledgeOpen").addEventListener("click", () => openModal(pledgeModal));
  $$("[data-close-pledge]").forEach(el => el.addEventListener("click", () => closeModal(pledgeModal)));
  pledgeInput.addEventListener("input", () => {
    charCount.textContent = `${pledgeInput.value.length} / 100`;
  });
  $("#makePledge").addEventListener("click", () => {
    const text = pledgeInput.value.trim();
    if (!text) {
      showToast("先写下一句属于你的青春宣言。");
      pledgeInput.focus();
      return;
    }
    $("#pledgeOutput").textContent = text;
    pledgeResult.hidden = false;
    pledgeResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  $("#copyPledge").addEventListener("click", async () => {
    const text = $("#pledgeOutput").textContent;
    try {
      await navigator.clipboard.writeText(text);
      showToast("宣言已复制。");
    } catch {
      const temporary = document.createElement("textarea");
      temporary.value = text;
      document.body.appendChild(temporary);
      temporary.select();
      const copied = document.execCommand("copy");
      temporary.remove();
      showToast(copied ? "宣言已复制。" : "复制失败，请手动选择文字。");
    }
  });

  // ESC 关闭弹窗
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (eventModal.classList.contains("is-open")) closeModal(eventModal);
      if (pledgeModal.classList.contains("is-open")) closeModal(pledgeModal);
    }
  });
})();
