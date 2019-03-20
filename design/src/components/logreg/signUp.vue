<template>
  <div class="sign-up-page">
    <!--第三方注册页-->
    <div class="thirdparty-reg" v-if="thirdPartyRegShow">
      <img class="ckt-logo" src="./img/ckt_logo_for_logreg.svg">
      <p class="use-thirdparty-tips">使用第三方账号注册</p>
      <div class="thirdparty-container">
        <span class="qq-icon thirdparty-icon" @click="qqLogin"></span>
        <span class="weixin-icon thirdparty-icon" @click="wechatLogin"></span>
        <span class="weibo-icon thirdparty-icon" @click="weiboLogin"></span>
      </div>
      <div class="invite-container">
        <input title="输入邀请码"
               v-model="inviteCode"
               placeholder="点击输入邀请码（可不填）"
               @focus="focusVInput=true"
               @blur="handleInviteCodeBlur">
        <div class="info-icon" :class="{focus: focusVInput}">
          <div class="tips">
            <p>填写完邀请码，可获得会员奖励</p>
            <p>注册后邀请别人也可获取奖励</p>
          </div>
        </div>
        <p class="code-invalid"><span v-show="codeInvalid">该邀请码不存在</span></p>
      </div>
      <span class="use-default-way" @click="showReg">使用手机号注册</span>
      <p class="to-login">已有账号？<span @click="showWhat(1)">立即登录>></span></p>
    </div>
    <!--账号注册起始页-->
    <div class="sign-up-first" v-if="signUpFirstDisplay">
      <div class="go-back">
        <span @click="showReg"><span class="sprite go-back-icon"></span>使用第三方账号注册</span>
      </div>
      <div class="tab">注册</div>
      <div class="sign-up">
        <div class="input">
          <sinput
              placeholder="请输入手机号"
              width="100%"
              name="tel"
              :isAppClick="isAppClick"
              @inputResult="checkInputState(arguments,'signUpUsr')"
              @inputValue="getInputUsr"
              @submitInfo="submitInfo"
          >
          </sinput>

          <sinput
              placeholder="输入图形验证码"
              width="100%"
              name="yzm"
              maxlength="4"
              :emptyValue="vcodeEmpty"
              @inputResult="checkInputState(arguments,'signUpYzm')"
              @inputAnotherValue="getInputVcode"
              @submitInfo="submitInfo"
          >
            <div class="input-inner">
              <div class="img" @click="getVcode" style="cursor: pointer">
                <img :src="vCodeImgUrl" alt="图形验证码" @click="getVcode">
              </div>
            </div>
          </sinput>

          <!--手机注册专有Start-->
          <sinput
              placeholder="输入短信验证码"
              width="100%"
              name="yzm"
              maxlength="4"
              @inputResult="checkInputState(arguments,'telSignUpYzm')"
              @inputValue="getInputSmsVcode"
              @submitInfo="submitInfo"
          >
            <div class="input-inner">
              <div class="get-vcode" :class="{bePointer:!disablePostSms}" @click="getCheckNum">
                <span v-if="getCheckNumCount==0">获取短信验证码</span>
                <span v-else style="cursor: wait">{{getCheckNumCount}}s后重新获取</span>
              </div>
            </div>
          </sinput>
          <!--手机注册专有End-->
        </div>
        <!--邀请码输入框START-->
        <div class="invite-container">
          <input title="输入邀请码"
                 placeholder="点击输入邀请码（可不填）"
                 v-model="inviteCode"
                 @focus="focusVInput=true"
                 @blur="handleInviteCodeBlur"
          >
          <div class="info-icon" :class="{focus: focusVInput}">
            <div class="tips">
              <p>填写完邀请码，可获得会员奖励</p>
              <p>注册后邀请别人也可获取奖励</p>
            </div>
          </div>
          <p class="code-invalid"><span v-show="codeInvalid">该邀请码不存在</span></p>
        </div>
        <!--邀请码输入框END-->
        <div class="next-step-button" :class="nextBtnActive" @click="showNextSignUpPage">
          <button>下一步</button>
        </div>
        <div class="remark">注册代表同意<span @click.stop="showAgreement">《隐私协议》</span>和<span @click.stop="showAgreement">《使用条款》</span>
        </div>
        <p class="to-login">已有账号？<span @click="showWhat(1)">立即登录>></span></p>
      </div>
    </div>
    <!--手机号/邮箱注册页面-->
    <div class="tel-sign-up-page" v-show="nextSignUpPageDisplay">
      <div class="tab">注册</div>
      <div class="sign-up">
        <sinput
            placeholder="设置密码"
            width="100%"
            name="pw"
            type="password"
            @inputResult="checkInputState(arguments,'signUpPw1')"
            @inputValue="firstInputPwd"
            @submitInfo="submitInfo"
        >
        </sinput>
        <sinput
            placeholder="确认密码"
            width="100%"
            name="pw"
            type="password"
            @inputResult="checkInputState(arguments,'signUpPw2')"
            @inputAnotherValue="secInputPwd"
            @submitInfo="submitInfo"
        >
        </sinput>
        <div class="next-step-button" :class="signUpNextBtn" @click="checkSignUp">
          <button>下一步</button>
        </div>
      </div>
    </div>

    <!--用户协议-->
    <div class="agreement-page" v-if="agreementPageDisplay">
      <div class="go-back" @click="showAgreement">
        <span class="sprite go-back-icon"></span><span>返回</span>
      </div>
      <div class="header">创客贴《用户协议》</div>
      <div class="agreement-contents">
        <p>此协议包含《隐私协议》、《使用条款》、《服务条款》、《免责声明》四部分</p><br/>
        <p class="agreement-title">隐私协议</p>
        <p>欢迎进入创客贴，以下的隐私协议，我们将向您解释我们如何收集、使用、发布、保护关于您的个人信息。</p>
        <p>1、我们将通过以下方式收集您的信息：</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（1）您通过平台直接提供的。我们会因为功能和服务的需要向您获取您的用户名、头像、邮箱等个人信息，或是在您与我们的通信中我们收集您发布的信息。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（2）收到第三方提供的信息。我们会通过第三方获得服务需要的关于您的个人信息，例如您通过社交网络的第三方快速登录或与社交网络进行链接，这些信息是您在第三方平台或社交网络提供的信息以及创客贴的某些信息，这些信息包括但不限于您账户的ID、用户名等资料。这之前会通过您的授权认可，我们将获得您公开的所有信息。您可以通过第三方平台进行隐私设置等操作，如果您断开与创客贴的链接，我们将不再收到您的信息。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（3）分析或分析工具获得。我们会对收集直接进行数据分析或使用第三方分析工具，通过分析来帮助我们检查流量、热点等。这些数据是有您的浏览器或终端发送提供，包括但不限于访问页面数等，我们将会根据数据和分析来改善我们的服务。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（4）Cookie的信息，当您访问创客贴时，我们会发送一个或多个Cookie到您的计算机，以便唯一的标识您的浏览器能够让创客贴帮助您记录信息，方便您能下一次快速登录。Cookie也可以把相关信息传达给我们，介绍您是如果使用服务的，例如浏览的页面等，当然您也可以在浏览器中设置Cookie来拒绝或清除，但如果进行这样操作，可能会某些功能不能很好地实现。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（5）通过日志文件获得。服务器会自动记录某些日志文件的信息，这些日志文件可能包含某些匿名信息，例如使用的网络协议、IP地址、引用页URL、域名等信息。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（6）位置信息。当你通过移动设备使用服务时，我们可以访问、收集、监视或远程存储您的位置信息，这包括您的GPS坐标或有关位置信息。这些位置信息将告送我们您是如何使用服务，并且在后面的服务中我们也将基于位置进行服务。您可以通过终端设置来取消提供位置信息，但是一些功能和服务可能将无法正常工作。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（7）电子邮件，我们会通过电子邮件方式与您进行沟通联系或商业营销宣传推广，我们会对过程中的信息进行收集整理，以便能够改进我们的服务。</p>
        <p>2、我们使用以上信息做以下工作：</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（1）记录您的登录信息，方便您能下一次快速登录</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（2）为您提供个性化的服务</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（3）监控平台，能够根据指标及分析数据，对资源进行合理调配为您更好的服务</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（4）发现并修复技术问题</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（5）获得更好的用户体验和操作体验</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（6）为您提供广告等服务支持</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（7）自动更新平台数据和在您终端上的显示效果。</p>
        <p>3、共享您的个人信息</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;未经您的同意，我们不会出租或出售您在创客贴上的信息给集团公司（包括任何母公司，附属公司及联属公司）以外的第三方，除条款中罗列的特殊情况</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（1）共享资料给第三方合作伙伴。我们可能会与我们的合作伙伴为您提供服务的第三方平台共享您的部分信息，以便他们能够为您服务，我们保证只提供部分需要的信息，并且保证第三方平台同样遵守此隐私协议</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（2）资源提供并发布您的信息。网站上填写的任何信息和内容都是您资源填写并发布到服务上的，这些信息资料是公开可以被查看的，其他用户可以搜索到的。当然您也可以修改内容或隐私设置。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（3）发生控制改变。我们可以购买、出售、转让创客贴（但不限于创客贴提供的）的素材元素，以及用户的名称、电子邮箱、内容或与服务相关的用户资料在控制发生转换或此类交易中。并可以在企业重组过程中给第三方提供信息，当中包括但不只限于合并，收购和出售我们全部或大部分的资产，或在破产的情况下</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（4）必要时分享资料。我们在一下情况下可能会公布或共享你的资料，创客贴有权应政府部门（包括司法及行政部门）的要求，向其提供您在创客贴填写的注册信息和交易记录等必要信息。如您涉嫌侵犯他人知识产权，则创客贴亦有权在初步判断涉嫌侵权行为存在的情况下，向权利人提供您必要的身份信息。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;（5）广告的使用。我们还可以分享某些信息，如您的位置、操作习惯等给广告提供商，为您提供个性化的广告服务，并且广告提供商业可以通过相关技术手段获知您的IP地址、设备标示符等来向您提供服务并统计广告有效性和服务质量等。我们只会给其提供必要的资料，您的账户信息等个人信息我们不予提供，并且他们必须承诺遵守本隐私协议。</p>
        <p>4、如何存储和保护您的资料、数据</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;我们会将收集的您的数据存放在子公司、分支机构、中国境内或世界各服务器提供商处，在过程中我们会处于安全起见可能对您的数据进行复制、备份、传递，我们将根据所在地的数据保护规定和法律，保护您的数据和资料安全。</p>
        <p>5、自主保护您的账号安全性。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;我们将尽最大努力保护、存储您的数据并保证其安全。同时您需要妥善保管好您的账户、密码及电子邮箱等信息，因为我们通过您的账户密码邮箱来验证您的身份从而提供给您服务，您也有可能通过第三方账号进行登录，我们只能进行存储确认，但信息的安全由第三方平台负责维护。</p>
        <p>6、对数据资料进行监控。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;我们将对平台上的数据、素材资源、发布信息进行实时监控，对违反安全、版权等情况下进行处理或采取某些措施及手段。这些将依照平台协议、法律等规定。</p>
        <p>7、发送信息到您的电子邮件。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;我们将通过电子邮件的形式，向您告知您的订单、账户等信息，并且您也可以根据您的需要订阅我们的服务。有任何问题可以联系<a
            href="mailto:service@eyuanku.com">service@chuangkit.com</a></p>
        <p>8、我们会保留您的信息在一段时间中</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;您的用户帐户的终止或注销后，我们可以因为相关统计、审计等需要，保留您的个人信息及资料在一段合理时间里。</p>
        <p>9、联系我们</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;如果你对隐私协议有任何疑问，都可以联系我们。<a
            href="mailto:service@eyuanku.com">service@chuangkit.com</a></p>
        <p>10、更新隐私协议</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;创客贴可以随时对本协议进行更改和补充，所以请用户定期检查本协议的内容。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;更新于：2014年12月11日</p>
        <p class="agreement-title">使用条款</p>
        <p>创客贴是一个线上设计和素材资源销售的平台，用户将自主使用平台内各种素材进行个性化设计，为用户提供了一个，简单、有趣的线上设计制作解决方案。</p>
        <p>一、使用说明</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;1.您应当在使用创客贴服务之前认真阅读全部协议内容。如您对协议有任何疑问，应向创客贴客服咨询。但无论您事实上是否在使用创客贴服务之前认真阅读了本协议内容，只要您使用创客贴服务，则本协议即对您产生约束，届时您不应以未阅读本协议的内容或者未获得创客贴对您问询的解答等理由，主张本协议无效，或要求撤销本协议。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;2.您承诺接受并遵守本协议的约定。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;3.创客贴有权根据需要不时地制订、修改本协议，并以网站公示的方式进行公告，不再单独通知您。变更后的协议和规则一经在网站公布后，立即自动生效。如您不同意相关变更，可以停止使用创客贴服务。您继续使用创客贴服务，即表示您接受经修订的协议和规则。</p>
        <p>二、 注册和账户</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;1.您确认，在您完成注册程序时，您应当是具备完全民事权利能力和完全民事行为能力的自然人、法人或其他组织。若您不具备前述主体资格，则您及您的监护人应承担因此而导致的一切后果，且创客贴有权注销（永久冻结）您的账户，并向您及您的监护人索偿。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;2.在您同意本协议，完成注册程序后，创客贴将向您提供一个账户。您保证您的账户资料是真实、准确和完整的，并及时更新您的资料。如有合理理由怀疑您提供的资料错误、不实、过时或不完整的，创客贴有权向您发出询问或要求改正的通知，并有权直接做出删除相应资料的处理，直至中止、终止对您提供部分或全部创客贴服务。创客贴对此不承担任何责任，您将承担因此产生的任何直接或间接支出。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;3.当您完成注册程序后会拥有自己的账户号码及密码，您需同意创客贴进入您的账户并获得授权的部分。您有责任妥善保管您的账户号码及/或密码(如适用)，您不得发布您的账户资料，或允许他人使用有关的账户资料进入本网站。您同意采取合理措施以防止他人获取您的账户资料，并向创客贴报告任何未经授权的使用，或通知创客贴更新或删除您任何雇员或代理人的使用权。如果您怀疑自己的用户资料被盗用，请立即与我们联系。在获得或未获得您允许的情况下，或在创客贴收到由您发出的未经授权使用通知之前，任何人使用您的账户，并下载图像内容，您有责任全数支付有关费用。不管这些使用是否确实获得您的授权，您确认并同意承担所有因为您的账户被使用而导致的任何损失或后果。此外，您确认并同意对您每一次登录，以及使用或浏览图像内容的过程负责。创客贴有权接受您的用户资料及密码作为您浏览及使用创客贴内容的最终凭证。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;4.创客贴将根据您提供的个人邮箱，不定期发送服务相关的通知或其他消息，如法律规定的任何通知、服务特点的更改、特殊的价格更改等，以通过邮件形式代替交流。</p>
        <p>三、服务条例</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;1.创客贴以任何形式提供的图像、语音、视频及相关资料内容，包括相关的摄影照片、矢量图形、字体、文本、图片说明，或资料信息(以下合称“内容”)，其所有权属于创客贴或其贡献者，并且受中国及国际版权法以及其它知识产权法律法规所保护。创客贴作为网络服务提供者，对非法转载，盗版行为的发生不具备充分的监控能力。但是当版权拥有者提出侵权指控并出示充分的版权证明材料时，请及时发邮件联系我们（<a
            href="mailto:service@eyuanku.com">service@chuangkit.com</a>），我们将尽快处理。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;2.创客贴所提供的素材为免费与收费两部分，创客贴只提供或销售内容使用权，不提供或销售内容版权。另外除了获得本协议或图片使用许可协议(如适用)的明确允许，您不得复印或利用任何方法传送本网站任何部分或任何内容。所有相关的权限只属于创客贴所独有的。为保护创客贴及其贡献者的权利，内容可能附加有形的、无形的或电子水印，此外，除非获得创客贴的书面授权或支付所标明的费用，否则您不可以：</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;a)进行深层连结或使用软件或任何自动装置、技术或系统控制网站，及/或取得或复制内容或相关的资料信息；</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;b)违反本网站的操作限制，或漠视其它用以防止或限制黑客入侵本网站或内容的措施；</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;c)复制，更改，或以类似方法利用本网站或其任何内容；</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;d)探查，检视，或测试本网站或支持本网站的网络的弱点，或搜索本网站的访客资料，或搜寻创客贴客户的个人资料；</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;e)使用任何设备，软件或电脑例行程序去干预本网站的正常运作，或通过本网站进行任何交易。</p>
        <br/>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;针对上传提交给创客贴的内容，不可以：</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;a）可能有危害，损失，身体或精神伤害，精神痛苦，死亡，残疾，毁容，血腥的内容；</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;b）可能给任何人或财产构成危险并造成任何损失或损害的;</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;c）试图通过让儿童接触到不适当的内容损害或利用儿童，要求个人身份的信息，或以其他方式;</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;d）可能构成或促使犯罪或侵权;</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;e）包含了我们认为是非法的，有害的，辱骂性的，种族或种族攻击，诽谤，侵权，侵犯个人隐私或公开权，骚扰，羞辱其他人（公开或其他方式），中伤任何信息或内容，威胁，亵渎，或其他不良行为;</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;f）包含是非法的（包括但不限于内幕信息下的另一方的商业秘密股票法或披露）的任何信息或内容;</p>
        包含了你没有根据任何法律或合约或信托关系提供一个正确的任何信息或内容;
        <p>&nbsp;&nbsp;&nbsp;&nbsp;g）包含您知道是错误的，目前的任何信息或内容。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;2.您使用本网站及其任何内容时应遵守所有适用的法律。创客贴保留全部酌情权利，可于任何时间，以任何理由，在通知或没有通知您的情况下，撤销您浏览、下载以及使用本网站内容和信息的权利。在接到创客贴的通知后，您同意立即停止有关的使用。创客贴还可以基于任何理由，对本网站的内容进行限制或删除处理。您同意在接到创客贴的通知后，立即停止有关内容的使用。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;3.如果您使用了未经授权的内容，已触犯《中华人民共和国著作权法》及其他相关法律法规，创客贴将会依据《中华人民共和国著作权法》及其他相关法律法规，行使所有的权利及方法去追讨损失，包括向非法使用内容的人士，以及使用内容的受益者追讨金钱上的赔偿。创客贴会根据此协议、图片使用许可协议的相关条款及有关法律法规，向未经授权者追讨费用、损失及赔偿。除此之外，创客贴还会保留一切权利，向未经授权使用者收取(而未经授权使用者必须在此同意支付)十（10）倍版权费。
          再者，创客贴或其贡献者有权就非法使用、违反本协议或图片使用许可协议条款向未经授权使用者采取其它法律或索偿行动。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;4.我们尽力确保所提供信息的准确性，然而本网站可能存在技术上或其它方面的错误，以及内容不准确或文字编印上的错误。您应该了解，您的搜索结果可能会包含一些不适当的内容或令人不快的文字。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;5.您应全权负责决定您所使用的内容是否需要取得第三方使用授权，或是否需要获取额外的授权。您不应该只依靠创客贴所提供的资料。如果您并不清楚有关内容是否需要额外的第三方使用授权，您有责任咨询知识产权管理专家或法律顾问的专业意见。</p>
        <p>四、有偿服务</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;1.基于创客贴部分内容为收费项目，因此如果您选择使用本服务的收费项目，表明您同意本服务可能会随时更改收费价格。对于增加新的服务，创客贴可能会额外收费，或者在其决定的时间改变现有服务的收费。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;2.您可以随时注销您的创客贴账户；然而，没有注销退款。在创客贴暂停或终止你的账户或此协议的情况下，您理解并且同意你不会收到退款或换取任何补偿，任何订阅的未使用时间，任何关于本服务的许可或订阅费用，任何你账户的关联素材内容和数据，以及其他。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;3.您在购买创客贴相关服务时，您同意用支付宝、网银支付方式支付所购买的相关服务，交易或其他金融交易活动中所产生的费用，需您自身承担。</p>
        <p>五、关于隐私</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;您理解通过使用这项服务，收集，使用，和披露您的个人身份信息和数据的汇总。</p>
        <p>六、赔偿</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;任何源于或关于 ：</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a）您违反本协议的任何条款、细则或限制；</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b) 在未获得创客贴授权及准许下您使用或修改本网站的任何内容，或把本网站任何内容连结到其它文本或内容；</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c) 您在未获得第三方授权及准许下使用本网站的内容；</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d) 您或您的任何员工、承包商、雇主、代理商、客户、委托人或用户作出不当行为；</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e)
          当您因为在社区页面引用本网站内容而引起任何第三方索赔和要求时。您同意对创客贴及其内容资源，管理人员、董事、雇员、承包商、子公司、合资企业、授权商和被授权商进行赔偿，并保证其免受任何损害，并承担所有索赔(包括但不限于第三方索赔)，赔偿责任、造成的损失(包括惩罚性损害赔偿)、判决、协议、费用及开支，当中包括合理的法律费用及开支。</p>
        <p>七、协议终止</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;此协议一直生效，直至创客贴运用最终决定权终止此协议为止。如果您在违反本协议条款的情况下使用或企图使用本网站或其内容，创客贴可能在通知或不通知您的情况下终止本协议。在没有其它足够的法律措施下，除了终止协议外，创客贴保留应有的权利，包括暂时停止或永久终止您的帐户或密码，并对这些行为执行权利解除令。在本协议被终止或限期届满时，本协议中的各条款仍然有效。</p>
        <p>八、法律适用、管辖与其他</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;1.本协议之效力、解释、变更、执行与争议解决均适用中华人民共和国法律，如无相关法律规定的，则应参照通用国际商业惯例和（或）行业惯例。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;2.如双方就本合同内容或其执行发生任何争议，双方应进行友好协商，并通过书面形式进行约定；协商不成时，任何一方均有权将争议提交中国国际经济贸易仲裁委员会，根据该会届时有效的仲裁程序和规则进行仲裁。仲裁语言为中文。仲裁裁决是终局的,对各方都有约束力。</p>
        <p class="agreement-title">服务条款</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;一次性使用协议适用于创客贴用户，使创客贴用户可以通过一次使用协议，来使用平台上及其他用户上传的图片素材资源。如果你输出一个设计并且设计中带有符合一次使用协议的素材资源，在一次性使用协议下，那么你便默认同意遵守一次使用协议的相关规定。如果您未遵守本条款，可能会导致法律诉讼或终止您的账号。</p>
        <p>一、 协议内容及签署</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;1.您应当在使用创客贴服务之前认真阅读全部协议内容。如您对协议有任何疑问，应向创客贴客服咨询。但无论您事实上是否在使用创客贴服务之前认真阅读了本协议内容，只要您使用创客贴服务，则本协议即对您产生约束，届时您不应以未阅读本协议的内容或者未获得创客贴对您问询的解答等理由，主张本协议无效，或要求撤销本协议。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;2.您承诺接受并遵守本协议的约定。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;3.创客贴有权根据需要不时地制订、修改本协议，并以网站公示的方式进行公告，不再单独通知您。变更后的协议和规则一经在网站公布后，立即自动生效。如您不同意相关变更，可以停止使用创客贴服务。您继续使用创客贴服务，即表示您接受经修订的协议和规则。</p>
        <p>二、协议背景</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;所有服务中的图片素材资源受中国和国际版权法的保护。创客贴和其他素材贡献者拥有所有权利、权益。包括著作权，媒体使用和买卖权。你可以使用创客贴上符合一次性使用许可协议的素材资源，前提是为你使用的素材付费。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;如果你在到期时不能支付或拒付，你的账号将被视为违约。你仍然有使用创客贴进行设计的权利，但你输出或图片下载时视为无效交易的一部分，为保护创客贴及其贡献者的权利，内容可能附加有形的或无形的电子水印，除非所有款项全部偿还。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;在一次使用协议中的图片素材适用与一个单独的创客贴设计，但本授权不包括下载素材源文件或单独使用一个素材在一个设计中，并且不能删除或尝试删除，编辑或尝试编辑素材在您的设计中。当你选择输出你的创客贴设计时，你会被要求支付您素材使用的费用，这是一次使用协议中要求的。如果图片素材为您自己上传的素材，你将不需要再次购买一次性使用许可，并且将不会收取任何额外的许可费。从输出时开始你将有48个小时的时间来修改并重新输出您的设计并且不需要再支付许可费用。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;你理解并且同意创客贴为了谨慎起见而所做的行为：</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;1、我们将监视你的任何一个输出路径、上传到创客贴的文件或服务，会经常对违反一次性使用协议的行为进行处理。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;2、会无限期的保留你输出的设计细节。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;3、会追踪任何滥用你用户名和密码或违反一次性使用协议的行为或用户。因此请保存好你的用户名和密码，任何人使用您的账户，并下载素材，使用了一次性使用协议，您都有责任全数支付有关费用。</p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;4、暂停或终止您的账户，不另行通知您。如果发现或创客贴有证据认为您有违反一次使用协议或是任何滥用你的用户名和密码的行为，我们将终止您的账号，并没收所有已得的付费。</p>
        <p>三、一次使用协议条款</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;受条款和本协议的规定，我们授予您永久的、非独家的、不可转让的全球一次性使用协议来使用图片素材在你的一个创客贴设计中。除了协议中明确指出使用范围，其余您将不可以使用。所有图片素材的其他权利，包括但不限于版权、其他知识产权，有创客贴和贡献者保留视情况而定。</p>
        <p>四、许可使用</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;禁止在以下允许的范围之外使用，以下是允许的使用范围</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;1、邀请、广告或宣传项目，包括打印印刷材料，产品包装，简报，电影或视频演示，广告，目录，宣传册，宣传贺卡和宣传明信片（即不可转售的许可）不得超过2000次</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;2、学校或大学项目</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;3、社交媒体个人资料图片</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;4、装饰背景在个人计算机或手机设备上</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;5、娱乐应用，例如书或输的封面，杂志，报纸，社论，通讯，视频广播和演讲不得超过2000次印刷</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;6、在网上或电子出版物，包括网页或博客，限制最大为480000像素（例如600px x 800px）每个图片文件其中为编辑后，不得为原始图片文件。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;7、出版，海报，或其他复制品供个人的活营销目的，但不能用于再销售。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;8、任何其他使用允许在创客贴给与书面许可后。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;9、如果您创建一个基于图片素材或是衍生的产品，所有权和这些图片媒体应继续属于创客贴或贡献者，赋予你按照本文所述的条款和限制使用这类图片媒体权利。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;所有其他的权利未明确声明的将有创客贴或贡献者保留。</p>
        <p>五、禁止用途</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;你可能用途是上文未明确说明的，为了进一步明确，下面是禁止使用的情况，</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;以下是一次性使用协议禁止使用部分，但是你可以通过免费使用协议或扩展协议来使用，当然需要创客贴对该协议支持以后</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;1、网上图片数据库的检索服务，如复制、转载图片素材或创客贴的设计超过500000次</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;2、安装和使用图片媒体在多个位置或发布设计的副本在网络服务器或Web服务器，以供其他用户使用;</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;3、包括图片素材的所有模板，网页模板，社交网站、文档、项目或其他方式分配或销售给第三方</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;4、使用于相关设计模板转售的应用程序，无论在线与否，包括但不限于网站模板，名片模板、flash模板、电子贺卡模板和宣传册设计模板。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;5、分发许可，转售，出租，出借，转让，赠予或以其他方式转让或分销图片媒体或根据本一次性使用协议授予的权利;</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;6、使用任何素材为商标，设计标志，商品名称，企业名称，服务标志或logo的一部分;</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;7、删除版权，商标或其他所有权从任何地方嵌入图片素材资源或创客贴的设计</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;8、使用图片素材通过创客贴制作色情，淫秽，不道德，侵犯，诽谤或中伤性的图片，或者很可能给他人带来人身或财产上的损失。</p>
        <p>六、免责声明</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;创客贴会努力纠正归类，关键词，说明文字，和命名图片素材资源，但不能保证这些信息的准确性，也同样不能保证所提供的元数据的准确性。</p>
        <p>七、终止</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;此协议一直生效，直至创客贴运用最终决定权终止此协议为止。如果您在违反本协议条款的情况下使用或企图使用本网站或其内容，创客贴可能在通知或不通知您的情况下终止本协议。在没有其它足够的法律措施下，除了终止协议外，创客贴保留应有的权利，包括暂时停止或永久终止您的帐户或密码，并对这些行为执行权利解除令。在本协议被终止或限期届满时，本协议中的各条款仍然有效。</p>
        <p class="agreement-title">免责声明</p>
        <p>1.创客贴和内容是按照其“原状”和“已有方式”提供，创客贴对网站及所提供的内容不作任何形式的保证。您了解并同意因使用本网站内容而出现的风险将由您自行承担。</p>
        <p>
          2.创客贴不会就任何内容，包括产品、服务及软件作出任何承诺。在不与法律抵触的原则下创客贴拒绝对有关内容(包括产品、服务和软件)，包括但不限于内容的准确性、及时性、完整性、时效性、可用性、有效性、非侵权性、安全性、保密性、所有权、有用性、适用性、质量、适销性、特定用途的适用性，作出任何明示或暗示性的保证。此外，创客贴不作任何陈述，担保或保证，证明有关内容(包括产品，服务和软件)符合您的需要，也不能确保内容可以不受干扰，及时提供、并准确、安全地使用，又或不存在任何错误或缺陷。</p>
        <p>
          3.除法律不能豁免的责任外，创客贴或其任何管理人员、董事、雇员、附属公司、继任者、母公司、合资公司、关联机构、代理、承包商、内容提供者、供应商、授权商或被授权商及其各自的管理人员、董事、雇员(以下全部统称“创客贴相关方”)，对您或通过您使用本网站或其内容的第三方，均不会承担任何因为使用或有关使用或无法使用本网站或其内容，包括病毒、未能传送讯息、数据损坏、传输错误，或因使用互联网服务供应商，或因链接到第三方网站和第三方网站内容，而导致的任何损害，包括但不限于利润的损失、机会的损失、间接的、附带的、特殊的、惩罚性的、惩戒性的、严重的、法定的、经济的或必然的损害赔偿。</p>
        <p>
          4.因为任何理由（包括但不限于合同违反、侵权、严重疏忽，或以其它方式），令您可能遭受任何损害或损失，创客贴及创客贴相关方的累计赔偿总额(如适用)，应只限于在损害或损失发生前您向创客贴所支付的金额。在任何情况下，因使用本网站而引致索赔，创客贴最高累计赔偿总额不会超过壹佰元（100元）人民币。</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;更新于：2014年12月11日</p>
      </div>
      <div class="agree-button" @click="showAgreement">
        <button>同意</button>
      </div>
    </div>
  </div>
</template>

<script>
  import sinput from 'components/input/input.vue'
  import config from 'config/global_config'

  export default {
    data() {
      return {
        inviteCode: undefined,
        codeInvalid: false,
        focusVInput: false, // 聚焦邀请码输入框
        vCodeImgUrl: config.APIDOMAIN + '/index/vcode.do?codeNum=' + new Date().getTime(), // 验证码地址
        telSignUp: false, // 是否通过手机号注册
        disablePostSms: true, // 禁用发送短信验证码按钮
        thirdPartyRegShow: true, // 第三方注册页
        signUpFirstDisplay: false, // 注册首页
        agreementPageDisplay: false, // 用户协议页
        nextSignUpPageDisplay: false, // 注册第二页
        getCheckNumCount: 0, // 发送短信验证码后的计时
        nextBtnActive: {
          nextBtnActived: false // 第一页下一步按钮
        },
        signUpNextBtn: {
          signUpNextBtnActived: false // 第二页下一步按钮
        },
        canClickNextButton: true,  // 默认允许点击第一页的下一步按钮
        canClickRegButton: true, // 默认允许点击注册按钮
        vcodeEmpty: false //清空vcode
      }
    },
    props: {
      isAppClick: {
        default: false
      },
      inviteId: {
        default: null
      },
      isLogin: {
        default: false
      }
    },
    beforeMount() {
      this.getInviteCode(this.inviteId);
    },
    watch: {
      getCheckNumCount() {
        if (this.getCheckNumCount == 0) {
          this.disablePostSms = false;
          return;
        }
        setTimeout(() => {
          (this.getCheckNumCount) -= 1;
        }, 1000);
      }
    },
    methods: {
      getInviteCode(val) {
        if (val) {
          this.inviteCode = val;
          this.focusVInput = true;
        } else {
          this.inviteCode = this.$route.query.i || null;
        }
        this.verifyInvitationCode();
      },
      handleInviteCodeBlur() {
        this.focusVInput = false;
        this.verifyInvitationCode();
      },
      verifyInvitationCode() {
        if (this.inviteCode) {
          this.$http.post('/user/verifyInvitationCode', {i: this.inviteCode}).then(res => {
            this.codeInvalid = res.body.code === 0;
          });
        } else {
          this.codeInvalid = false;
        }
      },
      showReg() { // 切换显示手机号/第三方注册页
        this.thirdPartyRegShow = !this.thirdPartyRegShow;
        this.signUpFirstDisplay = !this.signUpFirstDisplay;
      },
      showWhat(val) {
        this.$emit('showWhat', val);
      },
      showAgreement() { // 切换显示用户协议
        this.signUpFirstDisplay = !this.signUpFirstDisplay;
        this.agreementPageDisplay = !this.agreementPageDisplay;
      },
      getCheckNum() { // 发送短信验证码
        let self = this;
        if (!this.inputUsr) return;
        if (!this.inputVcode) return;
        if (this.disablePostSms) return;
        this.disablePostSms = true;
        this.$http.post('/user/validatePhoneAndVcode', {pn: this.inputUsr, vcode: this.inputVcode}).then(res => {
          //  (1：验证成功; -1：手机号格式错误; -2：手机号已被注册; -3：图形验证码错误
          if (res.body.code == 1) {
            self.$http.post('/user/sendSmsValiCode4Reg', {pn: this.inputUsr, vcode: this.inputVcode}).then(res => {
              // 1：发送成功; 0：发送失败；-1：手机号格式错误; -2:图形验证码不匹配;-3:手机号已注册
              let code = res.body.code;
              switch (code) {
                case 1:
                  this.getCheckNumCount = 60;
                  this.$emit('promptShow', {'promptText': '发送成功', 'promptKind': 'success'});
                  break;
                case 0:
                  this.$emit('promptShow', {'promptText': '发送失败', 'promptKind': 'error'});
                  break;
                case -1:
                  this.$emit('promptShow', {'promptText': '手机号格式错误', 'promptKind': 'error'});
                  break;
                case -2:
                  this.$emit('promptShow', {'promptText': '图形验证码不匹配', 'promptKind': 'error'});
                  break;
                case -3:
                  this.$emit('promptShow', {'promptText': '手机号已注册', 'promptKind': 'error'});
                  break;
              }
              if (code != 1) {
                this.getVcode();
              }
            });
          } else if (res.body.code == -1) {
            this.$emit('promptShow', {'promptText': '手机号格式错误', 'promptKind': 'error'});
            this.getVcode();
          } else if (res.body.code == -2) {
            this.$emit('promptShow', {'promptText': '手机号已被注册', 'promptKind': 'error'});
            this.getVcode();
          } else if (res.body.code == -3) {
            this.$emit('promptShow', {'promptText': '图形验证码错误', 'promptKind': 'error'});
            this.getVcode();
          } else {
            this.$emit('promptShow', {'promptText': '两次验证码之间需要间隔60s', 'promptKind': 'error'});
          }
        });
      },
      getVcode() { // 取得验证码
        this.vCodeImgUrl = config.APIDOMAIN + '/index/vcode.do?codeNum=' + new Date().getTime();
        this.vcodeEmpty = !this.vcodeEmpty;
      },
      getInputUsr(val) { // 取得输入的用户名
        this.inputUsr = val;
        let tel = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
        // 根据输入框的数据判断是否是手机号，若是，则显示手机专有验证码框
        this.telSignUp = tel.test(val);
//        this.disablePostSms = !(this.telSignUp && this.getCheckNumCount === 0);
      },
      getInputVcode(val) { // 取得输入的图形验证码
        this.inputVcode = val;
        let str = val + '';
        this.disablePostSms = !(str.length === 4 && this.getCheckNumCount === 0);
      },
      getInputSmsVcode(val) { // 取得输入的短信验证码
        this.smsVcode = val;
      },
      firstInputPwd(val) { // 取得第一个输入的密码并验证
        if (val) {
          this.firstPwd = "";
          this.firstPwd = val;
          this.uniPwd = "";
          this.uniPwd = this.firstPwd === this.secPwd;
          this.inputState();
        }
      },
      secInputPwd(val) { // 取得第二个输入的密码并验证
        if (val) {
          this.secPwd = "";
          this.secPwd = val;
          this.uniPwd = "";
          this.uniPwd = this.firstPwd === this.secPwd;
          this.inputState();
        }
      },
      checkInputState(result, val) { // 检查输入状态
        let state = result[0];

        switch (val) {
          case 'signUpUsr':
            this.signUpUsrFilled = state !== "error";
            break;
          case 'signUpYzm':
            this.signUpYzmFilled = state === "success";
            break;
          case 'telSignUpYzm':
            this.telSignUpYzmFilled = state === "success";
            break;
          case 'signUpPw1':
            this.signUpPwd1Filled = state === "success";
            break;
          case 'signUpPw2':
            this.signUpPwd2Filled = state === "success";
            break;
        }

        this.inputState();
      },
      inputState() {
        if (this.telSignUp) {
          this.nextBtnActive.nextBtnActived = this.signUpUsrFilled && this.signUpYzmFilled && this.telSignUpYzmFilled;
        } else {
          // 若用户名和验证码均符合要求，点亮下一步按钮
          this.nextBtnActive.nextBtnActived = this.signUpUsrFilled && this.signUpYzmFilled;
        }
        if (!this.nextSignUpPageDisplay) return;
        // 若两个密码均已填入
        this.pwdAreOk = this.signUpPwd1Filled && this.signUpPwd2Filled;
        this.signUpNextBtn.signUpNextBtnActived = this.pwdAreOk;
      },
      submitInfo() {
        if (this.signUpFirstDisplay) {
          this.showNextSignUpPage();
        }
        if (this.nextSignUpPageDisplay) {
          this.checkSignUp();
        }
      },
      showNextSignUpPage() {
        let inputUsr = this.inputUsr,
            inputVcode = this.inputVcode,
            inputSmsVcode = this.smsVcode;
        if (!this.canClickNextButton) return; // 按钮禁用则不执行下方代码

        if (this.telSignUp) { // 如果是手机号注册
          if (this.nextBtnActive.nextBtnActived) { // 如果按钮点亮（输入框内容都符合要求）
            this.canClickNextButton = false; // 禁用按钮
            this.$http.post('/user/validateSmsCode4Reg', {pn: inputUsr, vcode: inputSmsVcode}).then(response => {
              this.canClickNextButton = true; // 请求成功则启用按钮
              let result = response.body.code;
              switch (result) {
                case 1:
                  this.nextSignUpPageDisplay = true;
                  this.signUpFirstDisplay = false;
                  break;
                case -1:
                  this.$emit('promptShow', {'promptText': '手机号格式不正确', 'promptKind': 'error'});
                  break;
                case -2:
                  this.$emit('promptShow', {'promptText': '短信验证码不正确', 'promptKind': 'error'});
                  break;
                case -3:
                  this.$emit('promptShow', {'promptText': '短信验证码错误', 'promptKind': 'error'});
                  break;
              }
              if (result != 1) {
                this.getVcode();
              }
            });
          }
        }
        if (!this.telSignUp) { // 如果是邮箱注册
          if (this.nextBtnActive.nextBtnActived) { // 如果按钮点亮（输入框内容都符合要求）
            this.canClickNextButton = false; // 禁用按钮
            this.$http.post('/user/validateEmailAndVCode', {email: inputUsr, vcode: inputVcode}).then(response => {
              this.canClickNextButton = true; // 请求成功则启用按钮
              let result = response.body.code;

              switch (result) {
                case 1:
                  this.nextSignUpPageDisplay = true;
                  this.signUpFirstDisplay = false;
                  break;
                case -1:
                  this.$emit('promptShow', {'promptText': '邮箱格式错误', 'promptKind': 'error'});
                  break;
                case -3:
                  this.$emit('promptShow', {'promptText': '图形验证码错误', 'promptKind': 'error'});
                  break;
                case -4:
                  this.$emit('promptShow', {'promptText': '邮箱已被注册', 'promptKind': 'error'});
                  break;
              }
            });
          }
        }
      },
      checkSignUp() { // 发送注册请求
        if (!this.uniPwd) {
          this.$emit('promptShow', {'promptText': '两次输入密码不相同', 'promptKind': 'error'});
          return;
        }
        if (!this.signUpNextBtn.signUpNextBtnActived) return; // 密码不符合要求
        if (!this.canClickRegButton) return; // 按钮禁用则不执行下方代码
        this.canClickRegButton = false; // 禁用按钮
        let usr = this.inputUsr,
            vcode = this.inputVcode,
            smsVcode = this.smsVcode,
            pwd = this.secPwd;

        if (this.telSignUp) { // 手机号注册
          let data = {
            pn: usr,
            vcode: smsVcode,
            password: pwd
          };
          if (this.inviteCode) {
            data.i = this.inviteCode
          }
          this.$http.post('/user/regWithPhone', data).then(response => {
            this.canClickRegButton = true; // 请求成功则启用按钮
            let signUpResult = response.body.code,
                userInfo = response.body.userInfo;

            switch (signUpResult) {
              case 1:
                this.nextSignUpPageDisplay = false;
                this.$emit('promptShow', {'promptText': '注册成功', 'promptKind': 'success'});
                this.$emit('setUserInfo', userInfo);
                if (this.isPopup) {
                  this.showWhat(false);
                } else {
                  this.$router.push('/regsuccess');
                }
                break;
              case -2:
                this.$emit('promptShow', {'promptText': '短信验证码不正确', 'promptKind': 'error'});
                break;
              case -3:
                this.$emit('promptShow', {'promptText': '注册失败', 'promptKind': 'error'});
                break;
              case -4:
                this.$emit('promptShow', {'promptText': '自动登录失败', 'promptKind': 'error'});
                break;
            }
          }, response => {
            console.log('error');
          });
        }
        if (!this.telSignUp) { // 邮箱注册
          let mailData = {
            email: usr,
            vcode: vcode,
            password: pwd
          };
          if (this.inviteCode) {
            mailData.i = this.inviteCode
          }
          this.$http.post('/user/regWithEmail', mailData).then(response => {
            this.canClickRegButton = true; // 请求成功则启用按钮
            let signUpResult = response.body.code,
                userInfo = response.body.userInfo;
            switch (signUpResult) {
              case 1:
                this.$emit('promptShow', {'promptText': '注册成功', 'promptKind': 'success'});
                this.$emit('setUserInfo', userInfo);
                if (this.isPopup) {
                  this.showWhat(false);
                } else {
                  this.$router.push('/regsuccess');
                }
                break;
              case -1:
                this.$emit('promptShow', {'promptText': '邮箱格式不正确', 'promptKind': 'error'});
                break;
              case -2:
                this.$emit('promptShow', {'promptText': '密码格式不正确', 'promptKind': 'error'});
                break;
              case -3:
                this.$emit('promptShow', {'promptText': '图形验证码不正确', 'promptKind': 'error'});
                break;
              case -5:
                this.$emit('promptShow', {'promptText': '注册失败', 'promptKind': 'error'});
                break;
              case -6:
                this.$emit('promptShow', {'promptText': '自动登录失败', 'promptKind': 'error'});
                break;
            }
          });
        }
      },
      // 第三方登录
      weiboLogin() {
        let frame = window.open("about:blank", "_blank", "height=600,width=600,top=0,left=0," +
            "toolbar=no,menubar=no,scrollbars=no, location=no, status=no");

        this.$http.post('/login/webSinaLogin', {i: this.inviteCode}).then(response => {
          frame.location = response.body.url;
        }, response => {
          console.log('error');
        });
      },
      wechatLogin() {
        let frame = window.open("about:blank", "_blank", "height=600,width=600,top=0,left=0," +
            "toolbar=no,menubar=no,scrollbars=no, location=no, status=no");

        this.$http.post('/login/webWxLogin', {i: this.inviteCode}).then(response => {
          frame.location = response.body.url;
        }, response => {
          console.log('error');
        });
      },
      qqLogin() {
        let frame = window.open("about:blank", "_blank", "height=600,width=600,top=0,left=0," +
            "toolbar=no,menubar=no,scrollbars=no, location=no, status=no");

        this.$http.post('/login/webQQLogin', {i: this.inviteCode}).then(response => {
          frame.location = response.body.url;
        }, response => {
          console.log('error');
        });
      }
    },
    components: {sinput}
  }
</script>

<style lang="less" scoped>
  @import "signUp.less";
</style>
