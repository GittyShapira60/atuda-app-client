import { jest } from '@jest/globals'
import { AxiosHeaders } from 'axios'
import { apiService } from '../../utils/index'
import { default as store } from './index'
const { actions } = store

const headers = new AxiosHeaders()
const config = { headers }

const mockResponse = {
  data: '',
  status: 201,
  statusText: 'Created',
  headers: {},
  config,
}

const mockResponseForRequests = {
  data: [{ status: 'ACTIVE', requestType: 'בקשה לשינוי מסלול לימודים' }],
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

describe('requests store', () => {
  it('create action', async () => {
    const commit = jest.fn()
    const request = {
      userIdentity: '1',
      requestTypeId: '01',
      requestDetails: { id: '1' },
    }
    jest.spyOn(apiService, 'post').mockResolvedValueOnce(mockResponse)
    await actions.create({ commit }, { ...request })
    expect(commit).toHaveBeenCalledWith(
      'setMessage',
      'Sending the request to the server was successful',
    )
    expect(commit).toHaveBeenCalledWith('setStatus', 201)
    expect(commit).toHaveBeenCalledWith('setResponse', '')
    expect(commit).toHaveBeenCalledWith('setError', false)
    expect(commit).toHaveBeenCalledWith('setLoading', false)
  })

  it('create action with error', async () => {
    const commit = jest.fn()
    const request = {
      userIdentity: '1',
      requestTypeId: '01',
      requestDetails: {},
    }
    jest.spyOn(apiService, 'post').mockRejectedValueOnce(mockError)
    await actions.create({ commit }, { ...request })
    expect(commit).toHaveBeenCalledWith(
      'setMessage',
      'Sending the request to the server was rejected!',
    )
    expect(commit).toHaveBeenCalledWith('setError', true)
    expect(commit).toHaveBeenCalledWith('setLoading', false)
  })

  it('create action with empty data', async () => {
    const commit = jest.fn()
    const request = {
      userIdentity: '',
      requestTypeId: '01',
      requestDetails: {},
    }
    jest.spyOn(apiService, 'post').mockRejectedValueOnce(mockError)
    await actions.create({ commit }, { ...request })
    expect(commit).toHaveBeenCalledWith('setMessage', 'Data cannot be empty')
    expect(commit).toHaveBeenCalledWith('setError', true)
    expect(commit).toHaveBeenCalledWith('setLoading', false)
  })

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
