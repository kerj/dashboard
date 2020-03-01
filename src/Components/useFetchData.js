import { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import { getStravaRides } from '../ApiHandlers/Strava';
import { stravaAuth } from '../ApiHandlers/auth'
import {OmoGraphData} from '../ApiHandlers/OmoGames'
import {Timbers} from '../ApiHandlers/Timbers'
import {OmhofKiosks} from '../ApiHandlers/OmhofKiosks'

export default function useFetchData() {
    const [data, setData] = useState({retrievedOn: ''});
    const [isLoading, setIsLoading] = useState(false)

    // TODO: Use an argument passed into this hook to grab from a URL.  Just triggers updates for now.
    const [url, setUrl] = useState('')

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const fetchData = async () => {
            setIsLoading(true)
            
            try {
                // const results = await axios.all([
                //     axios.get(Timbers.query),
                //     axios.get(OmoGraphData.query),
                //     axios.get(OmhofKiosks.query)
                // ])
                
                // let cleanData = Timbers.dataHandler(results[0].data)
                // let omhof = OmhofKiosks.dataHandler(results[2].data)
                // const omoData = OmoGraphData.dataHandler(results[1].data)

                // let weeklyData = { omoData };
                // Object.assign(weeklyData, { omhof })
                // Object.assign(weeklyData, cleanData)
                // axios.get(getStravaRides.proxy + getStravaRides.query, getStravaRides.queryParams)
                const results = await axios.all([
                  axios.get(getStravaRides.proxy + getStravaRides.query, {
                    crossdomain: true,
                    method: 'get',
                    params: {
                        'before': '1564555884',
                        'after': '1438325484',
                        'page': '1',
                        'per_page': '100',
                    },
                    headers: {
                        'Authorization': 'Bearer ' + stravaAuth,
                        'accept': 'application/json'
                    },
                  })
                ])

                const strava = getStravaRides.dataHandler(results)

                console.log(strava)
                strava.retrievedOn = Date.now()
                setData({strava})
                setIsLoading(false)
            } catch (error) {
                if (axios.isCancel(error)) {
                    throw new Error("Cancelled Request")
                } else {
                    throw error;
                }
            }
        };

        fetchData();
        return () => {
            source.cancel();
        };
    }, [url])

    const fetchData = useCallback(() => {
        // Just trigger a value change so that fetching happens again.
        setUrl(Math.random())
    }, [setUrl])
    return [{ data, isLoading }, fetchData];
}
