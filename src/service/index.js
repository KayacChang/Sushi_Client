export function Service(url) {
    let gametypeid = undefined;

    const token = getToken();

    return {
        init,
        sendOneRound,
    };

    function getToken() {
        const token =
            new URL(location).searchParams.get('token') ||
            sessionStorage.getItem('token');

        if (!token) {
            throw new Error(`User Access Tokens is empty`);
        }

        const homeURL =
            new URL(location).searchParams.get('lobby') ||
            sessionStorage.getItem('lobby');

        history.pushState(
            undefined,
            undefined,
            location.origin + location.pathname,
        );

        global.addEventListener('popstate', () => history.back());

        sessionStorage.setItem('token', token);
        if (homeURL) sessionStorage.setItem('lobby', homeURL);

        return token;
    }

    async function init() {
        //
        const res = await fetch(url + '/game/init', {
            method: 'POST',
            headers: new Headers({
                Authorization: 'Bearer ' + token,
            }),
        });

        const {data, error} = await res.json();

        if (error.ErrorCode) {
            throw new Error(error.Msg);
        }

        gametypeid = data['player']['gametypeid'];

        return data;
    }

    async function sendOneRound({bet}) {
        const res = await fetch(url + '/game/result', {
            method: 'POST',
            headers: new Headers({
                Authorization: 'Bearer ' + token,
            }),
            body: JSON.stringify({
                bet,
                gametypeid,
            }),
        });

        const {data, error} = await res.json();

        if (error.ErrorCode) {
            throw new Error(error.Msg);
        }

        return handle(data);
    }

    function handle(data) {
        const totalWin = data['totalwinscore'];
        const cash = data['playermoney'];

        const normalGame = Round(data['normalresult']);

        const hasFreeGame = Boolean(data['isfreegame']);

        const freeGame = hasFreeGame && data['freeresult'].map(Round);

        return {
            cash,
            totalWin,

            normalGame,

            freeGame,
        };
    }

    function Round(data) {
        const symbols = data['plate'];

        const results = data['gameresult'].map(Result);

        const hasLink = results.length > 0;

        const scores = results
            .map(({scores}) => scores)
            .reduce((a, b) => a + b, 0);

        const bonus = data['bonusscore'] > 0 && data['bonusscore'];

        return {
            symbols,
            results,
            hasLink,
            scores,
            bonus,
        };
    }

    function Result(data) {
        const symbols = data['LineSymbolNum'].reduce((arr, row) => {
            arr.push(row[0]);

            return arr;
        }, []);

        const positions = data['LineSymbolPoint'].reduce((arr, row) => {
            arr.push(row[0]);

            return arr;
        }, []);

        const rate = data['LineWinRate'];
        const scores = data['Score'];

        const line = data['LineWinIndex'];

        return {
            symbols,

            line,
            positions,

            rate,
            scores,
        };
    }
}
