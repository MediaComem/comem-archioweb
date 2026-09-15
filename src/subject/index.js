import subject from 'courses-md/dist/client.js';

window.subject = subject;

import { LivecodesController } from './livecodes.js';

import 'font-awesome/css/font-awesome.css';

import './assets/bootstrap-btn.css';
import 'tippy.js/dist/tippy.css';
import './assets/fonts/DroidSerif/DroidSerif.css';
import './assets/fonts/UbuntuMono/UbuntuMono.css';
import './assets/fonts/YanoneKaffeesatz/YanoneKaffeesatz.css';
import './assets/slides.css';
import './assets/livecodes.css';

import heigLogo from './assets/heig.png';

subject.setLogo({
  url: 'https://heig-vd.ch',
  imageUrl: heigLogo,
  height: 35
});

subject
  .afterStart(() => {
    LivecodesController.start();
  })
  .start();
