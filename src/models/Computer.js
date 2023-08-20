import Helper from "./Helper";

const helper = new Helper();

class Computer {
    getPlayerRound1Top3(data) {
        var top3 = [...Array(3).keys()];
        var randomArr = helper.choice(top3, 3, [0.7, 0.2, 0.1]);
        var playerIndex = randomArr[0];
        var player = data[playerIndex];
        return player;
    };
    getPlayerRound1(data) {
        var top10 = [...Array(10).keys()];
        var randomArr = helper.choice(top10, 10, [0.3, 0.2, 0.115, 0.1, 0.085, 0.065, 0.055, 0.045, 0.025, 0.01]);
        var playerIndex = randomArr[0];
        var player = data[playerIndex];
        return player;
    };
    getMaxNeed(needs) {
        var max = 0;
        var need = needs[0];
        for (var i = 0; i < needs.length; i++) {
            if (needs[i].weight > max) {
                max = needs[i].weight;
                need = needs[i];
            }
        };
        return need;
    };
    getPlayerRest(needs, data) {
        var pos = this.getMaxNeed(needs).positionAbbr;
        var filtered = data.filter(x => x.position === pos);
        filtered = filtered.sort(x => x.positionRanking);
        var playerIndex = data.findIndex(x => x.name === filtered[0].name);
        return data[playerIndex];
    };
    getPlayer(needs, currDrafter, round, allPlayers) {
        let player = undefined;
        if (round === 1) {
            if (currDrafter <= 3) {
                player = this.getPlayerRound1Top3(allPlayers);
            } else {
                player = this.getPlayerRound1(allPlayers);
            }
        } else {
            player = this.getPlayerRest(needs, allPlayers);
        };
        return player;
    }
};

export default Computer;