<template>
  <div class="leftPanel-filter">
    <div class="leftPanel-filter-preview">
      <div class="leftPanel-filter-preview-block" @click="setFilter(0)">
        <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g>
            <image :width="imgW" :height="imgH" xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="imgUrl"></image>
            <defs>
            </defs>
          </g>
        </svg>
        <span>原图</span>
      </div>
      <div class="leftPanel-filter-preview-block" @click="setFilter(1)">
        <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g>
            <image :width="imgW" :height="imgH" xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="imgUrl" filter="url(#_FILTER_1446105975000_627637a)"></image>
            <defs>
              <filter id="_FILTER_1446105975000_627637a"><feComponentTransfer class="brightness" color-interpolation-filters="sRGB">
                <feFuncR type="linear" slope="1" intercept="0.13"></feFuncR>
                <feFuncG type="linear" slope="1" intercept="0.13"></feFuncG>
                <feFuncB type="linear" slope="1" intercept="0.13"></feFuncB>
              </feComponentTransfer>
                <feComponentTransfer class="contrast" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="0.88" intercept="0.06"></feFuncR>
                  <feFuncG type="linear" slope="0.88" intercept="0.06"></feFuncG>
                  <feFuncB type="linear" slope="0.88" intercept="0.06"></feFuncB>
                </feComponentTransfer>
                <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" values="1.1270406016 -0.11197359360000014 -0.015067008000000007 0 0 -0.05670339840000005 1.0717704064 -0.015067008000000007 0 0 -0.05670339840000005 -0.11197359360000014 1.1686769920000002 0 0 0 0 0 1 0"></feColorMatrix>
                <feComponentTransfer color-interpolation-filters="sRGB" class="crossProcess">
                  <feFuncR type="table" tableValues="0 0.042894311913595856 0.08805220187499675 0.13501884094875122 0.18346159087614533 0.2330951277772592 0.283757670023888 0.33518667312496164 0.3872064523585553 0.43972421944968904 0.49249999999994787 0.5453565187225022 0.5982850045077768 0.6509934284181716 0.703397068441847 0.7553315544892982 0.8065475325630549 0.8569050739467025 0.9061446621172213 0.9539674885877562 1"></feFuncR>
                  <feFuncG type="table" tableValues="0 0.04534130461459596 0.09275673313791057 0.1415675850652696 0.19132598303966825 0.24183169187497675 0.29292425719549015 0.3443461897453286 0.3960609299880823 0.447994922364951 0.49999999999994504 0.5519467793935746 0.6038813820440947 0.6555971534028102 0.7070205613887715 0.7581150861022585 0.8086232883199216 0.858384793360186 0.9071994898486024 0.9546196853684459 1"></feFuncG>
                  <feFuncB type="table" tableValues="0.05 0.09495500000000083 0.1399999999999974 0.18499999999999245 0.22999999999998746 0.27499999999998254 0.3199999999999776 0.3649999999999726 0.40999999999996767 0.45499999999996266 0.4999999999999577 0.5449999999999529 0.589999999999948 0.6349999999999429 0.679999999999938 0.724999999999933 0.7699999999999282 0.8149999999999231 0.8599999999999182 0.9049999999999132 0.95"></feFuncB>
                </feComponentTransfer>
              </filter>
            </defs>
          </g>
        </svg>
        <span>胶片</span>
      </div>
      <div class="leftPanel-filter-preview-block" @click="setFilter(2)">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" version="1.1">
          <g>
            <image :width="imgW" :height="imgH" :xlink:href="imgUrl" filter="url(#_FILTER_1446105975000_627637b)"></image>
            <defs>
              <filter id="_FILTER_1446105975000_627637b">
                <feComponentTransfer class="brightness" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1" intercept="0.02"/>
                  <feFuncG type="linear" slope="1" intercept="0.02"/>
                  <feFuncB type="linear" slope="1" intercept="0.02"/>
                </feComponentTransfer>
                <feComponentTransfer color-interpolation-filters="sRGB" class="crossProcess">
                  <feFuncR type="table" tableValues="0 0.024383961307911803 0.056513092656247495 0.09497459574828243 0.13864380145662625 0.18657825472509934 0.23805866731566316 0.29233831095222546 0.3488071325566176 0.4069841678385449 0.46624999999994116 0.5260659489221744 0.5860902234292882 0.645656277950883 0.7043194268415989 0.7615205054613225 0.8165721108033615 0.8688532397976498 0.9175375079799835 0.961652398249286 1"/>
                  <feFuncG type="table" tableValues="0 0.03607199529291082 0.0783073565638659 0.12471513009982983 0.17405444464891312 0.225595528749976 0.27880180512252867 0.3331206431399314 0.38828436351120427 0.4440216459699473 0.4999999999999408 0.5559156626019652 0.6116538784204101 0.6668191757925659 0.7211402703593328 0.7743495434505512 0.8258944409599212 0.8752385074920932 0.9216521609449683 0.9638948129164969 1"/>
                  <feFuncB type="table" tableValues="0.18 0.21196800000000057 0.24399999999999814 0.2759999999999946 0.3079999999999911 0.33999999999998753 0.37199999999998407 0.4039999999999805 0.43599999999997696 0.46799999999997344 0.4999999999999699 0.5319999999999665 0.563999999999963 0.5959999999999595 0.6279999999999559 0.6599999999999524 0.6919999999999489 0.7239999999999454 0.7559999999999418 0.7879999999999382 0.8200000000000001"/>
                </feComponentTransfer>
                <feComponentTransfer class="contrast" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1.28" intercept="-0.14"/>
                  <feFuncG type="linear" slope="1.28" intercept="-0.14"/>
                  <feFuncB type="linear" slope="1.28" intercept="-0.14"/>
                </feComponentTransfer>
                <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" values="0.716526 0.24985400000000002 0.033620000000000004 0 0 0.126526 0.839854 0.033620000000000004 0 0 0.126526 0.24985400000000002 0.62362 0 0 0 0 0 1 0"/>
                <feComponentTransfer class="tint" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="0.86" intercept="0.034039215686274514"/>
                  <feFuncG type="linear" slope="0.86" intercept="0"/>
                  <feFuncB type="linear" slope="0.86" intercept="0.14"/>
                </feComponentTransfer>
              </filter>
            </defs>
          </g>
        </svg>
        <span>蓝调</span>
      </div>
      <div class="leftPanel-filter-preview-block" @click="setFilter(3)">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" version="1.1">
          <g>
            <image :width="imgW" :height="imgH" :xlink:href="imgUrl" filter="url(#_FILTER_1446105975000_627637c)"></image>
            <defs>
              <filter id="_FILTER_1446105975000_627637c">
                <feComponentTransfer class="brightness" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1" intercept="0.05"/>
                  <feFuncG type="linear" slope="1" intercept="0.05"/>
                  <feFuncB type="linear" slope="1" intercept="0.05"/>
                </feComponentTransfer>
                <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" values="1.2389478399999998 -0.21060864 -0.028339199999999995 0 0 -0.10665215999999994 1.13499136 -0.028339199999999995 0 0 -0.10665215999999994 -0.21060864 1.3172608000000001 0 0 0 0 0 1 0"/>
                <feComponentTransfer class="tint" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="0.86" intercept="0.034039215686274514"/>
                  <feFuncG type="linear" slope="0.86" intercept="0"/>
                  <feFuncB type="linear" slope="0.86" intercept="0.14"/>
                </feComponentTransfer>
                <feComponentTransfer class="contrast" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1.04" intercept="-0.020000000000000018"/>
                  <feFuncG type="linear" slope="1.04" intercept="-0.020000000000000018"/>
                  <feFuncB type="linear" slope="1.04" intercept="-0.020000000000000018"/>
                </feComponentTransfer>
                <feConvolveMatrix order="3" kernelMatrix="0 -0.1 0 -0.1 1.4 -0.1 0 -0.1 0" class="sharpen"/>
                <feComponentTransfer color-interpolation-filters="sRGB" class="crossProcess">
                  <feFuncR type="table" tableValues="0 0.027225215144335596 0.06134146187499738 0.10108612837467223 0.14545871372286612 0.19361984200701934 0.2449376778840671 0.2987415964044996 0.354489831529292 0.4117624978653045 0.46999999999994224 0.5287206690380157 0.5876353485890495 0.6461367178562443 0.7038371395784802 0.7602400825117923 0.8147276560114709 0.8667553905409213 0.915587085479284 0.9603574880290443 1"/>
                  <feFuncG type="table" tableValues="0 0.03761688017985835 0.08071558599287335 0.1275238725940698 0.17693303438070568 0.2283015559374761 0.28115554713468893 0.33499156757416426 0.38958045792401724 0.44468385870244787 0.4999999999999415 0.5552541820672334 0.6103584623576908 0.6649488387276066 0.7187869855309057 0.7716438005591689 0.823015915519921 0.8724295551367753 0.9192433824289072 0.9623489583251551 1"/>
                  <feFuncB type="table" tableValues="0.16 0.1939660000000006 0.22799999999999798 0.26199999999999424 0.2959999999999905 0.32999999999998675 0.363999999999983 0.39799999999997926 0.43199999999997546 0.46599999999997166 0.49999999999996797 0.5339999999999644 0.5679999999999606 0.6019999999999569 0.6359999999999532 0.6699999999999495 0.7039999999999457 0.7379999999999418 0.7719999999999383 0.8059999999999344 0.84"/>
                </feComponentTransfer>
              </filter>
            </defs>
          </g>
        </svg>
        <span>日系</span>
      </div>
      <div class="leftPanel-filter-preview-block" @click="setFilter(4)">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" version="1.1">
          <g>
            <image :width="imgW" :height="imgH" :xlink:href="imgUrl" filter="url(#_FILTER_1446105975000_627637d)"></image>
            <defs>
              <filter id="_FILTER_1446105975000_627637d">
                <feComponentTransfer class="brightness" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1" intercept="0.05"/>
                  <feFuncG type="linear" slope="1" intercept="0.05"/>
                  <feFuncB type="linear" slope="1" intercept="0.05"/>
                </feComponentTransfer>
                <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" values="1.0679673856000003 -0.05990645760000013 -0.008060928000000009 0 0 -0.030336614400000073 1.0383975424 -0.008060928000000009 0 0 -0.030336614400000073 -0.05990645760000013 1.0902430720000003 0 0 0 0 0 1 0"/>
                <feComponentTransfer class="contrast" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1.45" intercept="-0.22499999999999998"/>
                  <feFuncG type="linear" slope="1.45" intercept="-0.22499999999999998"/>
                  <feFuncB type="linear" slope="1.45" intercept="-0.22499999999999998"/>
                </feComponentTransfer>
                <feConvolveMatrix order="3" kernelMatrix="0 -0.08 0 -0.08 1.32 -0.08 0 -0.08 0" class="sharpen"/>
                <feComponentTransfer color-interpolation-filters="sRGB" class="crossProcess">
                  <feFuncR type="table" tableValues="0 0.034370550404324476 0.07356709421874709 0.11668424306958178 0.16301685407742575 0.21197036593149926 0.2631206383186762 0.3159768167681392 0.3701583554405322 0.42538922936941026 0.4812499999999448 0.5373923583749787 0.5936496290284928 0.6495521087020877 0.7048439302312034 0.7591728233378888 0.8120808969387266 0.8631986217168884 0.9119959296193195 0.9578522192484812 1"/>
                  <feFuncG type="table" tableValues="0 0.04070664995375341 0.08553204485088825 0.13314135758254975 0.18269021384429074 0.23371361031247637 0.2858630311590094 0.33873341644263 0.3921726467496433 0.4460082841674492 0.49999999999994293 0.5539312209977698 0.6077676302322523 0.6612081645976879 0.7140804158740521 0.7662323147764049 0.8172588646399214 0.8668116504261396 0.9144258253967853 0.9592572491424713 1"/>
                  <feFuncB type="table" tableValues="0.11 0.14896100000000073 0.18799999999999772 0.22699999999999346 0.26599999999998913 0.30499999999998484 0.34399999999998054 0.38299999999997625 0.42199999999997195 0.46099999999996766 0.4999999999999634 0.5389999999999592 0.5779999999999549 0.6169999999999505 0.6559999999999463 0.6949999999999421 0.7339999999999378 0.7729999999999334 0.8119999999999292 0.8509999999999248 0.89"/>
                </feComponentTransfer>
              </filter>
            </defs>
          </g>
        </svg>
        <span>午茶</span>
      </div>
      <div class="leftPanel-filter-preview-block" @click="setFilter(5)">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" version="1.1">
          <g>
            <image :width="imgW" :height="imgH" :xlink:href="imgUrl" filter="url(#_FILTER__FILTER_1445502446000e)"></image>
            <defs>
              <filter id="_FILTER__FILTER_1445502446000e">
                <feComponentTransfer class="brightness" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1" intercept="0.075"/>
                  <feFuncG type="linear" slope="1" intercept="0.075"/>
                  <feFuncB type="linear" slope="1" intercept="0.075"/>
                </feComponentTransfer>
                <feComponentTransfer class="contrast" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="0.904" intercept="0.04799999999999999"/>
                  <feFuncG type="linear" slope="0.904" intercept="0.04799999999999999"/>
                  <feFuncB type="linear" slope="0.904" intercept="0.04799999999999999"/>
                </feComponentTransfer>
                <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" values="0.6543 0.3047 0.041 0 0 0.1543 0.8047 0.041 0 0 0.1543 0.3047 0.541 0 0 0 0 0 1 0"/>
              </filter>
            </defs>
          </g>
        </svg>
        <span>褪色</span>
      </div>
      <div class="leftPanel-filter-preview-block" @click="setFilter(6)">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" version="1.1">
          <g>
            <image :width="imgW" :height="imgH" :xlink:href="imgUrl" filter="url(#_FILTER_1446105975000_627637f)"></image>
            <defs>
              <filter id="_FILTER_1446105975000_627637f">
                <feComponentTransfer class="brightness" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1" intercept="0.315"/>
                  <feFuncG type="linear" slope="1" intercept="0.315"/>
                  <feFuncB type="linear" slope="1" intercept="0.315"/>
                </feComponentTransfer>
                <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" values="0.937774 0.05484599999999995 0.007379999999999998 0 0 0.027773999999999965 0.9648460000000001 0.007379999999999998 0 0 0.027773999999999965 0.05484599999999995 0.91738 0 0 0 0 0 1 0"/>
                <feComponentTransfer class="contrast" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="0.904" intercept="0.04799999999999999"/>
                  <feFuncG type="linear" slope="0.904" intercept="0.04799999999999999"/>
                  <feFuncB type="linear" slope="0.904" intercept="0.04799999999999999"/>
                </feComponentTransfer>
                <feConvolveMatrix order="3" kernelMatrix="0 -0.16 0 -0.16 1.6400000000000001 -0.16 0 -0.16 0" class="sharpen"/>
                <feComponentTransfer color-interpolation-filters="sRGB" class="crossProcess">
                  <feFuncR type="table" tableValues="0 0.043293712119840844 0.08659043873286446 0.13010180910857197 0.17387198360547945 0.2180587051319217 0.2627119686758163 0.30798952599165086 0.35392715264684527 0.4007609452794194 0.44850190941845103 0.49736162153322744 0.5475141782432337 0.5991419239552747 0.652485362238648 0.7078443684053435 0.7656313265152164 0.8263733511732863 0.8908200202623183 0.96"/>
                  <feFuncG type="table" tableValues="0 0.055075179969495874 0.1086974153199949 0.16109334558498897 0.21250425646686305 0.26318798773310215 0.3132795431398761 0.3628751347051801 0.412126131356874 0.46109531735428777 0.5098496347483115 0.5585634290643252 0.6071616994949338 0.6557767761850821 0.7044419260824856 0.7532476920549136 0.8021225190222517 0.8512178834148647 0.9005796145292676 0.9501384039975251 1"/>
                  <feFuncB type="table" tableValues="0 0.04995364812250095 0.0998806922892762 0.14968022006467338 0.19922267671708807 0.2484458138657402 0.29727072558120726 0.34572014353246894 0.3936749747895205 0.44117838343745674 0.48822393164381 0.5348474406055854 0.5810544822637956 0.6268846584374279 0.6723864463544772 0.7175819407057888 0.7624749612811826 0.8071757171273937 0.8516236411923845 0.8958753473971326 0.94"/>
                </feComponentTransfer>
              </filter>
            </defs>
          </g>
        </svg>
        <span>校园</span>
      </div>
      <div class="leftPanel-filter-preview-block" @click="setFilter(7)">

        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" version="1.1">
          <g>
            <image :width="imgW" :height="imgH" :xlink:href="imgUrl" filter="url(#_FILTER_1446105975000_627637g)"></image>
            <defs>
              <filter id="_FILTER_1446105975000_627637g">
                <feComponentTransfer class="brightness" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1" intercept="0.05"/>
                  <feFuncG type="linear" slope="1" intercept="0.05"/>
                  <feFuncB type="linear" slope="1" intercept="0.05"/>
                </feComponentTransfer>
                <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" values="1.2134600704000003 -0.18814371840000021 -0.025316352000000028 0 0 -0.09527592960000009 1.1205922816 -0.025316352000000028 0 0 -0.09527592960000009 -0.18814371840000021 1.2834196480000004 0 0 0 0 0 1 0"/>
                <feComponentTransfer class="contrast" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1.14" intercept="-0.06999999999999995"/>
                  <feFuncG type="linear" slope="1.14" intercept="-0.06999999999999995"/>
                  <feFuncB type="linear" slope="1.14" intercept="-0.06999999999999995"/>
                </feComponentTransfer>
                <feComponentTransfer class="tint" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="0.86" intercept="0.14"/>
                  <feFuncG type="linear" slope="0.86" intercept="0.10705882352941176"/>
                  <feFuncB type="linear" slope="0.86" intercept="0"/>
                </feComponentTransfer>
                <feComponentTransfer color-interpolation-filters="sRGB" class="crossProcess">
                  <feFuncR type="table" tableValues="0 0.04143148432645458 0.0854833079687468 0.13164379150662137 0.17953327505406544 0.2288277784166193 0.2793327307260868 0.33075802366587037 0.3829033263926639 0.4356541479991025 0.4887499999999475 0.5419942696172217 0.5953609743878561 0.648538917383051 0.7014257032628863 0.7538379677641411 0.8055053820520179 0.8562661442572781 0.9058349729757871 0.9538829369278359 1"/>
                  <feFuncG type="table" tableValues="0 0.04534130461459596 0.09275673313791057 0.1415675850652696 0.19132598303966825 0.24183169187497675 0.29292425719549015 0.3443461897453286 0.3960609299880823 0.447994922364951 0.49999999999994504 0.5519467793935746 0.6038813820440947 0.6555971534028102 0.7070205613887715 0.7581150861022585 0.8086232883199216 0.858384793360186 0.9071994898486024 0.9546196853684459 1"/>
                  <feFuncB type="table" tableValues="0.06 0.10395600000000081 0.14799999999999747 0.19199999999999262 0.23599999999998778 0.27999999999998293 0.3239999999999781 0.36799999999997324 0.4119999999999684 0.4559999999999635 0.4999999999999587 0.543999999999954 0.5879999999999491 0.6319999999999442 0.6759999999999393 0.7199999999999346 0.7639999999999298 0.8079999999999248 0.85199999999992 0.8959999999999151 0.94"/>
                </feComponentTransfer>
              </filter>
            </defs>
          </g>
        </svg>
        <span>盛夏</span>
      </div>
      <div class="leftPanel-filter-preview-block" @click="setFilter(8)">

        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" version="1.1">
          <g>
            <image :width="imgW" :height="imgH" :xlink:href="imgUrl" filter="url(#_FILTER_1446105975000_627637h)"></image>
            <defs>
              <filter id="_FILTER_1446105975000_627637h">
                <feComponentTransfer class="brightness" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1" intercept="0.27"/>
                  <feFuncG type="linear" slope="1" intercept="0.27"/>
                  <feFuncB type="linear" slope="1" intercept="0.27"/>
                </feComponentTransfer>
                <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" values="0.6543 0.3047 0.041 0 0 0.1543 0.8047 0.041 0 0 0.1543 0.3047 0.541 0 0 0 0 0 1 0"/>
                <feComponentTransfer class="tint" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="0.86" intercept="0.14"/>
                  <feFuncG type="linear" slope="0.86" intercept="0"/>
                  <feFuncB type="linear" slope="0.86" intercept="0.03184313725490196"/>
                </feComponentTransfer>
                <feConvolveMatrix order="3" kernelMatrix="0 -0.38 0 -0.38 2.52 -0.38 0 -0.38 0" class="sharpen"/>
                <feComponentTransfer class="contrast" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1.13" intercept="-0.06499999999999995"/>
                  <feFuncG type="linear" slope="1.13" intercept="-0.06499999999999995"/>
                  <feFuncB type="linear" slope="1.13" intercept="-0.06499999999999995"/>
                </feComponentTransfer>
                <feComponentTransfer color-interpolation-filters="sRGB" class="crossProcess">
                  <feFuncR type="table" tableValues="0 0.032907722817183196 0.07099820031249716 0.1133091936274519 0.15908853825534588 0.20770301657085935 0.258695699020875 0.31154816730904794 0.3658552294746408 0.4213191579188238 0.4774999999999444 0.5340301092696982 0.5907255989085722 0.6470975976669671 0.7028725650522427 0.7576792366127318 0.8110387464276897 0.8625596920274641 0.9116862404778853 0.9577676675885609 1"/>
                  <feFuncG type="table" tableValues="0 0.04070664995375341 0.08553204485088825 0.13314135758254975 0.18269021384429074 0.23371361031247637 0.2858630311590094 0.33873341644263 0.3921726467496433 0.4460082841674492 0.49999999999994293 0.5539312209977698 0.6077676302322523 0.6612081645976879 0.7140804158740521 0.7662323147764049 0.8172588646399214 0.8668116504261396 0.9144258253967853 0.9592572491424713 1"/>
                  <feFuncB type="table" tableValues="0.12 0.15796200000000069 0.19599999999999784 0.23399999999999363 0.2719999999999894 0.30999999999998523 0.347999999999981 0.3859999999999768 0.4239999999999726 0.46199999999996844 0.49999999999996425 0.5379999999999602 0.575999999999956 0.6139999999999518 0.6519999999999477 0.6899999999999434 0.7279999999999394 0.7659999999999351 0.8039999999999309 0.8419999999999267 0.88"/>
                </feComponentTransfer>
              </filter>
            </defs>
          </g>
        </svg>
        <span>怀旧</span>
      </div>
      <div class="leftPanel-filter-preview-block" @click="setFilter(9)">

        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" version="1.1">
          <g>
            <image :width="imgW" :height="imgH" :xlink:href="imgUrl" filter="url(#_FILTER_1446105975000_627637i)"></image>
            <defs>
              <filter id="_FILTER_1446105975000_627637i">
                <feComponentTransfer class="brightness" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1" intercept="0.055"/>
                  <feFuncG type="linear" slope="1" intercept="0.055"/>
                  <feFuncB type="linear" slope="1" intercept="0.055"/>
                </feComponentTransfer>
                <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" values="0.875548 0.10969200000000001 0.01476000000000001 0 0 0.055547999999999986 0.929692 0.01476000000000001 0 0 0.055547999999999986 0.10969200000000001 0.83476 0 0 0 0 0 1 0"/>
                <feComponentTransfer class="tint" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="0.86" intercept="0"/>
                  <feFuncG type="linear" slope="0.86" intercept="0.14"/>
                  <feFuncB type="linear" slope="0.86" intercept="0.07905882352941176"/>
                </feComponentTransfer>
                <feComponentTransfer class="contrast" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="0.9159999999999999" intercept="0.04200000000000004"/>
                  <feFuncG type="linear" slope="0.9159999999999999" intercept="0.04200000000000004"/>
                  <feFuncB type="linear" slope="0.9159999999999999" intercept="0.04200000000000004"/>
                </feComponentTransfer>
                <feComponentTransfer color-interpolation-filters="sRGB" class="crossProcess">
                  <feFuncR type="table" tableValues="0 0.030066468980759393 0.06616983109374726 0.10719766100106207 0.15227362598910596 0.20066142928893932 0.251816688452471 0.3051448818567738 0.3601725305019664 0.41654082789206415 0.47374999999994327 0.5313753891538568 0.5891804737488109 0.6466171577616058 0.7033548523153614 0.7589596595622621 0.8128832012195804 0.8646575412841927 0.9136366629785847 0.9590625778088027 1"/>
                  <feFuncG type="table" tableValues="0 0.039161765066805874 0.0831238154218808 0.1303326150883098 0.17981162411249818 0.23100758312497624 0.2835092891468492 0.33686249200839713 0.3908765523368303 0.44534607143494853 0.49999999999994227 0.5545927015325016 0.6090630462949715 0.6630785016626473 0.7164337007024789 0.7689380576677869 0.8201373900799213 0.8696206027814575 0.9168346039128463 0.9608031037338133 1"/>
                  <feFuncB type="table" tableValues="0.14 0.17596400000000065 0.2119999999999979 0.24799999999999395 0.2839999999999899 0.319999999999986 0.35599999999998205 0.3919999999999781 0.42799999999997407 0.4639999999999701 0.49999999999996614 0.5359999999999623 0.5719999999999583 0.6079999999999544 0.6439999999999504 0.6799999999999464 0.7159999999999425 0.7519999999999385 0.7879999999999346 0.8239999999999306 0.86"/>
                </feComponentTransfer>
              </filter>
            </defs>
          </g>
        </svg>
        <span>森林</span>
      </div>
      <div class="leftPanel-filter-preview-block" @click="setFilter(10)">

        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" version="1.1">
          <g>
            <image :width="imgW" :height="imgH" :xlink:href="imgUrl" filter="url(#_FILTER_1446105975000_627637j)"></image>
            <defs>
              <filter id="_FILTER_1446105975000_627637j">
                <feComponentTransfer class="brightness" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1" intercept="0"/>
                  <feFuncG type="linear" slope="1" intercept="0"/>
                  <feFuncB type="linear" slope="1" intercept="0"/>
                </feComponentTransfer>
                <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" values="0.806408 0.170632 0.02296 0 0 0.08640800000000001 0.890632 0.02296 0 0 0.08640800000000001 0.170632 0.74296 0 0 0 0 0 1 0"/>
                <feComponentTransfer class="tint" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="0.86" intercept="0.14"/>
                  <feFuncG type="linear" slope="0.86" intercept="0"/>
                  <feFuncB type="linear" slope="0.86" intercept="0.006588235294117647"/>
                </feComponentTransfer>
                <feComponentTransfer class="contrast" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1.55" intercept="-0.275"/>
                  <feFuncG type="linear" slope="1.55" intercept="-0.275"/>
                  <feFuncB type="linear" slope="1.55" intercept="-0.275"/>
                </feComponentTransfer>
                <feConvolveMatrix order="3" kernelMatrix="0 -0.28 0 -0.28 2.12 -0.28 0 -0.28 0" class="sharpen"/>
                <feComponentTransfer color-interpolation-filters="sRGB" class="crossProcess">
                  <feFuncR type="table" tableValues="0 0.042894311913595856 0.08805220187499675 0.13501884094875122 0.18346159087614533 0.2330951277772592 0.283757670023888 0.33518667312496164 0.3872064523585553 0.43972421944968904 0.49249999999994787 0.5453565187225022 0.5982850045077768 0.6509934284181716 0.703397068441847 0.7553315544892982 0.8065475325630549 0.8569050739467025 0.9061446621172213 0.9539674885877562 1"/>
                  <feFuncG type="table" tableValues="0 0.04534130461459596 0.09275673313791057 0.1415675850652696 0.19132598303966825 0.24183169187497675 0.29292425719549015 0.3443461897453286 0.3960609299880823 0.447994922364951 0.49999999999994504 0.5519467793935746 0.6038813820440947 0.6555971534028102 0.7070205613887715 0.7581150861022585 0.8086232883199216 0.858384793360186 0.9071994898486024 0.9546196853684459 1"/>
                  <feFuncB type="table" tableValues="0.05 0.09495500000000083 0.1399999999999974 0.18499999999999245 0.22999999999998746 0.27499999999998254 0.3199999999999776 0.3649999999999726 0.40999999999996767 0.45499999999996266 0.4999999999999577 0.5449999999999529 0.589999999999948 0.6349999999999429 0.679999999999938 0.724999999999933 0.7699999999999282 0.8149999999999231 0.8599999999999182 0.9049999999999132 0.95"/>
                </feComponentTransfer>
              </filter>
            </defs>
          </g>
        </svg>
        <span>玫瑰</span>
      </div>
      <div class="leftPanel-filter-preview-block" @click="setFilter(11)">

        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" version="1.1">
          <g>
            <image :width="imgW" :height="imgH" :xlink:href="imgUrl" filter="url(#_FILTER_1446105975000_627637k)"></image>
            <defs>
              <filter id="_FILTER_1446105975000_627637k">
                <feComponentTransfer class="brightness" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1" intercept="0"/>
                  <feFuncG type="linear" slope="1" intercept="0"/>
                  <feFuncB type="linear" slope="1" intercept="0"/>
                </feComponentTransfer>
                <feComponentTransfer class="contrast" color-interpolation-filters="sRGB">
                  <feFuncR type="linear" slope="1.2" intercept="-0.09999999999999998"/>
                  <feFuncG type="linear" slope="1.2" intercept="-0.09999999999999998"/>
                  <feFuncB type="linear" slope="1.2" intercept="-0.09999999999999998"/>
                </feComponentTransfer>
                <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" values="0.3086 0.6094 0.082 0 0 0.3086 0.6094 0.082 0 0 0.3086 0.6094 0.082 0 0 0 0 0 1 0"/>
              </filter>
            </defs>
          </g>
        </svg>
        <span>黑白</span>
      </div>
    </div>
    <div class="leftPanel-filter-set">
      <dragBar
        class="leftPanel-filter-set-dragBar"
        title="亮度"
        :type="2"
        :data="inFilters['brightness']"
        @change="e=>{$set(filters,'brightness',e)}"
        @fin="fin"
      ></dragBar>
      <dragBar
        class="leftPanel-filter-set-dragBar"
        title="对比度"
        :type="2"
        :data="inFilters['contrast']"
        @change="e=>{$set(filters,'contrast',e)}"
        @fin="fin"
      ></dragBar>
      <dragBar
        class="leftPanel-filter-set-dragBar"
        title="饱和度"
        :type="2"
        :data="inFilters['saturation']"
        @change="e=>{$set(filters,'saturation',e)}"
        @fin="fin"
      ></dragBar>
      <dragBar
        class="leftPanel-filter-set-dragBar"
        title="色调"
        :type="2"
        :data="inFilters['tint']"
        @change="e=>{$set(filters,'tint',e)}"
        @fin="fin"
      ></dragBar>
      <dragBar
        class="leftPanel-filter-set-dragBar"
        title="模糊"
        :type="2"
        :data="inFilters['gaussianBlur']"
        @change="e=>{$set(filters,'gaussianBlur',e)}"
        @fin="fin"
      ></dragBar>
      <dragBar
        class="leftPanel-filter-set-dragBar"
        title="负片冲印效果"
        :type="2"
        :data="inFilters['crossProcess']"
        @change="e=>{$set(filters,'crossProcess',e)}"
        @fin="fin"
      ></dragBar>
    </div>
  </div>
</template>
<script>
	import dragBar from './comp/dragBar.vue'
	import test from './comp/test.png'
	import imgCtrl from 'dataBus/img'
	import svgFrameCtrl from 'dataBus/svgFrame'
  import {mapGetters,mapActions} from 'vuex'
  import leftPanelCtrl from 'dataBus/leftPanel'
	import dataHandle from 'common/dataHandle'

	let {setFilter,getImgUrl,getFilter}=imgCtrl
	let {getSvgFrameFilterImg}=svgFrameCtrl
  let {setShowFilter}=leftPanelCtrl

	let defaultFilter=[
		{brightness:0,contrast:0,saturation:0,tint:0,gaussianBlur:0,crossProcess:0},
		{brightness:26,contrast:-20,saturation:11,tint:0,gaussianBlur:0,crossProcess:27},
		{brightness:4,contrast:28,saturation:-41,tint:70,gaussianBlur:0,crossProcess:90},
		{brightness:10,contrast:4,saturation:20,tint:70,gaussianBlur:-5,crossProcess:78},
		{brightness:10,contrast:45,saturation:6,tint:0,gaussianBlur:-4,crossProcess:55},
		{brightness:15,contrast:-16,saturation:-50,tint:0,gaussianBlur:0,crossProcess:0},
		{brightness:63,contrast:-16,saturation:-9,tint:0,gaussianBlur:-8,crossProcess:21},
		{brightness:10,contrast:14,saturation:18,tint:-46,gaussianBlur:0,crossProcess:30},
		{brightness:54,contrast:13,saturation:-50,tint:-79,gaussianBlur:-19,crossProcess:59},
		{brightness:11,contrast:-14,saturation:-18,tint:14,gaussianBlur:0,crossProcess:69},
		{brightness:0,contrast:55,saturation:-28,tint:-73,gaussianBlur:-14,crossProcess:27},
		{brightness:0,contrast:20,saturation:-100,tint:0,gaussianBlur:0,crossProcess:0}
	]

	export default {
		name:'leftPanel-filter',
		data(){
			return{
//				imgUrl:test,
				imgH:0,
				imgW:0,
				filters:{brightness:0,contrast:0,saturation:0,tint:0,gaussianBlur:0,crossProcess:0},
        inFilters:null
			}
		},
		components:{
			dragBar
		},
		methods:{
			setFilter(i){
				setFilter(JSON.parse(JSON.stringify(defaultFilter[i])))
				this.inFilters=JSON.parse(JSON.stringify(defaultFilter[i]))
				this.filters=JSON.parse(JSON.stringify(defaultFilter[i]))
				dataHandle.commit('element',{
					pageIndex:this.focusPageIndex,
					eleIndex:this.focusElemIndex,
					eventType:1,
					key:'filter',
					value:defaultFilter[i]
				}).push()
			},
      fin(){
	      dataHandle.push()
      },
//      getImgUrl(){
//      	if(this.focusElemType==='svgFrame'){
//          return getSvgFrameFilterImg()
//        }else if(this.focusElemType==='img'){
//		      return getImgUrl()
//        }
//      }
		},
		watch:{
			filters:{
				handler(v){
					setFilter(v)
					this.inFilters=getFilter()
					this.filters=getFilter()
					dataHandle.commit('element',{
						pageIndex:this.focusPageIndex,
						eleIndex:this.focusElemIndex,
						eventType:1,
						key:'filter',
						value:v
					})
				},
				deep:true
			},
			focusElemIndex(){
				setShowFilter(false)
//				filter
      }
		},
    computed:{
      ...mapGetters({
	      focusPageIndex:'getFocusPageIndex',
	      focusElemIndex:'getFocusElemIndex',
	      focusElemType:'getFocusElemType',
      }),
      imgUrl(){
	      if(this.focusElemType==='svgFrame'){
		      return getSvgFrameFilterImg()
	      }else if(this.focusElemType==='img'||this.focusElemType==='background'){
		      return getImgUrl()
	      }
      }
    },
		beforeMount(){
			this.inFilters=getFilter()||{brightness:0,contrast:0,saturation:0,tint:0,gaussianBlur:0,crossProcess:0}
			this.filters=getFilter()||{brightness:0,contrast:0,saturation:0,tint:0,gaussianBlur:0,crossProcess:0}

      let img=new Image();
     
      img.src=this.imgUrl
    
			img.onload=e=>{
				let scale=img.width/img.height
				if(scale<1){
					this.imgW=63
					this.imgH=63/scale
				}else {
					this.imgH=63
					this.imgW=63*scale
				}
			}
		}

	}
</script>
<style lang="less" scoped>
  @import "../common";

  .leftPanel-filter{
    width: 312px;
    height: 100%;
    padding:16px;
    box-sizing: border-box;
    background: #F8F8F8;
    box-shadow: 0 0 4px 0 rgba(0,0,0,.16);

    .leftPanel-filter-preview{
      margin: 16px 0;

      &:after{
        content: '';
        clear: both;
        display: block;
      }

      .leftPanel-filter-preview-block{
        float: left;
        width: 63px;
        height: 63px;
        margin: 0 8px 8px 0;
        position: relative;
        cursor: pointer;

        &:hover{
          outline: 1px solid #07AEFC;
        }

        &:nth-child(4n){
          margin: 0 0 8px 0;
        }

        &>span{
          position: absolute;
          width: 100%;
          display: block;
          height:24px;
          color: #FFFFFF;
          font-size:14px;
          line-height: 24px;
          background: rgba(0,0,0,.2);
          text-align: center;
          left: 0;
          bottom:0;
        }
      }
    }

    .leftPanel-filter-set{
      width:280px;
      height: 322px;
      background: #FFFFFF;
      padding: 1px 14px;
      box-sizing: border-box;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,.08);

      .leftPanel-filter-set-dragBar{
        margin: 16px 0;
      }
    }
  }
</style>