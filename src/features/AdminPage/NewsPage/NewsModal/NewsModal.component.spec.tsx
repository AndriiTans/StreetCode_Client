import { render, screen } from '@testing-library/react';
import NewsModal from './NewsModal.component';
import { useState } from 'react';
import { mockSetModal, mockID, mockIsOpen } from '../../../../../__mocks__/@stores/root-store';

import CancelBtn from '@images/utils/Cancel_btn.svg';

//import * as PositionsApi from '@/app/api/team/positions.api';

const setIsModalOpen = jest.fn();

//const [modalOpened, setModalOpened] = useState<boolean>(true);

//jest.mock('@images/utils/Cancel_btn.svg', () => 'Cancel_btnsvg');

jest.mock('@images/utils/Cancel_btn.svg', () => {
    return {
      __esModule: true,
      default: jest.fn(() => (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.2868 13.998L27.3105 3.99625C27.7494 3.55724 27.996 2.96181 27.996 2.34095C27.996 1.72009 27.7494 1.12466 27.3105 0.685649C26.8715 0.246635 26.2762 0 25.6554 0C25.0346 0 24.4393 0.246635 24.0003 0.685649L14 10.7107L3.99966 0.685649C3.56071 0.246635 2.96537 -4.62576e-09 2.3446 0C1.72383 4.62576e-09 1.12848 0.246635 0.68953 0.685649C0.250579 1.12466 0.00397823 1.72009 0.00397822 2.34095C0.00397822 2.96181 0.250579 3.55724 0.68953 3.99625L10.7132 13.998L0.68953 23.9998C0.471041 24.2165 0.297623 24.4744 0.179277 24.7585C0.0609309 25.0426 0 25.3473 0 25.6551C0 25.9628 0.0609309 26.2676 0.179277 26.5517C0.297623 26.8358 0.471041 27.0936 0.68953 27.3104C0.906234 27.5289 1.16405 27.7023 1.44812 27.8207C1.73218 27.9391 2.03687 28 2.3446 28C2.65233 28 2.95701 27.9391 3.24108 27.8207C3.52514 27.7023 3.78296 27.5289 3.99966 27.3104L14 17.2853L24.0003 27.3104C24.217 27.5289 24.4749 27.7023 24.7589 27.8207C25.043 27.9391 25.3477 28 25.6554 28C25.9631 28 26.2678 27.9391 26.5519 27.8207C26.8359 27.7023 27.0938 27.5289 27.3105 27.3104C27.529 27.0936 27.7024 26.8358 27.8207 26.5517C27.9391 26.2676 28 25.9628 28 25.6551C28 25.3473 27.9391 25.0426 27.8207 24.7585C27.7024 24.4744 27.529 24.2165 27.3105 23.9998L17.2868 13.998Z" fill="#D3CDCA"/>
        </svg>
      )),
    };
  });

jest.mock('@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component', () => ({
    __esModule: true,
    default: () => <div data-testid="mockPreviewModal">Mock Preview Modal</div>,
}));

jest.mock('@/app/common/components/Editor/QEditor.component', () => ({
    __esModule: true,
    default: () => <div data-testid="mockEditor">Mock Editor</div>,
}));

// jest.mock('./YourComponent', () => ({
//     __esModule: true,
//     default: jest.fn(() => <div data-testid="mocked-component">Mocked Component</div>),
//   }));

const form = {
    setFieldsValue: jest.fn(),
    resetFields: jest.fn(),
    validateFields: jest.fn(),
    submit: jest.fn(),
};

jest.mock('antd', () => {
    const originalModule = jest.requireActual('antd');
    return {
        ...originalModule,
        Form: {
            ...originalModule.Form,
            useForm: jest.fn(() => [{
                setFieldsValue: jest.fn(),
                resetFields: jest.fn(),
                validateFields: jest.fn(),
                submit: jest.fn(),
            }, {}]),
        },
        Modal: jest.fn(({ onCancel }) => (
            <div>
                <div data-testid="modal-close" onClick={onCancel} />
                <div data-testid="modal-content" />
            </div>
        )),
        message: {
            config: jest.fn(),
        },
    };
});

// jest.mock('antd/es/date-picker/locale/uk_UA', () => ({
//     DatePickerLocale: {
//       lang: {
//         placeholder: 'Оберіть дату',
//         rangePlaceholder: ['Початкова дата', 'Кінцева дата'],
//         today: 'Сьогодні',
//         now: 'Зараз',
//         backToToday: 'Повернутися до сьогодні',
//         ok: 'Ok',
//         clear: 'Очистити',
//         month: 'Місяць',
//         year: 'Рік',
//         timeSelect: 'Обрати час',
//         dateSelect: 'Обрати дату',
//         monthSelect: 'Обрати місяць',
//         yearSelect: 'Обрати рік',
//         decadeSelect: 'Обрати десятиріччя',
//         yearFormat: 'YYYY',
//         dateFormat: 'DD.MM.YYYY',
//         dayFormat: 'DD',
//         dateTimeFormat: 'DD.MM.YYYY HH:mm:ss',
//         monthFormat: 'MMMM',
//         monthBeforeYear: true,
//         previousMonth: 'Попередній місяць (PageUp)',
//         nextMonth: 'Наступний місяць (PageDown)',
//         previousYear: 'Попередній рік (Control + left)',
//         nextYear: 'Наступний рік (Control + right)',
//         previousDecade: 'Попереднє десятиріччя',
//         nextDecade: 'Наступне десятиріччя',
//         previousCentury: 'Попереднє століття',
//         nextCentury: 'Наступне століття',
//       },
//       timePickerLocale: {
//         placeholder: 'Оберіть час',
//       },
//     },
//   }));

describe('NewsModal', () => {
    it('should render component and its elements', () => {
        render(<NewsModal open
            setIsModalOpen={setIsModalOpen} />, );

        //const { logoType } = mockLinkProp;

        expect(screen.getByTestId('mockPreviewModal')).toBeInTheDocument();
    });
});