import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mount, render, shallow } from 'enzyme';

import RouteManager from '../Components/RouteManager';

configure({ adapter: new Adapter() });

const testState = {
    loaded: false,
    data: {},
    omo: {
        routes: [
            'OHS-CHUTES GAME',
            'OHS-FLECTCHER GAME',
            'OHS-VORTEX GAME',
            'OHS-MARIE GAME',
            //         // 'stackedBarDorian',
            'OHS-CHUTES STORY',
            'OHS-FLECTCHER STORY',
            'OHS-VORTEX STORY',
            'OHS-MARIE STORY',
            'OHS-MOST READ TODAY',
            'OHS-WEEKLY STORIES READ'
        ]
    },
    omhof: {
        routes: [
            'OMHOF TOP AWARDS',
            'OMHOF AWARD OF THE DAY',
        ]
    },
    timbers: {
        routes: [
            'TIMBERS WEEKLY TOP EMOJIS',
            'NEW VS. RETURNING VISITORS',
            'MOST POPULAR EMOJI TODAY',
            'MOBILE OPERATING SYSTEMS'
        ]
    },
}




it('RouteManager renders without crashing', () => {
    const componenet = shallow(<RouteManager stateHelper={testState} />);
    expect(componenet).toMatchSnapshot();
});




