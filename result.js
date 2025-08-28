// take points from URL
const q = new URLSearchParams(location.search);
const A = { x: +q.get('ax'), y: +q.get('ay') };
const B = { x: +q.get('bx'), y: +q.get('by') };
const C = { x: +q.get('cx'), y: +q.get('cy') };

// Basic vector helpers
const sub = (p, q) => ({ x: p.x - q.x, y: p.y - q.y });
const dot = (u, v) => u.x * v.x + u.y * v.y;
const len = v => Math.hypot(v.x, v.y);

// calculate angle between three points
function angleAt(a, b, c) {
    const ab = sub(b, a), ac = sub(c, a);
    const cos = Math.min(1, Math.max(-1, dot(ab, ac) / (len(ab) * len(ac))));
    return Math.acos(cos) * 180 / Math.PI;
}

// make sure any inputed number works by scaling down from the largest number
const size = 800, pad = 40;
const xs = [A.x, B.x, C.x], ys = [A.y, B.y, C.y];
const minX = Math.min(...xs), maxX = Math.max(...xs);
const minY = Math.min(...ys), maxY = Math.max(...ys);
const w = Math.max(1, maxX - minX), h = Math.max(1, maxY - minY);
const sx = x => pad + (x - minX) * (size - 2 * pad) / w;
const sy = y => size - (pad + (y - minY) * (size - 2 * pad) / h);
const SA = { x: sx(A.x), y: sy(A.y) }, SB = { x: sx(B.x), y: sy(B.y) }, SC = { x: sx(C.x), y: sy(C.y) };

const ctx = document.getElementById('board').getContext('2d');

// triangle
ctx.strokeStyle = '#2b6cb0'; ctx.fillStyle = 'rgba(66,153,225,.10)'; ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(SA.x, SA.y); ctx.lineTo(SB.x, SB.y); ctx.lineTo(SC.x, SC.y); ctx.closePath();
ctx.fill(); ctx.stroke();

// points and labels
[['A', SA], ['B', SB], ['C', SC]].forEach(([name, p]) => {
    ctx.beginPath(); ctx.fillStyle = '#2b6cb0';
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a202c'; ctx.font = '14px system-ui';
    ctx.fillText(name, p.x + 8, p.y - 8);
});

// angles text at cavnas bottom
const aA = angleAt(A, B, C), aB = angleAt(B, A, C), aC = angleAt(C, A, B);
document.getElementById('angles').textContent = `A: ${aA.toFixed(2)}°, B: ${aB.toFixed(2)}°, C: ${aC.toFixed(2)}°`;

// arc for the interior angle at screen point P between U and V
function drawArc(P, U, V, r, degLabel) {
    // angles in screen space (Y down)
    let s = Math.atan2(U.y - P.y, U.x - P.x);
    let e = Math.atan2(V.y - P.y, V.x - P.x);
    // ensure we draw the smaller arc
    let d = e - s; while (d <= 0) d += Math.PI * 2; if (d > Math.PI) [s, e] = [e, s];
    ctx.beginPath(); ctx.strokeStyle = '#e53e3e'; ctx.lineWidth = 2;
    ctx.arc(P.x, P.y, r, s, e); ctx.stroke();
    const m = (s + e) / 2;
    ctx.fillStyle = '#2d3748'; ctx.font = '13px system-ui';
    ctx.fillText(`${degLabel.toFixed(0)}°`, P.x + (r + 10) * Math.cos(m), P.y + (r + 10) * Math.sin(m));
}

drawArc(SA, SB, SC, 24, aA);
drawArc(SB, SA, SC, 24, aB);
drawArc(SC, SA, SB, 24, aC); 