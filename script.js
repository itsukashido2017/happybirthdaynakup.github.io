// ===== CONFIG =====
const HER_NAME = "พี่ฝ้าย";
const FROM_NAME = "น้องชิที่รักคุณฝ้ายสุดหัวใจ";
const BIRTHDAY_DATE = "2025-11-09T00:00:00+07:00"; // วันเกิดที่ให้มา
const MESSAGE = `สุขสันต์วันเกิดนะครับพี่สาว 

ขอให้วันนี้และทุกๆวันต่อจากนี้ของพี่สาวเป็นวันที่ดีนะคับ มีความสุขมากๆยิ้มเยอะๆ 
ปีนี้คงเป็นปีแรกที่เราอยู่ด้วยกัน น้องดีใจมากเลยนะที่ได้รู้จักได้อยู่กับพี่สาว
ขอบคุณพี่สาวมากเลยนะที่คอยดูแลน้องมาตลอด ขอบคุณที่เป็นพี่สาวที่น่ารักของน้องนะ
ถ้าพี่สาวมีปัญหาอะไรพี่สาวอย่าเศร้าให้มากนะคับพี่สาวน้องเป็นคนเก่ง
ถ้าเจออะไรจะต้องผ่านมันไปได้อยู่แล้ว พี่สาวต้องยิ้มมากๆนะพี่สาวเป็นคนที่ไม่เหมาะกับ
การเสียใจหรือความเศร้าเลย มีปัญหาอะไรน้องจะอยู่ข้างๆพี่สาวเสมอนะคับ
ขอบคุณที่เป็นพี่สาวที่ดีที่สุดของน้องนะคับ รักพี่สาวมากๆเลย
`;

// ชื่อบนหน้า
document.getElementById("herName").textContent = HER_NAME;
document.getElementById("herName2").textContent = HER_NAME;
document.getElementById("fromName").textContent = FROM_NAME;

// ===== เพลง + คอนโทรลทุกหน้า =====
const bgm = document.getElementById("bgm");
const togglePlay = document.getElementById("togglePlay");
const btnPlayAlso = document.getElementById("btnPlayAlso");
const volUp = document.getElementById("volUp");
const volDown = document.getElementById("volDown");

function playOrPause(){
  if (bgm.paused) { bgm.play().catch(()=>{}); setToggleIcon(true); }
  else { bgm.pause(); setToggleIcon(false); }
}
function setToggleIcon(isPlaying){
  if(togglePlay) togglePlay.textContent = isPlaying ? "⏸" : "▶";
  if(btnPlayAlso) btnPlayAlso.textContent = isPlaying ? "⏸ หยุดเพลง" : "♫ เปิดเพลง";
}
if(togglePlay) togglePlay.addEventListener("click", playOrPause);
if(btnPlayAlso) btnPlayAlso.addEventListener("click", playOrPause);
if(volUp) volUp.addEventListener("click", ()=>{ bgm.volume = Math.min(1, Math.round((bgm.volume+0.1)*10)/10); });
if(volDown) volDown.addEventListener("click", ()=>{ bgm.volume = Math.max(0, Math.round((bgm.volume-0.1)*10)/10); });
setToggleIcon(false);

// ===== Stepper (with animated transitions) =====
const steps = [...document.querySelectorAll(".step")];
const dots  = [...document.querySelectorAll(".progress .dot")];
let current = 0;

function resetToHome() {
  // ล้างคลาสจากทุกหน้า กันกรณีค้างกลางแอนิเมชัน
  steps.forEach(s => s.classList.remove(
    "current","enter-from-right","enter-from-left","leave-to-left","leave-to-right"
  ));

  // ตั้งหน้าแรกเป็น current
  current = 0;
  steps[0].classList.add("current");

  // อัปเดต progress dot ให้ถูกต้อง
  dots.forEach((d, idx)=> d.classList.toggle("active", idx <= 0));

  // ปิด modal ถ้าเปิดอยู่
  try { closeHB?.(); } catch {}

  // เลื่อนกลับบนสุด กันภาพเหมือน “หน้าว่าง”
  scrollTo({ top: 0, behavior: "smooth" });
}

function showStep(i){
  const next = Math.max(0, Math.min(i, steps.length - 1));
  if (next === current) return;

  const dir = next > current ? 1 : -1;
  const from = steps[current];
  const to   = steps[next];

  // เตรียมหน้าที่จะเข้า
  to.classList.add("current"); // ให้มองเห็นก่อน
  to.classList.add(dir > 0 ? "enter-from-right" : "enter-from-left");

  // ออกแอนิเมชันหน้าปัจจุบัน
  from.classList.add(dir > 0 ? "leave-to-left" : "leave-to-right");

  // อัปเดต progress dot
  dots.forEach((d, idx)=> d.classList.toggle("active", idx <= next));

  // เมื่อแอนิเมชันจบ เคลียร์คลาสที่ใช้เฉพาะช่วงทรานซิชัน
  const DONE = () => {
    from.classList.remove("leave-to-left","leave-to-right","current");
    to.classList.remove("enter-from-right","enter-from-left");
    from.removeEventListener("animationend", DONE);
    // หน้า 2 (index=1) เริ่มพิมพ์ครั้งแรก
    if (next === 3 && typeEl.textContent.trim().length === 0) {
      typeWriter(MESSAGE, typeEl, 50); // ปรับช้าลงได้ เช่น 50ms/ตัว
    }
    scrollTo({ top: 0, behavior: "smooth" });
  };
  from.addEventListener("animationend", DONE, { once: true });

  current = next;
}
const hbModal = document.getElementById("hbModal");
const hbOk    = document.getElementById("hbOk");
const hbPrev  = document.getElementById("hbPrev"); // เพิ่ม

function openHB() {
  if (!hbModal) return;
  hbModal.classList.remove("hidden");
  hbModal.setAttribute("aria-hidden", "false");
}

function closeHB() {
  if (!hbModal) return;
  hbModal.classList.add("hidden");
  hbModal.setAttribute("aria-hidden", "true");
}

const _showStep = showStep;
showStep = function(i) {
  _showStep(i);
  if (current === 1) openHB();
};

hbOk?.addEventListener("click", () => {
  closeHB();
  showStep(current + 1);
});

hbPrev?.addEventListener("click", () => {
  closeHB();
  showStep(current - 1);
});


// ===== หน่วงเวลา 5 วิ ก่อนปุ่ม "ถัดไป" ใช้งานได้ =====
function delayNextButtons() {
  const nextBtns = document.querySelectorAll("[data-next]");
  nextBtns.forEach(btn => {
    btn.disabled = true;
    btn.classList.add("waiting");
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove("waiting");
    }, 3000);
  });
}

// เรียกทุกครั้งที่เปลี่ยนหน้า
document.body.addEventListener("click", e => {
  if (e.target.matches("[data-next]")) {
    showStep(current + 1);
    delayNextButtons();
  }
  if (e.target.matches("[data-prev]")) showStep(current - 1);
});
document.getElementById("btnClose")?.addEventListener("click", () => {
  resetToHome();
});


document.getElementById("btnClose").addEventListener("click", ()=>showStep(0)); // กลับหน้า 1

// ===== Typewriter =====
const typeEl = document.getElementById("typewriter");
function typeWriter(text, el, speed=20){
  el.textContent = "";
  let i = 0;
  const timer = setInterval(()=>{
    el.textContent += text[i++] ?? "";
    if(i > text.length) clearInterval(timer);
  }, speed);
}

// ===== Countdown + พลุอัตโนมัติ =====
const dd = document.getElementById("dd"),
      hh = document.getElementById("hh"),
      mm = document.getElementById("mm"),
      ss = document.getElementById("ss");

let fired = false;
let countdownTimer = null;
function updateCountdown(){
  const now = new Date();
  const target = new Date(BIRTHDAY_DATE);
  const sec = Math.floor((target - now) / 1000);

  if (sec <= 0) {
    // ค้างไว้ที่ 00:00:00
    dd.textContent = "00";
    hh.textContent = "00";
    mm.textContent = "00";
    ss.textContent = "00";

    // จุดพลุครั้งเดียวถ้ายังไม่เคย
    if (!fired) {
      fired = true;
      startFireworks(10 * 60 * 1000); // ยิงต่อ 10 นาที
    }

    // หยุดตัวนับ
    if (countdownTimer) clearInterval(countdownTimer);
    return;
  }

  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  dd.textContent = String(d).padStart(2, "0");
  hh.textContent = String(h).padStart(2, "0");
  mm.textContent = String(m).padStart(2, "0");
  ss.textContent = String(s).padStart(2, "0");

    // 🔒 ล็อกปุ่มเริ่มการ์ดจนกว่าจะถึงเวลา
  const startBtn = document.querySelector('[data-next]');
  if (startBtn) {
    if (sec > 0) {
      startBtn.disabled = true;
      startBtn.textContent = "ยังไม่ถึงเวลา 🎈";
      startBtn.classList.add("waiting");
    } else {
      startBtn.disabled = false;
      startBtn.textContent = "เริ่มการ์ด";
      startBtn.classList.remove("waiting");
    }
  }

}

// เริ่มนับเวลา
countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();

setInterval(updateCountdown, 1000); updateCountdown();

// ===== Fireworks (canvas แบบต่อเนื่อง 10 นาทีแต่โปรยพอดี) =====
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let W, H, raf;

function resize(){
  const dpr = Math.min(2, devicePixelRatio || 1); // เซฟแรง
  W = Math.floor(innerWidth * dpr);
  H = Math.floor(innerHeight * dpr);
  canvas.width = W;
  canvas.height = H;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener("resize", resize); resize();

class Particle {
  constructor(x,y,angle,speed,color){
    this.x=x; this.y=y;
    this.vx=Math.cos(angle)*speed;
    this.vy=Math.sin(angle)*speed;
    this.life=60+Math.random()*25;
    this.color=color;
  }
  step(){
    this.x+=this.vx; this.y+=this.vy;
    this.vy+=0.06;           // แรงโน้มถ่วงเบา ๆ
    this.life--;
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x, this.y, 2, 2);
    return this.life>0;
  }
}

let particles = [];
let running=false, endAt=0;

// ปรับ “ความถี่” และ “จำนวนอนุภาค/ครั้ง” ได้ตรงนี้
const SPAWN_INTERVAL_MS = 900;         // ยิงครั้งใหม่ทุก ~0.9 วิ (ไม่ถี่เกิน)
const PARTICLES_PER_BOOM = 45;         // อนุภาคต่อดอก
const MAX_PARTICLES = 2400;            // ลิมิตป้องกันหน่วง

function boom(){
  const x = Math.random()*innerWidth*0.8 + innerWidth*0.1;
  const y = Math.random()*innerHeight*0.4 + innerHeight*0.1;
  const colors = ["#ff7ac3","#ffa7d7","#9ee6ff","#ffd166","#a0ffb5"];
  const color = colors[Math.floor(Math.random()*colors.length)];
  const n = PARTICLES_PER_BOOM;

  // เคารพลิมิต
  if (particles.length > MAX_PARTICLES) return;

  for(let i=0;i<n;i++){
    const a = Math.random()*Math.PI*2;
    const s = Math.random()*4+1.5;
    particles.push(new Particle(x,y,a,s,color));
  }
}

let lastSpawn = 0;
function loop(t){
  if(!running) return;
  ctx.clearRect(0,0,innerWidth,innerHeight);

  // spawn แบบ interval เวลาจริง
  if (t - lastSpawn >= SPAWN_INTERVAL_MS) {
    lastSpawn = t;
    boom();
    // สุ่มเพิ่มบ้างเป็นครั้งคราวให้ดูมีมิติ
    if (Math.random() < 0.15) boom();
  }

  // อัปเดตอนุภาค
  particles = particles.filter(p=>p.step());

  if (performance.now() < endAt) {
    raf = requestAnimationFrame(loop);
  } else {
    running=false;
    ctx.clearRect(0,0,innerWidth,innerHeight);
  }
}

function startFireworks(ms=600000){   // ดีฟอลต์ 10 นาที
  running = true;
  endAt = performance.now() + ms;
  lastSpawn = 0;
  boom(); boom();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
} // <<< ปิดฟังก์ชันให้จบตรงนี้

// ===== Gallery ปุ่มซ้ายขวา =====
const slides = document.querySelectorAll("#gallerySlides img");
const prev = document.getElementById("prevImg");
const next = document.getElementById("nextImg");
const dotWrap = document.getElementById("dots");
const captionEl = document.getElementById("captionTop");
let index = 0;

dotWrap.innerHTML = [...slides].map((_,i)=>`<div class="dot${i===0?' active':''}"></div>`).join("");
const dotEls = [...dotWrap.querySelectorAll(".dot")];

function showSlide(i){
  // ทำ index ให้ถูกแม้ติดลบ/เกิน
  const n = ((i % slides.length) + slides.length) % slides.length;

  // ล้างสถานะทุกภาพก่อน
  slides.forEach(img => {
    img.classList.remove("show","animate");
    img.style.opacity = "0";
    img.style.zIndex = "0";
  });

  // โชว์ภาพเป้าหมาย + เล่นแอนิเมชันใหม่
  const img = slides[n];
  void img.offsetWidth;                 // รีสตาร์ท animation
  img.classList.add("show","animate");
  img.style.opacity = "1";
  img.style.zIndex = "1";

  // อัปเดตแคปชันเหนือรูป
  captionEl.textContent = img.dataset.caption || img.alt || "";
  captionEl.classList.remove("fade"); void captionEl.offsetWidth; captionEl.classList.add("fade");

  // อัปเดต dot
  dotEls.forEach((d,idx)=>d.classList.toggle("active", idx===n));
  index = n;
}
showSlide(0);
next.addEventListener("click", ()=> showSlide(index+1));
prev.addEventListener("click", ()=> showSlide(index-1));
dotEls.forEach((d,i)=> d.addEventListener("click", ()=> showSlide(i)));
