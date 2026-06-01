export function createRoomSVG() {
  return `<svg class="room-svg" viewBox="0 0 270 130" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- wall -->
  <rect x="0" y="0" width="270" height="78" fill="#faf8f5"/>
  <!-- floor -->
  <rect x="0" y="78" width="270" height="52" fill="#d4e6f1"/>
  <rect x="0" y="78" width="270" height="3" fill="#b0c4de"/>
  <!-- floor tiles -->
  <line x1="0" y1="104" x2="270" y2="104" stroke="#c3d9ea" stroke-width="1"/>
  <line x1="45" y1="78" x2="45" y2="130" stroke="#c3d9ea" stroke-width=".5"/>
  <line x1="90" y1="78" x2="90" y2="130" stroke="#c3d9ea" stroke-width=".5"/>
  <line x1="135" y1="78" x2="135" y2="130" stroke="#c3d9ea" stroke-width=".5"/>
  <line x1="180" y1="78" x2="180" y2="130" stroke="#c3d9ea" stroke-width=".5"/>
  <line x1="225" y1="78" x2="225" y2="130" stroke="#c3d9ea" stroke-width=".5"/>

  <!-- window frame -->
  <rect x="175" y="10" width="60" height="48" rx="2" fill="#87ceeb" stroke="#4682b4" stroke-width="3"/>
  <line x1="205" y1="10" x2="205" y2="58" stroke="#4682b4" stroke-width="2.5"/>
  <line x1="175" y1="34" x2="235" y2="34" stroke="#4682b4" stroke-width="2.5"/>
  <!-- clouds -->
  <ellipse cx="190" cy="24" rx="10" ry="5" fill="white" opacity=".7"/>
  <ellipse cx="218" cy="20" rx="8" ry="4" fill="white" opacity=".6"/>
  <ellipse cx="195" cy="46" rx="7" ry="3.5" fill="white" opacity=".5"/>
  <!-- window sill -->
  <rect x="172" y="56" width="66" height="5" rx="1" fill="#e8e0d8" stroke="#c8bfb5" stroke-width="1"/>

  <!-- bed -->
  <!-- headboard -->
  <rect x="15" y="30" width="28" height="38" rx="4" fill="#3a78c2"/>
  <rect x="17" y="32" width="24" height="20" rx="2" fill="#4a90d9"/>
  <!-- mattress -->
  <rect x="15" y="44" width="115" height="26" rx="3" fill="#4a90d9"/>
  <!-- blanket fold -->
  <rect x="43" y="44" width="87" height="12" rx="2" fill="#5ba0e8"/>
  <!-- pillow -->
  <ellipse cx="30" cy="48" rx="12" ry="6" fill="#f0f0f0" stroke="#ddd" stroke-width="1"/>
  <!-- bed frame bottom -->
  <rect x="15" y="68" width="115" height="4" rx="1" fill="#356ab0"/>
  <!-- legs -->
  <rect x="20" y="72" width="5" height="7" rx="1" fill="#c9a54e"/>
  <rect x="60" y="72" width="5" height="7" rx="1" fill="#c9a54e"/>
  <rect x="100" y="72" width="5" height="7" rx="1" fill="#c9a54e"/>
  <rect x="125" y="72" width="5" height="7" rx="1" fill="#c9a54e"/>

  <!-- nightstand -->
  <rect x="140" y="52" width="24" height="24" rx="2" fill="#3a5f8a" stroke="#2a4a6a" stroke-width="1.5"/>
  <line x1="140" y1="64" x2="164" y2="64" stroke="#2a4a6a" stroke-width="1"/>
  <!-- knob -->
  <circle cx="152" cy="58" r="1.5" fill="#c9a54e"/>
  <!-- nightstand legs -->
  <rect x="142" y="76" width="3" height="4" fill="#2a4a6a"/>
  <rect x="159" y="76" width="3" height="4" fill="#2a4a6a"/>

  <!-- potted plant on nightstand -->
  <rect x="148" y="44" width="10" height="8" rx="1" fill="#8b4513" stroke="#6b3410" stroke-width="1"/>
  <rect x="146" y="43" width="14" height="3" rx="1" fill="#9b5523"/>
  <!-- stem -->
  <line x1="153" y1="44" x2="153" y2="36" stroke="#3a6b2a" stroke-width="2"/>
  <line x1="153" y1="40" x2="148" y2="34" stroke="#3a6b2a" stroke-width="1.5"/>
  <line x1="153" y1="38" x2="158" y2="33" stroke="#3a6b2a" stroke-width="1.5"/>
  <!-- leaves -->
  <ellipse cx="153" cy="34" rx="5" ry="4" fill="#32a852"/>
  <ellipse cx="148" cy="32" rx="4" ry="3" fill="#45c965"/>
  <ellipse cx="158" cy="31" rx="4" ry="3" fill="#3cb850"/>

  <!-- wall decoration line -->
  <line x1="0" y1="3" x2="270" y2="3" stroke="#ece5dc" stroke-width="3"/>
</svg>`;
}

const POOP_SVG = `<svg viewBox="0 0 20 20" width="18" height="18" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <ellipse cx="10" cy="16" rx="7" ry="4" fill="#8B6914"/>
  <ellipse cx="10" cy="12" rx="5.5" ry="3.5" fill="#A07818"/>
  <ellipse cx="10" cy="9" rx="4" ry="3" fill="#B8901C"/>
  <circle cx="7" cy="8" r="1" fill="#333"/>
  <circle cx="13" cy="8" r="1" fill="#333"/>
  <!-- stink lines -->
  <path d="M5 4 Q6 2 5 0" stroke="#9a8" stroke-width="1" fill="none" opacity=".6"/>
  <path d="M10 3 Q11 1 10 -1" stroke="#9a8" stroke-width="1" fill="none" opacity=".6"/>
  <path d="M15 4 Q16 2 15 0" stroke="#9a8" stroke-width="1" fill="none" opacity=".6"/>
</svg>`;

export function createPoopElement() {
  const el = document.createElement('div');
  el.className = 'poop-sprite';
  el.innerHTML = POOP_SVG;
  return el;
}
