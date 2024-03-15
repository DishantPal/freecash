import { FastifyRequest } from "fastify";
import { getNetworkData } from "../surveys.model";
import axios from "axios";
export interface TransformedSurveyData {
    id: string;
    network: string;
    campaign_id: string;
    title: string;
    length_loi: number;
    payout: number;
    score: number;
    rating: number;
    rating_count: number;
    type: string;
    link: string;
    category_name: string;
    category_icon: string;
    category_icon_name: string;
}

export const getBitlabsData = async(request:FastifyRequest,userId:number,extraParams:any)=>{
    const data = getBitlabsNetworkData(request,userId);
    return data;
}

const getNetworkConfig = async(network:string)=>{
    const result = await getNetworkData(network);
    if(!result){
        throw new Error(`${network} not found`);
    }
    return result;
}

const getHeaders = async(request :FastifyRequest,user_id:number)=>{
    const {country} = request.query as {country:string};
    const headers = {
        'ip':request.ip ,
        'ua':request.headers['user-agent'],
        'user_id':user_id,
        'country': country,
    }
    return headers;
}
export const getBitlabsNetworkData = async (request: FastifyRequest, userId: number) => {
    const {provider} = request.query as {provider:string};
    const networkConfig = await getNetworkConfig(provider);

    const headers = await getHeaders(request, userId);

    // Prepare URL and headers for the Bitlabs API request
    const apiUrl = 'https://api.bitlabs.ai/v2/client/surveys';
    const apiHeaders = {
        'X-Api-Token': networkConfig.api_key,
        'X-User-Id': headers.user_id.toString(), // Ensure the user_id is sent as a string
    };

    // Prepare query parameters
    const params = {
        client_country: headers.country,
        client_ip: headers.ip,
        client_useragent: headers.ua,
    };

    try {
        // Make the HTTP request to the Bitlabs API
        const response = await axios.get(apiUrl, { headers: apiHeaders, params:params });
        if (response.status !== 200) {
            throw new Error('Bitlabs Survey API Exception.');
        }
        const transformedData = transformBitlabsData(response.data);
        return transformedData;
    } catch (error) {
        console.error('Failed to call Bitlabs API:', error);
        throw new Error('Failed to fetch surveys from Bitlabs');
    }
};
const transformBitlabsData = (apiData: any): TransformedSurveyData[] => {
    const surveys = apiData.data.surveys;
    return surveys.map((survey: any) => ({
        id: survey.id,
        network: 'bitlabs',
        campaign_id: survey.id,
        title: survey.name || 'Survey',
        length_loi: survey.loi,
        payout: parseFloat(survey.value),
        score: survey.score ?? 0,
        rating: survey.rating,
        rating_count: survey.statistics_rating_count ?? 0,
        type: survey.type,
        link: survey.click_url,
        category_name: survey.category?.name,
        category_icon: survey.category?.icon_url,
        category_icon_name: survey.category?.icon_name,
    }));
};
