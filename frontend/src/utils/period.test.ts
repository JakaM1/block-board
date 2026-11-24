import { describe, expect, it } from 'vitest'
import { inclusiveDays, residenceBar } from './period'

describe('inclusiveDays', () => {
  it('šteje oba robna dneva', () => {
    expect(inclusiveDays('2026-09-01', '2026-09-30')).toBe(30)
    expect(inclusiveDays('2026-09-16', '2026-09-30')).toBe(15)
    expect(inclusiveDays('2028-02-01', '2028-02-29')).toBe(29)
  })

  it('eno samo nočitev na istem datumu šteje kot en dan', () => {
    expect(inclusiveDays('2027-01-10', '2027-01-10')).toBe(1)
  })

  it('šteje dneve čez prehod v novo leto', () => {
    expect(inclusiveDays('2027-12-31', '2028-01-02')).toBe(3)
  })

  it('upošteva prestopni dan pri prehodu v marec', () => {
    expect(inclusiveDays('2028-02-28', '2028-03-01')).toBe(3)
  })
})

describe('residenceBar', () => {
  it('celo obdobje zapolni trak', () => {
    expect(residenceBar('2026-09-01', '2026-09-30', '2026-07-01', null)).toEqual({ offset: 0, width: 100 })
  })

  it('vselitev 16. 9. zapolni drugo polovico', () => {
    expect(residenceBar('2026-09-01', '2026-09-30', '2026-09-16', null)).toEqual({ offset: 50, width: 50 })
  })

  it('izselitev na polovici meseca zapolni le prvo polovico', () => {
    expect(residenceBar('2027-04-01', '2027-04-30', null, '2027-04-15')).toEqual({ offset: 0, width: 50 })
  })

  it('bivanje po koncu obračunskega obdobja ne zapolni traku', () => {
    expect(residenceBar('2027-04-01', '2027-04-30', '2027-05-01', null).width).toBe(0)
  })

  it('bivanje pred začetkom obračunskega obdobja ne zapolni traku', () => {
    expect(residenceBar('2027-04-01', '2027-04-30', null, '2027-03-31')).toEqual({ offset: 0, width: 0 })
  })

  it('vselitev in izselitev sredi obdobja določita odmik in širino', () => {
    expect(residenceBar('2027-04-01', '2027-04-30', '2027-04-16', '2027-04-18')).toEqual({ offset: 50, width: 10 })
  })
})
