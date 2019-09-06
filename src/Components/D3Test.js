import React, { Component } from 'react';
import RouteManager from './RouteManager';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';
const axios = require('axios');



class D3Test extends Component {

    constructor(props) {
        super(props)
        this.lastUpdateDate = new Date();
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
        let dataToCycle = Object.keys(this.state).slice(5)
        
        let dataSetName = dataToCycle[this.state.dataKey]

        let routesAvailable = this.state[`${dataSetName}`].routes
        // setRoute(props.stateHelper[`${dataToCycle[this.props.dataKey]}`].routes[this.props.currentRoute]);
     
        
        this.state.currentRoute + 1 > routesAvailable.length - 1 || !routesAvailable.length === 2 ?
            this.state.dataKey + 1 > dataToCycle.length - 1 ? 
            this.setState({ currentRoute: 0, dataKey: 0 }) : this.setState({ currentRoute: 0, dataKey: this.state.dataKey + 1})
        : this.setState({ currentRoute: this.state.currentRoute + 1, dataKey: this.state.dataKey})

    }



    setPropsToPass = () => {
        let dataToCycle = Object.keys(this.state).slice(5)
        let dataSet = this.state.data,
            dataSetKeys = Object.keys(dataSet);
        
        let propsToPass = []
        let dataSetName = dataToCycle[this.state.dataKey]
        const ROUTES = {
            stackedBarChutes: <BarChart dataToGraph={propsToPass} title={dataSetName + " " + dataSetKeys[this.state.currentRoute]} />,
            stackedBarFletcher: <BarChart dataToGraph={propsToPass} title={dataSetName + " " + dataSetKeys[this.state.currentRoute]} />,
            stackedBarVortex: <BarChart dataToGraph={propsToPass} title={dataSetName + " " + dataSetKeys[this.state.currentRoute]} />,
            stackedBarMarie: <BarChart dataToGraph={propsToPass} title={dataSetName + " " + dataSetKeys[this.state.currentRoute]} />,
            // donutGraph: <DonutGraph dataToGraph={propsToPass} />,
            // singleBar: <BarChart dataToGraph={propsToPass} />,
            // listMostCompleted: <EmojiList dataToGraph={propsToPass} title={dataSetName + " " + dataSetKeys[this.state.currentRoute]}/>,
            // listMostStarted: <EmojiList dataToGraph={propsToPass} title={dataSetName + " " + dataSetKeys[this.state.currentRoute]} />
        }


        // let weeklyData = Object.values(this.state.chartData);
        // if (currentKey === 'omoGames') {
            
        if (dataSetName === 'omoGames'){
            dataSet[dataSetKeys[this.state.currentRoute]].finishedGames.map((d) => {
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
            console.log(dataSetName, this.state.chartData );
            
        }
        // console.log(gameProps, storyProps); 
        //if json response has different key names you will not have to slice the response here
        //will likely destructure the first data response also...
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
        console.log(this.state[`${dataToCycle[this.state.dataKey]}`].routes[this.state.currentRoute]);
        
        return (
            <div key={this.state.currentRoute}>
                {ROUTES[this.state[`${dataToCycle[this.state.dataKey]}`].routes[this.state.currentRoute]]}
            </div>
        )
    }




    fetchWeatherData = () => {
        console.log("fetch");
        
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
            setInterval(() => {
                this.updateRoute()
            }, 6000);

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
        this.state.loaded ? console.log("remount") : this.fetchWeatherData()
        // this.fetchFarWeatherData()
    }

    shouldComponentUpdate() {
        if(this.state.chartData.length === 0) {
            return true
        }else {
            const now = new Date();
            let seconds = (now.getTime() - this.lastUpdateDate.getTime()) / 1000;
            return seconds >= 5;
        }
    }

    componentDidUpdate() {
        this.lastUpdateDate = new Date(); 
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