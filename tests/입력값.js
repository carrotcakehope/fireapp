// 정답지.md 각 번호의 탐색기 입력값 (yearState.answers에 덮어쓸 값).
// 정답은 여기 두지 않는다. 정답은 정답지.md에만 있다.
const A = (o) => ({ yEraChoice: "after2004", ...o });
const P = (o) => ({ yEraChoice: "before2004", ...o });

const lodging5F = (d) => A({ yOccupancyType: "lodging", yPermitDate: d, yTotalArea: "3000", yLodgingArea: "3000", yAboveGroundFloors: "5" });
const lodging500 = (d) => A({ yOccupancyType: "lodging", yPermitDate: d, yTotalArea: "500", yLodgingArea: "500", yAboveGroundFloors: "3" });
const elderly2F = (d) => A({ yOccupancyType: "elderly", yPermitDate: d, yTotalArea: "400", yElderlyArea: "400", yAboveGroundFloors: "2" });
const elderlyLiving = (d) => A({ yOccupancyType: "elderly", yElderlySubtype: "living", yPermitDate: d, yTotalArea: "200", yElderlyArea: "200", yAboveGroundFloors: "1" });
const medical = (sub, d) => A({ yOccupancyType: "medical", yMedicalSubtype: sub, yPermitDate: d, yTotalArea: "400", yMedicalArea: "400", yAboveGroundFloors: "2" });
const office6F = (d) => A({ yOccupancyType: "office", yPermitDate: d, yTotalArea: "3000", yAboveGroundFloors: "6" });
const apt6F = (d) => A({ yOccupancyType: "apartment", yPermitDate: d, yTotalArea: "3000", yAboveGroundFloors: "6" });
const office30F = (d) => A({ yOccupancyType: "office", yPermitDate: d, yTotalArea: "60000", yAboveGroundFloors: "30" });
const factory = (d, extra) => A({ yOccupancyType: "factory", yPermitDate: d, yTotalArea: "1000", yAboveGroundFloors: "2", ...extra });
const nb = (d, ag, ta, extra) => A({
  yOccupancyType: "neighborhood", yPermitDate: d, yTotalArea: String(ta), yNeighborhoodArea: String(ta),
  yAboveGroundFloors: String(ag), ...extra,
});
const postpartum = { yIsPostpartum: "yes", yPostpartumAreaRange: "under600" };
// 분법 이전 근린생활시설 (업종 기본값: 기타 근린생활시설)
const pnb = (d, o) => P({ yOccupancyType: "neighborhood", yPermitDate: d, yBefore2004FacilitySubtype: "general", ...o });
// 분법 이전 그 밖의 용도
const pocc = (occ, d, o) => P({ yOccupancyType: occ, yPermitDate: d, ...o });
const ugParking = (d, area) => A({
  yOccupancyType: "neighborhood", yPermitDate: d, yTotalArea: "300", yAboveGroundFloors: "2",
  yBasementFloors: "1", yBasementAreaSum: String(area), yHasIndoorParking: "yes",
  yIndoorParkingArea: "0", yUndergroundParkingArea: String(area),
});

module.exports = {
  숙1: lodging5F("2006-12-29"),
  숙2: lodging5F("2006-12-30"),
  숙3: lodging500("2022-11-30"),
  숙4: lodging500("2022-12-01"),
  숙5: lodging500("2022-12-01"),

  노1: elderly2F("2017-01-27"),
  노2: elderly2F("2017-01-28"),
  노3: elderlyLiving("2012-02-04"),
  노4: elderlyLiving("2012-02-05"),

  의1: medical("nursingHome", "2014-07-07"),
  의2: medical("nursingHome", "2014-07-07"),
  의3: medical("hospital", "2019-08-05"),
  의4: medical("hospital", "2019-08-06"),

  층1: office6F("2018-01-26"),
  층2: office6F("2018-01-27"),
  층3: apt6F("2018-01-26"),
  층4: apt6F("2018-01-27"),
  층5: office30F("2012-02-04"),
  층6: office30F("2012-02-05"),

  공1: factory("2026-02-28", { yFactoryHasGasFacility: "yes" }),
  공2: factory("2026-03-01", { yFactoryHasGasFacility: "yes" }),
  공3: factory("2026-03-01"),
  공4: factory("2026-03-01", { yFactoryIsLithiumPrimary: "yes" }),

  주1: ugParking("2026-02-28", 100),
  주2: ugParking("2026-03-01", 100),
  주3: ugParking("2026-02-28", 100),
  주4: ugParking("2026-03-01", 100),
  주5: ugParking("2026-02-28", 100),
  주6: ugParking("2026-03-01", 100),
  주7: ugParking("2026-02-28", 250),
  주8: ugParking("2026-03-01", 250),

  전1: P({ yOccupancyType: "lodging", yPermitDate: "2002-03-29", yTotalArea: "500", yAboveGroundFloors: "3" }),
  전2: P({ yOccupancyType: "lodging", yPermitDate: "2002-03-30", yTotalArea: "500", yAboveGroundFloors: "3" }),
  전3: P({ yOccupancyType: "apartment", yPermitDate: "1994-12-27", yTotalArea: "5000", yAboveGroundFloors: "11" }),
  전4: P({ yOccupancyType: "apartment", yPermitDate: "1994-12-28", yTotalArea: "5000", yAboveGroundFloors: "11" }),
  전5: P({ yOccupancyType: "apartment", yPermitDate: "2001-05-20", yTotalArea: "1500", yAboveGroundFloors: "5", yBefore2004AptHouseholds: "20" }),
  전6: P({ yOccupancyType: "apartment", yPermitDate: "2001-05-21", yTotalArea: "1500", yAboveGroundFloors: "5", yBefore2004AptHouseholds: "20" }),
  전7: P({ yOccupancyType: "elderly", yPermitDate: "1999-08-05", yTotalArea: "1000", yAboveGroundFloors: "2", yBefore2004ElderlyHasFloor500Plus: "yes" }),
  전8: P({ yOccupancyType: "elderly", yPermitDate: "1999-08-06", yTotalArea: "1000", yAboveGroundFloors: "2", yBefore2004ElderlyHasFloor500Plus: "yes" }),
  전9: P({ yOccupancyType: "office", yPermitDate: "2000-01-01", yTotalArea: "60000", yAboveGroundFloors: "30" }),
  전10: P({ yOccupancyType: "medical", yBefore2004MedicalSubtype: "generalHospital", yPermitDate: "2000-01-01", yTotalArea: "400", yAboveGroundFloors: "2" }),
  전11: P({ yOccupancyType: "medical", yBefore2004MedicalSubtype: "hospital", yPermitDate: "2000-01-01", yTotalArea: "400", yAboveGroundFloors: "2" }),
  전12: P({ yOccupancyType: "elderly", yPermitDate: "2000-01-01", yTotalArea: "300", yAboveGroundFloors: "1" }),

  근1: nb("2019-06-01", 5, 5500),
  근2: nb("2019-06-01", 5, 3000),
  근3: nb("2019-06-01", 5, 5500),
  근4: nb("2022-11-30", 6, 500),
  근5: nb("2022-12-01", 6, 500),
  근6: nb("2022-02-24", 2, 500, postpartum),
  근7: nb("2022-02-25", 2, 500, postpartum),
  근8: nb("2019-08-05", 2, 500, { yIsClinicWithInpatient: "yes" }),
  근9: nb("2019-08-06", 2, 500, { yIsClinicWithInpatient: "yes" }),
  근10: nb("2025-06-01", 2, 500, { yHasHemodialysis: "yes" }),
  근11: nb("2025-06-01", 2, 500, { yHasHemodialysis: "yes" }),

  숙6: A({ yOccupancyType: "lodging", yPermitDate: "2018-01-26", yTotalArea: "3500", yLodgingArea: "3500", yAboveGroundFloors: "7" }),
  숙7: A({ yOccupancyType: "lodging", yPermitDate: "2018-01-27", yTotalArea: "3500", yLodgingArea: "3500", yAboveGroundFloors: "7" }),
  숙8: A({ yOccupancyType: "lodging", yPermitDate: "2019-06-01", yTotalArea: "5500", yLodgingArea: "5500", yAboveGroundFloors: "5" }),
  공5: A({ yOccupancyType: "factory", yPermitDate: "2019-06-01", yTotalArea: "5500", yAboveGroundFloors: "5" }),
  판1: A({ yOccupancyType: "sales", yPermitDate: "2019-06-01", yTotalArea: "3500", ySalesArea: "3500", yAboveGroundFloors: "7" }),
  종1: A({ yOccupancyType: "religious", yPermitDate: "2019-06-01", yTotalArea: "3500", yAboveGroundFloors: "7" }),

  이근1: pnb("1983-06-01", { yTotalArea: "800", yAboveGroundFloors: "2", yBasementFloors: "1", yBasementAreaSum: "800" }),
  이근2: pnb("1983-06-01", { yTotalArea: "7000", yAboveGroundFloors: "7" }),
  이근3: pnb("1984-06-30", { yTotalArea: "5500", yAboveGroundFloors: "5" }),
  이근4: pnb("1984-07-01", { yTotalArea: "5500", yAboveGroundFloors: "5" }),
  이근5: pnb("1982-06-01", { yBefore2004FacilitySubtype: "restaurant", yTotalArea: "1500", yAboveGroundFloors: "3", yBasementFloors: "1", yBasementAreaSum: "1100", ySmokeControlArea: "1100" }),
  이근6: pnb("1990-07-01", { yTotalArea: "9000", yAboveGroundFloors: "12" }),
  이근7: pnb("1986-06-01", { yTotalArea: "1500", yAboveGroundFloors: "3", yBasementFloors: "1", yBasementAreaSum: "1100" }),
  이근8: pnb("1996-06-01", { yTotalArea: "3000", yAboveGroundFloors: "6", yBasementFloors: "1", yBasementAreaSum: "500" }),
  이근9: pnb("1996-06-01", { yTotalArea: "3000", yAboveGroundFloors: "10", yBasementFloors: "1", yBasementAreaSum: "300" }),
  이근10: pnb("1996-06-01", { yTotalArea: "3500", yAboveGroundFloors: "4", yBasementFloors: "1", yBasementAreaSum: "300" }),
  이근11: pnb("1986-06-01", { yBefore2004FacilitySubtype: "marketBathhouse", yTotalArea: "900", yAboveGroundFloors: "3" }),
  이근12: pnb("1986-06-01", { yTotalArea: "900", yAboveGroundFloors: "3" }),
  이근13: pnb("1990-06-30", { yTotalArea: "9000", yAboveGroundFloors: "12" }),
  이근14: pnb("1991-03-01", { yTotalArea: "300", yAboveGroundFloors: "1", yBasementFloors: "2", yBasementAreaSum: "200" }),
  이근15: pnb("1993-03-01", { yTotalArea: "300", yAboveGroundFloors: "1", yBasementFloors: "2", yBasementAreaSum: "200" }),

  이숙1: pocc("lodging", "1996-06-01", { yTotalArea: "3000", yAboveGroundFloors: "6", yBasementFloors: "1", yBasementAreaSum: "500" }),
  이숙2: pocc("lodging", "1993-06-01", { yTotalArea: "9000", yAboveGroundFloors: "12" }),
  이숙3: pocc("lodging", "2002-06-01", { yTotalArea: "9000", yAboveGroundFloors: "12" }),
  이숙4: pocc("lodging", "1993-06-01", { yTotalArea: "7000", yAboveGroundFloors: "7", yBefore2004LodgingIsTouristHotel: "yes" }),
  이의1: pocc("medical", "1986-06-01", { yTotalArea: "9000", yAboveGroundFloors: "12" }),
  이노1: pocc("elderly", "1986-06-01", { yTotalArea: "5500", yAboveGroundFloors: "5" }),
  이판1: pocc("sales", "1993-06-01", { yTotalArea: "8000", yBefore2004SalesArea: "8000", yAboveGroundFloors: "2" }),
  이판2: pocc("sales", "1996-06-01", { yTotalArea: "8000", yBefore2004SalesArea: "8000", yAboveGroundFloors: "2" }),
  이종1: pocc("religious", "1996-06-01", { yTotalArea: "1500", yAboveGroundFloors: "3" }),
  이종2: pocc("religious", "1996-06-01", { yTotalArea: "5500", yAboveGroundFloors: "5" }),
  이업1: pocc("office", "1986-06-01", { yTotalArea: "1500", yAboveGroundFloors: "3" }),
  이업2: pocc("office", "1986-06-01", { yTotalArea: "9000", yAboveGroundFloors: "12" }),
  이공1: pocc("factory", "1986-06-01", { yTotalArea: "5500", yAboveGroundFloors: "5" }),
  이공2: pocc("factory", "1983-06-01", { yTotalArea: "5500", yAboveGroundFloors: "5" }),
  이아1: pocc("apartment", "1983-06-01", { yTotalArea: "800", yAboveGroundFloors: "2", yBasementFloors: "1", yBasementAreaSum: "800" }),
  이아2: pocc("apartment", "1986-06-01", { yTotalArea: "5500", yAboveGroundFloors: "5" }),
};
