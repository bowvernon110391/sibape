<template>
    <select :multiple="multiple">
        <slot></slot>
    </select>
</template>

<script>
export default {
    props: {
        options: Array,
        value: [String, Number, Array],
        multiple: {
            type: [Boolean, String],
            default: false
        },
        id: String,
        state: Boolean
    },
    mounted () {
        var vm = this
        $(this.$el)
            .select2({ data: this.options })
            .val(this.value)
            .trigger('change')
            .on('change', function (e) {
                // console.log('s2 val:')
                // console.log(this.value)
                // in multiple mode, this is different
                if (vm.multiple) {
                    // console.log('multiple value')
                    // console.log(e)
                    // vm.$emit('input', $(this).val());
                } else {
                    vm.$emit('input', this.value)
                }
            })
            .on('select2:select', function (e) {
                if (vm.multiple) {
                    // set value in here instead
                    // console.log('Process multi select here')
                    // console.log(e);
                    // console.log(vm.value);

                    var val = [...vm.value, e.params.data.id];
                    // add to value
                    vm.$emit('input', val);
                }
            })
            .on('select2:unselect', function (e) {
                if (vm.multiple) {
                    // unset value here instead
                    // console.log('Unset multi select here');
                    // console.log(e);

                    var val = [...vm.value];

                    var idx = val.indexOf(e.params.data.id);
                    if (idx >= 0) {
                        val.splice(idx, 1);
                        vm.$emit('input', val);
                    }
                }
            });
        // sync state on created
        this.syncState(this.state)
    },
    methods: {
        syncState (newVal) {
            var c = $(this.$el).siblings('span').find('.select2-selection')
            console.log('C is :')
            console.log(c)
            $(c).removeClass('is-invalid')
            $(c).removeClass('is-valid')
            if (newVal === true) {
                $(c).addClass('is-valid')
                
            } else if (newVal === false) {
                $(c).addClass('is-invalid')
                
            } 
        }
    },
    watch: {
        value: {
            handler (newVal) {
                // console.log('sel value changed -> ' + newVal);
                $(this.$el)
                    .val(newVal)
                    .trigger('change');
            }
        },
        options: function (opts) {
            $(this.$el).empty().select2({ data: opts })
        },
        state: {
            handler (newVal) {
                this.syncState(newVal)
            },
            immediate: true
        }
    },
    destroyed () {
        $(this.$el).off().select2('destroy');
    }
}
</script>

<style>
.select2-selection.is-invalid {
    border-color: #dc3545 !important;
}

.select2-selection.is-valid {
    border-color: #28a745 !important;
}
</style>