import users from '../assets/users';
import sessions from '../assets/sessions';

class GameScore {
    constructor(data) {
        this.alias = data.alias
        this.participants = Object.keys(data.participants);
        this.puzzles = [];
        for (let i = 0; i < data.puzzles.length; i++) {
            this.puzzles.push(data.puzzles[i].name);
        }
        this.rounds = [];
        for (let i = 0; i < data.rounds.length; i++) {
            this.rounds.push(data.rounds[i].solutions);
        }
    }
}

class PersonalScore {
    constructor(uid, contestants, data) {
        this.uid = uid;
        this.userName = contestants[uid];
        this.fullTime = 0;
        this.puzzleScores = {};
        for (let i = 0; i < data.puzzles.length; i++) {
            let tempRound = data.rounds[i][uid];
            if (typeof tempRound !== 'undefined') {
                if (data.rounds[i][uid].correct === 'Incorrect') {
                    tempRound.time.$numberLong = '150';
                }
                tempRound.time = tempRound.time.$numberLong || '150';
                this.puzzleScores[data.puzzles[i]] = {
                    time: tempRound.time,
                    code: tempRound.code
                };
                this.fullTime += Number.parseInt(tempRound.time,10);
            } else {
                this.puzzleScores[data.puzzles[i]] = {
                    time: '150',
                    code: ''
                };
                this.fullTime += 150;
            }
        }
    }
}


export default function getContestData() {
    let contestants = {};
    let aliasScores = {};
    let results = [];


        for (let i = 0; i < users.length; i++) {
            contestants[`${users[i].uid}`] = users[i].displayName;
        }


        for (let i = 0; i < sessions.length; i++) {
            aliasScores[sessions[i].alias] = new GameScore(sessions[i]);
            //aliasScores.set(sessions[i].alias, new GameScore(sessions[i]));
        }

        for (let alias in aliasScores) {
            let tempResults = [];

            for (let el of aliasScores[alias].participants) {
                tempResults.push(new PersonalScore(el, contestants, aliasScores[alias]));
            }

            tempResults.sort((a, b) => {
                return a.fullTime - b.fullTime;
            });

            results.push(tempResults)
        }

    return results
}

