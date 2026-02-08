// RMC To Go - Optimized/Compacted for mobile use
//
// --- HUD position and style injection ---
(function() {
    // Style for bottom-right HUD
    const style = document.createElement('style');
    style.innerHTML = `
    #map-hud-box {
        position: fixed;
        z-index: 10002;
        bottom: 18px;
        right: 18px;
        background: rgba(26,26,26,0.96);
        color: #e7ffe1;
        border-radius: 9px;
        border: 2px solid #3b403a;
        box-shadow: 0 2px 14px #000b;
        min-width: 215px;
        max-width: 320px;
        font-family: 'Courier New',Courier,monospace;
        font-size: 0.98rem;
        padding: 13px 16px 12px 16px;
        transition: opacity 0.15s, bottom 0.2s;
        display: none;
        user-select: text;
        line-height: 1.38;
    }
    #map-hud-box .hud-hide-btn {
        position: absolute;
        top: 7px; 
        right: 7px;
        border: none;
        background: #222;
        color: #6AD44C;
        font-size: 1.05rem;
        border-radius: 5px;
        width: 26px; height: 26px;
        cursor: pointer;
        opacity: .86;
        padding:0;
        font-family: inherit;
        transition: background .14s;
    }
    #map-hud-box .hud-hide-btn:hover {
        background: #2c2c2f;
    }
    .hud-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 5px;
        font-size: 1rem;
        font-family: inherit;
    }
    .hud-label {color: #6AD44C; opacity: .98; font-weight: bold;}
    .hud-val {color: #fff; font-weight: bold;}
    #hud-box-compact-txt {
        padding-top:4px;padding-bottom:2px;
    }
    .obj-list {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        margin-top: 6px;
    }
    .obj-btn {
        border: none;
        border-radius: 5px;
        background: #232c25;
        color: #fff;
        font-weight: 600;
        padding: 4px 10px;
        font-size: 0.83rem;
        min-width: 78px;
        transition: background .12s, box-shadow .13s, transform .09s;
        cursor: pointer;
        box-shadow: 0 1px 5px #0004,0 1.5px 4px #2323;
        outline: none;
        letter-spacing:.02em;
    }
    .obj-btn:hover, .obj-btn:focus {
        background: #313;
        color: #6AD44C;
        transform: scale(1.07);
    }
    @media (max-width:600px){
        #map-hud-box {right:9px;bottom:9px;min-width:106px;max-width:91vw;padding:8px 7px;}
        .obj-btn {min-width:52px;font-size:0.74rem;padding:3px 6px;}
        .hud-row{gap:7px;font-size:0.97rem;}
    }
    `;
    document.head.appendChild(style);

    // Create HUD box and append to body
    const hudBox = document.createElement('div');
    hudBox.id = 'map-hud-box';
    hudBox.innerHTML = `
        <button class="hud-hide-btn" title="Hide" onclick="hideHudBox()">×</button>
        <div id="hud-box-compact-txt"></div>
    `;
    document.body.appendChild(hudBox);

    // Add a global accessor for updating it
    window._setHudBox = function(html) {
        // show and set content
        hudBox.style.display = "block";
        document.getElementById('hud-box-compact-txt').innerHTML = html;
    };
    window.hideHudBox = function() {
        hudBox.style.display = "none";
    };
    // Also show on click of topbar .cal-info for ease
    setTimeout(()=>{
        let ci = document.getElementById('cal-info'); 
        if(ci){ ci.style.cursor="pointer"; ci.onclick=()=>{if(hudBox.style.display!=="block"){hudBox.style.display="block";} }; }
    },350);
})();

const canvas = document.getElementById('mapCanvas'), ctx = canvas.getContext('2d'), mapImg = new Image();
mapImg.src = 'Map.jpg';

// Mobile-optimized sizing
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

// --- Configs & Master Data
const PLAYER_SPEED = 48, HUMAN_ERR = 1.5, MIN_ZOOM = 0.2, MAX_ZOOM = 5.0, DEF_ZOOM = 0.6;
const MASTER_DATA = [{"x":560,"y":316,"type":"EXTRACT","label":"2345, 1375","gx":2345,"gy":1375},{"x":1113,"y":801,"type":"EXTRACT","label":"-1122, -1756","gx":-1122,"gy":-1756},{"x":928.2804180666083,"y":134.0164079713129,"type":"EXTRACT","label":"72, 2448","gx":72,"gy":2448},{"x":723,"y":847,"type":"BRIEF","label":"1119, -2009","gx":1119,"gy":-2009},{"x":669,"y":830,"type":"BLUE","label":"1637, -1912","gx":1637,"gy":-1912},{"x":689,"y":881,"type":"SAFE","label":"1488, -2371","gx":1488,"gy":-2371},{"x":662,"y":966,"type":"EXTRACT","label":"1768, -2815","gx":1768,"gy":-2815},{"x":1087,"y":398,"type":"GREEN","label":"-1209, 728","gx":-1209,"gy":728},{"x":1109,"y":405,"type":"BRIEF","label":"-1589, 755","gx":-1589,"gy":755},{"x":1086.0804180666082,"y":246.8164079713129,"type":"RED","label":"-1048, 1726","gx":-1048,"gy":1726},{"x":1095.4804180666083,"y":223.2164079713129,"type":"SAFE","label":"-1177, 1834","gx":-1177,"gy":1834},{"x":717,"y":426,"type":"RED","label":"1317, 596","gx":1317,"gy":596},{"x":691,"y":324,"type":"BLUE","label":"1488, 1239","gx":1488,"gy":1239},{"x":663,"y":302,"type":"BRIEF","label":"1672, 1378","gx":1672,"gy":1378},{"x":599,"y":228,"type":"RED","label":"2093, 1845","gx":2093,"gy":1845},{"x":596,"y":191,"type":"SAFE","label":"2112, 2078","gx":2112,"gy":2078},{"x":621,"y":136,"type":"BRIEF","label":"1948, 2425","gx":1948,"gy":2425},{"x":504.5359640180383,"y":78.91629194261012,"type":"EXTRACT","label":"2810, 2734","gx":2810,"gy":2734},{"x":756.7680851487163,"y":43.400431199511274,"type":"EXTRACT","label":"975, 2942","gx":975,"gy":2942},{"x":1287.2804180666083,"y":228.6164079713129,"type":"EXTRACT","label":"-2557, 1800","gx":-2557,"gy":1800},{"x":1413.585919310431,"y":480.08240572385085,"type":"EXTRACT","label":"-3347, 218","gx":-3347,"gy":218},{"x":1438.6185303040886,"y":636.1597218485776,"type":"EXTRACT","label":"-3498, -728","gx":-3498,"gy":-728},{"x":1287.5534576139914,"y":743.0059949004499,"type":"EXTRACT","label":"-2492, -1396","gx":-2492,"gy":-1396},{"x":492,"y":540,"type":"GREEN","label":"2797, -123","gx":2797,"gy":-123},{"x":506,"y":551,"type":"BRIEF","label":"2705, -192","gx":2705,"gy":-192},{"x":451,"y":574,"type":"SAFE","label":"3066, -337","gx":3066,"gy":-337},{"x":572,"y":678,"type":"SAFE","label":"2270, -993","gx":2270,"gy":-993},{"x":554,"y":684,"type":"BRIEF","label":"2389, -1031","gx":2389,"gy":-1031},{"x":767,"y":523,"type":"SAFE","label":"988, -16","gx":988,"gy":-16},{"x":687,"y":465,"type":"BRIEF","label":"1514, 350","gx":1514,"gy":350},{"x":1060,"y":505,"type":"BRIEF","label":"-939, 98","gx":-939,"gy":98},{"x":865,"y":578,"type":"BRIEF","label":"343, -362","gx":343,"gy":-362},{"x":1066,"y":693,"type":"BRIEF","label":"-979, -1087","gx":-979,"gy":-1087},{"x":1212.0815966287541,"y":811.8855073646067,"type":"BRIEF","label":"-2005, -1781","gx":-2005,"gy":-1781},{"x":1211.281596628754,"y":804.6855073646068,"type":"SAFE","label":"-1814, -1724","gx":-1814,"gy":-1724},{"x":853,"y":558,"type":"SAFE","label":"422, -236","gx":422,"gy":-236},{"x":1221,"y":534,"type":"SAFE","label":"-1998, -85","gx":-1998,"gy":-85},{"x":741,"y":624,"type":"BLUE","label":"1159, -652","gx":1159,"gy":-652},{"x":1175.8888854980469,"y":587,"type":"BRIEF","label":"-1701, -419","gx":-1701,"gy":-419},{"x":874.8888854980469,"y":184,"type":"LOCATION","label":"Brick House [279, 2124]","gx":279,"gy":2124},{"x":775.8888854980469,"y":214,"type":"LOCATION","label":"Metal Shack [930, 1935]","gx":930,"gy":1935},{"x":628.8888854980469,"y":193,"type":"LOCATION","label":"Dusty Depot [1923, 2162]","gx":1923,"gy":2162},{"x":712.8888854980469,"y":302,"type":"LOCATION","label":"Dig Site [1345, 1380]","gx":1345,"gy":1380},{"x":619.8888854980469,"y":610,"type":"LOCATION","label":"Cross Fire [2068, -457]","gx":2068,"gy":-457},{"x":758.8888854980469,"y":822,"type":"LOCATION","label":"Airfeild [1042, -1901]","gx":1042,"gy":-1901},{"x":934.8888854980469,"y":774,"type":"LOCATION","label":"Watch Tower [-162, -1548]","gx":-162,"gy":-1548},{"x":970.8888854980469,"y":810,"type":"LOCATION","label":"Brick House [-286, -1750]","gx":-286,"gy":-1750},{"x":889.8888854980469,"y":637,"type":"LOCATION","label":"Bridge [180, -627]","gx":180,"gy":-627},{"x":942.8888854980469,"y":541,"type":"LOCATION","label":"Fishing Village [-168, 4]","gx":-168,"gy":4},{"x":1024.129858213574,"y":201.178800791704,"type":"LOCATION","label":"Watch Tower [-707, 2027]","gx":-707,"gy":2027},{"x":1156.0972068320184,"y":372.7052838826638,"type":"LOCATION","label":"Bunker Lift [-1570, 942]","gx":-1570,"gy":942},{"x":981.0344315141286,"y":396.4087627187644,"type":"LOCATION","label":"Barracks [-417, 792]","gx":-417,"gy":792},{"x":1065.9514763863472,"y":406.0244648737524,"type":"LOCATION","label":"Bunker [-976, 732]","gx":-976,"gy":732},{"x":1127.4483800108287,"y":643.3229650993346,"type":"LOCATION","label":"Cabin [-1381, -762]","gx":-1381,"gy":-762},{"x":1070.9556962559316,"y":692.4798218125717,"type":"LOCATION","label":"Watch Tower [-1009, -1071]","gx":-1009,"gy":-1071},{"x":1208.836975166696,"y":570.1970616985249,"type":"LOCATION","label":"Big Town [-1917, -301]","gx":-1917,"gy":-301},{"x":1334.8888854980469,"y":516,"type":"LOCATION","label":"Cabin [-2746, 29]","gx":-2746,"gy":29},{"x":1336.0804180666082,"y":298.0164079713129,"type":"LOCATION","label":"Cabin [-2755, 1413]","gx":-2755,"gy":1413},{"x":1212.281596628754,"y":796.4855073646067,"type":"LOCATION","label":"kill house [-1940, -1724]","gx":-1940,"gy":-1724},{"x":1220.8888854980469,"y":650,"type":"BLUE","label":"BLUE [-1997, -804]","gx":-1997,"gy":-804},{"x":809.0621814446947,"y":306.538871600125,"type":"LOCATION","label":"Cabin [716, 1358]","gx":716,"gy":1358}];
let markers = JSON.parse(localStorage.getItem('savedMarkers')) || MASTER_DATA.slice();
if (markers.length === 0) markers = MASTER_DATA.slice();
let mouseX=0, mouseY=0, isDrag=0, lastX=0, lastY=0, showMarkers=1, isWaitLoc=0, pendAir=0, searchTargetType = null, activeTarget = null, pulseEndTime = 0;
let mapConfig = { active: 0, scaleX:1, scaleY:1, offsetX:0, offsetY:0 };

const colors = { GREEN:"#6AD44C", BLUE:"#4C92D4", RED:"#EB564F", SAFE:"#F3E57A", BRIEF:"#714E2E", EXTRACT:"#AD30D3", LOCATION:"#fff", AIRDROP:"#ff0", PLAYER:"#0ff" };

// Center and zoom-to-(0,0) logic
function centerToZeroZoom(smooth=1) {
    // Find map pixel for world (0,0) using calibration if available
    let zero = mapConfig.active ? getPixelFromGame(0,0) : {x:mapImg.width/2, y:mapImg.height/2};
    let nx = (canvas.width/2)-(zero.x*DEF_ZOOM), ny=(canvas.height/2)-(zero.y*DEF_ZOOM);
    // Animate or snap
    if(smooth) {
        let steps=25, dx=(nx-targetView.x)/steps, dy=(ny-targetView.y)/steps, dz=(DEF_ZOOM-targetView.zoom)/steps, i=0;
        let anim=()=>{ 
            targetView.x+=dx;targetView.y+=dy;targetView.zoom+=dz;
            if(++i<steps) requestAnimationFrame(anim);
            else {targetView.x=nx;targetView.y=ny;targetView.zoom=DEF_ZOOM;}
        };
        anim();
    } else { targetView.x=nx; targetView.y=ny; targetView.zoom=DEF_ZOOM; }
}
let view = { x:0, y:0, zoom:DEF_ZOOM }, targetView = { x:0, y:0, zoom:DEF_ZOOM };

// ----------- Smooth zoom for tactical HUD (for nearest/airdrop zoomToFit) ------------
function animateMapTo(x, y, zoom, duration = 800) {
    let startX = targetView.x, startY = targetView.y, startZ = targetView.zoom;
    let dx = x - startX, dy = y - startY, dz = zoom - startZ;
    let startTime = performance.now();
    function step(now) {
        let t = Math.min(1, (now - startTime) / duration);
        t = t < 0.5 ? 2*t*t : 1-(-2*t+2)**2/2;
        targetView.x = startX + dx*t;
        targetView.y = startY + dy*t;
        targetView.zoom = startZ + dz*t;
        clampView();
        if (t < 1) requestAnimationFrame(step);
        else {targetView.x = x; targetView.y = y; targetView.zoom = zoom;clampView();}
    }
    requestAnimationFrame(step);
}

// Match the reset button handling to the working index.html approach

window.resetMap = function () {
    try {
        if (Array.isArray(window.markers)) window.markers = window.markers.filter(m => m.type !== 'PLAYER' && m.type !== 'AIRDROP');
        if (Array.isArray(markers)) markers = markers.filter(m => m.type !== 'PLAYER' && m.type !== 'AIRDROP');
        try {
            let orig = localStorage.getItem('savedMarkers');
            if (orig) {
                let arr = JSON.parse(orig);
                if (Array.isArray(arr)) {
                    arr = arr.filter(m => m.type !== 'PLAYER' && m.type !== 'AIRDROP');
                    localStorage.setItem('savedMarkers', JSON.stringify(arr));
                }
            }
        } catch (e) {}
        activeTarget = null; isWaitLoc = 0; pendAir = 0;
        if (typeof centerToZeroZoom === "function") centerToZeroZoom(1);
        if (typeof saveMarkers === "function") saveMarkers();
        if (typeof render === "function") render();
        else if (typeof draw === "function") draw();
    } catch (e) {}
};

// --- Mobile touch support (pan/zoom)
let pinchZooming = false;
let pinchStartDist = null, pinchStartZoom = null, pinchMid = null, pinchViewStart = null;
canvas.addEventListener('touchstart', e => {
    if (e.touches.length == 1) {
        isDrag = 1;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        pinchZooming = false;
    }
    if (e.touches.length == 2) {
        pinchZooming = true; isDrag = 0;
        const t0 = e.touches[0], t1 = e.touches[1];
        pinchStartDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        pinchStartZoom = targetView.zoom;
        pinchViewStart = { x: targetView.x, y: targetView.y, zoom: targetView.zoom };
        pinchMid = { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 };
        pinchMid.map = screenToMap(pinchMid.x, pinchMid.y);
    }
}, { passive: false });

canvas.addEventListener('touchmove', e => {
    if (pinchZooming && e.touches.length == 2) {
        const t0 = e.touches[0], t1 = e.touches[1];
        const curDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        const sensitivity = 1.14;
        let scale = Math.pow(curDist / (pinchStartDist || 1), sensitivity);
        let newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, pinchStartZoom * scale));
        let mx = pinchMid.x, my = pinchMid.y, mapAtPinch = pinchMid.map;
        targetView.zoom = view.zoom = newZoom;
        targetView.x = mx - mapAtPinch.x * newZoom;
        targetView.y = my - mapAtPinch.y * newZoom;
        clampView();
        view.x = targetView.x; view.y = targetView.y;
        e.preventDefault();
        return;
    }
    if (e.touches.length == 1 && isDrag) {
        let dx = e.touches[0].clientX - lastX;
        let dy = e.touches[0].clientY - lastY;
        targetView.x += dx; targetView.y += dy;
        clampView(); view.x = targetView.x; view.y = targetView.y;
        lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
    }
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', e => {
    isDrag = 0;
    if (e.touches.length < 2) {
        pinchZooming = false;
        pinchStartDist = null;
        pinchMid = null;
    }
}, { passive: false });

function formatTime(s){let m=Math.floor(s/60),sec=s%60;return m?`${m}m ${sec}s`:`${sec}s`;}
function getCleanName(l){return l?l.split('[')[0].split(/[0-9-]/)[0].trim():"";}
function clampView(){
    let zw=mapImg.width*targetView.zoom, zh=mapImg.height*targetView.zoom, buf=-100;
    let minX=buf-zw,maxX=canvas.width-buf,minY=buf-zh,maxY=canvas.height-buf;
    targetView.x=Math.min(maxX,Math.max(minX,targetView.x));
    targetView.y=Math.min(maxY,Math.max(minY,targetView.y));
}
function screenToMap(sx,sy){return{x:(sx-view.x)/view.zoom,y:(sy-view.y)/view.zoom};}
function getMarkerAtPos(mx,my){
    let r=Math.min(30/view.zoom,60);
    let candidates=markers.filter(m=>Math.hypot(mx-m.x,my-m.y)<r);
    return candidates.find(m=>m.type==="PLAYER"||m.type==="AIRDROP")||candidates[0]||null;
}

// Modified zoomToFit for smooth zoom
function zoomToFit(p1,p2){
    let pad=200, cx=(p1.x+p2.x)/2,cy=(p1.y+p2.y)/2, dx=Math.abs(p1.x-p2.x), dy=Math.abs(p1.y-p2.y);
    let zx=(canvas.width-pad)/(dx||1), zy=(canvas.height-pad)/(dy||1), z=Math.min(zx,zy,1.2);z=Math.max(z,MIN_ZOOM);
    let targetZoom = z;
    let targetX = (canvas.width/2)-(cx*targetZoom);
    let targetY = (canvas.height/2)-(cy*targetZoom);
    animateMapTo(targetX, targetY, targetZoom, 800);
}

// ---------------------------------------
// Custom HUD: use bottom right floating HUD box for tactical info

function updateTacticalHUD(player,target){
    activeTarget=target;pulseEndTime=Date.now()+15000;
    let d=Math.hypot(player.gx-target.gx,player.gy-target.gy), dir=getDirection(player,target);
    let eta=formatTime(Math.round((d/PLAYER_SPEED)*HUMAN_ERR));
    // Compact layout: one row per
    let html = `
    <div class="hud-row"><span class="hud-label">Obj</span><span class="hud-val">${getCleanName(target.label)}</span></div>
    <div class="hud-row"><span class="hud-label">Bear</span><span class="hud-val">${dir[0]}${dir.split(" ")[1]?dir.split(" ")[1][0]:''}</span>
    <span class="hud-label">Dist</span><span class="hud-val">${Math.round(d)}m</span>
    <span class="hud-label">ETA</span><span class="hud-val">${eta}</span></div>
    `;
    window._setHudBox(html);
    zoomToFit(player,target);
}
function getDirection(f,t){
    let n=t.gx-f.gx, e=t.gy-f.gy, a=Math.atan2(e,n)*180/Math.PI;if(a<0)a+=360;
    let d=["North","NE","East","SE","South","SW","West","NW"];
    return d[Math.round(a/45)%8];
}
function extractCoords(){markers.forEach(m=>{let p=m.label.match(/-?\d+(\.\d+)?/g);if(p&&p.length>=2){m.gx=+p[0];m.gy=+p[1];}});}
function getGameCoords(mx,my){
    if(mapConfig.active)return{x:Math.round(mx*mapConfig.scaleX+mapConfig.offsetX),y:Math.round(my*mapConfig.scaleY+mapConfig.offsetY),calibrated:true};
    return{x:0,y:0,calibrated:false};
}
function getPixelFromGame(gx,gy){
    if(!mapConfig.active)return null;
    return{x:(gx-mapConfig.offsetX)/mapConfig.scaleX,y:(gy-mapConfig.offsetY)/mapConfig.scaleY};
}
function addAirdrop(){
    let input=prompt("Enter Airdrop Coords (X, Y):");
    if(!input)return;
    let p=input.match(/-?\d+(\.\d+)?/g);
    if(p&&p.length>=2){
        let gx=+p[0],gy=+p[1],mp=getPixelFromGame(gx,gy)||{x:mapImg.width/2,y:mapImg.height/2}, mark={x:mp.x,y:mp.y,type:'AIRDROP',label:`Airdrop [${gx}, ${gy}]`,gx,gy,timestamp:Date.now()};
        markers.push(mark);saveMarkers();
        let player=markers.find(m=>m.type==='PLAYER');
        if(player)updateTacticalHUD(player,mark);
        else{
            pendAir=true;isWaitLoc=true;
            let z = 1.2;
            let tx = (canvas.width/2)-(mark.x*z);
            let ty = (canvas.height/2)-(mark.y*z);
            animateMapTo(tx, ty, z, 800);
            window._setHudBox("<div style='font-weight:bold;'>Airdrop added.<br>Tap your position.</div>");
        }
    }
}
function findNearest(){
    pendAir=0;isWaitLoc=1;activeTarget=null;
    window._setHudBox("<div style='font-weight:bold;'>Tap your position...</div>");
}
function showObjectiveMenu(){
    let opts=[
        {id:'GREEN',label:'Green',color:colors.GREEN},
        {id:'BLUE',label:'Blue',color:colors.BLUE},
        {id:'RED',label:'Red',color:colors.RED},
        {id:'SAFE',label:'Safe',color:colors.SAFE},
        {id:'BRIEF',label:'Brief',color:colors.BRIEF},
        {id:'EXTRACT',label:'Extract',color:colors.EXTRACT}
    ];
    let html = `<div><span style="font-weight:bold;color:#6AD44C;font-size:.97em;">Select Objective</span></div>
    <div class="obj-list">${opts.map(t=>
        `<button class="obj-btn" tabindex="0" style="color:${t.color};border: 1px solid ${t.color};background:rgba(34,48,34,0.8);"
        onclick="selectObjective('${t.id}')">${t.label}</button>`
    ).join('')}</div>`;
    window._setHudBox(html);
}
function selectObjective(type){
    searchTargetType=type;
    let p=markers.find(m=>m.type==='PLAYER');if(!p)return;
    let c=markers.filter(m=>m.type===type&&m.gx!==undefined);
    if(c.length){
        let n=c[0],d=Infinity;
        c.forEach(e=>{let dd=Math.hypot(p.gx-e.gx,p.gy-e.gy);if(dd<d){d=dd;n=e;}});
        updateTacticalHUD(p,n);
    }else{
        window._setHudBox(`<div style="font-weight:bold;">No ${type} found.</div>`);
        setTimeout(showObjectiveMenu,1200);
    }
}
function saveMarkers(){
    extractCoords();
    let t=markers.filter(m=>m.gx!==undefined&&m.gy!==undefined);
    if(t.length>=2){
        let sXp=0,sYp=0,sXg=0,sYg=0;
        t.forEach(m=>{sXp+=m.x;sYp+=m.y;sXg+=m.gx;sYg+=m.gy;});
        let axp=sXp/t.length,ayp=sYp/t.length,axg=sXg/t.length,ayg=sYg/t.length;
        let numX=0,denX=0,numY=0,denY=0;
        t.forEach(m=>{numX+=(m.x-axp)*(m.gx-axg);denX+=(m.x-axp)**2;numY+=(m.y-ayp)*(m.gy-ayg);denY+=(m.y-ayp)**2;});
        mapConfig.scaleX=numX/(denX||1);mapConfig.scaleY=numY/(denY||1);mapConfig.offsetX=axg-(axp*mapConfig.scaleX);mapConfig.offsetY=ayg-(ayp*mapConfig.scaleY);mapConfig.active=1;
    }
    localStorage.setItem('savedMarkers',JSON.stringify(markers));
}
function render(){
    let k=0.08;
    if(!isDrag){view.zoom+=(targetView.zoom-view.zoom)*k;view.x+=(targetView.x-view.x)*k;view.y+=(targetView.y-view.y)*k;}
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.translate(view.x,view.y);ctx.scale(view.zoom,view.zoom);
    ctx.drawImage(mapImg,0,0);
    let mapMouse=screenToMap(mouseX,mouseY), hovered=getMarkerAtPos(mapMouse.x,mapMouse.y), g=getGameCoords(mapMouse.x,mapMouse.y);
    markers.forEach(m=>{
        let pulsing=(m===activeTarget&&Date.now()<pulseEndTime),always=(m.type==="PLAYER"||m.type==="AIRDROP"||pulsing);
        if(showMarkers||always){
            if(pulsing){
                let pulse=(Math.sin(Date.now()/150)+1)/2;
                ctx.beginPath();ctx.arc(m.x,m.y,(10+pulse*30)/view.zoom,0,2*Math.PI);
                ctx.strokeStyle=colors[m.type];ctx.lineWidth=4/view.zoom;ctx.stroke();
            }
            ctx.beginPath();ctx.arc(m.x,m.y,8/view.zoom,0,2*Math.PI);
            ctx.fillStyle=colors[m.type];ctx.fill();
            ctx.strokeStyle=pulsing?"#fff":"rgba(255,255,255,0.8)";
            ctx.lineWidth=2/view.zoom;ctx.stroke();
            if(showMarkers||always){
                if(m===hovered||pulsing||m.type==="PLAYER"){
                    ctx.font=`bold ${14/view.zoom}px sans-serif`;
                    ctx.fillStyle="#fff";
                    ctx.fillText(getCleanName(m.label),m.x+12/view.zoom,m.y-12/view.zoom);
                }
            }
        }
    });
    ctx.setTransform(1,0,0,1,0,0);
    let hud=isWaitLoc?"TAP YOUR POSITION":`X: ${g.x}, Y: ${g.y}`,hudColor=isWaitLoc?"#0ff":"#6AD44C";
    if(hovered&&hovered.gx!==undefined){hud=`LOCKED: ${hovered.gx}, ${hovered.gy}`;hudColor=colors[hovered.type];}
    ctx.fillStyle="rgba(0,0,0,0.8)";ctx.fillRect(mouseX+15,mouseY+15,ctx.measureText(hud).width+12,25);
    ctx.fillStyle=hudColor;ctx.font="bold 12px sans-serif";ctx.fillText(hud,mouseX+21,mouseY+32);
    requestAnimationFrame(render);
}

// --- Mouse Input
canvas.addEventListener('mousedown',e=>{
    const r=canvas.getBoundingClientRect(), sx=e.clientX-r.left, sy=e.clientY-r.top, mp=screenToMap(sx,sy),m=getMarkerAtPos(mp.x,mp.y);
    if(e.button===0){
        if(isWaitLoc){
            let my=getGameCoords(mp.x,mp.y),p={x:mp.x,y:mp.y,type:'PLAYER',label:"Me",gx:my.x,gy:my.y,timestamp:Date.now()};
            markers=markers.filter(m=>m.type!=='PLAYER');markers.push(p);isWaitLoc=0;
            if(pendAir){
                let lastDrop=markers.filter(m=>m.type==='AIRDROP').pop();
                if(lastDrop)updateTacticalHUD(p,lastDrop);pendAir=0;
            }else showObjectiveMenu();
            saveMarkers();return;
        }
    }
    if(e.button===1||(e.button===0)){isDrag=1;lastX=e.clientX;lastY=e.clientY;}
    if(e.button===2){
        e.preventDefault();
        if(m&&(m.type==='AIRDROP'||m.type==='PLAYER')){
            markers=markers.filter(mark=>mark!==m);
            if(activeTarget===m)activeTarget=null;
            saveMarkers();
        }
    }
});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mouseX=e.clientX-r.left;mouseY=e.clientY-r.top;if(isDrag){targetView.x+=e.clientX-lastX;targetView.y+=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;clampView();view.x=targetView.x;view.y=targetView.y;}});
window.addEventListener('mouseup',()=>{isDrag=0;});
canvas.addEventListener('wheel',e=>{
    e.preventDefault();
    let scale=-e.deltaY*0.001,nz=targetView.zoom+scale;
    nz=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,nz));
    let mapMouse=screenToMap(mouseX,mouseY);
    targetView.zoom=nz;view.zoom=nz;
    targetView.x=mouseX-mapMouse.x*targetView.zoom;
    targetView.y=mouseY-mapMouse.y*targetView.zoom;
    clampView();view.x=targetView.x;view.y=targetView.y;
},{passive:!1});
function toggleVisibility(){showMarkers=!showMarkers;}

mapImg.onload=()=>{
    resizeCanvas();
    extractCoords();
    saveMarkers();
    centerToZeroZoom(0);
    render();
};
