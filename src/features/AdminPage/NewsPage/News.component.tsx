/* eslint-disable no-restricted-imports */
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import NewsModal from '@features/AdminPage/NewsPage/NewsModal/NewsModal.component';
import PageBar from '@features/AdminPage/PageBar/PageBar.component';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { Button, Pagination } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';

const Newss: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { newsStore, imagesStore } = useMobx();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [newsToEdit, setNewsToEdit] = useState<News>();

    // QueryClient is used in newsStore to mark query as stale
    // whenever data modification occurs( create, update, delete ), so news refetching happens.
    const queryClient = useQueryClient();
    useEffect(() => {
        newsStore.setQueryClient(queryClient);
    }, []);

    // Function for decreasing current page and rerendering component,
    // if currenPage is bigger than TotalPages(may happen when we delete news).
    const decreaseCurrentPageNumberIfTooBig = () => {
        if (newsStore.getPaginationInfo.TotalPages && currentPage > newsStore.getPaginationInfo.TotalPages) {
            setCurrentPage(newsStore.getPaginationInfo.TotalPages);
        }
    };

    // Fetch paginated news from api and decrease currentPage if it
    // is bidder than TotalPages value from x-pagination header.
    const getNews: () => void = () => {
        newsStore.fetchSortedNews(currentPage, 7);
        decreaseCurrentPageNumberIfTooBig();
        imagesStore.fetchImages(newsStore.getNewsArray || []);
    };

    getNews();

    const columns: ColumnsType<News> = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            render(value, record) {
                return (
                    <div onClick={() => window.open(`${FRONTEND_ROUTES.OTHER_PAGES.NEWS}/${record.url}`, '_blank')}>
                        {value}
                    </div>
                );
            },
        },
        {
            title: 'Картинка',
            dataIndex: 'image',
            key: 'image',
            width: '25%',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: (image: Image, record) => (
                <img
                    key={`${record.id}${record.image?.id}}`}
                    className="partners-table-logo"
                    src={base64ToUrl(image?.base64, image?.mimeType ?? '')}
                    alt={image?.imageDetails?.alt}
                />
            ),

        },
        {
            title: 'Дата створення',
            dataIndex: 'creationDate',
            key: 'creationDate',
            width: '20%',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: (value: string, record) => (
                <div key={value} className="partner-table-item-name">
                    <p>{value ? dayjs(value).format('YYYY-MM-DD') : ''}</p>
                </div>
            ),
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '20%',
            render: (value, news, index) => (
                <div key={`${news.id}${index}1`} className="partner-page-actions">
                    <DeleteOutlined
                        key={`${news.id}${index}`}
                        className="actionButton"
                        onClick={() => {
                            modalStore.setConfirmationModal(
                                'confirmation',
                                () => {
                                    newsStore.deleteNews(news.id).then(() => {
                                        imagesStore.deleteImage(news.imageId);
                                    }).catch((e) => {
                                        console.log(e);
                                    });
                                    modalStore.setConfirmationModal('confirmation');
                                },
                                'Ви впевнені, що хочете видалити цю новину?',
                            );
                        }}
                    />
                    <EditOutlined
                        key={`${news.id}${index}2`}
                        className="actionButton"
                        onClick={() => {
                            setNewsToEdit(news);
                            setModalEditOpened(true);
                        }}
                    />

                </div>
            ),
        },
    ];
    return (
        <div className="partners-page">
            <PageBar />
            <div className="partners-page-container">
                <div className="container-justify-end">
                    <Button
                        className="streetcode-custom-button partners-page-add-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        Створити новину
                    </Button>
                </div>
                <Table
                    pagination={false}
                    className="partners-table"
                    columns={columns}
                    dataSource={newsStore.getNewsArray}
                    rowKey="id"
                    scroll={{ y: 440 }}
                />
                <div className="underTableZone">
                    <br />
                    <div className="underTableElement">
                        <Pagination
                            className="pagenationElement"
                            simple
                            defaultCurrent={1}
                            current={newsStore.getPaginationInfo.CurrentPage}
                            total={newsStore.getPaginationInfo.TotalItems}
                            pageSize={newsStore.getPaginationInfo.PageSize}
                            onChange={(value: any) => {
                                setCurrentPage(value);
                            }}
                        />
                    </div>
                </div>
                <NewsModal open={modalAddOpened} setIsModalOpen={setModalAddOpened} />
                <NewsModal
                    open={modalEditOpened}
                    setIsModalOpen={setModalEditOpened}
                    newsItem={newsToEdit}
                />
            </div>
        </div>
    );
});

export default Newss;
