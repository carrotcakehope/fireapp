const statusMeta = {
  required: { label: "설치 필요", className: "status-required" },
  review: { label: "검토 필요", className: "status-review" },
  notRequired: { label: "해당 없음", className: "status-not-required" },
};

const categories = {
  extinguishing: "소화설비",
  alarm: "경보설비",
  evacuation: "피난구조설비",
  waterSupply: "소화용수설비",
  fireSupport: "소화활동설비",
};

const steps = [
  {
    key: "isThirdClassNeighborhood",
    title: "3급 근린생활시설인가요?",
    help: "관계인이 자체점검을 직접 작성해서 오는 대상인지 먼저 확인합니다.",
    type: "choice",
    options: [
      { value: "yes", label: "예", description: "3급 근린생활시설 기준으로 계속 진행" },
      { value: "no", label: "아니오", description: "용도 선택 화면으로 이동" },
    ],
  },
  {
    key: "permitBefore1992",
    title: "건축허가일이 1992년 7월 28일 이전인가요?",
    help: "(건축물 대장을 확인해주세요.)",
    type: "choice",
    options: [
      { value: "yes", label: "예", description: "1992년 7월 28일 이전에 건축허가" },
      { value: "no", label: "아니오", description: "1992년 7월 28일 이후에 건축허가" },
    ],
  },
  {
    key: "pre1992PermitRange",
    title: "건축허가일 구간을 선택해주세요.",
    help: "건축물 대장상의 건축허가일에 맞는 기간을 선택하세요.",
    type: "choice",
    options: [
      { value: "1982-08-07_to_1984-06-30", label: "1982년 8월 7일 ~ 1984년 6월 30일", description: "해당 기간에 건축허가" },
      { value: "1984-06-30_to_1990-06-29", label: "1984년 6월 30일 ~ 1990년 6월 29일", description: "해당 기간에 건축허가" },
      { value: "1990-06-29_to_1990-12-01", label: "1990년 6월 29일 ~ 1990년 12월 1일", description: "해당 기간에 건축허가" },
      { value: "1990-12-01_to_1991-01-08", label: "1990년 12월 1일 ~ 1992년 7월 28일", description: "해당 기간에 건축허가" },
    ],
  },
  {
    key: "thirdClassDetailUse",
    title: "세부용도는 무엇인가요?",
    help: "붙임파일 기준에 맞춰 세부용도를 선택해주세요.",
    type: "choice",
    options: [
      { value: "general", label: "일반근린생활시설", description: "일반근린생활시설 기준 적용" },
      { value: "marketBathhouse", label: "시장 또는 공중목욕장", description: "시장·공중목욕장 기준 적용" },
    ],
  },
  {
    key: "occupancyType",
    title: "어떤 용도를 탐색할까요?",
    help: "용도를 선택하면 해당 소방시설 기준을 안내합니다.",
    type: "choice",
    options: [
      { value: "neighborhood", label: "근린생활시설", description: "일반 상가·사무실·식당 등" },
      { value: "lodging", label: "숙박시설", description: "호텔·모텔·여관 등" },
      { value: "elderly", label: "노유자시설", description: "요양원·복지관·아동센터 등" },
      { value: "medical", label: "의료시설", description: "병원·요양병원·정신의료기관 등" },
    ],
  },
  {
    key: "facilitySubtype",
    title: "어떤 근린생활시설인가요?",
    help: "세부 유형에 따라 설치 기준이 달라집니다.",
    type: "choice",
    onlyFor: "neighborhood",
    options: [
      { value: "general", label: "일반 근린생활시설", description: "일반 상가, 사무형 근린생활시설" },
      { value: "bathhouse", label: "목욕장", description: "목욕장 기준 별도 적용" },
      { value: "clinicInpatient", label: "입원실 있는 의원", description: "의원·치과의원·한의원" },
      { value: "postpartum", label: "조산원·산후조리원", description: "면적 기준에 따라 설치 설비 판정" },
    ],
  },
  {
    key: "postpartumAreaRange",
    title: "바닥면적이 600㎡ 미만인가요, 이상인가요?",
    help: "조산원·산후조리원을 선택한 경우에만 확인합니다.",
    type: "choice",
    onlyFor: "neighborhood",
    options: [
      { value: "under600", label: "600㎡ 미만", description: "간이스프링클러설비, 자동화재탐지설비, 자동화재속보설비 대상" },
      { value: "600plus", label: "600㎡ 이상", description: "스프링클러설비, 자동화재탐지설비, 자동화재속보설비 대상" },
    ],
  },
  { key: "totalArea", title: "건물 연면적은 얼마인가요?", help: "㎡ 단위로 입력하세요.", type: "number", onlyFor: "neighborhood", min: 0, step: 0.1, placeholder: "예: 1600" },
  { key: "neighborhoodArea", title: "근린생활시설 사용부분 바닥면적 합계는 얼마인가요?", help: "간이스프링클러설비 판단에 사용됩니다.", type: "number", onlyFor: "neighborhood", min: 0, step: 0.1, placeholder: "예: 1200" },
  { key: "aboveGroundFloors", title: "지상층수는 몇 층인가요?", help: "지하층을 제외한 지상층수를 입력해 주세요.", type: "number", onlyFor: "neighborhood", min: 0, step: 1, placeholder: "예: 6" },
  { key: "basementFloors", title: "지하층수는 몇 층인가요?", help: "지하층 조건이 들어가는 설비를 판정합니다.", type: "number", onlyFor: "neighborhood", min: 0, step: 1, placeholder: "예: 1" },
  { key: "basementAreaSum", title: "지하층 바닥면적 합계는 얼마인가요?", help: "지하층수와 함께 지하층 평균 면적을 계산합니다.", type: "number", onlyFor: "neighborhood", min: 0, step: 0.1, placeholder: "예: 180" },
  {
    key: "hasWindowlessFloor",
    title: "무창층이 있나요?",
    help: "무창층이 있으면 면적을 이어서 입력합니다.",
    type: "choice",
    onlyFor: "neighborhood",
    options: [
      { value: "yes", label: "있음", description: "무창층이 하나 이상 있는 경우" },
      { value: "no", label: "없음", description: "무창층이 없는 경우" },
    ],
  },
  { key: "windowlessArea", title: "무창층 바닥면적은 얼마인가요?", help: "무창층이 있으면 바닥면적 합계를 입력해 주세요.", type: "number", onlyFor: "neighborhood", min: 0, step: 0.1, placeholder: "예: 200" },
  {
    key: "hasLargeTargetFloor",
    title: "지하층, 무창층, 또는 4층 이상 층 중 300㎡ 이상인 층이 있나요?",
    help: "연면적만으로 옥내소화전설비가 결정되지 않을 때만 묻습니다.",
    type: "choice",
    onlyFor: "neighborhood",
    options: [
      { value: "yes", label: "있음", description: "해당 층이 하나라도 있으면 선택" },
      { value: "no", label: "없음", description: "조건에 맞는 층이 없으면 선택" },
    ],
  },
  { key: "firstSecondFloorArea", title: "지상 1층과 2층의 바닥면적 합계는 얼마인가요?", help: "연면적이 9,000㎡ 이상일 때만 묻습니다.", type: "number", onlyFor: "neighborhood", min: 0, step: 0.1, placeholder: "예: 9200" },
  { key: "detailSet", title: "추가 조건을 입력해 주세요.", help: "주차 관련 공간과 전기실·발전실·변전실·전산실이 없으면 0으로 입력해 주세요.", type: "compound", onlyFor: "neighborhood" },
  {
    key: "has24HourStaff",
    title: "24시간 상주 근무자가 있나요?",
    help: "자동화재속보설비 면제 검토가 필요한 경우에만 묻습니다.",
    type: "choice",
    onlyFor: "neighborhood",
    options: [
      { value: "yes", label: "있음", description: "24시간 근무자가 상주함" },
      { value: "no", label: "없음", description: "24시간 상주 근무자가 없음" },
    ],
  },
  {
    key: "hasMultiuseBusiness",
    title: "다중이용업소가 있나요?",
    help: "다중이용업소가 있으면 설치해야 하는 소방시설을 별도로 표시합니다.",
    type: "choice",
    onlyFor: "neighborhood",
    options: [
      { value: "yes", label: "예", description: "다중이용업소 추가 설치시설까지 확인" },
      { value: "no", label: "아니오", description: "기존 근린생활시설 결과만 표시" },
    ],
  },
  {
    key: "multiuseSimpleSprinklerCheck",
    title: "간이스프링클러설비 설치 대상인지 확인합니다.",
    help: "해당되는 항목은 중복 선택할 수 있습니다. 하나라도 해당하면 간이스프링클러설비 설치대상입니다.",
    type: "compound",
    onlyFor: "neighborhood",
  },
  {
    key: "multiuseOnSecondToTenthFloor",
    title: "다중이용업소가 2층~10층 사이에 설치돼있나요?",
    help: "맞다면 피난기구를 설치해야 합니다.",
    type: "choice",
    onlyFor: "neighborhood",
    options: [
      { value: "yes", label: "예", description: "2층부터 10층 사이에 설치돼 있음" },
      { value: "no", label: "아니오", description: "해당 층 범위가 아님" },
    ],
  },
  {
    key: "multiuseOnGroundOrRefugeFloor",
    title: "지상 1층이나 피난층에 설치돼있나요?",
    help: "산후조리업이나 고시원에 해당할 때만 확인하며, 맞다면 간이스프링클러설비 대상에서 제외합니다.",
    type: "choice",
    onlyFor: "neighborhood",
    options: [
      { value: "yes", label: "예", description: "지상 1층 또는 피난층에 설치돼 있음" },
      { value: "no", label: "아니오", description: "지상 1층 또는 피난층이 아님" },
    ],
  },
  {
    key: "multiuseUsesAV",
    title: "'노래반주기 등 영상음향장치를 사용하는 영업장'인가요?",
    help: "맞다면 자동화재탐지설비와 영상음향차단장치를 설치해야 합니다.",
    type: "choice",
    onlyFor: "neighborhood",
    options: [
      { value: "yes", label: "예", description: "영상음향장치를 사용함" },
      { value: "no", label: "아니오", description: "영상음향장치를 사용하지 않음" },
    ],
  },
  {
    key: "multiuseHasGasFacility",
    title: "가스시설을 사용하는 주방이나 난방시설이 있나요?",
    help: "맞다면 가스누설경보기를 설치해야 합니다.",
    type: "choice",
    onlyFor: "neighborhood",
    options: [
      { value: "yes", label: "예", description: "가스시설을 사용함" },
      { value: "no", label: "아니오", description: "가스시설을 사용하지 않음" },
    ],
  },
  {
    key: "multiuseHasEvacuationRoute",
    title: "영업장 내부 피난통로 또는 복도가 있는 영업장인가요?",
    help: "맞다면 피난유도선을 설치해야 합니다.",
    type: "choice",
    onlyFor: "neighborhood",
    options: [
      { value: "yes", label: "예", description: "피난통로 또는 복도가 있음" },
      { value: "no", label: "아니오", description: "해당 통로가 없음" },
    ],
  },

  // ── 숙박시설 전용 스텝 ──
  {
    key: "lodgingIsTouristHotel",
    title: "어떤 숙박시설인가요?",
    help: "관광호텔이고 지하층을 포함한 층수가 7층 이상이면 인명구조기구(방열복·공기호흡기 등)를 설치해야 합니다.",
    type: "choice",
    onlyFor: "lodging",
    options: [
      { value: "no", label: "일반 숙박시설", description: "모텔·여관·펜션 등 관광호텔이 아닌 숙박시설" },
      { value: "yes", label: "관광호텔", description: "관광진흥법에 따른 관광호텔업 등록 시설" },
    ],
  },
  { key: "lodgingTotalArea", title: "건물 연면적은 얼마인가요?", help: "㎡ 단위로 입력하세요.", type: "number", onlyFor: "lodging", min: 0, step: 0.1, placeholder: "예: 2000" },
  { key: "lodgingArea", title: "숙박시설로 사용되는 바닥면적 합계는 얼마인가요?", help: "간이스프링클러·스프링클러 판단에 사용됩니다. 건물 전체를 해당 용도로 쓰는 경우에는 연면적과 동일하게 입력해주세요.", type: "number", onlyFor: "lodging", min: 0, step: 0.1, placeholder: "예: 450" },
  { key: "lodgingAboveGroundFloors", title: "지상층수는 몇 층인가요?", help: "지하층을 제외한 지상층수를 입력해 주세요.", type: "number", onlyFor: "lodging", min: 0, step: 1, placeholder: "예: 8" },
  { key: "lodgingBasementFloors", title: "지하층수는 몇 층인가요?", help: "지하층 조건이 들어가는 설비를 판정합니다.", type: "number", onlyFor: "lodging", min: 0, step: 1, placeholder: "예: 1" },
  { key: "lodgingBasementAreaSum", title: "지하층 바닥면적 합계는 얼마인가요?", help: "없으면 0을 입력하세요.", type: "number", onlyFor: "lodging", min: 0, step: 0.1, placeholder: "예: 200" },
  {
    key: "lodgingHasWindowlessFloor",
    title: "무창층이 있나요?",
    help: "무창층이 있으면 면적을 이어서 입력합니다.",
    type: "choice",
    onlyFor: "lodging",
    options: [
      { value: "yes", label: "있음", description: "무창층이 하나 이상 있는 경우" },
      { value: "no", label: "없음", description: "무창층이 없는 경우" },
    ],
  },
  { key: "lodgingWindowlessArea", title: "무창층 바닥면적은 얼마인가요?", help: "무창층이 있으면 바닥면적을 입력하세요.", type: "number", onlyFor: "lodging", min: 0, step: 0.1, placeholder: "예: 300" },
  {
    key: "lodgingHasLargeFloorFor1000",
    title: "지하층, 무창층 또는 4층 이상 층 중 바닥면적 1,000㎡ 이상인 층이 있나요?",
    help: "스프링클러설비(해당층) 설치 조건입니다.",
    type: "choice",
    onlyFor: "lodging",
    options: [
      { value: "yes", label: "있음", description: "해당 조건의 층이 하나라도 있으면 선택" },
      { value: "no", label: "없음", description: "조건에 맞는 층이 없으면 선택" },
    ],
  },
  {
    key: "lodgingHasGasFacility",
    title: "가스시설이 설치돼 있나요?",
    help: "가스누설경보기 설치 여부를 판단합니다.",
    type: "choice",
    onlyFor: "lodging",
    options: [
      { value: "yes", label: "있음", description: "가스시설이 설치돼 있음" },
      { value: "no", label: "없음", description: "가스시설이 없음" },
    ],
  },
  { key: "lodgingDetailSet", title: "주차·전기실 추가 조건을 입력해 주세요.", help: "해당 공간이 없으면 0으로 입력해 주세요.", type: "compound", onlyFor: "lodging" },
  {
    key: "lodgingHasMultiuseBusiness",
    title: "다중이용업소가 있나요?",
    help: "다중이용업소가 있으면 설치해야 하는 안전시설을 별도로 표시합니다.",
    type: "choice",
    onlyFor: "lodging",
    options: [
      { value: "yes", label: "예", description: "다중이용업소 추가 설치시설까지 확인" },
      { value: "no", label: "아니오", description: "기존 숙박시설 결과만 표시" },
    ],
  },
  {
    key: "lodgingMultiuseSimpleSprinklerCheck",
    title: "간이스프링클러설비 설치 대상인지 확인합니다.",
    help: "해당되는 항목은 중복 선택할 수 있습니다.",
    type: "compound",
    onlyFor: "lodging",
  },
  {
    key: "lodgingMultiuseOnSecondToTenthFloor",
    title: "다중이용업소가 2층~10층 사이에 설치돼있나요?",
    help: "맞다면 피난기구를 설치해야 합니다.",
    type: "choice",
    onlyFor: "lodging",
    options: [
      { value: "yes", label: "예", description: "2층부터 10층 사이에 설치돼 있음" },
      { value: "no", label: "아니오", description: "해당 층 범위가 아님" },
    ],
  },
  {
    key: "lodgingMultiuseOnGroundOrRefugeFloor",
    title: "지상 1층이나 피난층에 설치돼있나요?",
    help: "산후조리업이나 고시원에 해당할 때만 확인합니다.",
    type: "choice",
    onlyFor: "lodging",
    options: [
      { value: "yes", label: "예", description: "지상 1층 또는 피난층에 설치돼 있음" },
      { value: "no", label: "아니오", description: "지상 1층 또는 피난층이 아님" },
    ],
  },
  {
    key: "lodgingMultiuseUsesAV",
    title: "'노래반주기 등 영상음향장치를 사용하는 영업장'인가요?",
    help: "맞다면 자동화재탐지설비와 영상음향차단장치를 설치해야 합니다.",
    type: "choice",
    onlyFor: "lodging",
    options: [
      { value: "yes", label: "예", description: "영상음향장치를 사용함" },
      { value: "no", label: "아니오", description: "영상음향장치를 사용하지 않음" },
    ],
  },
  {
    key: "lodgingMultiuseHasGasFacility",
    title: "다중이용업소에 가스시설을 사용하는 주방이나 난방시설이 있나요?",
    help: "맞다면 가스누설경보기를 설치해야 합니다.",
    type: "choice",
    onlyFor: "lodging",
    options: [
      { value: "yes", label: "예", description: "가스시설을 사용함" },
      { value: "no", label: "아니오", description: "가스시설을 사용하지 않음" },
    ],
  },
  {
    key: "lodgingMultiuseHasEvacuationRoute",
    title: "영업장 내부 피난통로 또는 복도가 있는 영업장인가요?",
    help: "맞다면 피난유도선을 설치해야 합니다.",
    type: "choice",
    onlyFor: "lodging",
    options: [
      { value: "yes", label: "예", description: "피난통로 또는 복도가 있음" },
      { value: "no", label: "아니오", description: "해당 통로가 없음" },
    ],
  },

  // ── 노유자시설 전용 스텝 ──
  {
    key: "elderlySubtype",
    title: "어떤 노유자시설인가요?",
    help: "생활시설 여부에 따라 간이스프링클러·자동화재탐지설비·자동화재속보설비 기준이 달라집니다.",
    type: "choice",
    onlyFor: "elderly",
    options: [
      { value: "general", label: "일반 노유자시설", description: "숙식을 제공하지 않는 시설 — 노인복지관, 아동센터, 노인주간보호센터 등" },
      { value: "livingFacility", label: "노유자 생활시설", description: "숙식을 함께 제공하는 시설 — 양로원, 노인요양원, 아동복지시설 등" },
    ],
  },
  { key: "elderlyTotalArea", title: "건물 연면적은 얼마인가요?", help: "㎡ 단위로 입력하세요.", type: "number", onlyFor: "elderly", min: 0, step: 0.1, placeholder: "예: 1200" },
  { key: "elderlyArea", title: "노유자시설로 사용되는 바닥면적 합계는 얼마인가요?", help: "스프링클러·간이스프링클러 판단에 사용됩니다. 건물 전체를 해당 용도로 쓰는 경우에는 연면적과 동일하게 입력해주세요.", type: "number", onlyFor: "elderly", min: 0, step: 0.1, placeholder: "예: 500" },
  { key: "elderlyAboveGroundFloors", title: "지상층수는 몇 층인가요?", help: "지하층을 제외한 지상층수를 입력해 주세요.", type: "number", onlyFor: "elderly", min: 0, step: 1, placeholder: "예: 4" },
  { key: "elderlyBasementFloors", title: "지하층수는 몇 층인가요?", help: "없으면 0을 입력하세요.", type: "number", onlyFor: "elderly", min: 0, step: 1, placeholder: "예: 1" },
  { key: "elderlyBasementAreaSum", title: "지하층 바닥면적 합계는 얼마인가요?", help: "없으면 0을 입력하세요.", type: "number", onlyFor: "elderly", min: 0, step: 0.1, placeholder: "예: 200" },
  {
    key: "elderlyHasWindowlessFloor",
    title: "무창층이 있나요?",
    help: "무창층이 있으면 면적을 이어서 입력합니다.",
    type: "choice",
    onlyFor: "elderly",
    options: [
      { value: "yes", label: "있음", description: "무창층이 하나 이상 있는 경우" },
      { value: "no", label: "없음", description: "무창층이 없는 경우" },
    ],
  },
  { key: "elderlyWindowlessArea", title: "무창층 바닥면적은 얼마인가요?", help: "무창층이 있으면 바닥면적을 입력하세요.", type: "number", onlyFor: "elderly", min: 0, step: 0.1, placeholder: "예: 200" },
  {
    key: "elderlyHasGrillWindow",
    title: "창살(화재 시 자동으로 열리지 않는 구조)이 설치돼 있나요?",
    help: "추락 방지 목적의 창살이 있으면, 노유자시설 사용 면적이 300㎡ 미만이어도 간이스프링클러를 설치해야 합니다.",
    type: "choice",
    onlyFor: "elderly",
    options: [
      { value: "yes", label: "있음", description: "자동 개방 구조가 아닌 창살이 설치돼 있음" },
      { value: "no", label: "없음", description: "창살이 없거나 화재 시 자동으로 열리는 구조" },
    ],
  },
  {
    key: "elderlyHasFloor500Plus",
    title: "바닥면적이 500㎡ 이상인 층이 있나요?",
    help: "일반 노유자시설의 자동화재속보설비 설치 여부를 판단합니다.",
    type: "choice",
    onlyFor: "elderly",
    options: [
      { value: "yes", label: "있음", description: "500㎡ 이상인 층이 하나라도 있음" },
      { value: "no", label: "없음", description: "모든 층이 500㎡ 미만" },
    ],
  },
  {
    key: "elderlyHas24HourStaff",
    title: "24시간 상주 근무자가 있나요?",
    help: "일반 노유자시설에서 자동화재속보설비 면제 검토 시에만 묻습니다.",
    type: "choice",
    onlyFor: "elderly",
    options: [
      { value: "yes", label: "있음", description: "24시간 근무자가 상주함" },
      { value: "no", label: "없음", description: "24시간 상주 근무자가 없음" },
    ],
  },
  {
    key: "elderlyHasGasFacility",
    title: "가스시설이 설치돼 있나요?",
    help: "가스누설경보기 설치 여부를 판단합니다.",
    type: "choice",
    onlyFor: "elderly",
    options: [
      { value: "yes", label: "있음", description: "가스시설이 설치돼 있음" },
      { value: "no", label: "없음", description: "가스시설이 없음" },
    ],
  },
  { key: "elderlyDetailSet", title: "주차·전기실 추가 조건을 입력해 주세요.", help: "해당 공간이 없으면 0으로 입력해 주세요.", type: "compound", onlyFor: "elderly" },

  // ── 의료시설 전용 스텝 ──
  {
    key: "medicalSubtype",
    title: "어떤 의료시설인가요?",
    help: "세부 유형에 따라 스프링클러·간이스프링클러·자동화재탐지설비·자동화재속보설비 기준이 달라집니다.",
    type: "choice",
    onlyFor: "medical",
    options: [
      { value: "hospital", label: "병원·치과병원·한방병원", description: "병원, 치과병원, 한방병원" },
      { value: "generalHospital", label: "종합병원", description: "종합병원" },
      { value: "nursingHome", label: "요양병원", description: "요양병원(정신병원 제외)" },
      { value: "psychiatricHospital", label: "정신의료기관", description: "정신병원·정신건강의학과의원 등" },
      { value: "rehabilitationFacility", label: "의료재활시설", description: "장애인 의료재활시설" },
    ],
  },
  { key: "medicalTotalArea", title: "건물 연면적은 얼마인가요?", help: "㎡ 단위로 입력하세요.", type: "number", onlyFor: "medical", min: 0, step: 0.1, placeholder: "예: 2000" },
  { key: "medicalArea", title: "의료시설로 사용되는 바닥면적 합계는 얼마인가요?", help: "스프링클러·간이스프링클러·자동화재탐지설비 판단에 사용됩니다. 건물 전체를 해당 용도로 쓰는 경우에는 연면적과 동일하게 입력해주세요.", type: "number", onlyFor: "medical", min: 0, step: 0.1, placeholder: "예: 1500" },
  { key: "medicalAboveGroundFloors", title: "지상층수는 몇 층인가요?", help: "지하층을 제외한 지상층수를 입력해 주세요.", type: "number", onlyFor: "medical", min: 0, step: 1, placeholder: "예: 5" },
  { key: "medicalBasementFloors", title: "지하층수는 몇 층인가요?", help: "없으면 0을 입력하세요.", type: "number", onlyFor: "medical", min: 0, step: 1, placeholder: "예: 1" },
  { key: "medicalBasementAreaSum", title: "지하층 바닥면적 합계는 얼마인가요?", help: "없으면 0을 입력하세요.", type: "number", onlyFor: "medical", min: 0, step: 0.1, placeholder: "예: 300" },
  {
    key: "medicalHasWindowlessFloor",
    title: "무창층이 있나요?",
    help: "무창층이 있으면 바닥면적을 이어서 입력합니다.",
    type: "choice",
    onlyFor: "medical",
    options: [
      { value: "yes", label: "있음", description: "무창층이 하나 이상 있는 경우" },
      { value: "no", label: "없음", description: "무창층이 없는 경우" },
    ],
  },
  { key: "medicalWindowlessArea", title: "무창층 바닥면적은 얼마인가요?", help: "무창층이 있으면 바닥면적을 입력하세요.", type: "number", onlyFor: "medical", min: 0, step: 0.1, placeholder: "예: 200" },
  {
    key: "medicalHasGrillWindow",
    title: "사람의 탈출을 막기 위한 고정식 창살이 설치돼 있나요?",
    help: "정신의료기관·의료재활시설에서 바닥면적 300㎡ 미만이어도 간이스프링클러 및 자동화재탐지설비 설치 여부를 판단합니다.",
    type: "choice",
    onlyFor: "medical",
    options: [
      { value: "yes", label: "있음", description: "탈출 방지 목적의 고정식 창살이 설치돼 있음" },
      { value: "no", label: "없음", description: "창살이 없음" },
    ],
  },
  {
    key: "medicalHasGasFacility",
    title: "가스시설이 설치돼 있나요?",
    help: "가스누설경보기 설치 여부를 판단합니다.",
    type: "choice",
    onlyFor: "medical",
    options: [
      { value: "yes", label: "있음", description: "주방 등 가스시설이 설치돼 있음" },
      { value: "no", label: "없음", description: "가스시설이 없음" },
    ],
  },
  { key: "medicalDetailSet", title: "주차·전기실 추가 조건을 입력해 주세요.", help: "해당 공간이 없으면 0으로 입력해 주세요.", type: "compound", onlyFor: "medical" },
];

const state = {
  currentStep: 0,
  answers: {
    occupancyType: "neighborhood",
    facilitySubtype: "general",
    postpartumAreaRange: "under600",
    isThirdClassNeighborhood: "yes",
    permitBefore1992: "no",
    pre1992PermitRange: "1982-08-07_to_1984-06-30",
    thirdClassDetailUse: "general",
    totalArea: 1600,
    neighborhoodArea: 1600,
    aboveGroundFloors: 6,
    basementFloors: 1,
    basementAreaSum: 180,
    hasWindowlessFloor: "no",
    windowlessArea: 0,
    hasLargeTargetFloor: "yes",
    firstSecondFloorArea: 0,
    indoorParkingArea: 0,
    parkingStructureArea: 0,
    mechanicalParkingCapacity: 0,
    electricalRoomArea: 0,
    has24HourStaff: "no",
    hasMultiuseBusiness: "no",
    multiuseInBasement: "no",
    multiuseIsSealed: "no",
    multiuseIsPostpartum: "no",
    multiuseIsGosiwon: "no",
    multiuseIsGunRange: "no",
    multiuseOnSecondToTenthFloor: "no",
    multiuseOnGroundOrRefugeFloor: "no",
    multiuseUsesAV: "no",
    multiuseHasGasFacility: "no",
    multiuseHasEvacuationRoute: "no",
    // 숙박시설
    lodgingArea: 450,
    lodgingTotalArea: 2000,
    lodgingAboveGroundFloors: 8,
    lodgingBasementFloors: 1,
    lodgingBasementAreaSum: 200,
    lodgingHasWindowlessFloor: "no",
    lodgingWindowlessArea: 0,
    lodgingHasLargeFloorFor1000: "no",
    lodgingHasGasFacility: "no",
    lodgingIsTouristHotel: "no",
    lodgingIndoorParkingArea: 0,
    lodgingParkingStructureArea: 0,
    lodgingMechanicalParkingCapacity: 0,
    lodgingElectricalRoomArea: 0,
    lodgingHasMultiuseBusiness: "no",
    lodgingMultiuseInBasement: "no",
    lodgingMultiuseIsSealed: "no",
    lodgingMultiuseIsPostpartum: "no",
    lodgingMultiuseIsGosiwon: "no",
    lodgingMultiuseIsGunRange: "no",
    lodgingMultiuseOnSecondToTenthFloor: "no",
    lodgingMultiuseOnGroundOrRefugeFloor: "no",
    lodgingMultiuseUsesAV: "no",
    lodgingMultiuseHasGasFacility: "no",
    lodgingMultiuseHasEvacuationRoute: "no",
    // 노유자시설
    elderlySubtype: "general",
    elderlyTotalArea: 1200,
    elderlyArea: 500,
    elderlyAboveGroundFloors: 4,
    elderlyBasementFloors: 0,
    elderlyBasementAreaSum: 0,
    elderlyHasWindowlessFloor: "no",
    elderlyWindowlessArea: 0,
    elderlyHasLargeTargetFloor: "no",
    elderlyHasGrillWindow: "no",
    elderlyHasFloor500Plus: "no",
    elderlyHas24HourStaff: "no",
    elderlyHasGasFacility: "no",
    elderlyIndoorParkingArea: 0,
    elderlyParkingStructureArea: 0,
    elderlyMechanicalParkingCapacity: 0,
    elderlyElectricalRoomArea: 0,
    // 의료시설
    medicalSubtype: "hospital",
    medicalTotalArea: 2000,
    medicalArea: 1500,
    medicalAboveGroundFloors: 5,
    medicalBasementFloors: 1,
    medicalBasementAreaSum: 300,
    medicalHasWindowlessFloor: "no",
    medicalWindowlessArea: 0,
    medicalHasGrillWindow: "no",
    medicalHasGasFacility: "no",
    medicalIndoorParkingArea: 0,
    medicalParkingStructureArea: 0,
    medicalMechanicalParkingCapacity: 0,
    medicalElectricalRoomArea: 0,
  },
  dateCalc: {
    mode: "inspect_report",
    baseDate: todayString(),
    holidays: [],
    selectMode: "base",
    noncomplianceType: "repair",
    viewYear: new Date().getFullYear(),
    viewMonth: new Date().getMonth(),
  },
};

const CALC_MODES = {
  inspect_report: {
    short: "자체점검",
    kind: "inspect_report",
    label: "자체점검 실시결과 보고서 제출",
    days: 15,
    baseDateLabel: "점검 완료일",
    resultLabel: "제출기한",
    infoTone: "amber",
    supportsHolidaySelection: true,
    infoTitle: "접수 시 확인사항",
    infoBody: "① 자체점검 실시결과는 '관계인'의 서명이 되어있어야합니다.<br>② 2급 이상 대상은 소방시설관리업자가 자체점검을 해야 합니다.<br>③ 점검인력은 주인력1명, 보조인력2명을 기본 1단위로 합니다.",
    tableTitle: "점검 구분별 제출 서류",
    tableHead: ["구분", "제출 서류"],
    tableBody: [
      ["관계인 직접", "① 자체점검 실시결과 보고서"],
      ["업체 위탁", "① 자체점검 실시결과 보고서<br>② 점검인력 배치확인서<br>③ 점검결과 보고서 제출용 위임장(업체 제출시)"],
      ["부적합 추가 서류", "① 소방시설등의 자체점검 결과 이행계획서"],
    ],
  },
  fire_safety_manager: {
    short: "소방안전관리자",
    kind: "manager_dual",
    label: "소방안전관리자 기한 계산",
    baseDateLabel: "해임·퇴직일",
    resultLabel: "선임 및 선임신고 기한",
    infoTone: "amber",
    supportsHolidaySelection: true,
    appointDays: 30,
    reportDays: 14,
    infoTitle: "선임신고 시 확인사항",
    introBody: "해임·퇴직일로부터 30일 이내에 선임하고, 선임일로부터 14일 이내에 소방서에 신고해야 합니다.",
    infoBody: "선임신고서에 '관계인' 서명이 필요합니다.(안전관리자와 관계인이 같으면 안전관리자 서명 가능)",
    tableTitle: "선임 구분별 제출 서류",
    tableHead: ["구분", "제출 서류"],
    tableBody: [
      ["개인 직접 선임", "① 소방안전관리자 선임신고서<br>② 소방안전관리자 자격증 사본"],
      ["소방시설관리업체<br>대행 선임", "① 소방안전관리자 선임신고서<br>② 소방안전관리 업무 감독 증명서류<br>③ 소방안전관리업무의 대행 계약서 사본<br>④ 선임신고서 제출용 위임장(업체 제출시)<br> ⑤ 소방시설관리업등록증(2022.12.1부터 필수X)<br>⑥ 소방시설관리사수첩(2022.12.1부터 필수X)"],
    ],
    extraSections: [
      {
        title: "소방안전관리 대상물 구분 기준",
        titleColor: "red",
        content: `
<div style="display:flex;flex-direction:column;gap:12px;">
  <div>
    <div style="color:var(--red-soft);font-weight:700;margin-bottom:4px;">특급</div>
    <div style="display:flex;flex-direction:column;gap:2px;padding-left:8px;">
      <span>1) 50층↑(지하층 제외) 또는 높이 200m↑ 아파트</span>
      <span>2) 30층↑(지하층 포함) 또는 높이 120m↑ 특정소방대상물(아파트 제외)</span>
      <span>3) 연면적 10만㎡↑ 특정소방대상물(아파트 제외)</span>
    </div>
  </div>
  <div style="border-top:1px solid rgba(66,133,244,0.15);padding-top:12px;">
    <div style="color:var(--red-soft);font-weight:700;margin-bottom:4px;">1급</div>
    <div style="display:flex;flex-direction:column;gap:2px;padding-left:8px;">
      <span>1) 30층↑(지하층 제외) 또는 높이 120m↑ 아파트</span>
      <span>2) 연면적 1만5천㎡↑ 특정소방대상물(아파트·연립주택 제외)</span>
      <span>3) 지상 11층↑ 특정소방대상물(아파트 제외)</span>
      <span>4) 가연성 가스 1,000톤↑ 저장·취급 시설</span>
    </div>
  </div>
  <div style="border-top:1px solid rgba(66,133,244,0.15);padding-top:12px;">
    <div style="color:var(--red-soft);font-weight:700;margin-bottom:4px;">2급</div>
    <div style="display:flex;flex-direction:column;gap:2px;padding-left:8px;">
      <span>1) 옥내소화전·스프링클러·물분무등소화설비 설치 대상</span>
      <span>2) 도시가스사업 허가 시설 또는 가연성 가스 100~1,000톤 미만 저장·취급 시설</span>
      <span>3) 지하구</span>
      <span>4) 옥내소화전 또는 스프링클러 설치 공동주택</span>
      <span>5) 보물·국보로 지정된 목조건축물</span>
    </div>
  </div>
  <div style="border-top:1px solid rgba(66,133,244,0.15);padding-top:12px;">
    <div style="color:var(--red-soft);font-weight:700;margin-bottom:4px;">3급</div>
    <div style="display:flex;flex-direction:column;gap:2px;padding-left:8px;">
      <span>1) 간이스프링클러설비(주택전용 제외) 설치 대상</span>
      <span>2) 자동화재탐지설비 설치 대상</span>
    </div>
  </div>
</div>`,
      },
    ],
  },
  fire_safety_assistant_manager: {
    short: "소방안전관리보조자",
    kind: "manager_dual",
    label: "소방안전관리보조자 기한 계산",
    baseDateLabel: "해임·퇴직일",
    resultLabel: "선임 및 선임신고 기한",
    infoTone: "amber",
    supportsHolidaySelection: true,
    appointDays: 30,
    reportDays: 14,
    infoTitle: "선임신고 시 확인사항",
    introBody: "해임·퇴직일로부터 30일 이내에 선임하고, 선임일로부터 14일 이내에 소방서에 신고해야 합니다.",
    infoBody: "소방안전관리보조자는 소방안전관리자를 보조하여 소방안전관리 업무를 수행합니다. 선임신고서에 '관계인' 서명이 필요하며, 소방안전관리보조자 자격을 갖춘 자를 선임해야 합니다.",
    tableTitle: "선임 구분별 제출 서류",
    tableHead: ["구분", "제출 서류"],
    tableBody: [
      ["공통신고<br>서류", "① 소방안전관리보조자 선임신고서"],
      ["자격증명<br>서류<br>(중 1택)", "① 소방안전관리보조자 자격증 사본<br>② 소방안전관리자 자격증 사본(특,1,2,3급)<br>③ 소방안전관리자 강습교육 수료증 사본(특,1,2,3급,<br>공공기관)<br>④ 국가기술자격증 사본(건축, 위험물, 안전관리 등)<br>⑤ 소방안전 관련 업무에 2년 이상 근무경력 증명서류"],
    ],
    extraSections: [
      {
        title: "선임 대상",
        content: `<b>가.</b> 300세대 이상인 아파트<br><b>나.</b> 연면적 1만5천㎡ 이상인 특정소방대상물(아파트·연립주택 제외)<br><b>다.</b> 가·나 외 특정소방대상물 중 다음 어느 하나에 해당하는 것<br>&nbsp;&nbsp;1) 공동주택 중 기숙사<br>&nbsp;&nbsp;2) 의료시설<br>&nbsp;&nbsp;3) 노유자 시설<br>&nbsp;&nbsp;4) 수련시설<br>&nbsp;&nbsp;5) 숙박시설(바닥면적 합계 1,500㎡ 미만이고 관계인이 24시간 상시 근무하는 경우 제외)`,
      },
      {
        title: "선임 인원",
        content: `<b>가.</b> 아파트(300세대 이상): 1명. 초과되는 300세대마다 1명 이상 추가 선임<br><b>나.</b> 연면적 1만5천㎡ 이상: 1명. 초과되는 연면적 1만5천㎡마다 1명 추가 선임<br><b>다.</b> 그 밖의 대상: 1명. 야간·휴일에 이용되지 않는 것이 확인된 경우 선임 제외 가능`,
      },
    ],
  },
  hazardous_material_manager: {
    short: "위험물안전관리자",
    kind: "manager_dual",
    label: "위험물안전관리자 기한 계산",
    baseDateLabel: "해임·퇴직일",
    resultLabel: "선임 및 선임신고 기한",
    infoTone: "amber",
    supportsHolidaySelection: true,
    appointDays: 30,
    reportDays: 14,
    infoTitle: "선임신고 시 확인사항",
    introBody: "해임·퇴직일로부터 30일 이내에 선임하고, 선임일로부터 14일 이내에 소방서에 신고해야 합니다.",
    infoBody: "해당 위험물 유형과 지정수량의 배수에 맞는 자격(위험물기능사·산업기사·기능장 등)을 갖추었는지 확인하세요.<br> 둘 이상의 제조소등에 중복하여 선임하는 경우 제조소등의 수만큼 신고서를 각각 제출해야 합니다.",
    tableTitle: "선임 구분별 제출 서류",
    tableHead: ["구분", "제출 서류"],
    tableBody: [
      ["개인 직접 선임", "① 위험물안전관리자 선임신고서<br>② 위험물안전관리자 자격증 사본"],
      ["안전관리대행기관<br>대행 선임", "① 위험물안전관리자 선임신고서<br>② 위험물 안전관리대행기관 지정서 사본<br>③ 위험물 안전관리업무대행계약서 사본"],
    ],
  },
  noncompliance_action: {
    short: "부적합조치기한",
    kind: "noncompliance_dual",
    label: "부적합 조치기한 계산",
    baseDateLabel: "보고일",
    resultLabel: "이행완료 및 완료신고 기한",
    infoTone: "amber",
    supportsHolidaySelection: true,
    reportDays: 10,
    actionTypes: {
      repair: {
        label: "10일",
        completionDays: 10,
        tooltip: "소방시설등을 구성하고 있는 기계ㆍ기구를 수리하거나 정비하는 경우",
        description: "소방시설등을 구성하는 기계·기구를 수리하거나 정비하는 경우",
      },
      replacement: {
        label: "20일",
        completionDays: 20,
        tooltip: "소방시설등의 전부 또는 일부를 철거하고 새로 교체하는 경우",
        description: "소방시설등의 전부 또는 일부를 철거하고 새로 교체하는 경우",
      },
    },
    infoTitle: "조치기한 10일·20일 기준 판단",
    infoBody: "기간 구분이 애매한 경우 소방서 자체점검 담당자와 협의해서 결정하세요. 조치기한 10일을 줘야할 것 같아도 상황에 따라서 20일을 주기도 합니다.",
    tableTitle: "이행기한 구분 예시",
    tableHead: ["기한", "해당 사례"],
    tableBody: [],
  },
};

const screens = {
  home: document.getElementById("screen-home"),
  explorer: document.getElementById("screen-explorer"),
  date: document.getElementById("screen-date"),
  inspection: document.getElementById("screen-inspection"),
  multiuse: document.getElementById("screen-multiuse"),
  guide: document.getElementById("screen-guide"),
};

const questionElements = {
  kicker: document.getElementById("question-kicker"),
  title: document.getElementById("question-title"),
  help: document.getElementById("question-help"),
  input: document.getElementById("question-input"),
};

const questionCard = document.getElementById("question-card");
const resultCard = document.getElementById("result-card");
const multiuseSafetyCard = document.getElementById("multiuse-safety-card");

const explorerViewState = {
  lastInput: null,
};

function todayString() {
  const now = new Date();
  return formatInputDate(now);
}

function formatInputDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toBool(value) {
  return value === "yes";
}

function parseDate(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isWeekend(date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function dateKey(date) {
  return formatInputDate(date);
}

function parseHolidayInput(text) {
  return text.split(",").map((part) => part.trim()).filter(Boolean).filter((part) => /^\d{4}-\d{2}-\d{2}$/.test(part));
}

function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function addInspectReportDays(startDate, days, holidayKeys) {
  const countedDates = [];
  let cursor = addDays(startDate, 1);
  while (countedDates.length < days) {
    const key = dateKey(cursor);
    if (!isWeekend(cursor) && !holidayKeys.has(key)) {
      countedDates.push(new Date(cursor));
    }
    cursor = addDays(cursor, 1);
  }
  return countedDates;
}

function getSequentialDates(startDate, days) {
  const dates = [];
  for (let i = 1; i <= days; i += 1) {
    dates.push(addDays(startDate, i));
  }
  return dates;
}

function getInclusiveDates(startDate, days) {
  const dates = [];
  for (let i = 0; i < days; i += 1) {
    dates.push(addDays(startDate, i));
  }
  return dates;
}

function moveToNextBusinessDay(date, holidayKeys) {
  let cursor = new Date(date);
  while (isWeekend(cursor) || holidayKeys.has(dateKey(cursor))) {
    cursor = addDays(cursor, 1);
  }
  return cursor;
}

function addBusinessDays(startDate, days, holidayKeys) {
  let count = 0;
  let cursor = addDays(startDate, 1);
  while (count < days) {
    if (!isWeekend(cursor) && !holidayKeys.has(dateKey(cursor))) {
      count += 1;
      if (count === days) break;
    }
    cursor = addDays(cursor, 1);
  }
  return cursor;
}

function getActiveSteps() {
  return steps.filter((step) => {
    if (["isThirdClassNeighborhood", "permitBefore1992", "pre1992PermitRange", "thirdClassDetailUse"].includes(step.key)) return false;
    if (!step.onlyFor) return true;
    if (step.onlyFor !== state.answers.occupancyType) return false;
    if (step.key === "windowlessArea") return state.answers.hasWindowlessFloor === "yes";
    if (step.key === "hasLargeTargetFloor") return toNumber(state.answers.totalArea) < 1500;
    if (step.key === "firstSecondFloorArea") return toNumber(state.answers.totalArea) >= 9000;
    if (step.key === "postpartumAreaRange") return state.answers.facilitySubtype === "postpartum";
    if (step.key === "has24HourStaff") return ["clinicInpatient", "postpartum"].includes(state.answers.facilitySubtype);
    if (step.key === "multiuseOnGroundOrRefugeFloor") {
      return state.answers.hasMultiuseBusiness === "yes"
        && (state.answers.multiuseIsPostpartum === "yes" || state.answers.multiuseIsGosiwon === "yes");
    }
    if (["multiuseSimpleSprinklerCheck", "multiuseOnSecondToTenthFloor", "multiuseUsesAV", "multiuseHasGasFacility", "multiuseHasEvacuationRoute"].includes(step.key)) {
      return state.answers.hasMultiuseBusiness === "yes";
    }
    // 숙박시설 전용 조건
    if (step.key === "lodgingWindowlessArea") return state.answers.lodgingHasWindowlessFloor === "yes";
    if (step.key === "lodgingHasLargeFloorFor1000") {
      // 이미 전층 스프링클러 대상이면 skip
      const la = toNumber(state.answers.lodgingArea);
      const ag = toNumber(state.answers.lodgingAboveGroundFloors);
      const totalF = toNumber(state.answers.lodgingAboveGroundFloors) + toNumber(state.answers.lodgingBasementFloors);
      return la < 600 && ag < 6 && totalF < 6;
    }

    if (step.key === "lodgingMultiuseOnGroundOrRefugeFloor") {
      return state.answers.lodgingHasMultiuseBusiness === "yes"
        && (state.answers.lodgingMultiuseIsPostpartum === "yes" || state.answers.lodgingMultiuseIsGosiwon === "yes");
    }
    if (["lodgingMultiuseSimpleSprinklerCheck", "lodgingMultiuseOnSecondToTenthFloor", "lodgingMultiuseUsesAV", "lodgingMultiuseHasGasFacility", "lodgingMultiuseHasEvacuationRoute"].includes(step.key)) {
      return state.answers.lodgingHasMultiuseBusiness === "yes";
    }
    // 노유자시설 전용 조건
    if (step.key === "elderlyWindowlessArea") return state.answers.elderlyHasWindowlessFloor === "yes";
    if (step.key === "elderlyHasGrillWindow") {
      return state.answers.elderlySubtype === "general"
        && toNumber(state.answers.elderlyArea) < 300;
    }
    if (step.key === "elderlyHasFloor500Plus") return state.answers.elderlySubtype === "general";
    if (step.key === "elderlyHas24HourStaff") {
      return state.answers.elderlySubtype === "general"
        && state.answers.elderlyHasFloor500Plus === "yes";
    }
    // 의료시설 전용 조건
    if (step.key === "medicalWindowlessArea") return state.answers.medicalHasWindowlessFloor === "yes";
    if (step.key === "medicalHasGrillWindow") {
      const sub = state.answers.medicalSubtype;
      const ma = toNumber(state.answers.medicalArea);
      return (sub === "psychiatricHospital" || sub === "rehabilitationFacility") && ma < 300;
    }
    return true;
  });
}

function showScreen(name) {
  Object.entries(screens).forEach(([key, element]) => {
    element.classList.toggle("active", key === name);
  });
}

function getTotalFloors() {
  return toNumber(state.answers.aboveGroundFloors) + toNumber(state.answers.basementFloors);
}

function updateProgress() {
  const activeSteps = getActiveSteps();
  const current = state.currentStep + 1;
  const total = activeSteps.length;
  const percent = Math.round((current / total) * 100);
  document.getElementById("progress-text").textContent = `${current} / ${total}`;
  document.getElementById("progress-percent").textContent = `${percent}%`;
  document.getElementById("progress-bar").style.width = `${percent}%`;
}

function renderChoiceStep(step) {
  const wrapper = document.createElement("div");
  wrapper.className = "choice-list";
  step.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    if (String(state.answers[step.key]) === option.value) button.classList.add("selected");
    button.innerHTML = `<strong>${option.label}</strong><span>${option.description}</span>`;
    button.addEventListener("click", () => {
      state.answers[step.key] = option.value;
      renderCurrentStep();
    });
    wrapper.appendChild(button);
  });
  return wrapper;
}

function renderNumberStep(step) {
  const input = document.createElement("input");
  input.className = "calc-input";
  input.type = "number";
  input.min = String(step.min ?? 0);
  input.step = String(step.step ?? 1);
  input.placeholder = step.placeholder ?? "";
  input.value = state.answers[step.key] ?? "";
  input.addEventListener("input", (event) => {
    state.answers[step.key] = event.target.value;
  });
  return input;
}

function makeField(labelText, name, value, extra = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "calc-form-row";
  const label = document.createElement("label");
  label.textContent = labelText;
  const input = document.createElement("input");
  input.className = "calc-input";
  input.type = "number";
  input.min = String(extra.min ?? 0);
  input.step = String(extra.step ?? 1);
  input.placeholder = extra.placeholder ?? "";
  input.value = value ?? "";
  input.addEventListener("input", (event) => {
    state.answers[name] = event.target.value;
  });
  wrapper.appendChild(label);
  wrapper.appendChild(input);
  return wrapper;
}

function makeBinaryChoiceField(labelText, name) {
  const wrapper = document.createElement("div");
  wrapper.className = "calc-form-row";

  const label = document.createElement("label");
  label.textContent = labelText;
  wrapper.appendChild(label);

  const buttons = document.createElement("div");
  buttons.className = "choice-list";

  [
    { value: "yes", label: "예", description: "해당됨" },
    { value: "no", label: "아니오", description: "해당되지 않음" },
  ].forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    if (state.answers[name] === option.value) button.classList.add("selected");
    button.innerHTML = `<strong>${option.label}</strong><span>${option.description}</span>`;
    button.addEventListener("click", () => {
      state.answers[name] = option.value;
      renderCurrentStep();
    });
    buttons.appendChild(button);
  });

  wrapper.appendChild(buttons);
  return wrapper;
}

function makeToggleChoiceButton({ label, description, selected, onClick }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice-button";
  if (selected) button.classList.add("selected");
  button.innerHTML = `<strong>${label}</strong>${description ? `<span>${description}</span>` : ""}`;
  button.addEventListener("click", onClick);
  return button;
}

function renderCompoundStep(step) {
  const wrapper = document.createElement("div");
  wrapper.className = "choice-list";

  if (step.key === "detailSet") {
    [
      makeField("건물 내부 차고·주차장 바닥면적(㎡)", "indoorParkingArea", state.answers.indoorParkingArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
      makeField("차고·주차용 건축물 연면적(㎡)", "parkingStructureArea", state.answers.parkingStructureArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
      makeField("기계식 주차 가능 대수", "mechanicalParkingCapacity", state.answers.mechanicalParkingCapacity, { min: 0, step: 1, placeholder: "없으면 0" }),
      makeField("전기실·발전실·변전실·전산실 최대 바닥면적(㎡)", "electricalRoomArea", state.answers.electricalRoomArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
    ].forEach((field) => wrapper.appendChild(field));
    return wrapper;
  }

  if (step.key === "lodgingDetailSet") {
    [
      makeField("건물 내부 차고·주차장 바닥면적(㎡)", "lodgingIndoorParkingArea", state.answers.lodgingIndoorParkingArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
      makeField("차고·주차용 건축물 연면적(㎡)", "lodgingParkingStructureArea", state.answers.lodgingParkingStructureArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
      makeField("기계식 주차 가능 대수", "lodgingMechanicalParkingCapacity", state.answers.lodgingMechanicalParkingCapacity, { min: 0, step: 1, placeholder: "없으면 0" }),
      makeField("전기실·발전실·변전실·전산실 최대 바닥면적(㎡)", "lodgingElectricalRoomArea", state.answers.lodgingElectricalRoomArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
    ].forEach((field) => wrapper.appendChild(field));
    return wrapper;
  }

  if (step.key === "elderlyDetailSet") {
    [
      makeField("건물 내부 차고·주차장 바닥면적(㎡)", "elderlyIndoorParkingArea", state.answers.elderlyIndoorParkingArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
      makeField("차고·주차용 건축물 연면적(㎡)", "elderlyParkingStructureArea", state.answers.elderlyParkingStructureArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
      makeField("기계식 주차 가능 대수", "elderlyMechanicalParkingCapacity", state.answers.elderlyMechanicalParkingCapacity, { min: 0, step: 1, placeholder: "없으면 0" }),
      makeField("전기실·발전실·변전실·전산실 최대 바닥면적(㎡)", "elderlyElectricalRoomArea", state.answers.elderlyElectricalRoomArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
    ].forEach((field) => wrapper.appendChild(field));
    return wrapper;
  }

  if (step.key === "medicalDetailSet") {
    [
      makeField("건물 내부 차고·주차장 바닥면적(㎡)", "medicalIndoorParkingArea", state.answers.medicalIndoorParkingArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
      makeField("차고·주차용 건축물 연면적(㎡)", "medicalParkingStructureArea", state.answers.medicalParkingStructureArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
      makeField("기계식 주차 가능 대수", "medicalMechanicalParkingCapacity", state.answers.medicalMechanicalParkingCapacity, { min: 0, step: 1, placeholder: "없으면 0" }),
      makeField("전기실·발전실·변전실·전산실 최대 바닥면적(㎡)", "medicalElectricalRoomArea", state.answers.medicalElectricalRoomArea, { min: 0, step: 0.1, placeholder: "없으면 0" }),
    ].forEach((field) => wrapper.appendChild(field));
    return wrapper;
  }

  if (step.key === "multiuseSimpleSprinklerCheck") {
    const selectedKeys = [
      "multiuseInBasement",
      "multiuseIsSealed",
      "multiuseIsPostpartum",
      "multiuseIsGosiwon",
      "multiuseIsGunRange",
    ];

    const toggleOption = (name) => {
      state.answers[name] = state.answers[name] === "yes" ? "no" : "yes";
      renderCurrentStep();
    };

    const optionList = document.createElement("div");
    optionList.className = "choice-list";

    [
      { name: "multiuseInBasement", label: "지하층에 설치돼 있음", description: "해당되면 선택" },
      { name: "multiuseIsSealed", label: "밀폐구조의 영업장", description: "해당되면 선택" },
      { name: "multiuseIsPostpartum", label: "산후조리업", description: "해당되면 선택" },
      { name: "multiuseIsGosiwon", label: "고시원", description: "해당되면 선택" },
      { name: "multiuseIsGunRange", label: "권총사격장", description: "해당되면 선택" },
    ].forEach((option) => {
      optionList.appendChild(makeToggleChoiceButton({
        label: option.label,
        description: option.description,
        selected: state.answers[option.name] === "yes",
        onClick: () => toggleOption(option.name),
      }));
    });

    const noneSelected = selectedKeys.every((name) => state.answers[name] !== "yes");
    optionList.appendChild(makeToggleChoiceButton({
      label: "해당사항 없음",
      description: "선택한 항목이 없으면 선택",
      selected: noneSelected,
      onClick: () => {
        selectedKeys.forEach((name) => {
          state.answers[name] = "no";
        });
        renderCurrentStep();
      },
    }));

    wrapper.appendChild(optionList);
  }

  if (step.key === "lodgingMultiuseSimpleSprinklerCheck") {
    const selectedKeys = [
      "lodgingMultiuseInBasement",
      "lodgingMultiuseIsSealed",
      "lodgingMultiuseIsPostpartum",
      "lodgingMultiuseIsGosiwon",
      "lodgingMultiuseIsGunRange",
    ];

    const toggleOption = (name) => {
      state.answers[name] = state.answers[name] === "yes" ? "no" : "yes";
      renderCurrentStep();
    };

    const optionList = document.createElement("div");
    optionList.className = "choice-list";

    [
      { name: "lodgingMultiuseInBasement", label: "지하층에 설치돼 있음", description: "해당되면 선택" },
      { name: "lodgingMultiuseIsSealed", label: "밀폐구조의 영업장", description: "해당되면 선택" },
      { name: "lodgingMultiuseIsPostpartum", label: "산후조리업", description: "해당되면 선택" },
      { name: "lodgingMultiuseIsGosiwon", label: "고시원", description: "해당되면 선택" },
      { name: "lodgingMultiuseIsGunRange", label: "권총사격장", description: "해당되면 선택" },
    ].forEach((option) => {
      optionList.appendChild(makeToggleChoiceButton({
        label: option.label,
        description: option.description,
        selected: state.answers[option.name] === "yes",
        onClick: () => toggleOption(option.name),
      }));
    });

    const noneSelected = selectedKeys.every((name) => state.answers[name] !== "yes");
    optionList.appendChild(makeToggleChoiceButton({
      label: "해당사항 없음",
      description: "선택한 항목이 없으면 선택",
      selected: noneSelected,
      onClick: () => {
        selectedKeys.forEach((name) => {
          state.answers[name] = "no";
        });
        renderCurrentStep();
      },
    }));

    wrapper.appendChild(optionList);
  }

  return wrapper;
}

function renderCurrentStep() {
  const activeSteps = getActiveSteps();
  const step = activeSteps[state.currentStep];
  questionElements.kicker.textContent = `QUESTION ${state.currentStep + 1}`;
  questionElements.title.textContent = step.title;
  questionElements.help.textContent = step.help;
  questionElements.input.innerHTML = "";

  let node;
  if (step.type === "choice") node = renderChoiceStep(step);
  else if (step.type === "compound") node = renderCompoundStep(step);
  else node = renderNumberStep(step);

  questionElements.input.appendChild(node);
  document.getElementById("prev-step").disabled = state.currentStep === 0;
  document.getElementById("next-step").textContent = state.currentStep === activeSteps.length - 1 ? "결과 보기" : "다음";
  updateProgress();
}

function currentStepIsValid() {
  const step = getActiveSteps()[state.currentStep];
  if (step.type === "number") {
    const value = state.answers[step.key];
    return value !== "" && !Number.isNaN(Number(value));
  }
  return true;
}

function normalizeAnswers() {
  const basementAverageArea = toNumber(state.answers.basementFloors) > 0
    ? toNumber(state.answers.basementAreaSum) / toNumber(state.answers.basementFloors)
    : 0;
  const windowlessArea = state.answers.hasWindowlessFloor === "yes" ? toNumber(state.answers.windowlessArea) : 0;
  return {
    occupancyType: state.answers.occupancyType,
    facilitySubtype: state.answers.facilitySubtype,
    postpartumAreaRange: state.answers.postpartumAreaRange,
    isThirdClassNeighborhood: state.answers.isThirdClassNeighborhood,
    permitBefore1992: state.answers.permitBefore1992,
    pre1992PermitRange: state.answers.pre1992PermitRange,
    thirdClassDetailUse: state.answers.thirdClassDetailUse,
    totalArea: toNumber(state.answers.totalArea),
    neighborhoodArea: toNumber(state.answers.neighborhoodArea),
    aboveGroundFloors: toNumber(state.answers.aboveGroundFloors),
    basementFloors: toNumber(state.answers.basementFloors),
    totalFloors: getTotalFloors(),
    firstSecondFloorArea: toNumber(state.answers.firstSecondFloorArea),
    basementAreaSum: toNumber(state.answers.basementAreaSum),
    hasLargeTargetFloor: toBool(state.answers.hasLargeTargetFloor),
    hasBasement150Plus: toNumber(state.answers.basementFloors) > 0 && basementAverageArea >= 150,
    hasBasement450Plus: toNumber(state.answers.basementFloors) > 0 && basementAverageArea >= 450,
    hasWindowless150Plus: windowlessArea >= 150,
    hasWindowless450Plus: windowlessArea >= 450,
    smokeControlArea: toNumber(state.answers.basementAreaSum) + windowlessArea,
    indoorParkingArea: toNumber(state.answers.indoorParkingArea),
    parkingStructureArea: toNumber(state.answers.parkingStructureArea),
    mechanicalParkingCapacity: toNumber(state.answers.mechanicalParkingCapacity),
    electricalRoomArea: toNumber(state.answers.electricalRoomArea),
    has24HourStaff: toBool(state.answers.has24HourStaff),
    hasMultiuseBusiness: toBool(state.answers.hasMultiuseBusiness),
    multiuseInBasement: toBool(state.answers.multiuseInBasement),
    multiuseIsSealed: toBool(state.answers.multiuseIsSealed),
    multiuseIsPostpartum: toBool(state.answers.multiuseIsPostpartum),
    multiuseIsGosiwon: toBool(state.answers.multiuseIsGosiwon),
    multiuseIsGunRange: toBool(state.answers.multiuseIsGunRange),
    multiuseOnSecondToTenthFloor: toBool(state.answers.multiuseOnSecondToTenthFloor),
    multiuseOnGroundOrRefugeFloor: toBool(state.answers.multiuseOnGroundOrRefugeFloor),
    multiuseUsesAV: toBool(state.answers.multiuseUsesAV),
    multiuseHasGasFacility: toBool(state.answers.multiuseHasGasFacility),
    multiuseHasEvacuationRoute: toBool(state.answers.multiuseHasEvacuationRoute),
    // 숙박시설
    lodgingArea: toNumber(state.answers.lodgingArea),
    lodgingTotalArea: toNumber(state.answers.lodgingTotalArea),
    lodgingAboveGroundFloors: toNumber(state.answers.lodgingAboveGroundFloors),
    lodgingBasementFloors: toNumber(state.answers.lodgingBasementFloors),
    lodgingBasementAreaSum: toNumber(state.answers.lodgingBasementAreaSum),
    lodgingTotalFloors: toNumber(state.answers.lodgingAboveGroundFloors) + toNumber(state.answers.lodgingBasementFloors),
    lodgingWindowlessArea: state.answers.lodgingHasWindowlessFloor === "yes" ? toNumber(state.answers.lodgingWindowlessArea) : 0,
    lodgingHasLargeFloorFor1000: toBool(state.answers.lodgingHasLargeFloorFor1000),
    lodgingHasGasFacility: toBool(state.answers.lodgingHasGasFacility),
    lodgingIsTouristHotel: toBool(state.answers.lodgingIsTouristHotel),
    lodgingIndoorParkingArea: toNumber(state.answers.lodgingIndoorParkingArea),
    lodgingParkingStructureArea: toNumber(state.answers.lodgingParkingStructureArea),
    lodgingMechanicalParkingCapacity: toNumber(state.answers.lodgingMechanicalParkingCapacity),
    lodgingElectricalRoomArea: toNumber(state.answers.lodgingElectricalRoomArea),
    lodgingHasMultiuseBusiness: toBool(state.answers.lodgingHasMultiuseBusiness),
    lodgingMultiuseInBasement: toBool(state.answers.lodgingMultiuseInBasement),
    lodgingMultiuseIsSealed: toBool(state.answers.lodgingMultiuseIsSealed),
    lodgingMultiuseIsPostpartum: toBool(state.answers.lodgingMultiuseIsPostpartum),
    lodgingMultiuseIsGosiwon: toBool(state.answers.lodgingMultiuseIsGosiwon),
    lodgingMultiuseIsGunRange: toBool(state.answers.lodgingMultiuseIsGunRange),
    lodgingMultiuseOnSecondToTenthFloor: toBool(state.answers.lodgingMultiuseOnSecondToTenthFloor),
    lodgingMultiuseOnGroundOrRefugeFloor: toBool(state.answers.lodgingMultiuseOnGroundOrRefugeFloor),
    lodgingMultiuseUsesAV: toBool(state.answers.lodgingMultiuseUsesAV),
    lodgingMultiuseHasGasFacility: toBool(state.answers.lodgingMultiuseHasGasFacility),
    lodgingMultiuseHasEvacuationRoute: toBool(state.answers.lodgingMultiuseHasEvacuationRoute),
    // 노유자시설
    elderlySubtype: state.answers.elderlySubtype,
    elderlyTotalArea: toNumber(state.answers.elderlyTotalArea),
    elderlyArea: toNumber(state.answers.elderlyArea),
    elderlyAboveGroundFloors: toNumber(state.answers.elderlyAboveGroundFloors),
    elderlyBasementFloors: toNumber(state.answers.elderlyBasementFloors),
    elderlyBasementAreaSum: toNumber(state.answers.elderlyBasementAreaSum),
    elderlyTotalFloors: toNumber(state.answers.elderlyAboveGroundFloors) + toNumber(state.answers.elderlyBasementFloors),
    elderlyWindowlessArea: state.answers.elderlyHasWindowlessFloor === "yes" ? toNumber(state.answers.elderlyWindowlessArea) : 0,
    get elderlyHasLargeTargetFloor() {
      const tf = toNumber(state.answers.elderlyAboveGroundFloors) + toNumber(state.answers.elderlyBasementFloors);
      const avg = tf > 0 ? toNumber(state.answers.elderlyTotalArea) / tf : 0;
      return avg >= 300;
    },
    get elderlyFloorAvgArea() {
      const tf = toNumber(state.answers.elderlyAboveGroundFloors) + toNumber(state.answers.elderlyBasementFloors);
      return tf > 0 ? toNumber(state.answers.elderlyTotalArea) / tf : 0;
    },
    elderlyHasGrillWindow: toBool(state.answers.elderlyHasGrillWindow),
    elderlyHasFloor500Plus: toBool(state.answers.elderlyHasFloor500Plus),
    elderlyHas24HourStaff: toBool(state.answers.elderlyHas24HourStaff),
    elderlyHasGasFacility: toBool(state.answers.elderlyHasGasFacility),
    elderlyIndoorParkingArea: toNumber(state.answers.elderlyIndoorParkingArea),
    elderlyParkingStructureArea: toNumber(state.answers.elderlyParkingStructureArea),
    elderlyMechanicalParkingCapacity: toNumber(state.answers.elderlyMechanicalParkingCapacity),
    elderlyElectricalRoomArea: toNumber(state.answers.elderlyElectricalRoomArea),
    // 의료시설
    medicalSubtype: state.answers.medicalSubtype,
    medicalTotalArea: toNumber(state.answers.medicalTotalArea),
    medicalArea: toNumber(state.answers.medicalArea),
    medicalAboveGroundFloors: toNumber(state.answers.medicalAboveGroundFloors),
    medicalBasementFloors: toNumber(state.answers.medicalBasementFloors),
    medicalBasementAreaSum: toNumber(state.answers.medicalBasementAreaSum),
    medicalTotalFloors: toNumber(state.answers.medicalAboveGroundFloors) + toNumber(state.answers.medicalBasementFloors),
    medicalWindowlessArea: state.answers.medicalHasWindowlessFloor === "yes" ? toNumber(state.answers.medicalWindowlessArea) : 0,
    medicalHasGrillWindow: toBool(state.answers.medicalHasGrillWindow),
    medicalHasGasFacility: toBool(state.answers.medicalHasGasFacility),
    medicalIndoorParkingArea: toNumber(state.answers.medicalIndoorParkingArea),
    medicalParkingStructureArea: toNumber(state.answers.medicalParkingStructureArea),
    medicalMechanicalParkingCapacity: toNumber(state.answers.medicalMechanicalParkingCapacity),
    medicalElectricalRoomArea: toNumber(state.answers.medicalElectricalRoomArea),
  };
}

function isClinicWithInpatient(input) {
  return input.facilitySubtype === "clinicInpatient";
}

function isPostpartum(input) {
  return input.facilitySubtype === "postpartum";
}

function isPostpartumUnder600(input) {
  return isPostpartum(input) && input.postpartumAreaRange === "under600";
}

function isPostpartum600Plus(input) {
  return isPostpartum(input) && input.postpartumAreaRange === "600plus";
}

function makeResult(category, name, description, status, reason, basis) {
  return { category, name, description, status, reason, basis };
}

function isThirdClassMarketOrBathhouse(input) {
  return input.thirdClassDetailUse === "marketBathhouse";
}

function getThirdClassPeriodLabel(value) {
  const labels = {
    "1982-08-07_to_1984-06-30": "1982년 8월 7일 ~ 1984년 6월 30일",
    "1984-06-30_to_1990-06-29": "1984년 6월 30일 ~ 1990년 6월 29일",
    "1990-06-29_to_1990-12-01": "1990년 6월 29일 ~ 1990년 12월 1일",
    "1990-12-01_to_1991-01-08": "1990년 12월 1일 ~ 1992년 7월 28일",
  };
  return labels[value] || value;
}

function getThirdClassDetailLabel(value) {
  const labels = {
    general: "일반근린생활시설",
    marketBathhouse: "시장 또는 공중목욕장",
  };
  return labels[value] || value;
}

function evaluateThirdClassPre1992(input) {
  const results = [];
  const isSpecialUse = isThirdClassMarketOrBathhouse(input);
  const totalAreaThreshold = isSpecialUse ? 1000 : 600;
  const floorAreaThreshold = isSpecialUse ? 600 : 300;
  const period = input.pre1992PermitRange;
  const firstPeriod = period === "1982-08-07_to_1984-06-30";
  const waterSprayThreshold = ["1982-08-07_to_1984-06-30", "1984-06-30_to_1990-06-29"].includes(period) ? 700 : 150;
  const standpipeRequired = input.aboveGroundFloors >= 7 || (input.aboveGroundFloors >= 5 && input.totalArea >= 6000);

  results.push(makeResult(categories.extinguishing, "소화기", "", input.totalArea >= 150 ? "required" : "notRequired", input.totalArea >= 150 ? "연면적이 150㎡ 이상이므로 설치 대상입니다." : "연면적이 150㎡ 미만이므로 설치 대상이 아닙니다.", ""));

  let autoDetectionStatus = "notRequired";
  let autoDetectionReason = "현재 입력 기준으로는 설치 대상이 아닙니다.";
  if (input.totalArea >= totalAreaThreshold) {
    autoDetectionStatus = "required";
    autoDetectionReason = firstPeriod
      ? `연면적이 ${totalAreaThreshold}㎡ 이상이므로 해당층에만 설치 대상으로 봅니다.`
      : `연면적이 ${totalAreaThreshold}㎡ 이상이므로 전층 설치 대상으로 봅니다.`;
  } else if (input.basementFloors > 0 && input.basementAreaSum >= floorAreaThreshold) {
    autoDetectionStatus = "required";
    autoDetectionReason = firstPeriod
      ? `지하층 바닥면적 합계가 ${floorAreaThreshold}㎡ 이상이므로 해당층 설치 대상으로 봅니다.`
      : `지하층 바닥면적 합계가 ${floorAreaThreshold}㎡ 이상이므로 전층 설치 대상으로 봅니다.`;
  } else if (input.aboveGroundFloors >= 3) {
    autoDetectionStatus = "review";
    autoDetectionReason = `${firstPeriod ? "해당층" : "전층"} 설치 기준에는 무창층 또는 3층 이상 층의 바닥면적 검토가 포함되지만, 현재 입력값만으로는 해당 층 면적을 확정할 수 없어 추가 확인이 필요합니다.`;
  }
  results.push(makeResult(categories.alarm, "자동화재탐지설비", "", autoDetectionStatus, autoDetectionReason, ""));

  results.push(makeResult(categories.evacuation, "유도등(피난구유도등, 통로유도등, 유도표지)", "", "required", "모든 특정소방대상물에 설치합니다.", ""));

  results.push(makeResult(categories.fireSupport, "연결살수설비", "", input.basementAreaSum >= waterSprayThreshold ? "required" : "notRequired", input.basementAreaSum >= waterSprayThreshold ? `지하층 바닥면적 합계가 ${waterSprayThreshold}㎡ 이상이므로 설치 대상입니다.` : `지하층 바닥면적 합계가 ${waterSprayThreshold}㎡ 미만이므로 설치 대상이 아닙니다.`, ""));
  results.push(makeResult(categories.fireSupport, "연결송수관설비", "", standpipeRequired ? "required" : "notRequired", standpipeRequired ? (input.aboveGroundFloors >= 7 ? "지하층을 제외한 층수가 7층 이상이므로 설치 대상입니다." : "지하층을 제외한 층수가 5층 이상이고, 연면적이 6,000㎡ 이상이므로 설치 대상입니다.") : "기준은 '지하층을 제외한 층수가 7층 이상'이거나 '지하층을 제외한 층수가 5층 이상이면서 연면적이 6,000㎡ 이상'인 경우입니다. 현재 입력값은 두 조건에 모두 해당하지 않아 설치 대상이 아닙니다.", ""));

  return results;
}

function evaluateNeighborhoodFacility(input) {
  const results = [];
  const sprinklerRequired = input.aboveGroundFloors >= 6 || isPostpartum600Plus(input);
  const parkingWaterSprayCondition = input.parkingStructureArea >= 800 || input.indoorParkingArea >= 200 || input.mechanicalParkingCapacity >= 20;
  const waterSprayRequired = parkingWaterSprayCondition || input.electricalRoomArea >= 300;
  const simpleSprinklerRequiredByRule = input.neighborhoodArea >= 1000 || isClinicWithInpatient(input) || isPostpartumUnder600(input);
  const simpleSprinklerRequired = simpleSprinklerRequiredByRule && !sprinklerRequired;

  results.push(makeResult(categories.extinguishing, "소화기구", "", input.totalArea >= 33 ? "required" : "notRequired", input.totalArea >= 33 ? "연면적이 33㎡ 이상입니다." : "연면적이 33㎡ 미만입니다.", ""));
  results.push(makeResult(categories.extinguishing, "옥내소화전설비", "", input.totalArea >= 1500 || input.hasLargeTargetFloor ? "required" : "notRequired", input.totalArea >= 1500 ? "연면적이 1,500㎡ 이상입니다." : input.hasLargeTargetFloor ? "지하층, 무창층 또는 4층 이상 층 중 300㎡ 이상인 층이 있습니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  results.push(makeResult(categories.extinguishing, "스프링클러설비", "", sprinklerRequired ? "required" : "notRequired", isPostpartum600Plus(input) ? "조산원·산후조리원이고 바닥면적이 600㎡ 이상입니다." : input.aboveGroundFloors >= 6 ? "지상층수가 6층 이상입니다." : "지상층수가 6층 미만입니다.", ""));
  results.push(makeResult(categories.extinguishing, "간이스프링클러설비", "", simpleSprinklerRequired ? "required" : "notRequired", sprinklerRequired ? "스프링클러설비가 전층 설치 대상이므로 간이스프링클러설비는 제외 대상으로 봅니다." : input.neighborhoodArea >= 1000 ? "근린생활시설 사용면적이 1,000㎡ 이상입니다." : isClinicWithInpatient(input) ? "입원실 있는 의원급입니다." : isPostpartumUnder600(input) ? "조산원·산후조리원이고 바닥면적이 600㎡ 미만입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  results.push(makeResult(categories.extinguishing, "물분무등소화설비", "", waterSprayRequired ? "required" : "notRequired", buildWaterSprayReason(input.parkingStructureArea, input.indoorParkingArea, input.mechanicalParkingCapacity, input.electricalRoomArea), ""));
  results.push(makeResult(categories.extinguishing, "옥외소화전설비", "", input.firstSecondFloorArea >= 9000 ? "required" : "notRequired", input.firstSecondFloorArea >= 9000 ? "지상 1층과 2층의 바닥면적 합계가 9,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  const emergencyAlarm = input.totalArea >= 400 || input.hasBasement150Plus || input.hasWindowless150Plus;
  const autoDetection = (input.facilitySubtype === "bathhouse" && input.totalArea >= 1000) || (input.facilitySubtype !== "bathhouse" && input.totalArea >= 600) || isPostpartum(input);
  results.push(makeResult(categories.alarm, "비상경보설비", "", emergencyAlarm ? "required" : "notRequired", input.totalArea >= 400 ? "연면적이 400㎡ 이상입니다." : input.hasBasement150Plus ? "지하층 평균 면적이 150㎡ 이상입니다." : input.hasWindowless150Plus ? "무창층 면적이 150㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  results.push(makeResult(categories.alarm, "자동화재탐지설비", "", autoDetection ? "required" : "notRequired", input.facilitySubtype === "bathhouse" && input.totalArea >= 1000 ? "목욕장이고 연면적이 1,000㎡ 이상입니다." : input.facilitySubtype !== "bathhouse" && input.totalArea >= 600 ? "일반 근린생활시설이며 연면적이 600㎡ 이상입니다." : isPostpartumUnder600(input) ? "조산원·산후조리원이고 바닥면적이 600㎡ 미만입니다." : isPostpartum600Plus(input) ? "조산원·산후조리원이고 바닥면적이 600㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  results.push(makeResult(categories.alarm, "비상방송설비", "", input.totalArea >= 3500 || input.aboveGroundFloors >= 11 || input.basementFloors >= 3 ? "required" : "notRequired", input.totalArea >= 3500 ? "연면적이 3,500㎡ 이상입니다." : input.aboveGroundFloors >= 11 ? "지상층수가 11층 이상입니다." : input.basementFloors >= 3 ? "지하층수가 3층 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  const autoDispatchTarget = isClinicWithInpatient(input) || isPostpartum(input);
  results.push(makeResult(categories.alarm, "자동화재속보설비", "", autoDispatchTarget ? (input.has24HourStaff ? "review" : "required") : "notRequired", autoDispatchTarget ? input.has24HourStaff ? "24시간 상주 근무자가 있어 면제 검토가 필요합니다." : isPostpartumUnder600(input) ? "조산원·산후조리원이고 바닥면적이 600㎡ 미만입니다." : isPostpartum600Plus(input) ? "조산원·산후조리원이고 바닥면적이 600㎡ 이상입니다." : "입원실 있는 의원급에 해당합니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  results.push(makeResult(categories.alarm, "시각경보기", "", "required", "근린생활시설 용도이므로 설치해야 합니다.", ""));

  results.push(makeResult(categories.evacuation, "피난기구", "", input.aboveGroundFloors >= 3 ? "required" : "notRequired", input.aboveGroundFloors >= 3 ? "건축물 3층 이상 10층 이하의 층에 설치합니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  results.push(makeResult(categories.evacuation, "유도등 및 유도표지", "", "required", "기본적으로 건물 전체에 설치합니다.", ""));
  results.push(makeResult(categories.evacuation, "비상조명등", "", (input.totalFloors >= 5 && input.totalArea >= 3000) || input.hasBasement450Plus || input.hasWindowless450Plus ? "required" : "notRequired", input.totalFloors >= 5 && input.totalArea >= 3000 ? "전체 층수가 5층 이상이고 연면적이 3,000㎡ 이상입니다." : input.hasBasement450Plus ? "지하층 평균 면적이 450㎡ 이상입니다." : input.hasWindowless450Plus ? "무창층 면적이 450㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  results.push(makeResult(categories.waterSupply, "상수도소화용수설비", "", input.totalArea >= 5000 ? "required" : "notRequired", input.totalArea >= 5000 ? "연면적이 5,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  results.push(makeResult(categories.fireSupport, "제연설비", "", input.smokeControlArea >= 1000 ? "required" : "notRequired", input.smokeControlArea >= 1000 ? "지하층과 무창층 면적 합계가 1,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  results.push(makeResult(categories.fireSupport, "연결송수관설비", "", (input.totalFloors >= 5 && input.totalArea >= 6000) || input.totalFloors >= 7 || (input.basementFloors >= 3 && input.basementAreaSum >= 1000) ? "required" : "notRequired", input.totalFloors >= 5 && input.totalArea >= 6000 ? "전체 층수가 5층 이상이고 연면적이 6,000㎡ 이상입니다." : input.totalFloors >= 7 ? "전체 층수가 7층 이상입니다." : input.basementFloors >= 3 && input.basementAreaSum >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  results.push(makeResult(categories.fireSupport, "연결살수설비", "", input.basementAreaSum >= 150 ? "required" : "notRequired", input.basementAreaSum >= 150 ? "지하층 바닥면적 합계가 150㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  results.push(makeResult(categories.fireSupport, "비상콘센트설비", "", input.aboveGroundFloors >= 11 || (input.basementFloors >= 3 && input.basementAreaSum >= 1000) ? "required" : "notRequired", input.aboveGroundFloors >= 11 ? "지상층수가 11층 이상입니다." : input.basementFloors >= 3 && input.basementAreaSum >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  results.push(makeResult(categories.fireSupport, "무선통신보조설비", "", input.aboveGroundFloors >= 30 || input.basementAreaSum >= 3000 || (input.basementFloors >= 3 && input.basementAreaSum >= 1000) ? "required" : "notRequired", input.aboveGroundFloors >= 30 ? "지상층수가 30층 이상입니다." : input.basementAreaSum >= 3000 ? "지하층 바닥면적 합계가 3,000㎡ 이상입니다." : input.basementFloors >= 3 && input.basementAreaSum >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
  return results;
}

function evaluateLodgingFacility(input) {
  const results = [];
  const la = input.lodgingArea;
  const ta = input.lodgingTotalArea;
  const ag = input.lodgingAboveGroundFloors;
  const bf = input.lodgingBasementFloors;
  const ba = input.lodgingBasementAreaSum;
  const wl = input.lodgingWindowlessArea;
  const tf = input.lodgingTotalFloors;

  // 지하층 평균 바닥면적
  const basementAvg = bf > 0 ? ba / bf : 0;
  const hasBasement150Plus = bf > 0 && basementAvg >= 150;
  const hasBasement450Plus = bf > 0 && basementAvg >= 450;
  const hasBasement1000Plus = bf > 0 && basementAvg >= 1000;
  const hasWindowless150Plus = wl >= 150;
  const hasWindowless450Plus = wl >= 450;
  const hasWindowless1000Plus = wl >= 1000;

  // 스프링클러 전층 조건
  const sprinklerAllFloors = la >= 600 || ag >= 6;
  // 스프링클러 해당층 조건 (지하/무창/4층이상 중 1000㎡ 이상)
  const sprinklerTargetFloor = !sprinklerAllFloors && (input.lodgingHasLargeFloorFor1000 || hasBasement1000Plus || hasWindowless1000Plus);
  const sprinklerRequired = sprinklerAllFloors || sprinklerTargetFloor;

  // 간이스프링클러
  const simpleSprinklerRequired = !sprinklerRequired && la >= 300 && la < 600;

  // 물분무등소화설비
  const parkingWaterSprayCondition = input.lodgingParkingStructureArea >= 800 || input.lodgingIndoorParkingArea >= 200 || input.lodgingMechanicalParkingCapacity >= 20;
  const waterSprayRequired = parkingWaterSprayCondition || input.lodgingElectricalRoomArea >= 300;

  // 옥내소화전
  // 옥내소화전: 연면적 1500㎡ 이상이거나, 연면적/층수로 추산한 층평균이 300㎡ 이상이거나, 지하/무창 1000㎡ 이상
  const floorAvgArea = tf > 0 ? ta / tf : 0;
  const standpipeRequired = ta >= 1500 || floorAvgArea >= 300 || hasBasement1000Plus || hasWindowless1000Plus;

  // ── 소화설비 ──
  results.push(makeResult(categories.extinguishing, "소화기구", "", ta >= 33 ? "required" : "notRequired",
    ta >= 33 ? "연면적이 33㎡ 이상입니다." : "연면적이 33㎡ 미만입니다.", ""));

  results.push(makeResult(categories.extinguishing, "간이스프링클러설비", "", simpleSprinklerRequired ? "required" : "notRequired",
    sprinklerRequired ? "스프링클러설비 설치 대상이므로 간이스프링클러설비는 제외됩니다."
    : la >= 300 && la < 600 ? "숙박시설 사용 바닥면적이 300㎡ 이상 600㎡ 미만입니다."
    : la < 300 ? "숙박시설 사용 바닥면적이 300㎡ 미만입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  results.push(makeResult(categories.extinguishing, "스프링클러설비", "",
    sprinklerRequired ? "required" : "notRequired",
    la >= 600 ? "숙박시설 사용 바닥면적이 600㎡ 이상이므로 전층 설치 대상입니다."
    : ag >= 6 ? "건물 전체 층수가 6층 이상이므로 전층 설치 대상입니다."
    : sprinklerTargetFloor ? "지하층, 무창층 또는 4층 이상 층 중 바닥면적 1,000㎡ 이상인 층이 있어 해당 층에 설치합니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  results.push(makeResult(categories.extinguishing, "옥내소화전설비", "",
    standpipeRequired ? "required" : "notRequired",
    ta >= 1500 ? "연면적이 1,500㎡ 이상입니다."
    : floorAvgArea >= 300 ? `연면적(${ta}㎡)을 전체 층수(${tf}층)로 나눈 층평균이 300㎡ 이상입니다.`
    : hasBasement1000Plus ? "지하층 평균 면적이 1,000㎡ 이상입니다."
    : hasWindowless1000Plus ? "무창층 면적이 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  results.push(makeResult(categories.extinguishing, "물분무등소화설비", "", waterSprayRequired ? "required" : "notRequired", buildWaterSprayReason(input.lodgingParkingStructureArea, input.lodgingIndoorParkingArea, input.lodgingMechanicalParkingCapacity, input.lodgingElectricalRoomArea), ""));

  // ── 경보설비 ──
  // 자동화재탐지설비: 숙박시설은 면적 무관 전층
  results.push(makeResult(categories.alarm, "자동화재탐지설비", "", "required",
    "숙박시설의 경우 면적과 관계없이 모든 층에 설치해야 합니다.", ""));

  // 시각경보기: 자동화재탐지설비 설치 대상이므로 함께
  results.push(makeResult(categories.alarm, "시각경보기", "", "required",
    "자동화재탐지설비를 설치해야 하는 숙박시설이므로 함께 설치해야 합니다.", ""));

  // 단독경보형감지기: 연면적 600㎡ 미만
  results.push(makeResult(categories.alarm, "단독경보형 감지기", "", ta < 600 ? "required" : "notRequired",
    ta < 600 ? "연면적 600㎡ 미만의 소규모 숙박시설입니다."
    : "연면적 600㎡ 이상이므로 설치 대상이 아닙니다.", ""));

  // 가스누설경보기
  results.push(makeResult(categories.alarm, "가스누설경보기", "", input.lodgingHasGasFacility ? "required" : "notRequired",
    input.lodgingHasGasFacility ? "가스시설이 설치된 숙박시설입니다."
    : "가스시설이 없어 설치 대상이 아닙니다.", ""));


  // 비상방송설비
  const broadcastRequired = ta >= 3500 || ag >= 11 || bf >= 3;
  results.push(makeResult(categories.alarm, "비상방송설비", "",
    broadcastRequired ? "required" : "notRequired",
    ta >= 3500 ? "연면적이 3,500㎡ 이상입니다."
    : ag >= 11 ? "지상층수가 11층 이상입니다."
    : bf >= 3 ? "지하층수가 3층 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // 비상경보설비
  const emergencyAlarm = ta >= 400 || hasBasement150Plus || hasWindowless150Plus;
  results.push(makeResult(categories.alarm, "비상경보설비", "",
    emergencyAlarm ? "required" : "notRequired",
    ta >= 400 ? "연면적이 400㎡ 이상입니다."
    : hasBasement150Plus ? "지하층 평균 면적이 150㎡ 이상입니다."
    : hasWindowless150Plus ? "무창층 면적이 150㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));


  // ── 피난구조설비 ──
  // 휴대용 비상조명등: 규모 무관 객실 내부
  results.push(makeResult(categories.evacuation, "휴대용 비상조명등", "", "required",
    "숙박시설은 규모에 관계없이 객실 내부에 설치해야 합니다. 단, 복도에 비상조명등이 설치된 경우 제외됩니다.", ""));

  // 피난기구(복도): 3층~10층
  results.push(makeResult(categories.evacuation, "피난기구(복도 등)", "",
    ag >= 3 ? "required" : "notRequired",
    ag >= 3 ? "지상 3층~10층에 완강기등의 피난기구를 설치해야 합니다. 양방향 피난이 가능한 경우 제외 가능합니다."
    : "3층 이상 층이 없어 설치 대상이 아닙니다.", ""));

  // 피난기구(객실 내 간이완강기): 3층 이상 객실
  results.push(makeResult(categories.evacuation, "간이완강기(객실 내부)", "",
    ag >= 3 ? "required" : "notRequired",
    ag >= 3 ? "3층 이상 각 객실마다 간이완강기를 설치해야 합니다. 양방향 피난이 가능해도 제외되지 않습니다."
    : "3층 이상 층이 없어 설치 대상이 아닙니다.", ""));

  // 인명구조기구: 관광호텔 + 지하 포함 7층 이상
  const touristHotel7F = input.lodgingIsTouristHotel && tf >= 7;
  results.push(makeResult(categories.evacuation, "인명구조기구(방열복·공기호흡기 등)", "",
    touristHotel7F ? "required" : "notRequired",
    touristHotel7F ? `관광호텔이며 지하층을 포함한 전체 층수가 ${tf}층으로 7층 이상입니다. 방열복(또는 방화복), 인공소생기, 공기호흡기를 비치해야 합니다.`
    : input.lodgingIsTouristHotel ? `관광호텔이나 지하층을 포함한 전체 층수가 ${tf}층으로 7층 미만입니다.`
    : "관광호텔이 아닙니다.", ""));

  // 유도등
  results.push(makeResult(categories.evacuation, "유도등(피난구유도등·통로유도등)", "", "required",
    "건물 전체 복도와 출입구 등에 설치해야 합니다.", ""));

  // 비상조명등
  const emergencyLightRequired = (ag >= 5 && ta >= 3000) || hasBasement450Plus || hasWindowless450Plus;
  results.push(makeResult(categories.evacuation, "비상조명등", "",
    emergencyLightRequired ? "required" : "notRequired",
    ag >= 5 && ta >= 3000 ? "층수가 5층 이상이고 연면적이 3,000㎡ 이상입니다."
    : hasBasement450Plus ? "지하층 평균 면적이 450㎡ 이상입니다."
    : hasWindowless450Plus ? "무창층 면적이 450㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 소화용수설비 ──
  results.push(makeResult(categories.waterSupply, "상수도소화용수설비", "",
    ta >= 5000 ? "required" : "notRequired",
    ta >= 5000 ? "연면적이 5,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 소화활동설비 ──
  // 제연설비: 지하/무창 1000㎡ 이상
  const smokeControlArea = ba + wl;
  const smokeRequired = (bf > 0 && basementAvg >= 1000) || hasWindowless1000Plus;
  results.push(makeResult(categories.fireSupport, "제연설비", "",
    smokeRequired ? "required" : "notRequired",
    smokeRequired ? "지하층 또는 무창층의 바닥면적이 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // 연결송수관설비: 7층 이상
  results.push(makeResult(categories.fireSupport, "연결송수관설비", "",
    tf >= 7 ? "required" : "notRequired",
    tf >= 7 ? "전체 층수(지하 포함)가 7층 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // 연결살수설비: 지하 150㎡ 이상
  results.push(makeResult(categories.fireSupport, "연결살수설비", "",
    ba >= 150 ? "required" : "notRequired",
    ba >= 150 ? "지하층 바닥면적 합계가 150㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // 비상콘센트설비: 지상 11층 이상 또는 지하 3층 이하(1000㎡ 이상)
  const emergencyOutletRequired = ag >= 11 || (bf >= 3 && ba >= 1000);
  results.push(makeResult(categories.fireSupport, "비상콘센트설비", "",
    emergencyOutletRequired ? "required" : "notRequired",
    ag >= 11 ? "지상층수가 11층 이상입니다."
    : bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // 무선통신보조설비: 지하 3,000㎡ 이상
  results.push(makeResult(categories.fireSupport, "무선통신보조설비", "",
    ba >= 3000 || (bf >= 3 && ba >= 1000) ? "required" : "notRequired",
    ba >= 3000 ? "지하층 바닥면적 합계가 3,000㎡ 이상입니다."
    : bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  return results;
}

function buildLodgingExceptionItems(results, input) {
  const exceptionItems = [];
  const autoDetection = results.find((r) => r.name === "자동화재탐지설비");
  const emergencyAlarm = results.find((r) => r.name === "비상경보설비");
  const singleDetector = results.find((r) => r.name === "단독경보형 감지기");
  const sprinkler = results.find((r) => r.name === "스프링클러설비");
  const simpleSprinkler = results.find((r) => r.name === "간이스프링클러설비");
  const drencher = results.find((r) => r.name === "연결살수설비");
  const waterSpray = results.find((r) => r.name === "물분무등소화설비");
  const parkingCondition = input.lodgingParkingStructureArea >= 800 || input.lodgingIndoorParkingArea >= 200 || input.lodgingMechanicalParkingCapacity >= 20;

  if (sprinkler && sprinkler.status === "required" && simpleSprinkler && simpleSprinkler.status === "notRequired") {
    exceptionItems.push({ category: "설치 제외", name: "간이스프링클러설비", status: "review", reason: "스프링클러설비가 전층 설치 대상이므로 간이스프링클러설비는 제외됩니다." });
  }
  if (sprinkler && sprinkler.status === "required" && drencher && drencher.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "연결살수설비", status: "review", reason: "스프링클러설비가 설치 대상이면 연결살수설비는 설치 제외 대상입니다." });
  }
  if (autoDetection && autoDetection.status === "required" && emergencyAlarm && emergencyAlarm.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "비상경보설비", status: "review", reason: "자동화재탐지설비가 설치되면 비상경보설비는 면제 관계로 검토할 수 있습니다." });
  }
  if (autoDetection && autoDetection.status === "required" && singleDetector && singleDetector.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "단독경보형 감지기", status: "review", reason: "자동화재탐지설비가 설치되면 단독경보형 감지기는 중복 설치가 불필요합니다." });
  }
  if (waterSpray && waterSpray.status === "required" && parkingCondition) {
    exceptionItems.push({ category: "대체설비", name: "주차장 관련 스프링클러설비 대체 가능", status: "review", reason: "주차 관련 공간은 물분무등소화설비 기준이 적용되나, 대체설비로 스프링클러설비를 설치할 수 있습니다." });
  }
  if (!exceptionItems.length) {
    exceptionItems.push({ category: "안내", name: "설치 제외·대체 없음", status: "notRequired", reason: "현재 입력값 기준으로 별도 면제 또는 대체로 표시할 항목이 없습니다." });
  }
  return exceptionItems;
}

function buildLodgingRequiredItems(results, input, exceptionItems) {
  const excludedNames = new Set(exceptionItems.filter((e) => e.category === "설치 제외").map((e) => e.name));
  const parkingCondition = input.lodgingParkingStructureArea >= 800 || input.lodgingIndoorParkingArea >= 200 || input.lodgingMechanicalParkingCapacity >= 20;
  let requiredItems = results.filter((r) => r.status === "required" && !excludedNames.has(r.name));
  if (parkingCondition && input.lodgingElectricalRoomArea < 300) {
    requiredItems = requiredItems.filter((r) => r.name !== "물분무등소화설비");
    if (!requiredItems.some((r) => r.name.includes("스프링클러설비"))) {
      requiredItems.push({
        category: categories.extinguishing,
        name: "스프링클러설비(주차 관련 대체설비)",
        status: "required",
        reason: "주차 관련 공간은 물분무등소화설비 기준이 적용되나, 대체설비로 스프링클러설비를 설치할 수 있습니다.",
      });
    }
  }
  return requiredItems;
}

function evaluateLodgingMultiuseFacilities(input) {
  if (!input.lodgingHasMultiuseBusiness) {
    return { requiredItems: [], extraSafetyItems: [], reasonItems: [] };
  }

  const requiredItems = [
    { category: "다중이용업소 공통", name: "소화기", status: "required", reason: "다중이용업소 공통 설치대상이며, 구획된 실마다 설치해야 합니다." },
    { category: "다중이용업소 공통", name: "비상벨설비", status: "required", reason: "다중이용업소 공통 설치대상이며, 비상벨설비 구성품 중 경종은 구획된 실마다 설치해야 합니다." },
    { category: "다중이용업소 공통", name: "휴대용 비상조명등", status: "required", reason: "다중이용업소 공통 설치대상이며, 구획된 실마다 설치해야 합니다." },
    { category: "다중이용업소 공통", name: "유도등", status: "required", reason: "다중이용업소 공통 설치대상이며, 구획된 실마다 설치해야 합니다." },
    { category: "다중이용업소 공통", name: "비상구", status: "required", reason: "다중이용업소에는 비상구를 설치해야 합니다. 다만 주된 출입구 외에 해당 영업장 내부에서 피난층 또는 지상으로 통하는 직통계단이 주된 출입구 중심선으로부터 수평거리로 영업장의 긴 변 길이의 2분의 1 이상 떨어진 위치에 별도로 설치된 경우에는 비상구를 설치하지 않을 수 있습니다." },
  ];

  const extraSafetyItems = [
    { category: "그 밖의 안전시설", name: "누전차단기", status: "required", reason: "다중이용업소 공통 안전시설로 설치해야 합니다." },
    { category: "그 밖의 안전시설", name: "방염", status: "required", reason: "다중이용업소이므로 방염을 해야 합니다." },
  ];

  const simpleSprinklerReasons = [];
  if (input.lodgingMultiuseInBasement) simpleSprinklerReasons.push("지하층에 설치돼 있습니다.");
  if (input.lodgingMultiuseIsSealed) simpleSprinklerReasons.push("밀폐구조 영업장입니다.");
  if (input.lodgingMultiuseIsPostpartum && !input.lodgingMultiuseOnGroundOrRefugeFloor) simpleSprinklerReasons.push("산후조리업에 해당합니다.");
  if (input.lodgingMultiuseIsGosiwon && !input.lodgingMultiuseOnGroundOrRefugeFloor) simpleSprinklerReasons.push("고시원에 해당합니다.");
  if (input.lodgingMultiuseIsGunRange) simpleSprinklerReasons.push("권총사격장에 해당합니다.");
  if (simpleSprinklerReasons.length) {
    requiredItems.push({ category: categories.extinguishing, name: "간이스프링클러설비", status: "required", reason: simpleSprinklerReasons.join(" ") });
  }

  if (input.lodgingMultiuseOnSecondToTenthFloor) {
    requiredItems.push({ category: categories.evacuation, name: "피난기구", status: "required", reason: "다중이용업소가 2층부터 10층 사이에 설치돼 있어 피난기구 설치대상입니다. 주로 구조대나 피난사다리를 설치하며, 법에는 완강기 설치가 가능하지만 대구에서는 완강기 설치가 불가합니다." });
  }
  if (input.lodgingMultiuseUsesAV) {
    requiredItems.push({ category: categories.alarm, name: "자동화재탐지설비", status: "required", reason: "노래반주기 등 영상음향장치를 사용하는 영업장입니다." });
    extraSafetyItems.push({ category: "그 밖의 안전시설", name: "영상음향차단장치", status: "required", reason: "노래반주기 등 영상음향장치를 사용하는 영업장입니다." });
  }
  if (input.lodgingMultiuseHasGasFacility) {
    requiredItems.push({ category: categories.alarm, name: "가스누설경보기", status: "required", reason: "가스시설을 사용하는 주방 또는 난방시설이 있습니다." });
  }
  if (input.lodgingMultiuseHasEvacuationRoute) {
    requiredItems.push({ category: categories.evacuation, name: "피난유도선", status: "required", reason: "영업장 내부 피난통로 또는 복도가 있습니다." });
  }
  if (input.lodgingMultiuseIsGosiwon) {
    extraSafetyItems.push({ category: "그 밖의 안전시설", name: "창문", status: "required", reason: "고시원이므로 창문을 설치해야 합니다." });
  }

  const reasonItems = [...requiredItems, ...extraSafetyItems];
  return { requiredItems, extraSafetyItems, reasonItems };
}

function evaluateElderlyFacility(input) {
  const results = [];
  const ea = input.elderlyArea;
  const ta = input.elderlyTotalArea;
  const ag = input.elderlyAboveGroundFloors;
  const bf = input.elderlyBasementFloors;
  const ba = input.elderlyBasementAreaSum;
  const wl = input.elderlyWindowlessArea;
  const tf = input.elderlyTotalFloors;
  const isLivingFacility = input.elderlySubtype === "livingFacility";

  const basementAvg = bf > 0 ? ba / bf : 0;
  const hasBasement150Plus = bf > 0 && basementAvg >= 150;
  const hasBasement450Plus = bf > 0 && basementAvg >= 450;
  const hasBasement1000Plus = bf > 0 && basementAvg >= 1000;
  const hasWindowless150Plus = wl >= 150;
  const hasWindowless450Plus = wl >= 450;
  const hasWindowless1000Plus = wl >= 1000;

  // 스프링클러 조건
  const sprinklerRequired = ag >= 6 || ea >= 600;

  // 간이스프링클러 조건
  let simpleSprinklerRequired = false;
  let simpleSprinklerReason = "";
  if (!sprinklerRequired) {
    if (isLivingFacility) {
      simpleSprinklerRequired = true;
      simpleSprinklerReason = "노유자 생활시설은 면적에 관계없이 모든 층에 간이스프링클러를 설치해야 합니다.";
    } else if (ea >= 300 && ea < 600) {
      simpleSprinklerRequired = true;
      simpleSprinklerReason = `노유자시설 사용 바닥면적이 ${ea}㎡로 300㎡ 이상 600㎡ 미만입니다.`;
    } else if (ea < 300 && input.elderlyHasGrillWindow) {
      simpleSprinklerRequired = true;
      simpleSprinklerReason = "창살(자동 개방 제외)이 설치된 노유자시설로, 바닥면적이 300㎡ 미만이더라도 간이스프링클러를 설치해야 합니다.";
    }
  }

  // 물분무등소화설비
  const parkingWaterSprayCondition = input.elderlyParkingStructureArea >= 800 || input.elderlyIndoorParkingArea >= 200 || input.elderlyMechanicalParkingCapacity >= 20;
  const waterSprayRequired = parkingWaterSprayCondition || input.elderlyElectricalRoomArea >= 300;

  // 옥내소화전
  const standpipeRequired = ta >= 1500 || input.elderlyHasLargeTargetFloor;

  // ── 소화설비 ──
  results.push(makeResult(categories.extinguishing, "소화기구", "", ta >= 33 ? "required" : "notRequired",
    ta >= 33 ? "연면적이 33㎡ 이상입니다. 소화기 수량의 2분의 1 이상은 투척용 소화용구 등 노약자가 쉽게 사용할 수 있는 것으로 설치할 수 있습니다."
    : "연면적이 33㎡ 미만입니다.", ""));

  results.push(makeResult(categories.extinguishing, "옥내소화전설비", "", standpipeRequired ? "required" : "notRequired",
    ta >= 1500 ? "연면적이 1,500㎡ 이상입니다."
    : input.elderlyHasLargeTargetFloor ? `연면적(${ta}㎡)을 전체 층수(${tf}층)로 나눈 층평균 바닥면적이 약 ${Math.round(input.elderlyFloorAvgArea)}㎡로 300㎡ 이상입니다.`
    : `연면적(${ta}㎡)을 전체 층수(${tf}층)로 나눈 층평균 바닥면적이 약 ${Math.round(input.elderlyFloorAvgArea)}㎡로 300㎡ 미만이므로 설치 대상이 아닙니다.`, ""));

  results.push(makeResult(categories.extinguishing, "스프링클러설비", "", sprinklerRequired ? "required" : "notRequired",
    ag >= 6 ? "건물 층수가 6층 이상이므로 전층 설치 대상입니다."
    : ea >= 600 ? "노유자시설 사용 바닥면적이 600㎡ 이상이므로 전층 설치 대상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  let simpleSprinklerStatus = "notRequired";
  let simpleSprinklerDisplayReason = "";
  if (sprinklerRequired) {
    simpleSprinklerStatus = "notRequired";
    simpleSprinklerDisplayReason = "스프링클러설비 설치 대상이므로 간이스프링클러설비는 제외됩니다.";
  } else if (simpleSprinklerRequired) {
    simpleSprinklerStatus = "required";
    simpleSprinklerDisplayReason = simpleSprinklerReason;
  } else {
    simpleSprinklerDisplayReason = isLivingFacility
      ? "스프링클러설비 설치 대상이므로 간이스프링클러설비는 제외됩니다."
      : ea < 300 && !input.elderlyHasGrillWindow
        ? "창살이 설치되지 않은 300㎡ 미만의 일반 노유자시설로 설치 대상이 아닙니다."
        : "현재 입력 기준으로는 설치 대상이 아닙니다.";
  }
  results.push(makeResult(categories.extinguishing, "간이스프링클러설비", "", simpleSprinklerStatus, simpleSprinklerDisplayReason, ""));

  results.push(makeResult(categories.extinguishing, "물분무등소화설비", "", waterSprayRequired ? "required" : "notRequired", buildWaterSprayReason(input.elderlyParkingStructureArea, input.elderlyIndoorParkingArea, input.elderlyMechanicalParkingCapacity, input.elderlyElectricalRoomArea), ""));

  // ── 경보설비 ──
  results.push(makeResult(categories.alarm, "단독경보형 감지기", "", ta < 400 ? "required" : "notRequired",
    ta < 400 ? "연면적 400㎡ 미만의 노유자시설입니다."
    : "연면적 400㎡ 이상이므로 설치 대상이 아닙니다.", ""));

  const autoDetectionRequired = isLivingFacility || ta >= 400;
  results.push(makeResult(categories.alarm, "자동화재탐지설비", "", autoDetectionRequired ? "required" : "notRequired",
    isLivingFacility ? "노유자 생활시설은 면적에 관계없이 모든 층에 설치해야 합니다."
    : ta >= 400 ? "연면적이 400㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  let autoDispatchStatus = "notRequired";
  let autoDispatchReason = "현재 입력 기준으로는 설치 대상이 아닙니다.";
  if (isLivingFacility) {
    autoDispatchStatus = "required";
    autoDispatchReason = "노유자 생활시설은 면적에 관계없이 설치해야 합니다.";
  } else if (input.elderlyHasFloor500Plus) {
    if (input.elderlyHas24HourStaff) {
      autoDispatchStatus = "review";
      autoDispatchReason = "바닥면적 500㎡ 이상인 층이 있으나 24시간 상주 근무자가 있어 면제 검토가 필요합니다.";
    } else {
      autoDispatchStatus = "required";
      autoDispatchReason = "바닥면적이 500㎡ 이상인 층이 있습니다.";
    }
  }
  results.push(makeResult(categories.alarm, "자동화재속보설비", "", autoDispatchStatus, autoDispatchReason, ""));

  results.push(makeResult(categories.alarm, "가스누설경보기", "", input.elderlyHasGasFacility ? "required" : "notRequired",
    input.elderlyHasGasFacility ? "가스시설이 설치된 노유자시설입니다."
    : "가스시설이 없어 설치 대상이 아닙니다.", ""));

  const emergencyAlarm = ta >= 400 || hasBasement150Plus || hasWindowless150Plus;
  results.push(makeResult(categories.alarm, "비상경보설비", "", emergencyAlarm ? "required" : "notRequired",
    ta >= 400 ? "연면적이 400㎡ 이상입니다."
    : hasBasement150Plus ? "지하층 평균 면적이 150㎡ 이상입니다."
    : hasWindowless150Plus ? "무창층 면적이 150㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  const broadcastRequired = ta >= 3500 || ag >= 11 || bf >= 3;
  results.push(makeResult(categories.alarm, "비상방송설비", "", broadcastRequired ? "required" : "notRequired",
    ta >= 3500 ? "연면적이 3,500㎡ 이상입니다."
    : ag >= 11 ? "지상층수가 11층 이상입니다."
    : bf >= 3 ? "지하층수가 3층 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 피난구조설비 ──
  results.push(makeResult(categories.evacuation, "피난기구(구조대 등, 완강기 제외)", "", ag >= 2 ? "required" : "notRequired",
    ag >= 2 ? "노유자시설은 2층 이상 10층 이하의 층에 피난기구를 설치합니다. 완강기는 설치하지 않습니다."
    : "2층 이상 층이 없어 설치 대상이 아닙니다.", ""));

  results.push(makeResult(categories.evacuation, "유도등(피난구유도등·통로유도등)", "", "required",
    "건물 전체 복도 및 출입구 등에 설치해야 합니다.", ""));

  const emergencyLightRequired = (tf >= 5 && ta >= 3000) || hasBasement450Plus || hasWindowless450Plus;
  results.push(makeResult(categories.evacuation, "비상조명등", "", emergencyLightRequired ? "required" : "notRequired",
    tf >= 5 && ta >= 3000 ? "지하층을 포함한 층수가 5층 이상이고 연면적이 3,000㎡ 이상입니다."
    : hasBasement450Plus ? "지하층 평균 면적이 450㎡ 이상입니다."
    : hasWindowless450Plus ? "무창층 면적이 450㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 소화용수설비 ──
  results.push(makeResult(categories.waterSupply, "상수도소화용수설비", "", ta >= 5000 ? "required" : "notRequired",
    ta >= 5000 ? "연면적이 5,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 소화활동설비 ──
  const smokeRequired = hasBasement1000Plus || hasWindowless1000Plus;
  results.push(makeResult(categories.fireSupport, "제연설비", "", smokeRequired ? "required" : "notRequired",
    smokeRequired ? "지하층 또는 무창층의 바닥면적이 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  const standpipeFireRequired = (tf >= 5 && ta >= 6000) || tf >= 7 || (bf >= 3 && ba >= 1000);
  results.push(makeResult(categories.fireSupport, "연결송수관설비", "", standpipeFireRequired ? "required" : "notRequired",
    tf >= 5 && ta >= 6000 ? "전체 층수가 5층 이상이고 연면적이 6,000㎡ 이상입니다."
    : tf >= 7 ? "지하층을 포함한 전체 층수가 7층 이상입니다."
    : bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  results.push(makeResult(categories.fireSupport, "연결살수설비", "", ba >= 150 ? "required" : "notRequired",
    ba >= 150 ? "지하층 바닥면적 합계가 150㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  const emergencyOutletRequired = ag >= 11 || (bf >= 3 && ba >= 1000);
  results.push(makeResult(categories.fireSupport, "비상콘센트설비", "", emergencyOutletRequired ? "required" : "notRequired",
    ag >= 11 ? "지상층수가 11층 이상입니다."
    : bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  results.push(makeResult(categories.fireSupport, "무선통신보조설비", "",
    ba >= 3000 || (bf >= 3 && ba >= 1000) ? "required" : "notRequired",
    ba >= 3000 ? "지하층 바닥면적 합계가 3,000㎡ 이상입니다."
    : bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  return results;
}

function buildElderlyExceptionItems(results, input) {
  const exceptionItems = [];
  const autoDetection = results.find((r) => r.name === "자동화재탐지설비");
  const emergencyAlarm = results.find((r) => r.name === "비상경보설비");
  const singleDetector = results.find((r) => r.name === "단독경보형 감지기");
  const sprinkler = results.find((r) => r.name === "스프링클러설비");
  const simpleSprinkler = results.find((r) => r.name === "간이스프링클러설비");
  const drencher = results.find((r) => r.name === "연결살수설비");
  const waterSpray = results.find((r) => r.name === "물분무등소화설비");
  const parkingCondition = input.elderlyParkingStructureArea >= 800 || input.elderlyIndoorParkingArea >= 200 || input.elderlyMechanicalParkingCapacity >= 20;

  if (sprinkler && sprinkler.status === "required" && simpleSprinkler && simpleSprinkler.status === "notRequired") {
    exceptionItems.push({ category: "설치 제외", name: "간이스프링클러설비", status: "review", reason: "스프링클러설비가 전층 설치 대상이므로 간이스프링클러설비는 제외됩니다." });
  }
  if (sprinkler && sprinkler.status === "required" && drencher && drencher.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "연결살수설비", status: "review", reason: "스프링클러설비가 설치 대상이면 연결살수설비는 설치 제외 대상입니다." });
  }
  if (autoDetection && autoDetection.status === "required" && emergencyAlarm && emergencyAlarm.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "비상경보설비", status: "review", reason: "자동화재탐지설비가 설치되면 비상경보설비는 면제 관계로 검토할 수 있습니다." });
  }
  if (autoDetection && autoDetection.status === "required" && singleDetector && singleDetector.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "단독경보형 감지기", status: "review", reason: "자동화재탐지설비가 설치되면 단독경보형 감지기는 중복 설치가 불필요합니다." });
  }
  if (waterSpray && waterSpray.status === "required" && parkingCondition) {
    exceptionItems.push({ category: "대체설비", name: "주차장 관련 스프링클러설비 대체 가능", status: "review", reason: "주차 관련 공간은 물분무등소화설비 기준이 적용되나, 대체설비로 스프링클러설비를 설치할 수 있습니다." });
  }
  if (!exceptionItems.length) {
    exceptionItems.push({ category: "안내", name: "설치 제외·대체 없음", status: "notRequired", reason: "현재 입력값 기준으로 별도 면제 또는 대체로 표시할 항목이 없습니다." });
  }
  return exceptionItems;
}

function buildElderlyRequiredItems(results, input, exceptionItems) {
  const excludedNames = new Set(exceptionItems.filter((e) => e.category === "설치 제외").map((e) => e.name));
  const parkingCondition = input.elderlyParkingStructureArea >= 800 || input.elderlyIndoorParkingArea >= 200 || input.elderlyMechanicalParkingCapacity >= 20;
  let requiredItems = results.filter((r) => r.status === "required" && !excludedNames.has(r.name));
  if (parkingCondition && input.elderlyElectricalRoomArea < 300) {
    requiredItems = requiredItems.filter((r) => r.name !== "물분무등소화설비");
    if (!requiredItems.some((r) => r.name.includes("스프링클러설비"))) {
      requiredItems.push({
        category: categories.extinguishing,
        name: "스프링클러설비(주차 관련 대체설비)",
        status: "required",
        reason: "주차 관련 공간은 물분무등소화설비 기준이 적용되나, 대체설비로 스프링클러설비를 설치할 수 있습니다.",
      });
    }
  }
  return requiredItems;
}

function evaluateMedicalFacility(input) {
  const results = [];
  const ma = input.medicalArea;
  const ta = input.medicalTotalArea;
  const ag = input.medicalAboveGroundFloors;
  const bf = input.medicalBasementFloors;
  const ba = input.medicalBasementAreaSum;
  const wl = input.medicalWindowlessArea;
  const tf = input.medicalTotalFloors;
  const sub = input.medicalSubtype;

  const isPsychiatric = sub === "psychiatricHospital";
  const isRehabilitation = sub === "rehabilitationFacility";
  const isNursing = sub === "nursingHome";
  const isGeneral = sub === "generalHospital" || sub === "hospital";

  const basementAvg = bf > 0 ? ba / bf : 0;
  const hasBasement150Plus = bf > 0 && basementAvg >= 150;
  const hasBasement300Plus = bf > 0 && basementAvg >= 300;
  const hasBasement450Plus = bf > 0 && basementAvg >= 450;
  const hasBasement1000Plus = bf > 0 && basementAvg >= 1000;
  const hasWindowless150Plus = wl >= 150;
  const hasWindowless300Plus = wl >= 300;
  const hasWindowless450Plus = wl >= 450;
  const hasWindowless1000Plus = wl >= 1000;

  // ── 소화설비 ──
  results.push(makeResult(categories.extinguishing, "소화기구", "", ta >= 33 ? "required" : "notRequired",
    ta >= 33 ? "연면적이 33㎡ 이상입니다." : "연면적이 33㎡ 미만입니다.", ""));

  const standpipeRequired = ta >= 1500 || hasBasement300Plus || hasWindowless300Plus;
  results.push(makeResult(categories.extinguishing, "옥내소화전설비", "", standpipeRequired ? "required" : "notRequired",
    ta >= 1500 ? "연면적이 1,500㎡ 이상입니다."
    : hasBasement300Plus ? "지하층 평균 바닥면적이 300㎡ 이상입니다."
    : hasWindowless300Plus ? "무창층 바닥면적이 300㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  const sprinklerRequired = ag >= 6 || ma >= 600;
  results.push(makeResult(categories.extinguishing, "스프링클러설비", "", sprinklerRequired ? "required" : "notRequired",
    ag >= 6 ? "건물 층수가 6층 이상이므로 전층 설치 대상입니다."
    : ma >= 600 ? "의료시설 사용 바닥면적이 600㎡ 이상이므로 전층 설치 대상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  let simpleSprinklerStatus = "notRequired";
  let simpleSprinklerReason = "";
  if (sprinklerRequired) {
    simpleSprinklerReason = "스프링클러설비 설치 대상이므로 간이스프링클러설비는 제외됩니다.";
  } else if (isGeneral || isNursing) {
    simpleSprinklerStatus = "required";
    simpleSprinklerReason = `${isNursing ? "요양병원" : "종합병원·병원·치과병원·한방병원"}으로서 바닥면적 합계가 600㎡ 미만이므로 간이스프링클러설비를 설치해야 합니다.`;
  } else if ((isPsychiatric || isRehabilitation) && ma >= 300) {
    simpleSprinklerStatus = "required";
    simpleSprinklerReason = `${isPsychiatric ? "정신의료기관" : "의료재활시설"}으로서 바닥면적 합계가 300㎡ 이상 600㎡ 미만이므로 간이스프링클러설비를 설치해야 합니다.`;
  } else if ((isPsychiatric || isRehabilitation) && ma < 300 && input.medicalHasGrillWindow) {
    simpleSprinklerStatus = "required";
    simpleSprinklerReason = "고정식 창살이 설치된 정신의료기관·의료재활시설로, 바닥면적 300㎡ 미만이더라도 간이스프링클러설비를 설치해야 합니다.";
  } else {
    simpleSprinklerReason = "현재 입력 기준으로는 설치 대상이 아닙니다.";
  }
  results.push(makeResult(categories.extinguishing, "간이스프링클러설비", "", simpleSprinklerStatus, simpleSprinklerReason, ""));

  const parkingWaterSprayCondition = input.medicalParkingStructureArea >= 800 || input.medicalIndoorParkingArea >= 200 || input.medicalMechanicalParkingCapacity >= 20;
  const waterSprayRequired = parkingWaterSprayCondition || input.medicalElectricalRoomArea >= 300;
  results.push(makeResult(categories.extinguishing, "물분무등소화설비", "", waterSprayRequired ? "required" : "notRequired", buildWaterSprayReason(input.medicalParkingStructureArea, input.medicalIndoorParkingArea, input.medicalMechanicalParkingCapacity, input.medicalElectricalRoomArea), ""));

  // ── 경보설비 ──
  const emergencyAlarm = ta >= 400 || hasBasement150Plus || hasWindowless150Plus;
  results.push(makeResult(categories.alarm, "비상경보설비", "", emergencyAlarm ? "required" : "notRequired",
    ta >= 400 ? "연면적이 400㎡ 이상입니다."
    : hasBasement150Plus ? "지하층 평균 바닥면적이 150㎡ 이상입니다."
    : hasWindowless150Plus ? "무창층 바닥면적이 150㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  const broadcastRequired = ta >= 3500 || ag >= 11 || bf >= 3;
  results.push(makeResult(categories.alarm, "비상방송설비", "", broadcastRequired ? "required" : "notRequired",
    ta >= 3500 ? "연면적이 3,500㎡ 이상입니다."
    : ag >= 11 ? "지상층수가 11층 이상입니다."
    : bf >= 3 ? "지하층수가 3층 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  let autoDetectionRequired = false;
  let autoDetectionReason = "현재 입력 기준으로는 설치 대상이 아닙니다.";
  if (ag >= 6) {
    autoDetectionRequired = true;
    autoDetectionReason = "건물 층수가 6층 이상이므로 전층 설치 대상입니다.";
  } else if (isNursing) {
    autoDetectionRequired = true;
    autoDetectionReason = "요양병원은 면적에 관계없이 자동화재탐지설비를 설치해야 합니다.";
  } else if (isGeneral && ma >= 600) {
    autoDetectionRequired = true;
    autoDetectionReason = "의료시설(일반) 바닥면적이 600㎡ 이상입니다.";
  } else if ((isPsychiatric || isRehabilitation) && (ma >= 300 || input.medicalHasGrillWindow)) {
    autoDetectionRequired = true;
    autoDetectionReason = ma >= 300
      ? "정신의료기관·의료재활시설로 바닥면적이 300㎡ 이상입니다."
      : "고정식 창살이 설치된 정신의료기관·의료재활시설입니다.";
  }
  results.push(makeResult(categories.alarm, "자동화재탐지설비", "", autoDetectionRequired ? "required" : "notRequired", autoDetectionReason, ""));

  results.push(makeResult(categories.alarm, "시각경보기", "", autoDetectionRequired ? "required" : "notRequired",
    autoDetectionRequired ? "자동화재탐지설비 설치 대상 의료시설에는 청각장애인을 위해 시각경보기를 함께 설치해야 합니다."
    : "자동화재탐지설비 설치 대상이 아니므로 설치 대상이 아닙니다.", ""));

  let autoDispatchStatus = "notRequired";
  let autoDispatchReason = "현재 입력 기준으로는 설치 대상이 아닙니다.";
  if (isGeneral || isNursing) {
    autoDispatchStatus = "required";
    autoDispatchReason = `${isNursing ? "요양병원" : "종합병원·병원·치과병원·한방병원"}은 면적에 관계없이 자동화재속보설비를 설치해야 합니다.`;
  } else if ((isPsychiatric || isRehabilitation) && (bf > 0 && basementAvg >= 500)) {
    autoDispatchStatus = "required";
    autoDispatchReason = "정신병원·의료재활시설로 바닥면적 합계가 500㎡ 이상인 지하층이 있습니다.";
  }
  results.push(makeResult(categories.alarm, "자동화재속보설비", "", autoDispatchStatus, autoDispatchReason, ""));

  results.push(makeResult(categories.alarm, "가스누설경보기", "", input.medicalHasGasFacility ? "required" : "notRequired",
    input.medicalHasGasFacility ? "가스시설이 설치된 의료시설입니다." : "가스시설이 없어 설치 대상이 아닙니다.", ""));

  // ── 피난구조설비 ──
  results.push(makeResult(categories.evacuation, "피난기구(구조대 등)", "", ag >= 3 ? "required" : "notRequired",
    ag >= 3 ? "의료시설은 3층 이상 10층 이하의 층에 피난기구를 설치해야 합니다."
    : "3층 이상 층이 없어 설치 대상이 아닙니다.", ""));

  const inPatientHospital = sub === "generalHospital" || sub === "hospital" || sub === "nursingHome" || sub === "psychiatricHospital";
  results.push(makeResult(categories.evacuation, "인명구조기구(방열복·공기호흡기)", "", tf >= 5 && inPatientHospital ? "required" : "notRequired",
    tf >= 5 && inPatientHospital ? "지하층 포함 층수가 5층 이상인 병원 용도로 사용하는 층에 방열복(또는 방화복) 및 공기호흡기를 비치해야 합니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  results.push(makeResult(categories.evacuation, "유도등(피난구유도등·통로유도등)", "", "required",
    "모든 의료시설에 피난구유도등, 통로유도등, 유도표지를 설치해야 합니다.", ""));

  const emergencyLightRequired = (tf >= 5 && ta >= 3000) || hasBasement450Plus || hasWindowless450Plus;
  results.push(makeResult(categories.evacuation, "비상조명등", "", emergencyLightRequired ? "required" : "notRequired",
    tf >= 5 && ta >= 3000 ? "지하층을 포함한 층수가 5층 이상이고 연면적이 3,000㎡ 이상입니다."
    : hasBasement450Plus ? "지하층 평균 바닥면적이 450㎡ 이상입니다."
    : hasWindowless450Plus ? "무창층 바닥면적이 450㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 소화용수설비 ──
  results.push(makeResult(categories.waterSupply, "상수도소화용수설비", "", ta >= 5000 ? "required" : "notRequired",
    ta >= 5000 ? "연면적이 5,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 소화활동설비 ──
  const smokeRequired = hasBasement1000Plus || hasWindowless1000Plus;
  results.push(makeResult(categories.fireSupport, "제연설비", "", smokeRequired ? "required" : "notRequired",
    smokeRequired ? "지하층 또는 무창층의 바닥면적이 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  const standpipeFireRequired = (tf >= 5 && ta >= 6000) || tf >= 7 || (bf >= 3 && ba >= 1000);
  results.push(makeResult(categories.fireSupport, "연결송수관설비", "", standpipeFireRequired ? "required" : "notRequired",
    tf >= 5 && ta >= 6000 ? "전체 층수가 5층 이상이고 연면적이 6,000㎡ 이상입니다."
    : tf >= 7 ? "지하층을 포함한 전체 층수가 7층 이상입니다."
    : bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  results.push(makeResult(categories.fireSupport, "연결살수설비", "", ba >= 150 ? "required" : "notRequired",
    ba >= 150 ? "지하층 바닥면적 합계가 150㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  const emergencyOutletRequired = ag >= 11 || (bf >= 3 && ba >= 1000);
  results.push(makeResult(categories.fireSupport, "비상콘센트설비", "", emergencyOutletRequired ? "required" : "notRequired",
    ag >= 11 ? "지상층수가 11층 이상입니다."
    : bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  results.push(makeResult(categories.fireSupport, "무선통신보조설비", "",
    ba >= 3000 || (bf >= 3 && ba >= 1000) ? "required" : "notRequired",
    ba >= 3000 ? "지하층 바닥면적 합계가 3,000㎡ 이상입니다."
    : bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다."
    : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  return results;
}

function buildMedicalExceptionItems(results, input) {
  const exceptionItems = [];
  const autoDetection = results.find((r) => r.name === "자동화재탐지설비");
  const emergencyAlarm = results.find((r) => r.name === "비상경보설비");
  const sprinkler = results.find((r) => r.name === "스프링클러설비");
  const simpleSprinkler = results.find((r) => r.name === "간이스프링클러설비");
  const drencher = results.find((r) => r.name === "연결살수설비");
  const waterSpray = results.find((r) => r.name === "물분무등소화설비");
  const parkingCondition = input.medicalParkingStructureArea >= 800 || input.medicalIndoorParkingArea >= 200 || input.medicalMechanicalParkingCapacity >= 20;

  if (sprinkler && sprinkler.status === "required" && simpleSprinkler && simpleSprinkler.status === "notRequired") {
    exceptionItems.push({ category: "설치 제외", name: "간이스프링클러설비", status: "review", reason: "스프링클러설비가 전층 설치 대상이므로 간이스프링클러설비는 제외됩니다." });
  }
  if (sprinkler && sprinkler.status === "required" && drencher && drencher.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "연결살수설비", status: "review", reason: "스프링클러설비가 설치 대상이면 연결살수설비는 설치 제외 대상입니다." });
  }
  if (autoDetection && autoDetection.status === "required" && emergencyAlarm && emergencyAlarm.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "비상경보설비", status: "review", reason: "자동화재탐지설비가 설치되면 비상경보설비는 면제 관계로 검토할 수 있습니다." });
  }
  if (waterSpray && waterSpray.status === "required" && parkingCondition) {
    exceptionItems.push({ category: "대체설비", name: "주차장 관련 스프링클러설비 대체 가능", status: "review", reason: "주차 관련 공간은 물분무등소화설비 기준이 적용되나, 대체설비로 스프링클러설비를 설치할 수 있습니다." });
  }
  if (!exceptionItems.length) {
    exceptionItems.push({ category: "안내", name: "설치 제외·대체 없음", status: "notRequired", reason: "현재 입력값 기준으로 별도 면제 또는 대체로 표시할 항목이 없습니다." });
  }
  return exceptionItems;
}

function buildMedicalRequiredItems(results, input, exceptionItems) {
  const excludedNames = new Set(exceptionItems.filter((e) => e.category === "설치 제외").map((e) => e.name));
  const parkingCondition = input.medicalParkingStructureArea >= 800 || input.medicalIndoorParkingArea >= 200 || input.medicalMechanicalParkingCapacity >= 20;
  let requiredItems = results.filter((r) => r.status === "required" && !excludedNames.has(r.name));
  if (parkingCondition && input.medicalElectricalRoomArea < 300) {
    requiredItems = requiredItems.filter((r) => r.name !== "물분무등소화설비");
    if (!requiredItems.some((r) => r.name.includes("스프링클러설비"))) {
      requiredItems.push({
        category: categories.extinguishing,
        name: "스프링클러설비(주차 관련 대체설비)",
        status: "required",
        reason: "주차 관련 공간은 물분무등소화설비 기준이 적용되나, 대체설비로 스프링클러설비를 설치할 수 있습니다.",
      });
    }
  }
  return requiredItems;
}

function buildWaterSprayReason(pStructure, pIndoor, pMechanical, eRoom) {
  if (eRoom >= 300) {
    return "전기실·발전실·변전실·전산실 바닥면적이 300㎡ 이상으로 해당 공간에만 설치해야 합니다(스프링클러설비로 대체되지 않습니다).";
  }
  if (pStructure >= 800) return "차고·주차용 건축물 연면적이 800㎡ 이상입니다.";
  if (pIndoor >= 200) return "건물 내부 차고·주차장 바닥면적이 200㎡ 이상입니다.";
  if (pMechanical >= 20) return "기계식 주차가 20대 이상입니다.";
  return "현재 입력 기준으로는 설치 대상이 아닙니다.";
}

function buildExceptionItems(results, input) {
  const exceptionItems = [];
  const autoDetection = results.find((item) => item.name === "자동화재탐지설비");
  const emergencyAlarm = results.find((item) => item.name === "비상경보설비");
  const waterSpray = results.find((item) => item.name === "물분무등소화설비");
  const sprinkler = results.find((item) => item.name === "스프링클러설비");
  const simpleSprinkler = results.find((item) => item.name === "간이스프링클러설비");
  const drencher = results.find((item) => item.name === "연결살수설비");
  const hasParkingWaterSprayCondition = input.parkingStructureArea >= 800 || input.indoorParkingArea >= 200 || input.mechanicalParkingCapacity >= 20;

  if (sprinkler && sprinkler.status === "required" && simpleSprinkler && simpleSprinkler.status === "notRequired") {
    exceptionItems.push({ category: "설치 제외", name: "간이스프링클러설비", status: "review", reason: "스프링클러설비가 전층 설치 대상이면 간이스프링클러설비는 제외 대상으로 봅니다." });
  }
  if (sprinkler && sprinkler.status === "required" && drencher && drencher.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "연결살수설비", status: "review", reason: "스프링클러설비가 설치 대상이면 연결살수설비는 설치 제외 대상으로 봅니다." });
  }
  if (autoDetection && emergencyAlarm && autoDetection.status === "required" && emergencyAlarm.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "비상경보설비", status: "review", reason: "자동화재탐지설비가 설치되면 비상경보설비는 면제 관계로 검토할 수 있습니다." });
  }
  if (waterSpray && waterSpray.status === "required" && hasParkingWaterSprayCondition) {
    exceptionItems.push({ category: "대체설비", name: "주차장 관련 스프링클러설비 대체 가능", status: "review", reason: "주차 관련 공간의 기본 기준은 물분무등소화설비이며, 그 대체설비로 해당 공간에 스프링클러설비가 설치될 수 있습니다." });
  }
  if (!exceptionItems.length) {
    exceptionItems.push({ category: "안내", name: "설치 제외·대체 없음", status: "notRequired", reason: "현재 입력값 기준으로 별도 면제 또는 대체로 표시할 항목이 없습니다." });
  }
  return exceptionItems;
}

function buildRequiredItems(results, input, exceptionItems) {
  const excludedRequiredNames = new Set(exceptionItems.filter((item) => item.category === "설치 제외").map((item) => item.name));
  const parkingWaterSprayCondition = input.parkingStructureArea >= 800 || input.indoorParkingArea >= 200 || input.mechanicalParkingCapacity >= 20;
  let requiredItems = results.filter((item) => item.status === "required" && !excludedRequiredNames.has(item.name));

  if (parkingWaterSprayCondition && input.electricalRoomArea < 300) {
    requiredItems = requiredItems.filter((item) => item.name !== "물분무등소화설비");
    if (!requiredItems.some((item) => item.name.includes("스프링클러설비"))) {
      requiredItems.push({
        category: categories.extinguishing,
        name: "스프링클러설비(주차 관련 대체설비)",
        status: "required",
        reason: "주차 관련 공간은 물분무등소화설비 기준이 적용되지만, 대체설비로 스프링클러설비를 설치할 수 있습니다.",
      });
    }
  }
  return requiredItems;
}

function getSubtypeLabel(value) {
  const labels = {
    general: "일반 근린생활시설",
    bathhouse: "목욕장",
    clinicInpatient: "입원실 있는 의원급",
    postpartum: "조산원·산후조리원",
  };
  if (value === "postpartum") {
    return `조산원·산후조리원(${state.answers.postpartumAreaRange === "under600" ? "600㎡ 미만" : "600㎡ 이상"})`;
  }
  return labels[value] || value;
}

function renderResultGroup(targetId, items, excludedNames, allowedNames) {
  const list = document.getElementById(targetId);
  const template = document.getElementById("result-item-template");
  list.innerHTML = "";
  const excluded = new Set(excludedNames || []);
  const allowed = allowedNames ? new Set(allowedNames) : null;
  // criteria-list에서는 해당 없음(notRequired) 항목, 설치 제외 항목, 좌측 목록에 없는 항목 제외
  const filtered = targetId === "criteria-list"
    ? items.filter((item) => item.status !== "notRequired" && !excluded.has(item.name) && (!allowed || allowed.has(item.name)))
    : items;
  filtered.forEach((item) => {
    const fragment = template.content.cloneNode(true);
    const status = statusMeta[item.status];
    fragment.querySelector(".result-category").textContent = item.category;
    fragment.querySelector(".result-name").textContent = item.name;
    fragment.querySelector(".result-reason").textContent = item.reason;
    const badge = fragment.querySelector(".result-status");
    badge.textContent = status.label;
    badge.classList.add(status.className);
    list.appendChild(fragment);
  });
}

function setSectionVisibility(sectionId, visible) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  section.classList.toggle("hidden", !visible);
}

function clearMultiuseSections() {
  ["multiuse-required-list", "multiuse-extra-list", "multiuse-reason-list"].forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.innerHTML = "";
  });
  setSectionVisibility("multiuse-extra-section", false);
  setSectionVisibility("open-multiuse-safety", false);
}

function renderSimpleRequiredList(items, targetId = "required-list") {
  const list = document.getElementById(targetId);
  list.innerHTML = "";
  items.forEach((item) => {
    const node = document.createElement("div");
    node.className = "facility-row";
    node.innerHTML = `<span class="fr-dot"></span><span>${item.name}</span>`;
    list.appendChild(node);
  });
}

function evaluateMultiuseFacilities(input) {
  if (!input.hasMultiuseBusiness) {
    return { requiredItems: [], extraSafetyItems: [], reasonItems: [] };
  }

  const requiredItems = [
    { category: "다중이용업소 공통", name: "소화기", status: "required", reason: "다중이용업소 공통 설치대상이며, 구획된 실마다 설치해야 합니다." },
    { category: "다중이용업소 공통", name: "비상벨설비", status: "required", reason: "다중이용업소 공통 설치대상이며, 비상벨설비 구성품 중 경종은 구획된 실마다 설치해야 합니다." },
    { category: "다중이용업소 공통", name: "휴대용 비상조명등", status: "required", reason: "다중이용업소 공통 설치대상이며, 구획된 실마다 설치해야 합니다." },
    { category: "다중이용업소 공통", name: "유도등", status: "required", reason: "다중이용업소 공통 설치대상이며, 구획된 실마다 설치해야 합니다." },
    { category: "다중이용업소 공통", name: "비상구", status: "required", reason: "다중이용업소에는 비상구를 설치해야 합니다. 다만 주된 출입구 외에 해당 영업장 내부에서 피난층 또는 지상으로 통하는 직통계단이 주된 출입구 중심선으로부터 수평거리로 영업장의 긴 변 길이의 2분의 1 이상 떨어진 위치에 별도로 설치된 경우에는 비상구를 설치하지 않을 수 있습니다." },
  ];

  const extraSafetyItems = [
    { category: "그 밖의 안전시설", name: "누전차단기", status: "required", reason: "다중이용업소 공통 안전시설로 설치해야 합니다." },
    { category: "그 밖의 안전시설", name: "방염", status: "required", reason: "다중이용업소이므로 방염을 해야 합니다." },
  ];

  const simpleSprinklerReasons = [];
  if (input.multiuseInBasement) simpleSprinklerReasons.push("지하층에 설치돼 있습니다.");
  if (input.multiuseIsSealed) simpleSprinklerReasons.push("밀폐구조 영업장입니다.");
  if (input.multiuseIsPostpartum && !input.multiuseOnGroundOrRefugeFloor) simpleSprinklerReasons.push("산후조리업에 해당합니다.");
  if (input.multiuseIsGosiwon && !input.multiuseOnGroundOrRefugeFloor) simpleSprinklerReasons.push("고시원에 해당합니다.");
  if (input.multiuseIsGunRange) simpleSprinklerReasons.push("권총사격장에 해당합니다.");

  if (simpleSprinklerReasons.length) {
    requiredItems.push({
      category: categories.extinguishing,
      name: "간이스프링클러설비",
      status: "required",
      reason: simpleSprinklerReasons.join(" "),
    });
  }

  if (input.multiuseOnSecondToTenthFloor) {
    requiredItems.push({
      category: categories.evacuation,
      name: "피난기구",
      status: "required",
      reason: "다중이용업소가 2층부터 10층 사이에 설치돼 있어 피난기구 설치대상입니다. 주로 구조대나 피난사다리를 설치하며, 법에는 완강기 설치가 가능하지만 대구에서는 완강기 설치가 불가합니다.",
    });
  }

  if (input.multiuseUsesAV) {
    requiredItems.push({
      category: categories.alarm,
      name: "자동화재탐지설비",
      status: "required",
      reason: "노래반주기 등 영상음향장치를 사용하는 영업장입니다.",
    });
    extraSafetyItems.push({
      category: "그 밖의 안전시설",
      name: "영상음향차단장치",
      status: "required",
      reason: "노래반주기 등 영상음향장치를 사용하는 영업장입니다.",
    });
  }

  if (input.multiuseHasGasFacility) {
    requiredItems.push({
      category: categories.alarm,
      name: "가스누설경보기",
      status: "required",
      reason: "가스시설을 사용하는 주방 또는 난방시설이 있습니다.",
    });
  }

  if (input.multiuseHasEvacuationRoute) {
    requiredItems.push({
      category: categories.evacuation,
      name: "피난유도선",
      status: "required",
      reason: "영업장 내부 피난통로 또는 복도가 있습니다.",
    });
  }

  if (input.multiuseIsGosiwon) {
    extraSafetyItems.push({
      category: "그 밖의 안전시설",
      name: "창문",
      status: "required",
      reason: "고시원이므로 창문을 설치해야 합니다.",
    });
  }

  const reasonItems = [...requiredItems, ...extraSafetyItems];
  return { requiredItems, extraSafetyItems, reasonItems };
}

function showExplorerCard(view) {
  questionCard.classList.toggle("hidden", view !== "question");
  resultCard.classList.toggle("hidden", view !== "main-result");
  multiuseSafetyCard.classList.toggle("hidden", view !== "multiuse-result");
}

function renderMultiuseEntryButton(input) {
  const button = document.getElementById("open-multiuse-safety");
  if (!button) return;
  const multiuse = evaluateMultiuseFacilities(input);
  button.classList.toggle("hidden", !input.hasMultiuseBusiness || (multiuse.requiredItems.length === 0 && multiuse.extraSafetyItems.length === 0));
}

function renderLodgingMultiuseEntryButton(input) {
  const button = document.getElementById("open-multiuse-safety");
  if (!button) return;
  const multiuse = evaluateLodgingMultiuseFacilities(input);
  button.classList.toggle("hidden", !input.lodgingHasMultiuseBusiness || (multiuse.requiredItems.length === 0 && multiuse.extraSafetyItems.length === 0));
}

function renderMultiuseSafetyCard(input) {
  clearMultiuseSections();
  const multiuse = evaluateMultiuseFacilities(input);
  document.getElementById("multiuse-safety-summary").innerHTML = `<div class="ib-title">다중이용업소 안전시설 기준</div>입력한 조건을 기준으로 다중이용업소에 설치해야 하는 안전시설만 별도로 정리했습니다.`;
  renderSimpleRequiredList(multiuse.requiredItems, "multiuse-required-list");
  renderSimpleRequiredList(multiuse.extraSafetyItems, "multiuse-extra-list");
  renderResultGroup("multiuse-reason-list", multiuse.reasonItems);
  setSectionVisibility("multiuse-extra-section", multiuse.extraSafetyItems.length > 0);
}

function renderLodgingMultiuseSafetyCard(input) {
  clearMultiuseSections();
  const multiuse = evaluateLodgingMultiuseFacilities(input);
  document.getElementById("multiuse-safety-summary").innerHTML = `<div class="ib-title">다중이용업소 안전시설 기준</div>입력한 조건을 기준으로 다중이용업소에 설치해야 하는 안전시설만 별도로 정리했습니다.`;
  renderSimpleRequiredList(multiuse.requiredItems, "multiuse-required-list");
  renderSimpleRequiredList(multiuse.extraSafetyItems, "multiuse-extra-list");
  renderResultGroup("multiuse-reason-list", multiuse.reasonItems);
  setSectionVisibility("multiuse-extra-section", multiuse.extraSafetyItems.length > 0);
}

function renderResults(results, input) {
  const exceptionItems = buildExceptionItems(results, input);
  const requiredItems = buildRequiredItems(results, input, exceptionItems);
  const excludedNames = exceptionItems.filter((e) => e.category === "설치 제외").map((e) => e.name);
  explorerViewState.lastInput = input;
  document.getElementById("result-summary").innerHTML = `<div class="ib-title">입력값 기준</div>${getSubtypeLabel(input.facilitySubtype)}, 연면적 ${input.totalArea}㎡, 지상 ${input.aboveGroundFloors}층, 지하 ${input.basementFloors}층`;
  renderSimpleRequiredList(requiredItems);
  renderResultGroup("criteria-list", results, excludedNames, requiredItems.map((i) => i.name));
  renderResultGroup("exception-list", exceptionItems);
  renderMultiuseEntryButton(input);
}

function renderThirdClassPre1992Results(results, input) {
  const requiredItems = results.filter((item) => item.status === "required");
  explorerViewState.lastInput = input;
  document.getElementById("result-summary").innerHTML = `<div class="ib-title">3급 근린생활시설 기준</div>${getThirdClassPeriodLabel(input.pre1992PermitRange)} / ${getThirdClassDetailLabel(input.thirdClassDetailUse)} / 연면적 ${input.totalArea}㎡ / 지상 ${input.aboveGroundFloors}층 / 지하 ${input.basementFloors}층`;
  renderSimpleRequiredList(requiredItems);
  renderResultGroup("criteria-list", results, undefined, requiredItems.map((i) => i.name));
  if (input.totalArea >= 2100) {
    document.getElementById("exception-list").innerHTML = `
      <article class="result-item">
        <div class="result-top">
          <div>
            <p class="result-category">주의</p>
            <h4 class="result-name">옥내소화전설비 대상 여부 재확인</h4>
          </div>
          <span class="result-status status-review">확인 필요</span>
        </div>
        <p class="result-reason">연면적이 2,100㎡ 이상이면 옥내소화전설비 설치대상에 해당할 수 있습니다. 옥내소화전설비가 설치되면 2급 이상 소방안전관리대상물입니다. 연면적 등 조건을 제대로 기입했는지 다시 한번 확인해주세요.</p>
      </article>
    `;
  } else {
    document.getElementById("exception-list").innerHTML = "";
  }
  renderMultiuseEntryButton(input);
}

function renderThirdClassPendingGuide(input) {
  explorerViewState.lastInput = input;
  document.getElementById("result-summary").innerHTML = `<div class="ib-title">3급 근린생활시설 기준</div>건축허가일이 1992년 7월 28일 이후인 경로의 기준은 아직 입력 전입니다.`;
  document.getElementById("required-list").innerHTML = "";
  document.getElementById("criteria-list").innerHTML = `
    <article class="result-item">
      <div class="result-top">
        <div>
          <p class="result-category">안내</p>
          <h4 class="result-name">기준 입력 대기</h4>
        </div>
        <span class="result-status status-review">확인 필요</span>
      </div>
      <p class="result-reason">3급 근린생활시설 중 1992년 7월 28일 이후 건축허가 대상의 소방시설 설치기준은 아직 입력되지 않았습니다.</p>
    </article>
  `;
  document.getElementById("exception-list").innerHTML = "";
  renderMultiuseEntryButton(input);
}

let toastTimer = null;
function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  if (toastTimer) clearTimeout(toastTimer);
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  toastTimer = setTimeout(() => {
    toast.classList.add("toast-out");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, 2800);
}

function scrollToTop() {
  const scrollEl = document.querySelector("#screen-explorer .scroll-content");
  if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
}

function moveStep(direction) {
  if (!currentStepIsValid()) {
    showToast("현재 질문의 값을 먼저 입력해 주세요.");
    return;
  }
  const activeSteps = getActiveSteps();
  state.currentStep = Math.max(0, Math.min(state.currentStep + direction, activeSteps.length - 1));
  renderCurrentStep();
  scrollToTop();
}

function showResults() {
  if (!currentStepIsValid()) {
    showToast("현재 질문의 값을 먼저 입력해 주세요.");
    return;
  }
  if (!["neighborhood", "lodging", "elderly", "medical"].includes(state.answers.occupancyType)) {
    showToast("지금은 근린생활시설, 숙박시설, 노유자시설, 의료시설만 판정할 수 있습니다. 해당 용도를 선택해 주세요.");
    return;
  }
  const input = normalizeAnswers();

  if (input.occupancyType === "lodging") {
    const results = evaluateLodgingFacility(input);
    const exceptionItems = buildLodgingExceptionItems(results, input);
    const requiredItems = buildLodgingRequiredItems(results, input, exceptionItems);
    const excludedNames = exceptionItems.filter((e) => e.category === "설치 제외").map((e) => e.name);
    explorerViewState.lastInput = input;
    document.getElementById("result-summary").innerHTML = `<div class="ib-title">입력값 기준</div>숙박시설, 연면적 ${input.lodgingTotalArea}㎡, 숙박 사용면적 ${input.lodgingArea}㎡, 지상 ${input.lodgingAboveGroundFloors}층, 지하 ${input.lodgingBasementFloors}층`;
    renderSimpleRequiredList(requiredItems);
    renderResultGroup("criteria-list", results, excludedNames, requiredItems.map((i) => i.name));
    renderResultGroup("exception-list", exceptionItems);
    renderLodgingMultiuseEntryButton(input);
    renderExtraItems(input);
    showExplorerCard("main-result");
    scrollToTop();
    return;
  }

  if (input.occupancyType === "elderly") {
    const results = evaluateElderlyFacility(input);
    const exceptionItems = buildElderlyExceptionItems(results, input);
    const requiredItems = buildElderlyRequiredItems(results, input, exceptionItems);
    const excludedNames = exceptionItems.filter((e) => e.category === "설치 제외").map((e) => e.name);
    explorerViewState.lastInput = input;
    const subtypeLabel = input.elderlySubtype === "livingFacility" ? "노유자 생활시설" : "일반 노유자시설";
    document.getElementById("result-summary").innerHTML = `<div class="ib-title">입력값 기준</div>노유자시설(${subtypeLabel}), 연면적 ${input.elderlyTotalArea}㎡, 노유자 사용면적 ${input.elderlyArea}㎡, 지상 ${input.elderlyAboveGroundFloors}층, 지하 ${input.elderlyBasementFloors}층`;
    renderSimpleRequiredList(requiredItems);
    renderResultGroup("criteria-list", results, excludedNames, requiredItems.map((i) => i.name));
    renderResultGroup("exception-list", exceptionItems);
    const button = document.getElementById("open-multiuse-safety");
    if (button) button.classList.add("hidden");
    renderExtraItems(input);
    showExplorerCard("main-result");
    scrollToTop();
    return;
  }

  if (input.occupancyType === "medical") {
    const results = evaluateMedicalFacility(input);
    const exceptionItems = buildMedicalExceptionItems(results, input);
    const requiredItems = buildMedicalRequiredItems(results, input, exceptionItems);
    const excludedNames = exceptionItems.filter((e) => e.category === "설치 제외").map((e) => e.name);
    explorerViewState.lastInput = input;
    const subtypeLabels = {
      generalHospital: "종합병원",
      hospital: "병원·치과병원·한방병원",
      nursingHome: "요양병원",
      psychiatricHospital: "정신의료기관",
      rehabilitationFacility: "의료재활시설",
    };
    const subtypeLabel = subtypeLabels[input.medicalSubtype] || "의료시설";
    document.getElementById("result-summary").innerHTML = `<div class="ib-title">입력값 기준</div>의료시설(${subtypeLabel}), 연면적 ${input.medicalTotalArea}㎡, 의료 사용면적 ${input.medicalArea}㎡, 지상 ${input.medicalAboveGroundFloors}층, 지하 ${input.medicalBasementFloors}층`;
    renderSimpleRequiredList(requiredItems);
    renderResultGroup("criteria-list", results, excludedNames, requiredItems.map((i) => i.name));
    renderResultGroup("exception-list", exceptionItems);
    const button = document.getElementById("open-multiuse-safety");
    if (button) button.classList.add("hidden");
    renderExtraItems(input);
    showExplorerCard("main-result");
    scrollToTop();
    return;
  }

  const results = evaluateNeighborhoodFacility(input);
  renderExtraItems(input);
  showExplorerCard("main-result");
  renderResults(results, input);
  scrollToTop();
}

function getFloorCount(input) {
  switch (input.occupancyType) {
    case "lodging": return input.lodgingAboveGroundFloors || 0;
    case "elderly": return input.elderlyAboveGroundFloors || 0;
    case "medical": return input.medicalAboveGroundFloors || 0;
    default: return input.aboveGroundFloors || 0;
  }
}

function renderExtraItems(input) {
  const section = document.getElementById("extra-items-section");
  const list = document.getElementById("extra-items-list");
  if (!section || !list) return;

  const items = [];

  const facilityNames = { lodging: "숙박시설", elderly: "노유자시설", medical: "의료시설" };
  const floors = getFloorCount(input);

  if (["lodging", "elderly", "medical"].includes(input.occupancyType)) {
    items.push({ name: "방염", reason: `${facilityNames[input.occupancyType]}은 방염 규정 적용 대상입니다.` });
  } else if (input.occupancyType === "neighborhood" && floors >= 11) {
    items.push({ name: "방염", reason: "11층 이상 건물은 방염 규정 적용 대상입니다." });
  }

  if (floors >= 5) {
    items.push({ name: "방화문", reason: "5층 이상 건물에 설치 대상입니다." });
    if (floors < 11) {
      items.push({ name: "피난계단", reason: "5층 이상 또는 지하 2층 이하 건물에 설치 대상입니다." });
    }
  }
  if (floors >= 11) {
    items.push({ name: "특별피난계단", reason: "11층 이상 건물에 설치 대상입니다. (피난계단 포함)" });
    items.push({ name: "비상용 승강기", reason: "11층 이상 건물에 설치 대상입니다." });
  }

  list.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "facility-row";
    row.innerHTML = `<span class="fr-dot" style="background:var(--amber);"></span><span>${item.name}</span>`;
    list.appendChild(row);
  });

  section.classList.toggle("hidden", items.length === 0);
}

function restartExplorer() {
  state.currentStep = 0;
  explorerViewState.lastInput = null;
  Object.assign(state.answers, {
    occupancyType: "neighborhood",
    facilitySubtype: "general",
    postpartumAreaRange: "under600",
    isThirdClassNeighborhood: "no",
    permitBefore1992: "no",
    pre1992PermitRange: "1982-08-07_to_1984-06-30",
    thirdClassDetailUse: "general",
    totalArea: 1600,
    neighborhoodArea: 1600,
    aboveGroundFloors: 6,
    basementFloors: 1,
    basementAreaSum: 180,
    hasWindowlessFloor: "no",
    windowlessArea: 0,
    hasLargeTargetFloor: "yes",
    firstSecondFloorArea: 0,
    indoorParkingArea: 0,
    parkingStructureArea: 0,
    mechanicalParkingCapacity: 0,
    electricalRoomArea: 0,
    has24HourStaff: "no",
    hasMultiuseBusiness: "no",
    multiuseInBasement: "no",
    multiuseIsSealed: "no",
    multiuseIsPostpartum: "no",
    multiuseIsGosiwon: "no",
    multiuseIsGunRange: "no",
    multiuseOnSecondToTenthFloor: "no",
    multiuseOnGroundOrRefugeFloor: "no",
    multiuseUsesAV: "no",
    multiuseHasGasFacility: "no",
    multiuseHasEvacuationRoute: "no",
    // 숙박시설
    lodgingArea: 450,
    lodgingTotalArea: 2000,
    lodgingAboveGroundFloors: 8,
    lodgingBasementFloors: 1,
    lodgingBasementAreaSum: 200,
    lodgingHasWindowlessFloor: "no",
    lodgingWindowlessArea: 0,
    lodgingHasLargeFloorFor1000: "no",
    lodgingHasGasFacility: "no",
    lodgingIsTouristHotel: "no",
    lodgingIndoorParkingArea: 0,
    lodgingParkingStructureArea: 0,
    lodgingMechanicalParkingCapacity: 0,
    lodgingElectricalRoomArea: 0,
    lodgingHasMultiuseBusiness: "no",
    lodgingMultiuseInBasement: "no",
    lodgingMultiuseIsSealed: "no",
    lodgingMultiuseIsPostpartum: "no",
    lodgingMultiuseIsGosiwon: "no",
    lodgingMultiuseIsGunRange: "no",
    lodgingMultiuseOnSecondToTenthFloor: "no",
    lodgingMultiuseOnGroundOrRefugeFloor: "no",
    lodgingMultiuseUsesAV: "no",
    lodgingMultiuseHasGasFacility: "no",
    lodgingMultiuseHasEvacuationRoute: "no",
    // 노유자시설
    elderlySubtype: "general",
    elderlyTotalArea: 1200,
    elderlyArea: 500,
    elderlyAboveGroundFloors: 4,
    elderlyBasementFloors: 0,
    elderlyBasementAreaSum: 0,
    elderlyHasWindowlessFloor: "no",
    elderlyWindowlessArea: 0,
    elderlyHasLargeTargetFloor: "no",
    elderlyHasGrillWindow: "no",
    elderlyHasFloor500Plus: "no",
    elderlyHas24HourStaff: "no",
    elderlyHasGasFacility: "no",
    elderlyIndoorParkingArea: 0,
    elderlyParkingStructureArea: 0,
    elderlyMechanicalParkingCapacity: 0,
    elderlyElectricalRoomArea: 0,
    // 의료시설
    medicalSubtype: "hospital",
    medicalTotalArea: 2000,
    medicalArea: 1500,
    medicalAboveGroundFloors: 5,
    medicalBasementFloors: 1,
    medicalBasementAreaSum: 300,
    medicalHasWindowlessFloor: "no",
    medicalWindowlessArea: 0,
    medicalHasGrillWindow: "no",
    medicalHasGasFacility: "no",
    medicalIndoorParkingArea: 0,
    medicalParkingStructureArea: 0,
    medicalMechanicalParkingCapacity: 0,
    medicalElectricalRoomArea: 0,
  });
  showExplorerCard("question");
  clearMultiuseSections();
  renderCurrentStep();
  scrollToTop();
}

function renderDateCalculator() {
  const root = document.getElementById("date-content");
  const prevLeftScroll = root.querySelector(".date-left")?.scrollTop ?? 0;
  const mode = CALC_MODES[state.dateCalc.mode];
  const baseDate = parseDate(state.dateCalc.baseDate);
  const modeIntroBody = mode.kind === "inspect_report"
    ? `점검완료일로부터 ${mode.days}일 이내에 소방서에 신고해야 합니다. 토요일·일요일·공휴일은 기한 계산에서 제외됩니다.`
    : (mode.introBody ?? mode.infoBody);
  const modeInfoBody = mode.kind === "inspect_report"
    ? mode.infoBody
    : mode.infoBody;
  const holidayKeys = new Set(mode.supportsHolidaySelection ? state.dateCalc.holidays : []);
  const rangeKeys = new Set();
  const appointRangeKeys = new Set();
  const reportRangeKeys = new Set();
  let deadline = null;
  let appointDeadline = null;
  let reportDeadline = null;
  let resultSection = "";
  let legendMarkup = "";
  let tableBody = mode.tableBody;
  const tableClassName = mode.kind === "noncompliance_dual"
    ? "calc-table calc-table-noncompliance"
    : "calc-table";

  if (mode.kind === "inspect_report") {
    const countedDates = addInspectReportDays(baseDate, mode.days, holidayKeys);
    countedDates.forEach((date) => rangeKeys.add(dateKey(date)));
    deadline = countedDates[countedDates.length - 1];
    resultSection = `
      <section class="calc-result">
        <div class="calc-result-label">${mode.resultLabel}</div>
        <div class="calc-result-date">${formatDate(deadline)}</div>
        <div class="calc-result-meta">기산일: ${formatDate(baseDate)} / 기준 기한: ${mode.days}일</div>
      </section>
    `;
    legendMarkup = `
      <div class="cl-item"><span class="cl-dot" style="background: transparent; border: 2px solid var(--red);"></span>선택일</div>
      <div class="cl-item"><span class="cl-dot" style="background: rgba(217, 48, 37, 0.6);"></span>산정 날짜</div>
      <div class="cl-item"><span class="cl-dot" style="background: var(--amber);"></span>마감일</div>
      <div class="cl-item"><span class="cl-dot" style="background: #cda7ff;"></span>입력 공휴일</div>
    `;
  }

  if (mode.kind === "manager_dual") {
    const appointDates = getSequentialDates(baseDate, mode.appointDays);
    appointDeadline = appointDates[appointDates.length - 1];
    const reportDates = getSequentialDates(appointDeadline, mode.reportDays);
    const rawReportDeadline = reportDates[reportDates.length - 1];
    reportDeadline = moveToNextBusinessDay(rawReportDeadline, holidayKeys);
    appointDates.forEach((date) => appointRangeKeys.add(dateKey(date)));
    reportDates.forEach((date) => reportRangeKeys.add(dateKey(date)));
    if (!sameDate(rawReportDeadline, reportDeadline)) {
      let cursor = addDays(rawReportDeadline, 1);
      while (cursor <= reportDeadline) {
        reportRangeKeys.add(dateKey(cursor));
        cursor = addDays(cursor, 1);
      }
    }
    resultSection = `
      <section class="calc-result calc-result-dual">
        <div class="calc-result-label">${mode.resultLabel}</div>
        <div class="calc-result-grid">
          <div class="calc-result-block">
            <div class="calc-result-sub">선임기한</div>
            <div class="calc-result-date calc-result-date-appoint">${formatDate(appointDeadline)}</div>
          </div>
          <div class="calc-result-block">
            <div class="calc-result-sub">선임신고기한</div>
            <div class="calc-result-date calc-result-date-report">${formatDate(reportDeadline)}</div>
          </div>
        </div>
        <div class="calc-result-meta">기산일: ${formatDate(baseDate)} / 선임 다음날부터 선임 ${mode.appointDays}일, 선임기한 종료 다음날부터 선임신고 ${mode.reportDays}일, 신고 마지막 날이 토요일·공휴일이면 다음 평일까지</div>
      </section>
    `;
    legendMarkup = `
      <div class="cl-item"><span class="cl-dot" style="background: transparent; border: 2px solid var(--red);"></span>선택일</div>
      <div class="cl-item"><span class="cl-dot" style="background: rgba(217, 48, 37, 0.6);"></span>선임기한 범위</div>
      <div class="cl-item"><span class="cl-dot" style="background: rgba(217, 48, 37, 0.22); border: 1.5px solid rgba(217, 48, 37, 0.75);"></span>선임기한</div>
      <div class="cl-item"><span class="cl-dot" style="background: rgba(66, 133, 244, 0.22); border: 1.5px solid rgba(66, 133, 244, 0.8);"></span>선임신고 범위</div>
      <div class="cl-item"><span class="cl-dot" style="background: rgba(66, 133, 244, 0.22); border: 1.5px solid rgba(66, 133, 244, 0.85);"></span>선임신고기한</div>
    `;
  }

  if (mode.kind === "noncompliance_dual") {
    const actionType = mode.actionTypes[state.dateCalc.noncomplianceType] ?? mode.actionTypes.repair;
    const completionDates = getInclusiveDates(baseDate, actionType.completionDays);
    const completionDeadline = completionDates[completionDates.length - 1];
    const reportDates = addInspectReportDays(completionDeadline, mode.reportDays, holidayKeys);
    appointDeadline = completionDeadline;
    reportDeadline = reportDates[reportDates.length - 1];
    completionDates.forEach((date) => appointRangeKeys.add(dateKey(date)));
    reportDates.forEach((date) => reportRangeKeys.add(dateKey(date)));
    tableBody = [
      ["10일<br><span style='color:var(--text-dim);font-size:11px'>수리·정비</span>", "감지기 탈락·불량, 위치표시등 또는 유도등 조도 불량, 수신기 예비전원 불량, 호스·노즐 교체, 소화기 수량 부족 등"],
      ["20일<br><span style='color:var(--text-dim);font-size:11px'>전부·일부 교체</span>", "수신기 교체, 소화펌프 교체 등"],
    ];
    resultSection = `
      <section class="calc-result calc-result-dual">
        <div class="calc-result-label">${mode.resultLabel}</div>
        <div class="calc-result-grid">
          <div class="calc-result-block">
            <div class="calc-result-sub">이행완료기한</div>
            <div class="calc-result-date calc-result-date-appoint">${formatDate(appointDeadline)}</div>
          </div>
          <div class="calc-result-block">
            <div class="calc-result-sub">완료신고기한</div>
            <div class="calc-result-date calc-result-date-report">${formatDate(reportDeadline)}</div>
          </div>
        </div>
        <div class="calc-result-meta">보고일: ${formatDate(baseDate)} / 자체점검 실시결과 보고일부터 ${actionType.completionDays}일 이내 이행,<br> 조치완료 다음날부터 주말·공휴일을 제외한 10일 신고</div>
      </section>
    `;
    legendMarkup = `
      <div class="cl-item"><span class="cl-dot" style="background: transparent; border: 2px solid var(--red);"></span>선택일</div>
      <div class="cl-item"><span class="cl-dot" style="background: rgba(217, 48, 37, 0.6);"></span>이행완료 범위</div>
      <div class="cl-item"><span class="cl-dot" style="background: rgba(217, 48, 37, 0.22); border: 1.5px solid rgba(217, 48, 37, 0.75);"></span>이행완료기한</div>
      <div class="cl-item"><span class="cl-dot" style="background: rgba(66, 133, 244, 0.22); border: 1.5px solid rgba(66, 133, 244, 0.8);"></span>완료신고 범위</div>
      <div class="cl-item"><span class="cl-dot" style="background: rgba(66, 133, 244, 0.22); border: 1.5px solid rgba(66, 133, 244, 0.85);"></span>완료신고기한</div>
      <div class="cl-item"><span class="cl-dot" style="background: #cda7ff;"></span>입력 공휴일</div>
    `;
  }

  const viewYear = state.dateCalc.viewYear;
  const viewMonth = state.dateCalc.viewMonth;
  const firstDay = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
  const cells = [];

  for (let i = 0; i < 42; i += 1) {
    let date;
    let otherMonth = false;
    if (i < startWeekday) {
      date = new Date(viewYear, viewMonth - 1, prevMonthDays - startWeekday + i + 1);
      otherMonth = true;
    } else if (i >= startWeekday + daysInMonth) {
      date = new Date(viewYear, viewMonth + 1, i - (startWeekday + daysInMonth) + 1);
      otherMonth = true;
    } else {
      date = new Date(viewYear, viewMonth, i - startWeekday + 1);
    }

    const classes = ["cal-day"];
    const key = formatInputDate(date);
    if (otherMonth) classes.push("other-month");
    if (date.getDay() === 0) classes.push("sun");
    if (date.getDay() === 6) classes.push("sat");
    if (sameDate(date, baseDate)) classes.push("selected");
    if (rangeKeys.has(key)) classes.push("in-range");
    if (deadline && sameDate(date, deadline)) classes.push("deadline");
    if (appointRangeKeys.has(key)) classes.push("appoint-range");
    if (reportRangeKeys.has(key)) classes.push("report-range");
    if (appointDeadline && sameDate(date, appointDeadline)) classes.push("appoint-deadline");
    if (reportDeadline && sameDate(date, reportDeadline)) classes.push("report-deadline");
    if (mode.supportsHolidaySelection && holidayKeys.has(key)) classes.push("holiday");

    cells.push(`<button class="${classes.join(" ")}" type="button" data-date="${key}">${date.getDate()}</button>`);
  }

  root.innerHTML = `
    <div class="date-mode-header">
      <div class="calc-mode-tabs">
        ${Object.entries(CALC_MODES).map(([key, cfg]) => `<button class="calc-mode-btn${key === state.dateCalc.mode ? " active" : ""}" type="button" data-mode="${key}">${cfg.short}</button>`).join("")}
      </div>
    </div>
    <div class="date-layout">
      <div class="date-left">
        <section class="calc-card">
          <h3 class="calc-title">${mode.label}</h3>
          <p class="calc-copy">${modeIntroBody}</p>
          ${mode.kind === "noncompliance_dual" ? `
          <div class="calc-mode-tabs calc-mode-tabs-detail">
            ${Object.entries(mode.actionTypes).map(([key, cfg]) => `
              <div class="calc-mode-option">
                <button class="calc-mode-btn calc-mode-btn-info${key === state.dateCalc.noncomplianceType ? " active" : ""}" type="button" data-noncompliance-type="${key}">
                  <span class="calc-mode-btn-label">${cfg.label}</span>
                  <span class="calc-mode-info" tabindex="0" aria-label="${cfg.tooltip}" data-floating-tooltip="${cfg.tooltip}">i</span>
                </button>
              </div>
            `).join("")}
          </div>
          ` : ""}
          ${mode.supportsHolidaySelection ? `
          <div class="holiday-toggle">
            <button class="holiday-toggle-btn${state.dateCalc.selectMode === "base" ? " active" : ""}" type="button" data-select-mode="base">기산일 선택</button>
            <button class="holiday-toggle-btn${state.dateCalc.selectMode === "holiday" ? " active" : ""}" type="button" data-select-mode="holiday">입력 공휴일 지정</button>
          </div>
          <p class="calc-copy">${mode.kind === "noncompliance_dual" ? "완료신고기한 계산에 반영할 공휴일이 있으면 입력 공휴일 지정 버튼을 눌러 추가해주세요. 이행완료기한에는 반영되지 않습니다." : "기간 내에 공휴일이 있으면 입력 공휴일 지정 버튼을 눌러서 수동으로 공휴일을 추가해주세요."}</p>
          ` : ""}
          <div class="cal-wrap">
            <div class="cal-nav">
              <button class="cal-nav-btn" type="button" data-cal-nav="-1">‹</button>
              <div class="cal-month">${viewYear}년 ${viewMonth + 1}월</div>
              <button class="cal-nav-btn" type="button" data-cal-nav="1">›</button>
            </div>
            <div class="cal-dow">
              <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
            </div>
            <div class="cal-grid">${cells.join("")}</div>
          </div>
          <div class="cal-legend">
            ${legendMarkup}
          </div>
          <div class="calc-form-row">
            <label>${mode.baseDateLabel}</label>
            <input id="calc-base-date" class="calc-input" type="date" value="${state.dateCalc.baseDate}">
          </div>
        </section>
      </div>
      <div class="date-right">
        ${resultSection || '<div class="date-empty">📅<br>날짜를 선택하면<br>결과가 여기에 표시됩니다.</div>'}
        ${resultSection ? '<button id="add-to-home-btn" class="btn btn-primary add-to-home-btn" type="button">📌 제출기한 메인화면에 표시</button>' : ""}
        <section class="calc-card">
          <div class="info-box ${mode.infoTone}"><div class="ib-title">${mode.infoTitle}</div>${modeInfoBody}</div>
          <p class="section-label">${mode.tableTitle}</p>
          <div class="calc-table-wrap">
            <table class="${tableClassName}">
              <thead><tr>${mode.tableHead.map((head) => `<th>${head}</th>`).join("")}</tr></thead>
              <tbody>${tableBody.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
            </table>
          </div>
          ${(mode.extraSections || []).map((sec) => `
            <p class="section-label" style="margin-top:16px;${sec.titleColor === 'red' ? 'color:var(--red-soft);' : ''}">${sec.title}</p>
            <div class="info-box blue" style="margin-bottom:0;">${sec.content}</div>
          `).join("")}
        </section>
      </div>
    </div>
  `;

  const addToHomeBtn = root.querySelector("#add-to-home-btn");
  if (addToHomeBtn) {
    addToHomeBtn.addEventListener("click", () => {
      showAddReminderModal({
        type: state.dateCalc.mode,
        baseDate: state.dateCalc.baseDate,
        deadline: formatInputDate(deadline || appointDeadline),
        secondDeadline: reportDeadline ? formatInputDate(reportDeadline) : null,
      });
    });
  }

  const newLeft = root.querySelector(".date-left");
  if (newLeft && prevLeftScroll > 0) newLeft.scrollTop = prevLeftScroll;

  root.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.dateCalc.mode = button.dataset.mode;
      state.dateCalc.selectMode = "base";
      renderDateCalculator();
    });
  });
  root.querySelectorAll("[data-noncompliance-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.dateCalc.noncomplianceType = button.dataset.noncomplianceType;
      renderDateCalculator();
    });
  });
  initFloatingTooltips(root);
  root.querySelectorAll("[data-select-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.dateCalc.selectMode = button.dataset.selectMode;
      renderDateCalculator();
    });
  });
  root.querySelectorAll("[data-cal-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      state.dateCalc.viewMonth += Number(button.dataset.calNav);
      if (state.dateCalc.viewMonth > 11) {
        state.dateCalc.viewMonth = 0;
        state.dateCalc.viewYear += 1;
      }
      if (state.dateCalc.viewMonth < 0) {
        state.dateCalc.viewMonth = 11;
        state.dateCalc.viewYear -= 1;
      }
      renderDateCalculator();
    });
  });
  root.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      if (mode.supportsHolidaySelection && state.dateCalc.selectMode === "holiday") {
        const clicked = button.dataset.date;
        const index = state.dateCalc.holidays.indexOf(clicked);
        if (index >= 0) state.dateCalc.holidays.splice(index, 1);
        else state.dateCalc.holidays.push(clicked);
      } else {
        state.dateCalc.baseDate = button.dataset.date;
        const selected = parseDate(button.dataset.date);
        state.dateCalc.viewYear = selected.getFullYear();
        state.dateCalc.viewMonth = selected.getMonth();
      }
      renderDateCalculator();
    });
  });
  root.querySelector("#calc-base-date").addEventListener("input", (event) => {
    state.dateCalc.baseDate = event.target.value;
    const selected = parseDate(event.target.value);
    state.dateCalc.viewYear = selected.getFullYear();
    state.dateCalc.viewMonth = selected.getMonth();
    renderDateCalculator();
  });
}

function getFloatingTooltipElement() {
  let tooltip = document.getElementById("floating-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "floating-tooltip";
    tooltip.className = "floating-tooltip hidden";
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function positionFloatingTooltip(anchor, tooltip) {
  const anchorRect = anchor.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const gap = 10;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = anchorRect.right + gap;
  if (left + tooltipRect.width > viewportWidth - 12) {
    left = anchorRect.left - tooltipRect.width - gap;
  }
  left = Math.max(12, Math.min(left, viewportWidth - tooltipRect.width - 12));

  let top = anchorRect.top + (anchorRect.height / 2) - (tooltipRect.height / 2);
  top = Math.max(12, Math.min(top, viewportHeight - tooltipRect.height - 12));

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function initFloatingTooltips(root) {
  const tooltip = getFloatingTooltipElement();
  const hideTooltip = () => {
    tooltip.classList.add("hidden");
    tooltip.textContent = "";
  };

  root.querySelectorAll("[data-floating-tooltip]").forEach((trigger) => {
    const showTooltip = () => {
      tooltip.textContent = trigger.dataset.floatingTooltip;
      tooltip.classList.remove("hidden");
      positionFloatingTooltip(trigger, tooltip);
    };

    trigger.addEventListener("mouseenter", showTooltip);
    trigger.addEventListener("focus", showTooltip);
    trigger.addEventListener("mouseleave", hideTooltip);
    trigger.addEventListener("blur", hideTooltip);
  });
}

// ── 작동·종합 대상 판독기 ──────────────────────────────────────────

const inspectionNodes = {
  start: {
    title: "스프링클러가 설치돼있나요?",
    help: "주차장에만 설치된 스프링클러설비도 포함됩니다.",
    options: [
      { label: "예", next: { result: "comprehensive", reason: "스프링클러설비가 설치된 특정소방대상물로, 종합정밀점검 대상입니다." } },
      { label: "아니오", next: "multiuseCheck" },
    ],
  },
  multiuseCheck: {
    title: "다중이용업소가 설치된 특정소방대상물인가요?",
    help: "특정소방대상물 내에 다중이용업소 한개만 들어가 있어도 '예'를 눌러주세요.",
    options: [
      { label: "예", next: "multiuse" },
      { label: "아니오", next: "remainingInspectionItems" },
    ],
  },
  remainingInspectionItems: {
    title: "다음 항목을 확인하세요",
    help: "그 외 해당되는 요소가 있는지 확인해주세요.",
    options: [
      { label: "물분무등소화설비가 설치되어 있나요?", next: "waterSpray" },
      { label: "터널인가요?", next: "tunnel" },
      { label: "공공기관인가요?", next: "publicOrg" },
      { label: "해당 없음", next: { result: "operational", reason: "종합정밀점검 대상 조건에 해당하지 않습니다." } },
    ],
  },
  tunnel: {
    title: "제연설비가 설치되어 있나요?",
    help: "제연설비가 없는 터널은 해당되지 않습니다.",
    options: [
      { label: "예", next: { result: "comprehensive", reason: "터널에 제연설비가 설치된 경우 종합정밀점검 대상에 해당합니다." } },
      { label: "아니오", next: { result: "operational", reason: "제연설비가 설치되지 않은 터널은 종합정밀점검 대상에 해당하지 않습니다." } },
    ],
  },
  waterSpray: {
    title: "연면적이 5,000㎡ 이상인가요?",
    help: "호스릴(hose reel) 방식만 단독으로 설치한 경우와 제조소등은 제외됩니다.",
    options: [
      { label: "예", next: { result: "comprehensive", reason: "물분무등소화설비[호스릴 방식 제외]가 설치된 특정소방대상물은 연면적 5,000㎡ 이상일 때 종합정밀점검 대상에 해당합니다." } },
      { label: "아니오", next: { result: "operational", reason: "물분무등소화설비가 설치되어 있더라도 연면적 5,000㎡ 미만이면 종합정밀점검 대상에 해당하지 않습니다." } },
    ],
  },
  multiuse: {
    title: "특정소방대상물의 연면적이 2,000㎡ 이상인가요?",
    help: "해당 업종: 시행령 제2조제1호나목, 제2호(비디오물소극장업 제외)·제6호·제7호·제7호의2·제7호의5. 이 외 업종은 해당되지 않습니다.",
    options: [
      { label: "예", next: { result: "comprehensive", reason: "다중이용업소법 시행령 해당 업종의 영업장이 설치된 특정소방대상물은 연면적 2,000㎡ 이상일 때 종합정밀점검 대상에 해당합니다." } },
      { label: "아니오", next: { result: "operational", reason: "해당 다중이용업소가 설치되어 있더라도 연면적 2,000㎡ 미만이면 종합정밀점검 대상에 해당하지 않습니다." } },
    ],
  },
  publicOrg: {
    title: "연면적이 1,000㎡ 이상인가요?",
    help: "소방대가 근무하는 공공기관은 제외됩니다.",
    options: [
      { label: "예", next: "publicOrgFacility" },
      { label: "아니오", next: { result: "operational", reason: "연면적 1,000㎡ 미만의 공공기관은 종합정밀점검 대상에 해당하지 않습니다." } },
    ],
  },
  publicOrgFacility: {
    title: "옥내소화전설비 또는 자동화재탐지설비가 설치되어 있나요?",
    help: "두 설비 모두 없는 경우에는 해당되지 않습니다. 하나라도 있으면 다음 단계에서 확인합니다.",
    options: [
      { label: "예", next: { result: "comprehensive", reason: "공공기관의 소방안전관리에 관한 규정 제2조에 따른 공공기관으로, 연면적 1,000㎡ 이상이고 옥내소화전설비 또는 자동화재탐지설비가 설치된 경우 종합정밀점검 대상에 해당합니다." } },
      { label: "아니오", next: { result: "operational", reason: "연면적 조건은 충족하나 옥내소화전설비·자동화재탐지설비가 모두 미설치되어 종합정밀점검 대상에 해당하지 않습니다." } },
    ],
  },
};

const inspectionState = {
  history: [],
  current: "start",
};

function renderInspection() {
  const root = document.getElementById("inspection-content");
  const current = inspectionState.current;
  const currentStep = inspectionState.history.length + 1;

  if (current && typeof current === "object") {
    const isComp = current.result === "comprehensive";
    root.innerHTML = "";
    const card = document.createElement("div");
    card.className = "wq-card";
    card.innerHTML = `
      <div class="insp-result ${isComp ? "insp-comprehensive" : "insp-operational"}">
        <div class="ir-badge">${isComp ? "종합정밀점검" : "작동기능점검"}</div>
        <div class="ir-title">${isComp ? "종합정밀점검 대상입니다." : "작동기능점검 대상입니다."}</div>
        <p class="ir-reason">${current.reason}</p>
      </div>
    `;
    if (inspectionState.history.length > 0) {
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "btn btn-ghost";
      backBtn.style.width = "100%";
      backBtn.style.marginBottom = "8px";
      backBtn.textContent = "이전으로";
      backBtn.addEventListener("click", inspectionBack);
      card.appendChild(backBtn);
    }
    const restartBtn = document.createElement("button");
    restartBtn.type = "button";
    restartBtn.className = "btn-restart";
    restartBtn.textContent = "처음부터 다시";
    restartBtn.addEventListener("click", inspectionRestart);
    card.appendChild(restartBtn);
    root.appendChild(card);
    return;
  }

  const node = inspectionNodes[current];
  if (!node) return;

  root.innerHTML = "";
  const card = document.createElement("div");
  card.className = "wq-card";

  const kicker = document.createElement("p");
  kicker.className = "wq-label";
  kicker.textContent = `STEP ${currentStep}`;
  card.appendChild(kicker);

  const title = document.createElement("h2");
  title.className = "wq-title";
  title.textContent = node.title;
  card.appendChild(title);

  const help = document.createElement("p");
  help.className = "wq-sub";
  help.textContent = node.help;
  card.appendChild(help);

  const list = document.createElement("div");
  list.className = "choice-list";
  node.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-button";
    btn.innerHTML = `<strong>${option.label}</strong>${option.sub ? `<span>${option.sub}</span>` : ""}`;
    btn.addEventListener("click", () => inspectionSelect(option));
    list.appendChild(btn);
  });
  card.appendChild(list);

  if (inspectionState.history.length > 0) {
    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn btn-ghost";
    backBtn.style.cssText = "width:100%;margin-top:12px;";
    backBtn.textContent = "이전으로";
    backBtn.addEventListener("click", inspectionBack);
    card.appendChild(backBtn);
  }

  root.appendChild(card);
}

function inspectionSelect(option) {
  inspectionState.history.push(inspectionState.current);
  inspectionState.current = option.next;
  renderInspection();
  const scrollEl = document.querySelector("#screen-inspection .scroll-content");
  if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
}

function inspectionBack() {
  if (inspectionState.history.length > 0) {
    inspectionState.current = inspectionState.history.pop();
    renderInspection();
  }
}

function inspectionRestart() {
  inspectionState.history = [];
  inspectionState.current = "start";
  renderInspection();
}

// ── 다중이용업소 판독기 ──────────────────────────────────────────

const multiuseNodes = {
  // ── 1단계: 업종 대분류 ──
  start: {
    title: "업종 분류를 선택하세요",
    help: "옥외에서만 영업하는 경우는 다중이용업소에서 제외됩니다.",
    options: [
      { label: "식품접객업", sub: "음식점·카페·주점·공유주방 등", next: "cat_food" },
      { label: "영상·게임", sub: "영화관·비디오방·PC방·오락실 등", next: "cat_game" },
      { label: "교육", sub: "학원", next: "academy_capacity" },
      { label: "위생·건강", sub: "목욕장·산후조리원·안마시술소", next: "cat_health" },
      { label: "숙박·공간 임대", sub: "고시원·전화방·수면방", next: "cat_lodging" },
      { label: "여가·스포츠·문화", sub: "노래방·방탈출·키즈카페·스크린골프·만화카페 등", next: "cat_leisure" },
      { label: "위 분류에 해당하지 않음", sub: "백화점·병원·헬스장·학교 등", next: "cat_not_multiuse" },
    ],
  },

  cat_not_multiuse: {
    title: "해당하는 용도를 선택하세요",
    help: "사람들이 많이 출입하는 대표적인 용도입니다.",
    options: [
      { label: "백화점", sub: "", next: { result: "no", type: "", law: "", reason: "백화점은 다중이용업소에 해당하지 않습니다. 단, 해당 대상물 내에 다중이용업소가 있을 수도 있습니다. 예시) 홈플러스 내 푸드코트 또는 키즈카페, 병원 내 산후조리원 등" } },
      { label: "대형 마트", sub: "", next: { result: "no", type: "", law: "", reason: "대형 마트는 다중이용업소에 해당하지 않습니다. 단, 해당 대상물 내에 다중이용업소가 있을 수도 있습니다. 예시) 홈플러스 내 푸드코트 또는 키즈카페, 병원 내 산후조리원 등" } },
      { label: "교회", sub: "", next: { result: "no", type: "", law: "", reason: "교회는 다중이용업소에 해당하지 않습니다. 단, 해당 대상물 내에 다중이용업소가 있을 수도 있습니다. 예시) 홈플러스 내 푸드코트 또는 키즈카페, 병원 내 산후조리원 등" } },
      { label: "지하철역", sub: "", next: { result: "no", type: "", law: "", reason: "지하철역은 다중이용업소에 해당하지 않습니다. 단, 해당 대상물 내에 다중이용업소가 있을 수도 있습니다. 예시) 홈플러스 내 푸드코트 또는 키즈카페, 병원 내 산후조리원 등" } },
      { label: "병원", sub: "", next: { result: "no", type: "", law: "", reason: "병원은 다중이용업소에 해당하지 않습니다. 단, 해당 대상물 내에 다중이용업소가 있을 수도 있습니다. 예시) 홈플러스 내 푸드코트 또는 키즈카페, 병원 내 산후조리원 등" } },
      { label: "헬스장", sub: "", next: { result: "no", type: "", law: "", reason: "헬스장은 다중이용업소에 해당하지 않습니다. 단, 해당 대상물 내에 다중이용업소가 있을 수도 있습니다. 예시) 홈플러스 내 푸드코트 또는 키즈카페, 병원 내 산후조리원 등" } },
      { label: "수영장", sub: "", next: { result: "no", type: "", law: "", reason: "수영장은 다중이용업소에 해당하지 않습니다. 단, 해당 대상물 내에 다중이용업소가 있을 수도 있습니다. 예시) 홈플러스 내 푸드코트 또는 키즈카페, 병원 내 산후조리원 등" } },
      { label: "전통시장", sub: "", next: { result: "no", type: "", law: "", reason: "전통시장은 다중이용업소에 해당하지 않습니다. 단, 해당 대상물 내에 다중이용업소가 있을 수도 있습니다. 예시) 홈플러스 내 푸드코트 또는 키즈카페, 병원 내 산후조리원 등" } },
      { label: "예식장", sub: "", next: { result: "no", type: "", law: "", reason: "예식장은 다중이용업소에 해당하지 않습니다. 단, 해당 대상물 내에 다중이용업소가 있을 수도 있습니다. 예시) 홈플러스 내 푸드코트 또는 키즈카페, 병원 내 산후조리원 등" } },
      { label: "전시장", sub: "", next: { result: "no", type: "", law: "", reason: "전시장은 다중이용업소에 해당하지 않습니다. 단, 해당 대상물 내에 다중이용업소가 있을 수도 있습니다. 예시) 홈플러스 내 푸드코트 또는 키즈카페, 병원 내 산후조리원 등" } },
      { label: "학교", sub: "", next: { result: "no", type: "", law: "", reason: "학교는 다중이용업소에 해당하지 않습니다. 단, 해당 대상물 내에 다중이용업소가 있을 수도 있습니다. 예시) 홈플러스 내 푸드코트 또는 키즈카페, 병원 내 산후조리원 등" } },
      { label: "위 항목에도 해당하지 않음", sub: "", next: { result: "no", type: "", law: "", reason: "선택한 업종은 「다중이용업소의 안전관리에 관한 특별법 시행령」에서 정한 다중이용업소 업종에 해당하지 않습니다." } },
    ],
  },

  // ── 2단계: 세부 업종 ──
  cat_food: {
    title: "어떤 식품접객업인가요?",
    help: "",
    options: [
      { label: "휴게음식점 · 제과점 · 일반음식점", sub: "카페·베이커리·식당 등", next: "food_basement" },
      { label: "단란주점 · 유흥주점", sub: "주류 제공 유흥시설", next: { result: "yes", type: "단란주점·유흥주점", law: "시행령 제2조제1호나목", reason: "단란주점영업과 유흥주점영업은 면적·층수 조건 없이 다중이용업소에 해당합니다." } },
      { label: "공유주방 운영업", sub: "여러 사업자가 공동으로 사용하는 주방을 운영하는 영업", next: "shared_basement" },
    ],
  },
  cat_game: {
    title: "어떤 영상·게임 업종인가요?",
    help: "",
    options: [
      { label: "영화상영관", sub: "극장", next: { result: "yes", type: "영화상영관", law: "시행령 제2조제2호", reason: "영화상영관은 다중이용업소에 해당합니다." } },
      { label: "비디오물감상실업 · 비디오물소극장업 · 복합영상물제공업", sub: "비디오방 등", next: { result: "yes", type: "비디오물감상실업·비디오물소극장업·복합영상물제공업", law: "시행령 제2조제2호", reason: "비디오물감상실업, 비디오물소극장업, 복합영상물제공업은 다중이용업소에 해당합니다." } },
      { label: "게임제공업 · 인터넷컴퓨터게임시설제공업", sub: "PC방·오락실 등", next: "game_complex" },
      { label: "복합유통게임제공업", sub: "게임과 다른 영업을 복합 운영", next: { result: "yes", type: "복합유통게임제공업", law: "시행령 제2조제5호", reason: "복합유통게임제공업은 층수·출입구 조건에 관계없이 다중이용업소에 해당합니다." } },
    ],
  },
  cat_health: {
    title: "어떤 위생·건강 업종인가요?",
    help: "",
    options: [
      { label: "목욕장업 (찜질방·황토방·맥반석방 등)", sub: "열기·원적외선 이용 발한시설을 갖춘 목욕장", next: "sauna_capacity" },
      { label: "목욕장업 (일반 목욕탕)", sub: "맥반석·황토·옥 등을 직접 또는 간접 가열해 발생한 열기·원적외선으로 땀을 낼 수 있는 시설을 갖춘 목욕장", next: { result: "yes", type: "목욕장업(일반 목욕탕)", law: "시행령 제2조제4호나목", reason: "개인 위생처리 공간(세면·탈의 등 시설)을 갖춘 일반 목욕탕은 다중이용업소에 해당합니다." } },
      { label: "산후조리업", sub: "「모자보건법」 제2조제10호에 따른 산후조리업", next: { result: "yes", type: "산후조리업", law: "시행령 제2조제7호", reason: "산후조리업은 다중이용업소에 해당합니다." } },
      { label: "안마시술소", sub: "「의료법」 제82조제4항에 따른 안마시술소", next: { result: "yes", type: "안마시술소", law: "시행령 제2조제7호의5", reason: "안마시술소는 다중이용업소에 해당합니다." } },
    ],
  },
  cat_lodging: {
    title: "어떤 숙박·공간 임대 업종인가요?",
    help: "",
    options: [
      { label: "고시원업", sub: "구획된 실 안에 학습·숙박 또는 숙식을 제공하는 영업", next: { result: "yes", type: "고시원업", law: "시행령 제2조제7호의2", reason: "고시원업은 다중이용업소에 해당합니다." } },
      { label: "전화방 · 화상대화방업", sub: "구획된 실에 전화·모니터 등 대화 시설을 갖춘 영업", next: { result: "yes", type: "전화방·화상대화방업", law: "시행규칙 별표 1의2 제1호", reason: "전화방·화상대화방업은 다중이용업소에 해당합니다." } },
      { label: "수면방업", sub: "구획된 실에 침대·간이침대 등 휴식 시설을 갖춘 영업", next: { result: "yes", type: "수면방업", law: "시행규칙 별표 1의2 제2호", reason: "수면방업은 다중이용업소에 해당합니다." } },
    ],
  },
  cat_leisure: {
    title: "어떤 여가·스포츠·문화 업종인가요?",
    help: "",
    options: [
      { label: "노래연습장업", sub: "노래방·코인노래방 등", next: { result: "yes", type: "노래연습장업", law: "시행령 제2조제6호", reason: "노래연습장업은 다중이용업소에 해당합니다." } },
      { label: "콜라텍업", sub: "주류 판매 없는 댄스홀", next: { result: "yes", type: "콜라텍업", law: "시행규칙 별표 1의2 제3호", reason: "콜라텍업은 다중이용업소에 해당합니다." } },
      { label: "방탈출카페업", sub: "제한 시간 내에 방을 탈출하는 놀이 형태의 영업", next: { result: "yes", type: "방탈출카페업", law: "시행규칙 별표 1의2 제4호", reason: "방탈출카페업은 다중이용업소에 해당합니다." } },
      { label: "키즈카페업", sub: "실내 공간에서 어린이에게 놀이를 제공하는 영업", next: { result: "yes", type: "키즈카페업", law: "시행규칙 별표 1의2 제5호", reason: "키즈카페업은 다중이용업소에 해당합니다." } },
      { label: "만화카페업 · 만화방", sub: "다수의 도서를 갖춘 음식점·열람공간 운영 영업", next: "manga_area" },
      { label: "권총사격장 (실내)", sub: "실내사격장에 한정 (종합사격장 내 설치 포함)", next: { result: "yes", type: "권총사격장(실내)", law: "시행령 제2조제7호의3", reason: "실내 권총사격장은 다중이용업소에 해당합니다." } },
      { label: "가상체험 체육시설업", sub: "실내에 1개 이상의 구획된 실을 만들어 운동이 가능한 시설", next: "virtual_sports_type" },
    ],
  },

  virtual_sports_type: {
    title: "어떤 가상체험 체육시설업인가요?",
    help: "",
    options: [
      { label: "스크린 골프장", sub: "구획된 실에서 골프 운동이 가능한 시설", next: { result: "yes", type: "가상체험 체육시설업", law: "시행령 제2조제7호의4", reason: "스크린 골프장은 다중이용업소에 해당합니다." } },
      { label: "스크린 야구장", sub: "구획된 실에서 야구 체험을 제공하는 시설", next: { result: "no", type: "", law: "", reason: "스크린 야구장은 현재 다중이용업소 대상인 가상체험 체육시설업에 해당하지 않습니다." } },
      { label: "스크린 풋살, 족구, 양궁 등", sub: "골프 외 다른 종목의 가상체험 체육시설", next: { result: "no", type: "", law: "", reason: "스크린 풋살, 족구, 양궁 등은 현재 다중이용업소 대상인 가상체험 체육시설업에 해당하지 않습니다." } },
    ],
  },

  // ── 휴게음식점·제과점·일반음식점 ──
  food_basement: {
    title: "영업장이 지하층에 있나요?",
    help: "지하층 여부에 따라 면적 기준이 달라집니다. (지하층: 66㎡ 이상 / 그 외: 100㎡ 이상)",
    options: [
      { label: "예 (지하층)", next: "food_area_b" },
      { label: "아니오 (지상층)", next: "food_area_g" },
    ],
  },
  food_area_b: {
    title: "영업장 바닥면적 합계가 66㎡ 이상인가요?",
    help: "영업장으로 사용하는 바닥면적의 합계 기준입니다.",
    options: [
      { label: "예 (66㎡ 이상)", next: { result: "yes", type: "휴게음식점·제과점·일반음식점", law: "시행령 제2조제1호가목", reason: "지하층 영업장으로 바닥면적 합계가 66㎡ 이상이므로 다중이용업소에 해당합니다." } },
      { label: "아니오 (66㎡ 미만)", next: { result: "no", type: "", law: "", reason: "지하층 영업장이나 바닥면적 합계가 66㎡ 미만이므로 다중이용업소에 해당하지 않습니다." } },
    ],
  },
  food_area_g: {
    title: "영업장 바닥면적 합계가 100㎡ 이상인가요?",
    help: "영업장으로 사용하는 바닥면적의 합계 기준입니다.",
    options: [
      { label: "예 (100㎡ 이상)", next: "food_complex" },
      { label: "아니오 (100㎡ 미만)", next: { result: "no", type: "", law: "", reason: "바닥면적 합계가 100㎡ 미만이므로 다중이용업소에 해당하지 않습니다." } },
    ],
  },
  food_complex: {
    title: "내부계단으로 연결된 복층구조 영업장인가요?",
    help: "복층구조(내부계단 연결)이면 층수·출입구 조건에 관계없이 다중이용업소에 해당합니다.",
    options: [
      { label: "예 (복층 + 내부계단 연결)", info: "하나의 영업장이 2개 층에 걸쳐 있고, 층 사이를 영업장 내부 계단으로 오르내리는 구조입니다.\n예) 1층과 2층이 모두 같은 음식점이고, 손님이 내부 계단으로 2층을 이용하는 구조", next: { result: "yes", type: "휴게음식점·제과점·일반음식점", law: "시행령 제2조제1호가목", reason: "내부계단으로 연결된 복층구조 영업장은 층수·출입구 제외 규정이 적용되지 않으므로 다중이용업소에 해당합니다." } },
      { label: "아니오 (단층 또는 외부계단)", next: "food_floor" },
    ],
  },
  food_floor: {
    title: "영업장이 지상 1층 또는 지상과 직접 접하는 층에 있나요?",
    help: "반지하·필로티 등 지면과 직접 맞닿는 층도 '지상과 직접 접하는 층'에 해당할 수 있습니다.",
    options: [
      { label: "예 (지상 1층 또는 지상 직접 접하는 층)", next: "food_entrance" },
      { label: "아니오 (2층 이상 또는 기타 층)", next: { result: "yes", type: "휴게음식점·제과점·일반음식점", law: "시행령 제2조제1호가목", reason: "지상 1층·지상 직접 접하는 층이 아닌 곳에 영업장이 있으므로 다중이용업소에 해당합니다." } },
    ],
  },
  food_entrance: {
    title: "영업장의 주된 출입구가 건물 외부 지면과 직접 연결되나요?",
    help: "내부 복도·로비를 거치지 않고 외부 지면으로 바로 나갈 수 있는 경우입니다.",
    options: [
      { label: "예 (외부 지면과 직접 연결)", next: { result: "no", type: "", law: "시행령 제2조제1호가목 단서", reason: "지상 1층 또는 지상과 직접 접하는 층에 있고 주된 출입구가 건물 외부 지면과 직접 연결되어 있어 다중이용업소 적용에서 제외됩니다." } },
      { label: "아니오 (내부 통로 경유)", next: { result: "yes", type: "휴게음식점·제과점·일반음식점", law: "시행령 제2조제1호가목", reason: "주된 출입구가 건물 외부 지면과 직접 연결되지 않으므로 다중이용업소에 해당합니다." } },
    ],
  },

  // ── 공유주방 운영업 (食품접객업 동일 구조) ──
  shared_basement: {
    title: "공유주방 영업장이 지하층에 있나요?",
    help: "지하층 여부에 따라 면적 기준이 달라집니다. (지하층: 66㎡ 이상 / 그 외: 100㎡ 이상)",
    options: [
      { label: "예 (지하층)", next: "shared_area_b" },
      { label: "아니오 (지상층)", next: "shared_area_g" },
    ],
  },
  shared_area_b: {
    title: "영업장 바닥면적 합계가 66㎡ 이상인가요?",
    help: "",
    options: [
      { label: "예 (66㎡ 이상)", next: { result: "yes", type: "공유주방 운영업", law: "시행령 제2조제1호의2", reason: "지하층 공유주방으로 바닥면적 합계 66㎡ 이상이므로 다중이용업소에 해당합니다." } },
      { label: "아니오 (66㎡ 미만)", next: { result: "no", type: "", law: "", reason: "바닥면적 합계가 66㎡ 미만이므로 다중이용업소에 해당하지 않습니다." } },
    ],
  },
  shared_area_g: {
    title: "영업장 바닥면적 합계가 100㎡ 이상인가요?",
    help: "",
    options: [
      { label: "예 (100㎡ 이상)", next: "shared_complex" },
      { label: "아니오 (100㎡ 미만)", next: { result: "no", type: "", law: "", reason: "바닥면적 합계가 100㎡ 미만이므로 다중이용업소에 해당하지 않습니다." } },
    ],
  },
  shared_complex: {
    title: "내부계단으로 연결된 복층구조 영업장인가요?",
    help: "",
    options: [
      { label: "예 (복층 + 내부계단 연결)", info: "하나의 영업장이 2개 층에 걸쳐 있고, 층 사이를 영업장 내부 계단으로 오르내리는 구조입니다.\n예) 1층과 2층이 모두 같은 공유주방이고, 내부 계단으로 연결된 구조", next: { result: "yes", type: "공유주방 운영업", law: "시행령 제2조제1호의2", reason: "내부계단으로 연결된 복층구조 영업장은 층수·출입구 제외 규정이 적용되지 않으므로 다중이용업소에 해당합니다." } },
      { label: "아니오", next: "shared_floor" },
    ],
  },
  shared_floor: {
    title: "영업장이 지상 1층 또는 지상과 직접 접하는 층에 있나요?",
    help: "",
    options: [
      { label: "예", next: "shared_entrance" },
      { label: "아니오", next: { result: "yes", type: "공유주방 운영업", law: "시행령 제2조제1호의2", reason: "지상 1층·지상 직접 접하는 층이 아닌 층에 있으므로 다중이용업소에 해당합니다." } },
    ],
  },
  shared_entrance: {
    title: "영업장의 주된 출입구가 건물 외부 지면과 직접 연결되나요?",
    help: "",
    options: [
      { label: "예 (외부 지면과 직접 연결)", next: { result: "no", type: "", law: "시행령 제2조제1호의2 단서", reason: "지상 1층 또는 지상과 직접 접하는 층에 있고 주된 출입구가 건물 외부 지면과 직접 연결되어 다중이용업소 적용에서 제외됩니다." } },
      { label: "아니오 (내부 통로 경유)", next: { result: "yes", type: "공유주방 운영업", law: "시행령 제2조제1호의2", reason: "주된 출입구가 건물 외부 지면과 직접 연결되지 않으므로 다중이용업소에 해당합니다." } },
    ],
  },

  // ── 학원 ──
  academy_capacity: {
    title: "학원 수용인원이 몇 명인가요?",
    help: "「소방시설 설치 및 관리에 관한 법률 시행령」 별표 7에 따라 산정한 수용인원 기준입니다.",
    options: [
      { label: "300명 이상", next: { result: "yes", type: "학원", law: "시행령 제2조제3호가목", reason: "수용인원이 300명 이상이므로 다중이용업소에 해당합니다." } },
      { label: "100명 이상 300명 미만", next: "academy_sub" },
      { label: "100명 미만", next: { result: "no", type: "", law: "", reason: "수용인원이 100명 미만이므로 다중이용업소에 해당하지 않습니다." } },
    ],
  },
  academy_sub: {
    title: "다음 중 해당하는 항목이 있나요?",
    help: "하나라도 해당하면 추가 확인이 필요합니다. (단, 방화구획으로 분리된 경우 제외 가능)",
    options: [
      { label: "같은 건물에 기숙사가 함께 있음", next: "academy_firewall" },
      { label: "같은 건물에 학원이 2개 이상 있고, 합산 수용인원이 300명 이상", next: "academy_firewall" },
      { label: "같은 건물에 다른 다중이용업소가 함께 있음", next: "academy_firewall" },
      { label: "해당 없음", next: { result: "no", type: "", law: "", reason: "수용인원 100~300명 미만이고 부가 조건(기숙사·복수 학원·다중이용업소 혼재)에 해당하지 않으므로 다중이용업소에 해당하지 않습니다." } },
    ],
  },
  academy_firewall: {
    title: "학원 사용 부분과 다른 용도 부분이 방화구획으로 구분되어 있나요?",
    help: "「건축법 시행령」 제46조에 따른 방화구획으로 나누어진 경우에는 다중이용업소 적용에서 제외됩니다.",
    options: [
      { label: "예 (방화구획으로 구분)", next: { result: "no", type: "", law: "시행령 제2조제3호나목 단서", reason: "학원 사용 부분과 다른 용도 부분이 방화구획으로 구분되어 있어 다중이용업소 적용에서 제외됩니다." } },
      { label: "아니오 (방화구획 없음)", next: { result: "yes", type: "학원", law: "시행령 제2조제3호나목", reason: "수용인원 100~300명 미만이나 부가 조건(기숙사·복수 학원·다중이용업소 혼재)에 해당하고 방화구획으로 구분되어 있지 않으므로 다중이용업소에 해당합니다." } },
    ],
  },

  // ── 목욕장업 (찜질방) ──
  sauna_capacity: {
    title: "찜질·발한 시설 부분의 수용인원이 100명 이상인가요?",
    help: "물로 목욕할 수 있는 시설 부분의 수용인원은 제외하고 계산합니다.",
    options: [
      { label: "예 (100명 이상)", next: { result: "yes", type: "목욕장업(찜질방·황토방 등)", law: "시행령 제2조제4호가목", reason: "열기·원적외선 이용 발한시설의 수용인원이 100명 이상이므로 다중이용업소에 해당합니다." } },
      { label: "아니오 (100명 미만)", next: { result: "no", type: "", law: "", reason: "발한시설 부분의 수용인원이 100명 미만이므로 다중이용업소에 해당하지 않습니다." } },
    ],
  },

  // ── 게임제공업·인터넷컴퓨터게임시설제공업 ──
  game_complex: {
    title: "내부계단으로 연결된 복층구조 영업장인가요?",
    help: "복층구조(내부계단 연결)이면 층수·출입구 조건에 관계없이 다중이용업소에 해당합니다.",
    options: [
      { label: "예 (복층 + 내부계단 연결)", info: "하나의 영업장이 2개 층에 걸쳐 있고, 층 사이를 영업장 내부 계단으로 오르내리는 구조입니다.\n예) 1층과 2층이 모두 같은 PC방이고, 내부 계단으로 2층을 이용하는 구조", next: { result: "yes", type: "게임제공업·인터넷컴퓨터게임시설제공업", law: "시행령 제2조제5호", reason: "내부계단으로 연결된 복층구조 영업장은 층수·출입구 제외 규정이 적용되지 않으므로 다중이용업소에 해당합니다." } },
      { label: "아니오 (단층 또는 외부계단)", next: "game_floor" },
    ],
  },
  game_floor: {
    title: "영업장이 지상 1층 또는 지상과 직접 접하는 층에 있나요?",
    help: "",
    options: [
      { label: "예 (지상 1층 또는 지상 직접 접하는 층)", next: "game_entrance" },
      { label: "아니오 (2층 이상 또는 지하층 등)", next: { result: "yes", type: "게임제공업·인터넷컴퓨터게임시설제공업", law: "시행령 제2조제5호", reason: "지상 1층·지상 직접 접하는 층이 아닌 층에 있으므로 다중이용업소에 해당합니다." } },
    ],
  },
  game_entrance: {
    title: "영업장의 주된 출입구가 건물 외부 지면과 직접 연결되나요?",
    help: "",
    options: [
      { label: "예 (외부 지면과 직접 연결)", next: { result: "no", type: "", law: "시행령 제2조제5호 단서", reason: "지상 1층 또는 지상과 직접 접하는 층에 있고 주된 출입구가 건물 외부 지면과 직접 연결되어 있어 다중이용업소 적용에서 제외됩니다." } },
      { label: "아니오 (내부 통로 경유)", next: { result: "yes", type: "게임제공업·인터넷컴퓨터게임시설제공업", law: "시행령 제2조제5호", reason: "주된 출입구가 건물 외부 지면과 직접 연결되지 않으므로 다중이용업소에 해당합니다." } },
    ],
  },

  // ── 만화카페 ──
  manga_area: {
    title: "영업장 바닥면적 합계가 50㎡ 이상인가요?",
    help: "50㎡ 미만인 경우는 만화카페업 적용에서 제외됩니다.",
    options: [
      { label: "예 (50㎡ 이상)", next: "manga_type" },
      { label: "아니오 (50㎡ 미만)", next: { result: "no", type: "", law: "", reason: "영업장 바닥면적 합계가 50㎡ 미만이므로 다중이용업소에 해당하지 않습니다." } },
    ],
  },
  manga_type: {
    title: "도서 대여·판매만 하는 영업인가요?",
    help: "단순히 도서를 대여하거나 판매만 하는 경우는 만화카페업에서 제외됩니다.",
    options: [
      { label: "예 (도서 대여·판매만)", next: { result: "no", type: "", law: "", reason: "도서 대여·판매만 하는 영업은 만화카페업에 해당하지 않아 다중이용업소 적용에서 제외됩니다." } },
      { label: "아니오 (음식 제공·열람공간 운영·구획된 실 설치 등)", next: { result: "yes", type: "만화카페업", law: "시행규칙 별표 1의2 제6호", reason: "50㎡ 이상이고 단순 대여·판매 외 음식 제공이나 열람공간·구획된 실 운영 등을 하므로 다중이용업소에 해당합니다." } },
    ],
  },
};

const multiuseState = {
  history: [],
  current: "start",
};

function renderMultiuse() {
  const root = document.getElementById("multiuse-content");
  const current = multiuseState.current;
  const currentStep = multiuseState.history.length + 1;

  if (current && typeof current === "object") {
    const isYes = current.result === "yes";
    root.innerHTML = "";
    const card = document.createElement("div");
    card.className = "wq-card";
    card.innerHTML = `
      <div class="insp-result ${isYes ? "insp-comprehensive" : "insp-operational"}">
        <div class="ir-badge">${isYes ? "다중이용업소 해당" : "해당 없음"}</div>
        <div class="ir-title">${isYes ? "다중이용업소에 해당합니다." : "다중이용업소에 해당하지 않습니다."}</div>
        ${current.type ? `<div class="mu-type">${current.type}</div>` : ""}
        <p class="ir-reason">${current.reason}</p>
        ${current.law ? `<div class="mu-law">${current.law}</div>` : ""}
      </div>
    `;
    if (multiuseState.history.length > 0) {
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "btn btn-ghost";
      backBtn.style.cssText = "width:100%;margin-bottom:8px;";
      backBtn.textContent = "이전으로";
      backBtn.addEventListener("click", multiuseBack);
      card.appendChild(backBtn);
    }
    const restartBtn = document.createElement("button");
    restartBtn.type = "button";
    restartBtn.className = "btn-restart";
    restartBtn.textContent = "처음부터 다시";
    restartBtn.addEventListener("click", multiuseRestart);
    card.appendChild(restartBtn);
    root.appendChild(card);
    return;
  }

  const node = multiuseNodes[current];
  if (!node) return;

  root.innerHTML = "";
  const card = document.createElement("div");
  card.className = "wq-card";

  const kicker = document.createElement("p");
  kicker.className = "wq-label";
  kicker.textContent = `STEP ${currentStep}`;
  card.appendChild(kicker);

  const title = document.createElement("h2");
  title.className = "wq-title";
  title.textContent = node.title;
  card.appendChild(title);

  if (node.help) {
    const help = document.createElement("p");
    help.className = "wq-sub";
    help.textContent = node.help;
    card.appendChild(help);
  }

  const list = document.createElement("div");
  list.className = "choice-list";

  node.options.forEach((option) => {
    if (option.groupLabel !== undefined) {
      const groupEl = document.createElement("p");
      groupEl.className = "wq-group-label";
      groupEl.textContent = option.groupLabel;
      list.appendChild(groupEl);
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-button";
    if (option.info) {
      const labelWrap = document.createElement("div");
      labelWrap.className = "choice-label-wrap";
      const strong = document.createElement("strong");
      strong.textContent = option.label;
      const infoBtn = document.createElement("span");
      infoBtn.className = "calc-mode-info";
      infoBtn.textContent = "i";
      infoBtn.setAttribute("data-floating-tooltip", option.info);
      infoBtn.addEventListener("click", (e) => e.stopPropagation());
      labelWrap.appendChild(strong);
      labelWrap.appendChild(infoBtn);
      btn.appendChild(labelWrap);
      if (option.sub) {
        const span = document.createElement("span");
        span.textContent = option.sub;
        btn.appendChild(span);
      }
    } else {
      btn.innerHTML = `<strong>${option.label}</strong>${option.sub ? `<span>${option.sub}</span>` : ""}`;
    }
    btn.addEventListener("click", () => multiuseSelect(option));
    list.appendChild(btn);
  });

  card.appendChild(list);

  if (multiuseState.history.length > 0) {
    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn btn-ghost";
    backBtn.style.cssText = "width:100%;margin-top:12px;";
    backBtn.textContent = "이전으로";
    backBtn.addEventListener("click", multiuseBack);
    card.appendChild(backBtn);
  }

  root.appendChild(card);
  initFloatingTooltips(card);
}

function multiuseSelect(option) {
  multiuseState.history.push(multiuseState.current);
  multiuseState.current = option.next;
  renderMultiuse();
  const scrollEl = document.querySelector("#screen-multiuse .scroll-content");
  if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
}

function multiuseBack() {
  if (multiuseState.history.length > 0) {
    multiuseState.current = multiuseState.history.pop();
    renderMultiuse();
  }
}

function multiuseRestart() {
  multiuseState.history = [];
  multiuseState.current = "start";
  renderMultiuse();
}

// ─────────────────────────────────────────────────────────────────────────────

document.getElementById("open-explorer").addEventListener("click", () => {
  showScreen("explorer");
  restartExplorer();
});
document.getElementById("open-date-calculator").addEventListener("click", () => {
  showScreen("date");
  renderDateCalculator();
});
document.getElementById("open-inspection-decoder").addEventListener("click", () => {
  inspectionRestart();
  showScreen("inspection");
});
document.getElementById("open-multiuse-decoder").addEventListener("click", () => {
  multiuseRestart();
  showScreen("multiuse");
});
document.getElementById("back-from-multiuse").addEventListener("click", () => showScreen("home"));

// ── 수용인원 계산기 ──────────────────────────────────────────

const occupancyState = {
  step: "category",  // "category" | "lodging_sub" | "assembly_sub" | "input"
  type: "lodging_bed",
  values: {},
};

function getOccupancyBackStep(type) {
  if (["lodging_bed", "lodging_no_bed"].includes(type)) return "lodging_sub";
  if (["assembly_free", "assembly_fixed", "assembly_bench"].includes(type)) return "assembly_sub";
  return "category";
}

const occupancyTypes = [
  { key: "lodging_bed",       label: "침대 있는 숙박시설",       desc: "종사자 수 + 침대 수(2인용은 2개로 산정)" },
  { key: "lodging_no_bed",    label: "침대 없는 숙박시설",        desc: "종사자 수 + 숙박 바닥면적 ÷ 3㎡" },
  { key: "classroom",         label: "강의실·교무실·상담실·실습실·휴게실", desc: "바닥면적 ÷ 1.9㎡" },
  { key: "assembly_free",     label: "강당·문화집회·운동·종교시설 (자유석)", desc: "바닥면적 ÷ 4.6㎡" },
  { key: "assembly_fixed",    label: "강당·문화집회·운동·종교시설 (고정 의자)", desc: "의자 수" },
  { key: "assembly_bench",    label: "강당·문화집회·운동·종교시설 (긴 의자)", desc: "의자 너비 × 개수 ÷ 0.45m" },
  { key: "other",             label: "그 밖의 특정소방대상물",     desc: "바닥면적 ÷ 3㎡" },
];

function calcOccupancy(type, vals) {
  const n = (v) => parseFloat(v) || 0;
  switch (type) {
    case "lodging_bed":
      return Math.round(n(vals.staff) + n(vals.singleBeds) + n(vals.doubleBeds) * 2);
    case "lodging_no_bed":
      return Math.round(n(vals.staff) + n(vals.area) / 3);
    case "classroom":
      return Math.round(n(vals.area) / 1.9);
    case "assembly_free":
      return Math.round(n(vals.area) / 4.6);
    case "assembly_fixed":
      return Math.round(n(vals.seats));
    case "assembly_bench":
      return Math.round((n(vals.benchWidth) * n(vals.benchCount || 1)) / 0.45);
    case "other":
      return Math.round(n(vals.area) / 3);
    default:
      return 0;
  }
}

function getOccupancyFields(type) {
  switch (type) {
    case "lodging_bed":
      return [
        { key: "staff",       label: "종사자 수 (명)",        placeholder: "예: 5",   unit: "명" },
        { key: "singleBeds",  label: "1인용 침대 수 (개)",    placeholder: "예: 10",  unit: "개" },
        { key: "doubleBeds",  label: "2인용 침대 수 (개)",    placeholder: "예: 5",   unit: "개" },
      ];
    case "lodging_no_bed":
      return [
        { key: "staff",  label: "종사자 수 (명)",           placeholder: "예: 3",    unit: "명" },
        { key: "area",   label: "숙박시설 바닥면적 합계 (㎡)", placeholder: "예: 120", unit: "㎡" },
      ];
    case "classroom":
    case "assembly_free":
    case "other":
      return [
        { key: "area", label: "바닥면적 합계 (㎡)", placeholder: "예: 200", unit: "㎡" },
      ];
    case "assembly_fixed":
      return [
        { key: "seats", label: "고정 의자 수 (개)", placeholder: "예: 150", unit: "개" },
      ];
    case "assembly_bench":
      return [
        { key: "benchWidth", label: "긴 의자 1개의 정면 너비 (m)", placeholder: "예: 5", unit: "m" },
        { key: "benchCount", label: "긴 의자 개수 (개)", placeholder: "예: 10", unit: "개" },
      ];
    default:
      return [];
  }
}

function renderOccupancyCalculator() {
  const root = document.getElementById("occupancy-content");

  if (occupancyState.step === "category") {
    root.innerHTML = `
      <section class="wq-card occ-full-card">
        <p class="wq-label">STEP 1</p>
        <h2 class="wq-title">용도 선택</h2>
        <p class="wq-sub">산정 방식이 다른 용도를 먼저 선택하세요.</p>
        <div class="occ-category-list">
          <button class="choice-button" data-occ-cat="lodging"><strong>숙박시설</strong><span>호텔·모텔·여관 등 — 침대 유무에 따라 산정 방식이 다릅니다</span></button>
          <button class="choice-button" data-occ-cat="classroom"><strong>강의실·교무실·상담실·실습실·휴게실</strong><span>바닥면적 ÷ 1.9㎡</span></button>
          <button class="choice-button" data-occ-cat="assembly"><strong>강당·문화집회·운동·종교시설</strong><span>좌석 형태에 따라 산정 방식이 다릅니다</span></button>
          <button class="choice-button" data-occ-cat="other"><strong>그 밖의 특정소방대상물</strong><span>바닥면적 ÷ 3㎡</span></button>
        </div>
      </section>
    `;
    root.querySelectorAll("[data-occ-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.occCat;
        if (cat === "lodging") {
          occupancyState.step = "lodging_sub";
        } else if (cat === "assembly") {
          occupancyState.step = "assembly_sub";
        } else {
          occupancyState.step = "input";
          occupancyState.type = cat === "classroom" ? "classroom" : "other";
          occupancyState.values = {};
        }
        renderOccupancyCalculator();
      });
    });
    return;
  }

  if (occupancyState.step === "lodging_sub") {
    root.innerHTML = `
      <section class="wq-card occ-full-card">
        <p class="wq-label">STEP 2</p>
        <h2 class="wq-title">숙박시설</h2>
        <p class="wq-sub">침대 여부에 따라 산정 방식이 달라집니다.</p>
        <div class="occ-category-list">
          <button class="choice-button" data-occ-type="lodging_bed"><strong>침대가 있는 숙박시설</strong><span>종사자 수 + 침대 수 (2인용은 2개로 산정)</span></button>
          <button class="choice-button" data-occ-type="lodging_no_bed"><strong>침대가 없는 숙박시설</strong><span>종사자 수 + 숙박 바닥면적 ÷ 3㎡</span></button>
        </div>
        <button class="btn btn-ghost" style="width:100%;margin-top:12px;" data-occ-back>← 이전으로</button>
      </section>
    `;
    root.querySelectorAll("[data-occ-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        occupancyState.type = btn.dataset.occType;
        occupancyState.step = "input";
        occupancyState.values = {};
        renderOccupancyCalculator();
      });
    });
    root.querySelector("[data-occ-back]").addEventListener("click", () => {
      occupancyState.step = "category";
      renderOccupancyCalculator();
    });
    return;
  }

  if (occupancyState.step === "assembly_sub") {
    root.innerHTML = `
      <section class="wq-card occ-full-card">
        <p class="wq-label">STEP 2</p>
        <h2 class="wq-title">강당·문화집회·운동·종교시설</h2>
        <p class="wq-sub">좌석 형태를 선택하세요.</p>
        <div class="occ-category-list">
          <button class="choice-button" data-occ-type="assembly_free"><strong>자유석</strong><span>바닥면적 ÷ 4.6㎡</span></button>
          <button class="choice-button" data-occ-type="assembly_fixed"><strong>고정 의자</strong><span>의자 수</span></button>
          <button class="choice-button" data-occ-type="assembly_bench"><strong>긴 의자</strong><span>의자 너비 × 개수 ÷ 0.45m</span></button>
        </div>
        <button class="btn btn-ghost" style="width:100%;margin-top:12px;" data-occ-back>← 이전으로</button>
      </section>
    `;
    root.querySelectorAll("[data-occ-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        occupancyState.type = btn.dataset.occType;
        occupancyState.step = "input";
        occupancyState.values = {};
        renderOccupancyCalculator();
      });
    });
    root.querySelector("[data-occ-back]").addEventListener("click", () => {
      occupancyState.step = "category";
      renderOccupancyCalculator();
    });
    return;
  }

  // step === "input"
  const type = occupancyState.type;
  const typeInfo = occupancyTypes.find((t) => t.key === type);
  const fields = getOccupancyFields(type);
  const fieldValues = occupancyState.values || {};
  const inputStep = ["lodging_bed", "lodging_no_bed", "assembly_free", "assembly_fixed", "assembly_bench"].includes(type) ? 3 : 2;

  root.innerHTML = `
    <section class="wq-card occ-full-card">
      <p class="wq-label">STEP ${inputStep}</p>
      <h2 class="wq-title">${typeInfo.label}</h2>
      <p class="wq-sub">${typeInfo.desc}<br><span style="font-size:11px;color:var(--text-dim);">※ 복도·계단·화장실 바닥면적은 포함하지 않습니다.</span></p>
      ${fields.map((f) => `
        <div class="calc-form-row">
          <label>${f.label}</label>
          <input class="calc-input" type="number" min="0" step="0.1" placeholder="${f.placeholder}" data-occ-field="${f.key}" value="${fieldValues[f.key] ?? ""}">
        </div>
      `).join("")}
      <button class="btn btn-ghost" style="width:100%;margin-top:14px;" data-occ-back>← 이전으로</button>
    </section>
  `;

  root.querySelector("[data-occ-back]").addEventListener("click", () => {
    occupancyState.step = getOccupancyBackStep(type);
    renderOccupancyCalculator();
  });

  root.querySelectorAll("[data-occ-field]").forEach((input) => {
    input.addEventListener("input", () => {
      if (!occupancyState.values) occupancyState.values = {};
      occupancyState.values[input.dataset.occField] = input.value;
      const fields2 = getOccupancyFields(occupancyState.type);
      const allFilled = fields2.every((f) => {
        const v = occupancyState.values[f.key];
        return v !== undefined && v !== "";
      });
      const resultEl = root.querySelector(".calc-result");
      if (allFilled) {
        const newResult = calcOccupancy(occupancyState.type, occupancyState.values);
        if (resultEl) {
          resultEl.querySelector(".calc-result-date").textContent = `${newResult.toLocaleString()} 명`;
        } else {
          const currentTypeInfo = occupancyTypes.find((t) => t.key === occupancyState.type);
          const newResultEl = document.createElement("section");
          newResultEl.className = "calc-result";
          newResultEl.innerHTML = `<div class="calc-result-label">산정 결과</div><div class="calc-result-date">${newResult.toLocaleString()} 명</div><div class="calc-result-meta">${currentTypeInfo.label} 기준 법정 수용인원입니다.<br>소수점 이하는 반올림합니다.</div>`;
          root.appendChild(newResultEl);
        }
      } else if (resultEl) {
        resultEl.remove();
      }
    });
  });
}

screens.occupancy = document.getElementById("screen-occupancy");
document.getElementById("open-occupancy-calculator").addEventListener("click", () => {
  occupancyState.step = "category";
  occupancyState.type = "lodging_bed";
  occupancyState.values = {};
  renderOccupancyCalculator();
  showScreen("occupancy");
});
document.getElementById("back-from-occupancy").addEventListener("click", () => showScreen("home"));
document.getElementById("back-from-inspection").addEventListener("click", () => showScreen("home"));
document.getElementById("back-from-explorer").addEventListener("click", () => showScreen("home"));
document.getElementById("back-from-date").addEventListener("click", () => showScreen("home"));
document.getElementById("back-from-guide").addEventListener("click", () => showScreen("home"));
document.getElementById("open-guide").addEventListener("click", () => showScreen("guide"));
document.getElementById("prev-step").addEventListener("click", () => moveStep(-1));
document.getElementById("next-step").addEventListener("click", () => {
  const activeSteps = getActiveSteps();
  const currentStep = activeSteps[state.currentStep];
  if (currentStep?.key === "hasMultiuseBusiness" && state.answers.hasMultiuseBusiness === "no") {
    showResults();
    return;
  }
  if (currentStep?.key === "lodgingHasMultiuseBusiness" && state.answers.lodgingHasMultiuseBusiness === "no") {
    showResults();
    return;
  }
  if (state.currentStep === activeSteps.length - 1) showResults();
  else moveStep(1);
});
document.getElementById("open-multiuse-safety").addEventListener("click", () => {
  if (!explorerViewState.lastInput) return;
  const input = explorerViewState.lastInput;
  if (input.occupancyType === "lodging") {
    renderLodgingMultiuseSafetyCard(input);
  } else {
    renderMultiuseSafetyCard(input);
  }
  showExplorerCard("multiuse-result");
  scrollToTop();
});
document.getElementById("back-to-main-result").addEventListener("click", () => {
  if (explorerViewState.lastInput) {
    const input = explorerViewState.lastInput;
    if (input.occupancyType === "lodging") {
      renderLodgingMultiuseEntryButton(input);
    } else {
      renderMultiuseEntryButton(input);
    }
  }
  showExplorerCard("main-result");
  scrollToTop();
});
document.getElementById("restart-explorer").addEventListener("click", restartExplorer);
document.getElementById("restart-explorer-from-multiuse").addEventListener("click", restartExplorer);

renderCurrentStep();

// ── Reminder System ──

const REMINDERS_KEY = "fire_safety_reminders";

function loadReminders() {
  try { return JSON.parse(localStorage.getItem(REMINDERS_KEY) || "[]"); }
  catch { return []; }
}

function persistReminders(reminders) {
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

function deleteReminderById(id) {
  persistReminders(loadReminders().filter((r) => r.id !== id));
  renderHomeReminders();
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseDate(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

const REMINDER_TYPE_LABELS = {
  inspect_report: "자체점검",
  fire_safety_manager: "소방안전관리자 선임",
  fire_safety_assistant_manager: "소방안전관리보조자 선임",
  hazardous_material_manager: "위험물안전관리자 선임",
  noncompliance_action: "부적합 조치기한",
};

const REMINDER_BASE_LABELS = {
  inspect_report: "점검완료일",
  fire_safety_manager: "해임·퇴직일",
  fire_safety_assistant_manager: "해임·퇴직일",
  hazardous_material_manager: "해임·퇴직일",
  noncompliance_action: "보고일",
};

function renderHomeReminders() {
  const container = document.getElementById("home-reminders");
  if (!container) return;

  const reminders = loadReminders();

  if (reminders.length === 0) {
    container.innerHTML = `
      <div class="reminder-panel">
        <div class="reminder-panel-header">
          <span class="reminder-panel-title">📌 제출기한 알림판</span>
        </div>
        <div class="reminder-empty">날짜 계산기에서 결과를 확인한 후<br>'메인화면에 표시' 버튼으로<br>추가할 수 있습니다.</div>
      </div>`;
    return;
  }

  const sorted = [...reminders].sort((a, b) => {
    const da = new Date(a.secondDeadline || a.deadline);
    const db = new Date(b.secondDeadline || b.deadline);
    return da - db;
  });

  const cards = sorted.map((r) => {
    const finalDeadline = r.secondDeadline || r.deadline;
    const remaining = daysUntil(finalDeadline);
    const isUrgent = remaining >= 0 && remaining <= 7;
    const isOverdue = remaining < 0;

    let warningHtml = "";
    if (isOverdue) {
      warningHtml = `<div class="reminder-card-warning">⚠ 기한 초과 (${Math.abs(remaining)}일 경과)</div>`;
    } else if (isUrgent) {
      warningHtml = `<div class="reminder-card-warning">⚠ D-${remaining} 기한 임박!</div>`;
    }

    const baseLabel = REMINDER_BASE_LABELS[r.type] || "시작일";
    let datesHtml = `<div class="reminder-date-row"><span class="reminder-date-label">${baseLabel}</span><span class="reminder-date-val">${formatDate(parseDate(r.baseDate))}</span></div>`;

    if (r.secondDeadline) {
      const label1 = r.type === "noncompliance_action" ? "이행완료기한" : "선임기한";
      const label2 = r.type === "noncompliance_action" ? "완료신고기한" : "선임신고기한";
      datesHtml += `<div class="reminder-date-row"><span class="reminder-date-label">${label1}</span><span class="reminder-date-val">${formatDate(parseDate(r.deadline))}</span></div>`;
      datesHtml += `<div class="reminder-date-row"><span class="reminder-date-label">${label2}</span><span class="reminder-date-val${isUrgent || isOverdue ? " reminder-date-urgent" : ""}">${formatDate(parseDate(r.secondDeadline))}</span></div>`;
    } else {
      datesHtml += `<div class="reminder-date-row"><span class="reminder-date-label">마감일</span><span class="reminder-date-val${isUrgent || isOverdue ? " reminder-date-urgent" : ""}">${formatDate(parseDate(r.deadline))}</span></div>`;
    }

    const cardClass = `reminder-card${isOverdue ? " reminder-overdue" : isUrgent ? " reminder-urgent" : ""}`;
    return `
      <div class="${cardClass}">
        <button class="reminder-delete-btn" type="button" data-reminder-id="${r.id}" aria-label="삭제">×</button>
        <div class="reminder-card-name">${r.objectName}</div>
        <span class="reminder-card-type">${REMINDER_TYPE_LABELS[r.type] || r.type}</span>
        <div class="reminder-card-dates">${datesHtml}</div>
        ${warningHtml}
      </div>`;
  }).join("");

  container.innerHTML = `
    <div class="reminder-panel">
      <div class="reminder-panel-header">
        <span class="reminder-panel-title">📌 제출기한 알림판</span>
        <span class="reminder-count">${reminders.length}건</span>
      </div>
      <div class="reminder-list">${cards}</div>
    </div>`;

  container.querySelectorAll("[data-reminder-id]").forEach((btn) => {
    btn.addEventListener("click", () => deleteReminderById(btn.dataset.reminderId));
  });
}

// Modal
let pendingReminderData = null;

function initReminderModal() {
  const modal = document.getElementById("reminder-modal");
  const nameInput = document.getElementById("reminder-object-name");

  document.getElementById("reminder-cancel-btn").addEventListener("click", () => {
    modal.classList.add("hidden");
    pendingReminderData = null;
  });

  document.getElementById("reminder-confirm-btn").addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) { nameInput.focus(); return; }
    if (pendingReminderData) {
      const reminders = loadReminders();
      reminders.unshift({ ...pendingReminderData, objectName: name, id: Date.now().toString() });
      persistReminders(reminders);
      renderHomeReminders();
      showToast("메인화면 알림판에 추가되었습니다.");
    }
    modal.classList.add("hidden");
    pendingReminderData = null;
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) { modal.classList.add("hidden"); pendingReminderData = null; }
  });

  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("reminder-confirm-btn").click();
  });
}

function showAddReminderModal(data) {
  pendingReminderData = data;
  document.getElementById("reminder-object-name").value = "";
  document.getElementById("reminder-modal").classList.remove("hidden");
  setTimeout(() => document.getElementById("reminder-object-name").focus(), 50);
}

initReminderModal();
renderHomeReminders();

// ── Theme Toggle ──────────────────────────────────────────────
(function initTheme() {
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.textContent = t === 'dark' ? '☀️' : '🌙';
      btn.title = t === 'dark' ? '밝은 테마로 전환' : '어두운 테마로 전환';
    });
  }

  document.querySelectorAll('.topbar').forEach(tb => {
    const btn = document.createElement('button');
    btn.className = 'theme-toggle-btn';
    btn.type = 'button';
    tb.appendChild(btn);
  });

  applyTheme(localStorage.getItem('theme') || 'dark');

  document.addEventListener('click', e => {
    if (e.target.closest('.theme-toggle-btn')) {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }
  });
})();
showScreen("home");

// ── Android 뒤로가기 버튼 ─────────────────────────────────────
(function initBackButton() {
  function getCurrentScreen() {
    return Object.keys(screens).find(k => screens[k].classList.contains("active")) || "home";
  }

  function handleBack() {
    const current = getCurrentScreen();

    if (current === "home") {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
        window.Capacitor.Plugins.App.exitApp();
      }
      return;
    }

    // 소방시설탐색기
    if (current === "explorer") {
      const multiuseCard = document.getElementById("multiuse-safety-card");
      if (multiuseCard && !multiuseCard.classList.contains("hidden")) {
        document.getElementById("back-to-main-result").click();
        return;
      }
      const resultCard = document.getElementById("result-card");
      if (resultCard && !resultCard.classList.contains("hidden")) {
        document.getElementById("restart-explorer").click();
        return;
      }
      if (state.currentStep > 0) {
        document.getElementById("prev-step").click();
        return;
      }
    }

    // 작동·종합 대상 판독기
    if (current === "inspection") {
      if (inspectionState.history.length > 0) {
        inspectionBack();
        return;
      }
    }

    // 다중이용업소 판독기
    if (current === "multiuse") {
      if (multiuseState.history.length > 0) {
        multiuseBack();
        return;
      }
    }

    // 수용인원 계산기
    if (current === "occupancy") {
      if (occupancyState.step !== "category") {
        occupancyState.step = getOccupancyBackStep(occupancyState.type);
        renderOccupancyCalculator();
        return;
      }
    }

    showScreen("home");
  }

  function setup() {
    const App = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (App) {
      App.addListener("backButton", handleBack);
    }
  }

  // Capacitor 브리지 준비 후 등록
  if (window.Capacitor) {
    if (document.readyState === "complete") {
      setup();
    } else {
      window.addEventListener("load", setup);
    }
  }

  // 웹 브라우저 뒤로가기 (Android Chrome / 일반 브라우저)
  if (!window.Capacitor) {
    // 페이지 진입 시 더미 state 추가 → 뒤로가기 = popstate
    history.pushState({ app: true }, "");
    window.addEventListener("popstate", function () {
      // 즉시 다시 state 추가 → 앱에서 벗어나지 않도록
      history.pushState({ app: true }, "");
      handleBack();
    });
  }
})();

// ── 바로가기 추가 ─────────────────────────────────────
(function initInstall() {
  if (window.Capacitor) return; // APK 환경에서는 불필요

  const APP_URL = 'https://carrotcakehope.github.io/fireapp/';
  const APP_NAME = '예방업무 어시스턴트';

  const isIOS     = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);
  const isPC      = !isIOS && !isAndroid;
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  let deferredPrompt = null;

  // Android / PC Chrome: 설치 프롬프트 대기
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
  });
  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
  });

  // ── 메인 바로가기 버튼: 앱으로 실행 중이면 숨김 ──
  const cardBtn = document.getElementById('open-install-guide');
  if (cardBtn) {
    if (isStandalone) {
      cardBtn.style.display = 'none';
    } else {
      const desc = document.getElementById('install-card-desc');
      if (desc) {
        if (isIOS)          desc.textContent = '홈 화면에 앱 아이콘 추가하기';
        else if (isAndroid) desc.textContent = '홈 화면에 앱 설치하기';
        else                desc.textContent = '바탕화면에 브라우저 바로가기 만들기';
      }
      cardBtn.addEventListener('click', openInstallModal);
    }
  }

  // ── iOS 구버튼 (기존 팝업 연결 유지) ──
  const iosGuide = document.getElementById('ios-install-guide');
  const iosClose = document.getElementById('ios-guide-close');
  if (iosClose) iosClose.addEventListener('click', () => iosGuide.classList.add('hidden'));
  if (iosGuide) iosGuide.addEventListener('click', e => { if (e.target === iosGuide) iosGuide.classList.add('hidden'); });

  // ── 통합 모달 ──
  const modal       = document.getElementById('install-modal');
  const modalTitle  = document.getElementById('install-modal-title');
  const modalBody   = document.getElementById('install-modal-body');
  const modalAction = document.getElementById('install-modal-action');
  const modalClose  = document.getElementById('install-modal-close');

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal)      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  function closeModal() { modal.classList.add('hidden'); }

  function openInstallModal() {
    if (!modal) return;
    modalAction.style.display = 'none';
    modalAction.onclick = null;

    if (isIOS) {
      modalTitle.textContent = '홈 화면에 추가 (iPhone)';
      modalBody.innerHTML =
        '<p class="ios-guide-desc">사파리에서 아래 순서로 진행하세요.</p>' +
        '<div class="ios-guide-steps">' +
          step(1, '하단 가운데 <strong>공유 버튼</strong> 탭 (□↑)') +
          step(2, '스크롤 내려서 <strong>홈 화면에 추가</strong> 탭') +
          step(3, '오른쪽 위 <strong>추가</strong> 탭') +
        '</div>';
    } else if (isAndroid) {
      if (deferredPrompt) {
        modalTitle.textContent = '홈 화면에 설치';
        modalBody.innerHTML = '<p class="ios-guide-desc">아래 버튼을 누르면 홈 화면에 앱 아이콘이 추가됩니다.</p>';
        modalAction.textContent = '📲 홈 화면에 추가';
        modalAction.style.display = '';
        modalAction.onclick = async function () {
          deferredPrompt.prompt();
          await deferredPrompt.userChoice;
          deferredPrompt = null;
          closeModal();
        };
      } else {
        modalTitle.textContent = '홈 화면에 추가';
        modalBody.innerHTML =
          '<p class="ios-guide-desc">Chrome 메뉴에서 직접 추가할 수 있습니다.</p>' +
          '<div class="ios-guide-steps">' +
            step(1, 'Chrome 주소창 오른쪽 <strong>⋮ 메뉴</strong> 탭') +
            step(2, '<strong>홈 화면에 추가</strong> 선택') +
          '</div>';
      }
    } else {
      // PC
      modalTitle.textContent = '바탕화면 바로가기 추가';
      modalBody.innerHTML =
        '<p class="ios-guide-desc">바로가기 파일을 다운로드해서<br>바탕화면에 옮겨두세요.</p>' +
        '<div class="ios-guide-steps">' +
          step(1, '아래 <strong>다운로드</strong> 버튼 클릭') +
          step(2, '다운로드된 <strong>.url 파일</strong>을 바탕화면으로 이동') +
          step(3, '더블클릭하면 바로 열립니다') +
        '</div>';
      modalAction.textContent = '⬇️ 바로가기 파일 다운로드';
      modalAction.style.display = '';
      modalAction.onclick = function () {
        var content = '[InternetShortcut]\r\nURL=' + APP_URL + '\r\n';
        var blob = new Blob([content], { type: 'text/plain' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = APP_NAME + '.url';
        a.click();
      };
    }

    modal.classList.remove('hidden');
  }

  function step(n, text) {
    return '<div class="ios-guide-step"><span class="ios-step-num">' + n + '</span><span>' + text + '</span></div>';
  }
})();
