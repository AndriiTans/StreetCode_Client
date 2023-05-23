/* eslint-disable import/extensions */
import { createContext, useContext } from 'react';
import AudioStore from '@stores/audio-store';
import CheckBoxStore from '@stores/checkbox-store';
import FactsStore from '@stores/facts-store';
import HistoricalContextStore from '@stores/historicalcontext-store';
import ImageStore from '@stores/image-store';
import ModalStore from '@stores/modal-store';
import PartnersStore from '@stores/partners-store';
import RelatedFiguresStore from '@stores/related-figures-store';
import RelatedTermsStore from '@stores/related-terms-store';
import SourcesAdminStore from '@stores/sourceadmin-store';
import SourcesStore from '@stores/sources-store';
import StreetcodeArtStore from '@stores/streetcode-art-store';
import StreetcodeStore from '@stores/streetcode-current-store';
import StreetcodesCatalogStore from '@stores/streetcodes-catalog-store';
import StreetcodeShortStore from '@stores/streetcodeshort-store';
import SubtitlesStore from '@stores/subtitles-store';
import TagsStore from '@stores/tags-store';
import TermStore from '@stores/term-store';
import TimelineStore from '@stores/timeline-store';

import ImageLoaderStore from './image-loader-store';
import NewStreetcodeInfoStore from './newstreetcode-info-store';
import PositionsStore from './position-store';
import SourceCreateUpdateStreetcode from './source-category-store-create';
import StatisticRecordStore from './statistic-record-store';
import StreetcodeCoordinatesStore from './streetcode-coordinates-store';
import TeamStore from './team-store';
import UserLoginStore from './user-login-store';

interface Store {
    modalStore: ModalStore,
    factsStore: FactsStore,
    subtitlesStore: SubtitlesStore,
    tagsStore: TagsStore,
    audiosStore: AudioStore,
    imagesStore: ImageStore,
    partnersStore: PartnersStore,
    teamStore: TeamStore,
    termsStore: TermStore,
    timelineItemStore: TimelineStore,
    sourcesStore: SourcesStore,
    sourcesAdminStore: SourcesAdminStore
    streetcodeArtStore: StreetcodeArtStore,
    // streetcodeStore: StreetcodeStore,
    relatedFiguresStore: RelatedFiguresStore,
    checkboxStore: CheckBoxStore,
    relatedTermStore: RelatedTermsStore,
    historicalContextStore: HistoricalContextStore,
    streetcodeCatalogStore: StreetcodesCatalogStore,
    streetcodeShortStore: StreetcodeShortStore,
    newStreetcodeInfoStore: NewStreetcodeInfoStore,
    streetcodeCoordinatesStore: StreetcodeCoordinatesStore,
    sourceCreateUpdateStreetcode: SourceCreateUpdateStreetcode,
    userLoginStore: UserLoginStore,
    positionsStore: PositionsStore,
    statisticRecordStore: StatisticRecordStore,
    imageLoaderStore: ImageLoaderStore,

}
export interface AdditionalDataStore {
    imageLoaderStore: ImageLoaderStore,
}

export interface StreetcodeDataStore {
    streetcodeStore: StreetcodeStore,
}
export interface ModalDataStore {
    modalStore: ModalStore,
}

export const store: Store = {
    modalStore: new ModalStore(),
    factsStore: new FactsStore(),
    subtitlesStore: new SubtitlesStore(),
    tagsStore: new TagsStore(),
    audiosStore: new AudioStore(),
    streetcodeArtStore: new StreetcodeArtStore(),
    imagesStore: new ImageStore(),
    partnersStore: new PartnersStore(),
    termsStore: new TermStore(),
    teamStore: new TeamStore(),
    timelineItemStore: new TimelineStore(),
    sourcesStore: new SourcesStore(),
    relatedFiguresStore: new RelatedFiguresStore(),
    checkboxStore: new CheckBoxStore(),
    relatedTermStore: new RelatedTermsStore(),
    // streetcodeStore: new StreetcodeStore(),
    historicalContextStore: new HistoricalContextStore(),
    streetcodeCatalogStore: new StreetcodesCatalogStore(),
    streetcodeShortStore: new StreetcodeShortStore(),
    newStreetcodeInfoStore: new NewStreetcodeInfoStore(),
    streetcodeCoordinatesStore: new StreetcodeCoordinatesStore(),
    sourceCreateUpdateStreetcode: new SourceCreateUpdateStreetcode(),
    userLoginStore: new UserLoginStore(),
    imageLoaderStore: new ImageLoaderStore(),
    positionsStore: new PositionsStore(),
    sourcesAdminStore: new SourcesAdminStore(),
    statisticRecordStore: new StatisticRecordStore(),
};
export const additionalDataStore:AdditionalDataStore = {
    imageLoaderStore: new ImageLoaderStore(),
};
export const streetcodeDataStore:StreetcodeDataStore = {
    streetcodeStore: new StreetcodeStore(),
};

export const modalDataStore:ModalDataStore = {
    modalStore: new ModalStore(),
};

const additionalDataContext = createContext(additionalDataStore);

export const useAdditionalContext = () => useContext(additionalDataContext);

export const useStreetcodeDataContext = () => useContext(createContext(streetcodeDataStore));

export const useModalContext = () => useContext(createContext(modalDataStore));

const StoreContext = createContext(store);

const useMobx = () => useContext(StoreContext);
export default useMobx;
