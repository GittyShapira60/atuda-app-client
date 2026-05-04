import { jest } from '@jest/globals'
import { AxiosHeaders } from 'axios'
import { apiService } from '../../utils/index'
import { default as store } from './index'
const { actions } = store

const headers = new AxiosHeaders()
const config = { headers }

const mockResponseForFlowOptions = {
  data: {
    id: 1,
    name: 'name',
    description: 'description',
    duration: '1',
    stagesFlow: {
      layout: 'squares',
      options: [
        {
          name: 'academic',
          stages: ['stage1'],
          displayName: 'אקדמית',
        },
      ],
      menuTitle: 'סיבת הבקשה',
    },
    declarationText: 'declarationText',
  },
  status: 200,
  statusText: 'Success',
  headers: {},
  config,
}

const mockResponseForGetStages = {
  data: {
    key: 'stage1',
    header: 'header',
    title: 'title',
    description: 'description',
    schema: {
      type: 'object',
      required: ['component'],
      properties: {
        component: {
          type: 'string',
          title: 'title',
          layout: {
            props: {
              data: ['1', '2'],
            },
            slots: {
              component: 'comp',
            },
          },
        },
      },
    },
    options: null,
  },
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

describe('requests-stages store', () => {
  it('getFlowOptions action', async () => {
    const commit = jest.fn()
    const params = { id: '1' }
    jest
      .spyOn(apiService, 'get')
      .mockResolvedValueOnce(mockResponseForFlowOptions)
    await actions.getFlowOptions({ commit }, params)
    expect(commit).toHaveBeenCalledWith(
      'setMessage',
      'Sending the request to the server was successful',
    )
    expect(commit).toHaveBeenCalledWith('setStatus', 200)
    expect(commit).toHaveBeenCalledWith(
      'setFlowOptions',
      mockResponseForFlowOptions.data,
    )
    expect(commit).toHaveBeenCalledWith('setError', false)
  })

  it('getFlowOptions action with error', async () => {
    const commit = jest.fn()
    const params = { id: '2' }
    jest.spyOn(apiService, 'get').mockRejectedValueOnce(mockError)
    await actions.getFlowOptions({ commit }, params)
    expect(commit).toHaveBeenCalledWith(
      'setMessage',
      'Sending the request to the server was rejected!',
    )
    expect(commit).toHaveBeenCalledWith('setError', true)
  })

  it('getStages action', async () => {
    const commit = jest.fn()
    const params = { id: '1', stage: 'academic' }
    jest
      .spyOn(apiService, 'get')
      .mockResolvedValueOnce(mockResponseForGetStages)
    await actions.getStages({ commit }, params)
    expect(commit).toHaveBeenCalledWith(
      'setMessage',
      'Sending the request to the server was successful',
    )
    expect(commit).toHaveBeenCalledWith('setStatus', 200)
    expect(commit).toHaveBeenCalledWith(
      'setStages',
      mockResponseForGetStages.data,
    )
    expect(commit).toHaveBeenCalledWith('setError', false)
  })

  it('getStages action with error', async () => {
    const commit = jest.fn()
    const params = { id: '2', stage: 'academic' }
    jest.spyOn(apiService, 'get').mockRejectedValueOnce(mockError)
    await actions.getStages({ commit }, params)
    expect(commit).toHaveBeenCalledWith(
      'setMessage',
      'Sending the request to the server was rejected!',
    )
    expect(commit).toHaveBeenCalledWith('setError', true)
  })

  it('getFlowOptions with empty id', async () => {
    const commit = jest.fn()
    const params = { id: '' }
    jest.spyOn(apiService, 'get').mockRejectedValueOnce(mockError)
    await actions.getFlowOptions({ commit }, params)
    expect(commit).toHaveBeenCalledWith('setMessage', 'ID cannot be empty')
    expect(commit).toHaveBeenCalledWith('setStatus', 400)
    expect(commit).toHaveBeenCalledWith('setError', true)
  })

  it('getStages with empty params', async () => {
    const commit = jest.fn()
    const params = { id: '', stage: '' }
    jest.spyOn(apiService, 'get').mockRejectedValueOnce(mockError)
    await actions.getStages({ commit }, params)
    expect(commit).toHaveBeenCalledWith('setMessage', 'Params cannot be empty')
    expect(commit).toHaveBeenCalledWith('setStatus', 400)
    expect(commit).toHaveBeenCalledWith('setError', true)
  })
})
