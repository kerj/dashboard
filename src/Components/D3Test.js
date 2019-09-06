import React, { Component } from 'react';
import RouteManager from './RouteManager';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';
const axios = require('axios');



class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentRoute: 0,
            dataKey: 0,
            data: [],
            loaded: false,
            chartData: [],
            omoGames: {
                routes: [
                    'stackedBarChutes',
                    'stackedBarFletcher',
                    'stackedBarVortex',
                    'stackedBarMarie',
                    // 'stackedBarDorian',
                ]
            },
            omoStories: {
                routes: [
                    'listMostCompleted',
                    'listMostStarted'
                ]
            },
            // omhof: {
            //     routes: [
            //         'listWeekAwards',
            //         'awardOfTheDay',
            //     ]
            // },
            // timbers: {
            //     routes: [
            //         'listWeekTopEmojis',
            //         'stackedBarNewVReturn',
            //         'mostPopularEmoji',
            //         'mobileIosVsAndroid'
            //     ]
            // }
        }
    }

    updateRoute = () => {
        setRoute(props.stateHelper[`${dataToCycle[this.props.dataKey]}`].routes[this.props.currentRoute]);

        this.props.currentRoute + 1 > routesAvailable.length - 1 || !routesAvailable.length === 2 ?
            this.props.dataKey + 1 > dataToCycle.length - 1 ?
                this.setState({
                    currentRoute: 0,
                    dataKey: 0
                }) :
                this.setState({
                    currentRoute: 0,
                    dataKey: this.state.dataKey + 1
                }) :
            this.setState({
                currentRoute: this.state.currentRoute + 1,
            })
    }



    setPropsToPass = (route) => {
        // console.log(currentKey, route); this is the log to troubleshoot if needed
        let propsToPass = []
        //route = key : currentKey = value ....ie, 'stackedBar' : 'weeklyWeather'
        const ROUTES = {
            stackedBarChutes: <BarChart dataToGraph={this.state.chartData} title={route} />,
            stackedBarFletcher: <BarChart dataToGraph={this.state.chartData} title={route} />,
            stackedBarVortex: <BarChart dataToGraph={this.state.chartData} title={route} />,
            stackedBarMarie: <BarChart dataToGraph={this.state.chartData} title={route} />,
            // donutGraph: <DonutGraph dataToGraph={propsToPass} />,
            // singleBar: <BarChart dataToGraph={propsToPass} />,
            // listMostCompleted: <EmojiList dataToGraph={propsToPass} title={route}/>,
            // listMostStarted: <EmojiList dataToGraph={propsToPass} title={route} />
        }


        // let weeklyData = Object.values(this.state.chartData);
        // if (currentKey === 'omoGames') {
        let dataSet = this.state.data;
        console.log(dataSet);
        console.log(route);


        let gameProps = dataSet.chutes.finishedGames
        console.log(gameProps);



        // console.log(gameProps, storyProps); 
        //if json response has different key names you will not have to slice the response here
        //will likely destructure the first data response also...
        gameProps.map((d) => {
            let propToPass = {};
            let { finished: dataSet0, started: dataSet1 = 0, day: labels } = d
            propToPass.dataSet0 = `${dataSet0}`
            propToPass.dataSet1 = `${dataSet1}`
            propToPass.labels = `${labels}`
            propsToPass.push(propToPass);
        })
        this.setState({
            chartData: propsToPass
        })
        // } else if (currentKey === 'omoStories') {
        //     let storyProps = weeklyData[dataRoute.routeIterator].stories;
        //     storyProps.map((d) => {
        //         let propToPass = {};
        //         let { finished: dataSet0, started: dataSet1 = 0, day: labels } = d
        //         propToPass.dataSet0 = `${dataSet0}`
        //         propToPass.dataSet1 = `${dataSet1}`
        //         propToPass.labels = `${labels}`
        //         propsToPass.push(propToPass);
        //     })
        // }

        //setState for the d3componet here
        // console.log(currentKey, route);

        return (
            <div>
                {ROUTES[route]}
            </div>
        )
    }




    fetchWeatherData = () => {
        let omoQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omo';
        axios.get(omoQuery).then((response) => {

            const omo = response.data; // {{[0],[1],[day]},{[0],[1],[day]},{[0],[1],[day]}} = [{[0],[1],[day]}...]
            //     ohsKeys = Object.keys(ohs); // array of key names

            // ohsKeys.map((o,i,a) => {
            //     o[i]['']
            // })

            // console.log(gamesOhs)
            // console.log(ohs);

            this.setState({
                // data: ohsGames.concat(ohsStories)
                data: omo
            });
            this.setState({ loaded: true })
            console.log(this.state.data);

            // let omhofQuery = ;
            // axios.get(omhofQuery).then((response) => {
            //     console.log(response);
            //     const omhof = response.data;
            //     if (omhof )
            //     const weekly = (omhof['kiosks-7day'].length = 100);
            //     const daily = (omhof['kiosks-today'].length = 100);


            //  
            //    console.log(omhof);

            //     this.setState({
            //         data: this.state.data.concat(omhof),
            //     });

            // })  

        })

    }

    // fetchFarWeatherData = () => {
    //     let weatherQuery = "https://www.metaweather.com/api/location/44418/";
    //     axios.get(weatherQuery).then((response) => {
    //         const weatherResponse = response.data.consolidated_weather;

    //         this.setState({
    //             data: this.state.data.concat(weatherResponse),
    //         });
    //         console.log(this.state.data);
    //     })

    // }

    componentDidMount() {
        this.fetchWeatherData()
        // this.fetchFarWeatherData()
    }

    render() {
        return (
            <div>
                {
                    this.state.loaded ? this.setPropsToPass() : <h1>Loading Graph</h1>
                }
            </div >
        )
    }
}

export default D3Test;