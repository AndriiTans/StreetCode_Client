import { makeAutoObservable } from 'mobx';
import StreetcodeArtApi from '@api/media/streetcode-art.api';
import StreetcodeArtSlide, { StreetcodeArtSlideCreateUpdate } from '@models/media/streetcode-art-slide.model';

import StreetcodeArt, { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';

export default class StreetcodeArtStore {
    public streetcodeArtSlides: StreetcodeArtSlide[] = new Array<StreetcodeArtSlide>();

    private startFromSlide = 1;

    private readonly amountOfSlides = 100;

    public constructor() {
        makeAutoObservable(this);
    }

    get getStreetcodeArtArray(): StreetcodeArt[] {
        const artsFromSlides: StreetcodeArtCreateUpdate[] = [];

        this.streetcodeArtSlides.forEach((slide) => {
            slide.streetcodeArts.forEach((art) => {
                if (!artsFromSlides.some((existingArt) => existingArt.art.id === art.art.id)) {
                    artsFromSlides.push(art);
                }
            });
        });

        return artsFromSlides;
    }

    get getStreetcodeArtsToDelete() {
        // return (this.streetcodeArtSlides as StreetcodeArtSlideCreateUpdate[])
        //     .filter((art) => art.modelState === ModelState.Deleted);
        return [];
    }

    public fetchNextArtSlidesByStreetcodeId = async (streetcodeId: number) => {
        const arrayOfArtSlides = await StreetcodeArtApi
            .getArtSlidesByStreetcodeId(streetcodeId, this.startFromSlide, this.amountOfSlides);
        console.log('slides: ', arrayOfArtSlides);
        if (arrayOfArtSlides.length !== 0) {
            if (this.streetcodeArtSlides.length === 0) {
                this.streetcodeArtSlides.push(...arrayOfArtSlides);
                this.startFromSlide += 1;
            }
        } else {
            throw new Error('No more arts to load');
        }
    };
}
