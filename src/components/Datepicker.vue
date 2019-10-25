<template>
    <div class="input-group date">
        <input type="text" :id="id" class="form-control" :class="{'is-valid': this.state===true, 'is-invalid': this.state===false}" ref="dp">
        <div class="input-group-append">
            <button type="button" class="btn btn-primary"><i class="fa fa-calendar-alt"></i></button>
        </div>
    </div>
</template>

<script>

export default {
    props: ['value','state','id'],
    watch: {
        value: function(newVal, oldVal) {
            $(this.$el).datepicker('update', newVal);
        }
    },
    mounted() {
        var vm = this;
        $(this.$el).datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true,
            language: 'id',
            weekStart: 1,
            todayHighlight: true
        }).on('changeDate', function(e) {
            vm.$emit('input', vm.$refs.dp.value);
        }).on('keyup', function(e) {
            // check if match (dd-mm-yy)
            var matches = vm.$refs.dp.value.match(/(\d{1,2})-(\d{1,2})-(\d{4})/i);

            if (matches) {
                vm.$emit('input', vm.$refs.dp.value);
            }
        });

        $(this.$el).datepicker('update', this.value);
    },
    destroyed() {
        $(this.$el).datepicker('destroy');
    }
}
</script>