import { API_ROUTES } from 'app/common/contants/api-routes.constants';
import Subtitle from 'models/additional-content/subtitles.model';

import Agent from './agent.api';

const SubtitlesApi = {
    getById: (id: number) => Agent.get<Subtitle>(`${API_ROUTES.SUBTITLES.GET}/${id}`),

    getAll: () => Agent.get<Subtitle[]>(`${API_ROUTES.SUBTITLES.GET_ALL}`),

    getByStreetcodeId: (streetcodeId: number) => Agent.get<Subtitle>(`${API_ROUTES.SUBTITLES.GET_BY_STREETCODE_ID}/${streetcodeId}`),

    create: (subtitle: Subtitle) => Agent.post<Subtitle>(`${API_ROUTES.SUBTITLES.CREATE}`, subtitle),

    update: (subtitle: Subtitle) => Agent.put<Subtitle>(`${API_ROUTES.SUBTITLES.UPDATE}`, subtitle),

    delete: (id: number) => Agent.delete(`${API_ROUTES.SUBTITLES.DELETE}/${id}`),
};

export default SubtitlesApi;
