import subject from 'courses-md/dist/client';
import $ from 'jquery';
import tippy from 'tippy.js';

import { sha1 } from './utils';

let globalCodepenIndex = 0;

export class CodepenController {
  static start() {
    this.startCodepen();
    subject.slideshow.on('afterShowSlide', this.startCodepen);
  }

  static startCodepen() {

    const $globalCodepenConfig = $('codepen[global]');
    let enabled = $globalCodepenConfig.length && $globalCodepenConfig.attr('enabled') && $globalCodepenConfig.attr('enabled').match(/^(1|y|yes|t|true)$/i);

    const $codepenConfig = $('.remark-visible .remark-slide-content codepen:not([global])');

    let disabled = false;
    let except = [];

    if ($codepenConfig.length) {

      enabled = enabled || true;
      disabled = $codepenConfig.attr('disabled') !== undefined && $codepenConfig.attr('disabled') !== false;

      // Do not enable codepen if a <codepen> tag is found with this code block's index in its "disable" attribute (comma-separated list of indices)
      if ($codepenConfig.attr('except')) {
        except = except.concat($codepenConfig.attr('except').split(/\s*,\s*/).map(id => parseInt(id, 10)));
      }
    }

    if (!enabled) {
      return;
    }

    $('.remark-visible .remark-slide-content code.javascript:not(.codepen)').each(function(i) {
      if (disabled || except.indexOf(i) >= 0) {
        return;
      }

      const $code = $(this);
      new CodepenController($code, globalCodepenIndex++).start();
    });
  }

  constructor($code, index) {
    this.$element = $code;
    this.$element.addClass('codepen').data('codepen-controller', this);
    this.index = index;
  }

  start() {
    if (this.source) {
      throw new Error('Codepen controller has already started');
    }

    this.source = this.parseCode(this.$element);
    this.sourceId = `codepen-comem-archioweb-${sha1(this.source)}-${this.index}`;

    const $form = createForm(this.sourceId, this.source);
    $form.prependTo(this.$element);

    this.$element.attr('title', 'Click on CodePen to run this code');
    this.tip = tippy('.remark-visible .remark-slide-content .codepen[title]');
  }

  parseCode($code) {
    const $lines = $code.find('.remark-code-line');
    return $.map($lines, line => $(line).contents().text()).join('\n');
  }

  getModal() {
    const $modal = $(`#${this.sourceId}-modal`);
    return $modal.length ? $modal : createModal(this.sourceId, this.source);
  }
}

function createForm(id, source) {

  const title = $('.remark-visible .remark-slide-content').find('h1, h2, h3, h4, h5, h6').first().text() || 'Source';

  // https://blog.codepen.io/documentation/prefill/#all-the-json-options-0
  const codepenData = {
    title,
    // Open the JavaScript editor and the console, keep the HTML and CSS editors
    // closed.
    editors: '0011',
    js: source
  };

  const $form = $('<form />')
    .attr('id', id)
    .attr('action', 'https://codepen.io/pen/define')
    .attr('method', 'POST')
    .attr('target', '_blank');

  // Add hidden input with source code.
  $('<input />')
    .attr('type', 'hidden')
    .attr('name', 'data')
    .attr('value', JSON.stringify(codepenData))
    .appendTo($form);

  // Add submit button.
  $('<button />')
    .addClass('codepen-button')
    .attr('type', 'submit')
    .text('CodePen')
    .appendTo($form);

  return $form;
}
