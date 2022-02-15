
export interface blockchainStateIF {
    loading: boolean;
    account: string | null;
    LostBoyTest: any | null;
    LostStaking: any | null;
    LostToken:any | null;
    Lostgirl: any | null;
    web3: any | null;
    errorMsg: string | '';
}

const blockchainState : blockchainStateIF = {
    loading: false,
    account: null,
    LostBoyTest: null,
    LostStaking:null,
    LostToken: null,
    Lostgirl: null,
    web3: null,
    errorMsg: "" 
};
  
const blockchainReducer = (state = blockchainState, action:any) => {
    switch(action.type){
        case "CONNECTION_REQUEST":
            return {
                ...blockchainState,
                loading: true,
            };
        case "CONTRACT_SUCCESS":
            return {
                ...state,
                loading: false,
                LostBoyTest: action.payload.LostBoyTest,
                LostStaking: action.payload.LostStaking,
                LostToken: action.payload.LostToken,
                Lostgirl: action.payload.Lostgirl
            };
        case "CONNECTION_SUCCESS":
            return {
                ...state,
                loading: false,
                account: action.payload.account,
                web3: action.payload.web3,
            };
        case "CONNECTION_FAILED":
            return {
                ...blockchainState,
                loading: false,
                errorMsg: action.payload,
            };
        case "UPDATE_ACCOUNT":
            return {
                ...state,
                account: action.payload.account,
            };
        default:
            return state;
    }
};

export default blockchainReducer;