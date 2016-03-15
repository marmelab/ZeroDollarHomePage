const messagesForCodes = {
    0: 'Ok', // Ok,
    1: 'Request not found', // RequestNotFound,
    2: 'Empty queue', // EmptyQueue
};

export default (code) => messagesForCodes[code];
