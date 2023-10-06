import './PreviewImageModal.styles.scss';

import React, { useEffect, useState } from 'react';
import useMobx from '@stores/root-store';

import { Button, Form, Input, Modal } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';

interface Props {
    artIdx: number,
    opened: boolean,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
}

const PreviewFileModal = ({ opened, setOpened, artIdx }: Props) => {
    const { artStore } = useMobx();
    const [fileProps, setFileProps] = useState<{
      previewImage: string;
      previewTitle: string;
    }>({ previewImage: '', previewTitle: '' });
    const [form] = Form.useForm();

    const handleCancel = () => {
        setOpened(false);
        form.resetFields();
    };

    const handleSave = () => {
        if (!artIdx) {
            return;
        }
        artStore.getArtArray[artIdx].title = form.getFieldValue('title');
        artStore.getArtArray[artIdx].description = form.getFieldValue('description');

        setOpened(false);
        form.resetFields();
    };

    useEffect(() => {
        if (artIdx && opened) {
            form.setFieldsValue({
                title: artStore.getArtArray[artIdx]?.title ?? '',
                description: artStore.getArtArray[artIdx]?.description ?? '',
            });
        }
        const url = base64ToUrl(
            artStore.getArtArray[artIdx]?.image?.base64,
            artStore.getArtArray[artIdx]?.image?.mimeType,
        );
        setFileProps({
            previewImage: url || '',
            previewTitle: artStore.getArtArray[artIdx]?.title || '',
        });
    }, [opened]);

    return (
        <Modal
            key={artStore.getArtArray[artIdx]?.image?.id ?? 'preview-file-modal'}
            open={opened}
            title="Додаткові дані"
            footer={null}
            onCancel={handleCancel}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSave}
            >
                <div className="artPreviewModal">
                    <img alt="uploaded" src={fileProps.previewImage} />

                    <FormItem
                        name="title"
                        label="Назва"
                    >
                        <Input
                            showCount
                            maxLength={150}
                        />
                    </FormItem>
                    <FormItem
                        name="description"
                        label="Опис"
                    >
                        <TextArea
                            showCount
                            maxLength={400}
                        />
                    </FormItem>
                    <Button onClick={handleSave} className="saveButton">Зберегти</Button>
                </div>

            </Form>
        </Modal>
    );
};
export default PreviewFileModal;
