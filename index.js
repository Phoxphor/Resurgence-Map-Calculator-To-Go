// RMC TO GO - MOBILE REWORK

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const mapImg = new Image();
mapImg.src = 'Map.jpg';

/** CONFIG **/
const PLAYER_SPEED = 48;
const HUMAN_ERROR_BUFFER = 1.5;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 5.0;

/** MASTER LANDMARKS PORT **/
const MASTER_DATA = [{"x":560,"y":316,"type":"EXTRACT","label":"2345, 1375","gx":2345,"gy":1375},{"x":1113,"y":801,"type":"EXTRACT","label":"-1122, -1756","gx":-1122,"gy":-1756},{"x":928.2804180666083,"y":134.0164079713129,"type":"EXTRACT","label":"72, 2448","gx":72,"gy":2448},{"x":723,"y":847,"type":"BRIEF","label":"1119, -2009","gx":1119,"gy":-2009},{"x":669,"y":830,"type":"BLUE","label":"1637, -1912","gx":1637,"gy":-1912},{"x":689,"y":881,"type":"SAFE","label":"1488, -2371","gx":1488,"gy":-2371},{"x":662,"y":966,"type":"EXTRACT","label":"1768, -2815","gx":1768,"gy":-2815},{"x":1087,"y":398,"type":"GREEN","label":"-1209, 728","gx":-1209,"gy":728},{"x":1109,"y":405,"type":"BRIEF","label":"-1589, 755","gx":-1589,"gy":755},{"x":1086.0804180666082,"y":246.8164079713129,"type":"RED","label":"-1048, 1726","gx":-1048,"gy":1726},{"x":1095.4804180666083,"y":223.2164079713129,"type":"SAFE","label":"-1177, 1834","gx":-1177,"gy":1834},{"x":717,"y":426,"type":"RED","label":"1317, 596","gx":1317,"gy":596},{"x":691,"y":324,"type":"BLUE","label":"1488, 1239","gx":1488,"gy":1239},{"x":663,"y":302,"type":"BRIEF","label":"1672, 1378","gx":1672,"gy":1378},{"x":599,"y":228,"type":"RED","label":"2093, 1845","gx":2093,"gy":1845},{"x":596,"y":191,"type":"SAFE","label":"2112, 2078","gx":2112,"gy":2078},{"x":621,"y":136,"type":"BRIEF","label":"1948, 2425","gx":1948,"gy":2425},{"x":504.5359640180383,"y":78.91629194261012,"type":"EXTRACT","label":"2810, 2734","gx":2810,"gy":2734},{"x":756.7680851487163,"y":43.400431199511274,"type":"EXTRACT","label":"975, 2942","gx":975,"gy":2942},{"x":1287.2804180666083,"y":228.6164079713129,"type":"EXTRACT","label":"-2557, 1800","gx":-2557,"gy":1800},{"x":1413.585919310431,"y":480.08240572385085,"type":"EXTRACT","label":"-3347, 218","gx":-3347,"gy":218},{"x":1438.6185303040886,"y":636.1597218485776,"type":"EXTRACT","label":"-3498, -728","gx":-3498,"gy":-728},{"x":1287.5534576139914,"y":743.0059949004499,"type":"EXTRACT","label":"-2492, -1396","gx":-2492,"gy":-1396},{"x":492,"y":540,"type":"GREEN","label":"2797, -123","gx":2797,"gy":-123},{"x":506,"y":551,"type":"BRIEF","label":"2705, -192","gx":2705,"gy":-192},{"x":451,"y":574,"type":"SAFE","label":"3066, -337","gx":3066,"gy":-337},{"x":572,"y":678,"type":"SAFE","label":"2270, -993","gx":2270,"gy":-993},{"x":554,"y":684,"type":"BRIEF","label":"2389, -1031","gx":2389,"gy":-1031},{"x":767,"y":523,"type":"SAFE","label":"988, -16","gx":988,"gy":-16},{"x":687,"y":465,"type":"BRIEF","label":"1514, 350","gx":1514,"gy":350},{"x":1060,"y":505,"type":"BRIEF","label":"-939, 98","gx":-939,"gy":98},{"x":865,"y":578,"type":"BRIEF","label":"343, -362","gx":343,"gy":-362},{"x":1066,"y":693,"type":"BRIEF","label":"-979, -1087","gx":-979,"gy":-1087},{"x":1212.0815966287541,"y":811.8855073646067,"type":"BRIEF","label":"-2005, -1781","gx":-2005,"gy":-1781},{"x":1211.281596628754,"y":804.6855073646068,"type":"SAFE","label":"-1814, -1724","gx":-1814,"gy":-1724},{"x":853,"y":558,"type":"SAFE","label":"422, -236","gx":422,"gy":-236},{"x":1221,"y":534,"type":"SAFE","label":"-1998, -85","gx":-1998,"gy":-85},{"x":741,"y":624,"type":"BLUE","label":"1159, -652","gx":1159,"gy":-652},{"x":1175.8888854980469,"y":587,"type":"BRIEF","label":"-1701, -419","gx":-1701,"gy":-419},{"x":874.8888854980469,"y":184,"type":"LOCATION","label":"Brick House [279, 2124]","gx":279,"gy":2124},{"x":775.8888854980469,"y":214,"type":"LOCATION","label":"Metal Shack [930, 1935]","gx":930,"gy":1935},{"x":628.8888854980469,"y":193,"type":"LOCATION","label":"Dusty Depot [1923, 2162]","gx":1923,"gy":2162},{"x":712.8888854980469,"y":302,"type":"LOCATION","label":"Dig Site [1345, 1380]","gx":1345,"gy":1380},{"x":619.8888854980469,"y":610,"type":"LOCATION","label":"Cross Fire [2068, -457]","gx":2068,"gy":-457},{"x":758.8888854980469,"y":822,"type":"LOCATION","label":"Airfeild [1042, -1901]","gx":1042,"gy":-1901},{"x":934.8888854980469,"y":774,"type":"LOCATION","label":"Watch Tower [-162, -1548]","gx":-162,"gy":-1548},{"x":970.8888854980469,"y":810,"type":"LOCATION","label":"Brick House [-286, -1750]","gx":-286,"gy":-1750},{"x":889.8888854980469,"y":637,"type":"LOCATION","label":"Bridge [180, -627]","gx":180,"gy":-627},{"x":942.8888854980469,"y":541,"type":"LOCATION","label":"Fishing Village [-168, 4]","gx":-168,"gy":4},{"x":1024.129858213574,"y":201.178800791704,"type":"LOCATION","label":"Watch Tower [-707, 2027]","gx":-707,"gy":2027},{"x":1156.0972068320184,"y":372.7052838826638,"type":"LOCATION","label":"Bunker Lift [-1570, 942]","gx":-1570,"gy":942},{"x":981.0344315141286,"y":396.4087627187644,"type":"LOCATION","label":"Barracks [-417, 792]","gx":-417,"gy":792},{"x":1065.9514763863472,"y":406.0244648737524,"type":"LOCATION","label":"Bunker [-976, 732]","gx":-976,"gy":732},{"x":1127.4483800108287,"y":643.3229650993346,"type":"LOCATION","label":"Cabin [-1381, -762]","gx":-1381,"gy":-762},{"x":1070.9556962559316,"y":692.4798218125717,"type":"LOCATION","label":"Watch Tower [-1009, -1071]","gx":-1009,"gy":-1071},{"x":1208.836975166696,"y":570.1970616985249,"type":"LOCATION","label":"Big Town [-1917, -301]","gx":-1917,"gy":-301},{"x":1334.8888854980469,"y":516,"type":"LOCATION","label":"Cabin [-2746, 29]","gx":-2746,"gy":29},{"x":1336.0804180666082,"y":298.0164079713129,"type":"LOCATION","label":"Cabin [-2755, 1413]","gx":-2755,"gy":1413},{"x":1212.281596628754,"y":796.4855073646067,"type":"LOCATION","label":"kill house [-1940, -1724]","gx":-1940,"gy":-1724},{"x":1220.8888854980469,"y":650,"type":"BLUE","label":"BLUE [-1997, -804]","gx":-1997,"gy":-804},{"x":809.0621814446947,"y":306.538871600125,"type":"LOCATION","label":"Cabin [716, 1358]","gx":716,"gy":1358}];

// Load from storage, but if empty, use the master list
let markers = JSON.parse(localStorage.getItem('savedMarkers')) || MASTER_DATA;
if (markers.length === 0) markers = MASTER_DATA;

let showMarkers = true;
let mouseX = 0, mouseY = 0;
let isWaitingForLocationClick = false;
let pendingAirdropCalculation = false;
let searchTargetType = null;
let activeTarget = null;
let pulseEndTime = 0;
let mapConfig = { active: false, scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 };

let view = { x: 0, y: 0, zoom: 0.8 };
let targetView = { x: 0, y: 0, zoom: 0.8 };
let isDragging = false;
let lastMouseX = 0, lastMouseY = 0;
let lastTouchDistance = null;
let lastCenter = null;

const colors = {
    GREEN: '#6AD44C', BLUE: '#4C92D4', RED: '#EB564F',
    SAFE: '#F3E57A', BRIEF: '#714E2E', EXTRACT: '#AD30D3',
    LOCATION: '#ffffff', AIRDROP: '#ffff00', PLAYER: '#00ffff'
};

// --- Marker Size Configuration ---
const MARKER_BASE_RADIUS = 8;
const MARKER_PULSE_MIN_RADIUS = 6;
const MARKER_PULSE_MAX_RADIUS = 20;
const MARKER_FONT_SIZE = 11;
const MARKER_HIT_RADIUS = 18;
const MARKER_LINE_WIDTH = 1.5;
const MARKER_PULSE_LINE_WIDTH = 2.7;

/** HELPER FUNCTIONS **/
function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function getCleanName(label) {
    if (!label) return "";
    return label.split('[')[0].split(/[0-9-]/)[0].trim();
}

/** THE BUFFERED CLAMP - ALLOWS PEEKING BUT PREVENTS LOSING THE MAP **/
function clampView() {
    const zoomedWidth = mapImg.width * targetView.zoom;
    const zoomedHeight = mapImg.height * targetView.zoom;
    let buffer = -100;

    if(window.innerWidth < 700) buffer = 0;

    const minX = buffer - zoomedWidth;
    const maxX = canvas.width - buffer;
    if (targetView.x < minX) targetView.x = minX;
    if (targetView.x > maxX) targetView.x = maxX;
    const minY = buffer - zoomedHeight;
    const maxY = canvas.height - buffer;
    if (targetView.y < minY) targetView.y = minY;
    if (targetView.y > maxY) targetView.y = maxY;
}

function adjustCanvasSizeForMobile() {
    if(window.innerWidth < 700 || window.innerHeight < 700) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 70;
        document.body.style.overflow = "hidden";
        document.getElementById('cal-info').style.fontSize = '1.1em';
        document.getElementById('cal-info').style.padding = '8px';
    } else {
        canvas.width = window.innerWidth - 280;
        canvas.height = window.innerHeight;
        document.getElementById('cal-info').style.fontSize = '';
        document.body.style.overflow = '';
    }
}
mapImg.onload = () => {
    adjustCanvasSizeForMobile();
    extractCoords();
    saveAndRender();
};

window.onresize = adjustCanvasSizeForMobile;

function screenToMap(sx, sy) {
    return { x: (sx - view.x) / view.zoom, y: (sy - view.y) / view.zoom };
}

function getMarkerAtPos(mapX, mapY) {
    const baseRadius = MARKER_HIT_RADIUS;
    const hitRadius = Math.min(baseRadius / view.zoom, 40);
    const candidates = markers.filter(m => Math.sqrt((mapX - m.x)**2 + (mapY - m.y)**2) < hitRadius);
    if (candidates.length === 0) return null;
    const priority = candidates.find(m => m.type === 'PLAYER' || m.type === 'AIRDROP');
    if (priority) return priority;
    return candidates[0];
}

// Auto-zoom functions removed

function animateZoomToFit(p1, p2, duration = 600, customZoom=null) {
    // REMOVED: This function is intentionally empty due to removal of auto zoom.
}

function zoomToAirdropSmooth(airdropMarker) {
    // REMOVED: This function is intentionally empty due to removal of auto zoom.
}

function zoomToFit(p1, p2) {
    // REMOVED: This function is intentionally empty due to removal of auto zoom.
}

function updateTacticalHUD(player, target) {
    const statusBox = document.getElementById('cal-info');
    activeTarget = target;
    pulseEndTime = Date.now() + 15000;

    // AIRDROP LOGIC FIX: If the airdrop or player is missing correct gx/gy (due to calibration, user input, or bad mapping), warn properly
    if (
        target &&
        typeof target.gx !== 'number' ||
        typeof target.gy !== 'number' ||
        isNaN(target.gx) ||
        isNaN(target.gy)
    ) {
        statusBox.innerHTML = `
            <div style="text-align:center;color:#EB564F;padding:10px"><strong>ERROR:</strong><br>Invalid target coordinates for Airdrop or Objective. Please calibrate or input correct map co-ordinates.</div>
        `;
        return;
    }

    if (
        player &&
        typeof player.gx !== 'number' ||
        typeof player.gy !== 'number' ||
        isNaN(player.gx) ||
        isNaN(player.gy)
    ) {
        statusBox.innerHTML = `
            <div style="text-align:center;color:#EB564F;padding:10px"><strong>ERROR:</strong><br>Your position is invalid. Tap on the map to place yourself or calibrate.</div>
        `;
        return;
    }

    const distToTarget = Math.sqrt((player.gx - target.gx)**2 + (player.gy - target.gy)**2);
    const direction = getDirection(player, target);
    const rawSeconds = Math.round((distToTarget / PLAYER_SPEED) * HUMAN_ERROR_BUFFER);
    const readableTime = formatTime(rawSeconds);
    statusBox.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div style="font-size:0.95em;color:#6AD44C;text-align:center;">
                <strong>OBJECTIVE:</strong><br>
                ${getCleanName(target.label)}<br>
                <strong>BEARING:</strong> ${direction.toUpperCase()}<br>
                <strong>RANGE:</strong> ${Math.round(distToTarget)}M<br>
                <strong>ETA:</strong> ${readableTime}
            </div>
        </div>
    `;
    // Auto-zoom removed: no longer zoom on new target or player/target overlap
}

function getDirection(from, to) {
    const dNorth = to.gx - from.gx;
    const dEast = to.gy - from.gy;
    let angle = Math.atan2(dEast, dNorth) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    const dirs = ["North", "North East", "East", "South East", "South", "South West", "West", "North West"];
    return dirs[Math.round(angle / 45) % 8];
}

function extractCoords() {
    markers.forEach(m => {
        // Only try to extract gx/gy if not already present and parseable; fixes rare airdrop bug on reload
        if ((typeof m.gx !== 'number' || isNaN(m.gx) || typeof m.gy !== 'number' || isNaN(m.gy)) && typeof m.label === "string") {
            const parts = m.label.match(/-?\d+(\.\d+)?/g);
            if (parts && parts.length >= 2) {
                m.gx = parseFloat(parts[0]);
                m.gy = parseFloat(parts[1]);
            }
        }
    });
}

function getGameCoords(mx, my) {
    if (mapConfig.active) return { x: Math.round(mx * mapConfig.scaleX + mapConfig.offsetX), y: Math.round(my * mapConfig.scaleY + mapConfig.offsetY), calibrated: true };
    return { x: 0, y: 0, calibrated: false };
}

function getPixelFromGame(gx, gy) {
    if (!mapConfig.active) return null;
    return { x: (gx - mapConfig.offsetX) / mapConfig.scaleX, y: (gy - mapConfig.offsetY) / mapConfig.scaleY };
}

/** CORE ACTIONS **/
function addAirdrop() {
    // On mobile: custom modal, else normal prompt
    let input;
    if (window.innerWidth <= 700) {
        input = window.prompt("Enter Airdrop Coords (X, Y):");
    } else {
        input = prompt("Enter Airdrop Coords (X, Y):");
    }
    if (!input) return;
    const p = input.match(/-?\d+(\.\d+)?/g);
    if (!(p && p.length >= 2)) return;

    const gx = parseFloat(p[0]), gy = parseFloat(p[1]);

    // Remove all existing AIRDROP markers so there is only one
    markers = markers.filter(m => m.type !== 'AIRDROP');

    // Find or approximate pixel position
    let mPos = getPixelFromGame(gx, gy);
    if (
        !mPos ||
        !isFinite(mPos.x) ||
        !isFinite(mPos.y)
    ) {
        let minDist = Infinity, found = null;
        for (const m of MASTER_DATA) {
            const d = Math.hypot((m.gx - gx), (m.gy - gy));
            if (d < minDist) { minDist = d; found = m; }
        }
        if (found && minDist < 5) {
            mPos = {x: found.x, y: found.y};
        }
    }
    if (!mPos || !isFinite(mPos.x) || !isFinite(mPos.y)) {
        mPos = {x: mapImg.width/2, y: mapImg.height/2};
    }

    // Label must be in the correct format for reload/extractCoords!
    const airdropLabel = `Airdrop [${gx}, ${gy}]`;
    const airdropMark = {
        x: mPos.x, y: mPos.y,
        type: 'AIRDROP',
        label: airdropLabel,
        gx: gx,
        gy: gy,
        timestamp: Date.now()
    };

    markers.push(airdropMark);
    saveAndRender();
    extractCoords(); // Fix: very important after *any* marker push

    const player = markers.find(m => m.type === 'PLAYER');
    if (player) {
        updateTacticalHUD(player, airdropMark);
    } else {
        pendingAirdropCalculation = true;
        isWaitingForLocationClick = true;
        // Auto-zoom removed: no longer zoom to the airdrop marker
        document.getElementById('cal-info').innerText = "AIRDROP ADDED. TAP YOUR POSITION.";
    }
}

function findNearest() {
    pendingAirdropCalculation = false;
    isWaitingForLocationClick = true;
    activeTarget = null;
    document.getElementById('cal-info').innerText = (window.innerWidth<=700?"Tap":"Click") + " your position...";
}

function showObjectiveMenu() {
    const statusBox = document.getElementById('cal-info');
    statusBox.innerHTML = `
        <div style="
            text-align: center;
            font-weight: bold;
            font-size: 1.12em;
            margin-bottom: 10px;
            letter-spacing: 1px;
            color: #6AD44C;
            border-bottom: 1.5px solid #333;
            padding-bottom: 7px;
        ">
            SELECT OBJECTIVE
        </div>
        <div class="obj-list" style="
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 8px;
        "></div>
    `;

    const list = statusBox.querySelector('.obj-list');
    const types = [
        { id: 'GREEN', label: 'Green Crate' }, { id: 'BLUE', label: 'Blue Crate' },
        { id: 'RED', label: 'Red Crate' }, { id: 'SAFE', label: 'Safe' },
        { id: 'BRIEF', label: 'Briefcase' }, { id: 'EXTRACT', label: 'Extraction' }
    ];
    types.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'obj-btn mobile-btn';
        btn.innerText = t.label;
        btn.ontouchstart = btn.onclick = () => selectObjective(t.id);

        btn.style.background = "#222";
        btn.style.color = colors[t.id] || "#fff";
        btn.style.border = `2px solid ${colors[t.id] || '#555'}`;
        btn.style.borderRadius = "22px";
        btn.style.fontWeight = "bold";
        btn.style.fontSize = "1.02em";
        btn.style.padding = "14px 20px";
        btn.style.margin = "0 4px";
        btn.style.boxShadow = "0 2px 7px rgba(0,0,0,0.28)";
        btn.style.transition = "background 0.16s, color 0.16s, transform 0.09s";
        btn.style.cursor = "pointer";
        btn.style.minWidth = "108px";
        btn.style.outline = "none";
        btn.style.letterSpacing = "0.5px";

        btn.onpointerdown = function() {
            btn.style.background = colors[t.id];
            btn.style.color = "#111";
            btn.style.transform = "scale(0.97)";
        };
        btn.onpointerup = btn.onpointerleave = function() {
            btn.style.background = "#222";
            btn.style.color = colors[t.id];
            btn.style.transform = "scale(1)";
        };

        list.appendChild(btn);
    });
}

function selectObjective(type) {
    searchTargetType = type;
    const playerMark = markers.find(m => m.type === 'PLAYER');
    if (!playerMark) return;
    const candidates = markers.filter(mark => mark.type === searchTargetType && typeof mark.gx === "number" && typeof mark.gy === "number" && !isNaN(mark.gx) && !isNaN(mark.gy));
    if (candidates.length > 0) {
        let nearest = candidates[0];
        let minDist = Infinity;
        candidates.forEach(c => {
            const d = Math.sqrt((playerMark.gx - c.gx)**2 + (playerMark.gy - c.gy)**2);
            if (d < minDist) { minDist = d; nearest = c; }
        });
        updateTacticalHUD(playerMark, nearest);
    } else {
        document.getElementById('cal-info').innerText = `NO ${type} FOUND`;
        setTimeout(() => showObjectiveMenu(), 2000);
    }
}

function saveAndRender() {
    // Don't let duplicate AIRDROP markers persist
    let foundAirdrop = false;
    markers = markers.filter(m => {
        if (m.type !== "AIRDROP") return true;
        if (!foundAirdrop) { foundAirdrop = true; return true; }
        // remove duplicates
        return false;
    });

    const truths = markers.filter(m => typeof m.gx === 'number' && typeof m.gy === 'number' && !isNaN(m.gx) && !isNaN(m.gy));

    if (truths.length >= 2) {
        let sXp = 0, sYp = 0, sXg = 0, sYg = 0;
        truths.forEach(m => { sXp += m.x; sYp += m.y; sXg += m.gx; sYg += m.gy; });
        const aXp = sXp/truths.length, aYp = sYp/truths.length, aXg = sXg/truths.length, aYg = sYg/truths.length;
        let numX = 0, denX = 0, numY = 0, denY = 0;
        truths.forEach(m => {
            numX += (m.x - aXp) * (m.gx - aXg); denX += (m.x - aXp)**2;
            numY += (m.y - aYp) * (m.gy - aYg); denY += (m.y - aYp)**2;
        });
        mapConfig.scaleX = numX / (denX || 1); mapConfig.scaleY = numY / (denY || 1);
        mapConfig.offsetX = aXg - (aXp * mapConfig.scaleX); mapConfig.offsetY = aYg - (aYp * mapConfig.scaleY);
        mapConfig.active = true;
    }
    localStorage.setItem('savedMarkers', JSON.stringify(markers));
}

function showDeleteMarkerModal(marker, x, y) {
    let existing = document.getElementById("delete-marker-modal");
    if (existing) existing.remove();

    let modal = document.createElement("div");
    modal.id = "delete-marker-modal";
    modal.style.position = "fixed";
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.background = "rgba(0,0,0,0.36)";
    modal.style.zIndex = 3333;

    let box = document.createElement("div");
    box.style.background = "#181818";
    box.style.color = "#fff";
    box.style.padding = "28px 24px 24px 24px";
    box.style.borderRadius = "14px";
    box.style.boxShadow = "0px 4px 32px rgba(0,0,0,0.39)";
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.alignItems = "center";
    box.style.justifyContent = "center";
    box.style.minWidth = "210px";
    box.style.maxWidth = "80vw";

    let title = document.createElement("div");
    title.style.fontWeight = "bold";
    title.style.fontSize = "1.18em";
    title.style.marginBottom = "10px";
    title.style.letterSpacing = "0.5px";
    title.style.color = "#ffff00";
    if(marker.type === "PLAYER") {
        title.innerText = "Delete Your Position?";
    } else if(marker.type === "AIRDROP") {
        title.innerText = "Delete This Airdrop?";
    } else {
        title.innerText = "Delete Marker?";
    }
    box.appendChild(title);

    let loc = document.createElement("div");
    loc.innerText = marker.label || marker.type;
    loc.style.fontSize = "1em";
    loc.style.marginBottom = "17px";
    loc.style.color = "#eee";
    loc.style.textAlign = "center";
    box.appendChild(loc);

    let btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.justifyContent = "center";
    btnRow.style.width = "100%";
    btnRow.style.gap = "16px";

    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.style.background = "#e84542";
    delBtn.style.color = "#fff";
    delBtn.style.border = "none";
    delBtn.style.padding = "9px 24px";
    delBtn.style.fontWeight = "bold";
    delBtn.style.borderRadius = "7px";
    delBtn.style.fontSize = "1.0em";
    delBtn.style.boxShadow = "0 2px 7px rgba(0,0,0,0.20)";
    delBtn.style.cursor = "pointer";
    delBtn.onclick = function() {
        markers = markers.filter(mark => mark !== marker);
        if (activeTarget === marker) activeTarget = null;
        document.body.removeChild(modal);
        saveAndRender();
    };

    let cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel";
    cancelBtn.style.background = "#222";
    cancelBtn.style.color = "#bbb";
    cancelBtn.style.border = "1.5px solid #477";
    cancelBtn.style.padding = "9px 18px";
    cancelBtn.style.fontWeight = "bold";
    cancelBtn.style.borderRadius = "7px";
    cancelBtn.style.fontSize = "1.0em";
    cancelBtn.style.marginLeft = "7px";
    cancelBtn.style.boxShadow = "0 1px 3px rgba(0,0,0,0.10)";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.onclick = function() {
        document.body.removeChild(modal);
    };

    btnRow.appendChild(delBtn);
    btnRow.appendChild(cancelBtn);

    box.appendChild(btnRow);

    modal.appendChild(box);

    modal.addEventListener("click", function(e){
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    document.body.appendChild(modal);
}

function render() {
    const lerp = 0.03;
    if (!isDragging) {
        view.zoom += (targetView.zoom - view.zoom) * lerp;
        view.x += (targetView.x - view.x) * lerp;
        view.y += (targetView.y - view.y) * lerp;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(view.x, view.y);
    ctx.scale(view.zoom, view.zoom);
    ctx.drawImage(mapImg, 0, 0);

    let hudY = canvas.height - 48;
    if(window.innerWidth < 700) hudY = canvas.height - 52;

    const mapMouse = screenToMap(mouseX, mouseY);
    const hovered = getMarkerAtPos(mapMouse.x, mapMouse.y);
    const g = getGameCoords(mapMouse.x, mapMouse.y);

    markers.forEach(m => {
        const isCurrentlyPulsing = (m === activeTarget && Date.now() < pulseEndTime);
        const isAlwaysVisible = (m.type === 'PLAYER' || m.type === 'AIRDROP' || isCurrentlyPulsing);
        if (showMarkers || isAlwaysVisible) {
            if (isCurrentlyPulsing) {
                const pulse = (Math.sin(Date.now() / 150) + 1) / 2;
                ctx.beginPath();
                ctx.arc(m.x, m.y, (MARKER_PULSE_MIN_RADIUS + pulse * (MARKER_PULSE_MAX_RADIUS - MARKER_PULSE_MIN_RADIUS)) / view.zoom, 0, Math.PI * 2);
                ctx.strokeStyle = colors[m.type];
                ctx.lineWidth = MARKER_PULSE_LINE_WIDTH / view.zoom;
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(m.x, m.y, MARKER_BASE_RADIUS / view.zoom, 0, Math.PI * 2);
            ctx.fillStyle = colors[m.type];
            ctx.fill();
            ctx.strokeStyle = isCurrentlyPulsing ? "white" : "rgba(255,255,255,0.8)";
            ctx.lineWidth = MARKER_LINE_WIDTH / view.zoom;
            ctx.stroke();
            if (showMarkers || m.type === 'PLAYER' || m.type === 'AIRDROP' || isCurrentlyPulsing) {
                if (m === hovered || isCurrentlyPulsing || m.type === 'PLAYER') {
                    ctx.font = `bold ${MARKER_FONT_SIZE / view.zoom}px sans-serif`;
                    ctx.fillStyle = "white";
                    ctx.fillText(getCleanName(m.label), m.x + (MARKER_BASE_RADIUS + 4) / view.zoom, m.y - (MARKER_BASE_RADIUS + 4) / view.zoom);
                }
            }
        }
    });

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    let hudText = isWaitingForLocationClick ?
        ((window.innerWidth <= 700 ? "Tap" : "Click") + " your position") :
        `X: ${g.x}, Y: ${g.y}`;
    let hudColor = isWaitingForLocationClick ? "#00ffff" : "#6AD44C";

    if (hovered && typeof hovered.gx === 'number' && typeof hovered.gy === 'number' && !isNaN(hovered.gx) && !isNaN(hovered.gy)) {
        hudText = `LOCKED: ${hovered.gx}, ${hovered.gy}`;
        hudColor = colors[hovered.type];
    }

    ctx.fillStyle = "rgba(0,0,0,0.8)";
    const boxW = ctx.measureText(hudText).width+15;
    ctx.fillRect(mouseX+10, mouseY+10, boxW, 32);
    ctx.fillStyle = hudColor;
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(hudText, mouseX+17, mouseY+31);

    requestAnimationFrame(render);
}

/** INPUT HANDLERS (Touch + Mouse) **/

function singlePointerCanvasXY(e, strict) {
    let x = 0, y = 0;
    if (e.touches && e.touches.length > 0) {
        const r = canvas.getBoundingClientRect();
        x = e.touches[0].clientX - r.left;
        y = e.touches[0].clientY - r.top;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
        const r = canvas.getBoundingClientRect();
        x = e.changedTouches[0].clientX - r.left;
        y = e.changedTouches[0].clientY - r.top;
    } else if (e.clientX !== undefined && e.clientY !== undefined) {
        const r = canvas.getBoundingClientRect();
        x = e.clientX - r.left;
        y = e.clientY - r.top;
    } else if (strict) {
        return null;
    }
    return {x, y};
}

function handlePointerDown(sx, sy, origEvent) {
    const mapPos = screenToMap(sx, sy);
    const m = getMarkerAtPos(mapPos.x, mapPos.y);

    if (isWaitingForLocationClick) {
        const myC = getGameCoords(mapPos.x, mapPos.y);
        const playerMark = { x: mapPos.x, y: mapPos.y, type: 'PLAYER', label: "Me", gx: myC.x, gy: myC.y, timestamp: Date.now() };
        markers = markers.filter(mark => mark.type !== 'PLAYER');
        markers.push(playerMark);
        isWaitingForLocationClick = false;
        if (pendingAirdropCalculation) {
            const lastDrop = markers.filter(mark => mark.type === 'AIRDROP').pop();
            if (lastDrop) updateTacticalHUD(playerMark, lastDrop);
            pendingAirdropCalculation = false;
        } else {
            showObjectiveMenu();
        }
        saveAndRender();
        return;
    }

    if (origEvent && origEvent.type === 'touchstart') {
        let longPressTimer = setTimeout(() => {
            if (m && (m.type === 'AIRDROP' || m.type === 'PLAYER')) {
                showDeleteMarkerModal(m, sx, sy);
            }
        }, 600);
        const removeListener = ()=>{
            clearTimeout(longPressTimer);
            canvas.removeEventListener('touchend',removeListener);
            canvas.removeEventListener('touchmove',removeListener);
            canvas.removeEventListener('touchcancel',removeListener);
        };
        canvas.addEventListener('touchend',removeListener);
        canvas.addEventListener('touchmove',removeListener);
        canvas.addEventListener('touchcancel',removeListener);
        origEvent.preventDefault();
    } else {
        isDragging = true;
        lastMouseX = sx;
        lastMouseY = sy;
    }
}

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
        const pt = singlePointerCanvasXY(e, true);
        handlePointerDown(pt.x, pt.y, false);
    }
    if (e.button === 1 || e.button === 0) {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
    if (e.button === 2) {
        e.preventDefault();
        const pt = singlePointerCanvasXY(e, true);
        const mapPos = screenToMap(pt.x, pt.y);
        const m = getMarkerAtPos(mapPos.x, mapPos.y);
        if (m && (m.type === 'AIRDROP' || m.type === 'PLAYER')) {
            markers = markers.filter(mark => mark !== m);
            if (activeTarget === m) activeTarget = null;
            saveAndRender();
        }
    }
});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('mousemove', (e) => {
    const pt = singlePointerCanvasXY(e, true);
    mouseX = pt.x;
    mouseY = pt.y;
    if (isDragging) {
        targetView.x += e.clientX - lastMouseX;
        targetView.y += e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        clampView();
        view.x = targetView.x;
        view.y = targetView.y;
    }
});

window.addEventListener('mouseup', () => { isDragging = false; });

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    let newZoom = targetView.zoom + scaleAmount;
    if (newZoom < MIN_ZOOM) newZoom = MIN_ZOOM;
    if (newZoom > MAX_ZOOM) newZoom = MAX_ZOOM;
    const mapMouse = screenToMap(mouseX, mouseY);
    targetView.zoom = newZoom;
    view.zoom = newZoom;
    targetView.x = mouseX - mapMouse.x * targetView.zoom;
    targetView.y = mouseY - mapMouse.y * targetView.zoom;
    clampView();
    view.x = targetView.x;
    view.y = targetView.y;
}, { passive: false });

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        const pt = singlePointerCanvasXY(e, true);
        mouseX = pt.x;
        mouseY = pt.y;
        handlePointerDown(pt.x, pt.y, e);
        isDragging = true;
        lastMouseX = pt.x;
        lastMouseY = pt.y;
    }
    if (e.touches.length === 2) {
        isDragging = false;
        lastTouchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        lastCenter = {
            x: (e.touches[0].clientX + e.touches[1].clientX)/2 - canvas.getBoundingClientRect().left,
            y: (e.touches[0].clientY + e.touches[1].clientY)/2 - canvas.getBoundingClientRect().top
        };
    }
}, {passive: false});

canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging) {
        const pt = {
            x: e.touches[0].clientX - canvas.getBoundingClientRect().left,
            y: e.touches[0].clientY - canvas.getBoundingClientRect().top
        };
        targetView.x += pt.x - lastMouseX;
        targetView.y += pt.y - lastMouseY;
        lastMouseX = pt.x;
        lastMouseY = pt.y;
        clampView();
        view.x = targetView.x;
        view.y = targetView.y;
        e.preventDefault();
    }
    if (e.touches.length === 2) {
        let thisDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        let centerPt = {
            x: (e.touches[0].clientX + e.touches[1].clientX)/2 - canvas.getBoundingClientRect().left,
            y: (e.touches[0].clientY + e.touches[1].clientY)/2 - canvas.getBoundingClientRect().top
        };
        let scaleAmount = (thisDist - lastTouchDistance) * 0.005;
        let newZoom = targetView.zoom + scaleAmount;
        if (newZoom < MIN_ZOOM) newZoom = MIN_ZOOM;
        if (newZoom > MAX_ZOOM) newZoom = MAX_ZOOM;
        const m = screenToMap(centerPt.x, centerPt.y);
        targetView.zoom = newZoom;
        view.zoom = newZoom;
        targetView.x = centerPt.x - m.x * newZoom;
        targetView.y = centerPt.y - m.y * newZoom;
        lastTouchDistance = thisDist;
        lastCenter = centerPt;
        clampView();
        view.x = targetView.x;
        view.y = targetView.y;
        e.preventDefault();
    }
});

canvas.addEventListener('touchend', (e) => {
    isDragging = false;
    lastTouchDistance = null;
    lastCenter = null;
});

function toggleVisibility() {
    showMarkers = !showMarkers;
    if(window.innerWidth <= 700) {
        let btnEl = document.getElementById("hideShowBtn");
        if (btnEl)
            btnEl.innerText = showMarkers ? "Hide Markers" : "Show Markers";
    }
}

// --- NEW RESET LOGIC: Removes all PLAYER and AIRDROP markers but keeps master landmarks ---
// No more auto-zoom reset; view remains unchanged, just removes markers.
window.resetAllMarkers = function() {
    markers = markers.filter(m => m.type !== 'PLAYER' && m.type !== 'AIRDROP');
    saveAndRender();
    // No auto-zoom/view reset.
};

render();

// Made by Phoxphor
// I dont know how to make mobile ports so this is scuffed as fuck
