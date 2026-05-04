export enum RequestStatus {
  ACTIVE = 'ACTIVE',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

export const RequestStatusLabel = new Map<string, string>([
  [RequestStatus.ACTIVE, 'בקשה פעילה'],
  [RequestStatus.APPROVED, 'בקשה אושרה'],
  [RequestStatus.DENIED, 'בקשה נדחתה'],
])

export const RequestStatusColor = new Map<string, string>([
  [RequestStatus.ACTIVE, 'primary'],
  [RequestStatus.APPROVED, 'green'],
  [RequestStatus.DENIED, 'red'],
])
