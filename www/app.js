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
  explorerYear: document.getElementById("screen-explorer-year"),
  date: document.getElementById("screen-date"),
  inspection: document.getElementById("screen-inspection"),
  multiuse: document.getElementById("screen-multiuse"),
  guide: document.getElementById("screen-guide"),
  reportGuide: document.getElementById("screen-report-guide"),
};

const questionElements = {
  kicker: document.getElementById("question-kicker"),
  title: document.getElementById("question-title"),
  help: document.getElementById("question-help"),
  input: document.getElementById("question-input"),
};

const explorerRuntime = {
  mode: "default", // "default" | "year"
};

const explorerTitleEl = document.getElementById("explorer-title");
const explorerModeBadgeEl = document.getElementById("explorer-mode-badge");

function applyExplorerModeUI() {
  if (!explorerTitleEl || !explorerModeBadgeEl) return;
  const isYearMode = explorerRuntime.mode === "year";
  explorerTitleEl.textContent = isYearMode ? "소방시설탐색기 (연도별_테스트중)" : "소방시설탐색기";
  explorerModeBadgeEl.classList.toggle("hidden", !isYearMode);
}

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
  if (state.currentStep === activeSteps.length - 1) {
    document.getElementById("next-step").textContent = explorerRuntime.mode === "year" ? "결과 준비중" : "결과 보기";
  } else {
    document.getElementById("next-step").textContent = "다음";
  }
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
  const isCriteriaTarget = targetId === "criteria-list" || targetId === "year-criteria-list";
  const filtered = isCriteriaTarget
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
  explorerRuntime.mode = "default";
  applyExplorerModeUI();
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
// =============================================
// 연도별 탐색기 (Year-based Explorer)
// =============================================

const YD = {
  D20040530: 20040530,
  D20061207: 20061207,
  D20080229: 20080229,
  D20120914: 20120914,
  D20130109: 20130109,
  D20130210: 20130210,
  D20150701: 20150701,
  D20160101: 20160101,
  D20170128: 20170128,
  D20180128: 20180128,
  D20180627: 20180627,
  D20190806: 20190806,
  D20220225: 20220225,
  D20221201: 20221201,
  D20240517: 20240517,
  D20241231: 20241231,
  D20251201: 20251201,
};

const yearState = {
  currentStep: 0,
  answers: {
    yOccupancyType: "neighborhood",
    yPermitDate: "2019-02-18",
    yTotalArea: "1500",
    yAboveGroundFloors: "4",
    yBasementFloors: "0",
    yBasementAreaSum: "0",
    yHasWindowlessFloor: "no",
    yWindowlessArea: "",
    yHasLargeTargetFloor: "no",
    yHasLargeFloorFor1000: "no",
    yNeighborhoodArea: "1500",
    yFacilitySubtype: "general",
    yIsPostpartum: "no",
    yPostpartumAreaRange: "under600",
    yIsClinicWithInpatient: "no",
    yHasHemodialysis: "no",
    yHas24HourStaff: "no",
    yFirstSecondFloorArea: "750",
    yIndoorParkingArea: "",
    yMechanicalParkingCapacity: "",
    yElectricalRoomArea: "",
    ySmokeControlArea: "0",
    yHasSmallUndergroundParking: "no",
    // 숙박시설 전용
    yLodgingArea: "1500",
    yLodgingIsTouristHotel: "no",
    yLodgingHasLargeFloorFor1000: "no",
    yLodgingHasGasFacility: "no",
    yLodgingFirstSecondFloorArea: "750",
    yLodgingIndoorParkingArea: "",
    yLodgingMechanicalParkingCapacity: "",
    yLodgingElectricalRoomArea: "",
    yLodgingBasementAreaForSmoke: "0",
    // 노유자시설 전용
    yElderlySubtype: "general",
    yElderlyArea: "1500",
    yElderlyHasLargeTargetFloor: "no",
    yElderlyHasGrillWindow: "no",
    yElderlyHasGasFacility: "no",
    yElderlyHasFloor500Plus: "no",
    yElderlyHas24HourStaff: "no",
    yElderlyFirstSecondFloorArea: "750",
    yElderlyIndoorParkingArea: "",
    yElderlyMechanicalParkingCapacity: "",
    yElderlyElectricalRoomArea: "",
    yElderlyBasementAreaForSmoke: "0",
    yElderlyHasSmallUndergroundParking: "no",
  },
};

function yPermitDateInt() {
  const d = yearState.answers.yPermitDate;
  if (!d) return 0;
  return parseInt(d.replace(/-/g, ""), 10);
}

const yearSteps = [
  {
    key: "yOccupancyType",
    type: "ychoice",
    title: "어떤 용도를 탐색할까요?",
    help: "용도를 선택하면 해당 소방시설 기준을 건축허가일 기준으로 안내합니다.",
    options: [
      { value: "neighborhood", label: "근린생활시설", description: "일반 상가·식당·사무실·의원 등" },
      { value: "lodging", label: "숙박시설", description: "호텔·모텔·여관·펜션 등" },
      { value: "elderly", label: "노유자시설", description: "요양원·복지관·어린이집·아동센터 등" },
    ],
  },
  {
    key: "yPermitDate",
    type: "ydate",
    title: "건축허가일자를 입력하세요",
    help: "건축허가일 기준으로 당시 시행 중이던 소방시설 설치 기준을 적용합니다.",
  },
  {
    key: "yTotalArea",
    type: "ynumber",
    title: "건축물 연면적(㎡)",
    help: "지하층을 포함한 건물 전체 바닥면적 합계입니다.",
    placeholder: "예: 1500",
    min: 0,
    step: 0.1,
  },
  {
    key: "yAboveGroundFloors",
    type: "ynumber",
    title: "지상 층수는 몇 층입니까?",
    help: "지하층을 제외한 지상 층수를 입력하세요.",
    placeholder: "예: 5",
    min: 1,
    step: 1,
  },
  {
    key: "yBasementSet",
    type: "ycompound",
    title: "지하층 정보를 입력하세요",
    help: "지하층이 없으면 0을 입력하세요.",
  },
  {
    key: "yWindowlessSet",
    type: "ycompound",
    title: "무창층 정보를 입력하세요",
    help: "무창층이란 채광·환기 조건 등을 충족하지 못하는 층입니다.",
  },
  {
    key: "yHasLargeTargetFloor",
    type: "ychoice",
    title: "지하층·무창층·4층 이상 층 중 바닥면적 300㎡ 이상인 층이 있습니까?",
    help: "옥내소화전설비 설치 여부를 판단하는 조건입니다.",
    options: [
      { value: "yes", label: "예", description: "해당 층이 있음" },
      { value: "no", label: "아니오", description: "해당 층이 없음" },
    ],
    condition: (ya) => ya.yOccupancyType === "neighborhood" && (parseFloat(ya.yTotalArea) || 0) < 1500,
  },
  {
    key: "yHasLargeFloorFor1000",
    type: "ychoice",
    title: "지하층·무창층·4층 이상 층 중 바닥면적 1,000㎡ 이상인 층이 있습니까?",
    help: "허가일 당시(2018년 1월 이전) 스프링클러설비 설치 여부를 판단합니다.",
    options: [
      { value: "yes", label: "예", description: "해당 층이 있음" },
      { value: "no", label: "아니오", description: "해당 층이 없음" },
    ],
    condition: (ya, pd) => ya.yOccupancyType === "neighborhood" && pd >= YD.D20040530 && pd < YD.D20180128,
  },
  {
    key: "yNeighborhoodArea",
    type: "ynumber",
    title: "근린생활시설로 사용하는 부분의 바닥면적 합계(㎡)",
    help: "건물 내 근린생활시설 용도로 쓰이는 모든 층 면적을 합산하세요. 건물 전체가 근린생활시설이면 연면적과 같습니다.",
    placeholder: "예: 1200",
    min: 0,
    step: 0.1,
    condition: (ya, pd) => ya.yOccupancyType === "neighborhood" && pd >= YD.D20061207,
  },
  {
    key: "yFacilitySubtype",
    type: "ychoice",
    title: "해당 근린생활시설이 일반목욕장(욕탕)입니까?",
    help: "일반목욕장은 자동화재탐지설비 기준 면적이 다릅니다(600㎡ → 1,000㎡).",
    options: [
      { value: "general", label: "일반 근린생활시설", description: "상가, 식당, 사무실, 의원 등" },
      { value: "bathhouse", label: "일반목욕장(욕탕)", description: "목욕장으로 쓰이는 경우" },
    ],
    condition: (ya) => ya.yOccupancyType === "neighborhood",
  },
  {
    key: "yIsPostpartum",
    type: "ychoice",
    title: "해당 근린생활시설이 조산원 또는 산후조리원입니까?",
    help: "2022년 2월 25일 이후부터 조산원·산후조리원에 별도 설치 기준이 신설됩니다.",
    options: [
      { value: "yes", label: "예", description: "조산원 또는 산후조리원에 해당함" },
      { value: "no", label: "아니오", description: "해당 없음" },
    ],
    condition: (ya, pd) => ya.yOccupancyType === "neighborhood" && pd >= YD.D20220225,
  },
  {
    key: "yPostpartumAreaRange",
    type: "ychoice",
    title: "조산원·산후조리원의 바닥면적 합계는 얼마입니까?",
    help: "600㎡를 기준으로 스프링클러 또는 간이스프링클러 대상이 달라집니다.",
    options: [
      { value: "under600", label: "600㎡ 미만", description: "소규모 산후조리원" },
      { value: "over600", label: "600㎡ 이상", description: "대형 산후조리원" },
    ],
    condition: (ya, pd) => ya.yOccupancyType === "neighborhood" && pd >= YD.D20220225 && ya.yIsPostpartum === "yes",
  },
  {
    key: "yIsClinicWithInpatient",
    type: "ychoice",
    title: "입원실이 있는 의원·치과의원·한의원입니까?",
    help: "2018년 6월 27일 이후부터 입원실 있는 의원급은 면적 불문 간이스프링클러 설치 대상입니다.",
    options: [
      { value: "yes", label: "예", description: "입원실이 있는 의원급" },
      { value: "no", label: "아니오", description: "해당 없음" },
    ],
    condition: (ya, pd) => ya.yOccupancyType === "neighborhood" && pd >= YD.D20180627 && ya.yIsPostpartum !== "yes",
  },
  {
    key: "yHasHemodialysis",
    type: "ychoice",
    title: "인공신장실(혈액투석실)이 있는 의원·치과의원·한의원입니까?",
    help: "2024년 12월 31일 이후부터 인공신장실 있는 의원급도 면적 불문 간이스프링클러 대상입니다.",
    options: [
      { value: "yes", label: "예", description: "인공신장실이 있는 의원급" },
      { value: "no", label: "아니오", description: "해당 없음" },
    ],
    condition: (ya, pd) => ya.yOccupancyType === "neighborhood" && pd >= YD.D20241231 && ya.yIsClinicWithInpatient === "no" && ya.yIsPostpartum !== "yes",
  },
  {
    key: "yHas24HourStaff",
    type: "ychoice",
    title: "24시간 상주 근무자가 있습니까?",
    help: "24시간 상주 시 자동화재속보설비 면제 여부를 검토합니다.",
    options: [
      { value: "yes", label: "예", description: "24시간 상주함" },
      { value: "no", label: "아니오", description: "상주하지 않음" },
    ],
    condition: (ya, pd, autoDispatch) => ya.yOccupancyType === "neighborhood" && autoDispatch,
  },
  // ── 세부 질문 (뒤쪽) ──
  {
    key: "yFirstSecondFloorArea",
    type: "ynumber",
    title: "지상 1층·2층 바닥면적 합계(㎡)",
    help: "옥외소화전 설치 여부를 판단합니다. 해당 없으면 0을 입력하세요.",
    placeholder: "예: 0",
    min: 0,
    step: 0.1,
    condition: (ya) => ya.yOccupancyType === "neighborhood",
  },
  {
    key: "yParkingElecSet",
    type: "ycompound",
    title: "주차장·전기실 정보를 입력하세요",
    help: "물분무등소화설비 판단에 사용됩니다. 해당 없으면 0을 입력하세요.",
    condition: (ya) => ya.yOccupancyType === "neighborhood",
  },
  {
    key: "ySmokeControlArea",
    type: "ynumber",
    title: "지하층·무창층 내 근린생활시설 사용 바닥면적 합계(㎡)",
    help: "제연설비 설치 여부를 판단합니다. 해당 없으면 0을 입력하세요.",
    placeholder: "예: 0",
    min: 0,
    step: 0.1,
    condition: (ya) => ya.yOccupancyType === "neighborhood",
  },
  {
    key: "yHasSmallUndergroundParking",
    type: "ychoice",
    title: "지하 차고·주차장 바닥면적 합계가 200㎡ 미만입니까?",
    help: "2024년 5월 17일 이후부터 소규모 지하주차장도 연결살수설비 설치 대상입니다.",
    options: [
      { value: "yes", label: "예", description: "200㎡ 미만 지하주차장 있음" },
      { value: "no", label: "아니오", description: "해당 없음" },
    ],
    condition: (ya, pd) => ya.yOccupancyType === "neighborhood" && pd >= YD.D20240517,
  },

  // ── 숙박시설 전용 스텝 ──
  {
    key: "yLodgingArea",
    type: "ynumber",
    title: "숙박시설로 사용하는 바닥면적 합계(㎡)",
    help: "간이스프링클러·스프링클러 판단에 사용됩니다. 건물 전체를 숙박시설로 사용하면 연면적과 같게 입력하세요.",
    placeholder: "예: 450",
    min: 0,
    step: 0.1,
    condition: (ya) => ya.yOccupancyType === "lodging",
  },
  {
    key: "yLodgingHasLargeFloorFor1000",
    type: "ychoice",
    title: "지하층·무창층·4층 이상 층 중 바닥면적 1,000㎡ 이상인 층이 있습니까?",
    help: "2004~2017년 기간에는 이 조건이 스프링클러 설치 여부를 결정합니다.",
    options: [
      { value: "yes", label: "예", description: "해당 조건의 층이 하나라도 있음" },
      { value: "no", label: "아니오", description: "조건에 맞는 층이 없음" },
    ],
    condition: (ya, pd) => ya.yOccupancyType === "lodging" && pd >= YD.D20040530 && pd < YD.D20170128,
  },
  {
    key: "yLodgingHasGasFacility",
    type: "ychoice",
    title: "가스시설이 설치돼 있습니까?",
    help: "가스누설경보기 설치 여부를 판단합니다.",
    options: [
      { value: "yes", label: "예", description: "가스시설이 설치돼 있음" },
      { value: "no", label: "아니오", description: "가스시설이 없음" },
    ],
    condition: (ya) => ya.yOccupancyType === "lodging",
  },
  {
    key: "yLodgingIsTouristHotel",
    type: "ychoice",
    title: "관광호텔입니까?",
    help: "지하층을 포함한 층수가 7층 이상인 관광호텔이면 인명구조기구(방열복·공기호흡기 등)를 설치해야 합니다.",
    options: [
      { value: "no", label: "일반 숙박시설", description: "모텔·여관·펜션 등 관광호텔이 아닌 숙박시설" },
      { value: "yes", label: "관광호텔", description: "관광진흥법에 따른 관광호텔업 등록 시설" },
    ],
    condition: (ya) => ya.yOccupancyType === "lodging",
  },
  // 숙박시설 세부 조건 (뒤쪽)
  {
    key: "yLodgingFirstSecondFloorArea",
    type: "ynumber",
    title: "지상 1층·2층 바닥면적 합계(㎡)",
    help: "옥외소화전 설치 여부를 판단합니다. 해당 없으면 0을 입력하세요.",
    placeholder: "예: 0",
    min: 0,
    step: 0.1,
    condition: (ya) => ya.yOccupancyType === "lodging",
  },
  {
    key: "yLodgingParkingElecSet",
    type: "ycompound",
    title: "주차장·전기실 정보를 입력하세요",
    help: "물분무등소화설비 판단에 사용됩니다. 해당 없으면 0을 입력하세요.",
    condition: (ya) => ya.yOccupancyType === "lodging",
  },
  {
    key: "yLodgingBasementAreaForSmoke",
    type: "ynumber",
    title: "지하층·무창층 내 숙박시설 사용 바닥면적 합계(㎡)",
    help: "제연설비 설치 여부를 판단합니다. 해당 없으면 0을 입력하세요.",
    placeholder: "예: 0",
    min: 0,
    step: 0.1,
    condition: (ya) => ya.yOccupancyType === "lodging",
  },

  // ── 노유자시설 전용 스텝 ──
  {
    key: "yElderlySubtype",
    type: "ychoice",
    title: "어떤 노유자시설입니까?",
    help: "생활시설 여부에 따라 간이스프링클러·자동화재탐지설비·자동화재속보설비 기준이 달라집니다.",
    options: [
      { value: "general", label: "일반 노유자시설", description: "숙식을 제공하지 않는 시설 — 노인복지관·아동센터·주간보호센터 등" },
      { value: "living", label: "노유자 생활시설", description: "숙식을 함께 제공하는 시설 — 양로원·노인요양원·아동복지시설 등" },
    ],
    condition: (ya) => ya.yOccupancyType === "elderly",
  },
  {
    key: "yElderlyArea",
    type: "ynumber",
    title: "노유자시설로 사용하는 바닥면적 합계(㎡)",
    help: "스프링클러·간이스프링클러 판단에 사용됩니다. 건물 전체를 노유자시설로 사용하면 연면적과 같게 입력하세요.",
    placeholder: "예: 400",
    min: 0,
    step: 0.1,
    condition: (ya) => ya.yOccupancyType === "elderly",
  },
  {
    key: "yElderlyHasLargeTargetFloor",
    type: "ychoice",
    title: "지하층·무창층·4층 이상 층 중 바닥면적 300㎡ 이상인 층이 있습니까?",
    help: "옥내소화전설비 설치 여부를 판단하는 조건입니다.",
    options: [
      { value: "yes", label: "예", description: "해당 층이 있음" },
      { value: "no", label: "아니오", description: "해당 층이 없음" },
    ],
    condition: (ya) => ya.yOccupancyType === "elderly" && (parseFloat(ya.yTotalArea) || 0) < 1500,
  },
  {
    key: "yElderlyHasGrillWindow",
    type: "ychoice",
    title: "화재 시 자동으로 열리지 않는 창살이 설치돼 있습니까?",
    help: "추락 방지 목적의 창살이 있으면 300㎡ 미만이어도 간이스프링클러 대상이 됩니다. (2008년 2월 29일 이후 적용)",
    options: [
      { value: "yes", label: "있음", description: "자동 개방 구조가 아닌 창살이 설치돼 있음" },
      { value: "no", label: "없음", description: "창살이 없거나 화재 시 자동으로 열리는 구조" },
    ],
    condition: (ya, pd) => ya.yOccupancyType === "elderly" && ya.yElderlySubtype === "general" && pd >= YD.D20080229,
  },
  {
    key: "yElderlyHasGasFacility",
    type: "ychoice",
    title: "가스시설이 설치돼 있습니까?",
    help: "가스누설경보기 설치 여부를 판단합니다.",
    options: [
      { value: "yes", label: "예", description: "가스시설이 설치돼 있음" },
      { value: "no", label: "아니오", description: "가스시설이 없음" },
    ],
    condition: (ya) => ya.yOccupancyType === "elderly",
  },
  // 노유자시설 세부 조건 (뒤쪽)
  {
    key: "yElderlyHasFloor500Plus",
    type: "ychoice",
    title: "바닥면적이 500㎡ 이상인 층이 있습니까?",
    help: "일반 노유자시설의 자동화재속보설비 설치 여부를 판단합니다.",
    options: [
      { value: "yes", label: "있음", description: "500㎡ 이상인 층이 하나라도 있음" },
      { value: "no", label: "없음", description: "모든 층이 500㎡ 미만" },
    ],
    condition: (ya) => ya.yOccupancyType === "elderly" && ya.yElderlySubtype === "general",
  },
  {
    key: "yElderlyHas24HourStaff",
    type: "ychoice",
    title: "24시간 상주 근무자가 있습니까?",
    help: "방재실 등에 24시간 상주하면 자동화재속보설비를 설치하지 않을 수 있습니다.",
    options: [
      { value: "yes", label: "있음", description: "24시간 화재 감시 가능한 근무자가 상주함" },
      { value: "no", label: "없음", description: "24시간 상주 근무자가 없음" },
    ],
    condition: (ya, pd) => ya.yOccupancyType === "elderly" && pd >= YD.D20120914,
  },
  {
    key: "yElderlyFirstSecondFloorArea",
    type: "ynumber",
    title: "지상 1층·2층 바닥면적 합계(㎡)",
    help: "옥외소화전 설치 여부를 판단합니다. 해당 없으면 0을 입력하세요.",
    placeholder: "예: 0",
    min: 0,
    step: 0.1,
    condition: (ya) => ya.yOccupancyType === "elderly",
  },
  {
    key: "yElderlyParkingElecSet",
    type: "ycompound",
    title: "주차장·전기실 정보를 입력하세요",
    help: "물분무등소화설비 판단에 사용됩니다. 해당 없으면 0을 입력하세요.",
    condition: (ya) => ya.yOccupancyType === "elderly",
  },
  {
    key: "yElderlyBasementAreaForSmoke",
    type: "ynumber",
    title: "지하층·무창층 내 노유자시설 사용 바닥면적 합계(㎡)",
    help: "제연설비 설치 여부를 판단합니다. (2015년 7월 1일 이후 적용) 해당 없으면 0을 입력하세요.",
    placeholder: "예: 0",
    min: 0,
    step: 0.1,
    condition: (ya) => ya.yOccupancyType === "elderly",
  },
  {
    key: "yElderlyHasSmallUndergroundParking",
    type: "ychoice",
    title: "지하 차고·주차장 바닥면적 합계가 200㎡ 미만입니까?",
    help: "2025년 12월 1일 이후부터 소규모 지하주차장도 비상경보설비 설치 대상입니다.",
    options: [
      { value: "yes", label: "예", description: "200㎡ 미만 지하주차장 있음" },
      { value: "no", label: "아니오", description: "해당 없음" },
    ],
    condition: (ya, pd) => ya.yOccupancyType === "elderly" && pd >= YD.D20251201,
  },
];

function yearGetActiveSteps() {
  const ya = yearState.answers;
  const pd = yPermitDateInt();
  const clinicApplicable = pd >= YD.D20190806 && ya.yIsClinicWithInpatient === "yes";
  const hemApplicable = pd >= YD.D20241231 && ya.yHasHemodialysis === "yes";
  const postpartumApplicable = pd >= YD.D20220225 && ya.yIsPostpartum === "yes";
  const autoDispatch = clinicApplicable || hemApplicable || postpartumApplicable;
  return yearSteps.filter((step) => !step.condition || step.condition(ya, pd, autoDispatch));
}

function makeYearField(labelText, name, value, extra = {}) {
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
  input.addEventListener("input", (e) => { yearState.answers[name] = e.target.value; });
  wrapper.appendChild(label);
  wrapper.appendChild(input);
  return wrapper;
}

function makeYearBinaryField(labelText, name) {
  const wrapper = document.createElement("div");
  wrapper.className = "calc-form-row";
  const label = document.createElement("label");
  label.textContent = labelText;
  wrapper.appendChild(label);
  const buttons = document.createElement("div");
  buttons.className = "choice-list";
  [{ value: "yes", label: "예" }, { value: "no", label: "아니오" }].forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-button";
    if (yearState.answers[name] === opt.value) btn.classList.add("selected");
    btn.innerHTML = `<strong>${opt.label}</strong>`;
    btn.addEventListener("click", () => { yearState.answers[name] = opt.value; yearRenderCurrentStep(); });
    buttons.appendChild(btn);
  });
  wrapper.appendChild(buttons);
  return wrapper;
}

function yearRenderChoiceStep(step) {
  const wrapper = document.createElement("div");
  wrapper.className = "choice-list";
  step.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-button";
    if (String(yearState.answers[step.key]) === option.value) btn.classList.add("selected");
    btn.innerHTML = `<strong>${option.label}</strong><span>${option.description}</span>`;
    btn.addEventListener("click", () => { yearState.answers[step.key] = option.value; yearRenderCurrentStep(); });
    wrapper.appendChild(btn);
  });
  return wrapper;
}

function yearRenderNumberStep(step) {
  const input = document.createElement("input");
  input.className = "calc-input";
  input.type = "number";
  input.min = String(step.min ?? 0);
  input.step = String(step.step ?? 1);
  input.placeholder = step.placeholder ?? "";
  input.value = yearState.answers[step.key] ?? "";
  input.addEventListener("input", (e) => {
    yearState.answers[step.key] = e.target.value;
    // yTotalArea 변경 시 관련 필드 자동 파생
    if (step.key === "yTotalArea") {
      const ta = parseFloat(e.target.value) || 0;
      const ag = parseInt(yearState.answers.yAboveGroundFloors) || 0;
      const bf = parseInt(yearState.answers.yBasementFloors) || 0;
      const totalFloors = ag + bf || 1;
      const f12 = Math.round((ta / totalFloors) * 2 * 10) / 10;
      yearState.answers.yLodgingArea = e.target.value;
      yearState.answers.yNeighborhoodArea = e.target.value;
      yearState.answers.yElderlyArea = e.target.value;
      yearState.answers.yFirstSecondFloorArea = String(f12);
      yearState.answers.yLodgingFirstSecondFloorArea = String(f12);
      yearState.answers.yElderlyFirstSecondFloorArea = String(f12);
    }
    // 층수 변경 시 1·2층 면적 재계산
    if (step.key === "yAboveGroundFloors" || step.key === "yBasementFloors") {
      const ta = parseFloat(yearState.answers.yTotalArea) || 0;
      const ag = step.key === "yAboveGroundFloors" ? (parseInt(e.target.value) || 0) : (parseInt(yearState.answers.yAboveGroundFloors) || 0);
      const bf = step.key === "yBasementFloors" ? (parseInt(e.target.value) || 0) : (parseInt(yearState.answers.yBasementFloors) || 0);
      const totalFloors = ag + bf || 1;
      const f12 = Math.round((ta / totalFloors) * 2 * 10) / 10;
      yearState.answers.yFirstSecondFloorArea = String(f12);
      yearState.answers.yLodgingFirstSecondFloorArea = String(f12);
      yearState.answers.yElderlyFirstSecondFloorArea = String(f12);
    }
  });
  return input;
}

function yearRenderDateStep() {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;gap:8px;align-items:center;";

  const existing = yearState.answers.yPermitDate || "";
  const parts = existing.split("-");
  const ey = parts[0] || "";
  const em = parts[1] || "";
  const ed = parts[2] || "";

  function syncDate() {
    const y = yInp.value.trim();
    const m = String(mInp.value.trim()).padStart(2, "0");
    const d = String(dInp.value.trim()).padStart(2, "0");
    if (y && mInp.value.trim() && dInp.value.trim()) {
      yearState.answers.yPermitDate = y + "-" + m + "-" + d;
    } else {
      yearState.answers.yPermitDate = "";
    }
    // 2004년 5월 30일 이전이면 경고 표시
    const pd = yPermitDateInt();
    let warn = wrapper.parentNode && wrapper.parentNode.querySelector(".year-date-warn");
    if (pd > 0 && pd < YD.D20040530) {
      if (!warn) {
        warn = document.createElement("div");
        warn.className = "year-date-warn info-box amber";
        warn.style.marginTop = "10px";
        wrapper.insertAdjacentElement("afterend", warn);
      }
      warn.innerHTML = "<div class=\"ib-title\">⚠️ 분석 불가 날짜</div>이 도구는 <strong>2004년 5월 30일 이후</strong> 건축허가 건물만 분석할 수 있습니다. 허가일을 다시 확인해 주세요.";
    } else {
      if (warn) warn.remove();
    }
  }

  const yInp = document.createElement("input");
  yInp.className = "calc-input";
  yInp.type = "number";
  yInp.placeholder = "년 (예: 2024)";
  yInp.min = "1900"; yInp.max = "2100"; yInp.step = "1";
  yInp.style.cssText = "flex:3;min-width:0;";
  yInp.value = ey;
  yInp.addEventListener("input", syncDate);

  const mInp = document.createElement("input");
  mInp.className = "calc-input";
  mInp.type = "number";
  mInp.placeholder = "월";
  mInp.min = "1"; mInp.max = "12"; mInp.step = "1";
  mInp.style.cssText = "flex:1;min-width:0;";
  mInp.value = em ? String(parseInt(em, 10)) : "";
  mInp.addEventListener("input", syncDate);

  const dInp = document.createElement("input");
  dInp.className = "calc-input";
  dInp.type = "number";
  dInp.placeholder = "일";
  dInp.min = "1"; dInp.max = "31"; dInp.step = "1";
  dInp.style.cssText = "flex:1;min-width:0;";
  dInp.value = ed ? String(parseInt(ed, 10)) : "";
  dInp.addEventListener("input", syncDate);

  wrapper.appendChild(yInp);
  wrapper.appendChild(mInp);
  wrapper.appendChild(dInp);
  return wrapper;
}

function yearRenderCompoundStep(step) {
  const wrapper = document.createElement("div");
  wrapper.className = "choice-list";
  const ya = yearState.answers;

  if (step.key === "yBasementSet") {
    wrapper.appendChild(makeYearField("지하층수", "yBasementFloors", ya.yBasementFloors, { min: 0, step: 1, placeholder: "없으면 0" }));
    wrapper.appendChild(makeYearField("지하층 바닥면적 합계(㎡)", "yBasementAreaSum", ya.yBasementAreaSum, { min: 0, step: 0.1, placeholder: "없으면 0" }));
  }

  if (step.key === "yWindowlessSet") {
    wrapper.appendChild(makeYearBinaryField("무창층이 있습니까?", "yHasWindowlessFloor"));
    if (ya.yHasWindowlessFloor === "yes") {
      wrapper.appendChild(makeYearField("무창층 바닥면적(㎡)", "yWindowlessArea", ya.yWindowlessArea, { min: 0, step: 0.1, placeholder: "예: 150" }));
    }
  }

  if (step.key === "yParkingElecSet") {
    wrapper.appendChild(makeYearField("건물 내부 차고·주차장 바닥면적(㎡)", "yIndoorParkingArea", ya.yIndoorParkingArea, { min: 0, step: 0.1, placeholder: "없으면 0" }));
    wrapper.appendChild(makeYearField("기계식 주차 대수(대)", "yMechanicalParkingCapacity", ya.yMechanicalParkingCapacity, { min: 0, step: 1, placeholder: "없으면 0" }));
    wrapper.appendChild(makeYearField("전기실·발전실·변전실·전산실 바닥면적(㎡)", "yElectricalRoomArea", ya.yElectricalRoomArea, { min: 0, step: 0.1, placeholder: "없으면 0" }));
  }

  if (step.key === "yLodgingParkingElecSet") {
    wrapper.appendChild(makeYearField("건물 내부 차고·주차장 바닥면적(㎡)", "yLodgingIndoorParkingArea", ya.yLodgingIndoorParkingArea, { min: 0, step: 0.1, placeholder: "없으면 0" }));
    wrapper.appendChild(makeYearField("기계식 주차 대수(대)", "yLodgingMechanicalParkingCapacity", ya.yLodgingMechanicalParkingCapacity, { min: 0, step: 1, placeholder: "없으면 0" }));
    wrapper.appendChild(makeYearField("전기실·발전실·변전실·전산실 바닥면적(㎡)", "yLodgingElectricalRoomArea", ya.yLodgingElectricalRoomArea, { min: 0, step: 0.1, placeholder: "없으면 0" }));
  }

  if (step.key === "yElderlyParkingElecSet") {
    wrapper.appendChild(makeYearField("건물 내부 차고·주차장 바닥면적(㎡)", "yElderlyIndoorParkingArea", ya.yElderlyIndoorParkingArea, { min: 0, step: 0.1, placeholder: "없으면 0" }));
    wrapper.appendChild(makeYearField("기계식 주차 대수(대)", "yElderlyMechanicalParkingCapacity", ya.yElderlyMechanicalParkingCapacity, { min: 0, step: 1, placeholder: "없으면 0" }));
    wrapper.appendChild(makeYearField("전기실·발전실·변전실·전산실 바닥면적(㎡)", "yElderlyElectricalRoomArea", ya.yElderlyElectricalRoomArea, { min: 0, step: 0.1, placeholder: "없으면 0" }));
  }

  return wrapper;
}

function yearRenderCurrentStep() {
  const activeSteps = yearGetActiveSteps();
  const step = activeSteps[yearState.currentStep];
  document.getElementById("year-question-kicker").textContent = `QUESTION ${yearState.currentStep + 1}`;
  document.getElementById("year-question-title").textContent = step.title;
  document.getElementById("year-question-help").textContent = step.help;
  const inputEl = document.getElementById("year-question-input");
  inputEl.innerHTML = "";

  let node;
  if (step.type === "ychoice") node = yearRenderChoiceStep(step);
  else if (step.type === "ycompound") node = yearRenderCompoundStep(step);
  else if (step.type === "ydate") node = yearRenderDateStep();
  else node = yearRenderNumberStep(step);
  inputEl.appendChild(node);

  const prevBtn = document.getElementById("year-prev-btn");
  const nextBtn = document.getElementById("year-next-btn");
  prevBtn.disabled = yearState.currentStep === 0;
  nextBtn.textContent = yearState.currentStep === activeSteps.length - 1 ? "결과 보기" : "다음";
  yearUpdateProgress();
}

function yearUpdateProgress() {
  const activeSteps = yearGetActiveSteps();
  const total = activeSteps.length;
  const current = yearState.currentStep + 1;
  const pct = Math.round((current / total) * 100);
  document.getElementById("year-progress-text").textContent = `${current} / ${total}`;
  document.getElementById("year-progress-percent").textContent = `${pct}%`;
  document.getElementById("year-progress-bar").style.width = `${pct}%`;
}

function yearCurrentStepIsValid() {
  const step = yearGetActiveSteps()[yearState.currentStep];
  if (step.type === "ynumber") {
    const v = yearState.answers[step.key];
    return v !== "" && !Number.isNaN(Number(v));
  }
  if (step.type === "ydate") {
    return !!yearState.answers.yPermitDate;
  }
  return true;
}

function yearScrollToTop() {
  const el = document.querySelector("#screen-explorer-year .scroll-content");
  if (el) el.scrollTo({ top: 0, behavior: "smooth" });
}

function yearMoveStep(direction) {
  if (direction > 0 && !yearCurrentStepIsValid()) {
    showToast("현재 질문의 값을 먼저 입력해 주세요.");
    return;
  }
  // 허가일 입력 단계에서 2004-05-30 이전이면 진행 차단
  if (direction > 0) {
    const activeSteps = yearGetActiveSteps();
    const curStep = activeSteps[yearState.currentStep];
    if (curStep && curStep.key === "yPermitDate" && yPermitDateInt() < YD.D20040530) {
      showToast("이 도구는 2004년 5월 30일 이후 건축허가 건물만 분석 가능합니다.");
      return;
    }
  }
  const activeSteps = yearGetActiveSteps();
  yearState.currentStep = Math.max(0, Math.min(yearState.currentStep + direction, activeSteps.length - 1));
  yearRenderCurrentStep();
  yearScrollToTop();
}

function yearNormalizeAnswers() {
  const ya = yearState.answers;
  const pd = yPermitDateInt();
  const bf = parseInt(ya.yBasementFloors) || 0;
  const ba = parseFloat(ya.yBasementAreaSum) || 0;
  const wlArea = parseFloat(ya.yWindowlessArea) || 0;
  return {
    pd,
    occupancyType: ya.yOccupancyType,
    totalArea: parseFloat(ya.yTotalArea) || 0,
    aboveGroundFloors: parseInt(ya.yAboveGroundFloors) || 0,
    basementFloors: bf,
    basementAreaSum: ba,
    hasWindowlessFloor: ya.yHasWindowlessFloor === "yes",
    windowlessArea: wlArea,
    hasLargeTargetFloor: ya.yHasLargeTargetFloor === "yes",
    hasLargeFloorFor1000: ya.yHasLargeFloorFor1000 === "yes",
    neighborhoodArea: parseFloat(ya.yNeighborhoodArea) || 0,
    facilitySubtype: ya.yFacilitySubtype,
    isPostpartum: ya.yIsPostpartum === "yes",
    postpartumAreaRange: ya.yPostpartumAreaRange,
    isClinicWithInpatient: ya.yIsClinicWithInpatient === "yes",
    hasHemodialysis: ya.yHasHemodialysis === "yes",
    has24HourStaff: ya.yHas24HourStaff === "yes",
    firstSecondFloorArea: parseFloat(ya.yFirstSecondFloorArea) || 0,
    indoorParkingArea: parseFloat(ya.yIndoorParkingArea) || 0,
    mechanicalParkingCapacity: parseInt(ya.yMechanicalParkingCapacity) || 0,
    electricalRoomArea: parseFloat(ya.yElectricalRoomArea) || 0,
    smokeControlArea: parseFloat(ya.ySmokeControlArea) || 0,
    hasSmallUndergroundParking: ya.yHasSmallUndergroundParking === "yes",
    basementAvg: bf > 0 ? ba / bf : 0,
    totalFloors: (parseInt(ya.yAboveGroundFloors) || 0) + bf,
    // 숙박시설 전용
    lodgingArea: parseFloat(ya.yLodgingArea) || 0,
    lodgingIsTouristHotel: ya.yLodgingIsTouristHotel === "yes",
    lodgingHasLargeFloorFor1000: ya.yLodgingHasLargeFloorFor1000 === "yes",
    lodgingHasGasFacility: ya.yLodgingHasGasFacility === "yes",
    lodgingFirstSecondFloorArea: parseFloat(ya.yLodgingFirstSecondFloorArea) || 0,
    lodgingIndoorParkingArea: parseFloat(ya.yLodgingIndoorParkingArea) || 0,
    lodgingMechanicalParkingCapacity: parseInt(ya.yLodgingMechanicalParkingCapacity) || 0,
    lodgingElectricalRoomArea: parseFloat(ya.yLodgingElectricalRoomArea) || 0,
    lodgingBasementAreaForSmoke: parseFloat(ya.yLodgingBasementAreaForSmoke) || 0,
    // 노유자시설 전용
    elderlySubtype: ya.yElderlySubtype,
    elderlyArea: parseFloat(ya.yElderlyArea) || 0,
    elderlyHasLargeTargetFloor: ya.yElderlyHasLargeTargetFloor === "yes",
    elderlyHasGrillWindow: ya.yElderlyHasGrillWindow === "yes",
    elderlyHasGasFacility: ya.yElderlyHasGasFacility === "yes",
    elderlyHasFloor500Plus: ya.yElderlyHasFloor500Plus === "yes",
    elderlyHas24HourStaff: ya.yElderlyHas24HourStaff === "yes",
    elderlyFirstSecondFloorArea: parseFloat(ya.yElderlyFirstSecondFloorArea) || 0,
    elderlyIndoorParkingArea: parseFloat(ya.yElderlyIndoorParkingArea) || 0,
    elderlyMechanicalParkingCapacity: parseInt(ya.yElderlyMechanicalParkingCapacity) || 0,
    elderlyElectricalRoomArea: parseFloat(ya.yElderlyElectricalRoomArea) || 0,
    elderlyBasementAreaForSmoke: parseFloat(ya.yElderlyBasementAreaForSmoke) || 0,
    elderlyHasSmallUndergroundParking: ya.yElderlyHasSmallUndergroundParking === "yes",
  };
}

function yearEvaluateNeighborhood(inp) {
  const results = [];
  const { pd } = inp;

  // ── 소화기 ──
  results.push(makeResult(categories.extinguishing, "소화기구", "",
    inp.totalArea >= 33 ? "required" : "notRequired",
    inp.totalArea >= 33 ? "연면적이 33㎡ 이상입니다." : "연면적이 33㎡ 미만입니다.", ""));

  // ── 옥내소화전 (기준 동일) ──
  const indoorHydrantReq = inp.totalArea >= 1500 || inp.hasLargeTargetFloor;
  results.push(makeResult(categories.extinguishing, "옥내소화전설비", "",
    indoorHydrantReq ? "required" : "notRequired",
    inp.totalArea >= 1500 ? "연면적이 1,500㎡ 이상입니다." :
      inp.hasLargeTargetFloor ? "지하층·무창층 또는 4층 이상 층 중 바닥면적 300㎡ 이상인 층이 있습니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 스프링클러 ──
  let sprinklerReq = false;
  let sprinklerReason = "";
  if (pd >= YD.D20040530 && pd < YD.D20180128) {
    sprinklerReq = inp.aboveGroundFloors >= 11 || inp.hasLargeFloorFor1000;
    sprinklerReason = inp.aboveGroundFloors >= 11 ? "층수가 11층 이상으로 전층 설치 대상입니다." :
      inp.hasLargeFloorFor1000 ? "지하층·무창층·4층 이상 층 중 바닥면적 1,000㎡ 이상인 층이 있어 해당 층에 설치 대상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else if (pd >= YD.D20180128 && pd < YD.D20220225) {
    sprinklerReq = inp.aboveGroundFloors >= 6;
    sprinklerReason = inp.aboveGroundFloors >= 6 ? "층수가 6층 이상으로 전층 설치 대상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else if (pd >= YD.D20220225) {
    const postpartumBig = inp.isPostpartum && inp.postpartumAreaRange === "over600";
    sprinklerReq = inp.aboveGroundFloors >= 6 || postpartumBig;
    sprinklerReason = inp.aboveGroundFloors >= 6 ? "층수가 6층 이상으로 전층 설치 대상입니다." :
      postpartumBig ? "조산원·산후조리원이고 바닥면적이 600㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  }
  results.push(makeResult(categories.extinguishing, "스프링클러설비", "",
    sprinklerReq ? "required" : "notRequired", sprinklerReason, ""));

  // ── 간이스프링클러 ──
  let simpleSprinklerReq = false;
  let simpleSprinklerReason = "";
  if (sprinklerReq) {
    simpleSprinklerReason = "스프링클러설비 전층 설치 대상이므로 간이스프링클러설비는 제외됩니다.";
  } else if (pd >= YD.D20040530 && pd < YD.D20061207) {
    simpleSprinklerReq = inp.totalArea >= 1000;
    simpleSprinklerReason = inp.totalArea >= 1000 ?
      "주용도 근린생활시설로서 연면적이 1,000㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else if (pd >= YD.D20061207 && pd < YD.D20180627) {
    simpleSprinklerReq = inp.neighborhoodArea >= 1000;
    simpleSprinklerReason = inp.neighborhoodArea >= 1000 ?
      "근린생활시설로 사용하는 바닥면적 합계가 1,000㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else if (pd >= YD.D20180627 && pd < YD.D20221201) {
    simpleSprinklerReq = inp.neighborhoodArea >= 1000 || inp.isClinicWithInpatient;
    simpleSprinklerReason = inp.neighborhoodArea >= 1000 ? "근린생활시설로 사용하는 바닥면적 합계가 1,000㎡ 이상입니다." :
      inp.isClinicWithInpatient ? "입원실이 있는 의원·치과의원·한의원입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else if (pd >= YD.D20221201 && pd < YD.D20241231) {
    const smallPostpartum = inp.isPostpartum && inp.postpartumAreaRange === "under600";
    simpleSprinklerReq = inp.neighborhoodArea >= 1000 || inp.isClinicWithInpatient || smallPostpartum;
    simpleSprinklerReason = inp.neighborhoodArea >= 1000 ? "근린생활시설로 사용하는 바닥면적 합계가 1,000㎡ 이상입니다." :
      inp.isClinicWithInpatient ? "입원실이 있는 의원·치과의원·한의원입니다." :
      smallPostpartum ? "조산원·산후조리원이고 바닥면적이 600㎡ 미만입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else if (pd >= YD.D20241231) {
    const smallPostpartum = inp.isPostpartum && inp.postpartumAreaRange === "under600";
    const clinicReq = inp.isClinicWithInpatient || inp.hasHemodialysis;
    simpleSprinklerReq = inp.neighborhoodArea >= 1000 || clinicReq || smallPostpartum;
    simpleSprinklerReason = inp.neighborhoodArea >= 1000 ? "근린생활시설로 사용하는 바닥면적 합계가 1,000㎡ 이상입니다." :
      inp.isClinicWithInpatient ? "입원실이 있는 의원·치과의원·한의원입니다." :
      inp.hasHemodialysis ? "인공신장실이 있는 의원·치과의원·한의원입니다." :
      smallPostpartum ? "조산원·산후조리원이고 바닥면적이 600㎡ 미만입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  }
  results.push(makeResult(categories.extinguishing, "간이스프링클러설비", "",
    sprinklerReq ? "notRequired" : (simpleSprinklerReq ? "required" : "notRequired"),
    sprinklerReq ? simpleSprinklerReason : (simpleSprinklerReason || "현재 입력 기준으로는 설치 대상이 아닙니다."), ""));

  // ── 물분무등소화설비 (기준 동일) ──
  const waterSprayReq = inp.indoorParkingArea >= 200 || inp.mechanicalParkingCapacity >= 20 || inp.electricalRoomArea >= 300;
  results.push(makeResult(categories.extinguishing, "물분무등소화설비", "",
    waterSprayReq ? "required" : "notRequired",
    buildWaterSprayReason(0, inp.indoorParkingArea, inp.mechanicalParkingCapacity, inp.electricalRoomArea), ""));

  // ── 옥외소화전 (기준 동일) ──
  results.push(makeResult(categories.extinguishing, "옥외소화전설비", "",
    inp.firstSecondFloorArea >= 9000 ? "required" : "notRequired",
    inp.firstSecondFloorArea >= 9000 ? "지상 1층과 2층의 바닥면적 합계가 9,000㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 비상경보설비 ──
  const bsmtAvg150 = inp.basementFloors > 0 && inp.basementAvg >= 150;
  const wlss150 = inp.hasWindowlessFloor && inp.windowlessArea >= 150;
  let emergAlarmReq = inp.totalArea >= 400 || bsmtAvg150 || wlss150;
  let emergAlarmReason = inp.totalArea >= 400 ? "연면적이 400㎡ 이상입니다." :
    bsmtAvg150 ? "지하층 평균 면적이 150㎡ 이상입니다." :
    wlss150 ? "무창층 면적이 150㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.";
  if (pd >= YD.D20251201 && inp.hasSmallUndergroundParking) {
    emergAlarmReq = true;
    emergAlarmReason = "지하 차고·주차장이 200㎡ 미만으로 건물 전층에 설치 대상입니다.";
  }
  results.push(makeResult(categories.alarm, "비상경보설비", "",
    emergAlarmReq ? "required" : "notRequired", emergAlarmReason, ""));

  // ── 자동화재탐지설비 ──
  let autoDetReq = false;
  let autoDetReason = "";
  const detThreshold = inp.facilitySubtype === "bathhouse" ? 1000 : 600;
  if (pd >= YD.D20040530 && pd < YD.D20220225) {
    autoDetReq = inp.totalArea >= detThreshold;
    autoDetReason = autoDetReq ?
      (inp.facilitySubtype === "bathhouse" ? "목욕장이며 연면적이 1,000㎡ 이상입니다." : "연면적이 600㎡ 이상입니다.") :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else if (pd >= YD.D20220225) {
    const floorTrig = inp.aboveGroundFloors >= 6;
    const areaTrig = inp.totalArea >= detThreshold;
    const postpartumTrig = inp.isPostpartum;
    autoDetReq = floorTrig || areaTrig || postpartumTrig;
    autoDetReason = floorTrig ? "층수가 6층 이상으로 모든 층에 설치 대상입니다." :
      areaTrig ? (inp.facilitySubtype === "bathhouse" ? "목욕장이며 연면적이 1,000㎡ 이상입니다." : "연면적이 600㎡ 이상입니다.") :
      postpartumTrig ? "조산원·산후조리원으로 면적에 관계없이 설치 대상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  }
  results.push(makeResult(categories.alarm, "자동화재탐지설비", "",
    autoDetReq ? "required" : "notRequired", autoDetReason, ""));

  // ── 시각경보기 ──
  results.push(makeResult(categories.alarm, "시각경보기", "",
    autoDetReq ? "required" : "notRequired",
    autoDetReq ? "자동화재탐지설비 설치 대상이므로 함께 설치해야 합니다." :
      "자동화재탐지설비 설치 대상이 아니므로 해당 없습니다.", ""));

  // ── 비상방송설비 (기준 동일) ──
  const broadcastReq = inp.totalArea >= 3500 || inp.aboveGroundFloors >= 11 || inp.basementFloors >= 3;
  results.push(makeResult(categories.alarm, "비상방송설비", "",
    broadcastReq ? "required" : "notRequired",
    inp.totalArea >= 3500 ? "연면적이 3,500㎡ 이상입니다." :
      inp.aboveGroundFloors >= 11 ? "지상층수가 11층 이상입니다." :
      inp.basementFloors >= 3 ? "지하층수가 3층 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 자동화재속보설비 ──
  if (pd < YD.D20190806) {
    results.push(makeResult(categories.alarm, "자동화재속보설비", "", "notRequired",
      "허가일 기준 당시 근린생활시설에 대한 자동화재속보설비 설치 기준이 없었습니다.", ""));
  } else {
    const clinicApply = inp.isClinicWithInpatient || (pd >= YD.D20241231 && inp.hasHemodialysis);
    const postpartumApply = pd >= YD.D20220225 && inp.isPostpartum;
    const autoDispatchTarget = clinicApply || postpartumApply;
    if (autoDispatchTarget) {
      const dispatchReason = inp.isClinicWithInpatient ? "입원실이 있는 의원급에 해당합니다." :
        (pd >= YD.D20241231 && inp.hasHemodialysis) ? "인공신장실이 있는 의원급에 해당합니다." :
        "조산원·산후조리원에 해당합니다.";
      results.push(makeResult(categories.alarm, "자동화재속보설비", "",
        inp.has24HourStaff ? "review" : "required",
        inp.has24HourStaff ? "24시간 상주 근무자가 있어 면제 검토가 필요합니다." : dispatchReason, ""));
    } else {
      results.push(makeResult(categories.alarm, "자동화재속보설비", "", "notRequired",
        "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    }
  }

  // ── 피난기구 (기준 동일) ──
  results.push(makeResult(categories.evacuation, "피난기구", "",
    inp.aboveGroundFloors >= 3 ? "required" : "notRequired",
    inp.aboveGroundFloors >= 3 ? "건축물 3층 이상 층에 설치합니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 유도등 (기준 동일) ──
  results.push(makeResult(categories.evacuation, "유도등 및 유도표지", "", "required",
    "기본적으로 건물 전체에 설치합니다.", ""));

  // ── 비상조명등 (기준 동일) ──
  const bsmtAvg450 = inp.basementFloors > 0 && inp.basementAvg >= 450;
  const wlss450 = inp.hasWindowlessFloor && inp.windowlessArea >= 450;
  const emLightReq = (inp.totalFloors >= 5 && inp.totalArea >= 3000) || bsmtAvg450 || wlss450;
  results.push(makeResult(categories.evacuation, "비상조명등", "",
    emLightReq ? "required" : "notRequired",
    inp.totalFloors >= 5 && inp.totalArea >= 3000 ? "전체 층수가 5층 이상이고 연면적이 3,000㎡ 이상입니다." :
      bsmtAvg450 ? "지하층 평균 면적이 450㎡ 이상입니다." :
      wlss450 ? "무창층 면적이 450㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 상수도소화용수설비 (기준 동일) ──
  results.push(makeResult(categories.waterSupply, "상수도소화용수설비", "",
    inp.totalArea >= 5000 ? "required" : "notRequired",
    inp.totalArea >= 5000 ? "연면적이 5,000㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 제연설비 (기준 동일) ──
  results.push(makeResult(categories.fireSupport, "제연설비", "",
    inp.smokeControlArea >= 1000 ? "required" : "notRequired",
    inp.smokeControlArea >= 1000 ? "지하층·무창층 내 근린생활시설 바닥면적 합계가 1,000㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 연결송수관 (기준 동일) ──
  const standpipeReq = (inp.totalFloors >= 5 && inp.totalArea >= 6000) || inp.totalFloors >= 7 ||
    (inp.basementFloors >= 3 && inp.basementAreaSum >= 1000);
  results.push(makeResult(categories.fireSupport, "연결송수관설비", "",
    standpipeReq ? "required" : "notRequired",
    inp.totalFloors >= 5 && inp.totalArea >= 6000 ? "전체 층수가 5층 이상이고 연면적이 6,000㎡ 이상입니다." :
      inp.totalFloors >= 7 ? "전체 층수가 7층 이상입니다." :
      inp.basementFloors >= 3 && inp.basementAreaSum >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 연결살수설비 ──
  let connSprayReq = inp.basementAreaSum >= 150;
  let connSprayReason = inp.basementAreaSum >= 150 ? "지하층 바닥면적 합계가 150㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.";
  if (pd >= YD.D20240517 && inp.hasSmallUndergroundParking && !connSprayReq) {
    connSprayReq = true;
    connSprayReason = "지하 차고·주차장 바닥면적이 200㎡ 미만인 소규모 주차장이 있어 설치 대상입니다.";
  }
  results.push(makeResult(categories.fireSupport, "연결살수설비", "",
    connSprayReq ? "required" : "notRequired", connSprayReason, ""));

  // ── 비상콘센트 (기준 동일) ──
  const emConsentReq = inp.aboveGroundFloors >= 11 || (inp.basementFloors >= 3 && inp.basementAreaSum >= 1000);
  results.push(makeResult(categories.fireSupport, "비상콘센트설비", "",
    emConsentReq ? "required" : "notRequired",
    inp.aboveGroundFloors >= 11 ? "지상층수가 11층 이상입니다." :
      inp.basementFloors >= 3 && inp.basementAreaSum >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 무선통신보조설비 ──
  const radioBase = inp.basementAreaSum >= 3000 || (inp.basementFloors >= 3 && inp.basementAreaSum >= 1000);
  const radioHigh = pd >= YD.D20120914 && inp.aboveGroundFloors >= 30;
  results.push(makeResult(categories.fireSupport, "무선통신보조설비", "",
    radioBase || radioHigh ? "required" : "notRequired",
    inp.basementAreaSum >= 3000 ? "지하층 바닥면적 합계가 3,000㎡ 이상입니다." :
      inp.basementFloors >= 3 && inp.basementAreaSum >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." :
      radioHigh ? "지상층수가 30층 이상으로 16층 이상 부분에 설치 대상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  return results;
}

function yearEvaluateLodging(inp) {
  const results = [];
  const { pd } = inp;
  const ag = inp.aboveGroundFloors;
  const bf = inp.basementFloors;
  const ba = inp.basementAreaSum;
  const ta = inp.totalArea;
  const tf = inp.totalFloors;
  const la = inp.lodgingArea;
  const wl = inp.windowlessArea;
  const bsmtAvg = bf > 0 ? ba / bf : 0;

  const hasBasement150 = bf > 0 && bsmtAvg >= 150;
  const hasBasement300 = bf > 0 && bsmtAvg >= 300;
  const hasBasement450 = bf > 0 && bsmtAvg >= 450;
  const hasBasement1000 = bf > 0 && bsmtAvg >= 1000;
  const hasWindowless150 = inp.hasWindowlessFloor && wl >= 150;
  const hasWindowless300 = inp.hasWindowlessFloor && wl >= 300;
  const hasWindowless450 = inp.hasWindowlessFloor && wl >= 450;
  const hasWindowless1000 = inp.hasWindowlessFloor && wl >= 1000;

  // ── 소화기구 ──
  results.push(makeResult(categories.extinguishing, "소화기구", "",
    ta >= 33 ? "required" : "notRequired",
    ta >= 33 ? "연면적이 33㎡ 이상입니다." : "연면적이 33㎡ 미만입니다.", ""));

  // ── 옥내소화전설비 (기준 20년 동일) ──
  const indoorHydrantReq = ta >= 1500 || hasBasement300 || hasWindowless300 || (ag >= 4 && inp.hasLargeTargetFloor);
  results.push(makeResult(categories.extinguishing, "옥내소화전설비", "",
    indoorHydrantReq ? "required" : "notRequired",
    ta >= 1500 ? "연면적이 1,500㎡ 이상입니다." :
    hasBasement300 ? "지하층 바닥면적이 300㎡ 이상인 층이 있습니다." :
    hasWindowless300 ? "무창층 바닥면적이 300㎡ 이상인 층이 있습니다." :
    inp.hasLargeTargetFloor ? "4층 이상 층 중 바닥면적 300㎡ 이상인 층이 있습니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 스프링클러설비 ──
  let sprinklerReq = false;
  let sprinklerReason = "";
  if (pd >= YD.D20040530 && pd < YD.D20170128) {
    sprinklerReq = ag >= 11 || inp.lodgingHasLargeFloorFor1000;
    sprinklerReason = ag >= 11 ? "층수가 11층 이상으로 전층 설치 대상입니다." :
      inp.lodgingHasLargeFloorFor1000 ? "지하층·무창층·4층 이상 층 중 바닥면적 1,000㎡ 이상인 층이 있어 해당 층에 설치 대상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else if (pd >= YD.D20170128 && pd < YD.D20221201) {
    sprinklerReq = ag >= 6;
    sprinklerReason = ag >= 6 ? "층수가 6층 이상으로 전층 설치 대상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else if (pd >= YD.D20221201) {
    sprinklerReq = ag >= 6 || la >= 600;
    sprinklerReason = ag >= 6 ? "층수가 6층 이상으로 전층 설치 대상입니다." :
      la >= 600 ? "숙박시설 사용 바닥면적이 600㎡ 이상으로 전층 설치 대상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.";
  }
  results.push(makeResult(categories.extinguishing, "스프링클러설비", "",
    sprinklerReq ? "required" : "notRequired", sprinklerReason, ""));

  // ── 간이스프링클러설비 ──
  let simpleSprinklerReq = false;
  let simpleSprinklerReason = "";
  if (sprinklerReq) {
    simpleSprinklerReason = "스프링클러설비 설치 대상이므로 간이스프링클러설비는 제외됩니다.";
  } else if (pd >= YD.D20040530 && pd < YD.D20130210) {
    simpleSprinklerReason = "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else if (pd >= YD.D20130210 && pd < YD.D20221201) {
    simpleSprinklerReason = "현재 입력 기준으로는 설치 대상이 아닙니다.";
    simpleSprinklerReq = false;
    results.push(makeResult(categories.extinguishing, "간이스프링클러설비", "", "notRequired",
      simpleSprinklerReason, ""));
    // 물분무 이하 계속
    const waterSprayReq = inp.lodgingIndoorParkingArea >= 200 || inp.lodgingMechanicalParkingCapacity >= 20 || inp.lodgingElectricalRoomArea >= 300;
    results.push(makeResult(categories.extinguishing, "물분무등소화설비", "",
      waterSprayReq ? "required" : "notRequired",
      buildWaterSprayReason(0, inp.lodgingIndoorParkingArea, inp.lodgingMechanicalParkingCapacity, inp.lodgingElectricalRoomArea), ""));
    results.push(makeResult(categories.extinguishing, "옥외소화전설비", "",
      inp.lodgingFirstSecondFloorArea >= 9000 ? "required" : "notRequired",
      inp.lodgingFirstSecondFloorArea >= 9000 ? "지상 1층과 2층의 바닥면적 합계가 9,000㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    const emergAlarm = ta >= 400 || hasBasement150 || hasWindowless150;
    results.push(makeResult(categories.alarm, "비상경보설비", "",
      emergAlarm ? "required" : "notRequired",
      ta >= 400 ? "연면적이 400㎡ 이상입니다." :
      hasBasement150 ? "지하층 바닥면적이 150㎡ 이상입니다." :
      hasWindowless150 ? "무창층 바닥면적이 150㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    const autoDetReq = ta >= 600;
    results.push(makeResult(categories.alarm, "자동화재탐지설비", "",
      autoDetReq ? "required" : "notRequired",
      autoDetReq ? "연면적이 600㎡ 이상인 숙박시설입니다." :
      "연면적이 600㎡ 미만이어서 설치 대상이 아닙니다.", ""));
    results.push(makeResult(categories.alarm, "시각경보기", "",
      autoDetReq ? "required" : "notRequired",
      autoDetReq ? "자동화재탐지설비 설치 대상 숙박시설에 함께 설치해야 합니다." :
      "자동화재탐지설비 설치 대상이 아닙니다.", ""));
    results.push(makeResult(categories.alarm, "비상방송설비", "",
      ta >= 3500 || ag >= 11 || bf >= 3 ? "required" : "notRequired",
      ta >= 3500 ? "연면적이 3,500㎡ 이상입니다." : ag >= 11 ? "지상층수가 11층 이상입니다." : bf >= 3 ? "지하층수가 3층 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    results.push(makeResult(categories.alarm, "자동화재속보설비", "", "notRequired", "숙박시설은 자동화재속보설비 설치 대상이 아닙니다.", ""));
    results.push(makeResult(categories.alarm, "가스누설경보기", "",
      inp.lodgingHasGasFacility ? "required" : "notRequired",
      inp.lodgingHasGasFacility ? "가스시설이 설치된 숙박시설입니다." : "가스시설이 없어 설치 대상이 아닙니다.", ""));
    results.push(makeResult(categories.evacuation, "피난기구(구조대·완강기 등)", "",
      ag >= 3 ? "required" : "notRequired",
      ag >= 3 ? "숙박시설은 3층 이상 10층 이하 층에 피난기구를 설치해야 합니다." : "3층 이상 층이 없어 설치 대상이 아닙니다.", ""));
    results.push(makeResult(categories.evacuation, "인명구조기구(방열복·공기호흡기)", "",
      inp.lodgingIsTouristHotel && tf >= 7 ? "required" : "notRequired",
      inp.lodgingIsTouristHotel && tf >= 7 ? "지하층을 포함한 층수가 7층 이상인 관광호텔로 설치 대상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    results.push(makeResult(categories.evacuation, "유도등(피난구유도등·통로유도등)", "", "required", "모든 숙박시설에 설치해야 합니다.", ""));
    results.push(makeResult(categories.evacuation, "비상조명등", "",
      (tf >= 5 && ta >= 3000) || hasBasement450 || hasWindowless450 ? "required" : "notRequired",
      tf >= 5 && ta >= 3000 ? "전체 층수가 5층 이상이고 연면적이 3,000㎡ 이상입니다." :
      hasBasement450 ? "지하층 바닥면적이 450㎡ 이상입니다." :
      hasWindowless450 ? "무창층 바닥면적이 450㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    results.push(makeResult(categories.evacuation, "휴대용비상조명등", "", "required", "면적·층수에 관계없이 모든 숙박시설에 설치해야 합니다.", ""));
    results.push(makeResult(categories.waterSupply, "상수도소화용수설비", "", ta >= 5000 ? "required" : "notRequired", ta >= 5000 ? "연면적이 5,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    const smokeReq = inp.lodgingBasementAreaForSmoke >= 1000;
    results.push(makeResult(categories.fireSupport, "제연설비", "", smokeReq ? "required" : "notRequired", smokeReq ? "지하층·무창층 내 숙박시설 사용 바닥면적 합계가 1,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    const standpipeReq = (tf >= 5 && ta >= 6000) || tf >= 7 || (bf >= 3 && ba >= 1000);
    results.push(makeResult(categories.fireSupport, "연결송수관설비", "", standpipeReq ? "required" : "notRequired",
      tf >= 5 && ta >= 6000 ? "전체 층수가 5층 이상이고 연면적이 6,000㎡ 이상입니다." :
      tf >= 7 ? "전체 층수가 7층 이상입니다." :
      bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." :
      "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    results.push(makeResult(categories.fireSupport, "연결살수설비", "", ba >= 150 ? "required" : "notRequired", ba >= 150 ? "지하층 바닥면적 합계가 150㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    const emConsentReq = ag >= 11 || (bf >= 3 && ba >= 1000);
    results.push(makeResult(categories.fireSupport, "비상콘센트설비", "", emConsentReq ? "required" : "notRequired", ag >= 11 ? "지상층수가 11층 이상입니다." : bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    const radioBase = ba >= 3000 || (bf >= 3 && ba >= 1000);
    const radioHigh = pd >= YD.D20120914 && ag >= 30;
    results.push(makeResult(categories.fireSupport, "무선통신보조설비", "", radioBase || radioHigh ? "required" : "notRequired", ba >= 3000 ? "지하층 바닥면적 합계가 3,000㎡ 이상입니다." : bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." : radioHigh ? "지상층수가 30층 이상으로 16층 이상 부분에 설치 대상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));
    return results;
  } else {
    // pd >= YD.D20221201: 300~600㎡ 미만 → 간이스프링클러
    simpleSprinklerReq = la >= 300 && la < 600;
    simpleSprinklerReason = simpleSprinklerReq
      ? "숙박시설 사용 바닥면적이 300㎡ 이상 600㎡ 미만으로 간이스프링클러설비 설치 대상입니다."
      : la < 300 ? "숙박시설 사용 바닥면적이 300㎡ 미만이어서 설치 대상이 아닙니다."
      : "현재 입력 기준으로는 설치 대상이 아닙니다.";
  }
  results.push(makeResult(categories.extinguishing, "간이스프링클러설비", "",
    simpleSprinklerReq ? "required" : "notRequired",
    sprinklerReq ? "스프링클러설비 설치 대상이므로 제외됩니다." : simpleSprinklerReason, ""));

  // ── 물분무등소화설비 ──
  const waterSprayReq = inp.lodgingIndoorParkingArea >= 200 || inp.lodgingMechanicalParkingCapacity >= 20 || inp.lodgingElectricalRoomArea >= 300;
  results.push(makeResult(categories.extinguishing, "물분무등소화설비", "",
    waterSprayReq ? "required" : "notRequired",
    buildWaterSprayReason(0, inp.lodgingIndoorParkingArea, inp.lodgingMechanicalParkingCapacity, inp.lodgingElectricalRoomArea), ""));

  // ── 옥외소화전설비 ──
  results.push(makeResult(categories.extinguishing, "옥외소화전설비", "",
    inp.lodgingFirstSecondFloorArea >= 9000 ? "required" : "notRequired",
    inp.lodgingFirstSecondFloorArea >= 9000 ? "지상 1층과 2층의 바닥면적 합계가 9,000㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 비상경보설비 ──
  const emergAlarm = ta >= 400 || hasBasement150 || hasWindowless150;
  results.push(makeResult(categories.alarm, "비상경보설비", "",
    emergAlarm ? "required" : "notRequired",
    ta >= 400 ? "연면적이 400㎡ 이상입니다." :
    hasBasement150 ? "지하층 바닥면적이 150㎡ 이상입니다." :
    hasWindowless150 ? "무창층 바닥면적이 150㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 자동화재탐지설비 ──
  let autoDetReq = false;
  let autoDetReason = "";
  if (pd >= YD.D20221201) {
    autoDetReq = true;
    autoDetReason = "2022년 12월 이후 모든 숙박시설은 면적에 관계없이 자동화재탐지설비를 설치해야 합니다.";
  } else {
    autoDetReq = ta >= 600;
    autoDetReason = autoDetReq ? "연면적이 600㎡ 이상인 숙박시설입니다." : "연면적이 600㎡ 미만이어서 설치 대상이 아닙니다.";
  }
  results.push(makeResult(categories.alarm, "자동화재탐지설비", "", autoDetReq ? "required" : "notRequired", autoDetReason, ""));

  // ── 시각경보기 ──
  results.push(makeResult(categories.alarm, "시각경보기", "",
    autoDetReq ? "required" : "notRequired",
    autoDetReq ? "자동화재탐지설비 설치 대상 숙박시설에 함께 설치해야 합니다." :
    "자동화재탐지설비 설치 대상이 아닙니다.", ""));

  // ── 비상방송설비 ──
  const broadcastReq = ta >= 3500 || ag >= 11 || bf >= 3;
  results.push(makeResult(categories.alarm, "비상방송설비", "",
    broadcastReq ? "required" : "notRequired",
    ta >= 3500 ? "연면적이 3,500㎡ 이상입니다." :
    ag >= 11 ? "지상층수가 11층 이상입니다." :
    bf >= 3 ? "지하층수가 3층 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 자동화재속보설비 ── (숙박시설 해당 없음)
  results.push(makeResult(categories.alarm, "자동화재속보설비", "", "notRequired",
    "숙박시설은 자동화재속보설비 설치 대상이 아닙니다.", ""));

  // ── 가스누설경보기 ──
  results.push(makeResult(categories.alarm, "가스누설경보기", "",
    inp.lodgingHasGasFacility ? "required" : "notRequired",
    inp.lodgingHasGasFacility ? "가스시설이 설치된 숙박시설입니다." : "가스시설이 없어 설치 대상이 아닙니다.", ""));

  // ── 피난기구 ──
  results.push(makeResult(categories.evacuation, "피난기구(구조대·완강기 등)", "",
    ag >= 3 ? "required" : "notRequired",
    ag >= 3 ? "숙박시설은 3층 이상 10층 이하 층에 피난기구를 설치해야 합니다." :
    "3층 이상 층이 없어 설치 대상이 아닙니다.", ""));

  // ── 인명구조기구 ──
  results.push(makeResult(categories.evacuation, "인명구조기구(방열복·공기호흡기)", "",
    inp.lodgingIsTouristHotel && tf >= 7 ? "required" : "notRequired",
    inp.lodgingIsTouristHotel && tf >= 7 ? "지하층을 포함한 층수가 7층 이상인 관광호텔로 설치 대상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 유도등 ──
  results.push(makeResult(categories.evacuation, "유도등(피난구유도등·통로유도등)", "", "required",
    "모든 숙박시설에 피난구유도등, 통로유도등, 유도표지를 설치해야 합니다.", ""));

  // ── 비상조명등 ──
  const emLightReq = (tf >= 5 && ta >= 3000) || hasBasement450 || hasWindowless450;
  results.push(makeResult(categories.evacuation, "비상조명등", "",
    emLightReq ? "required" : "notRequired",
    tf >= 5 && ta >= 3000 ? "전체 층수가 5층 이상이고 연면적이 3,000㎡ 이상입니다." :
    hasBasement450 ? "지하층 바닥면적이 450㎡ 이상입니다." :
    hasWindowless450 ? "무창층 바닥면적이 450㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 휴대용비상조명등 ── (숙박시설 전용, 면적·층수 불문 전체)
  results.push(makeResult(categories.evacuation, "휴대용비상조명등", "", "required",
    "면적·층수에 관계없이 모든 숙박시설에 설치해야 합니다.", ""));

  // ── 소화용수설비 ──
  results.push(makeResult(categories.waterSupply, "상수도소화용수설비", "",
    ta >= 5000 ? "required" : "notRequired",
    ta >= 5000 ? "연면적이 5,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 제연설비 ──
  const smokeReq = inp.lodgingBasementAreaForSmoke >= 1000;
  results.push(makeResult(categories.fireSupport, "제연설비", "",
    smokeReq ? "required" : "notRequired",
    smokeReq ? "지하층·무창층 내 숙박시설 사용 바닥면적 합계가 1,000㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 연결송수관설비 ──
  const standpipeReq = (tf >= 5 && ta >= 6000) || tf >= 7 || (bf >= 3 && ba >= 1000);
  results.push(makeResult(categories.fireSupport, "연결송수관설비", "",
    standpipeReq ? "required" : "notRequired",
    tf >= 5 && ta >= 6000 ? "전체 층수가 5층 이상이고 연면적이 6,000㎡ 이상입니다." :
    tf >= 7 ? "전체 층수가 7층 이상입니다." :
    bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 연결살수설비 ──
  results.push(makeResult(categories.fireSupport, "연결살수설비", "",
    ba >= 150 ? "required" : "notRequired",
    ba >= 150 ? "지하층 바닥면적 합계가 150㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 비상콘센트설비 ──
  const emConsentReq = ag >= 11 || (bf >= 3 && ba >= 1000);
  results.push(makeResult(categories.fireSupport, "비상콘센트설비", "",
    emConsentReq ? "required" : "notRequired",
    ag >= 11 ? "지상층수가 11층 이상입니다." :
    bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 무선통신보조설비 ──
  const radioBase = ba >= 3000 || (bf >= 3 && ba >= 1000);
  const radioHigh = pd >= YD.D20120914 && ag >= 30;
  results.push(makeResult(categories.fireSupport, "무선통신보조설비", "",
    radioBase || radioHigh ? "required" : "notRequired",
    ba >= 3000 ? "지하층 바닥면적 합계가 3,000㎡ 이상입니다." :
    bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." :
    radioHigh ? "지상층수가 30층 이상으로 16층 이상 부분에 설치 대상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  return results;
}

function yearEvaluateElderly(inp) {
  const results = [];
  const { pd } = inp;
  const ag = inp.aboveGroundFloors;
  const bf = inp.basementFloors;
  const ba = inp.basementAreaSum;
  const ta = inp.totalArea;
  const tf = inp.totalFloors;
  const ea = inp.elderlyArea;
  const wl = inp.windowlessArea;
  const isLiving = inp.elderlySubtype === "living";
  const bsmtAvg = bf > 0 ? ba / bf : 0;

  const hasBasement150 = bf > 0 && bsmtAvg >= 150;
  const hasBasement300 = bf > 0 && bsmtAvg >= 300;
  const hasBasement450 = bf > 0 && bsmtAvg >= 450;
  const hasBasement1000 = bf > 0 && bsmtAvg >= 1000;
  const hasWindowless150 = inp.hasWindowlessFloor && wl >= 150;
  const hasWindowless300 = inp.hasWindowlessFloor && wl >= 300;
  const hasWindowless450 = inp.hasWindowlessFloor && wl >= 450;
  const hasWindowless1000 = inp.hasWindowlessFloor && wl >= 1000;

  // ── 소화기구 (면적 불문, 투척용 특례) ──
  results.push(makeResult(categories.extinguishing, "소화기구", "",
    "required",
    "노유자시설은 연면적에 관계없이 설치 대상이며, 투척용 소화용구 등을 전체 소화기 수량의 1/2 이상으로 갖출 수 있습니다.", ""));

  // ── 옥내소화전설비 (기준 20년 동일) ──
  const indoorHydrantReq = ta >= 1500 || hasBasement300 || hasWindowless300 || inp.elderlyHasLargeTargetFloor;
  results.push(makeResult(categories.extinguishing, "옥내소화전설비", "",
    indoorHydrantReq ? "required" : "notRequired",
    ta >= 1500 ? "연면적이 1,500㎡ 이상입니다." :
    hasBasement300 ? "지하층 바닥면적이 300㎡ 이상인 층이 있습니다." :
    hasWindowless300 ? "무창층 바닥면적이 300㎡ 이상입니다." :
    inp.elderlyHasLargeTargetFloor ? "4층 이상 층 중 바닥면적 300㎡ 이상인 층이 있습니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 스프링클러설비 ──
  let sprinklerReq = false;
  let sprinklerReason = "";
  if (pd >= YD.D20040530 && pd < YD.D20130109) {
    sprinklerReq = ta >= 600;
    sprinklerReason = ta >= 600 ? "연면적이 600㎡ 이상인 노유자시설입니다." :
      "연면적이 600㎡ 미만이어서 설치 대상이 아닙니다.";
  } else {
    // 2013.1.9 이후: 해당 용도 사용면적 600㎡
    sprinklerReq = ea >= 600;
    sprinklerReason = ea >= 600 ? "노유자시설 사용 바닥면적 합계가 600㎡ 이상으로 전층 설치 대상입니다." :
      "노유자시설 사용 바닥면적이 600㎡ 미만이어서 설치 대상이 아닙니다.";
  }
  results.push(makeResult(categories.extinguishing, "스프링클러설비", "",
    sprinklerReq ? "required" : "notRequired", sprinklerReason, ""));

  // ── 간이스프링클러설비 ──
  let simpleSprinklerReq = false;
  let simpleSprinklerReason = "";
  if (sprinklerReq) {
    simpleSprinklerReason = "스프링클러설비 설치 대상이므로 간이스프링클러설비는 제외됩니다.";
  } else if (pd < YD.D20080229) {
    simpleSprinklerReason = "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else if (pd >= YD.D20080229 && pd < YD.D20120914) {
    // 300~600㎡ 또는 창살
    if (!isLiving) {
      simpleSprinklerReq = (ea >= 300 && ea < 600) || inp.elderlyHasGrillWindow;
      simpleSprinklerReason = ea >= 300 && ea < 600
        ? "노유자시설 사용 바닥면적이 300㎡ 이상 600㎡ 미만입니다."
        : inp.elderlyHasGrillWindow
        ? "창살이 설치된 노유자시설로 면적에 관계없이 설치 대상입니다."
        : "현재 입력 기준으로는 설치 대상이 아닙니다.";
    } else {
      simpleSprinklerReason = "현재 입력 기준으로는 설치 대상이 아닙니다. (이 시기 생활시설에는 간이스프링클러 조항 없음)";
    }
  } else {
    // 2012.9.14 이후
    if (isLiving) {
      simpleSprinklerReq = true;
      simpleSprinklerReason = "노유자 생활시설은 면적에 관계없이 간이스프링클러설비를 설치해야 합니다.";
    } else {
      simpleSprinklerReq = (ea >= 300 && ea < 600) || inp.elderlyHasGrillWindow;
      simpleSprinklerReason = ea >= 300 && ea < 600
        ? "노유자시설 사용 바닥면적이 300㎡ 이상 600㎡ 미만입니다."
        : inp.elderlyHasGrillWindow
        ? "창살이 설치된 노유자시설로 면적에 관계없이 설치 대상입니다."
        : "현재 입력 기준으로는 설치 대상이 아닙니다.";
    }
  }
  results.push(makeResult(categories.extinguishing, "간이스프링클러설비", "",
    sprinklerReq ? "notRequired" : (simpleSprinklerReq ? "required" : "notRequired"),
    sprinklerReq ? "스프링클러설비 설치 대상이므로 제외됩니다." : simpleSprinklerReason, ""));

  // ── 물분무등소화설비 ──
  const waterSprayReq = inp.elderlyIndoorParkingArea >= 200 || inp.elderlyMechanicalParkingCapacity >= 20 || inp.elderlyElectricalRoomArea >= 300;
  results.push(makeResult(categories.extinguishing, "물분무등소화설비", "",
    waterSprayReq ? "required" : "notRequired",
    buildWaterSprayReason(0, inp.elderlyIndoorParkingArea, inp.elderlyMechanicalParkingCapacity, inp.elderlyElectricalRoomArea), ""));

  // ── 옥외소화전설비 ──
  results.push(makeResult(categories.extinguishing, "옥외소화전설비", "",
    inp.elderlyFirstSecondFloorArea >= 9000 ? "required" : "notRequired",
    inp.elderlyFirstSecondFloorArea >= 9000 ? "지상 1층과 2층의 바닥면적 합계가 9,000㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 비상경보설비 ──
  let emergAlarmReq = ta >= 400 || hasBasement150 || hasWindowless150;
  let emergAlarmReason = ta >= 400 ? "연면적이 400㎡ 이상입니다." :
    hasBasement150 ? "지하층 바닥면적이 150㎡ 이상입니다." :
    hasWindowless150 ? "무창층 바닥면적이 150㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.";
  if (pd >= YD.D20251201 && inp.elderlyHasSmallUndergroundParking) {
    emergAlarmReq = true;
    emergAlarmReason = "지하 차고·주차장이 200㎡ 미만으로 건물 전층에 설치 대상입니다.";
  }
  results.push(makeResult(categories.alarm, "비상경보설비", "",
    emergAlarmReq ? "required" : "notRequired", emergAlarmReason, ""));

  // ── 자동화재탐지설비 ──
  let autoDetReq = false;
  let autoDetReason = "";
  if (pd >= YD.D20120914) {
    if (isLiving) {
      autoDetReq = true;
      autoDetReason = "노유자 생활시설은 면적에 관계없이 자동화재탐지설비를 설치해야 합니다.";
    } else {
      autoDetReq = ta >= 400;
      autoDetReason = ta >= 400 ? "일반 노유자시설로 연면적이 400㎡ 이상입니다." :
        "연면적이 400㎡ 미만이어서 설치 대상이 아닙니다.";
    }
  } else {
    autoDetReq = ta >= 400;
    autoDetReason = ta >= 400 ? "연면적이 400㎡ 이상입니다." : "연면적이 400㎡ 미만이어서 설치 대상이 아닙니다.";
  }
  results.push(makeResult(categories.alarm, "자동화재탐지설비", "", autoDetReq ? "required" : "notRequired", autoDetReason, ""));

  // ── 시각경보기 ──
  results.push(makeResult(categories.alarm, "시각경보기", "",
    autoDetReq ? "required" : "notRequired",
    autoDetReq ? "자동화재탐지설비 설치 대상 노유자시설에 함께 설치해야 합니다." :
    "자동화재탐지설비 설치 대상이 아닙니다.", ""));

  // ── 비상방송설비 ──
  const broadcastReq = ta >= 3500 || ag >= 11 || bf >= 3;
  results.push(makeResult(categories.alarm, "비상방송설비", "",
    broadcastReq ? "required" : "notRequired",
    ta >= 3500 ? "연면적이 3,500㎡ 이상입니다." :
    ag >= 11 ? "지상층수가 11층 이상입니다." :
    bf >= 3 ? "지하층수가 3층 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 자동화재속보설비 ──
  let autoDispatchReq = false;
  let autoDispatchReason = "";
  if (pd >= YD.D20120914) {
    if (isLiving) {
      if (inp.elderlyHas24HourStaff) {
        autoDispatchReq = false;
        autoDispatchReason = "노유자 생활시설이지만 24시간 상주 근무자가 있어 설치를 면제할 수 있습니다.";
      } else {
        autoDispatchReq = true;
        autoDispatchReason = "노유자 생활시설은 면적에 관계없이 자동화재속보설비를 설치해야 합니다.";
      }
    } else {
      // 일반 노유자시설: 500㎡ 이상 층이 있는 경우
      if (inp.elderlyHasFloor500Plus) {
        if (inp.elderlyHas24HourStaff) {
          autoDispatchReq = false;
          autoDispatchReason = "바닥면적 500㎡ 이상 층이 있으나 24시간 상주 근무자가 있어 설치를 면제할 수 있습니다.";
        } else {
          autoDispatchReq = true;
          autoDispatchReason = "바닥면적이 500㎡ 이상인 층이 있습니다.";
        }
      } else {
        autoDispatchReason = "바닥면적 500㎡ 이상인 층이 없어 설치 대상이 아닙니다.";
      }
    }
  } else {
    // 2004~2012: 500㎡ 이상 층
    if (inp.elderlyHasFloor500Plus) {
      autoDispatchReq = true;
      autoDispatchReason = "바닥면적이 500㎡ 이상인 층이 있습니다.";
    } else {
      autoDispatchReason = "바닥면적 500㎡ 이상인 층이 없어 설치 대상이 아닙니다.";
    }
  }
  results.push(makeResult(categories.alarm, "자동화재속보설비", "", autoDispatchReq ? "required" : "notRequired", autoDispatchReason, ""));

  // ── 가스누설경보기 ──
  results.push(makeResult(categories.alarm, "가스누설경보기", "",
    inp.elderlyHasGasFacility ? "required" : "notRequired",
    inp.elderlyHasGasFacility ? "가스시설이 설치된 노유자시설입니다." : "가스시설이 없어 설치 대상이 아닙니다.", ""));

  // ── 피난기구 ──
  let escapeReason = "";
  let escapeReq = false;
  if (pd >= YD.D20160101) {
    // 2016년 이후: 피난층이 아닌 1층·2층도 포함 (실질적으로 모든 층 3~10층)
    escapeReq = ag >= 1;
    escapeReason = ag >= 1
      ? "노유자시설은 피난층이 아닌 지상 1층·2층을 포함하여 3층 이상 10층 이하 층에 설치해야 합니다. (2016년 이후 적용)"
      : "지상층이 없어 설치 대상이 아닙니다.";
  } else {
    escapeReq = ag >= 3;
    escapeReason = ag >= 3 ? "3층 이상 10층 이하 층에 피난기구를 설치해야 합니다." :
      "3층 이상 층이 없어 설치 대상이 아닙니다.";
  }
  results.push(makeResult(categories.evacuation, "피난기구(구조대·미끄럼대 등)", "",
    escapeReq ? "required" : "notRequired", escapeReason, ""));

  // ── 유도등 ──
  results.push(makeResult(categories.evacuation, "유도등(피난구유도등·통로유도등)", "", "required",
    "모든 노유자시설에 피난구유도등, 통로유도등, 유도표지를 설치해야 합니다.", ""));

  // ── 비상조명등 ──
  const emLightReq = (tf >= 5 && ta >= 3000) || hasBasement450 || hasWindowless450;
  results.push(makeResult(categories.evacuation, "비상조명등", "",
    emLightReq ? "required" : "notRequired",
    tf >= 5 && ta >= 3000 ? "전체 층수가 5층 이상이고 연면적이 3,000㎡ 이상입니다." :
    hasBasement450 ? "지하층 바닥면적이 450㎡ 이상입니다." :
    hasWindowless450 ? "무창층 바닥면적이 450㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 소화용수설비 ──
  results.push(makeResult(categories.waterSupply, "상수도소화용수설비", "",
    ta >= 5000 ? "required" : "notRequired",
    ta >= 5000 ? "연면적이 5,000㎡ 이상입니다." : "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 제연설비 ──
  let smokeReq = false;
  let smokeReason = "";
  if (pd >= YD.D20150701) {
    smokeReq = inp.elderlyBasementAreaForSmoke >= 1000;
    smokeReason = smokeReq
      ? "지하층·무창층 내 노유자시설 사용 바닥면적 합계가 1,000㎡ 이상입니다."
      : "현재 입력 기준으로는 설치 대상이 아닙니다.";
  } else {
    smokeReason = "2015년 7월 1일 이전에는 노유자시설은 제연설비 설치 대상이 아니었습니다.";
  }
  results.push(makeResult(categories.fireSupport, "제연설비", "",
    smokeReq ? "required" : "notRequired", smokeReason, ""));

  // ── 연결송수관설비 ──
  const standpipeReq = (tf >= 5 && ta >= 6000) || tf >= 7 || (bf >= 3 && ba >= 1000);
  results.push(makeResult(categories.fireSupport, "연결송수관설비", "",
    standpipeReq ? "required" : "notRequired",
    tf >= 5 && ta >= 6000 ? "전체 층수가 5층 이상이고 연면적이 6,000㎡ 이상입니다." :
    tf >= 7 ? "전체 층수가 7층 이상입니다." :
    bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 연결살수설비 ──
  results.push(makeResult(categories.fireSupport, "연결살수설비", "",
    ba >= 150 ? "required" : "notRequired",
    ba >= 150 ? "지하층 바닥면적 합계가 150㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 비상콘센트설비 ──
  const emConsentReq = ag >= 11 || (bf >= 3 && ba >= 1000);
  results.push(makeResult(categories.fireSupport, "비상콘센트설비", "",
    emConsentReq ? "required" : "notRequired",
    ag >= 11 ? "지상층수가 11층 이상입니다." :
    bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  // ── 무선통신보조설비 ──
  const radioBase = ba >= 3000 || (bf >= 3 && ba >= 1000);
  const radioHigh = pd >= YD.D20120914 && ag >= 30;
  results.push(makeResult(categories.fireSupport, "무선통신보조설비", "",
    radioBase || radioHigh ? "required" : "notRequired",
    ba >= 3000 ? "지하층 바닥면적 합계가 3,000㎡ 이상입니다." :
    bf >= 3 && ba >= 1000 ? "지하층이 3층 이상이고 지하층 바닥면적 합계가 1,000㎡ 이상입니다." :
    radioHigh ? "지상층수가 30층 이상으로 16층 이상 부분에 설치 대상입니다." :
    "현재 입력 기준으로는 설치 대상이 아닙니다.", ""));

  return results;
}

// ── 연도별 탐색기: 제외·대체 항목 계산 ──

function yearBuildLodgingExceptionItems(results, inp) {
  const exceptionItems = [];
  const autoDetection = results.find((r) => r.name === "자동화재탐지설비");
  const emergencyAlarm = results.find((r) => r.name === "비상경보설비");
  const singleDetector = results.find((r) => r.name === "단독경보형 감지기");
  const sprinkler = results.find((r) => r.name === "스프링클러설비");
  const simpleSprinkler = results.find((r) => r.name === "간이스프링클러설비");
  const drencher = results.find((r) => r.name === "연결살수설비");
  const waterSpray = results.find((r) => r.name === "물분무등소화설비");
  const emLight = results.find((r) => r.name === "비상조명등");
  const portableLight = results.find((r) => r.name === "휴대용비상조명등");
  const parkingCondition = inp.lodgingIndoorParkingArea >= 200 || inp.lodgingMechanicalParkingCapacity >= 20;

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
  if (emLight && emLight.status === "required" && portableLight && portableLight.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "휴대용비상조명등", status: "review", reason: "숙박시설 복도에 비상조명등이 설치되면 객실에 설치하는 휴대용비상조명등은 제외됩니다." });
  }
  if (waterSpray && waterSpray.status === "required" && parkingCondition) {
    exceptionItems.push({ category: "대체설비", name: "주차장 관련 스프링클러설비 대체 가능", status: "review", reason: "주차 관련 공간은 물분무등소화설비 기준이 적용되나, 대체설비로 스프링클러설비를 설치할 수 있습니다." });
  }
  if (!exceptionItems.length) {
    exceptionItems.push({ category: "안내", name: "설치 제외·대체 없음", status: "notRequired", reason: "현재 입력값 기준으로 별도 면제 또는 대체로 표시할 항목이 없습니다." });
  }
  return exceptionItems;
}

function yearBuildElderlyExceptionItems(results, inp) {
  const exceptionItems = [];
  const autoDetection = results.find((r) => r.name === "자동화재탐지설비");
  const emergencyAlarm = results.find((r) => r.name === "비상경보설비");
  const singleDetector = results.find((r) => r.name === "단독경보형 감지기");
  const sprinkler = results.find((r) => r.name === "스프링클러설비");
  const simpleSprinkler = results.find((r) => r.name === "간이스프링클러설비");
  const drencher = results.find((r) => r.name === "연결살수설비");
  const waterSpray = results.find((r) => r.name === "물분무등소화설비");
  const parkingCondition = inp.elderlyIndoorParkingArea >= 200 || inp.elderlyMechanicalParkingCapacity >= 20;

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

function yearBuildNeighborhoodExceptionItems(results, inp) {
  const exceptionItems = [];
  const autoDetection = results.find((r) => r.name === "자동화재탐지설비");
  const emergencyAlarm = results.find((r) => r.name === "비상경보설비");
  const sprinkler = results.find((r) => r.name === "스프링클러설비");
  const simpleSprinkler = results.find((r) => r.name === "간이스프링클러설비");
  const drencher = results.find((r) => r.name === "연결살수설비");
  const waterSpray = results.find((r) => r.name === "물분무등소화설비");
  const parkingCondition = inp.indoorParkingArea >= 200 || inp.mechanicalParkingCapacity >= 20;

  if (sprinkler && sprinkler.status === "required" && simpleSprinkler && simpleSprinkler.status === "notRequired") {
    exceptionItems.push({ category: "설치 제외", name: "간이스프링클러설비", status: "review", reason: "스프링클러설비가 전층 설치 대상이면 간이스프링클러설비는 제외 대상으로 봅니다." });
  }
  if (sprinkler && sprinkler.status === "required" && drencher && drencher.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "연결살수설비", status: "review", reason: "스프링클러설비가 설치 대상이면 연결살수설비는 설치 제외 대상으로 봅니다." });
  }
  if (autoDetection && autoDetection.status === "required" && emergencyAlarm && emergencyAlarm.status === "required") {
    exceptionItems.push({ category: "설치 제외", name: "비상경보설비", status: "review", reason: "자동화재탐지설비가 설치되면 비상경보설비는 면제 관계로 검토할 수 있습니다." });
  }
  if (waterSpray && waterSpray.status === "required" && parkingCondition) {
    exceptionItems.push({ category: "대체설비", name: "주차장 관련 스프링클러설비 대체 가능", status: "review", reason: "주차 관련 공간의 기본 기준은 물분무등소화설비이며, 그 대체설비로 해당 공간에 스프링클러설비가 설치될 수 있습니다." });
  }
  if (!exceptionItems.length) {
    exceptionItems.push({ category: "안내", name: "설치 제외·대체 없음", status: "notRequired", reason: "현재 입력값 기준으로 별도 면제 또는 대체로 표시할 항목이 없습니다." });
  }
  return exceptionItems;
}

function yearShowResults() {
  if (!yearCurrentStepIsValid()) {
    showToast("현재 질문의 값을 먼저 입력해 주세요.");
    return;
  }
  const pd = yPermitDateInt();
  if (pd < YD.D20040530) {
    showToast("이 도구는 2004년 5월 30일 이후 건축허가 건물만 분석 가능합니다.");
    return;
  }
  const inp = yearNormalizeAnswers();
  const rawPermit = yearState.answers.yPermitDate;
  const [py, pm, pd2] = rawPermit.split("-").map(Number);
  const permitStr = `${py}년 ${pm}월 ${pd2}일`;
  let results;
  let summaryHtml;

  let exceptionItems = [];
  if (inp.occupancyType === "lodging") {
    results = yearEvaluateLodging(inp);
    exceptionItems = yearBuildLodgingExceptionItems(results, inp);
    summaryHtml = `<div class="ib-title">입력값 기준</div>숙박시설, 건축허가일 ${permitStr}, 연면적 ${inp.totalArea}㎡, 숙박 사용면적 ${inp.lodgingArea}㎡, 지상 ${inp.aboveGroundFloors}층, 지하 ${inp.basementFloors}층`;
  } else if (inp.occupancyType === "elderly") {
    results = yearEvaluateElderly(inp);
    exceptionItems = yearBuildElderlyExceptionItems(results, inp);
    const subtypeLabel = inp.elderlySubtype === "living" ? "노유자 생활시설" : "일반 노유자시설";
    summaryHtml = `<div class="ib-title">입력값 기준</div>노유자시설(${subtypeLabel}), 건축허가일 ${permitStr}, 연면적 ${inp.totalArea}㎡, 노유자 사용면적 ${inp.elderlyArea}㎡, 지상 ${inp.aboveGroundFloors}층, 지하 ${inp.basementFloors}층`;
  } else {
    results = yearEvaluateNeighborhood(inp);
    exceptionItems = yearBuildNeighborhoodExceptionItems(results, inp);
    summaryHtml = `<div class="ib-title">입력값 기준</div>근린생활시설, 건축허가일 ${permitStr}, 연면적 ${inp.totalArea}㎡, 지상 ${inp.aboveGroundFloors}층, 지하 ${inp.basementFloors}층`;
  }

  const excludedNames = new Set(exceptionItems.filter((e) => e.category === "설치 제외").map((e) => e.name));
  const hasParkingReplacement = exceptionItems.some((e) => e.category === "대체설비" && e.name === "주차장 관련 스프링클러설비 대체 가능");
  let allRequiredItems = results.filter((r) => r.status === "required" || r.status === "review");
  let requiredItems = allRequiredItems.filter((r) => !excludedNames.has(r.name));

  // 주차 대체설비: 물분무등소화설비를 목록에서 제거하고, 스프링클러(주차 관련)를 별도 항목으로 추가
  // 단, 전기실 조건(전기실 300㎡↑)으로 물분무가 설치되는 경우는 유지
  if (hasParkingReplacement) {
    let elecArea = 0;
    if (inp.occupancyType === "lodging") elecArea = inp.lodgingElectricalRoomArea;
    else if (inp.occupancyType === "elderly") elecArea = inp.elderlyElectricalRoomArea;
    else elecArea = inp.electricalRoomArea;

    if (elecArea < 300) {
      // 물분무등소화설비 제거 (주차 조건으로만 설치되는 경우)
      requiredItems = requiredItems.filter((r) => r.name !== "물분무등소화설비");
    }

    // 이미 일반 스프링클러설비가 required(전층)가 아닌 경우에만 주차 전용 항목 추가
    const mainSprinkler = requiredItems.find((r) => r.name === "스프링클러설비");
    if (!mainSprinkler) {
      requiredItems.push({
        category: categories.extinguishing,
        name: "스프링클러설비(주차 관련 대체설비)",
        status: "required",
        reason: "주차 관련 공간은 물분무등소화설비 기준이 적용되지만, 대체설비로 해당 주차 공간에 스프링클러설비를 설치할 수 있습니다.",
      });
    }
  }

  document.getElementById("year-result-summary").innerHTML = summaryHtml;
  renderSimpleRequiredList(requiredItems, "year-required-list");
  renderResultGroup("year-criteria-list", results, [...excludedNames], requiredItems.map((i) => i.name));
  renderResultGroup("year-exception-list", exceptionItems);

  document.getElementById("year-question-card").classList.add("hidden");
  document.getElementById("year-result-card").classList.remove("hidden");
  document.getElementById("year-prog-wrap").classList.add("hidden");
  yearScrollToTop();
}

function yearWizardRestart() {
  yearState.currentStep = 0;
  const ya = yearState.answers;
  ya.yOccupancyType = "neighborhood";
  ya.yPermitDate = "2019-02-18";
  ya.yTotalArea = "1500";
  ya.yAboveGroundFloors = "4";
  ya.yBasementFloors = "0";
  ya.yBasementAreaSum = "0";
  ya.yHasWindowlessFloor = "no";
  ya.yWindowlessArea = "";
  ya.yHasLargeTargetFloor = "no";
  ya.yHasLargeFloorFor1000 = "no";
  ya.yNeighborhoodArea = "1500";
  ya.yFacilitySubtype = "general";
  ya.yIsPostpartum = "no";
  ya.yPostpartumAreaRange = "under600";
  ya.yIsClinicWithInpatient = "no";
  ya.yHasHemodialysis = "no";
  ya.yHas24HourStaff = "no";
  ya.yFirstSecondFloorArea = "750";
  ya.yIndoorParkingArea = "";
  ya.yMechanicalParkingCapacity = "";
  ya.yElectricalRoomArea = "";
  ya.ySmokeControlArea = "0";
  ya.yHasSmallUndergroundParking = "no";
  // 숙박시설 전용
  ya.yLodgingArea = "1500";
  ya.yLodgingIsTouristHotel = "no";
  ya.yLodgingHasLargeFloorFor1000 = "no";
  ya.yLodgingHasGasFacility = "no";
  ya.yLodgingFirstSecondFloorArea = "750";
  ya.yLodgingIndoorParkingArea = "";
  ya.yLodgingMechanicalParkingCapacity = "";
  ya.yLodgingElectricalRoomArea = "";
  ya.yLodgingBasementAreaForSmoke = "0";
  // 노유자시설 전용
  ya.yElderlySubtype = "general";
  ya.yElderlyArea = "1500";
  ya.yElderlyHasLargeTargetFloor = "no";
  ya.yElderlyHasGrillWindow = "no";
  ya.yElderlyHasGasFacility = "no";
  ya.yElderlyHasFloor500Plus = "no";
  ya.yElderlyHas24HourStaff = "no";
  ya.yElderlyFirstSecondFloorArea = "750";
  ya.yElderlyIndoorParkingArea = "";
  ya.yElderlyMechanicalParkingCapacity = "";
  ya.yElderlyElectricalRoomArea = "";
  ya.yElderlyBasementAreaForSmoke = "0";
  ya.yElderlyHasSmallUndergroundParking = "no";

  document.getElementById("year-question-card").classList.remove("hidden");
  document.getElementById("year-result-card").classList.add("hidden");
  document.getElementById("year-prog-wrap").classList.remove("hidden");
  yearRenderCurrentStep();
}

document.getElementById("back-from-explorer-year").addEventListener("click", () => showScreen("home"));
document.getElementById("open-explorer-year").addEventListener("click", () => {
  showScreen("explorerYear");
  yearWizardRestart();
});
document.getElementById("year-prev-btn").addEventListener("click", () => yearMoveStep(-1));
document.getElementById("year-next-btn").addEventListener("click", () => {
  const activeSteps = yearGetActiveSteps();
  if (yearState.currentStep === activeSteps.length - 1) yearShowResults();
  else yearMoveStep(1);
});
document.getElementById("year-restart-btn").addEventListener("click", () => yearWizardRestart());
document.getElementById("back-from-date").addEventListener("click", () => showScreen("home"));
document.getElementById("back-from-guide").addEventListener("click", () => showScreen("home"));
document.getElementById("open-guide").addEventListener("click", () => showScreen("guide"));

// 메일 링크: 모바일은 mailto 그대로, PC는 Gmail 웹 작성 페이지로
(function initMailLink() {
  const mailLink = document.querySelector(".contact-right-link");
  if (!mailLink) return;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile) {
    mailLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(
        "https://mail.google.com/mail/?view=cm&fs=1&to=carrotcakehope%40gmail.com&su=%EC%98%88%EB%B0%A9GPT%20%EA%B1%B4%EC%9D%98%EC%82%AC%ED%95%AD",
        "_blank"
      );
    });
  }
})();
document.getElementById("prev-step").addEventListener("click", () => moveStep(-1));
document.getElementById("next-step").addEventListener("click", () => {
  const activeSteps = getActiveSteps();
  const currentStep = activeSteps[state.currentStep];
  if (explorerRuntime.mode === "year" && state.currentStep === activeSteps.length - 1) {
    showToast("연도별_테스트중은 아직 결과 계산을 준비 중입니다. 질문 흐름만 테스트할 수 있습니다.");
    return;
  }
  if (currentStep?.key === "hasMultiuseBusiness" && state.answers.hasMultiuseBusiness === "no") {
    if (explorerRuntime.mode === "year") {
      showToast("연도별_테스트중은 아직 결과 계산을 준비 중입니다. 질문 흐름만 테스트할 수 있습니다.");
      return;
    }
    showResults();
    return;
  }
  if (currentStep?.key === "lodgingHasMultiuseBusiness" && state.answers.lodgingHasMultiuseBusiness === "no") {
    if (explorerRuntime.mode === "year") {
      showToast("연도별_테스트중은 아직 결과 계산을 준비 중입니다. 질문 흐름만 테스트할 수 있습니다.");
      return;
    }
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

    // 연도별 탐색기
    if (current === "explorerYear") {
      const yearResultCard = document.getElementById("year-result-card");
      if (yearResultCard && !yearResultCard.classList.contains("hidden")) {
        document.getElementById("year-restart-btn").click();
        return;
      }
      if (yearState.currentStep > 0) {
        yearMoveStep(-1);
        return;
      }
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

// ── 자체점검 보고서 읽는법 ────────────────────────────────────────

pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.js';

let _pdfDocCache = null;

function getPdfDoc() {
  if (_pdfDocCache) return Promise.resolve(_pdfDocCache);
  return fetch('./report-guide.pdf')
    .then(function (res) {
      if (!res.ok) throw new Error('report-guide.pdf 파일을 찾을 수 없습니다 (HTTP ' + res.status + ')');
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
    })
    .then(function (doc) {
      _pdfDocCache = doc;
      return doc;
    });
}

function renderPdfPageToCanvas(canvas, pageNum) {
  var wrapper = canvas.parentElement;
  return getPdfDoc()
    .then(function (pdf) { return pdf.getPage(pageNum); })
    .then(function (page) {
      var containerWidth = wrapper.clientWidth || window.innerWidth - 32;
      var dpr = window.devicePixelRatio || 1;
      var base = page.getViewport({ scale: 1 });
      var scale = containerWidth / base.width;
      var vp = page.getViewport({ scale: scale * dpr });
      canvas.width = vp.width;
      canvas.height = vp.height;
      canvas.style.width = containerWidth + 'px';
      canvas.style.height = (base.height * scale) + 'px';
      return page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
    });
}

function createPdfBlock(pageNum) {
  var wrapper = document.createElement('div');
  wrapper.className = 'rg-pdf-wrapper';

  var loading = document.createElement('div');
  loading.className = 'rg-pdf-loading';
  loading.textContent = pageNum + '페이지 불러오는 중…';
  wrapper.appendChild(loading);

  var canvas = document.createElement('canvas');
  canvas.className = 'rg-pdf-canvas';
  canvas.style.display = 'none';
  wrapper.appendChild(canvas);

  requestAnimationFrame(function () {
    renderPdfPageToCanvas(canvas, pageNum)
      .then(function () {
        loading.remove();
        canvas.style.display = 'block';
      })
      .catch(function (err) {
        console.error('PDF load error (page ' + pageNum + '):', err);
        // PDF.js 실패 시 iframe fallback
        canvas.remove();
        loading.remove();
        var iframe = document.createElement('iframe');
        iframe.className = 'rg-pdf-iframe';
        iframe.src = './report-guide.pdf#page=' + pageNum;
        wrapper.appendChild(iframe);
      });
  });
  return wrapper;
}

function createCroppedPdfBlock(pageNum, searchText, nextSearchText) {
  var outer = document.createElement('div');
  outer.className = 'rg-pdf-wrapper';

  var loading = document.createElement('div');
  loading.className = 'rg-pdf-loading';
  loading.textContent = '불러오는 중…';
  outer.appendChild(loading);

  requestAnimationFrame(function () {
    var containerWidth = outer.clientWidth || window.innerWidth - 32;
    var dpr = window.devicePixelRatio || 1;
    var pageObj;

    getPdfDoc()
      .then(function (pdf) { return pdf.getPage(pageNum); })
      .then(function (page) {
        pageObj = page;
        return page.getTextContent();
      })
      .then(function (tc) {
        var baseVp = pageObj.getViewport({ scale: 1 });
        var scale = containerWidth / baseVp.width;
        var renderVp = pageObj.getViewport({ scale: scale * dpr });
        var pageH = baseVp.height;
        var items = tc.items;

        var topPdfY = null, bottomPdfY = null;
        var i, j;

        for (i = 0; i < items.length; i++) {
          if (searchText && items[i].str && items[i].str.indexOf(searchText) >= 0) {
            topPdfY = items[i].transform[5] + (items[i].height || 12);
            break;
          }
        }

        if (topPdfY !== null && nextSearchText) {
          for (j = 0; j < items.length; j++) {
            if (items[j].str && items[j].str.indexOf(nextSearchText) >= 0) {
              bottomPdfY = items[j].transform[5] + (items[j].height || 12);
              break;
            }
          }
        }

        var PAD = 8;
        var topCanvasY = topPdfY !== null
          ? Math.max(0, (pageH - topPdfY) * scale - PAD)
          : 0;

        var clipHeight = null;
        if (topPdfY !== null && bottomPdfY !== null) {
          clipHeight = Math.max(40, (pageH - bottomPdfY) * scale - topCanvasY + PAD * 2);
        } else if (topPdfY !== null) {
          clipHeight = Math.max(60, pageH * scale - topCanvasY);
        }

        if (clipHeight !== null) {
          outer.style.height = clipHeight + 'px';
        }

        var canvas = document.createElement('canvas');
        canvas.className = 'rg-pdf-canvas';
        canvas.width = renderVp.width;
        canvas.height = renderVp.height;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = (pageH * scale) + 'px';
        if (topCanvasY > 0) canvas.style.marginTop = '-' + topCanvasY + 'px';
        canvas.style.display = 'none';

        loading.remove();
        outer.appendChild(canvas);

        return pageObj.render({ canvasContext: canvas.getContext('2d'), viewport: renderVp }).promise
          .then(function () { canvas.style.display = 'block'; });
      })
      .catch(function (err) {
        console.error('PDF crop error (page ' + pageNum + '):', err);
        loading.remove();
        var iframe = document.createElement('iframe');
        iframe.className = 'rg-pdf-iframe';
        iframe.src = './report-guide.pdf#page=' + pageNum;
        outer.appendChild(iframe);
      });
  });

  return outer;
}

function rgInfoBox(type, title, body) {
  var box = document.createElement('div');
  box.className = 'info-box ' + type;
  box.innerHTML = '<div class="ib-title">' + title + '</div>' + body;
  return box;
}

function rgSectionLabel(text) {
  var el = document.createElement('p');
  el.className = 'section-label';
  el.textContent = text;
  return el;
}

function appendRgPage(container, pageNum) {
  container.appendChild(rgSectionLabel(pageNum + '페이지'));
  container.appendChild(createPdfBlock(pageNum));
}

// 설비 ID → 점검표 이미지 경로 (image 폴더에 파일 추가 시 여기에 등록)
const RG_SECTION_IMAGES = {
  'w03': './image/옥내소화전.png',
  'w04': './image/스프링클러설비.png',
  'a05': './image/자동화재탐지설비.png',
};

const RG_FACILITY_GROUPS = [
  {
    id: 'water', sectionLabel: '3-3', page: 5, name: '수계소화설비',
    items: [
      { id: 'w01', label: '소화기구',                          st: '소화기구' },
      { id: 'w02', label: '자동소화장치',                      st: '자동소화장치' },
      { id: 'w03', label: '옥내소화전설비',                    st: '옥내소화전' },
      { id: 'w04', label: '스프링클러설비',                    st: '스프링클러설비' },
      { id: 'w05', label: '간이스프링클러설비',                st: '간이스프링클러' },
      { id: 'w06', label: '화재조기진압용 스프링클러설비',     st: '화재조기진압' },
      { id: 'w07', label: '물분무소화설비',                    st: '물분무소화설비' },
      { id: 'w08', label: '미분무소화설비',                    st: '미분무소화설비' },
      { id: 'w09', label: '포소화설비',                        st: '포소화설비' },
      { id: 'w10', label: '강화액소화설비',                    st: '강화액소화설비' },
      { id: 'w11', label: '옥외소화전설비',                    st: '옥외소화전' },
    ],
  },
  {
    id: 'gas', sectionLabel: '3-4', page: 5, name: '가스계·분말소화설비',
    items: [
      { id: 'g01', label: '이산화탄소소화설비',                st: '이산화탄소' },
      { id: 'g02', label: '할론소화설비',                      st: '할론소화설비' },
      { id: 'g03', label: '할로겐화합물 및 불활성기체소화설비',st: '할로겐화합물' },
      { id: 'g04', label: '분말소화설비',                      st: '분말소화설비' },
    ],
  },
  {
    id: 'alarm', sectionLabel: '3-5', page: 6, name: '경보설비',
    items: [
      { id: 'a01', label: '단독경보형감지기',                  st: '단독경보' },
      { id: 'a02', label: '비상경보설비',                      st: '비상경보설비' },
      { id: 'a03', label: '비상방송설비',                      st: '비상방송설비' },
      { id: 'a04', label: '누전경보기',                        st: '누전경보기' },
      { id: 'a05', label: '자동화재탐지설비',                  st: '자동화재탐지' },
      { id: 'a06', label: '자동화재속보설비',                  st: '자동화재속보' },
      { id: 'a07', label: '통합감시시설',                      st: '통합감시시설' },
      { id: 'a08', label: '가스누설경보기',                    st: '가스누설경보기' },
      { id: 'a09', label: '화재알림설비',                      st: '화재알림설비' },
      { id: 'a10', label: '시각경보기',                        st: '시각경보기' },
    ],
  },
  {
    id: 'escape', sectionLabel: '3-6', page: 6, name: '피난구조설비',
    items: [
      { id: 'e01', label: '피난기구',                          st: '피난기구' },
      { id: 'e02', label: '인명구조기구',                      st: '인명구조기구' },
      { id: 'e03', label: '유도등',                            st: '유도등' },
      { id: 'e04', label: '비상조명등',                        st: '비상조명등' },
      { id: 'e05', label: '휴대용 비상조명등',                 st: '휴대용' },
    ],
  },
  {
    id: 'wsupply', sectionLabel: '3-7', page: 6, name: '소화용수설비',
    items: [
      { id: 's01', label: '상수도소화용수설비',                st: '상수도소화용수' },
      { id: 's02', label: '소화수조 및 저수조',               st: '소화수조' },
    ],
  },
  {
    id: 'activity', sectionLabel: '3-8', page: 7, name: '소화활동설비',
    items: [
      { id: 'ac01', label: '제연설비',                         st: '제연설비' },
      { id: 'ac02', label: '연결송수관설비',                   st: '연결송수관' },
      { id: 'ac03', label: '연결살수설비',                     st: '연결살수설비' },
      { id: 'ac04', label: '비상콘센트설비',                   st: '비상콘센트' },
      { id: 'ac05', label: '무선통신보조설비',                 st: '무선통신보조' },
      { id: 'ac06', label: '연소방지설비',                     st: '연소방지설비' },
    ],
  },
];

const rgState = {
  tab: 'overview',
  selected: new Set(),
};

function renderReportGuide() {
  var root = document.getElementById('report-guide-content');
  root.innerHTML = '';

  // ── 탭 바 ──
  var tabDefs = [
    { id: 'overview',  main: '1-2페이지', sub: '보고서 개요' },
    { id: 'checklist', main: '3-4페이지', sub: '소방시설 현황' },
    { id: 'sections',  main: '5-8페이지', sub: '점검표' },
    { id: 'writing',   main: '작성방법',  sub: '9-10페이지' },
  ];

  var tabBar = document.createElement('div');
  tabBar.className = 'rg-tab-bar';

  tabDefs.forEach(function (t) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rg-tab-btn' + (rgState.tab === t.id ? ' active' : '');
    btn.innerHTML =
      '<span class="rg-tab-main">' + t.main + '</span>' +
      '<span class="rg-tab-sub">'  + t.sub  + '</span>';
    btn.addEventListener('click', function () {
      if (rgState.tab !== t.id) {
        rgState.tab = t.id;
        renderReportGuide();
      }
    });
    tabBar.appendChild(btn);
  });
  root.appendChild(tabBar);

  // ── 콘텐츠 ──
  var content = document.createElement('div');
  content.className = 'rg-content';

  if (rgState.tab === 'overview')  renderRgOverview(content);
  if (rgState.tab === 'checklist') renderRgChecklist(content);
  if (rgState.tab === 'sections')  renderRgSections(content);
  if (rgState.tab === 'writing')   renderRgWriting(content);

  root.appendChild(content);
}

// ── 1페이지 아코디언 데이터 ──────────────────────────────────────
const RG_PAGE1_SECTIONS = [
  {
    id: 'p1-type',
    label: '점검 종류',
    img: './image/page 1/page1-점검종류.png',
    desc: [
      '작동기능점검, 종합정밀점검, 최초점검 중 해당하는 □에 ✔ 표시합니다.',
      '3급 소방대상물의 관계인이 직접 점검하는 경우 대부분 <b>작동기능점검</b>에 해당합니다.',
      '최초점검은 신축 건물의 첫 번째 점검 시에만 표시합니다.',
    ],
  },
  {
    id: 'p1-building',
    label: '대상물 정보',
    img: './image/page 1/page1-대상물설명.png',
    desc: [
      '<b>특정소방</b>: 관할 소방서 이름을 기재합니다. (예: 종로소방서 → "종로")',
      '<b>명칭(상호)</b>: 건물 또는 업소명을 기재합니다.',
      '<b>대상물 구분(용도)</b>: 건축물 대장상의 주용도를 기재합니다.',
      '<b>소재지</b>: 건물의 도로명 주소를 기재합니다.',
    ],
  },
  {
    id: 'p1-period',
    label: '점검기간',
    img: './image/page 1/page1-점검기간.png',
    desc: [
      '점검을 실시한 시작일과 종료일을 연·월·일 형식으로 기재합니다.',
      '총 점검일수는 시작일부터 종료일까지의 실제 점검일수를 기재합니다.',
      '하루에 모두 점검했다면 시작일과 종료일을 동일하게 기재하고 총 점검일수는 1로 기재합니다.',
    ],
  },
  {
    id: 'p1-inspector',
    label: '점검자',
    img: './image/page 1/page1-점검자.png',
    desc: [
      '관계인·소방안전관리자·소방시설관리업자 중 해당하는 □에 ✔ 표시하고 성명과 전화번호를 기재합니다.',
      '전자우편 송달 동의 여부를 체크하고, 동의 시 이메일 주소를 기재합니다.',
      '3급 관계인 자체점검의 경우 <b>관계인</b>에 체크합니다.',
    ],
  },
  {
    id: 'p1-personnel',
    label: '점검인력',
    img: './image/page 1/page1-점검인력.png',
    desc: [
      '<b>주된 점검인력</b> 1명은 반드시 기재해야 합니다.',
      '성명, 자격구분(소방시설관리사/소방기술사 등), 자격번호, 점검참여일을 정확히 기재합니다.',
      '보조 점검인력은 실제 점검에 참여한 경우에만 기재합니다.',
      '3급 관계인 자체점검 시 점검인력 란에 관계인 본인 정보를 기재합니다.',
    ],
  },
  {
    id: 'p1-sign',
    label: '제출일 · 서명',
    img: './image/page 1/page1-날짜서명.png',
    desc: [
      '보고서를 제출하는 연·월·일을 기재합니다.',
      '소방시설관리업자·소방안전관리자·관계인이 서명 또는 날인합니다.',
      '<b>관계인은 반드시 직접 서명(또는 인)해야 합니다.</b>',
      '소방본부장 또는 소방서장 앞으로 제출하는 공식 문서임을 확인합니다.',
    ],
  },
];

function createRgAccordion(section) {
  var wrap = document.createElement('div');
  wrap.className = 'rg-accordion';

  var header = document.createElement('button');
  header.type = 'button';
  header.className = 'rg-accordion-header';
  header.innerHTML =
    '<span class="rg-acc-label">' + section.label + '</span>' +
    '<span class="rg-acc-chevron">▼</span>';

  var body = document.createElement('div');
  body.className = 'rg-accordion-body';
  body.hidden = true;

  if (section.img) {
    var imgWrap = document.createElement('div');
    imgWrap.className = 'rg-acc-img-wrap';
    var img = document.createElement('img');
    img.className = 'rg-section-img';
    img.src = section.img;
    img.alt = section.label;
    imgWrap.appendChild(img);
    body.appendChild(imgWrap);
  }

  if (section.desc && section.desc.length) {
    var ul = document.createElement('ul');
    ul.className = 'rg-acc-desc';
    section.desc.forEach(function (line) {
      var li = document.createElement('li');
      li.innerHTML = line;
      ul.appendChild(li);
    });
    body.appendChild(ul);
  }

  header.addEventListener('click', function () {
    body.hidden = !body.hidden;
    header.classList.toggle('open', !body.hidden);
  });

  wrap.appendChild(header);
  wrap.appendChild(body);
  return wrap;
}

// ── 2페이지 아코디언 데이터 ──────────────────────────────────────
const RG_PAGE2_SECTIONS = [
  {
    id: 'p2-safety',
    label: '소방안전 정보',
    img: './image/page 2/page2-대상물정보.png',
    desc: [
      '<b>소방안전관리등급</b>: 특급·1급·2급·3급 중 해당하는 □에 ✔ 표시합니다.',
      '<b>소방계획서</b>: 작성·보관 여부를 체크합니다. 미보관·미작성 시 과태료 대상이 될 수 있습니다.',
      '<b>자체점검(전년도)</b>: 작동점검·종합점검을 실시했는지 체크합니다.',
      '<b>교육훈련</b>: 소방안전교육과 소방훈련 각각의 실시 여부를 체크합니다.',
      '<b>화재보험</b>: 가입 여부를 체크하고, 가입한 경우 가입기간과 가입금액(대인/대물)을 기재합니다.',
    ],
  },
  {
    id: 'p2-owner',
    label: '관계인 정보',
    img: './image/page 2/page2-관계인정보.png',
    desc: [
      '<b>대표자</b>: 소유자·관리자·점유자 중 해당하는 □에 ✔ 표시하고 성명과 전화번호를 기재합니다.',
      '건물의 실제 관리 주체가 누구인지에 따라 선택합니다.',
      '소유자와 관리자·점유자가 다를 경우 실제 소방 관리를 담당하는 사람을 기재합니다.',
    ],
  },
  {
    id: 'p2-multi',
    label: '다중이용업소 현황',
    img: './image/page 2/page2-다중이용업소.png',
    desc: [
      '건물 내에 입점한 다중이용업소 업종에 □ 표시하고 해당 개소 수를 기재합니다.',
      '휴게음식점, 제과점, 일반음식점, 단란주점, 유흥주점, 비디오물감상실, 학원, 목욕장 등이 해당됩니다.',
      '해당 없는 경우 <b>해당없음</b>에 ✔ 표시합니다.',
      '다중이용업소가 있는 경우 추가 점검 항목이 발생할 수 있습니다.',
    ],
  },
  {
    id: 'p2-building1',
    label: '건축물 정보 ①',
    img: './image/page 2/page2-건축물정보01.png',
    desc: [
      '<b>건축허가일 / 사용승인일</b>: 건축물 대장에서 확인하여 기재합니다.',
      '<b>연면적 / 건축면적</b>: 건축물 대장 기준 ㎡ 단위로 기재합니다.',
      '<b>층수</b>: 지상층수와 지하층수를 각각 기재합니다.',
      '<b>건축물구조</b>: 콘크리트조·철골구조·조적조·목구조·기타 중 해당하는 □에 ✔ 표시합니다.',
      '<b>지붕구조</b>: 슬래브·기와·슬레이트·기타 중 해당하는 □에 ✔ 표시합니다.',
    ],
  },
  {
    id: 'p2-building2',
    label: '건축물 정보 ②',
    img: './image/page 2/page2-건축물정보02.png',
    desc: [
      '<b>계단</b>: 직통계단과 특별피난계단의 개소 수를 각각 기재합니다.',
      '<b>승강기</b>: 승용·비상용·피난용 승강기의 대수를 각각 기재합니다.',
      '<b>주차장</b>: 옥내·지하·지상·필로티·기계식·옥상·옥외 중 해당하는 □에 ✔ 표시합니다.',
      '건축물 대장과 실제 현황이 다를 경우 실제 현황을 기재합니다.',
    ],
  },
];

function rgPageBlock(imgSrc, altText) {
  var wrap = document.createElement('div');
  wrap.className = 'rg-pdf-wrapper';
  var img = document.createElement('img');
  img.className = 'rg-section-img';
  img.src = imgSrc;
  img.alt = altText;
  wrap.appendChild(img);
  return wrap;
}

function renderRgOverview(c) {
  // ── 1페이지 ──
  c.appendChild(rgInfoBox('blue', '📄 1페이지 — 보고서 표지',
    '점검 기본 정보를 기재하는 페이지입니다. 각 항목을 클릭하면 작성 방법을 확인할 수 있습니다.'));
  c.appendChild(rgPageBlock('./image/page 1/page1-full.png', '1페이지 전체'));

  var acc1Label = document.createElement('div');
  acc1Label.className = 'rg-section-label';
  acc1Label.textContent = '항목별 작성 방법';
  c.appendChild(acc1Label);
  RG_PAGE1_SECTIONS.forEach(function (s) { c.appendChild(createRgAccordion(s)); });

  // ── 2페이지 ──
  c.appendChild(rgInfoBox('blue', '📄 2페이지 — 특정소방대상물 정보',
    '대상물의 소방안전 현황과 건축물 정보를 기재하는 페이지입니다.'));
  c.appendChild(rgPageBlock('./image/page 2/page2-full.png', '2페이지 전체'));

  var acc2Label = document.createElement('div');
  acc2Label.className = 'rg-section-label';
  acc2Label.textContent = '항목별 작성 방법';
  c.appendChild(acc2Label);
  RG_PAGE2_SECTIONS.forEach(function (s) { c.appendChild(createRgAccordion(s)); });
}

function renderRgChecklist(c) {
  c.appendChild(rgInfoBox('blue', '✅ 소방시설 현황',
    '3~4페이지를 참고하여 대상물에 설치된 소방시설을 선택하세요. 선택한 설비에 해당하는 점검표만 다음 탭에 표시됩니다.'));
  appendRgPage(c, 3);
  appendRgPage(c, 4);

  c.appendChild(rgSectionLabel('설치된 소방시설 선택'));

  RG_FACILITY_GROUPS.forEach(function (group) {
    var allItems = group.items;

    // ── 그룹 헤더 ──
    var header = document.createElement('div');
    header.className = 'rg-group-header';

    var groupCb = document.createElement('input');
    groupCb.type = 'checkbox';
    groupCb.className = 'rg-group-cb';
    var allChecked = allItems.every(function (i) { return rgState.selected.has(i.id); });
    var anyChecked = allItems.some(function (i) { return rgState.selected.has(i.id); });
    groupCb.checked = allChecked;
    groupCb.indeterminate = anyChecked && !allChecked;

    var groupName = document.createElement('span');
    groupName.className = 'rg-group-name';
    groupName.textContent = group.name;

    var groupSub = document.createElement('span');
    groupSub.className = 'rg-group-sub';
    groupSub.textContent = group.sectionLabel;

    header.appendChild(groupCb);
    header.appendChild(groupName);
    header.appendChild(groupSub);
    c.appendChild(header);

    // ── 개별 항목 그리드 ──
    var grid = document.createElement('div');
    grid.className = 'rg-item-grid';

    var itemCbs = [];

    allItems.forEach(function (item) {
      var lbl = document.createElement('label');
      lbl.className = 'rg-item-label';

      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = rgState.selected.has(item.id);
      itemCbs.push(cb);

      cb.addEventListener('change', function () {
        rgState.selected[cb.checked ? 'add' : 'delete'](item.id);
        var a2 = allItems.every(function (i) { return rgState.selected.has(i.id); });
        var b2 = allItems.some(function (i) { return rgState.selected.has(i.id); });
        groupCb.checked = a2;
        groupCb.indeterminate = b2 && !a2;
      });

      var span = document.createElement('span');
      span.textContent = item.label;

      lbl.appendChild(cb);
      lbl.appendChild(span);
      grid.appendChild(lbl);
    });

    groupCb.addEventListener('change', function () {
      allItems.forEach(function (item, idx) {
        if (groupCb.checked) rgState.selected.add(item.id);
        else rgState.selected.delete(item.id);
        itemCbs[idx].checked = groupCb.checked;
      });
      groupCb.indeterminate = false;
    });

    c.appendChild(grid);
  });

  var goBtn = document.createElement('button');
  goBtn.type = 'button';
  goBtn.className = 'btn btn-primary';
  goBtn.style.cssText = 'width:100%;margin-top:16px;';
  goBtn.textContent = '선택한 설비 점검표 보기 →';
  goBtn.addEventListener('click', function () {
    rgState.tab = 'sections';
    renderReportGuide();
  });
  c.appendChild(goBtn);
}

function renderRgSections(c) {
  // 전체 항목을 등록 순서대로 펼침
  var allFlat = [];
  RG_FACILITY_GROUPS.forEach(function (g) {
    g.items.forEach(function (item) {
      allFlat.push({ id: item.id, label: item.label, page: g.page, sectionLabel: g.sectionLabel });
    });
  });

  var selectedFlat = allFlat.filter(function (item) {
    return rgState.selected.has(item.id);
  });

  if (selectedFlat.length === 0) {
    c.appendChild(rgInfoBox('amber', '⚠️ 선택된 설비 없음',
      '이전 탭(소방시설 현황)에서 해당 설비를 먼저 선택해 주세요.'));
    var backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'btn btn-ghost';
    backBtn.style.cssText = 'width:100%;margin-top:8px;';
    backBtn.textContent = '← 소방시설 현황으로';
    backBtn.addEventListener('click', function () {
      rgState.tab = 'checklist';
      renderReportGuide();
    });
    c.appendChild(backBtn);
    return;
  }

  selectedFlat.forEach(function (item) {
    // 구분 라벨
    var lbl = document.createElement('div');
    lbl.className = 'rg-section-label';
    lbl.textContent = item.sectionLabel + '  ' + item.label;
    c.appendChild(lbl);

    var imgSrc = RG_SECTION_IMAGES[item.id];
    if (imgSrc) {
      var wrapper = document.createElement('div');
      wrapper.className = 'rg-pdf-wrapper';
      var img = document.createElement('img');
      img.className = 'rg-section-img';
      img.src = imgSrc;
      img.alt = item.label;
      wrapper.appendChild(img);
      c.appendChild(wrapper);
    } else {
      var placeholder = document.createElement('div');
      placeholder.className = 'rg-section-placeholder';
      placeholder.textContent = item.label + ' — 이미지 준비 중';
      c.appendChild(placeholder);
    }
  });
}

function renderRgWriting(c) {
  c.appendChild(rgInfoBox('blue', '📝 작성 방법',
    '10페이지 12번 항목에 작성 방법이 안내되어 있습니다.'));
  appendRgPage(c, 9);
  appendRgPage(c, 10);
}

document.getElementById('open-report-guide').addEventListener('click', function () {
  rgState.tab = 'overview';
  showScreen('reportGuide');
  renderReportGuide();
});

document.getElementById('back-from-report-guide').addEventListener('click', function () {
  showScreen('home');
});
