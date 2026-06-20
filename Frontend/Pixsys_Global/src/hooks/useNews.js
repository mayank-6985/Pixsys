import {useQuery} from "@tanstack/react-query"
import { fetchNews } from "../Services/NewsServices"

export const useNews = ()=>{
    return useQuery({
        queryKey:["news"],
        queryFn:fetchNews,
        staleTime:5*60*1000,
        gcTime:10*60*1000,
        retry:2,
        refetchOnWindowFocus:false,
    })
}