export const APP_NAME = 'GLOBLEX';
export const API_TIMEOUT = 30000;

export const CURRENCIES =[
    {code : 'USD' , name: 'US DOLLAR' , Symbol: '$'},
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
        

];

export const TRANSACTION_TYPES  = {
    SEND : 'send',
    RECEIVE :'recieve',
    EXCHANGE : 'exchange',
    DEPOSIT : 'deposit',
    WITHDRAW : 'withdraw',
}

export const TRANSACTION_STATUS = {
    PENDING :'pending',
    COMPLETED: 'completed',
    FAILED : 'failed',
    CANCELLED : 'cancelled',
};

export const KYC_STATUS = {
    NOT_STARTED : 'not_started',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',

};