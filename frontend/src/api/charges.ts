import { http } from './http'

export type ChargeType = 'rent' | 'utility' | 'booking' | 'repair' | 'other'
export type ChargeStatus = 'open' | 'paid' | 'overdue'

export interface Charge {
  id: number
  type: ChargeType
  type_label: string
  description: string
  amount_cents: number
  period: string
  due_date: string
  paid_at: string | null
  status: ChargeStatus
  days_overdue: number
  has_source: boolean
  tenant: { id: number; name: string } | null
  apartment: { id: number; label: string } | null
}

export interface ChargeMonth {
  period: string
  total_cents: number
  open_cents: number
  charges: Charge[]
}

export type ChargeSource =
  | {
      type: 'utility'
      data: {
        bill: {
          id: number
          type_label: string
          amount_cents: number
          period_start: string
          period_end: string
          scope: 'building' | 'apartment'
          split_method_label: string | null
        }
        apartment: { label: string; share_cents: number; days: number }
        tenant: { days: number; amount_cents: number }
      }
    }
  | {
      type: 'booking'
      data: {
        id: number
        space_name: string
        starts_at: string
        ends_at: string
        hours: number
        price_per_hour_cents: number
        fee_cents: number
      }
    }
  | {
      type: 'repair'
      data: {
        id: number
        number: string
        title: string
        status_label: string
        cost_cents: number | null
      }
    }

export const chargesApi = {
  mine: (buildingId?: number | null) =>
    http
      .get<{ data: ChargeMonth[] }>('/api/me/charges', { params: { building_id: buildingId ?? undefined } })
      .then((r) => r.data.data),
  get: (id: number) => http.get<{ data: Charge }>(`/api/charges/${id}`).then((r) => r.data.data),
  source: (id: number) => http.get<{ data: ChargeSource }>(`/api/charges/${id}/source`).then((r) => r.data.data),
}

export interface ChargeFilters {
  period?: string
  apartment_id?: number
  status?: ChargeStatus
}

export interface BuildingTenant {
  id: number
  name: string
  apartment: string
  lease_status: string
  moved_out_on: string | null
}

export const buildingChargesApi = {
  list: (buildingId: number, filters: ChargeFilters) =>
    http.get<{ data: Charge[] }>(`/api/buildings/${buildingId}/charges`, { params: filters }).then((r) => r.data.data),
  periods: (buildingId: number) =>
    http.get<{ data: string[] }>(`/api/buildings/${buildingId}/charge-periods`).then((r) => r.data.data),
  tenants: (buildingId: number) =>
    http.get<{ data: BuildingTenant[] }>(`/api/buildings/${buildingId}/lease-tenants`).then((r) => r.data.data),
  create: (buildingId: number, payload: { lease_tenant_id: number; description: string; amount_cents: number; period?: string }) =>
    http.post<{ data: Charge }>(`/api/buildings/${buildingId}/charges`, payload).then((r) => r.data.data),
  markPaid: (id: number, paidOn: string) =>
    http.post<{ data: Charge }>(`/api/charges/${id}/mark-paid`, { paid_on: paidOn }).then((r) => r.data.data),
}
