import './HeaderLoginModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import { useModalContext } from '@stores/root-store';

import { Button, Modal } from 'antd';

import {
    becomePartnerEvent,
    donateEvent,
    joinToStreetcodeClickEvent,
} from '@/app/common/utils/googleAnalytics.unility';

const HeaderLoginModal = ({ hasVacancies }) => {
    const SURVEY_LINK = 'https://forms.gle/eWwX5RP84X7dymLR6';
    const { modalStore: { setModal, modalsState: { login } } } = useModalContext();
    const navigate = useNavigate();

    const becomePartnerHandler = () => {
        login.isOpen = false;
        setModal('partners');
        becomePartnerEvent('modal');
    };

    const joinToTeamHandler = () => {
        console.log('hasVacancies', hasVacancies);
        if (hasVacancies) {
            navigate(`${FRONTEND_ROUTES.OTHER_PAGES.ABOUT_US}#Vacancies`);
            login.isOpen = false;
        }
    };

    return (
        <Modal
            className="loginModal"
            open={login.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={() => setModal('login')}
            closeIcon={<CancelBtn />}
        >
            <div className="loginModalContent">
                <Button onClick={() => open(SURVEY_LINK)}>
                    Пройти опитування
                </Button>
                <Button onClick={becomePartnerHandler}>
                    Стати партнером
                </Button>
                {hasVacancies && (
                    <Button onClick={() => {
                        joinToStreetcodeClickEvent();
                        joinToTeamHandler();
                    }}
                    >
                        Долучитися до команди
                    </Button>
                )}
                <Button onClick={() => {
                    setModal('donates');
                    setModal('login');
                    donateEvent('header_modal');
                }}
                >
                    Задонатити
                </Button>
            </div>
        </Modal>
    );
};

export default observer(HeaderLoginModal);
