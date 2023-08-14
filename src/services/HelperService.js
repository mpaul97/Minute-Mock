import QueueObj from '../classes/QueueObject';

class Helper {
    constructor() {}
    sum(arr) {
        return arr.reduce((a, b) => a + b, 0);
    }
    buildQueueArray(leagueSize, playersSize) {
        let arr = [];
        arr.push(new QueueObj(1, 'Round 1'));
        for (var i = 0; i < playersSize; i++) {
            if (i % 2 === 0) {
                for (var j = 1; j < leagueSize + 1; j++) {
                    arr.push(new QueueObj(i + 1, j));
                }
            } else {
                for (var j = leagueSize; j > 0; j--) {
                    arr.push(new QueueObj(i + 1, j));
                }
            }
            if (i !== playersSize - 1) {
                arr.push(new QueueObj(i + 2, 'Round ' + (i + 2)));
            }
        }
        return arr;
    }
};

export default Helper;