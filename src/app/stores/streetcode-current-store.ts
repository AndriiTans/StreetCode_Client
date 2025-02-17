import { makeAutoObservable } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import Streetcode from '@/models/streetcode/streetcode-types.model';

export default class StreetcodeStore {
    public errorStreetCodeId = -1;

    public currentStreetcode = this.errorStreetCodeId;

    public prevStreetcode = this.currentStreetcode;

    public itChangedId = false;

    public streetcodeUrl = '';

    constructor() {
        makeAutoObservable(this);
    }

    public itChangedIdChange = () => {
        this.itChangedId = false;
    };

    public trackChange = () => {
        if (this.prevStreetcode !== this.currentStreetcode) {
            this.prevStreetcode = this.currentStreetcode;
            this.itChangedId = true;
            return this.itChangedId;
        }
        return false;
    };

    public set setStreetCode(streetcode: Streetcode) {
        this.currentStreetcode = streetcode.id;
    }

    public setCurrentStreetcodeId = async (url: string): Promise<Streetcode | undefined> => {
        try {
            if (await StreetcodesApi.existWithUrl(url)) {
                const streetcode = await StreetcodesApi.getByUrl(url);
                if (streetcode !== null) {
                    this.setStreetCode = streetcode;
                    return streetcode;
                }
            }
        } catch (error) { }
    };

    public get getStreetCodeId() {
        return this.currentStreetcode;
    }
}