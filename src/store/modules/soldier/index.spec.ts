jest.mock('./index', () => ({
  state: {
    firstname: '',
    tz: '',
  },
  mutations: {
    setSoldierInfo: jest.fn((state, params) => {
      state.firstname = params.firstname
      state.tz = params.tz
    }),
  },
}))

import soldier from './index'

describe('mutations', () => {
  it('setSoldierInfo', () => {
    const state = {
      firstname: '',
      tz: '',
    }

    soldier.mutations.setSoldierInfo(state, {
      firstname: 'John',
      tz: '123456789',
    })

    expect(state.firstname).toBe('John')
    expect(state.tz).toBe('123456789')
  })
})
