<template>
  <span :class="wrapClasses" @click="toggle"></span>
</template>
<script>
  const prefixCls = 'ss-switch';

  export default {
    name: 'Switch',
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
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        currentValue: this.value
      };
    },
    computed: {
      wrapClasses() {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-checked`]: this.currentValue === this.trueValue,
            [`${prefixCls}-disabled`]: this.disabled
          }
        ];
      }
    },
    methods: {
      toggle() {
        if (this.disabled) {
          return false;
        }

        const checked = this.currentValue === this.trueValue ? this.falseValue : this.trueValue;

        this.currentValue = checked;
        this.$emit('input', checked);
        this.$emit('on-change', checked);
      }
    },
    watch: {
      value(val) {
        if (val !== this.trueValue && val !== this.falseValue) {
          throw 'Value should be trueValue or falseValue.';
        }
        this.currentValue = val;
      }
    }
  };
</script>

<style lang="less" scoped>

  .ss-switch {
    display: inline-block;
    width: 32px;
    height: 18px;
    border-radius: 18px;
    vertical-align: middle;
    background-color: #ECECEC;
    position: relative;
    cursor: pointer;
    user-select: none;
    transition: all .2s ease-in-out;

    &:after {
      content: '';
      width: 14px;
      height: 14px;
      border-radius: 7px;
      background-color: #BFBFBF;
      position: absolute;
      top: 2px;
      left: 2px;
      cursor: pointer;
      transition: left .2s ease-in-out, width .2s ease-in-out;
    }

    &:active:after {
      width: 18px;
    }

    &:focus {
      box-shadow: 0 0 0 2px fade(#2d8cf0, 20%);
      outline: 0;
    }

    &:focus:hover {
      box-shadow: none;
    }

    &-checked {
      background: linear-gradient(to bottom right, #5EA2FF, #00E3FF);

      &:after {
        left: 16px;
        background-color: #fff;
      }
    }

    &-disabled {
      cursor: not-allowed;
      background-color: #f3f3f3;
      border: #f3f3f3 solid 1px;

      &:after {
        left: 1px;
        top: 1px;
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
  }

</style>