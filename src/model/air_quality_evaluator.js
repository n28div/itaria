export function pm25 (province) {
  const val = province.quality['Pm2,5']
  let quality = 0

  if (val > 0 && val < 10) {
    quality = 1
  } else if (val >= 10 && val < 20) {
    quality = 2
  } else if (val >= 20 && val < 25) {
    quality = 3
  } else if (val >= 25 && val < 50) {
    quality = 4
  } else if (val >= 50) {
    quality = 5
  }

  return {
    name: province.name,
    short: province.short,
    value: val,
    quality_index: quality
  }
}

export function pm10 (province) {
  const val = province.quality['Pm10']
  let quality = 0

  if (val > 0 && val < 10) {
    quality = 1
  } else if (val >= 10 && val < 20) {
    quality = 2
  } else if (val >= 20 && val < 25) {
    quality = 3
  } else if (val >= 25 && val < 50) {
    quality = 4
  } else if (val >= 50 && val < 800) {
    quality = 5
  }

  return {
    name: province.name,
    short: province.short,
    value: val,
    quality_index: quality
  }
}

export function no2 (province) {
  const val = province.quality['NO2']
  let quality = 0

  if (val > 0 && val < 40) {
    quality = 1
  } else if (val >= 40 && val < 100) {
    quality = 2
  } else if (val >= 100 && val < 200) {
    quality = 3
  } else if (val >= 200 && val < 400) {
    quality = 4
  } else if (val >= 400) {
    quality = 5
  }

  return {
    name: province.name,
    short: province.short,
    value: val,
    quality_index: quality
  }
}

export function o3 (province) {
  const val = province.quality['O3']
  let quality = 0

  if (val > 0 && val < 80) {
    quality = 1
  } else if (val >= 80 && val < 120) {
    quality = 2
  } else if (val >= 120 && val < 180) {
    quality = 3
  } else if (val >= 180 && val < 240) {
    quality = 4
  } else if (val >= 240) {
    quality = 5
  }

  return {
    name: province.name,
    short: province.short,
    value: val,
    quality_index: quality
  }
}

export function so2 (province) {
  const val = province.quality['SO2']
  let quality = 0

  if (val > 0 && val < 100) {
    quality = 1
  } else if (val >= 100 && val < 200) {
    quality = 2
  } else if (val >= 200 && val < 350) {
    quality = 3
  } else if (val >= 350 && val < 500) {
    quality = 4
  } else if (val >= 500) {
    quality = 5
  }

  return {
    name: province.name,
    short: province.short,
    value: val,
    quality_index: quality
  }
}