/* eslint-disable complexity */
import './HeaderBlock.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import MagnifyingGlassMobile from '@images/header/Magnifying_glass_mobile.svg';
import StreetcodeSvg from '@images/header/Streetcode_logo.svg';
import StreetcodeSvgMobile from '@images/header/Streetcode_logo_mobile.svg';

import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import useEventListener from '@hooks/external/useEventListener.hook';
import useOnClickOutside from '@hooks/stateful/useClickOutside.hook';
import useToggle from '@hooks/stateful/useToggle.hook';
import HeaderDrawer from '@layout/header/HeaderDrawer/HeaderDrawer.component';
import HeaderSkeleton from '@layout/header/HeaderSkeleton/HeaderSkeleton.component';
import useMobx, { useModalContext } from '@stores/root-store';

import { Button, Popover } from 'antd';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import { joinToStreetcodeClickEvent } from '@/app/common/utils/googleAnalytics.unility';

import SearchBlock from './SearchBlock/SearchBlock.component';

const HeaderBlock = () => {
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);
    const { toggleState: isInputActive, handlers: { off, toggle } } = useToggle();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const { modalStore: { setModal, setIsPageDimmed, isPageDimmed } } = useModalContext();

    const windowSize = useWindowSize();

    const handlePopoverVisibleChange = (visible: boolean) => {
        setIsPopoverVisible(visible);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchQuery(value);
        if (value.length > 0) {
            handlePopoverVisibleChange(true);
        } else {
            handlePopoverVisibleChange(false);
        }
    };

    const onDimCancel = useCallback((e?: Event) => {
        e?.stopPropagation();

        off();
        setIsPageDimmed(false);
    }, [setIsPageDimmed, off]);

    useEventListener('scroll', () => {
        setIsHeaderHidden(window.scrollY > 100);
    });

    useEffect(onDimCancel, [isHeaderHidden, onDimCancel]);
    useOnClickOutside(inputRef, onDimCancel);

    if (isInputActive && !isPageDimmed) {
        setIsPageDimmed(true);
    }

    const onMagnifyingGlassClick = () => {
        setIsPageDimmed();
        toggle();
    };

    return (
        <div className="HeaderBlock">
            <div className={`navBarContainer ${isHeaderHidden ? 'hiddenNavBar' : ''} ${isPageDimmed ? 'dim' : ''}`}>
                <div className="leftPartContainer">
                    <div className='logoContainer' onClick={() => window.location.href = '/'}> 
                        { windowSize.width > 1024
                            ? <StreetcodeSvg />
                            : <StreetcodeSvgMobile /> }
                    </div>
                    <Popover
                        trigger="click"
                        placement="bottomLeft"
                        open={isPopoverVisible}
                        content={(
                            <div className="headerPopupSkeleton">
                                <SearchBlock searchQuery={searchQuery} />
                            </div>
                        )}
                    />
                            <input
                            onChange={handleInputChange}
                            placeholder="Пошук..."
                            ref={inputRef}
                            className={`ant-input  
                                hiddenHeaderInput ${((isInputActive && isHeaderHidden && windowSize.width > 1024) ? 'active' : '')}`}
                        />
                    <HeaderSkeleton />
                </div>
                <div className="rightPartContainer">
                    <div className="rightSectionContainer">
                        {isHeaderHidden && windowSize.width > 1024 && (
                            <MagnifyingGlass
                                viewBox="0 -2 24 24"
                                transform="scale(1.2)"
                                onClick={onMagnifyingGlassClick}
                                style={isPageDimmed ? { zIndex: '-1' } : undefined}
                            />
                        )}
                        {windowSize.width <= 1024 && (
                            <MagnifyingGlassMobile
                                viewBox="0 -1 25 25"
                                onClick={onMagnifyingGlassClick}
                                style={isPageDimmed ? { zIndex: '-1' } : undefined}
                            />
                        )}
                        <HeaderDrawer />
                        <Button
                            type="primary"
                            className="loginBtn"
                            onClick={() => {
                                setModal('login');
                                joinToStreetcodeClickEvent();
                            }}
                            style={isPageDimmed ? { zIndex: '-1' } : undefined}
                        >
                            Долучитися
                        </Button>
                    </div>
                </div>
            </div>
            {windowSize.width <= 1024 && (
                <div className={`searchContainerMobile ${(isInputActive ? 'active' : '')}`}>
                    <input
                        className="ant-input css-dev-only-do-not-override-26rdvq"
                        placeholder="Що ти шукаєш?"
                        ref={inputRef}
                    />
                    <Button type="primary" className="searchButton">
                        Пошук
                    </Button>
                </div>
            )}
        </div>
    );
};

export default observer(HeaderBlock);
