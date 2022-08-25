
export function getSeasonsPaths(){
    const fs = require('fs');

    try {
        const seasonsDirData = fs.readdirSync('../data/WatchYourMouthLeague', 'utf8');
        const seasonsArray = seasonsDirData.map((elem) => parseInt(elem)).filter((elem) => !!elem)

        const seasonsPaths = seasonsArray.map((seasonNum) => {
            return {
                params: {
                    season: seasonNum.toString()
                }
            }
        })
        return {
            paths: seasonsPaths,
            fallback: false
        }
    } catch (err) {
        console.error(err);
    }
}