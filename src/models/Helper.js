import QueueObj from './QueueObject';

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
    round(value) {
        return Math.round(value * 100) / 100;
    };
    convertTime(time) {
        var secNum = parseInt(time.toString(), 10);
        var hours = Math.floor(secNum / 3600);
        var minutes = Math.floor((secNum - (hours * 3600)) / 60);
        var seconds = secNum - (hours * 3600) - (minutes * 60);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    };
    randomFloatInRange(min, max) {
        const str = (Math.random() * (max - min) + min);
        return parseFloat(str);
    };
    choice(events, size, probability) {
        if (probability != null) {
            const pSum = probability.reduce((a, b) => a + b);
            if (pSum < 1 - Number.EPSILON || pSum > 1 + Number.EPSILON) {
                throw Error("Overall probability has to be 1.");
            }
            if (probability.find((p) => p < 0) != undefined) {
                throw Error("Probability cannot contain negative values.");
            }
            if (events.length != probability.length) {
                throw Error("Events and probability must be same length.");
            }
        } else {
            probability = new Array(events.length).fill(1 / events.length);
        }
    
        var probabilityRanges = probability.reduce((ranges, v, i) => {
            var start = i > 0 ? ranges[i-1][1] : 0 - Number.EPSILON;
            ranges.push([start, v + start + Number.EPSILON]);
            return ranges;
        }, []);
      
        var choices = new Array();
        for(var i = 0; i < size; i++) {
            var random = Math.random();
            var rangeIndex = probabilityRanges.findIndex((v, i) => random > v[0] && random <= v[1]);
            choices.push(events[rangeIndex]);
        };
        return choices;
    };
    count(arr, target) {
        return arr.reduce((count, currentValue) => count + (currentValue === target), 0);
    }
};

export default Helper;