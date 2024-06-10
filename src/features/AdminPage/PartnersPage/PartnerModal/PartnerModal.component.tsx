/* eslint-disable no-param-reassign */
import './PartnerModal.styles.scss';
import '@features/AdminPage/AdminModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import SOCIAL_OPTIONS from '@features/AdminPage/PartnersPage/PartnerModal/constants/socialOptions';
import useMobx from '@stores/root-store';

import {
    Button, Checkbox, Form, Input, message,
    Modal, Popover, Select, UploadFile,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import ImagesApi from '@/app/api/media/images.api';
import partnersApi from '@/app/api/partners/partners.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import PartnerLink from '@/features/AdminPage/PartnersPage/PartnerLink.component';
import Audio from '@/models/media/audio.model';
import Image from '@/models/media/image.model';
import Partner, {
    LogoType,
    PartnerCreateUpdate,
    PartnerSourceLinkCreateUpdate,
} from '@/models/partners/partners.model';
import { StreetcodeShort } from '@/models/streetcode/streetcode-types.model';
import POPOVER_CONTENT from '../../JobsPage/JobsModal/constants/popoverContent';

const PartnerModal: React.FC< {
  partnerItem?: Partner;
  open: boolean;
  isStreetcodeVisible?: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  afterSubmit?: (partner: Partner) => void;
}> = observer(
    ({
        partnerItem,
        open,
        setIsModalOpen,
        isStreetcodeVisible = true,
        afterSubmit,
    }) => {
        // eslint-disable-next-line max-len,no-useless-escape
        const URL_REGEX_VALIDATION_PATTERN = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,256}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
        const [form] = Form.useForm();
        const [urlTitleEnabled, setUrlTitleEnabled] = useState<string>('');
        const [urlTitleValue, setUrlTitleValue] = useState<string>('');
        const [showSecondForm, setShowSecondForm] = useState(false);
        const [showSecondFormButton, setShowSecondFormButton] = useState(true);

        const { partnersStore, streetcodeShortStore } = useMobx();
        const [partnerLinksForm] = Form.useForm();
        const [previewOpen, setPreviewOpen] = useState(false);
        const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
        const selectedStreetcodes = useRef<StreetcodeShort[]>([]);
        const [fileList, setFileList] = useState<UploadFile[]>([]);
        const [partnerSourceLinks, setPartnersSourceLinks] = useState<PartnerSourceLinkCreateUpdate[]>([]);
        const imageId = useRef<number>(0);
        const [actionSuccess, setActionSuccess] = useState(false);
        const [waitingForApiResponse, setWaitingForApiResponse] = useState(false);

        message.config({
            top: 100,
            duration: 2,
            maxCount: 1,
        });

        useEffect(() => {
            if (isStreetcodeVisible) {
                streetcodeShortStore.fetchStreetcodesAll();
            }
        }, []);

        useEffect(() => {
            setWaitingForApiResponse(false);
            if (actionSuccess) {
                message.success('Партнера успішно додано/оновлено!');
                setActionSuccess(false);
            }
        }, [actionSuccess]);

        useEffect(() => {
            const getImageAsFileInArray = (): UploadFile[] => (
                partnerItem
                    ? [
                        {
                            name: '',
                            thumbUrl: base64ToUrl(
                                partnerItem.logo?.base64,
                                partnerItem.logo?.mimeType,
                            ),
                            uid: partnerItem.logoId.toString(),
                            status: 'done',
                        },
                    ] : []);

            if (partnerItem && open) {
                imageId.current = partnerItem.logoId;
                setFileList(getImageAsFileInArray());

                form.setFieldsValue({
                    title: partnerItem.title,
                    isKeyPartner: partnerItem.isKeyPartner,
                    url: partnerItem.targetUrl?.href,
                    urlTitle: partnerItem.targetUrl?.title,
                    description: partnerItem.description,
                    partnersStreetcodes: partnerItem.streetcodes.map((s: { title: string; }) => s.title),
                    isVisibleEverywhere: partnerItem.isVisibleEverywhere,
                    logo: getImageAsFileInArray(),
                });
                setUrlTitleEnabled(form.getFieldValue('url'));
                setUrlTitleValue(form.getFieldValue('urlTitle'));

                selectedStreetcodes.current = partnerItem.streetcodes;
                setPartnersSourceLinks(
                    partnerItem.partnerSourceLinks.map((l: { id: any; logoType: any; targetUrl: { href: any; }; }) => ({
                        ...l,
                        targetUrl: l.targetUrl.href,
                    })),
                );
            } else {
                imageId.current = 0;
            }
        }, [partnerItem, open, form]);

        const handlePreview = (file: UploadFile) => {
            setFilePreview(file);
            setPreviewOpen(true);
        };

        const onStreetcodeSelect = (value: string) => {
            const index = streetcodeShortStore.streetcodes.findIndex(
                (c) => c.title === value,
            );
            selectedStreetcodes.current.push(streetcodeShortStore.streetcodes[index]);
        };

        const onStreetcodeDeselect = (value: string) => {
            selectedStreetcodes.current = selectedStreetcodes.current.filter(
                (c) => c.title !== value,
            );
        };

        const handleOk = async () => {
            try {
                setWaitingForApiResponse(true);
                await form.validateFields();
                form.submit();
                message.success('Партнера успішно додано!');
            } catch (error) {
                setWaitingForApiResponse(false);
                message.error("Будь ласка, заповніть всі обов'язкові поля та перевірте валідність ваших даних");
            }
        };

        const closeAndCleanData = () => {
            if (!waitingForApiResponse) {
                form.resetFields();
                partnerLinksForm.resetFields();
                selectedStreetcodes.current = [];
                partnerSourceLinks.splice(0);
                setIsModalOpen(false);
                setShowSecondForm(false);
                setShowSecondFormButton(true);
                setUrlTitleEnabled('');
                setUrlTitleValue('');
                setFileList([]);
            }
        };

        const closeModal = () => {
            if (!waitingForApiResponse) {
                setIsModalOpen(false);
            }
        };

        const onSuccesfulSubmitLinks = (formValues: any) => {
            const url = formValues.url as string;
            const logotype = partnerLinksForm.getFieldValue('logotype');

            let newId = Math.min(...partnerSourceLinks.map((item) => item.id));
            if (newId < 0) {
                newId -= 1;
            } else {
                newId = -1;
            }
            setPartnersSourceLinks([
                ...partnerSourceLinks,
                {
                    id: newId,
                    logoType: Number(LogoType[logotype]),
                    targetUrl: url,
                },
            ]);
            partnerLinksForm.resetFields();
            setShowSecondForm(false);
            setShowSecondFormButton(true);
        };

        const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            try {
                await form.validateFields(['url']);
                setUrlTitleEnabled(value);
            } catch (error) {
                setUrlTitleEnabled('');
            }
        };

        const handleUrlTitleChange = async (
            e: React.ChangeEvent<HTMLInputElement>,
        ) => {
            const { value } = e.target;
            setUrlTitleValue(value);
        };

        const handleShowSecondForm = () => {
            setShowSecondForm(true);
            setShowSecondFormButton(false);
        };

        const handleHideSecondForm = () => {
            setShowSecondForm(false);
            setShowSecondFormButton(true);
        };

        const onSuccesfulSubmitPartner = async (formValues: any) => {
            message.loading('Зберігання...');

            partnerSourceLinks.forEach((el, index) => {
                if (el.id < 0) {
                    partnerSourceLinks[index].id = 0;
                }
            });

            if (!form.getFieldValue('url')) {
                formValues.urlTitle = null;
            }

            const partner: PartnerCreateUpdate = {
                id: 0,
                isKeyPartner: formValues.isKeyPartner ?? false,
                logoId: imageId.current,
                partnerSourceLinks,
                streetcodes: selectedStreetcodes.current,
                targetUrl: formValues.url?.trim() || null,
                title: formValues.title,
                description: formValues.description?.trim() || null,
                urlTitle: formValues.urlTitle?.trim() || null,
                isVisibleEverywhere: formValues.isVisibleEverywhere ?? false,
            };

            partnersStore.getPartnerArray.map((t) => t).forEach((t) => {
                if (formValues.title === t.title || imageId.current === t.logoId) partnerItem = t;
            });

            try {
                if (!imageId.current) {
                    throw new Error("Image isn't uploaded yet");
                }

                if (partnerItem) {
                    partner.id = partnerItem.id;
                    await partnersStore.updatePartner(partner);
                } else {
                    await partnersStore.createPartner(partner);
                }
                console.log('Success');
                if (afterSubmit) {
                    const partnerWithLogo = partnersStore.PartnerMap.get(partner.id) as Partner;
                    afterSubmit(partnerWithLogo);
                }
                setActionSuccess(true);
            } catch (e: unknown) {
                message.error('Не вдалось оновити/створити партнера. Спробуйте ще раз.');
                setWaitingForApiResponse(false);
            }
        };

        return (
            <Modal
                open={open}
                onCancel={closeModal}
                className="modalContainer"
                footer={null}
                closeIcon={(
                    <Popover content={POPOVER_CONTENT.CANCEL} trigger="hover">
                        <CancelBtn className="iconSize" onClick={closeAndCleanData} />
                    </Popover>
                )}
            >
                <div className="modalContainer-content">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onSuccesfulSubmitPartner}
                    >
                        <div className="center">
                            <h2>
                                {partnerItem ? 'Редагувати' : 'Додати'}
                                {' '}
партнера
                            </h2>
                        </div>
                        <div className="checkbox-container">
                            <Form.Item
                                className="line-form-item"
                                name="isKeyPartner"
                                valuePropName="checked"
                                label="Ключовий партнер: "
                            >
                                <Checkbox />
                            </Form.Item>

                            <Form.Item
                                className="line-form-item"
                                name="isVisibleEverywhere"
                                valuePropName="checked"
                                label="Видимий для всіх: "
                            >
                                <Checkbox />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="title"
                            label="Назва: "
                            rules={[{ required: true, message: 'Введіть назву' }]}
                        >
                            <Input maxLength={100} showCount />
                        </Form.Item>

                        <Form.Item
                            name="url"
                            label="Посилання: "
                            rules={[
                                {
                                    pattern: URL_REGEX_VALIDATION_PATTERN,
                                    message: 'Введіть правильне посилання',
                                },
                            ]}
                        >
                            <Input maxLength={200} showCount onChange={handleUrlChange} />
                        </Form.Item>

                        <Form.Item name="urlTitle" label="Назва посилання:">
                            <Input
                                maxLength={100}
                                showCount
                                disabled={!urlTitleEnabled}
                                onChange={handleUrlTitleChange}
                            />
                        </Form.Item>
                        {urlTitleEnabled === '' && urlTitleValue && (
                            <p className="error-text">
                Введіть правильне посилання для збереження назви посилання.
                            </p>
                        )}

                        <Form.Item name="description" label="Опис: ">
                            <TextArea showCount maxLength={450} />
                        </Form.Item>

                        <Form.Item
                            name="logo"
                            label="Лого"
                            valuePropName="fileList"
                            getValueFromEvent={(e: any) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e?.fileList;
                            }}
                            rules={[{ required: true, message: 'Завантажте лого' }]}
                        >
                            <FileUploader
                                onChange={(param) => {
                                    setFileList(param.fileList);
                                }}
                                fileList={fileList}
                                className="logo-uploader"
                                multiple={false}
                                accept=".jpeg,.png,.jpg,.webp"
                                listType="picture-card"
                                maxCount={1}
                                onPreview={handlePreview}
                                onRemove={() => {
                                    imageId.current = 0;
                                }}
                                uploadTo="image"
                                onSuccessUpload={(image: Image | Audio) => {
                                    imageId.current = image.id;
                                }}
                            >
                                <p>Виберіть чи перетягніть файл</p>
                            </FileUploader>
                        </Form.Item>
                        <PreviewFileModal
                            opened={previewOpen}
                            setOpened={setPreviewOpen}
                            file={filePreview}
                        />

                        {isStreetcodeVisible ? (
                            <Form.Item name="partnersStreetcodes" label="Стріткоди: ">
                                <Select
                                    mode="multiple"
                                    onSelect={onStreetcodeSelect}
                                    onDeselect={onStreetcodeDeselect}
                                >
                                    {streetcodeShortStore.streetcodes.map((s) => (
                                        <Select.Option key={`${s.id}`} value={s.title}>
                                            {s.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : (
                            ''
                        )}
                    </Form>
                </div>
                <div className="partner-source-list">
                    {partnerSourceLinks.map((link) => (
                        <div
                            key={`${link.id}${link.logoType}`}
                            className="partner-source-list-item"
                        >
                            <PartnerLink link={link} />
                            <p>{link.targetUrl}</p>
                            <DeleteOutlined
                                onClick={() => setPartnersSourceLinks(
                                    partnerSourceLinks.filter((l) => l.id !== link.id),
                                )}
                            />
                        </div>
                    ))}
                </div>
                {showSecondFormButton && (
                    <Button
                        onClick={handleShowSecondForm}
                        className="add-social-media-button"
                    >
            Додати соціальну мережу
                    </Button>
                )}
                <Form
                    layout="vertical"
                    form={partnerLinksForm}
                    onFinish={onSuccesfulSubmitLinks}
                >
                    {showSecondForm && (
                        <div>
                            <div className="button-container">
                                <Button onClick={handleHideSecondForm} className="close-button">
                  Закрити
                                </Button>
                            </div>
                            <div className="link-container">
                                <FormItem
                                    name="logotype"
                                    label="Соціальна мережа"
                                    rules={[{ required: true, message: 'Виберіть соц. мережу' }]}
                                    className="social-media-form-item"
                                >
                                    <Select options={SOCIAL_OPTIONS} />
                                </FormItem>
                                <Form.Item
                                    label="Посилання"
                                    name="url"
                                    rules={[
                                        { required: true, message: 'Введіть Посилання' },
                                        {
                                            pattern: URL_REGEX_VALIDATION_PATTERN,
                                            message: 'Введіть правильне посилання',
                                        },
                                        {
                                            validator: (_, value) => {
                                                const logotype = partnerLinksForm.getFieldValue('logotype');

                                                if (!value || !logotype || value.toLowerCase().includes(logotype)) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(new Error(
                                                    'Посилання не співпадає з вибраним текстом',
                                                ));
                                            },
                                        },
                                    ]}
                                >
                                    <Input min={1} maxLength={255} showCount />
                                </Form.Item>

                                <Form.Item label=" ">
                                    <Popover content="Додати" trigger="hover">
                                        <Button htmlType="submit" className="plus-button">
                                            <PlusOutlined />
                                        </Button>
                                    </Popover>
                                </Form.Item>
                            </div>
                        </div>
                    )}
                </Form>

                <div className="center">
                    {showSecondForm ? (
                        <Popover content="Завершіть додавання соціальної мережі" trigger="hover">
                            <span>
                                <Button disabled className="streetcode-custom-button save">
                  Зберегти
                                </Button>
                            </span>
                        </Popover>
                    ) : (
                        <Button
                            disabled={showSecondForm || fileList.length === 0}
                            className="streetcode-custom-button save"
                            onClick={handleOk}
                        >
              Зберегти
                        </Button>
                    )}
                </div>
            </Modal>
        );
    },
);

export default PartnerModal;
