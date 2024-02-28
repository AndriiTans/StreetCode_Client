import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        // PartnerModal specification for testing
        'antd': '<rootDir>/__mocks__/antd/antd',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.ts',
        '^@/app/common/components/FileUploader/(.*)$': '<rootDir>/src/app/common/components/FileUploader/$1',
        '^@/app/common/utils/(.*)$': '<rootDir>/src/app/common/utils/$1',
        '^@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/(.*)$': '<rootDir>/src/features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/$1',
        '^@features/AdminPage/PartnersPage/PartnerModal/constants/(.*)$': '<rootDir>/src/features/AdminPage/PartnersPage/PartnerModal/constants/$1',
        '^@/features/AdminPage/PartnersPage/(.*)$': '<rootDir>/src/features/AdminPage/PartnersPage/$1',
        '^@/models/media/(.*)$': '<rootDir>/src/models/media/$1',
        '^@/models/partners/(.*)$': '<rootDir>/src/models/partners/$1',
        '^@/models/streetcode/(.*)$': '<rootDir>/src/models/streetcode/$1',
        '^@/app/api/media/(.*)$': '<rootDir>/src/app/api/media/$1',
        // DEV_NOTE: Down below is the right solution for compiling files by path
        // But we need to fix ALL typo errors before it could be compiled
        // Temp solution - mocking modules.
        // After fixing type error remove mocks or continue using them(as more simple solution)

        '^@/(.*)$': '<rootDir>/src/$1',
        '^@app/(.*)$': '<rootDir>/src/app/$1',
        '^@sass/(.*)$': '<rootDir>/src/assets/sass/$1',
        '^@images/(.*)$': '<rootDir>/src/assets/images/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@api/(.*)$': '<rootDir>/src/app/api/$1',
        '^@stores/(.*)$': '<rootDir>/src/app/stores/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@components/(.*)$': '<rootDir>/src/app/common/components/$1',
        '^@hooks/(.*)$': '<rootDir>/src/app/common/hooks/$1',
        '^@constants/(.*)$': '<rootDir>/src/app/common/constants/$1',
        '^@utils/(.*)$': '<rootDir>/src/app/common/utils/$1',
        
    },
    verbose: true,
    collectCoverageFrom: [
        "src/**/*.{ts,js}" // temp disable coverage collection for tsx, jsx until type errors will be fixed
    ],
    globals: {
        _env_: {
            API_URL: 'https://mock_URL.com',
        }
    },
    transform: {
        "^.+\\.svg$": "jest-transformer-svg",
    },
    coverageThreshold: {
        global: {
            statements: 0.1,
            branches: 0.0,
            functions: 0.0,
            lines: 0.1,
        }
    },
}

export default jestConfig
