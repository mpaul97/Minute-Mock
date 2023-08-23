import Need from "./Need";
import Helper from "./Helper";

const helper = new Helper();

class Teams {
    constructor(leagueSize, positionSizes) {
        this.leagueSize = leagueSize;
        this.positionSizes = positionSizes;
        this.flexPositions = ['RB', 'WR', 'TE'];
    };
    initTeams() {
        var teams = {};
        for (var i = 1; i < this.leagueSize + 1; i++) {
            var tempObj = {};
            for (let key of Object.keys(this.positionSizes)) {
                var arr = [];
                for (var j = 0; j < this.positionSizes[key].size; j++) {
                    arr.push('');
                };
                tempObj[key] = arr;
            }
            teams[i] = tempObj;
        }
        return teams;
    };
    initNeeds() {
        var needs = {};
        for (var i = 1; i < this.leagueSize + 1; i++) { 
            needs[i] = [
                new Need('QB', helper.randomFloatInRange(0.1, 0.3)),
                new Need('RB', helper.randomFloatInRange(0.3, 0.6)),
                new Need('WR', helper.randomFloatInRange(0.2, 0.5)),
                new Need('TE', helper.randomFloatInRange(0.1, 0.25)),
                new Need('K', helper.randomFloatInRange(0, 0.12)),
                new Need('DST', helper.randomFloatInRange(0.02, 0.15))
            ]
        };
        return needs;
    };
    insertPlayer(team, position, player) {
        for (var i = 0; i < team[position].length; i++) {
            if (team[position][i] === '') {
                team[position][i] = player.name;
                break;
            }
        }
    };
    addPlayer(team, player) {
        if (team[player.position].includes('')) {
            this.insertPlayer(team, player.position, player);
        } else if (team['FLEX'].includes('') && this.flexPositions.includes(player.position)) {
            this.insertPlayer(team, 'FLEX', player);
        } else if (team['BEN'].includes('')) {
            this.insertPlayer(team, 'BEN', player);
        } else {
            return;
        };
        return true;
    };
    getMissingStarters(team) {
        return Object.keys(team).filter(key => key !== 'BEN').map(key => {
            return (
                [key, helper.count(team[key], '')]
            )
        })
    };
    updateNeeds(team, needs, selectedPosition, round) {
        var earlyRoundPositions = ['QB', 'RB', 'WR', 'TE'];
        for (var i = 0; i < needs.length; i++) {
            var n = needs[i];
            var needPosition = n.positionAbbr;
            var weight = n.weight;
            if (needPosition === selectedPosition) {
                needs[i] = new Need(
                    needPosition, 
                    (weight - helper.randomFloatInRange(0, 0.1))
                );
            } else {
                if (round <= 5) {
                    if (earlyRoundPositions.includes(needPosition)) {
                        needs[i] = new Need(
                            needPosition, 
                            (weight + helper.randomFloatInRange(0, 0.1))
                        );
                    }
                } else {
                    needs[i] = new Need(
                        needPosition, 
                        (weight + helper.randomFloatInRange(0, 0.1))
                    );
                }
            }
        };
        if(!team['BEN'].includes('')) { // full bench
            // MAYBE NOT NEEDED
            // set last selected position weight to 0
            var lastIndex = needs.map(x => x.positionAbbr).indexOf(selectedPosition);
            needs[lastIndex] = new Need(selectedPosition, 0);
            var missing = this.getMissingStarters(team);
            for (var [pos, count] of missing) {
                if (count !== 0) {
                    var index = needs.map(x => x.positionAbbr).indexOf(pos);
                    needs[index] = new Need(pos, 5);
                }
            };
        };
        return needs;
    };
    initRoundsSelected(totalRounds, keepers) {
        let obj = {};
        for (var i = 1; i <= totalRounds; i++) {
            obj[i] = [];
            if (keepers.map(x => x.round).includes(i)) {
                obj[i].push(keepers.find(x => x.round === i).name);
            };
        };
        return obj;
    };
}

// 1 : {
//   'QB': [''],
//   'RB': ['', ''}]
// }

export default Teams;