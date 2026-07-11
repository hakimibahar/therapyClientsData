function toJalaliDate(date = new Date()) {
    const j = jalaali.toJalaali(date);
    return `${j.jy}.${String(j.jm).padStart(2,'0')}.${String(j.jd).padStart(2,'0')}`;
}

function toGregorian(jy, jm, jd) {
  return jalaali.toGregorian(jy, jm, jd);
}

function getTodayJalali() {
    return toJalaliDate(new Date());
}