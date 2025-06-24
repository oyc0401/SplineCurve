const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const points = [
  { x: 80, y: 260 },
  { x: 180, y: 80 },
  { x: 420, y: 260 },
  { x: 240, y: 460 },
  { x: 40, y: 460 },
];

const tension = 0; // 0 = Catmull-Rom
const k = (1 - tension) * 0.5;

/* ---------- 1. 모든 점의 접선 한 번에 계산 ---------- */
const tangents = points.map((p, i, arr) => {
  if (i === 0 || i === arr.length - 1)
    // 끝점 → 속도 0
    return { x: 0, y: 0 };

  return {
    // 내부점
    x: k * (arr[i + 1].x - arr[i - 1].x),
    y: k * (arr[i + 1].y - arr[i - 1].y),
  };
});

/* ---------- 2. 허밋 보간 함수 ---------- */
function hermite(t, p0, p1, v0, v1) {
  const t2 = t * t,
    t3 = t2 * t;
  const h1 = 2 * t3 - 3 * t2 + 1;
  const h2 = -2 * t3 + 3 * t2;
  const h3 = t3 - 2 * t2 + t;
  const h4 = t3 - t2;
  return {
    x: h1 * p0.x + h2 * p1.x + h3 * v0.x + h4 * v1.x,
    y: h1 * p0.y + h2 * p1.y + h3 * v0.y + h4 * v1.y,
  };
}

/* ---------- 3. 모든 세그먼트 그리기 ---------- */
ctx.fillStyle = "blue";
for (let i = 0; i < points.length - 1; i++) {
  const p0 = points[i],
    p1 = points[i + 1];
  const v0 = tangents[i],
    v1 = tangents[i + 1];

  for (let t = 0; t <= 1.0001; t += 0.01) {
    const p = hermite(t, p0, p1, v0, v1);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ---------- 4. 컨트롤 포인트 무지개 표시 ---------- */
for (let i = 0; i < points.length; i++) {
  const hue = 270 * (points.length === 1 ? 0 : i / (points.length - 1)); // 빨→보라
  ctx.fillStyle = `hsl(${hue},100%,50%)`;
  const p = points[i];
  ctx.beginPath();
  ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
  ctx.fill();
}
