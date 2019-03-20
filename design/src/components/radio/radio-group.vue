<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>
<script>
    import { inArray, findComponentsDownward } from 'common/common';

    const prefixCls = 'ss-radio-group';

    export default {
        name: 'RadioGroup',
        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            size: {
                validator (value) {
                    return inArray(value, ['small', 'large', 'default']);
                }
            },
            type: {
                validator (value) {
                    return inArray(value, ['button']);
                }
            },
            vertical: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                currentValue: this.value,
                childrens: []
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-${this.size}`]: !!this.size,
                        [`ss-radio-${this.size}`]: !!this.size,
                        [`${prefixCls}-${this.type}`]: !!this.type,
                        [`${prefixCls}-vertical`]: this.vertical
                    }
                ];
            }
        },
        mounted () {
            this.updateValue();
        },
        methods: {
            updateValue () {
                const value = this.value;
                this.childrens = findComponentsDownward(this, 'Radio');

                if (this.childrens) {
                    this.childrens.forEach(child => {
                        child.currentValue = value == child.label;
                        child.group = true;
                    });
                }
            },
            change (data) {
                this.currentValue = data.value;
                this.updateValue();
                this.$emit('input', data.value);
                this.$emit('on-change', data.value);
            }
        },
        watch: {
            value () {
                this.updateValue();
            }
        }
    };
</script>

<style lang="less" scoped>
    .ss-radio-group {
        display: inline-block;
        font-size: 12px;
        vertical-align: middle;
    }

    .ss-radio-group-vertical .ss-radio-wrapper {
        display: block;
        height: 30px;
        line-height: 30px;
    }
</style>