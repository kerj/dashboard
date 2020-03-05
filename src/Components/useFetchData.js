import { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import {OmoGraphData} from '../ApiHandlers/OmoGames'
// import {Timbers} from '../ApiHandlers/Timbers'
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
                const results = await axios.all([
                    // axios.get(Timbers.query),
                    axios.get(OmoGraphData.query),
                    axios.get(OmhofKiosks.query)
                ])
                
                // let cleanData = Timbers.dataHandler(results[0].data)
                let omhof = OmhofKiosks.dataHandler(results[1].data)
                const omoData = OmoGraphData.dataHandler(results[0].data)

                let weeklyData = { omoData };
                Object.assign(weeklyData, { omhof })
                // Object.assign(weeklyData, cleanData)
                weeklyData.retrievedOn = Date.now()
                setData(weeklyData)
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
