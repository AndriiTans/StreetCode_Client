import { action, computed, makeAutoObservable, observable } from 'mobx';
import NewsApi from '@api/news/news.api';
import News from '@models/news/news.model';
import dayjs from 'dayjs';

import { PaginationInfo } from '@/models/pagination/pagination.model';

export default class NewsStore {
    public NewsMap = new Map<number, News>();

    private errorNewsId = -1;

    private currentNewsId = this.errorNewsId;

    private defaultPageSize = 10;

    public CurrentPage = 1;

    private paginationInfo: PaginationInfo = {
        PageSize: this.defaultPageSize,
        TotalPages: 1,
        TotalItems: 1,
        CurrentPage: 0,
    };

    public constructor() {
        makeAutoObservable(this, {
            NewsMap: observable,
            CurrentPage: observable,
            getAll: action,
            createNews: action,
            deleteNews: action,
            setNewsMap: action,
            addNews: action,
            updateNews: action,
            setCurrentPage: action,
            NewsArray: computed,
        });
    }

    public setNewsMap(news: News[]) {
        // Offset in hours
        const localOffset = new Date().getTimezoneOffset() / 60;
        this.NewsMap.clear();
        news?.forEach(this.addNews);

        // as date is saved in UTC+0, add local offset to actualize date

        news?.forEach((n) => {
            // eslint-disable-next-line no-param-reassign
            n.creationDate = dayjs(n.creationDate).subtract(localOffset, 'hours');
        });
    }

    public setCurrentPage(currPage: number) {
        this.CurrentPage = currPage;
    }

    public set CurrentNewsId(id: number) {
        this.currentNewsId = id;
    }

    public get CurrentNewsId(): number {
        return this.currentNewsId;
    }

    public addNews = (news: News) => {
        this.NewsMap.set(news.id, news);
    };

    public get NewsArray() {
        console.log(this.NewsMap);
        return this.NewsMap.size > 0 ? Array.from(this.NewsMap.values()) : [];
    }

    public set PaginationInfo(paginationInfo: PaginationInfo) {
        this.paginationInfo = paginationInfo;
    }

    public get PaginationInfo(): PaginationInfo {
        return this.paginationInfo;
    }

    public getByUrl = async (url: string) => {
        await NewsApi.getByUrl(url)
            .then((news) => {
                this.CurrentNewsId = news.id;
            })
            .catch((error) => console.log(error));
    };

    public getAll = async (pageSize?: number) => {
        await NewsApi.getAll(this.CurrentPage, pageSize ?? 1)
            .then((resp) => {
                console.log('in useQuery');
                this.PaginationInfo = resp.paginationInfo;
                this.setNewsMap(resp.data);
            })
            .catch((error) => console.log(error));
    };

    public createNews = async (news: News) => {
        await NewsApi.create(news)
            .then(() => this.getAll(this.PaginationInfo.PageSize))
            .catch((error) => console.log(error));
    };

    public updateNews = async (news: News) => {
        await NewsApi.update(news)
            .then(() => this.getAll(this.PaginationInfo.PageSize))
            .catch((error) => console.log(error));
    };

    public deleteNews = async (newsId: number) => {
        await NewsApi.delete(newsId)
            .then(() => this.getAll(this.PaginationInfo.PageSize))
            .catch((error) => console.log(error));
    };
}
