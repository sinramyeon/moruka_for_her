# Sprite Assets

## 현재 파일

| 파일 | 용도 |
|------|------|
| `molcar_spritesheet.png` | 7프레임 애니메이션 스프라이트시트 (500x500) |
| `molcar_default.png` | 기본 정지 이미지 |

`sprites.js`가 스프라이트시트에서 7프레임을 잘라 캔버스 애니메이션으로 재생합니다.

## 커스텀 스프라이트 추가

종별 스프라이트를 추가하려면 `{종id}_{단계}.png` 형식으로 넣으세요.

### 5인방 x 3단계 = 15장

| 파일명 | 설명 |
|--------|------|
| `potato_baby.png` | 포테토 아기 |
| `potato_teen.png` | 포테토 청소년 |
| `potato_adult.png` | 포테토 성체 |
| `shiromo_baby.png` | 시로모 아기 |
| `shiromo_teen.png` | 시로모 청소년 |
| `shiromo_adult.png` | 시로모 성체 |
| `choco_baby.png` | 민트초코 아기 |
| `choco_teen.png` | 민트초코 청소년 |
| `choco_adult.png` | 민트초코 성체 |
| `abbie_baby.png` | 아비 아기 |
| `abbie_teen.png` | 아비 청소년 |
| `abbie_adult.png` | 아비 성체 |
| `teddy_baby.png` | 테디 아기 |
| `teddy_teen.png` | 테디 청소년 |
| `teddy_adult.png` | 테디 성체 |

권장 크기: 145 x 97 px (또는 배수). `image-rendering: pixelated` 적용됨.

현재는 종/단계와 무관하게 스프라이트시트 애니메이션이 재생됩니다. 종별 스프라이트를 넣으면 `sprites.js`에서 분기 로직을 추가해야 합니다.
