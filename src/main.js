import {select} from '@kayac/utils';
import app from './system/application';
import {Service} from './service';
import i18n from './system/plugin/i18n';
import Swal from './system/plugin/swal';

import {
    iPhoneFullScreen,
    isMobile,
    isFullScreenSupport,
    requestFullScreen,
} from './system/modules/device';

function enableFullscreen() {
    if (!isMobile()) {
        return;
    }

    if (isFullScreenSupport(window.document.body)) {
        document.addEventListener('touchend', () =>
            requestFullScreen(window.document.body),
        );
    }

    iPhoneFullScreen();
}

async function main() {
    //  Init App
    try {
        document.title = 'For Every Gamer | 61 Studio';

        global.app = app;

        app.translate = await i18n.init(process.env.I18N_URL);
        app.alert = Swal(app.translate);
        app.service = new Service(process.env.SERVER_URL);

        // Import Load Scene
        const LoadScene = await import('./game/scenes/load/scene');
        await app.resource.load(LoadScene);

        const comp = select('#app');
        const svg = select('#preload');
        svg.remove();

        comp.prepend(app.view);

        const loadScene = LoadScene.create();
        app.stage.addChild(loadScene);
        app.resize();

        enableFullscreen();

        //  Import Main Scene
        const [Interface, MainScene, initData] = await Promise.all([
            import('./game/interface'),
            import('./game/scenes/main'),
            app.service.init(),
        ]);

        app.user.id = initData['player']['id'];
        app.user.cash = initData['player']['money'];

        app.user.betOptions = initData['betrate']['betrate'];
        app.user.betOptionsHotKey = initData['betrate']['betratelinkindex'];
        app.user.bet = initData['betrate']['betratedefaultindex'];

        await app.resource.load(Interface, MainScene);

        const scene = MainScene.create(initData['reel']);
        const ui = Interface.create();

        scene.addChild(ui);

        app.stage.addChildAt(scene, 0);

        select('script').forEach((el) => el.remove());

        app.resize();

        app.emit('Idle');

        document.title = app.translate('title');
        //
    } catch (error) {
        console.error(error);

        const msg = {title: error.message};

        app.alert.error(msg);
    }
}

main();
