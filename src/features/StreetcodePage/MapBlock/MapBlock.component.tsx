import './MapBlock.styles.scss';

import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import 'leaflet/dist/leaflet.css';

import MapOSM from './Map/Map.component';
import StaticticsComponent from './Statistics/Statistics.component'
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import ToponymsApi from '@/app/api/map/toponyms.api';
import StreetcodeCoordinatesApi from '@/app/api/additional-content/streetcode-cooridnates.api';
import Toponym from '@/models/toponyms/toponym.model';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import CheckBoxComponent from '@/features/StreetcodePage/MapBlock/CheckBox/CheckBox.component';
import InfoComponent from './Statistics/Info.component';

const MapBlock = () => {
    const id = useRouteId();
    const toponyms = useAsync(() => ToponymsApi
        .getAll(), []).value as Toponym[];
    const streetcodeCoordinates = useAsync(() => StreetcodeCoordinatesApi
        .getByStreetcodeId(id), [id]).value as StreetcodeCoordinate[];

    return(
        <div className="mapBlockContainer">      
            <BlockHeading headingText="Мапа історії" />
            <CheckBoxComponent />
            <MapOSM streetcodeCoordinates={streetcodeCoordinates} toponyms={toponyms}/>
        </div>
    );
}
export default MapBlock;
