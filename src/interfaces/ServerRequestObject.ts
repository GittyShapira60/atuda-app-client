export interface ServerRequestObject {
  userIdentity: string
  requestTypeId: string
  requestDetails: { [key: string]: any }
}
