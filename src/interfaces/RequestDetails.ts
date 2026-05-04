import { RequestStatus } from '../enums/RequestStatus'

export interface RequestDetails {
  id: string
  requestType: string
  status: RequestStatus
  requestDetails?: RequestDetail[]
}

export interface RequestDetail {
  title: string
  value: any
  textarea?: boolean
  file?: boolean
  nrequired?: boolean
}
