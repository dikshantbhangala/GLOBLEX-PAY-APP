import { CURRENCIES } from "./constant";

export const formatCurrency = (amount , currency = 'USD' ) => {
    const currencyObj = CURRENCIES.find(c => c.code === currency);
    const symbol = currencyObj?.symbol || '$';

    return `${symbol}${parseFloat(amount).toLocaleString('en-US' , {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US' , {
        year: 'numeric',
        month : 'short',
        day: 'numeric',
    });
};

export const formattime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getTransactionsIcon = (type) => {
    const icons  = {
           send: '↗️',
    receive: '↙️',
    exchange: '🔄',
    deposit: '⬇️',
    withdraw: '⬆️',
    };
    return icons[type] || '💳';
};


export const getStatusColor = (status) => {
    const colors = {
        pending: '#FF9800',
    completed: '#4CAF50',
    failed: '#F44336',
    cancelled: '#808080',
    };
    return colors[status] || '#808080';
};

export const truncateAddress = (address , start =6 , end =4) => {
    if(!address) return '';
    if(address.length <= start + end) return address;
    return `${address.slice(0 , start)}...${address.slice(-end)}`;
};