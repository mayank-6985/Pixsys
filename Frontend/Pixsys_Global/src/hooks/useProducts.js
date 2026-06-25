import { useQuery } from "@tanstack/react-query";
import { fetchProuctsForHeader } from "../Services/ProductsServices";

export const useProducts = ()=>{
    return useQuery({
        queryKey:["products"],
        queryFn:fetchProuctsForHeader,
        staleTime:5*60*1000,
        gcTime:10*60*1000,
        retry:2,
        refetchOnWindowFocus:false
    })
}