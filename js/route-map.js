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
    cangxi: {name:"苍溪红军渡纪念地", province:"四川省广元市苍溪县", lat:31.7283333, lon:105.9544444, type:"现代红军渡纪念地参考坐标", note:"1935年3月28日红四方面军强渡嘉陵江战役的主渡口位于苍溪塔子山湾一带。当前坐标参考现代红军渡纪念地，不是历史渡口遗址的精确测绘坐标。"},
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
    fourth: {name:"红四方面军", period:"1935.03 — 1936.10", color:"#bd7566", text:"从川陕根据地区域出发，经过川西、懋功、甘孜等地，经历南下与北上等复杂历程，1936年10月9日在会宁与红一方面军会师。", ids:["tongjiang","cangxi","maoxian","xiaojin","ganzi","huining"], stops:["通江 / 川陕根据地区域","苍溪红军渡 / 1935年3月28日强渡嘉陵江","茂县 / 川西行军区域","小金（懋功）/ 1935年6月会师","甘孜 / 1936年与红二、红六军团会合","会宁 / 1936年10月9日会师"]},
    second: {name:"红二、红六军团（后编为红二方面军）", period:"1935.11 — 1936.10", color:"#8da6a0", text:"从湖南桑植出发，转战贵州、云南，经石鼓等地渡过金沙江，1936年6月在甘孜与红四方面军会合，随后共同北上，于10月22日在将台堡会师。", ids:["sangzhi","bijie","lijiang","ganzi","xiji"], stops:["桑植 / 1935年11月出发","毕节 / 黔西、大定、毕节地区","丽江（石鼓地区）/ 渡金沙江区域","甘孜 / 1936年6月会合","将台堡所在县域 / 1936年10月22日会师"]},
    twentyfive: {name:"红二十五军", period:"1934.11 — 1935.09", color:"#c2a5c8", text:"1934年11月16日从河南罗山县何家冲出发，孤军北上，1935年9月在陕甘苏区永坪镇与红二十六、红二十七军会师，随后合编为红十五军团。", ids:["luoshan","luonan","yanchuan"], stops:["罗山（何家冲所在县域）/ 1934年11月16日出发","洛南 / 豫西、陕南转战区域","永坪镇所在县域（延川）/ 1935年9月会师"]}
  };
  const routeKeys = Object.keys(routes);
  const allIds = [...new Set(Object.values(routes).flatMap(r => r.ids))];
  const timelineEvents = [
    {date:"1934.10",title:"中央红军从于都等地出发",route:"central",place:"yudu",source:"https://www.mod.gov.cn/gfbw/gfjy_index/16418522.html"},
    {date:"1934.11.16",title:"红二十五军从河南罗山何家冲出发",route:"twentyfive",place:"luoshan",source:"https://www.dswxyjy.org.cn/n1/2026/0903/c244516-40791810.html"},
    {date:"1935.01",title:"遵义会议召开",route:"central",place:"zunyi",source:"https://www.miit.gov.cn/ztzl/rdzt/dsxxjyzl/xxzl/art/2021/art_a43d76bc5e694806889c07fc36ec6adc.html"},
    {date:"1935.03.28",title:"红四方面军强渡嘉陵江，开始战略转移",route:"fourth",place:"cangxi",source:"https://dangshi.people.com.cn/n1/2016/1010/c85037-28763953.html"},
    {date:"1935.06.12—18",title:"红一、红四方面军先头部队在达维会师，中央红军主力抵达懋功",route:"central",place:"xiaojin",source:"https://www.mod.gov.cn/gfbw/gfjy_index/16418522.html"},
    {date:"1935.09.15—16",title:"红二十五军抵达永坪；次日与红二十六、红二十七军会师",route:"twentyfive",place:"yanchuan",source:"https://www.mod.gov.cn/gfbw/gfjy_index/16418522.html"},
    {date:"1935.10.19",title:"中央红军主力到达吴起镇",route:"central",place:"wuqi",source:"https://www.mod.gov.cn/gfbw/gfjy_index/16418522.html"},
    {date:"1935.11.19",title:"红二、红六军团从桑植出发",route:"second",place:"sangzhi",source:"https://www.dswxyjy.org.cn/GB/427277/462086/index.html"},
    {date:"1936.06下旬—07.02",title:"红二、红六军团抵达甘孜，与红四方面军会合",route:"second",place:"ganzi",source:"https://www.mod.gov.cn/gfbw/gfjy_index/zyhd/4848435.html"},
    {date:"1936.07.05",title:"红二方面军正式组成",route:"second",place:"ganzi",source:"https://www.mod.gov.cn/gfbw/gfjy_index/16418522.html"},
    {date:"1936.10.09",title:"红一、红四方面军在会宁会师",route:"fourth",place:"huining",source:"https://www.mod.gov.cn/gfbw/gfjy_index/16418522.html"},
    {date:"1936.10.22",title:"红一、红二方面军在将台堡会师",route:"second",place:"xiji",source:"https://www.mod.gov.cn/gfbw/gfjy_index/16418522.html"}
  ];
  const timelineList = document.getElementById("geoTimelineList");


  { // V6: local SVG coordinate atlas; no CDN, tile server, or network request.

    const bounds = {minLon:99.0,maxLon:116.5,minLat:24.5,maxLat:38.0};
    const xy = place => ({x:38+(place.lon-bounds.minLon)/(bounds.maxLon-bounds.minLon)*824,y:500-(place.lat-bounds.minLat)/(bounds.maxLat-bounds.minLat)*460});
    const project = (lon,lat) => xy({lon,lat});
    const linePath = coords => coords.map((p,i)=>{const q=project(p[0],p[1]);return (i?"L":"M")+q.x.toFixed(1)+","+q.y.toFixed(1);}).join(" ");
    const terrainContours = [
      "M30 355 C120 280 145 350 230 270 S360 230 420 290 S560 340 650 245 S790 210 880 265",
      "M20 390 C110 315 170 390 255 310 S370 270 435 330 S570 380 675 285 S800 250 890 305",
      "M40 425 C140 350 190 425 280 350 S390 315 455 370 S590 420 700 325 S815 290 890 345",
      "M55 175 C140 105 220 165 290 105 S430 70 500 135 S650 175 735 105 S830 95 890 130",
      "M45 210 C150 145 220 205 310 145 S440 115 515 175 S660 215 755 145 S840 135 900 170",
      "M80 255 C170 190 245 250 330 190 S455 165 530 225 S680 260 780 195 S850 185 900 220"
    ];
    const gridLines = [100,104,108,112,116].map(lon=>{const p=project(lon,31);return '<path class="geo-grid-line" d="M'+p.x+' 34V500"/><text class="geo-grid-label" x="'+(p.x+4)+'" y="48">'+lon+'°E</text>';}).join("") +
      [26,30,34,38].map(lat=>{const p=project(107,lat);return '<path class="geo-grid-line" d="M38 '+p.y+'H862"/><text class="geo-grid-label" x="44" y="'+(p.y-5)+'">'+lat+'°N</text>';}).join("");
    const rivers = [
      {name:"黄河上游",coords:[[99.2,35.3],[101.3,35.0],[103.4,35.6],[105.8,36.1],[108.5,36.3]]},
      {name:"长江上游",coords:[[99.1,31.5],[101.0,30.3],[103.2,29.7],[105.4,29.5],[108.0,29.8],[110.4,29.6]]},
      {name:"金沙江",coords:[[99.0,31.7],[100.2,29.8],[101.0,28.6],[102.2,27.4],[103.4,26.8]]},
      {name:"大渡河",coords:[[101.1,33.0],[101.8,31.9],[102.3,30.8],[103.0,29.7]]},
      {name:"嘉陵江",coords:[[104.1,34.4],[104.9,33.2],[105.4,32.4],[105.9,31.7],[106.2,30.9]]}
    ];
    const riverMarkup = rivers.map(r=>{const d=linePath(r.coords);const mid=r.coords[Math.floor(r.coords.length/2)];const p=project(mid[0],mid[1]);return '<g class="geo-river" data-terrain-layer><path d="'+d+'"/><text x="'+(p.x+8)+'" y="'+(p.y-7)+'">'+r.name+' · 示意</text></g>';}).join("");
    const terrainNames = [
      {name:"横断山地",lon:100.2,lat:29.4},{name:"川西高原",lon:102.4,lat:32.8},
      {name:"四川盆地",lon:105.4,lat:29.6},{name:"云贵高原",lon:103.8,lat:26.3},
      {name:"黄土高原",lon:108.2,lat:36.9},{name:"秦岭山地",lon:108.5,lat:33.5},
      {name:"武陵山区",lon:109.4,lat:28.8}
    ];
    const terrainLabels = terrainNames.map(t=>{const p=project(t.lon,t.lat);return '<text class="geo-terrain-label" data-terrain-layer x="'+p.x+'" y="'+p.y+'">'+t.name+'</text>';}).join("");
    const routeMarkup = routeKeys.map(key=>{
      const route=routes[key],pts=route.ids.map(id=>xy(places[id]));
      const d=pts.map((p,i)=>(i?"L":"M")+p.x.toFixed(1)+","+p.y.toFixed(1)).join(" ");
      const nodes=route.ids.map(id=>{const p=xy(places[id]);return '<circle class="geo-route-node" cx="'+p.x+'" cy="'+p.y+'" r="5.5" fill="#211d1d" stroke="'+route.color+'" stroke-width="2.6"/>';}).join("");
      const duration=key==="central"?"13s":key==="fourth"?"16s":key==="second"?"15s":"10s";
      return '<g data-fallback-route="'+key+'" class="geo-route-line"><path id="route-path-'+key+'" class="geo-route-path" d="'+d+'" stroke="'+route.color+'"/>'+nodes+'<circle class="geo-route-traveler" r="5" fill="'+route.color+'"><animateMotion dur="'+duration+'" repeatCount="indefinite"><mpath href="#route-path-'+key+'"/></animateMotion></circle></g>';
    }).join("");
    const labels = allIds.map(id=>{const pt=xy(places[id]);return '<g class="fallback-place" data-fallback-point="'+id+'" tabindex="0" role="button" aria-label="查看'+places[id].name+'"><circle class="geo-place-hit" cx="'+pt.x+'" cy="'+pt.y+'" r="32"/><circle class="geo-place-dot" cx="'+pt.x+'" cy="'+pt.y+'" r="6.5"/><text x="'+(pt.x+12)+'" y="'+(pt.y-10)+'">'+places[id].name+'</text></g>';}).join("");
    const mountains = '<g class="geo-mountain-ridges" data-terrain-layer><path d="M90 315 L130 255 L153 281 L185 205 L213 250 L245 180 L276 236 L310 190 L340 255 L370 220 L405 290"/><path d="M235 455 L275 385 L302 412 L342 335 L371 380 L408 315 L443 375 L475 345 L510 410"/><path d="M445 205 L480 145 L506 170 L540 108 L570 154 L606 94 L640 150 L672 118 L710 188"/><path d="M640 430 L678 365 L704 392 L740 320 L772 365 L806 310 L842 365"/></g>';
    mapNode.innerHTML = '<svg id="routeTerrainSvg" class="geo-fallback-map geo-terrain-svg" viewBox="0 0 900 540" role="img" aria-label="长征路线立体地形示意图，包含四路代表性路线、河流、山地、地理网格和历史地点参考坐标"><defs><linearGradient id="terrainBase" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#46524b"/><stop offset=".48" stop-color="#293b39"/><stop offset="1" stop-color="#1d292b"/></linearGradient><linearGradient id="mountainFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b7a17b" stop-opacity=".72"/><stop offset="1" stop-color="#53615a" stop-opacity=".06"/></linearGradient><pattern id="terrainGrid" width="45" height="45" patternUnits="userSpaceOnUse"><path d="M45 0H0V45" fill="none" stroke="#d1b98e" stroke-opacity=".08"/></pattern><filter id="terrainGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="540" fill="url(#terrainBase)"/><rect width="900" height="540" fill="url(#terrainGrid)"/><g class="geo-contours" data-terrain-layer>'+terrainContours.map(d=>'<path d="'+d+'"/>').join("")+'</g>'+mountains+'<g class="geo-grid">'+gridLines+'</g>'+riverMarkup+terrainLabels+'<g class="geo-map-heading"><text x="48" y="27">LONG MARCH · TERRAIN ATLAS</text><text x="850" y="27" text-anchor="end">99°E—116.5°E / 24.5°N—38°N</text></g><g class="geo-north-arrow"><path d="M835 75V116 M835 75L824 94 M835 75L846 94"/><text x="835" y="66" text-anchor="middle">N</text></g>'+routeMarkup+labels+'<g class="geo-map-foot"><text x="48" y="520">现代地名参考坐标 · 河流/山脉为地理示意 · 非精确历史轨迹</text><text x="850" y="520" text-anchor="end">© OpenStreetMap contributors</text></g></svg>';
    const tiltInput=document.getElementById("geoTilt"),tiltValue=document.getElementById("geoTiltValue");
    const terrainToggle=document.getElementById("geoTerrainToggle"),motionToggle=document.getElementById("geoMotionToggle"),resetView=document.getElementById("geoViewReset");
    const setTilt=value=>{const angle=Math.max(0,Math.min(46,Number(value)||0));mapNode.style.setProperty("--map-tilt",angle+"deg");if(tiltInput)tiltInput.value=String(angle);if(tiltValue)tiltValue.textContent=angle+"°";};
    if(tiltInput)tiltInput.addEventListener("input",()=>setTilt(tiltInput.value));
    if(terrainToggle)terrainToggle.addEventListener("click",()=>{const on=terrainToggle.getAttribute("aria-pressed")!=="true";terrainToggle.setAttribute("aria-pressed",String(on));terrainToggle.textContent="地形注记："+(on?"显示":"隐藏");mapNode.classList.toggle("terrain-muted",!on);});
    const prefersReduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let motionOn=!prefersReduced;
    const setMotion=on=>{motionOn=on;mapNode.classList.toggle("motion-paused",!on);if(motionToggle){motionToggle.setAttribute("aria-pressed",String(on));motionToggle.textContent="动态路线："+(on?"开启":"暂停");}};
    if(motionToggle){setMotion(motionOn);motionToggle.addEventListener("click",()=>setMotion(!motionOn));}
    if(resetView)resetView.addEventListener("click",()=>{setTilt(28);mapNode.classList.remove("terrain-muted");if(terrainToggle){terrainToggle.setAttribute("aria-pressed","true");terrainToggle.textContent="地形注记：显示";}setMotion(!prefersReduced);});
    let activeRouteKey="all";
    const updateFallback = key => {
      activeRouteKey=key;
      buttons.forEach(btn=>{const active=btn.dataset.geoRoute===key;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
      mapNode.querySelectorAll('[data-fallback-route]').forEach(el=>{el.style.display=key==='all'||el.dataset.fallbackRoute===key?'':'none';});
      const activeIds=key==='all'?allIds:routes[key].ids;
      mapNode.querySelectorAll('[data-fallback-point]').forEach(el=>{const id=el.dataset.fallbackPoint;el.style.display=activeIds.includes(id)?'':'none';});
      if(key==='all'){detailKicker.textContent='ROUTE OVERVIEW / 04 COLUMNS';detailTitle.textContent='四路红军的历史坐标';detailText.textContent='当前为本地经纬度坐标示意图，无需网络即可使用。节点间虚线仅表达地理关系，不是历史行军轨迹。';detailStops.innerHTML='<li>中央红军：于都—遵义—懋功—吴起镇</li><li>红四方面军：川陕根据地—川西—甘孜—会宁</li><li>红二方面军：桑植—黔滇—甘孜—将台堡</li><li>红二十五军：罗山—豫西陕南—永坪镇</li>';}else{const route=routes[key];detailKicker.textContent=`SELECTED ROUTE / ${key.toUpperCase()}`;detailTitle.textContent=route.name;detailText.textContent=route.text+' 当前地图为离线坐标示意。';detailStops.innerHTML=route.stops.map(item=>`<li>${item}</li>`).join('');}
      if(status)status.textContent='离线地图已就绪 · 路线筛选与地点说明均可离线使用';
    };
    const showPlace = id => {
      const place=places[id];
      detailKicker.textContent="PLACE RECORD / COORDINATE";
      detailTitle.textContent=place.name;
      detailText.textContent=place.province+" · "+place.type+"。"+place.note;
      const routeIds=activeRouteKey==="all"?allIds:(routes[activeRouteKey]?.ids||[]);
      const index=routeIds.indexOf(id),previous=index>0?places[routeIds[index-1]]:null;
      const rad=value=>value*Math.PI/180;
      const straight=previous?(()=>{const dLat=rad(place.lat-previous.lat),dLon=rad(place.lon-previous.lon),a=Math.sin(dLat/2)**2+Math.cos(rad(previous.lat))*Math.cos(rad(place.lat))*Math.sin(dLon/2)**2;return Math.round(6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));})():null;
      detailStops.innerHTML="<li>参考坐标："+place.lat.toFixed(4)+"°N，"+place.lon.toFixed(4)+"°E</li>"+(previous?"<li>与前一参考节点（"+previous.name+"）直线距离约 "+straight+" km；不是实际行军里程</li>":"<li>该路线起始参考节点，暂无前序节点距离</li>")+"<li>坐标仅定位现代地名，不表示历史驻地或具体事件现场</li>";
    };
    buttons.forEach(btn=>btn.addEventListener("click",()=>updateFallback(btn.dataset.geoRoute)));
    mapNode.querySelectorAll("[data-fallback-point]").forEach(el=>{
      const show=()=>showPlace(el.dataset.fallbackPoint);
      el.addEventListener("click",show);
      el.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();show();}});
    });
    const playbackPlay=document.getElementById("geoPlaybackPlay");
    const playbackPrev=document.getElementById("geoPlaybackPrev");
    const playbackNext=document.getElementById("geoPlaybackNext");
    const playbackRange=document.getElementById("geoPlaybackRange");
    const playbackOutput=document.getElementById("geoPlaybackOutput");
    const playbackSpeed=document.getElementById("geoPlaybackSpeed");
    const playbackStatus=document.getElementById("geoPlaybackStatus");
    let currentTimelineIndex=-1;
    let playbackTimer=null;
    const playbackDelay=()=>Number(playbackSpeed?.value||2800);
    const stopPlayback=()=>{
      if(playbackTimer!==null){window.clearInterval(playbackTimer);playbackTimer=null;}
      if(playbackPlay){playbackPlay.textContent="▶ 播放";}
    };
    const selectTimeline=index=>{
      const safeIndex=Math.max(0,Math.min(timelineEvents.length-1,Number(index)));
      const eventData=timelineEvents[safeIndex];
      if(!eventData)return;
      currentTimelineIndex=safeIndex;
      const button=timelineList?.querySelector('[data-timeline-index="'+safeIndex+'"]');
      updateFallback(eventData.route);
      showPlace(eventData.place);
      detailKicker.textContent="HISTORICAL EVENT / "+eventData.date;
      detailTitle.textContent=eventData.title;
      detailText.textContent=places[eventData.place].province+" · "+places[eventData.place].type+"。地图节点为现代地名参考坐标，不代表历史事件现场精确位置。";
      detailStops.innerHTML="<li>所属路线："+routes[eventData.route].name+"</li><li><a href=\\""+eventData.source+"\\" target=\\"_blank\\" rel=\\"noopener\\">查看对应史料来源 ↗</a></li>";
      timelineList?.querySelectorAll("button").forEach(item=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-pressed",String(active));});
      mapNode.querySelectorAll("[data-fallback-point]").forEach(item=>item.classList.toggle("event-current",item.dataset.fallbackPoint===eventData.place));
      if(playbackRange)playbackRange.value=String(safeIndex);
      if(playbackOutput)playbackOutput.textContent=(safeIndex+1)+" / "+timelineEvents.length+" · "+eventData.date;
      if(playbackStatus)playbackStatus.textContent="正在查看第 "+(safeIndex+1)+" 个事件："+eventData.title;
    };
    const stepTimeline=direction=>{
      const next=currentTimelineIndex<0?(direction>0?0:timelineEvents.length-1):currentTimelineIndex+direction;
      if(next<0||next>=timelineEvents.length){stopPlayback();return;}
      selectTimeline(next);
    };
    if(timelineList){
      timelineList.querySelectorAll("[data-timeline-index]").forEach(button=>{
        button.addEventListener("click",()=>{
          stopPlayback();
          selectTimeline(Number(button.dataset.timelineIndex));
          if(playbackStatus)playbackStatus.textContent="已手动定位历史事件；点击播放可继续自动演示。";
        });
      });
    }
    if(playbackPlay){
      playbackPlay.addEventListener("click",()=>{
        if(playbackTimer!==null){stopPlayback();if(playbackStatus)playbackStatus.textContent="播放已暂停";return;}
        if(currentTimelineIndex<0||currentTimelineIndex>=timelineEvents.length-1)selectTimeline(0);
        playbackPlay.textContent="Ⅱ 暂停";
        if(playbackStatus)playbackStatus.textContent="时间播放进行中";
        playbackTimer=window.setInterval(()=>{
          if(currentTimelineIndex>=timelineEvents.length-1){stopPlayback();if(playbackStatus)playbackStatus.textContent="演示完成";return;}
          selectTimeline(currentTimelineIndex+1);
          if(currentTimelineIndex===timelineEvents.length-1){stopPlayback();if(playbackStatus)playbackStatus.textContent="演示完成";}
        },playbackDelay());
      });
    }
    playbackPrev?.addEventListener("click",()=>{stopPlayback();stepTimeline(-1);});
    playbackNext?.addEventListener("click",()=>{stopPlayback();stepTimeline(1);});
    playbackRange?.addEventListener("input",()=>selectTimeline(playbackRange.value));
    playbackSpeed?.addEventListener("change",()=>{
      if(playbackTimer!==null){stopPlayback();playbackPlay?.click();}
    });
    updateFallback('all');
    return;
  }

})();
