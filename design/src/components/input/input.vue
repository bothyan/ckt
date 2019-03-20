<template>
  <div
          class="inputs-container"
          :class="{'input-error':isError,'focusing':isFocus}"
          :name="name"
          :style="boxStyle"
  >
    <slot></slot>
    <input
            :type="type"
            :placeholder="placeholder"
            :style="returnWidth"
            :maxlength="maxlength"
            :autofocus="autofocus"
            :value="currentValue"
            @input="handleInput"
            @focus="isFocus=true"
            @blur="isFocus=false"
            @keydown.tab="showAssInput=false"
            @keyup.enter="submitInfo"
            @keyup.down.up="selectAss"
            v-if="type == 'text'"
    />
    <input
            :type="type"
            :placeholder="placeholder"
            :style="returnWidth"
            :maxlength="maxlength"
            :autofocus="autofocus"
            :value="currentValue"
            @input="handleInput"
            @focus="isFocus=true"
            @blur="isFocus=false"
            v-else-if="type == 'textarea'"
    />
    <input
            :type="type"
            :placeholder="placeholder"
            :style="returnWidth"
            :maxlength="maxlength"
            :autofocus="autofocus"
            :value="currentValue"
            @input="handleInput"
            @focus="isFocus=true"
            @blur="isFocus=false"
            @keyup.enter="submitInfo"
            v-else-if="type == 'password'"
    />
    <br>
    <span class="warning" v-if="!isFocus">{{ msg }}</span>
    <div class="associative-input" :class="{displayAssInput:showAssInput}" :style="boxStyle" v-if="name=='usr'||'mail'">
      <ul>
        <li v-for="(item, index) in displayEmails" @click="contrlAssInput(item)" :class="{active:choseItem==index}">
          {{item}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import checkInput from './checkInput'; // 对输入的内容进行检查
  import allEmails from './allEmails' // 邮箱库

  export default {
    name: 'ChuangkitInput',
    props: {
      boxWidth: {
        type: [String, Number],
        default: 0
      },
      maxlength: {
        type: [String, Number]
      },
      value: {
        type: [String, Number],
        default: ''
      },
      name: {
        type: String
      },
      paddingLeft: {
        type: [String, Number],
        default: 0
      },
      placeholder: {
        type: String,
        default: ''
      },
      type: {
        validator (value) {
          return oneOf(value, ['text', 'textarea', 'password']);
        },
        default: 'text'
      },
      width: {
        type: [String, Number],
        default: 350
      },
      isAppClick: {
        default: false
      },
      emptyValue: {
        default: false
      },
      autofocus: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        choseItem: -1, // 联想输入选择的值
        showAssInput: false, // 默认隐藏联想提示
        msg: "",
        isError: false,
        boxStyle: {
          width: "350px"
        },
        currentValue: this.value,
        isFocus: false,
        displayEmails: [] // 显示的联想项
      }
    },
    watch: {
      isAppClick() {
        if (this.showAssInput) {
          this.showAssInput = false; // 隐藏
        }
      },
      // 清空当前value值
      emptyValue() {
        this.currentValue = '';
      }
    },
    beforeMount: function () {
      this.boxStyle = this.boxWidth == 0 ? this.returnWidth : {
        width: this.boxWidth + "px",
        paddingLeft: this.paddingLeft ? this.paddingLeft + 'px' : "0"
      }
    },
    computed: {
      returnWidth(){
        let str = this.width + '';
        if (str.indexOf('%') !== -1) {
          return {
            'width': this.width
          }
        } else {
          return {
            'width': this.width + "px"
          }
        }
      }
    },
    methods: {
      handleInput(event) {
        let value = event.target.value;
        this.setCurrentValue(value);
        this.checkTest(event);
      },
      setCurrentValue(value) {
        if (value === this.currentValue) return;
        this.currentValue = value;
      },
      selectAss(ev){
        if (this.showAssInput) {
          if (ev.code == 'ArrowDown') { // 按下方向键
            this.choseItem++;
            if (this.choseItem > this.displayEmails.length - 1) {
              this.choseItem = 0;
            }
          } else { // 按上方向键
            this.choseItem--;
            if (this.choseItem < 0) {
              this.choseItem = this.displayEmails.length - 1;
            }
          }
        }
      },
      assInput: function (value) {
        if (value == '') this.showAssInput = false;
        let string = /@/;
        let tempAssInput = [];
        this.emails = allEmails; //邮箱库
        if (string.test(value)) { // 如果输入了@
          this.showAssInput = true; // 显示联想
          this.choseItem = 0; // 默认选择第一个联想项
          this.userInput = value.split('@')[0]; // 前缀
          let domain = value.split('@')[1]; // 域名
          let reg = new RegExp(domain);
          for (let i = 0; i < this.emails.length; i++) {
            if (reg.test(this.emails[i].domainName)) {
              tempAssInput.push(this.emails[i]);
            }
          }
          this.displayEmails = [];
          for (let i = 0; i < tempAssInput.length; i++) {
            this.displayEmails[i] = this.userInput + tempAssInput[i].domainName;
          }
          //若用户输入的域名与已有域名全部匹配则隐藏联想提示框
          let fullDomain = '@' + domain;
          let fullReg = new RegExp("^" + fullDomain + "$", "gim");
          for (let i = 0; i < this.emails.length; i++) {
            if (fullReg.test(this.emails[i].domainName)) {
              this.showAssInput = false; // 隐藏联想
            }
          }
        } else { // 如果没有输入@
          for (let j = 0; j < this.emails.length; j++) {
            this.displayEmails[j] = value + this.emails[j].domainName;
          }
        }
      },
      contrlAssInput(item){
        this.currentValue = item;
        this.checkTest(item);
        this.showAssInput = false;
      },
      checkTest: function (event) {
        let result, value;
        if (typeof event === 'string') {
          value = event;
        } else if (typeof event === 'object') { // 防止拼音输入法下按回车后控制台报错
          value = event.target.value;
        }
        this.currentValue = value;
        result = checkInput(this.name, this, value);
        if (this.name == 'usr' || this.name == 'mail') { // 如果是用户名或邮箱类型，显示联想提示
          this.assInput(this.currentValue);
        }
        this.$emit('inputResult', result);
        this.$emit('inputValue', value);
        this.$emit('inputAnotherValue', value);
      },
      submitInfo(){
        if (this.showAssInput) { // 如果显示了邮箱联想
          if (this.choseItem != -1) {
            this.contrlAssInput(this.displayEmails[this.choseItem]);
          }
          this.$emit('submitInfo');
        } else {
          this.$emit('submitInfo');
        }
      }
    }
  }
  // 判断参数是否是其中之一
  function oneOf(value, validList) {
    for (let i = 0; i < validList.length; i++) {
      if (value === validList[i]) {
        return true;
      }
    }
    return false;
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  @import "input.less";
</style>
