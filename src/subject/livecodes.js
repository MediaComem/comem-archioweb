import subject from "courses-md/dist/client.js";
import $ from "jquery";
import tippy from "tippy.js";

import { sha1 } from "./utils.js";
import { livecodesUrl } from "./livecodes-url.mjs";

let globalLivecodesIndex = 0;

export class LivecodesController {
  static start() {
    this.startLivecodes();
    subject.slideshow.on("afterShowSlide", this.startLivecodes);
  }

  static startLivecodes() {
    const $globalLivecodesConfig = $("livecodes[global]");
    let enabled =
      $globalLivecodesConfig.length &&
      $globalLivecodesConfig.attr("enabled") &&
      $globalLivecodesConfig.attr("enabled").match(/^(1|y|yes|t|true)$/i);

    const $livecodesConfig = $(
      ".remark-visible .remark-slide-content livecodes:not([global])"
    );

    let disabled = false;
    let except = [];

    if ($livecodesConfig.length) {
      enabled = enabled || true;
      disabled =
        $livecodesConfig.attr("disabled") !== undefined &&
        $livecodesConfig.attr("disabled") !== false;

      // Do not enable livecodes if a <livecodes> tag is found with this code block's index in its "disable" attribute (comma-separated list of indices)
      if ($livecodesConfig.attr("except")) {
        except = except.concat(
          $livecodesConfig
            .attr("except")
            .split(/\s*,\s*/)
            .map((id) => parseInt(id, 10))
        );
      }
    }

    if (!enabled) {
      return;
    }

    $(
      ".remark-visible .remark-slide-content code.javascript:not(.livecodes)"
    ).each(function (i) {
      if (disabled || except.indexOf(i) >= 0) {
        return;
      }

      const $code = $(this);
      new LivecodesController($code, globalLivecodesIndex++).start();
    });
  }

  constructor($code, index) {
    this.$element = $code;
    this.$element.addClass("livecodes").data("livecodes-controller", this);
    this.index = index;
  }

  start() {
    if (this.source) {
      throw new Error("Livecodes controller has already started");
    }

    this.source = this.parseCode(this.$element);
    this.sourceId = `livecodes-comem-archioweb-${sha1(this.source)}-${
      this.index
    }`;

    const $link = createLink(this.sourceId, this.source);
    $link.prependTo(this.$element);

    this.$element.attr(
      "data-tippy-content",
      "Click on LiveCodes to run this code"
    );
    this.tip = tippy(
      ".remark-visible .remark-slide-content .livecodes[data-tippy-content]"
    );
  }

  parseCode($code) {
    const $lines = $code.find(".remark-code-line");
    return $.map($lines, (line) => $(line).contents().text()).join("\n");
  }
}

function createLink(id, source) {
  const title =
    $(".remark-visible .remark-slide-content")
      .find("h1, h2, h3, h4, h5, h6")
      .first()
      .text() || "Source";

  // Everything is in the URL: students need no account to run or edit the code.
  return $("<a />")
    .attr("id", id)
    .attr("href", livecodesUrl(source, title))
    .attr("target", "_blank")
    .attr("rel", "noopener noreferrer")
    .addClass("livecodes-button")
    .text("LiveCodes");
}
