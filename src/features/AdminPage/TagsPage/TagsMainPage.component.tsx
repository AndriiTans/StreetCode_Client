import './TagsMainPage.style.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useMobx, { useModalContext } from '@stores/root-store';
import { useQuery } from '@tanstack/react-query';

import { Button, Empty, Pagination } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import Tag from '@/models/additional-content/tag.model';

import TagAdminModal from './TagsPage/TagAdminModal';

const TagsMainPage: React.FC = observer(() => {
    const { modalStore } = useModalContext();
    const { tagsStore } = useMobx();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [tagToEdit, setTagToEdit] = useState<Tag>();

    const { isLoading } = useQuery({
        queryKey: ['tags', tagsStore.PaginationInfo.CurrentPage],
        queryFn: () => tagsStore.fetchAllTags(),
    });

    const updatedTags = () => {
        tagsStore.fetchAllTags();
    };

    useEffect(() => {
        updatedTags();
    }, [modalAddOpened, modalEditOpened]);

    const columns: ColumnsType<Tag> = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            render(value, record) {
                return (
                    <div>
                        {value}
                    </div>
                );
            },
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (value, tag, index) => (
                <div key={`${tag.id}${index}1`} className="tag-page-actions">
                    <DeleteOutlined
                        key={`${tag.id}${index}`}
                        className="actionButton"
                        onClick={() => {
                            modalStore.setConfirmationModal(
                                'confirmation',
                                () => {
                                    if (tag.id != undefined) {
                                        tagsStore.deleteTag(tag.id)
                                        .catch((e) => {
                                            console.error(e);
                                        });
                                        modalStore.setConfirmationModal('confirmation');
                                    }
                                },
                                'Ви впевнені, що хочете видалити цей тег?',
                            );
                        }}
                    />
                    <EditOutlined
                        key={`${tag.id}${index}2`}
                        className="actionButton"
                        onClick={() => {
                            setTagToEdit(tag);
                            setModalEditOpened(true);
                        }}
                    />

                </div>
            ),
        },
    ];
    return (
        <div className="tags-page">
            <div className="tags-page-container">
                <div className="container-justify-end">
                    <Button
                        className="streetcode-custom-button tags-page-add-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        Додати новий тег
                    </Button>
                </div>
                <Table
                    pagination={false}
                    className="tags-table"
                    columns={columns}
                    dataSource={tagsStore.getAllTagsArray || []}
                    rowKey="id"
                    locale={{
                        emptyText: isLoading ? (
                            <div className="loadingWrapper">
                                <div id="loadingGif" />
                            </div>
                        ) : (
                            <Empty description="Дані відсутні" />
                        ),
                    }}
                />
                <div className="underTableZone">
                    <br />
                    <div className="underTableElement">
                        <Pagination
                            className="paginationElement"
                            showSizeChanger={false}
                            defaultCurrent={1}
                            current={tagsStore.PaginationInfo.CurrentPage}
                            total={tagsStore.PaginationInfo.TotalItems}
                            pageSize={tagsStore.PaginationInfo.PageSize}
                            onChange={(value: any) => {
                                tagsStore.setCurrentPage(value);
                            }}
                        />
                    </div>
                </div>
            </div>
            <TagAdminModal isModalVisible={modalAddOpened} setIsModalOpen={setModalAddOpened} />
            <TagAdminModal isModalVisible={modalEditOpened} setIsModalOpen={setModalEditOpened} initialData={tagToEdit} />
        </div>

    );
});
export default TagsMainPage;
