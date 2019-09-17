import subject from 'courses-md/dist/client';

window.subject = subject;

import { RunkitController } from './runkit';

import 'font-awesome/css/font-awesome.css';

import './assets/bootstrap-btn.css';
import 'tippy.js/dist/tippy.css';
import './assets/fonts/DroidSerif/DroidSerif.css';
import './assets/fonts/UbuntuMono/UbuntuMono.css';
import './assets/fonts/YanoneKaffeesatz/YanoneKaffeesatz.css';
import './assets/slides.css';
import './assets/micromodal.css';
import './assets/runkit.css';

import heigLogo from './assets/heig.png';

subject.setLogo({
  url: 'https://heig-vd.ch',
  imageUrl: heigLogo,
  height: 60
});

subject
  .afterStart(() => RunkitController.start())
  .start();
