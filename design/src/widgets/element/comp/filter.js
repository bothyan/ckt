/*
* 图片滤镜的处理方法
* */
  let SvgFilter = {
    /*
     * 创建滤镜
     */
    createElementBrightness : function(intercept)  {
      var brightness = document.createElementNS("http://www.w3.org/2000/svg", "feComponentTransfer");
      brightness.setAttribute("class", "brightness");
      brightness.setAttribute("color-interpolation-filters", "sRGB");
      ["r", "g", "b"].forEach(function(a) {
        var e = document.createElementNS("http://www.w3.org/2000/svg", "feFunc" + a.toUpperCase());
        e.setAttribute("type", "linear");
        e.setAttribute("slope", 1);
        e.setAttribute("intercept", intercept);
        brightness.appendChild(e);
      });

      return brightness;
    },

    createElementContrast : function(slope, intercept)  {
      contrast = document.createElementNS("http://www.w3.org/2000/svg", "feComponentTransfer");
      contrast.setAttribute("class", "contrast");
      contrast.setAttribute("color-interpolation-filters", "sRGB");
      ["r", "g", "b"].forEach(function(a) {
        a = document.createElementNS("http://www.w3.org/2000/svg", "feFunc" + a.toUpperCase());
        a.setAttribute("type", "linear");
        a.setAttribute("slope", slope);
        a.setAttribute("intercept", intercept);
        contrast.appendChild(a)
      });
      return contrast;
    },

    createElementSaturation : function(value) {
      var saturation = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
      saturation.setAttribute("class", "saturation");
      saturation.setAttribute("color-interpolation-filters", "sRGB");
      saturation.setAttribute("type", "matrix");
      saturation.setAttribute("values", value.join(" "));

      return saturation;
    },

    createElementGaussianBlur : function(value)  {
      var gaussianBlur = null;
      if (value < 0) {
        value *= -1;
        value = value / 100 * 4;
        value = [0, -value, 0, -value, 4 * value + 1, -value, 0, -value, 0];
        gaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feConvolveMatrix");
        gaussianBlur.setAttribute("order", "3");
        gaussianBlur.setAttribute("kernelMatrix", value.join(" "));
        gaussianBlur.setAttribute("class", "sharpen");
      } else {
        gaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
        //gaussianBlur.setAttribute("stdDeviation", 0.125 * value);
        var times;
        var ele = this._owner_design._focus_element;
        if(ele._element_type === 'img' || ele._element_type === 'background') {
          var viewbox = $('.page').children('svg')[0].getAttribute('viewBox').split(' ');
          times = parseInt(viewbox[2]) / 1000
        } else {
          times = 1;
        }
        gaussianBlur.setAttribute("stdDeviation", 0.125 * times * value);
        gaussianBlur.setAttribute("class", "blur");
      }

      return gaussianBlur;
    },

    createElementConvolveMatrix : function(value) {
      var convolveMatrix = document.createElementNS("http://www.w3.org/2000/svg", "feConvolveMatrix");
      convolveMatrix.setAttribute("class", "convolveMatrix");
      convolveMatrix.setAttribute("order", "3");
      convolveMatrix.setAttribute("kernelMatrix", value.join(" "));

      return convolveMatrix;
    },

    createElementVignette : function(value, filterId) {
      var vignette = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient"),
        c = document.createElementNS("http://www.w3.org/2000/svg", "stop"),
        d = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      vignette.setAttribute("class", "vignette");
      vignette.setAttribute("id", filterId + "_VIGNETTE");

      vignette.appendChild(c);
      vignette.appendChild(d);
      vignette.setAttribute("cx", "50%");
      vignette.setAttribute("cy", "50%");
      vignette.setAttribute("r", "50%");
      vignette.setAttribute("fx", "50%");
      vignette.setAttribute("fy", "50%");
      var e = 0.7 / 1.3,
        g = Math.min(1, 1.3);
      c.setAttribute("offset", e.toString());
      c.setAttribute("stop-color", "#000000");
      c.setAttribute("stop-opacity", "0");
      d.setAttribute("offset", g.toString());
      d.setAttribute("stop-color", "#000000");
      d.setAttribute("stop-opacity", value / 100);

      return vignette;
    },

    createElementRect : function(filter, vignette) {
      var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", "-75");
      rect.setAttribute("y", "-75");
      rect.setAttribute("width", "650");
      rect.setAttribute("height", "650");

      rect.setAttribute("class", vignette.getAttribute("class"));
      rect.setAttribute("fill", vignette.getAttribute("id"));

      return rect;
    },

    createElementTint : function(value) {
      var a = mp(value + 100),
        b = {
          r: a.color.r / 255,
          g: a.color.g / 255,
          b: a.color.b / 255
        },
        c = a.Dm / 100 * 2,
        tint = document.createElementNS("http://www.w3.org/2000/svg", "feComponentTransfer");
      tint.setAttribute("class", "tint");
      tint.setAttribute("color-interpolation-filters", "sRGB");
      ["r", "g", "b"].forEach(function(a) {
        var e = document.createElementNS("http://www.w3.org/2000/svg", "feFunc" + a.toUpperCase());
        a = b[a] * c;
        e.setAttribute("type", "linear");
        e.setAttribute("slope", 1 - c);
        e.setAttribute("intercept", a);
        tint.appendChild(e);
      });

      return tint;
    },

    createElementCrossProcess : function(a) {
      a = np(a);
      var crossProcess = document.createElementNS("http://www.w3.org/2000/svg", "feComponentTransfer");
      crossProcess.setAttribute("color-interpolation-filters", "sRGB");
      crossProcess.setAttribute("class", "crossProcess");
      var c = {
        r: a.red,
        g: a.green,
        b: a.blue
      };
      ["r", "g", "b"].forEach(function(a) {
        var d = document.createElementNS("http://www.w3.org/2000/svg", "feFunc" + a.toUpperCase());
        if (a = c[a]) a = Gp({
            x: a[0][0],
            y: a[0][1]
          },
          {
            x: a[1][0],
            y: a[1][1]
          },
          {
            x: a[2][0],
            y: a[2][1]
          },
          {
            x: a[3][0],
            y: a[3][1]
          }).map(function(a) {
          return a.y
        });
        d.setAttribute("type", "table");
        d.setAttribute("tableValues", a.join(" "));
        crossProcess.appendChild(d);
      });

      return crossProcess;
    },



    /**
     * 设置亮度
     * @param {[jquery Object]} filter    [defs filter tag]
     * @param {[jquery Object]} dest      [svg image tag]
     * @param {[int]} value     [input range val]
     * @param {[String]} filterId [id of svg filter]
     */
    setBrightness : function(filter, dest, value) {
      var brightness = filter.find('.brightness');
      var _this = this;
      var filterId = filter.attr('id');
      //  if(value !== 0) {
      value *= 0.5;
      var intercept = value / 100;
      if(brightness.size() === 0) {
        filter.append(_this.createElementBrightness(intercept));
      } else {
        var bcArr = $(brightness).children().toArray();
        bcArr.forEach(function(a){
          $(a).attr('intercept', intercept);
        });
      }
      dest.attr('filter', 'url(#' + filterId + ')');
      /*
       } else {
           // brightness.remove();
           removeElement.call(this,brightness,filter,dest);
       }
       */
    },
    /**
     * 设置对比度
     * @param filter
     * @param dest
     * @param value
     * @param filterId
     */
    setContrast : function(filter, dest, value) {
      var contrast = filter.find('.contrast');
      var _this = this;
      var filterId = filter.attr('id');
      if(value !== 0) {
        value *= 0.6;
        var slope = (value * (1 < value ? 1 / 0.6 : 1) + 100) / 100;
        var intercept = -(0.5 * slope) + .5;
        if(contrast.size() === 0) {
          filter.append(_this.createElementContrast(slope, intercept));
        } else {
          var contrastArray = $(contrast).children().toArray();
          contrastArray.forEach(function(a){
            $(a).attr('intercept', intercept);
            $(a).attr('slope', slope);
          });
        }
        dest.attr('filter', 'url(#' + filterId + ')');

      }  else {
        removeElement.call(this,contrast,filter,dest);
      }

    },
    /**
     * 设置饱和度
     * @param filter
     * @param dest
     * @param value
     * @param filterId
     */
    setSaturation : function(filter, dest, value) {
      var saturation = filter.find('.saturation');
      var _this = this;
      var filterId = filter.attr('id');
      if(value !== 0) {
        if(value > 0) {
          value *= 0.8;
        }
        value = (value + 100) / 100;  224;
        value *= 1 >= value ? 1 : value;
        value = [.3086 + .6914 * value, .6094 - .6094 * value, .082 - .082 * value, 0, 0, .3086 - .3086 * value, .6094 + (1 - .6094) * value, .082 - .082 * value, 0, 0, .3086 - .3086 * value, .6094 - .6094 * value, .082 + .918 * value, 0, 0, 0, 0, 0, 1, 0];
        if(saturation.size() === 0) {
          filter.append(_this.createElementSaturation(value));
        } else {
          $(saturation).attr('values', value.join(" "));
        }
        dest.attr('filter', 'url(#' + filterId + ')');

      } else {
        removeElement.call(this,saturation,filter,dest);
      }

    },
    /**
     * 设置高斯模糊
     * @param filter
     * @param dest
     * @param value
     * @param filterId
     */
    setGaussianBlur : function(filter, dest, value) {
      var _this = this;
      var filterId = filter.attr('id');
      /*
          var blur = filter.find('.blur');
          var sharpen = filter.find('.sharpen');
          if(value > 0 && sharpen.size() > 0) {
              removeElement(sharpen);
          }
          if(value < 0 && blur.size() > 0) {
              removeElement(blur);
          }
          if(blur.size() === 0 && value > 0 || sharpen.size() === 0 && value < 0) {
              filter.append(_this.createElementGaussianBlur(value));
          }
          else {
              value *= 0.5;
              if (value < 0) {
                  value *= -1;
                  value = value / 100 * 4;
                  value = [0, -value, 0, -value, 4 * value + 1, -value, 0, -value, 0];
                  sharpen[0].setAttribute("kernelMatrix", value.join(" "));
              } else {
                  blur[0].setAttribute("stdDeviation", 0.125 * value);
              }
          }
          /*
          if(blur.size() !== 0) {
              removeElement(blur);
          } else if(sharpen.size() !== 0) {
              removeElement(sharpen);
          }
          //if(value !== 0) {
          dest.attr('filter', 'url(#' + filterId + ')');
          //}
          */
      var blur = filter.find('.blur');
      var sharpen = filter.find('.sharpen') ;
      if(value !== 0) {
        if(blur.size() !== 0) {
          removeElement.call(this,blur,filter,dest);
        } else if(sharpen.size() !== 0) {
          removeElement.call(this,sharpen,filter,dest);
        }
        value *= 0.5;
        filter.append(_this.createElementGaussianBlur(value));
        dest.attr('filter', 'url(#' + filterId + ')');

      } else {
        removeElement.call(this,blur,filter,dest);
        removeElement.call(this,sharpen,filter,dest);
      }
    },

    /**
     * 设置颜色值
     * @param filter
     * @param dest
     * @param value
     * @param filterId
     */
    setTint : function(filter, dest, value) {
      var tint = filter.find('.tint');
      var _this = this;
      var filterId = filter.attr('id');
      if(value !== 0) {
        if(tint.size() === 0) {
          filter.append(_this.createElementTint(value));
        } else {
          var a = mp(value + 100);
          var b = {
            r: a.color.r / 255,
            g: a.color.g / 255,
            b: a.color.b / 255
          };
          var c = a.Dm / 100 * 2;
          var tintArray = $(tint).children().toArray();
          tintArray.forEach(function(a){
            //a.tagName = feFuncR or feFuncG or feFuncB
            var intercept = b[a.tagName.substr(6).toLowerCase()] * c;
            $(a).attr('slope', 1 - c);
            $(a).attr('intercept', intercept);
          });
        }
        dest.attr('filter', 'url(#' + filterId + ')');

      } else {
        removeElement.call(this,tint,filter,dest);
      }

    },
    /**
     * 暗角效果
     * @param {[type]} filter   [description]
     * @param {[type]} dest     [description]
     * @param {[type]} value    [description]
     * @param {[type]} filterId [description]
     */
    setVignette : function(filter, dest, value) {
      var vignette = filter.parent().find('.vignette');
      var _this = this;
      var filterId = filter.attr('id');
      if(value !== 0) {
        value *= 0.7;
        if(vignette.size() === 0) {
          var vignette = _this.createElementVignette(value, filterId);
          // var rect = createElementRect(filter, vignette);
          // g.append(rect);
          $(".vignette").attr('fill', 'url(#' + vignette.getAttribute("id") + ')');
          filter.after(vignette);
          dest.attr('filter', 'url(#' + filterId + ')');
        }  else {
          var arr = $(vignette).children().toArray();
          $.each(arr, function(i, n){
            if(i === 0) {
              $(n).attr('stop-opacity', 0);
            } else {
              $(n).attr('stop-opacity', value/100);
            }
          });
        }
      } else {
        removeElement.call(this,vignette,filter,dest);
      }
    },
    /**
     * 负片冲印效果
     * @param {[type]} filter    [description]
     * @param {[type]} dest      [description]
     * @param {[type]} value     [description]
     * @param {[type]} filterStr [description]
     */
    setCrossProcess : function(filter, dest, value) {
      var crossProcess = filter.find('.crossProcess');
      var _this = this;
      var filterId = filter.attr('id');
      removeElement.call(this,crossProcess,filter,dest);
      if(value !== 0) {
        filter.find(".brightness").after(_this.createElementCrossProcess(value));
        dest.attr('filter', 'url(#' + filterId + ')');
      }
    }
  };






  function removeElement(element,filter,dest) {
    if (filter!=null&&filter!=undefined&&filter.children().size()<=1&&filter.find('.brightness')==null) {
      this.setBrightness(filter,dest,0);
    }
    if(element!=null&&element!=undefined&&element.size() !== 0) {
      element.remove();
    }
  }

  /**
   * copy from canva
   */
 export  function mp(a) {
    a -= 200 / 7;
    0 > a && (a = 200 + a);
    a = qf(360 * a / 200, 100, 50);
    return {
      color: {
        r: a[0],
        g: a[1],
        b: a[2]
      },
      Dm: 7
    }
  }

export    function qf(a, b, c) {
    a /= 360;
    b /= 100;
    c /= 100;
    if (0 == b) {
      c = b = a = c;
    } else {
      var d = .5 > c ? c * (1 + b) : c + b - c * b,
        e = 2 * c - d;
      c = zf(e, d, a + 1 / 3);
      b = zf(e, d, a);
      a = zf(e, d, a - 1 / 3);
    }
    return [Math.round(255 * c), Math.round(255 * b), Math.round(255 * a)]
  }

  function zf(a, b, c) {
    0 > c && (c += 1);
    1 < c && --c;
    return c < 1 / 6 ? a + 6 * (b - a) * c: .5 > c ? b: c < 2 / 3 ? a + (b - a) * (2 / 3 - c) * 6 : a
  }

export  function np(a) {
    function b(b) {
      return parseFloat((b * a / -100).toFixed(2))
    }
    if (0 < a) {
      var c = function(b) {
          return parseFloat((b * a / 100).toFixed(2))
        },
        d = [0, .2, 0, -.1, 0].map(c),
        e = [0, .1, 0, -.1, 0].map(c),
        c = [.2, 0, .2].map(c);
      return {
        red: [[0, 0], [.3, .3 - d[1]], [.7, .7 - d[3]], [1, 1]],
        green: [[0, 0], [.25, .25 - e[1]], [.75, .75 - e[3]], [1, 1]],
        blue: [[0, c[0]], [0 + 2 / 3 * .5, c[0] + 2 / 3 * (.5 - c[0])], [1 + 2 / 3 * -.5, 1 - c[2] + 2 / 3 * (.5 - (1 - c[2]))], [1, 1 - c[2]]]
      }
    }
    d = [0, .2, .5, -.05].map(b);
    e = [0, -.15, 0, 0].map(b);
    c = [0, -.01, 0, .3].map(b);
    return {
      red: [[0, 0], [.3, .3 - d[1]], [.7, .7 - d[2]], [.95, .95 - d[3]]],
      green: [[0, 0], [.25, .25 - e[1]], [.6, .6], [1, 1]],
      blue: [[0, 0], [.3, .3 - c[1]], [.5, .5], [1, 1 - c[3]]]
    }
  };

export   function Gp(a, b, c, d) {
    function e(a, b) {
      var c = a * a,
        d = 1 - a,
        e = d * d;
      return b[0] * e * d + 3 * b[1] * e * a + 3 * b[2] * d * c + b[3] * c * a
    }
    for (var g, h, k = 0,
           l = []; 1 > k;) g = e(k, [a.x, b.x, c.x, d.x]),
      h = e(k, [a.y, b.y, c.y, d.y]),
      l.push({
        x: g,
        y: h
      }),
      k += 5E-5;
    var m = [{
        x: a.x,
        y: a.y
      }],
      n = .05,
      p = null;
    l.forEach(function(a) {
      null !== p && a.x > n && (m.push(p), n += .05);
      p = a
    });
    m.push({
      x: d.x,
      y: d.y
    });
    return m
  };

