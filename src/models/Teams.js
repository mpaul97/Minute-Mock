import TeamObj from "./TeamObj";

class Teams {
    constructor(leagueSize, positionSizes) {
        this.leagueSize = leagueSize;
        this.positionSizes = positionSizes;
    }
    initTeams() {
        var teams = {};
        for (var i = 1; i < this.leagueSize + 1; i++) {
            var tempObj = {};
            for (let key of Object.keys(this.positionSizes)) {
                var arr = [];
                for (var j = 0; j < this.positionSizes[key].size; j++) {
                    arr.push({name: ''});
                };
                tempObj[key] = arr;
            }
            teams[i] = tempObj;
        }
        return teams;
    }
}

// 1 : {
//   'QB': [{name: ''}],
//   'RB': [{name: '', name: ''}]
// }

export default Teams;