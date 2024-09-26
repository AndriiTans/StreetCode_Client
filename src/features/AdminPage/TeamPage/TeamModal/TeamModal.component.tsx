import './TeamModal.styles.scss';
import '@features/AdminPage/AdminModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import SOCIAL_OPTIONS from '@features/AdminPage/TeamPage/TeamModal/constants/socialOptions';
import TeamMember, {
    LogoType, Positions,
    TeamCreateUpdate, TeamMemberLinkCreateUpdate,
} from '@models/team/team.model';
import useMobx from '@stores/root-store';

import {
    Button,
    Checkbox,
    Form, Input, message, Modal, Popover, Select, UploadFile,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { Option } from 'antd/es/mentions';

import PositionsApi from '@/app/api/team/positions.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import validateSocialLink from '@/app/common/components/modals/validators/socialLinkValidator';
import TeamLink from '@/features/AdminPage/TeamPage/TeamLink.component';
import Audio from '@/models/media/audio.model';
import Image from '@/models/media/image.model';

import POPOVER_CONTENT from '../../JobsPage/JobsModal/constants/popoverContent';
import { UploadChangeParam } from 'antd/es/upload';
import imageValidator, { checkImageFileType } from '@/app/common/components/modals/validators/imageValidator';

const TeamModal: React.FC<{
    teamMember?: TeamMember, open: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, afterSubmit?: (team: TeamCreateUpdate) => void
}> = observer(({ teamMember, open, setIsModalOpen, afterSubmit }) => {
    const LOGO_TYPES = Object.keys(LogoType).filter((key) => Number.isNaN(Number(key)));
    const [form] = Form.useForm();
    const { teamStore } = useMobx();
    const [positions, setPositions] = useState<Positions[]>([]);
    const [teamLinksForm] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [teamSourceLinks, setTeamSourceLinks] = useState<TeamMemberLinkCreateUpdate[]>([]);
    const [selectedPositions, setSelectedPositions] = useState<Positions[]>([]);
    const [isMain, setIsMain] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [actionSuccess, setActionSuccess] = useState(false);
    const [waitingForApiResponse, setWaitingForApiResponse] = useState(false);
    const imageId = useRef<number>(0);

    message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
    });

    const getImageAsFileInArray = (): UploadFile[] => (teamMember ? [
        {
            name: '',
            thumbUrl: base64ToUrl(teamMember.image?.base64, teamMember.image?.mimeType),
            uid: teamMember.imageId.toString(),
            status: 'done',
        },
    ] : []);

    useEffect(() => {
        if (open) {
            PositionsApi.getAll().then((pos) => setPositions(pos));
        }
    }, [open]);

    useEffect(() => {
        setIsMain(teamMember ? teamMember.isMain : false);
    }, [teamMember]);

    useEffect(() => {
        setWaitingForApiResponse(false);
        if (actionSuccess) {
            message.success('Члена команди успішно додано/оновлено!');
            setActionSuccess(false);
        }
    }, [actionSuccess]);

    useEffect(() => {
        if (teamMember && open) {
            imageId.current = teamMember.imageId;
            form.setFieldsValue({
                ...teamMember,
                positions: teamMember.positions.map((s) => s.position),
                image: getImageAsFileInArray(),
            });
            setSelectedPositions(teamMember.positions);
            setTeamSourceLinks([...teamMember.teamMemberLinks]);
        } else {
            imageId.current = 0;
        }
    }, [teamMember, open, form]);

    const getNewId = (objects: Array<{ id: number }>) => {
        let minId = Math.min(...objects.map((t) => t.id));

        if (minId < 0) {
            minId -= 1;
        } else {
            minId = -1;
        }

        return minId;
    };

    const onPositionSelect = (selectedValue: string) => {
        const selectedIndex = positions.findIndex((t) => t.position === selectedValue);

        if (selectedIndex < 0) {
            const id = getNewId(selectedPositions);

            setSelectedPositions([...selectedPositions, { id, position: selectedValue }]);
        } else {
            const selected = positions[selectedIndex];

            setSelectedPositions([...selectedPositions, { ...selected, position: selectedValue }]);
        }
    };

    const onPositionDeselect = (deselectedValue: string) => {
        setSelectedPositions(selectedPositions.filter((t) => t.position !== deselectedValue));
    };

    const closeAndCleanData = () => {
        if (!waitingForApiResponse) {
            form.resetFields();
            teamLinksForm.resetFields();
            setSelectedPositions([]);
            teamSourceLinks.splice(0);
            setIsModalOpen(false);
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
        const socialName = teamLinksForm.getFieldValue('logotype');
        const logotype = SOCIAL_OPTIONS.find((opt) => opt.value === socialName)?.logo;
        const newId = getNewId(teamSourceLinks);

        setTeamSourceLinks([...teamSourceLinks, {
            id: newId,
            logoType: Number(logotype),
            targetUrl: url,
        }]);
    };

    const removeImage = () => {
        imageId.current = 0;
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            setWaitingForApiResponse(true);
            await form.submit();
        } catch (error) {
            message.error("Будь ласка, заповніть всі обов'язкові поля та перевірте валідність ваших даних");
        }
    };

    const onSuccesfulSubmitPosition = async (formValues: any) => {
        message.loading('Зберігання...');
        teamSourceLinks.forEach((el, index) => {
            if (el.id < 0) {
                teamSourceLinks[index].id = 0;
            }
        });

        const team: TeamCreateUpdate = {
            id: 0,
            isMain,
            imageId: imageId.current,
            teamMemberLinks: teamSourceLinks,
            name: formValues.name,
            positions: selectedPositions,
            description: formValues.description ?? '',
        };

        // eslint-disable-next-line no-param-reassign
        teamMember = teamStore.getTeamArray.find(
            (t) => (formValues.name === t.name || imageId.current === t.imageId),
        );

        try {
            if (imageId.current === 0) {
                throw new Error("Image isn't uploaded yet");
            }

            if (teamMember) {
                team.id = teamMember.id;
                await teamStore.updateTeam(team);
            } else {
                await teamStore.createTeam(team);
            }

            if (afterSubmit) {
                afterSubmit(team);
            }
            setActionSuccess(true);
        } catch (error: unknown) {
            message.error('Не вдалось оновити/створити члена команди. Спробуйте ще раз.');
            setWaitingForApiResponse(false);
        }
    };

    const handleCheckboxChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setIsMain(e.target.checked);
    };

    const checkFile = (file: UploadFile) => checkImageFileType(file.type);

    const handleFileChange = (param: UploadChangeParam<UploadFile<unknown>>) => {
        if (checkFile(param.file)) {
            setFileList(param.fileList);
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
                    onFinish={onSuccesfulSubmitPosition}
                >
                    <div className="center">
                        <h2>
                            {teamMember ? 'Редагувати' : 'Додати'}
                            {' '}
нового члена команди
                        </h2>
                    </div>
                    <div className="checkbox-container">
                        <Form.Item>
                            <Checkbox checked={isMain} onChange={handleCheckboxChange}>
                                Ключовий член команди
                            </Checkbox>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="name"
                        label="Прізвище та ім'я: "
                        rules={[{ required: true, message: "Введіть прізвище та ім'я" }]}
                    >
                        <Input maxLength={41} showCount />
                    </Form.Item>

                    <Form.Item label="Позиції">
                        <div className="tags-block-positionitems">

                            <Select
                                className="positions-select-input"
                                onSelect={onPositionSelect}
                                mode="tags"
                                onDeselect={onPositionDeselect}
                                value={selectedPositions.map((x) => x.position)}
                            >
                                {positions.map((t) => <Option key={`${t.id}`} value={t.position} />)}
                            </Select>
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Опис: "
                    >
                        <TextArea showCount maxLength={70} />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Фото"
                        rules={[
                            {
                                required: true,
                                message: 'Будь ласка, завантажте фото',
                            },
                            { validator: imageValidator },
                        ]}
                    >
                        <FileUploader
                            fileList={fileList}
                            multiple={false}
                            accept=".jpeg,.png,.jpg,.webp"
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={checkFile}
                            onChange={handleFileChange}
                            onPreview={(e) => {
                                setFilePreview(e); setPreviewOpen(true);
                            }}
                            onRemove={removeImage}
                            uploadTo="image"
                            onSuccessUpload={(file: Image | Audio) => {
                                const image: Image = file as Image;
                                imageId.current = image.id;
                            }}
                            defaultFileList={getImageAsFileInArray()}
                        >
                            <p>Виберіть чи перетягніть файл</p>
                        </FileUploader>
                    </Form.Item>
                    <PreviewFileModal opened={previewOpen} setOpened={setPreviewOpen} file={filePreview} />

                </Form>
            </div>

            <Form
                layout="vertical"
                form={teamLinksForm}
                onFinish={onSuccesfulSubmitLinks}
            >
                <div className="team-source-list">

                    {teamSourceLinks.map((link) => (
                        <div
                            className="link-container"
                            key={`${link.id}${link.logoType}`}
                        >
                            <TeamLink link={link} />
                            <p>{link.targetUrl}</p>
                            <DeleteOutlined
                                onClick={() => setTeamSourceLinks(teamSourceLinks
                                    .filter((l) => l.id !== link.id))}
                            />
                        </div>
                    ))}
                </div>
                <div className="link-container">
                    <FormItem
                        name="logotype"
                        label="Соціальна мережа"
                        rules={[{ required: true, message: 'Оберіть соц. мережу' }]}
                        style={{ minWidth: '135px' }}
                    >
                        <Select
                            options={SOCIAL_OPTIONS}
                            onChange={() => teamLinksForm.validateFields(['url'])}
                        />
                    </FormItem>
                    <Form.Item
                        label="Посилання"
                        className="url-input"
                        name="url"
                        rules={[
                            { required: true, message: 'Введіть посилання' },
                            {
                                validator: (_, value) => {
                                    const socialName = teamLinksForm.getFieldValue('logotype');
                                    return validateSocialLink<LogoType>(
                                        value,
                                        SOCIAL_OPTIONS,
                                        LOGO_TYPES,
                                        teamSourceLinks,
                                        socialName,
                                    );
                                },
                            },
                        ]}
                    >
                        <Input min={1} max={255} showCount />
                    </Form.Item>

                    <Form.Item
                        label=" "
                    >
                        <Popover content="Додати" trigger="hover">
                            <Button htmlType="submit" className="plus-button">
                                <PlusOutlined />
                            </Button>
                        </Popover>
                    </Form.Item>
                </div>

                <div className="center">
                    {/* disabled={fileList?.length === 0} */}
                    <Button className="streetcode-custom-button" onClick={handleOk}>
                        Зберегти
                    </Button>
                </div>
            </Form>
        </Modal>
    );
});
export default TeamModal;
