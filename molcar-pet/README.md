# 뿌이뿌이 모루카 키우기

기니피그 자동차 모루카를 돌보고, 성장시키고, 5인방을 모으는 다마고치형 웹게임.

## 실행 방법

ES 모듈은 `file://`에서 동작하지 않으므로 로컬 서버가 필요합니다.

```bash
cd molcar-pet
npx serve .
```

`http://localhost:3000` 으로 접속하세요.

### Vercel 배포

```bash
vercel --yes
```

빌드 도구 없는 정적 사이트입니다. `vercel.json`에 최소 설정만 포함되어 있습니다.

## 게임 플레이

### 기본 조작

달걀 기기 하단의 **셸 버튼 3개**로 조작합니다.

| 버튼 | 기능 |
|------|------|
| 왼쪽 | **행동** — 밥주기, 놀아주기, 씻기기, 재우기, 드라이브 |
| 가운데 | **도감** — 수집한 모루카 확인 + 가챠 |
| 오른쪽 | **상태** — 스탯 확인 + 졸업 |

같은 버튼을 다시 누르면 모루카가 있는 방 화면으로 돌아갑니다.

### 스탯 4종

| 스탯 | 감소 속도 | 회복 행동 |
|------|-----------|-----------|
| 배고픔 | 4/분 | 밥주기 (+30) |
| 행복 | 3/분 | 놀아주기 (+25) |
| 청결 | 2/분 | 씻기기 (+100) |
| 에너지 | 2.5/분 | 재우기 (+100) |

**드라이브**는 행복 +15, 청결 -20의 복합 행동입니다.

### Wants 시스템

약 3분마다 모루카가 욕구(밥/놀기/씻기)를 표현합니다. 해당 행동을 해주면 코인 +10, 케어 점수 +5. 5분 내 안 들어주면 케어 점수 -5.

### 성장/진화

| 단계 | 나이 |
|------|------|
| 아기 | 0분~ |
| 청소년 | 30분~ |
| 성체 | 120분~ |

성체 진입 시 **케어 점수**에 따라 종이 결정됩니다.

### 졸업/도감

성체가 되면 **졸업**시킬 수 있습니다. 졸업하면 도감에 등록되고, 코인 +50을 받고, 새 아기 모루카가 시작됩니다.

### 가챠

도감 화면에서 100코인으로 **가챠**를 돌려 랜덤 모루카를 수집할 수 있습니다.

### 오프라인 진행

`localStorage`에 자동 저장됩니다. 다시 접속하면 경과 시간만큼 스탯 감소/성장이 한번에 계산됩니다.

## 모루카 5인방

| 종 | 이름 | 색상 | 레어도 | 케어 조건 | 특성 |
|----|------|------|--------|-----------|------|
| 🤍 | 시로모 | 아이보리 | common | ~29 | 청결 감소 -20% |
| 🥔 | 포테토 | 노랑 | common | 30~49 | 밥 회복 +20% |
| 🍫 | 민트초코 | 민트 | uncommon | 50~69 | 미니게임 코인 +15% |
| 🌹 | 아비 | 빨강 | rare | 70~84 | 행복 감소 -20% |
| 🧸 | 테디 | 갈색 | rare | 85+ | 드라이브 행복 +50% |

## 프로젝트 구조

```
molcar-pet/
├── index.html
├── styles.css
├── vercel.json
├── assets/sprites/          # 스프라이트 이미지
│   ├── molcar_spritesheet.png   # 7프레임 애니메이션 시트
│   └── molcar_default.png       # 기본 정지 이미지
└── src/
    ├── main.js                  # 부트스트랩
    ├── core/
    │   └── EventEmitter.js      # on/off/emit 옵저버
    ├── data/
    │   ├── config.js            # 모든 튜닝값
    │   ├── items.js             # 상점 아이템 카탈로그
    │   └── molcars.js           # 5인방 종 카탈로그 + 가챠 + trait
    ├── model/
    │   ├── GameState.js         # 최상위 상태 (유일한 변경 진입점)
    │   ├── Molcar.js            # 이름/종/단계/나이/케어/스탯
    │   ├── Stats.js             # 4종 스탯 (0~100 clamp)
    │   ├── Collection.js        # 도감 (종별 수집 기록)
    │   ├── Inventory.js         # 인벤토리 (아이템/악세서리)
    │   ├── evolution.js         # 나이→단계, 케어→종 분기 (순수 함수)
    │   ├── wants.js             # 욕구 생성/만료 (순수 함수)
    │   └── storage.js           # localStorage 저장/복원
    ├── view/
    │   ├── GameView.js          # 상태→DOM, 셸버튼→화면전환, intent emit
    │   ├── sprites.js           # 스프라이트시트 캔버스 애니메이션
    │   └── room.js              # 방 배경 SVG + 똥 스프라이트
    ├── controller/
    │   ├── GameController.js    # intent 라우팅 + change시 렌더/저장
    │   └── GameLoop.js          # setInterval 1초 tick
    └── minigame/
        ├── RaceModel.js         # 레이싱 상태 (3레인 장애물 회피)
        ├── RaceView.js          # 캔버스 렌더 + 입력 emit
        └── RaceController.js    # 자체 루프, 종료시 reward() 콜백
```

## 아키텍처

**MVC + 단방향 데이터 흐름**

```
View emit('intent') → Controller → Model 메서드 → Model emit('change') → View render()
```

- **Model**: DOM을 모름. 순수 상태 + 비즈니스 로직.
- **View**: 게임 로직을 모름. 상태를 받아 렌더, 사용자 입력을 intent로 emit.
- **Controller**: 둘을 연결. intent를 Model 메서드로 라우팅, change를 View render + storage save로 연결.
- **Minigame**: GameState 내부에 접근하지 않음. 종료 시 `reward(coins, happiness)` 콜백만 호출.

## 기술 스택

- 바닐라 JavaScript (ES 모듈, 빌드/번들러 없음)
- 순수 CSS (외부 프레임워크 없음)
- SVG (방 배경, 똥 스프라이트)
- Canvas API (스프라이트시트 프레임 애니메이션)
- localStorage (자동 저장/복원)
