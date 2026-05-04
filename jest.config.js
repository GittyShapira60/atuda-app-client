module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  preset: 'ts-jest',
  globals: {
    'ts-jest': {    
      tsConfig: 'tsconfig.json',
    },
  },
};