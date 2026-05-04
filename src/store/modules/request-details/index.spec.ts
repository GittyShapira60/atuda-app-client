import { jest } from '@jest/globals'
import { AxiosHeaders } from 'axios'
import { apiService } from '../../utils/index'
import { default as store } from './index'
const { actions } = store

const headers = new AxiosHeaders()
const config = { headers }

const mockResponseForRequests = {
  data: [
    [
      {
        title: 'requestReason',
        value: '01',
      },
      {
        title: 'סוג הבקשה',
        value: 'קיצור',
      },
      {
        title: 'כמות סמסטרים',
        value: '1',
      },
      {
        title: 'פרוט הפנייה',
        value: 'נסיון',
      },
      {
        title: 'גליון ציונים עדכני',
        value: {
          content: '',
          name: 'מסמך לניסיון',
          type: 'pdf',
        },
      },
      {
        title: 'תוכנית לימודים מעודכנת',
        value: {
          content: '',
          name: 'צילום מסך 2025-03-27 105538',
          type: 'png',
        },
      },
      {
        title: '15',
        value: {
          content: '',
          name: 'מסמך לניסיון',
          type: 'docx',
        },
      },
    ],
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

describe('request-details store', () => {
  it('get action', async () => {
    const commit = jest.fn()
    jest.spyOn(apiService, 'get').mockResolvedValueOnce(mockResponseForRequests)
    await actions.get({ commit }, { requestId: '209889104033595' })
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
    await actions.get({ commit }, { requestId: '-1' })
    expect(commit).toHaveBeenCalledWith(
      'setMessage',
      'Sending the request to the server was rejected!',
    )
    expect(commit).toHaveBeenCalledWith('setError', true)
  })
})
