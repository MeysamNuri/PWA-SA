export interface IPersonality {
    id: string;
    name: string;
    picture: string;
    summery: string;
    description: string;
}

export interface IPersonalityResponse {
    RequestUrl: string;
    Data: IPersonality[];
    Message: string | null;
    Status: boolean;
    HttpStatusCode: number;
}

export interface IUserPersonalityPayload {
    userType: string;
}

export interface IUserPersonalityResponse {
    personalityId: string;
}

export interface IGetPersonalityResponse {
    id: string;
    name: string;
    picture: string;
    summery: string;
    description: string;
}

 export enum JobTitle {
    MarketBoy = "MarketBoy",
    PoliticalCalculator = "PoliticalCalculator",
    MasterMind = "MasterMind",
    MarketNovator = "MarketNovator",
    MarketSavvy = "MarketSavvy",
  }
  export const JOB_TYPE_MAP: Array<{ keyword: string; type: JobTitle }> = [
    { keyword: 'حساب‌گر سیاسی', type: JobTitle.PoliticalCalculator },
    { keyword: 'مغز متفکر', type: JobTitle.MasterMind },
    { keyword: 'زرنگ بازار', type: JobTitle.MarketNovator },
    { keyword: 'مبتکر بازاری', type: JobTitle.MarketSavvy },
    { keyword: 'پسر بازاری', type: JobTitle.MarketBoy }, 
  ];
  