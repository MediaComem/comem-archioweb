import subject from 'courses-md/dist/client';
import $ from 'jquery';
import MicroModal from 'micromodal';
import tippy from 'tippy.js';

import { sha1 } from './utils';

export class RunkitController {
  static start() {
    this.startRunkit();
    subject.slideshow.on('afterShowSlide', this.startRunkit);
    subject.slideshow.on('beforeHideSlide', this.destroyRunkit);
  }

  static startRunkit() {

    const $globalRunkitConfig = $('runkit[global]');
    let enabled = $globalRunkitConfig.length && $globalRunkitConfig.attr('enabled') && $globalRunkitConfig.attr('enabled').match(/^(1|y|yes|t|true)$/i);

    const $runkitConfig = $('.remark-visible .remark-slide-content runkit:not([global])');

    let disabled = false;
    let except = [];

    if ($runkitConfig.length) {

      enabled = enabled || true;
      disabled = $runkitConfig.attr('disabled') !== undefined && $runkitConfig.attr('disabled') !== false;

      // Do not enable runkit if a <runkit> tag is found with this code block's index in its "disable" attribute (comma-separated list of indices)
      if ($runkitConfig.attr('except')) {
        except = except.concat($runkitConfig.attr('except').split(/\s*,\s*/).map(id => parseInt(id, 10)));
      }
    }

    if (!enabled) {
      return;
    }

    $('.remark-visible .remark-slide-content code.javascript:not(.runkit)').each(function(i) {
      if (disabled || except.indexOf(i) >= 0) {
        return;
      }

      const $code = $(this);
      new RunkitController($code, i).start();
    });
  }

  static destroyRunkit() {
    $('.runkit').each(function() {
      const controller = $(this).data('runkit-controller');
      if (controller) {
        controller.destroy();
      } else {
        console.warn('Runkit controller not found for', this);
      }
    });
  }

  constructor($code, index) {
    this.$element = $code;
    this.$element.addClass('runkit').data('runkit-controller', this);
    this.index = index;
  }

  start() {
    if (this.source) {
      throw new Error('Runkit controller has already started');
    }

    this.source = this.parseCode(this.$element);
    this.sourceId = `runkit-comem-webdev-${sha1(this.source)}`;

    $('<button />').addClass('runkit-button').attr('type', 'button').text('RunKit').prependTo(this.$element);
    this.$element.attr('title', 'Click to run this code');
    this.tip = tippy('.remark-visible .remark-slide-content .runkit[title]');

    this.modal = this.getModal();
    this.$element.on('click', event => {
      event.preventDefault();
      MicroModal.show(`${this.sourceId}-modal`, {
        onShow: modal => {

          const $modal = $(modal);
          $modal.find('.status').text('Loading RunKit...');

          const $source = $modal.find('.source');
          RunKit.createNotebook({
            element: $source[0],
            source: $source.text(),
            onLoad: notebook => {
              $modal.find('.status').text('Executing...');
              notebook.evaluate(() => {
                setTimeout(() => {
                  $modal.find('.status').fadeOut();
                  $modal.find('.runkit-spinner').fadeOut(function() {
                    $(this).remove();
                  });
                }, 1000);
              });
            }
          });
        },
        onClose: modal => {
          $(modal).find('.source iframe').remove();
        }
      });
    });
  }

  destroy() {

    if (this.sourceId) {

      const modalId = `${this.sourceId}-modal`;
      const $modal = $(`#${modalId}`);
      $modal.remove();

      this.$element.find('.runkit-button').remove();
    }

    if (this.tip) {
      this.tip.destroyAll();
    }

    this.$element.removeClass('runkit').data('runkit-controller', null);
    this.$element.off('click');
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


function createModal(id, source) {

  const titleText = $('.remark-visible .remark-slide-content').find('h1, h2, h3, h4, h5, h6').first().text() || 'Source';

  const $modal = $('<div />').attr('id', `${id}-modal`).attr('aria-hidden', 'true').addClass('micromodal').appendTo($('body'));
  const $overlay = $('<div />').addClass('overlay').attr('tabindex', '-1').attr('data-micromodal-close', '').appendTo($modal);
  const $dialog = $('<div />').addClass('container').attr('role', 'dialog').attr('aria-modal', 'true').attr('aria-labelledby', `${id}-title`).appendTo($overlay);

  const $header = $('<header />').addClass('header').appendTo($dialog);
  const $title = $('<h2 />').addClass('title').attr('id', `${id}-title`).text(titleText).appendTo($header);
  $('<small />').addClass('status').text('Loading...').appendTo($title);
  $('<i />').addClass('close fa fa-close').attr('aria-label', 'Close').attr('data-micromodal-close', '').appendTo($header);

  const $content = $('<div />').attr('id', `${id}-content`).appendTo($dialog);
  const $source = $('<div />').addClass('source').appendTo($content);
  $('<div />').css('display', 'none').text(source).appendTo($source);

  const $spinner = $('<div />').addClass('runkit-spinner').appendTo($content);
  $spinner.append($('<div />').addClass('bounce1'));
  $spinner.append($('<div />').addClass('bounce2'));
  $spinner.append($('<div />').addClass('bounce3'));

  return $modal;
}
