import './PartnerModal.styles.scss';
import '@features/AdminPage/AdminModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import useMobx from '@stores/root-store';

import {
    Button, Form, Input, Modal, UploadFile,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';

import ImagesApi from '@/app/api/media/images.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';

const NewsModal:React.FC<{ newsItem?:News, open:boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, afterSubmit?:(news:News)=>void
 }> = observer(({ newsItem, open, setIsModalOpen, afterSubmit }) => {
     const [form] = Form.useForm();
     const { newsStore } = useMobx();
     const [previewOpen, setPreviewOpen] = useState(false);
     const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
     const imageId = useRef<number>(0);
     const handlePreview = async (file: UploadFile) => {
         setFilePreview(file);
         setPreviewOpen(true);
     };
     useEffect(() => {
         if (newsItem && open) {
             imageId.current = newsItem.imageId!;
             form.setFieldsValue({
                 title: newsItem.title,
                 url: newsItem.url,
                 text: newsItem.text,
                 image: [
                     { name: '',
                       thumbUrl: base64ToUrl(newsItem.image?.base64, newsItem.image?.mimeType),
                       uid: newsItem.imageId?.toString(),
                       status: 'done' }],
             });
         } else {
             imageId.current = 0;
         }
     }, [newsItem, open, form]);

     const closeAndCleanData = () => {
         form.resetFields();
         setIsModalOpen(false);
     };

     const onSuccessfulSubmitNews = async (formValues:any) => {
         const news: News = {
             id: 0,
             imageId: imageId.current,
             url: formValues.url,
             title: formValues.title,
             text: formValues.text,
         };

         let success = false;
         if (newsItem) {
             news.id = newsItem.id;
             Promise.all([
                 newsStore.updateNews(news)
                     .then(() => {
                         success = true;
                         console.log(news);
                     })
                     .catch((e) => {
                         console.log(e); success = false;
                     }),
             ]);
         } else {
             Promise.all([
                 newsStore.createNews(news)
                     .then(() => {
                         success = true;
                     })
                     .catch((e) => {
                         console.log(e); success = false;
                     }),
             ]);
         }
         closeAndCleanData();
         if (success && afterSubmit) {
             afterSubmit(news);
         }
     };

     return (
         <Modal
             open={open}
             onCancel={closeAndCleanData}
             className="modalContainer"
             closeIcon={<CancelBtn />}
             footer={null}
         >
             <div className="modalContainer-content">
                 <Form
                     form={form}
                     layout="vertical"
                     onFinish={onSuccessfulSubmitNews}
                 >
                     <div className="center">
                         <h2>
                             {newsItem ? 'Редагувати' : 'Додати'}
                             {' '}
Новину
                         </h2>
                     </div>
                     <Form.Item
                         name="title"
                         label="Заголовок: "
                         rules={[{ required: true, message: 'Введіть заголовок' }]}
                     >
                         <Input maxLength={100} showCount />
                     </Form.Item>

                     <Form.Item
                         name="url"
                         label="Посилання: "
                     >
                         <Input maxLength={200} showCount />
                     </Form.Item>

                     <Form.Item
                         name="text"
                         label="Текст новини: "
                     >
                         <TextArea showCount />
                     </Form.Item>

                     <Form.Item
                         name="image"
                         label="Картинка"
                         valuePropName="fileList"
                         getValueFromEvent={(e: any) => {
                             if (Array.isArray(e)) {
                                 return e;
                             }
                             return e?.fileList;
                         }}
                     >
                         <FileUploader
                             multiple={false}
                             accept=".jpeg,.png,.jpg"
                             listType="picture-card"
                             maxCount={1}
                             onPreview={handlePreview}
                             uploadTo="image"
                             onSuccessUpload={(image:Image) => {
                                 imageId.current = image.id;
                             }}
                             onRemove={(image) => {
                                 ImagesApi.delete(imageId.current);
                             }}
                             defaultFileList={(newsItem)
                                 ? [{ name: '',
                                      thumbUrl: base64ToUrl(newsItem.image?.base64, newsItem.image?.mimeType),
                                      uid: newsItem.imageId?.toString(),
                                      status: 'done' }]
                                 : []}
                         >
                             <p>Виберіть чи перетягніть файл</p>
                         </FileUploader>
                     </Form.Item>
                     <PreviewFileModal opened={previewOpen} setOpened={setPreviewOpen} file={filePreview} />
                     <div className="center">
                         <Button className="streetcode-custom-button" onClick={() => form.submit()}>
                             Зберегти
                         </Button>
                     </div>
                 </Form>
             </div>
         </Modal>
     );
 });
export default NewsModal;
