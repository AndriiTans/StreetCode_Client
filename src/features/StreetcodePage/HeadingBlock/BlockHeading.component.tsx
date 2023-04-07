import './BlockHeading.styles.scss';

import Rhombus from '@images/utils/rhombus.svg';
import RhombusMobile from '@images/utils/rhombus_mobile.svg';

import { useMediaQuery } from 'react-responsive';

interface Props {
    headingText: string;
}

const BlockHeading = ({ headingText }: Props) => {
    const isMobile = useMediaQuery({
        query: '(max-width: 786px)',
    });

    return (
        <div className="blockHeadingWrapper">
            <div className="blockHeadingContainer">
                {!isMobile
                    && <Rhombus />}
                {isMobile
                    && <RhombusMobile />}
                <h1 className="blockHeadingText">
                    {headingText}
                </h1>
            </div>
        </div>
    );
};

export default BlockHeading;
