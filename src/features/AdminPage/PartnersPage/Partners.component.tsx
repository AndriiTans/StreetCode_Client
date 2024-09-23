import './Partners.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, StarOutlined } from '@ant-design/icons';
import facebook from '@assets/images/partners/facebook.svg';
import instagram from '@assets/images/partners/instagram.svg';
import twitter from '@assets/images/partners/twitterNew.svg';
import youtube from '@assets/images/partners/youtube.svg';
import useMobx, { useModalContext } from '@stores/root-store';

import { Button, Pagination } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import PartnersApi from '@/app/api/partners/partners.api';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import Partner, { PartnerSourceLink } from '@/models/partners/partners.model';

import PageBar from '../PageBar/PageBar.component';

import PartnerModal from './PartnerModal/PartnerModal.component';
import { useQuery } from '@tanstack/react-query';

const LogoType = [twitter, instagram, facebook, youtube];

const Partners: React.FC = observer(() => {
    const { partnersStore } = useMobx();

    const { modalStore } = useModalContext();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [partnerToEdit, setPartnerToedit] = useState<Partner>();

    useQuery({
        queryKey: ['partners', partnersStore.PaginationInfo.CurrentPage],
        queryFn: () => {partnersStore.getAll()},
    });

    const columns: ColumnsType<Partner> = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="partner-table-item-name">
                        <p>{value}</p>
                        {record.isKeyPartner ? <StarOutlined /> : ''}
                    </div>
                );
            },
        },
        {
            title: 'Посилання на сайт',
            dataIndex: 'targetUrl',
            key: 'url',
            width: '28%',
            render: (targeteurl) => (
                <a
                    className="site-link"
                    key={`${targeteurl.href}`}
                    href={targeteurl.href}
                >
                    {targeteurl.title ?? targeteurl.href}
                </a>
            ),
        },
        {
            title: 'Лого',
            dataIndex: 'logo',
            key: 'logo',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: (logo: Image, record) => (
                <img
                    key={`${record.id}${record.logo?.id}}`}
                    className="partners-table-logo"
                    src={base64ToUrl(logo?.base64, logo?.mimeType ?? '')}
                    alt={logo?.imageDetails?.alt ?? "default"}
                />
            ),

        },
        {
            title: 'Соц. мережі',
            dataIndex: 'partnerSourceLinks',
            key: 'partnerSourceLinks',
            width: '12%',
            render: (links: PartnerSourceLink[], partner) => (
                <div key={`${links.length}${partner.id}${partner.logoId}`} className="partner-links">
                    {links.map((link) => {
                        const LogoComponent = LogoType[link.logoType];
                        return (
                            <a
                                key={`${link.id}${link.targetUrl}`}
                                rel="noreferrer"
                                target="_blank"
                                className="sourceLink"
                                href={link.targetUrl.href}
                            >
                                <LogoComponent />
                            </a>
                        );
                    })}
                </div>
            ),
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (value, partner, index) => (
                <div key={`${partner.id}${index}`} className="partner-page-actions">
                    <DeleteOutlined
                        key={`${partner.id}${index}111`}
                        className="actionButton"
                        onClick={() => {
                            modalStore.setConfirmationModal(
                                'confirmation',
                                () => {
                                    PartnersApi.delete(partner.id)
                                        .then(() => {
                                            partnersStore.PartnerMap.delete(partner.id);
                                        }).catch((e) => { });
                                    modalStore.setConfirmationModal('confirmation');
                                },
                                'Ви впевнені, що хочете видалити цього партнера?',
                            );
                        }}
                    />
                    <EditOutlined
                        key={`${partner.id}${index}222`}
                        className="actionButton"
                        onClick={() => {
                            setPartnerToedit(partner);
                            setModalEditOpened(true);
                        }}
                    />
                </div>
            )
        },
    ];

    return (
        <div className="partners-page">
            <PageBar />
            <div className="partners-page-container">
                <div className="container-justify-end">
                    <Button
                        className="streetcode-custom-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        Створити партнера
                    </Button>
                </div>
                <div>
                    <Table
                        pagination={false}
                        className="partners-table"
                        columns={columns}
                        dataSource={partnersStore?.getPartnerArray}
                        rowKey="id"
                    />
                </div>
                <div>
                    <div className="underTableZone">
                        <div className="underTableElement">
                        <Pagination
                            className="paginationElement"
                            showSizeChanger={false}
                            defaultCurrent={1}
                            current={partnersStore.PaginationInfo.CurrentPage}
                            total={partnersStore.PaginationInfo.TotalItems}
                            pageSize={partnersStore.PaginationInfo.PageSize}
                            onChange={(value: any) => {
                                partnersStore.setCurrentPage(value);
                            }}
                        />
                        </div>
                    </div>
                </div>
            </div>
            <PartnerModal open={modalAddOpened} setIsModalOpen={setModalAddOpened} isStreetcodeVisible />
            <PartnerModal
                open={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                partnerItem={partnerToEdit}
                isStreetcodeVisible
            />
        </div>

    );
});
export default Partners;
