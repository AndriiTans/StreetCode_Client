import './RegistrationPage.style.scss';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '@app/common/services/auth-service/AuthService';
import { SOMETHING_IS_WRONG } from '@constants/error-messages.constants';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import { UserRegisterRequest } from '@models/user/user.model';

import { Button, Form, Input, message } from 'antd';

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleRegister = async (request: UserRegisterRequest) => {
        try {
            await AuthService.registerAsync(request)
                .then(() => navigate(FRONTEND_ROUTES.ADMIN.LOGIN))
                .catch((ex) => {
                    Object.keys(ex.response.data.errors).forEach((key) => {
                        message.error(`${ex.response.data.errors[key]}`);
                    });
                });
        } catch (error) {
            message.error(SOMETHING_IS_WRONG);
        }
    };

    return (
        <Form form={form} className="register-form" onFinish={handleRegister}>
            <Form.Item
                name="name"
                label="Імʼя"
                rules={[{ required: true, message: 'Введіть імʼя' }]}
            >
                <Input maxLength={50} showCount />
            </Form.Item>
            <Form.Item
                name="surname"
                label="Прізвище"
                rules={[{ required: true, message: 'Введіть прізвище' }]}
            >
                <Input maxLength={50} showCount />
            </Form.Item>
            <Form.Item
                name="email"
                label="Електронна пошта"
                rules={[{ required: true, message: 'Введіть електронну пошту' }]}
            >
                <Input maxLength={50} showCount />
            </Form.Item>
            <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Введіть username' }]}
            >
                <Input maxLength={50} showCount />
            </Form.Item>
            <Form.Item
                name="phoneNumber"
                label="Телефон"
            >
                <Input maxLength={30} showCount />
            </Form.Item>
            <Form.Item
                name="password"
                label="Пароль"
                rules={[{ required: true, message: 'Введіть пароль' }]}
            >
                <Input.Password maxLength={30} showCount />
            </Form.Item>
            <Form.Item
                name="passwordConfirmation"
                label="Пароль підтвердження"
                rules={[{ required: true, message: 'Введіть пароль підтведження' }]}
            >
                <Input.Password maxLength={30} showCount />
            </Form.Item>
            <Form.Item className="center">
                <Button htmlType="submit" className="streetcode-custom-button">
                    Зареєструватися
                </Button>
            </Form.Item>
        </Form>
    );
};
export default RegistrationPage;
