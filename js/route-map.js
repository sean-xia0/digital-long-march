(() => {
  "use strict";
  const mapNode = document.getElementById("longMarchMap");
  if (!mapNode) return;
  const status = document.getElementById("geoMapStatus");
  const detailTitle = document.getElementById("geoDetailTitle");
  const detailText = document.getElementById("geoDetailText");
  const detailKicker = document.getElementById("geoDetailKicker");
  const detailStops = document.getElementById("geoDetailStops");
  const buttons = [...document.querySelectorAll("[data-geo-route]")];

  const places = {
    ruijin: {name:"瑞金", province:"江西省赣州市", lat:25.9189329, lon:115.9889838, type:"现代瑞金市参考点", note:"中央革命根据地的重要区域。地图标记为现代瑞金市参考坐标。"},
    yudu: {name:"于都", province:"江西省赣州市", lat:25.9577380, lon:115.4870550, type:"现代于都县参考点", note:"中央红军主力于1934年10月从于都等渡口踏上长征路；本标记定位于都县域，并非某一具体渡口。"},
    zunyi: {name:"遵义", province:"贵州省", lat:27.6898179, lon:106.9153158, type:"现代遵义市参考点", note:"1935年1月召开遵义会议。坐标用于定位现代城市，不表示会议旧址的精确坐标。"},
    xiaojin: {name:"小金（懋功）", province:"四川省阿坝州", lat:31.1674297, lon:102.5040173, type:"现代小金县参考点", note:"1935年6月红一、红四方面军在懋功地区会师。县域参考点不等同于具体会师地点。"},
    wuqi: {name:"吴起镇（今吴起县）", province:"陕西省延安市", lat:36.9825000, lon:108.1594440, type:"现代吴起县城参考点", note:"中央红军主力于1935年10月19日到达陕北吴起镇。当前标记采用现代吴起县城参考坐标。"},
    tongjiang: {name:"通江（川陕根据地区域）", province:"四川省巴中市", lat:32.1198034, lon:107.3721286, type:"现代通江县参考点", note:"红四方面军长征的重要出发区域之一。地图使用现代通江县参考坐标。"},
    maoxian: {name:"茂县", province:"四川省阿坝州", lat:31.6835061, lon:103.8507078, type:"现代茂县参考点", note:"红四方面军长征过程中经过的川西地区之一。此处为现代县城参考点。"},
    ganzi: {name:"甘孜", province:"四川省甘孜州", lat:31.6273563, lon:99.9886967, type:"现代甘孜镇参考点", note:"1936年6月，红二、红六军团在甘孜地区与红四方面军会师。"},
    huining: {name:"会宁", province:"甘肃省白银市", lat:35.6894700, lon:105.0558676, type:"现代会师镇参考点", note:"1936年10月9日，红一、红四方面军在甘肃会宁会师。"},
    sangzhi: {name:"桑植（刘家坪所在县域）", province:"湖南省张家界市", lat:29.5740010, lon:110.1724850, type:"现代桑植县城参考点", note:"1935年11月19日，红二、红六军团从桑植刘家坪等地出发。此坐标是县城参考点，不是刘家坪旧址坐标。"},
    bijie: {name:"毕节", province:"贵州省", lat:27.2150032, lon:105.2151660, type:"现代毕节市参考点", note:"红二、红六军团1936年初转战黔西、大定、毕节地区。"},
    lijiang: {name:"丽江（石鼓地区）", province:"云南省", lat:26.8595868, lon:100.2249797, type:"现代丽江市参考点", note:"红二、红六军团经滇北向西推进，并在石鼓、巨甸等处渡过金沙江。此处定位丽江市域，不是石鼓渡口。"},
    xiji: {name:"将台堡所在县域（西吉）", province:"宁夏回族自治区固原市", lat:35.9652832, lon:105.7417568, type:"现代西吉县参考点", note:"1936年10月22日，红一、红二方面军在将台堡会师。标记采用今宁夏西吉县参考坐标，不是将台堡旧址的精确坐标。"},
    luoshan: {name:"罗山（何家冲所在县域）", province:"河南省信阳市", lat:32.0319640, lon:114.4366260, type:"现代罗山县参考点", note:"1934年11月16日，红二十五军从河南罗山县何家冲出发。当前为罗山县域参考坐标。"},
    luonan: {name:"洛南", province:"陕西省商洛市", lat:34.1619440, lon:110.2275000, type:"现代洛南县参考点", note:"红二十五军转战豫西、陕南地区的重要区域之一。坐标为现代县域参考点。"},
    yanchuan: {name:"永坪镇所在县域（延川）", province:"陕西省延安市", lat:36.8819440, lon:110.0219440, type:"现代延川县参考点", note:"1935年9月，红二十五军在延川县永坪镇与红二十六、红二十七军会师。标记采用现代延川县参考坐标。"}
  };

  const routes = {
    central: {name:"中央红军（红一方面军）", period:"1934.10 — 1935.10", color:"#d7a66d", text:"从中央革命根据地出发，经历湘江战役、遵义会议、四渡赤水、巧渡金沙江、强渡大渡河等重要阶段，1935年10月到达陕北吴起镇。", ids:["ruijin","yudu","zunyi","xiaojin","wuqi"], stops:["瑞金 / 中央革命根据地区域","于都 / 1934年10月出发","遵义 / 1935年1月遵义会议","小金（懋功）/ 1935年6月会师","吴起镇 / 1935年10月到达"]},
    fourth: {name:"红四方面军", period:"1935.03 — 1936.10", color:"#bd7566", text:"从川陕根据地区域出发，经过川西、懋功、甘孜等地，经历南下与北上等复杂历程，1936年10月9日在会宁与红一方面军会师。", ids:["tongjiang","maoxian","xiaojin","ganzi","huining"], stops:["通江 / 川陕根据地区域","茂县 / 川西行军区域","小金（懋功）/ 1935年6月会师","甘孜 / 1936年与红二、红六军团会合","会宁 / 1936年10月9日会师"]},
    second: {name:"红二、红六军团（后编为红二方面军）", period:"1935.11 — 1936.10", color:"#8da6a0", text:"从湖南桑植出发，转战贵州、云南，经石鼓等地渡过金沙江，1936年6月在甘孜与红四方面军会合，随后共同北上，于10月22日在将台堡会师。", ids:["sangzhi","bijie","lijiang","ganzi","xiji"], stops:["桑植 / 1935年11月出发","毕节 / 黔西、大定、毕节地区","丽江（石鼓地区）/ 渡金沙江区域","甘孜 / 1936年6月会合","将台堡所在县域 / 1936年10月22日会师"]},
    twentyfive: {name:"红二十五军", period:"1934.11 — 1935.09", color:"#c2a5c8", text:"1934年11月16日从河南罗山县何家冲出发，孤军北上，1935年9月在陕甘苏区永坪镇与红二十六、红二十七军会师，随后合编为红十五军团。", ids:["luoshan","luonan","yanchuan"], stops:["罗山（何家冲所在县域）/ 1934年11月16日出发","洛南 / 豫西、陕南转战区域","永坪镇所在县域（延川）/ 1935年9月会师"]}
  };
  const routeKeys = Object.keys(routes);
  const allIds = [...new Set(Object.values(routes).flatMap(r => r.ids))];

  { // V6: local SVG coordinate atlas; no CDN, tile server, or network request.
    const bounds = {minLon:99.0,maxLon:116.5,minLat:24.5,maxLat:38.0};
    const xy = place => ({x:38+(place.lon-bounds.minLon)/(bounds.maxLon-bounds.minLon)*824,y:500-(place.lat-bounds.minLat)/(bounds.maxLat-bounds.minLat)*460});
    const fallbackRoutes = routeKeys.map(key => {
      const route = routes[key];
      const points = route.ids.map(id => xy(places[id]));
      const path = points.map((pt,i)=>`${i===0?'M':'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
      const circles = route.ids.map(id => { const pt=xy(places[id]); return `<circle cx="${pt.x}" cy="${pt.y}" r="6" fill="#211d1d" stroke="${route.color}" stroke-width="3"/>`; }).join('');
      return `<g data-fallback-route="${key}" fill="none"><path d="${path}" stroke="${route.color}" stroke-width="3" stroke-dasharray="8 10" opacity=".9"/>${circles}</g>`;
    }).join('');
    const labels = allIds.map(id => { const pt=xy(places[id]); return `<g class="fallback-place" data-fallback-point="${id}" tabindex="0" role="button" aria-label="查看${places[id].name}"><circle cx="${pt.x}" cy="${pt.y}" r="10" fill="transparent"/><circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#e8d6b9"/><text x="${pt.x+9}" y="${pt.y-8}">${places[id].name}</text></g>`; }).join('');
    mapNode.innerHTML = `<svg class="geo-fallback-map" viewBox="0 0 900 540" role="img" aria-label="按经纬度相对位置绘制的长征历史地点坐标示意图"><defs><pattern id="fallbackGrid" width="45" height="45" patternUnits="userSpaceOnUse"><path d="M45 0H0V45" fill="none" stroke="#d1b98e" stroke-opacity=".12"/></pattern></defs><rect width="900" height="540" fill="#293230"/><rect width="900" height="540" fill="url(#fallbackGrid)"/><path d="M40 70H860M40 185H860M40 300H860M40 415H860" stroke="#d1b98e" stroke-opacity=".13" stroke-dasharray="2 8"/><g font-size="11" fill="#a89b87"><text x="42" y="28">东经 99°—116.5° · 北纬 24.5°—38°</text><text x="42" y="525">坐标相对位置示意 · 非精确历史行军轨迹</text></g>${fallbackRoutes}${labels}</svg>`;
    const updateFallback = key => {
      buttons.forEach(btn=>{const active=btn.dataset.geoRoute===key;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
      mapNode.querySelectorAll('[data-fallback-route]').forEach(el=>{el.style.display=key==='all'||el.dataset.fallbackRoute===key?'':'none';});
      const activeIds=key==='all'?allIds:routes[key].ids;
      mapNode.querySelectorAll('[data-fallback-point]').forEach(el=>{const id=el.dataset.fallbackPoint;el.style.display=activeIds.includes(id)?'':'none';});
      if(key==='all'){detailKicker.textContent='ROUTE OVERVIEW / 04 COLUMNS';detailTitle.textContent='四路红军的历史坐标';detailText.textContent='当前为本地经纬度坐标示意图，无需网络即可使用。节点间虚线仅表达地理关系，不是历史行军轨迹。';detailStops.innerHTML='<li>中央红军：于都—遵义—懋功—吴起镇</li><li>红四方面军：川陕根据地—川西—甘孜—会宁</li><li>红二方面军：桑植—黔滇—甘孜—将台堡</li><li>红二十五军：罗山—豫西陕南—永坪镇</li>';}else{const route=routes[key];detailKicker.textContent=`SELECTED ROUTE / ${key.toUpperCase()}`;detailTitle.textContent=route.name;detailText.textContent=route.text+' 当前地图为离线坐标示意。';detailStops.innerHTML=route.stops.map(item=>`<li>${item}</li>`).join('');}
      if(status)status.textContent='离线地图已就绪 · 路线筛选与地点说明均可离线使用';
    };
    buttons.forEach(btn=>btn.addEventListener('click',()=>updateFallback(btn.dataset.geoRoute)));
    mapNode.querySelectorAll('[data-fallback-point]').forEach(el=>{const show=()=>{const place=places[el.dataset.fallbackPoint];detailKicker.textContent='PLACE RECORD / COORDINATE';detailTitle.textContent=place.name;detailText.textContent=`${place.province} · ${place.type}。${place.note}`;detailStops.innerHTML=`<li>参考坐标：${place.lat.toFixed(4)}°N，${place.lon.toFixed(4)}°E</li><li>坐标仅定位现代地名，不表示历史驻地或具体事件现场</li>`;};el.addEventListener('click',show);el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();show();}});});
    updateFallback('all');
    return;
  }

})();
