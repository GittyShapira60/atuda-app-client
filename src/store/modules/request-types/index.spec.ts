import { jest } from '@jest/globals'
import { AxiosHeaders } from 'axios'
import { apiService } from '../../utils/index'
import { default as store } from './index'
const { actions } = store

const headers = new AxiosHeaders()
const config = { headers }

const mockResponseForRequests = {
  data: [
    {
      id: 1,
      name: 'בקשה לקיצור / הארכת דח”ש',
    },
    {
      id: 2,
      name: 'בקשה לשינוי מסלול לימודים',
    },
  ],
  status: 200,
  statusText: 'Success',
  headers: {},
  config,
}

const mockError = { message: 'Mocked error' }

jest.mock('../../../services/api/index', () => ({
  ApiService: class ApiService {
    get = jest.fn()
    post = jest.fn()
  },
}))

describe('request-types store', () => {
  it('get action', async () => {
    const commit = jest.fn()
    jest.spyOn(apiService, 'get').mockResolvedValueOnce(mockResponseForRequests)
    await actions.get({ commit })
    expect(commit).toHaveBeenCalledWith(
      'setMessage',
      'Sending the request to the server was successful',
    )
    expect(commit).toHaveBeenCalledWith('setStatus', 200)
    expect(commit).toHaveBeenCalledWith(
      'setResponse',
      mockResponseForRequests.data,
    )
    expect(commit).toHaveBeenCalledWith('setError', false)
  })

  it('get action with error', async () => {
    const commit = jest.fn()
    jest.spyOn(apiService, 'get').mockRejectedValueOnce(mockError)
    await actions.get({ commit })
    expect(commit).toHaveBeenCalledWith(
      'setMessage',
      'Sending the request to the server was rejected!',
    )
    expect(commit).toHaveBeenCalledWith('setError', true)
  })
})
