/* eslint-disable complexity */
import './MainNewStreetcode.styles.scss';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StreetcodeCoordinateApi from '@app/api/additional-content/streetcode-cooridnates.api';
import SubtitlesApi from '@app/api/additional-content/subtitles.api';
import VideosApi from '@app/api/media/videos.api';
import PartnersApi from '@app/api/partners/partners.api';
import SourcesApi from '@app/api/sources/sources.api';
import RelatedFigureApi from '@app/api/streetcode/related-figure.api';
import TextsApi from '@app/api/streetcode/text-content/texts.api';
import useMobx from '@app/stores/root-store';
import PageBar from '@features/AdminPage/PageBar/PageBar.component';
import StreetcodeCoordinate from '@models/additional-content/coordinate.model';
import { ModelState } from '@models/enums/model-state';
import { RelatedFigureCreateUpdate, RelatedFigureUpdate } from '@models/streetcode/related-figure.model';

import { Button, ConfigProvider, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ukUA from 'antd/locale/uk_UA';

import StatisticRecordApi from '@/app/api/analytics/statistic-record.api';
import StreetcodeArtApi from '@/app/api/media/streetcode-art.api';
import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import TransactionLinksApi from '@/app/api/transactions/transactLinks.api';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import Subtitle, { SubtitleCreate } from '@/models/additional-content/subtitles.model';
import { StreetcodeTag, StreetcodeTagUpdate } from '@/models/additional-content/tag.model';
import StatisticRecord from '@/models/analytics/statisticrecord.model';
import { ArtCreateDTO } from '@/models/media/art.model';
import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';
import Video, { VideoCreate } from '@/models/media/video.model';
import { PartnerCreateUpdateShort, PartnerUpdate } from '@/models/partners/partners.model';
import { StreetcodeCategoryContent, StreetcodeCategoryContentUpdate } from '@/models/sources/sources.model';
import { StreetcodeCreate, StreetcodeType, StreetcodeUpdate } from '@/models/streetcode/streetcode-types.model';
import { Fact, Text, TextCreate } from '@/models/streetcode/text-contents.model';
import TimelineItem from '@/models/timeline/chronology.model';

import ARBlock from './ARBlock/ARBlock.component';
import ArtGalleryBlock from './ArtGallery/ArtGallery.component';
import ForFansBlock from './ForFansBlock/ForFansBlock.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import InterestingFactsBlock from './InterestingFactsBlock/InterestingFactsBlock.component';
import MainBlockAdmin from './MainBlock/MainBlockAdmin.component';
import MapBlockAdmin from './MapBlock/MapBlockAdmin.component';
import PartnerBlockAdmin from './PartnerBlock/PartnerBlockAdmin.components';
import SubtitleBlock from './SubtitileBlock/SubtitleBlock.component';
import TextBlock from './TextBlock/TextBlock.component';
import TimelineBlockAdmin from './TimelineBlock/TimelineBlockAdmin.component';

const NewStreetcode = () => {
    const publish = 'Опублікувати';
    const draft = 'Зберегти як чернетку';
    const [form] = useForm();
    const {
        factsStore,
        timelineItemStore,
        newStreetcodeInfoStore,
        sourceCreateUpdateStreetcode,
        streetcodeCoordinatesStore,
        statisticRecordStore,
        streetcodeArtStore,
        tagsStore,
    } = useMobx();

    const [partners, setPartners] = useState<PartnerCreateUpdateShort[]>([]);
    const [selectedTags, setSelectedTags] = useState<StreetcodeTag[]>([]);
    const [inputInfo, setInputInfo] = useState<Partial<Text>>();
    const [video, setVideo] = useState<Video>();
    const [streetcodeType, setStreetcodeType] = useState<StreetcodeType>(StreetcodeType.Person);
    const [subTitle, setSubTitle] = useState<Partial<Subtitle>>();
    const [figures, setFigures] = useState<RelatedFigureCreateUpdate[]>([]);
    const [coordinates, setCoordinates] = useState<StreetcodeCoordinate[]>([]);
    const [firstDate, setFirstDate] = useState<Date>();
    const [dateString, setDateString] = useState<string>();
    const [secondDate, setSecondDate] = useState<Date>();
    const [arts, setArts] = useState<StreetcodeArtCreateUpdate[]>([]);
    const [status, setStatus] = useState<number>();
    const { id } = useParams<any>();
    const navigate = useNavigate();

    const [funcName, setFuncName] = useState<string>('create');
    const parseId = id ? +id : null;

    useEffect(() => {
        if (ukUA.DatePicker) {
            ukUA.DatePicker.lang.locale = 'uk';
        }

        if (parseId) {
            StreetcodeArtApi.getStreetcodeArtsByStreetcodeId(parseId).then((result) => {
                const artToUpdate = result.map((streetcodeArt) => ({
                    ...streetcodeArt,
                    art: {
                        ...streetcodeArt.art,
                        image: {
                            ...streetcodeArt.art.image,
                            title: streetcodeArt.art.title ?? '',
                        },
                    },
                    modelState: ModelState.Updated,
                    isPersisted: true,
                }));

                setArts([...artToUpdate]);
            });
            StreetcodesApi.getById(parseId).then((x) => {
                if (x.lastName && x.firstName) {
                    form.setFieldsValue({
                        surname: x.lastName,
                        name: x.firstName,
                        streetcodeNumber: x.index,
                        title: x.title,
                        alias: x.alias,
                        streetcodeUrlName: x.transliterationUrl,
                        firstDate: x.eventStartOrPersonBirthDate,
                        secondDate: x.eventEndOrPersonDeathDate,
                        teaser: x.teaser,
                        video,
                    });
                    setFirstDate(x.eventStartOrPersonBirthDate);
                    setSecondDate(x.eventEndOrPersonDeathDate);
                    setDateString(x.dateString);
                    setStreetcodeType(StreetcodeType.Person);

                    const tagsToUpdate: StreetcodeTagUpdate[] = x.tags.map((tag) => ({
                        ...tag,
                        isPersisted: true,
                        modelState: ModelState.Updated,
                    }));
                    setSelectedTags(tagsToUpdate);
                } else {
                    form.setFieldsValue({
                        streetcodeNumber: parseId,
                        title: x.title,
                        alias: x.alias,
                        streetcodeUrlName: x.transliterationUrl,
                        firstDate: x.eventStartOrPersonBirthDate,
                        secondDate: x.eventEndOrPersonDeathDate,

                        teaser: x.teaser,
                        video: 'asdasd',
                    });
                    setFirstDate(x.eventStartOrPersonBirthDate);
                    setSecondDate(x.eventEndOrPersonDeathDate);
                    setDateString(x.dateString);
                    setSelectedTags(x.tags);
                    setStreetcodeType(StreetcodeType.Event);
                }

                setFuncName('update');
            });
            TextsApi.getByStreetcodeId(parseId).then((result) => {
                setInputInfo(result);
            });
            VideosApi.getByStreetcodeId(parseId).then((result) => {
                setVideo(result);
            });
            RelatedFigureApi.getByStreetcodeId(parseId).then((result) => {
                const persistedFigures: RelatedFigureCreateUpdate[] = result.map((item) => ({
                    id: item.id,
                    title: item.title,
                    isPersisted: true,
                    modelState: ModelState.Updated,
                }));

                setFigures(persistedFigures);
            });
            PartnersApi.getToUpdateByStreetcodeId(parseId).then((result) => {
                const persistedPartners: PartnerCreateUpdateShort[] = result.map((item) => ({
                    id: item.id,
                    title: item.title,
                    isPersisted: true,
                    modelState: ModelState.Updated,
                }));

                setPartners(persistedPartners);
            });
            SubtitlesApi.getSubtitlesByStreetcodeId(parseId).then((result) => {
                setSubTitle(result);
            });
            SourcesApi.getCategoriesByStreetcodeId(parseId).then((result) => {
                const id = result.map((x) => x.id);
                id.map((x) => {
                    SourcesApi.getCategoryContentByStreetcodeId(parseId, x).then((x) => {
                        const newSource: StreetcodeCategoryContent = {
                            sourceLinkCategoryId: x.sourceLinkCategoryId,
                            streetcodeId: x.streetcodeId,
                            id: x.id,
                            text: x.text,
                        };
                        const existingSource = sourceCreateUpdateStreetcode
                            .streetcodeCategoryContents.find((s) => s
                                .sourceLinkCategoryId === newSource.sourceLinkCategoryId);

                        if (!existingSource) {
                            const persistedItem: StreetcodeCategoryContentUpdate = {
                                ...newSource,
                                isPersisted: true,
                                modelState: ModelState.Updated,
                            };

                            sourceCreateUpdateStreetcode.addSourceCategoryContent(persistedItem);
                        }
                    });
                });
            });
            TransactionLinksApi.getByStreetcodeId(parseId)
                .then((res) => {
                    if (res) {
                        form.setFieldValue('arlink', res.qrCodeUrl.href);
                    }
                });
            factsStore.fetchFactsByStreetcodeId(parseId);
            timelineItemStore.fetchTimelineItemsByStreetcodeId(parseId);
            statisticRecordStore.fetchStatisticRecordsByStreetcodeId(parseId);
        }
    }, []);

    const onFinish = (data: any) => {
        let tempStatus = 0;

        if (data.target.getAttribute('name') as string) {
            const buttonName = data.target.getAttribute('name') as string;
            if (buttonName.includes(publish)) {
                tempStatus = 1;
            }
        }
        data.stopPropagation();

        const subtitles: SubtitleCreate[] = subTitle?.subtitleText
            ? [{ subtitleText: subTitle.subtitleText }]
            : [];

        const videos: VideoCreate[] = inputInfo?.link
            ? [{ url: inputInfo?.link || '' }]
            : [];

        const text: TextCreate = {
            title: inputInfo?.title,
            textContent: inputInfo?.textContent,
            additionalText:
                inputInfo?.аdditionalText === '<p>Текст підготовлений спільно з</p>'
                    ? '' : inputInfo?.аdditionalText,
        };

        const streetcodeArts: ArtCreateDTO[] = arts.map((art) => ({
            imageId: art.art.imageId,
            description: art.art.description ?? '',
            index: art.index,
            title: art.art.image.title ?? '',
            mimeType: art.art.image.mimeType,
        }));

        const streetcode: StreetcodeCreate = {
            id: parseId,
            index: form.getFieldValue('streetcodeNumber'),
            title: form.getFieldValue('title'),
            alias: form.getFieldValue('alias'),
            transliterationUrl: form.getFieldValue('streetcodeUrlName'),
            arBlockURL: form.getFieldValue('arlink'),
            streetcodeType,
            eventStartOrPersonBirthDate: form.getFieldValue('streetcodeFirstDate')
                ? form.getFieldValue('streetcodeFirstDate').toDate() : (parseId ? firstDate : null),
            eventEndOrPersonDeathDate: form.getFieldValue('streetcodeSecondDate')
                ? form.getFieldValue('streetcodeSecondDate').toDate() : (parseId ? secondDate : null),
            imagesId: [
                newStreetcodeInfoStore.animationId,
                newStreetcodeInfoStore.blackAndWhiteId,
                newStreetcodeInfoStore.relatedFigureId,
            ].filter((idx) => idx !== null),
            audioId: newStreetcodeInfoStore.audioId,
            tags: selectedTags,
            relatedFigures: figures,
            text: (text.title && text.textContent) ? text : null,
            timelineItems: JSON.parse(JSON.stringify(timelineItemStore.getTimelineItemArray))
                .map((timelineItem: TimelineItem) => ({ ...timelineItem, id: 0 })),
            facts: JSON.parse(JSON.stringify(factsStore.getFactArray))
                .map((fact: Fact) => ({ ...fact, id: 0 })),
            coordinates: JSON.parse(JSON.stringify(streetcodeCoordinatesStore.getStreetcodeCoordinateArray))
                .map((coordinate: StreetcodeCoordinate) => ({ ...coordinate, id: 0 })),
            partners,
            teaser: form.getFieldValue('teaser'),
            viewCount: 0,
            createdAt: new Date().toISOString(),
            dateString: form.getFieldValue('dateString') ?? dateString,
            streetcodeArts,
            subtitles,
            firstName: null,
            lastName: null,
            videos,
            status: tempStatus,
            toponyms: newStreetcodeInfoStore.selectedToponyms,
            streetcodeCategoryContents:
                JSON.parse(JSON.stringify(sourceCreateUpdateStreetcode.streetcodeCategoryContents))
                    .map((streetcodeCategoryContent: StreetcodeCategoryContent) => (
                        { ...streetcodeCategoryContent, id: 0 }
                    )),
            statisticRecords: JSON.parse(JSON.stringify(statisticRecordStore.getStatisticRecordArray))
                .map((statisticRecord: StatisticRecord) => (
                    {
                        ...statisticRecord,
                        id: 0,
                        coordinateId: 0,
                        streetcodeCoordinate: {
                            ...statisticRecord.streetcodeCoordinate,
                            id: 0,
                        },
                    }
                )),
        };
        if (streetcodeType === StreetcodeType.Person) {
            streetcode.firstName = form.getFieldValue('name');
            streetcode.lastName = form.getFieldValue('surname');
        }
        if (parseId) {
            if (video) {
                video.url = inputInfo?.link ?? '';
            }
            const videosUpdate: Video[] = video ? [video] : [];

            const relatedFiguresUpdate: RelatedFigureUpdate[] = figures.map((figure) => ({
                observerId: parseId,
                targetId: figure.id,
                modelState: figure.modelState,
            }));

            const partnersUpdate: PartnerUpdate[] = partners.map((partner) => ({
                streetcodeId: parseId,
                partnerId: partner.id,
                modelState: partner.modelState,
            }));

            const streetcodeUpdate: StreetcodeUpdate = {
                id: parseId,
                index: form.getFieldValue('streetcodeNumber'),
                title: form.getFieldValue('title'),
                alias: form.getFieldValue('alias'),
                transliterationUrl: form.getFieldValue('streetcodeUrlName'),
                streetcodeType,
                eventStartOrPersonBirthDate: form.getFieldValue('streetcodeFirstDate')
                    ? form.getFieldValue('streetcodeFirstDate').toDate() : (parseId ? firstDate : null),
                eventEndOrPersonDeathDate: form.getFieldValue('streetcodeSecondDate')
                    ? form.getFieldValue('streetcodeSecondDate').toDate() : (parseId ? secondDate : null),
                teaser: form.getFieldValue('teaser'),
                dateString: form.getFieldValue('dateString') ?? dateString,
                videos: videosUpdate,
                relatedFigures: relatedFiguresUpdate,
                timelineItems: timelineItemStore.getTimelineItemArrayToUpdate,
                facts: factsStore.getFactArrayToUpdate,
                partners: partnersUpdate,
                subtitles: subTitle?.subtitleText ? [subTitle as Subtitle] : [],
                text: (inputInfo?.title && inputInfo?.textContent) ? inputInfo as Text : null,
                streetcodeCategoryContents: sourceCreateUpdateStreetcode.getCategoryContentsArrayToUpdate,
                streetcodeArts: [...arts, ...streetcodeArtStore.getStreetcodeArtArrayToDelete],
                tags: [...(selectedTags as StreetcodeTagUpdate[]).map((item) => ({ ...item, streetcodeId: parseId })),
                    ...tagsStore.getTagToDeleteArray],
                statisticRecords: statisticRecordStore.getStatisticRecordArrayToUpdate,
                imagesId: [
                    newStreetcodeInfoStore.animationId,
                    newStreetcodeInfoStore.blackAndWhiteId,
                    newStreetcodeInfoStore.relatedFigureId,
                ].filter((idx) => idx !== null),
                audioId: newStreetcodeInfoStore.audioId,
            };

            console.log(streetcodeUpdate);
            StreetcodesApi.update(streetcodeUpdate).then((response) => {
                alert('Cтріткод успішно оновленний');
            })
                .catch((error2) => {
                    alert('Виникла помилка при оновленні стріткоду');
                });
        } else {
            console.log(streetcode);
            StreetcodesApi.create(streetcode)
                .then(() => {
                    if (tempStatus === 1) {
                        navigate(`../${form.getFieldValue('streetcodeUrlName')}`, { replace: true });
                    } else {
                        navigate(`${FRONTEND_ROUTES.ADMIN.BASE}/${form.getFieldValue('streetcodeUrlName')}`);
                    }
                })
                .catch((error) => {
                    alert('Виникла помилка при створенні стріткоду');
                });
        }
    };

    return (
        <div className="NewStreetcodeContainer">
            <PageBar />
            <ConfigProvider locale={ukUA}>
                <div className="adminContainer">
                    <div className="adminContainer-block">
                        <h2>Стріткод</h2>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <MainBlockAdmin
                                form={form}
                                selectedTags={selectedTags}
                                setSelectedTags={setSelectedTags}
                                streetcodeType={streetcodeType}
                                setStreetcodeType={setStreetcodeType}
                            />
                            <TextBlock
                                inputInfo={inputInfo}
                                setInputInfo={setInputInfo}
                                video={video}
                                setVideo={setVideo}
                            />
                            <InterestingFactsBlock id={parseId ?? -1} />
                            <TimelineBlockAdmin />
                            <MapBlockAdmin coordinates={coordinates} />
                            <ArtGalleryBlock arts={arts} setArts={setArts} />
                            <RelatedFiguresBlock figures={figures} setFigures={setFigures} />
                            <ForFansBlock />
                            <PartnerBlockAdmin partners={partners} setPartners={setPartners} />
                            <SubtitleBlock subTitle={subTitle} setSubTitle={setSubTitle} />
                            <ARBlock />
                        </Form>
                    </div>
                    <Button
                        className="streetcode-custom-button submit-button"
                        onClick={
                            onFinish
                        }
                        name={publish}
                    >
                        {publish}
                    </Button>
                    <Button
                        className="streetcode-custom-button submit-button"
                        onClick={
                            onFinish
                        }
                        name={draft}
                    >
                        {draft}
                    </Button>
                </div>
            </ConfigProvider>
        </div>
    );
};

export default NewStreetcode;
