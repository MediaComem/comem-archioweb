import subject from 'courses-md/dist/client.js';

window.subject = subject;

import { CodepenController } from './codepen.js';

import 'font-awesome/css/font-awesome.css';

import './assets/bootstrap-btn.css';
import 'tippy.js/dist/tippy.css';
import './assets/fonts/DroidSerif/DroidSerif.css';
import './assets/fonts/UbuntuMono/UbuntuMono.css';
import './assets/fonts/YanoneKaffeesatz/YanoneKaffeesatz.css';
import './assets/slides.css';
import './assets/codepen.css';

import heigLogo from './assets/heig.png';

subject.setLogo({
  url: 'https://heig-vd.ch',
  imageUrl: heigLogo,
  height: 35
});

subject
  .afterStart(() => {
    CodepenController.start();
  })
  .start();
