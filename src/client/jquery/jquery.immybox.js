import $ from 'jquery';
import jQuery from 'jquery';



(function() {
  var __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function($, window, document) {
    var ImmyBox, defaults, objects, pluginName;
    pluginName = "immybox";
    defaults = {
      choices: [],
      maxResults: 50,
      showArrow: true,
      openOnClick: true,
      filterFn: function(query) {
        return function(choice) {
          return choice.text.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        };
      },
      formatChoice: function(choice, query) {
        var head, i, matchedText, tail, _ref;
        i = choice.text.toLowerCase().indexOf(query.toLowerCase());
        if (i >= 0) {
          matchedText = choice.text.slice(i, i + query.length);
          _ref = choice.text.split(matchedText), head = _ref[0], tail = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
          return "" + head + "<span class='highlight'>" + matchedText + "</span>" + (tail.join(matchedText));
        } else {
          return choice.text;
        }
      }
    };
    objects = [];
    ImmyBox = (function() {
      function ImmyBox(element, options) {
        this.reposition = __bind(this.reposition, this);
        this.revert = __bind(this.revert, this);
        this.openResults = __bind(this.openResults, this);
        this.doSelection = __bind(this.doSelection, this);
        this.doQuery = __bind(this.doQuery, this);
        var self, _base;
        self = this;
        this.element = $(element);
        this.element.addClass(pluginName);
        this._defaults = defaults;
        this._name = pluginName;
        this.options = $.extend({}, defaults, options);
        this.choices = this.options.choices;
        this.selectedChoice = null;
        if (this.options.showArrow) {
          this.element.addClass("" + pluginName + "_witharrow");
        }
        if (this.options.openOnClick) {
          this.element.on('click', this.openResults);
        }
        this.selectChoiceByValue(this.element.val());
        this.queryResultArea = $("<div class='" + pluginName + "_results'></div>");
        if (typeof (_base = this.queryResultArea).scrollLock === "function") {
          _base.scrollLock();
        }
        this.queryResultAreaVisible = false;
        this._val = this.element.val();
        this.oldQuery = this._val;
        this.queryResultArea.on('click', "li." + pluginName + "_choice", function() {
          var value;
          value = $(this).data('value');
          self.selectChoiceByValue(value);
          self.hideResults();
          self._val = self.element.val();
          self.element.focus();
        });
        this.queryResultArea.on('mouseenter', "li." + pluginName + "_choice", function() {
          self.queryResultArea.find("li." + pluginName + "_choice.active").removeClass('active');
          $(this).addClass('active');
        });
        this.element.on('keyup change search', this.doQuery);
        this.element.on('keydown', this.doSelection);
      }

      ImmyBox.prototype.doQuery = function() {
        var query;
        query = this.element.val();
        if (this._val !== query) {
          this._val = query;
          this.oldQuery = query;
          if (query === '') {
            this.hideResults();
          } else {
            this.insertFilteredChoiceElements(query);
          }
        }
      };

      ImmyBox.prototype.doSelection = function(e) {
        if (e.which === 27) {
          this.display();
          this.hideResults();
        }
        if (this.queryResultAreaVisible) {
          switch (e.which) {
            case 9:
              this.selectHighlightedChoice();
              break;
            case 13:
              e.preventDefault();
              this.selectHighlightedChoice();
              break;
            case 38:
              e.preventDefault();
              this.highlightPreviousChoice();
              this.scroll();
              break;
            case 40:
              e.preventDefault();
              this.highlightNextChoice();
              this.scroll();
          }
        } else {
          switch (e.which) {
            case 40:
              e.preventDefault();
              if (this.selectedChoice != null) {
                this.insertFilteredChoiceElements(this.oldQuery);
              } else {
                this.insertFilteredChoiceElements('');
              }
              break;
            case 9:
              this.revert();
          }
        }
      };

      ImmyBox.prototype.openResults = function(e) {
        e.stopPropagation();
        this.revertOtherInstances();
        if (this.selectedChoice != null) {
          this.insertFilteredChoiceElements(this.oldQuery);
        } else {
          this.insertFilteredChoiceElements('');
        }
      };

      ImmyBox.prototype.revert = function() {
        if (this.queryResultAreaVisible) {
          this.display();
          this.hideResults();
        } else if (this.element.val() === '') {
          this.selectChoiceByValue(null);
        }
      };

      ImmyBox.prototype.reposition = function() {
        if (this.queryResultAreaVisible) {
          this.positionResultsArea();
        }
      };

      ImmyBox.prototype.insertFilteredChoiceElements = function(query) {
        var filteredChoices, format, info, list, results, selectedOne, truncatedChoices,
          _this = this;
        if (query === '') {
          filteredChoices = this.choices;
        } else {
          filteredChoices = this.choices.filter(this.options.filterFn(this.oldQuery));
        }
        truncatedChoices = filteredChoices.slice(0, this.options.maxResults);
        format = this.options.formatChoice;
        selectedOne = false;
        results = truncatedChoices.map(function(choice) {
          var li;
          li = $("<li class='" + pluginName + "_choice'></li>");
          li.attr('data-value', choice.value);
          li.html(format(choice, query));
          if (choice === _this.selectedChoice) {
            selectedOne = true;
            li.addClass('active');
          }
          return li;
        });
        if (results.length === 0) {
          info = $("<p class='" + pluginName + "_noresults'>no matches</p>");
          this.queryResultArea.empty().append(info);
        } else {
          if (!selectedOne) {
            results[0].addClass('active');
          }
          list = $('<ul></ul>').append(results);
          this.queryResultArea.empty().append(list);
        }
        this.showResults();
      };

      ImmyBox.prototype.scroll = function() {
        var highlightedChoice, highlightedChoiceBottom, highlightedChoiceHeight, highlightedChoiceTop, resultsBottom, resultsHeight, resultsTop;
        resultsHeight = this.queryResultArea.height();
        resultsTop = this.queryResultArea.scrollTop();
        resultsBottom = resultsTop + resultsHeight;
        highlightedChoice = this.getHighlightedChoice();
        if (highlightedChoice == null) {
          return;
        }
        highlightedChoiceHeight = highlightedChoice.outerHeight();
        highlightedChoiceTop = highlightedChoice.position().top + resultsTop;
        highlightedChoiceBottom = highlightedChoiceTop + highlightedChoiceHeight;
        if (highlightedChoiceTop < resultsTop) {
          this.queryResultArea.scrollTop(highlightedChoiceTop);
        }
        if (highlightedChoiceBottom > resultsBottom) {
          this.queryResultArea.scrollTop(highlightedChoiceBottom - resultsHeight);
        }
      };

      ImmyBox.prototype.positionResultsArea = function() {
        var inputHeight, inputOffset, inputWidth, resultsBottom, resultsHeight, windowBottom;
        inputOffset = this.element.offset();
        inputHeight = this.element.outerHeight();
        inputWidth = this.element.outerWidth();
        resultsHeight = this.queryResultArea.outerHeight();
        resultsBottom = inputOffset.top + inputHeight + resultsHeight;
        windowBottom = $(window).height() + $(window).scrollTop();
        this.queryResultArea.outerWidth(inputWidth);
        this.queryResultArea.css({
          left: inputOffset.left
        });
        /* if (resultsBottom > windowBottom) {
          this.queryResultArea.css({
            top: inputOffset.top - resultsHeight
          });
        } else {
        */
        // always open downwards:
          this.queryResultArea.css({
            top: inputOffset.top + inputHeight
          });
        // }
      };

      ImmyBox.prototype.getHighlightedChoice = function() {
        var choice;
        choice = this.queryResultArea.find("li." + pluginName + "_choice.active");
        if (choice.length === 1) {
          return choice;
        } else {
          return null;
        }
      };

      ImmyBox.prototype.highlightNextChoice = function() {
        var highlightedChoice, nextChoice;
        highlightedChoice = this.getHighlightedChoice();
        if (highlightedChoice != null) {
          nextChoice = highlightedChoice.next("li." + pluginName + "_choice");
          if (nextChoice.length === 1) {
            highlightedChoice.removeClass('active');
            nextChoice.addClass('active');
          }
        }
      };

      ImmyBox.prototype.highlightPreviousChoice = function() {
        var highlightedChoice, previousChoice;
        highlightedChoice = this.getHighlightedChoice();
        if (highlightedChoice != null) {
          previousChoice = highlightedChoice.prev("li." + pluginName + "_choice");
          if (previousChoice.length === 1) {
            highlightedChoice.removeClass('active');
            previousChoice.addClass('active');
          }
        }
      };

      ImmyBox.prototype.selectHighlightedChoice = function() {
        var highlightedChoice, value;
        highlightedChoice = this.getHighlightedChoice();
        if (highlightedChoice != null) {
          value = highlightedChoice.data('value');
          this.selectChoiceByValue(value);
          this._val = this.element.val();
          this.hideResults();
        } else {
          this.revert();
        }
      };

      ImmyBox.prototype.display = function() {
        if (this.selectedChoice != null) {
          this.selectedChoice.text;
          this.element.val(this.selectedChoice.text);
        } else {
          this.element.val('');
        }
        this._val = this.element.val();
      };

      ImmyBox.prototype.selectChoiceByValue = function(value) {
        var matches, newValue, oldValue;
        oldValue = this.getValue();
        if ((value != null) && value !== '') {
          matches = this.choices.filter(function(choice) {
            return choice.value == value;
          });
          if (matches[0] != null) {
            this.selectedChoice = matches[0];
          } else {
            this.selectedChoice = null;
          }
        } else {
          this.selectedChoice = null;
        }
        newValue = this.getValue();
        if (newValue !== oldValue) {
          this.element.trigger('update', [newValue]);
        }
        this.display();
      };

      ImmyBox.prototype.revertOtherInstances = function() {
        var o, _i, _len;
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          o = objects[_i];
          if (o !== this) {
            o.revert();
          }
        }
      };

      ImmyBox.prototype.publicMethods = ['showResults', 'hideResults', 'getChoices', 'setChoices', 'getValue', 'setValue', 'destroy'];

      ImmyBox.prototype.showResults = function() {
        $('body').append(this.queryResultArea);
        this.queryResultAreaVisible = true;
        this.scroll();
        this.positionResultsArea();
      };

      ImmyBox.prototype.hideResults = function() {
        this.queryResultArea.detach();
        this.queryResultAreaVisible = false;
      };

      ImmyBox.prototype.getChoices = function() {
        return this.choices;
      };

      ImmyBox.prototype.setChoices = function(newChoices) {
        this.choices = newChoices;
        if (this.selectedChoice != null) {
          this.selectChoiceByValue(this.selectedChoice.value);
        }
        this.oldQuery = '';
        return newChoices;
      };

      ImmyBox.prototype.getValue = function() {
        if (this.selectedChoice != null) {
          return this.selectedChoice.value;
        } else {
          return null;
        }
      };

      ImmyBox.prototype.setValue = function(newValue) {
        var currentValue;
        currentValue = this.getValue();
        if (currentValue !== newValue) {
          this.selectChoiceByValue(newValue);
          this.oldQuery = '';
          return this.getValue();
        } else {
          return currentValue;
        }
      };

      ImmyBox.prototype.destroy = function() {
        var _this = this;
        this.element.off('keyup change search', this.doQuery);
        this.element.off('keydown', this.doSelection);
        if (this.options.openOnClick) {
          this.element.off('click', this.openResults);
        }
        this.element.removeClass(pluginName);
        this.queryResultArea.remove();
        $.removeData(this.element[0], "plugin_" + pluginName);
        objects = objects.filter(function(o) {
          return o !== _this;
        });
      };

      return ImmyBox;

    })();
    $('html').on('click', function() {
      var o, _i, _len;
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        o = objects[_i];
        o.revert();
      }
    });
    $(window).on('resize scroll', function() {
      var o, _i, _len;
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        o = objects[_i];
        if (o.queryResultAreaVisible) {
          o.reposition();
        }
      }
    });
    $.fn[pluginName] = function(options) {
      var args, outputs;
      args = Array.prototype.slice.call(arguments, 1);
      outputs = [];
      this.each(function() {
        var method, newObject, plugin;
        if ($.data(this, "plugin_" + pluginName)) {
          if ((options != null) && typeof options === 'string') {
            plugin = $.data(this, "plugin_" + pluginName);
            method = options;
            if (__indexOf.call(plugin.publicMethods, method) >= 0) {
              outputs.push(plugin[method].apply(plugin, args));
            } else {
              throw new Error("" + pluginName + " has no method '" + method + "'");
            }
          }
        } else {
          newObject = new ImmyBox(this, options);
          objects.push(newObject);
          outputs.push($.data(this, "plugin_" + pluginName, newObject));
        }
      });
      return outputs;
    };
  })(jQuery, window, document);

}).call(this);
