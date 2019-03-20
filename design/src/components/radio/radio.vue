<template>
  <label :class="wrapClasses">
        <span :class="radioClasses">
            <span :class="innerClasses"></span>
            <input
                type="radio"
                :class="inputClasses"
                :disabled="disabled"
                :checked="currentValue"
                @change="change">
        </span><slot>{{ label }}</slot>
  </label>
</template>

<script>
  import { findComponentUpward, inArray } from 'common/common';

  const prefixCls = 'ss-radio';

  export default {
    name: 'Radio',
    props: {
      value: {
        type: [String, Number, Boolean],
        default: false
      },
      trueValue: {
        type: [String, Number, Boolean],
        default: true
      },
      falseValue: {
        type: [String, Number, Boolean],
        default: false
      },
      label: {
        type: [String, Number]
      },
      disabled: {
        type: Boolean,
        default: false
      },
      size: {
        validator (value) {
          return inArray(value, ['small', 'large', 'default']);
        }
      }
    },
    data () {
      return {
        currentValue: this.value,
        group: false,
        parent: findComponentUpward(this, 'RadioGroup')
      };
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixCls}-wrapper`,
          {
            [`${prefixCls}-group-item`]: this.group,
            [`${prefixCls}-wrapper-checked`]: this.currentValue,
            [`${prefixCls}-wrapper-disabled`]: this.disabled
          }
        ];
      },
      radioClasses () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-checked`]: this.currentValue,
            [`${prefixCls}-disabled`]: this.disabled
          }
        ];
      },
      innerClasses () {
        return `${prefixCls}-inner`;
      },
      inputClasses () {
        return `${prefixCls}-input`;
      }
    },
    watch: {
      value (val) {
        if (val !== this.trueValue && val !== this.falseValue) {
          throw 'Value should be trueValue or falseValue.';
        }
        this.updateValue();
      }
    },
    methods: {
      change (event) {
        if (this.disabled) {
          return false;
        }
        const checked = event.target.checked;
        this.currentValue = checked;

        let value = checked ? this.trueValue : this.falseValue;

        this.$emit('input', value);
        // 组合使用
        if (this.group && this.label !== undefined) {
          this.parent.change({
            value: this.label,
            checked: this.value
          });
        }
        // 单个使用
        if (!this.group) {
          this.$emit('on-change', value);
        }
      },
      updateValue () {
        this.currentValue = this.value === this.trueValue;
      }
    },
    mounted () {
      if (this.parent) this.group = true;
      if (!this.group) {
        this.updateValue();
      } else {
        this.parent.updateValue();
      }
    }
  }
</script>

<style lang="less" scoped>
  .ss-radio-wrapper {
    font-size: 12px;
    vertical-align: middle;
    display: inline-block;
    position: relative;
    white-space: nowrap;
    margin-right: 8px;
    cursor: pointer;
  }

  .ss-radio-wrapper-disabled {
    cursor: not-allowed;
  }

  .ss-radio {
    display: inline-block;
    white-space: nowrap;
    outline: 0;
    position: relative;
    line-height: 1;
    vertical-align: middle;
    cursor: pointer;
    margin-left: 32px;
    margin-right: 20px;
  }



  .ss-radio-inner {
    display: inline-block;
    width: 22px;
    height: 22px;
    position: relative;
    top: 0;
    left: 0;
    background-color: #fff;
    border: 2px solid #dddee1;
    border-radius: 50%;
    transition: all .2s ease-in-out;
    &:after {
      position: absolute;
      width: 14px;
      height: 14px;
      left: 2px;
      top: 2px;
      border-radius: 14px;
      display: table;
      border-top: 0;
      border-left: 0;
      content: " ";
      background-color: #ECECEC;
      transition: all .2s ease-in-out;
    }
  }

  .ss-radio-input {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    opacity: 0;
    cursor: pointer;
  }

  .ss-radio-checked .ss-radio-inner {
    border-color: #14CAFF;
  }

  .ss-radio-checked .ss-radio-inner:after {
    background-color: #14CAFF;
    transition: all .2s ease-in-out;
  }
</style>